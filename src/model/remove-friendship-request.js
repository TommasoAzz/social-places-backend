class RemoveFriendshipRequest {
    /**
     * Constructs a friendship removal request body.
     * 
     * @param {string} receiver Receiver of the remove friendship request.
     * @param {string} sender Sender of the remove friendship request.
     */
    constructor(receiver, sender) {
        this.receiver = receiver;
        this.sender = sender;
    }
}