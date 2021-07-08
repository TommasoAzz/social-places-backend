class Friend {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} friendUsername Username of the friend.
     */
    constructor(friendUsername) {
        if(!(typeof(friendUsername) === 'string')) {
            console.error(`Argument ${friendUsername} is not a string`);
            throw TypeError(`Argument ${friendUsername} is not a string`);
        }
        
        this.friendUsername = friendUsername;
    }
}

module.exports = Friend;