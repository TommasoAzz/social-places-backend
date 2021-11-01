const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddFriendshipDenial {
    /**
     * Constructs a friendship denial request body.
     * 
     * @param {string} receiverOfTheFriendshipRequest Receiver of the friendship request therefore the person which **denies** it.
     * @param {string} senderOfTheFriendshipRequest Sender of the friendship request therefore the person which doesn't **receive** the friendship.
     */
    constructor(receiverOfTheFriendshipRequest, senderOfTheFriendshipRequest) {
        validatePrimitiveType(receiverOfTheFriendshipRequest, 'string');
        validatePrimitiveType(senderOfTheFriendshipRequest, 'string');

        this.receiverOfTheFriendshipRequest = receiverOfTheFriendshipRequest;
        this.senderOfTheFriendshipRequest = senderOfTheFriendshipRequest;
    }
}

module.exports = AddFriendshipDenial;