class AddFriendshipRequest {
    /**
     * Constructs a friendship request body.
     * 
     * @param {string} receiver Receiver of the friendship request.
     * @param {string} sender Sender of the friendship request.
     */
    constructor(receiver, sender) {
        this.receiver = receiver;
        this.sender = sender;
    }
}