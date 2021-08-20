const AddPointOfInterestPoi = require('./add-point-of-interest-poi');

class AddPointOfInterest {
    /**
     * Constructs an add point of interest request body.
     * 
     * @param {string} user Username of the owner of the point of interest.
     * @param {AddPointOfInterestPoi} poi new point of interest data.
     */
    constructor(user, poi) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        if(!(poi instanceof AddPointOfInterestPoi)) {
            console.error(`Argument ${poi} is not of type AddPointOfInterestPoi`);
            throw TypeError(`Argument ${poi} is not of type AddPointOfInterestPoi`);
        }
        
        this.user = user;
        this.poi = poi;
    }
}

module.exports = AddPointOfInterest;