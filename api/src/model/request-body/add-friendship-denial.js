class AddFriendshipDenial {
    /**
     * Constructs a friendship denial request body.
     * 
     * @param {string} receiverOfTheFriendshipRequest Receiver of the friendship request therefore the person which **denies** it.
     * @param {string} senderOfTheFriendshipRequest Sender of the friendship request therefore the person which doesn't **receive** the friendship.
     */
    constructor(receiverOfTheFriendshipRequest, senderOfTheFriendshipRequest) {
        if(!(typeof(receiverOfTheFriendshipRequest) === 'string')) {
            console.error(`Argument ${receiverOfTheFriendshipRequest} is not a string`);
            throw TypeError(`Argument ${receiverOfTheFriendshipRequest} is not a string`);
        }
        if(!(typeof(senderOfTheFriendshipRequest) === 'string')) {
            console.error(`Argument ${senderOfTheFriendshipRequest} is not a string`);
            throw TypeError(`Argument ${senderOfTheFriendshipRequest} is not a string`);
        }

        this.receiverOfTheFriendshipRequest = receiverOfTheFriendshipRequest;
        this.senderOfTheFriendshipRequest = senderOfTheFriendshipRequest;
    }
}

module.exports = AddFriendshipDenial;