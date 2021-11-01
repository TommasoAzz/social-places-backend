const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddFriendshipRequest {
    /**
     * Constructs a friendship request body.
     * 
     * @param {string} receiver Receiver of the friendship request.
     * @param {string} sender Sender of the friendship request.
     */
    constructor(receiver, sender) {
        validatePrimitiveType(receiver, 'string');
        validatePrimitiveType(sender, 'string');
        
        this.receiver = receiver;
        this.sender = sender;
    }
}

module.exports = AddFriendshipRequest;