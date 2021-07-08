class Friend {
    /**
     * Constructs a friend request body.
     * 
     * @param {string} id Identifier.
     * @param {string} friendUsername Username of the friend.
     */
    constructor(id, friendUsername) {
        if(!(typeof(id) === 'string')) {
            console.error(`Argument ${id} is not a string`);
            throw TypeError(`Argument ${id} is not a string`);
        }
        if(!(typeof(friendUsername) === 'string')) {
            console.error(`Argument ${friendUsername} is not a string`);
            throw TypeError(`Argument ${friendUsername} is not a string`);
        }
        
        this.id = id;
        this.friendUsername = friendUsername;
    }
}

module.exports = Friend;