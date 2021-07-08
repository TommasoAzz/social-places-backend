class AddFriendshipConfirmation {
    /**
     * Constructs a friendship confirmation request body.
     * 
     * @param {string} receiverOfTheFriendshipRequest Receiver of the friendship request therefore the person which **confirms** it.
     * @param {string} senderOfTheFriendshipRequest Sender of the friendship request therefore the person which **receives** the confirmation.
     */
    constructor(receiverOfTheFriendshipRequest, senderOfTheFriendshipRequest) {
        if(!(typeof(receiverOfTheFriendshipRequest) === "string")) {
            console.error(`Argument ${receiverOfTheFriendshipRequest} is not a string`);
            throw TypeError(`Argument ${receiverOfTheFriendshipRequest} is not a string`);
        }
        if(!(typeof(senderOfTheFriendshipRequest) === "string")) {
            console.error(`Argument ${senderOfTheFriendshipRequest} is not a string`);
            throw TypeError(`Argument ${senderOfTheFriendshipRequest} is not a string`);
        }

        this.receiverOfTheFriendshipRequest = receiverOfTheFriendshipRequest;
        this.senderOfTheFriendshipRequest = senderOfTheFriendshipRequest;
    }
}

module.exports = AddFriendshipConfirmation;