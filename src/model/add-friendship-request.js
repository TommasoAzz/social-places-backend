class AddFriendshipRequest {
    /**
     * Constructs a friendship request body.
     * 
     * @param {string} receiver Receiver of the friendship request.
     * @param {string} sender Sender of the friendship request.
     */
    constructor(receiver, sender) {
        if(!(typeof(receiver) === "string")) {
            console.error(`Argument ${receiver} is not a string`);
            throw TypeError(`Argument ${receiver} is not a string`);
        }
        if(!(typeof(sender) === "string")) {
            console.error(`Argument ${sender} is not a string`);
            throw TypeError(`Argument ${sender} is not a string`);
        }
        
        this.receiver = receiver;
        this.sender = sender;
    }
}