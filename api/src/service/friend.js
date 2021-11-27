/* eslint-disable no-unused-vars */
const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');

const Persistence = require('../persistence/persistence');
const AddFriendshipDenial = require('../model/request-body/add-friendship-denial');
const { validatePrimitiveType } = require('../utils/validate-arguments');

class FriendService {
    /**
     * Gets the list of friends of `user`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @returns a list of `Friend`. 
     */
    static async getFriends(user) {
        validatePrimitiveType(user, 'string');
        
        return await Persistence.getFriends(user);
    }

    /**
     * Sends a request for a friendship as indicated in `friendshipRequest`.
     * 
     * @param {AddFriendshipRequest} friendshipRequest the request itself.
     */
    static async sendAddFriendshipRequest(friendshipRequest) {
        if(!(friendshipRequest instanceof AddFriendshipRequest)) {
            console.error(`Argument friendshipRequest instantiated with ${friendshipRequest} is not of type AddFriendshipRequest.`);
            throw new TypeError(`Argument friendshipRequest instantiated with ${friendshipRequest} is not of type AddFriendshipRequest.`);
        }
        
        const receiver = await Persistence.getUser(friendshipRequest.receiver);
        
        // eslint-disable-next-line no-unused-vars
        if(
            receiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipRequest.sender).length == 0 &&
            receiver.friendRequests.filter((otherUser, _, __) => otherUser.origin == friendshipRequest.sender).length == 0    
        ) {
            // No friendship with the receiver user and no friendship request was sent to that same user, hence the request can be sent.
            await Persistence.addFriendRequest(friendshipRequest.sender, friendshipRequest.receiver);
            await Persistence.notifyFriendRequest(friendshipRequest.sender, friendshipRequest.receiver);
        } else {
            throw 'You are either already friends with this person or you have already sent him a friend request.';
        }
    }

    /**
     * Sends a confirmation for a friendship request previously sent by the receiver of this confirmation.
     * 
     * @param {AddFriendshipConfirmation} friendshipConfirmation the confirmation itself.
     */
    static async sendAddFriendshipConfirmation(friendshipConfirmation) {
        if(!(friendshipConfirmation instanceof AddFriendshipConfirmation)) {
            console.error(`Argument friendshipConfirmation instantiated with ${friendshipConfirmation} is not of type AddFriendshipConfirmation.`);
            throw new TypeError(`Argument friendshipConfirmation instantiated with ${friendshipConfirmation} is not of type AddFriendshipConfirmation.`);
        }
        
        const currentReceiver = await Persistence.getUser(friendshipConfirmation.senderOfTheFriendshipRequest);
        
        // eslint-disable-next-line no-unused-vars
        if(currentReceiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipConfirmation.receiverOfTheFriendshipRequest).length == 0) {
            // The receiver of friendship requests add the person who requested it.
            await Persistence.addFriend(friendshipConfirmation.receiverOfTheFriendshipRequest, friendshipConfirmation.senderOfTheFriendshipRequest);
            // The request of the friendship adds the person who received the request.
            await Persistence.addFriend(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
            // The friendship is saved in both users' data. The request that was sent can be removed.
            await Persistence.removeFriendRequest(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
            // The new friend is added to the list of friends added by the sender of the friendship request in order to receive a notification.
            await Persistence.notifyAddedFriend(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
        } else {
            throw 'You are already friends with this person!';
        }
    }

    /**
     * Removes a friend by the user's friends list.
     * 
     * @param {RemoveFriendshipRequest} friendshipRemoval 
     */
    static async sendRemoveFriendshipRequest(friendshipRemoval) {
        if(!(friendshipRemoval instanceof RemoveFriendshipRequest)) {
            console.error(`Argument friendshipRemoval instantiated with ${friendshipRemoval} is not of type RemoveFriendshipRequest.`);
            throw new TypeError(`Argument friendshipRemoval instantiated with ${friendshipRemoval} is not of type RemoveFriendshipRequest.`);
        }
        
        friendshipRemoval.receiver = friendshipRemoval.receiver.split('@')[0];
        friendshipRemoval.sender = friendshipRemoval.sender.split('@')[0];

        await Persistence.removeFriend(friendshipRemoval.sender, friendshipRemoval.receiver);
        await Persistence.removeFriend(friendshipRemoval.receiver, friendshipRemoval.sender);
    }

    /**
     * Deny friendship request
     * 
     * @param {AddFriendshipDenial} friendshipDenial
     */
    static async sendAddFriendshipDenial(friendshipDenial) {
        if(!(friendshipDenial instanceof AddFriendshipDenial)) {
            console.error(`Argument friendshipDenial instantiated with ${friendshipDenial} is not of type AddFriendshipDenial.`);
            throw new TypeError(`Argument friendshipDenial instantiated with ${friendshipDenial} is not of type AddFriendshipDenial.`);
        }
        
        friendshipDenial.receiverOfTheFriendshipRequest = friendshipDenial.receiverOfTheFriendshipRequest.split('@')[0];
        friendshipDenial.senderOfTheFriendshipRequest = friendshipDenial.senderOfTheFriendshipRequest.split('@')[0];
        
        await Persistence.removeFriendRequest(friendshipDenial.senderOfTheFriendshipRequest,friendshipDenial.receiverOfTheFriendshipRequest);
    }
}

module.exports = FriendService;