class FriendRequest {
    /**
     * Constructs a friend request.
     * 
     * @param {string} origin Username of the user sending the request.
     */
    constructor(origin) {
        if(!(typeof(origin) === 'string')) {
            console.error(`Argument ${origin} is not a string`);
            throw TypeError(`Argument ${origin} is not a string`);
        }
        
        this.origin = origin;
    }
}

module.exports = FriendRequest;