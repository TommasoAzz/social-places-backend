class RemoveFriendshipRequest {
    /**
     * Constructs a friendship removal request body.
     * 
     * @param {string} receiver Receiver of the remove friendship request.
     * @param {string} sender Sender of the remove friendship request.
     */
    constructor(receiver, sender) {
        if(!(typeof(receiver) === 'string')) {
            console.error(`Argument ${receiver} is not a string`);
            throw TypeError(`Argument ${receiver} is not a string`);
        }
        if(!(typeof(sender) === 'string')) {
            console.error(`Argument ${sender} is not a string`);
            throw TypeError(`Argument ${sender} is not a string`);
        }
        
        this.receiver = receiver;
        this.sender = sender;
    }
}

module.exports = RemoveFriendshipRequest;