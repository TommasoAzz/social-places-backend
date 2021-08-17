class RemovePointOfInterest {
    /**
     * Constructs a point of interest removal request body.
     * 
     * @param {string} user Sender of the remove point of interest request.
     * @param {string} poiId Identifier of the point of interest to remove.
     */
    constructor(user, poiId) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        if(!(typeof(poiId) === 'string')) {
            console.error(`Argument ${poiId} is not a string`);
            throw TypeError(`Argument ${poiId} is not a string`);
        }
        
        this.user = user;
        this.poiId = poiId;
    }
}

module.exports = RemovePointOfInterest;