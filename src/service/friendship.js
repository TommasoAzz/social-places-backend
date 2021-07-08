/* eslint-disable no-unused-vars */
const AddFriendshipRequest = require('../model/add-friendship-request');
const AddFriendshipConfirmation = require('../model/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/remove-friendship-request');

const UserPersistence = require('../persistence/user-persistence');

class FriendshipService {
    /**
     * Sends a request for a friendship as indicated in `friendshipRequest`.
     * 
     * @param {AddFriendshipRequest} friendshipRequest the request itself.
     */
    static async sendAddFriendshipRequest(friendshipRequest) {
        if(!(typeof(friendshipRequest) === AddFriendshipRequest)) {
            console.error(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
        }

        friendshipRequest.receiver = friendshipRequest.receiver.replace('@gmail.com', '');
        friendshipRequest.sender = friendshipRequest.sender.replace('@gmail.com', '');
        
        const receiver = await UserPersistence.getUser(friendshipRequest.receiver);
        
        // eslint-disable-next-line no-unused-vars
        if(receiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipRequest.sender).length == 0) {
            await UserPersistence.addFriendRequest(friendshipRequest.sender, friendshipRequest.receiver);
        }
    }

    /**
     * Sends a confirmation for a friendship request previously sent by the receiver of this confirmation.
     * 
     * @param {AddFriendshipConfirmation} friendshipConfirmation the confirmation itself.
     */
    static async sendAddFriendshipConfirmation(friendshipConfirmation) {
        if(!(typeof(friendshipConfirmation) === AddFriendshipConfirmation)) {
            console.error(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
            throw TypeError(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
        }
        
        friendshipConfirmation.receiverOfTheFriendshipRequest = friendshipConfirmation.receiverOfTheFriendshipRequest.replace('@gmail.com', '');
        friendshipConfirmation.senderOfTheFriendshipRequest = friendshipConfirmation.senderOfTheFriendshipRequest.replace('@gmail.com', '');
        
        const receiver = await UserPersistence.getUser(friendshipConfirmation.receiverOfTheFriendshipRequest);
        
        // eslint-disable-next-line no-unused-vars
        if(receiver.friends.filter((friend, _, __) => friend.friendUsername == friendshipConfirmation.sender).length == 0) {
            await UserPersistence.addFriend(friendshipConfirmation.senderOfTheFriendshipRequest, friendshipConfirmation.receiverOfTheFriendshipRequest);
            await UserPersistence.addFriend(friendshipConfirmation.receiverOfTheFriendshipRequest, friendshipConfirmation.senderOfTheFriendshipRequest);
        }
    }

    /**
     * Removes a friend by the user's friends list.
     * 
     * @param {RemoveFriendshipRequest} friendshipRemoval 
     */
    static async sendRemoveFriendshipRequest(friendshipRemoval) {
        if(!(typeof(friendshipRemoval) === RemoveFriendshipRequest)) {
            console.error(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
        }
        
        friendshipRemoval.receiver = friendshipRemoval.receiver.replace('@gmail.com', '');
        friendshipRemoval.sender = friendshipRemoval.sender.replace('@gmail.com', '');

        await UserPersistence.removeFriend(friendshipRemoval.sender, friendshipRemoval.receiver);
        await UserPersistence.removeFriend(friendshipRemoval.receiver, friendshipRemoval.sender);
    }
}

module.exports = FriendshipService;