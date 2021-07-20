/* eslint-disable no-unused-vars */
const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');

const UserPersistence = require('../persistence/user-persistence');

class FriendService {
    /**
     * Gets the list of friends of `user`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @returns a list of `Friend`. 
     */
    static async getFriends(user) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        
        
        return await UserPersistence.getFriends(user);
    }

    /**
     * Sends a request for a friendship as indicated in `friendshipRequest`.
     * 
     * @param {AddFriendshipRequest} friendshipRequest the request itself.
     */
    static async sendAddFriendshipRequest(friendshipRequest) {
        if(!(friendshipRequest instanceof AddFriendshipRequest)) {
            console.error(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
        }

        friendshipRequest.receiver = friendshipRequest.receiver.replace('@gmail.com', '');
        friendshipRequest.sender = friendshipRequest.sender.replace('@gmail.com', '');
        
        const receiver = await UserPersistence.getUser(friendshipRequest.receiver);
        
        // eslint-disable-next-line no-unused-vars
        if(receiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipRequest.sender).length == 0) {
            // No friendship with the receiver user therefore a friend request can be sent.
            await UserPersistence.addFriendRequest(friendshipRequest.sender, friendshipRequest.receiver);
        }
    }

    /**
     * Sends a confirmation for a friendship request previously sent by the receiver of this confirmation.
     * 
     * @param {AddFriendshipConfirmation} friendshipConfirmation the confirmation itself.
     */
    static async sendAddFriendshipConfirmation(friendshipConfirmation) {
        if(!(friendshipConfirmation instanceof AddFriendshipConfirmation)) {
            console.error(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
            throw TypeError(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
        }
        
        // The receiver of the friendship request is the current sender.
        friendshipConfirmation.receiverOfTheFriendshipRequest = friendshipConfirmation.receiverOfTheFriendshipRequest.replace('@gmail.com', '');
        // The sender of the friendship request is the current receiver.
        friendshipConfirmation.senderOfTheFriendshipRequest = friendshipConfirmation.senderOfTheFriendshipRequest.replace('@gmail.com', '');
        
        const currentReceiver = await UserPersistence.getUser(friendshipConfirmation.senderOfTheFriendshipRequest);
        
        // eslint-disable-next-line no-unused-vars
        if(currentReceiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipConfirmation.senderOfTheFriendshipRequest).length == 0) {
            await UserPersistence.addFriend(friendshipConfirmation.receiverOfTheFriendshipRequest, friendshipConfirmation.senderOfTheFriendshipRequest);
            await UserPersistence.addFriend(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
            await UserPersistence.notifyAddedFriend(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
        }
    }

    /**
     * Removes a friend by the user's friends list.
     * 
     * @param {RemoveFriendshipRequest} friendshipRemoval 
     */
    static async sendRemoveFriendshipRequest(friendshipRemoval) {
        if(!(friendshipRemoval instanceof RemoveFriendshipRequest)) {
            console.error(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
        }
        
        friendshipRemoval.receiver = friendshipRemoval.receiver.replace('@gmail.com', '');
        friendshipRemoval.sender = friendshipRemoval.sender.replace('@gmail.com', '');

        await UserPersistence.removeFriend(friendshipRemoval.sender, friendshipRemoval.receiver);
        await UserPersistence.removeFriend(friendshipRemoval.receiver, friendshipRemoval.sender);
    }
}

module.exports = FriendService;