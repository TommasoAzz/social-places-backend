class Friendship {
    /**
     * Sends a request for a friendship as indicated in `friendshipRequest`.
     * 
     * @param {AddFriendshipRequest} friendshipRequest the request itself.
     */
    static sendAddFriendshipRequest(friendshipRequest) {
        if(!(typeof(friendshipRequest) === AddFriendshipRequest)) {
            console.error(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRequest} is not of type AddFriendshipRequest`);
        }
        // Resto del codice
    }

    /**
     * Sends a confirmation for a friendship request previously sent by the receiver of this confirmation.
     * 
     * @param {AddFriendshipConfirmation} friendshipConfirmation the confirmation itself.
     */
    static sendAddFriendshipConfirmation(friendshipConfirmation) {
        if(!(typeof(friendshipConfirmation) === AddFriendshipConfirmation)) {
            console.error(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
            throw TypeError(`Argument ${friendshipConfirmation} is not of type AddFriendshipConfirmation`);
        }
        // Resto del codice
    }

    /**
     * Removes a friend by the user's friends list.
     * 
     * @param {RemoveFriendshipRequest} friendshipRemoval 
     */
    static sendRemoveFriendshipRequest(friendshipRemoval) {
        if(!(typeof(friendshipRemoval) === RemoveFriendshipRequest)) {
            console.error(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
            throw TypeError(`Argument ${friendshipRemoval} is not of type RemoveFriendshipRequest`);
        }
        // Resto del codice
    }
}

module.exports = Friendship;