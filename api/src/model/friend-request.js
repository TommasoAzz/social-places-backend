const { validatePrimitiveType } = require('../utils/validate-arguments');

class FriendRequest {
    /**
     * Constructs a friend request.
     * 
     * @param {string} origin Username of the user sending the request.
     */
    constructor(origin) {
        validatePrimitiveType(origin, 'string');
        
        this.origin = origin;
    }
}

module.exports = FriendRequest;