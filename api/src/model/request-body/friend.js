const { validatePrimitiveType } = require('../../utils/validate-arguments');

class Friend {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} friendUsername Username of the friend.
     */
    constructor(friendUsername) {
        validatePrimitiveType(friendUsername, 'string');
        
        this.friendUsername = friendUsername;
    }
}

module.exports = Friend;