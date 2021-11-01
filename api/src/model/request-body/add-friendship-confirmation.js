const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddFriendshipConfirmation {
    /**
     * Constructs a friendship confirmation request body.
     * 
     * @param {string} receiverOfTheFriendshipRequest Receiver of the friendship request therefore the person which **confirms** it.
     * @param {string} senderOfTheFriendshipRequest Sender of the friendship request therefore the person which **receives** the confirmation.
     */
    constructor(receiverOfTheFriendshipRequest, senderOfTheFriendshipRequest) {
        validatePrimitiveType(receiverOfTheFriendshipRequest, 'string');
        validatePrimitiveType(senderOfTheFriendshipRequest, 'string');

        this.receiverOfTheFriendshipRequest = receiverOfTheFriendshipRequest;
        this.senderOfTheFriendshipRequest = senderOfTheFriendshipRequest;
    }
}

module.exports = AddFriendshipConfirmation;