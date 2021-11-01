const { validatePrimitiveType } = require('../utils/validate-arguments');

class Friend {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} id Identifier.
     * @param {string} friendUsername Username of the friend.
     */
    constructor(id, friendUsername) {
        validatePrimitiveType(id, 'string');
        validatePrimitiveType(friendUsername, 'string');
        
        this.id = id;
        this.friendUsername = friendUsername;
    }
}

module.exports = Friend;