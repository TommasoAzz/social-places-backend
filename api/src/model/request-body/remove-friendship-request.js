const { validatePrimitiveType } = require('../../utils/validate-arguments');

class RemoveFriendshipRequest {
    /**
     * Constructs a friendship removal request body.
     * 
     * @param {string} receiver Receiver of the remove friendship request.
     * @param {string} sender Sender of the remove friendship request.
     */
    constructor(receiver, sender) {
        validatePrimitiveType(receiver, 'string');
        validatePrimitiveType(sender, 'string');
        
        this.receiver = receiver;
        this.sender = sender;
    }
}

module.exports = RemoveFriendshipRequest;