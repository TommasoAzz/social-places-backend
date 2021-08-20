const AddPointOfInterestPoi = require('./add-point-of-interest-poi');

class AddPointOfInterest {
    /**
     * Constructs an add point of interest request body.
     * 
     * @param {string} user Username of the owner of the point of interest.
     * @param {AddPointOfInterestPoi} addPointOfInterestPoi new point of interest data.
     */
    constructor(user, addPointOfInterestPoi) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        if(!(addPointOfInterestPoi instanceof AddPointOfInterestPoi)) {
            console.error(`Argument ${addPointOfInterestPoi} is not of type AddPointOfInterestPoi`);
            throw TypeError(`Argument ${addPointOfInterestPoi} is not of type AddPointOfInterestPoi`);
        }
        
        this.user = user;
        this.addPointOfInterestPoi = addPointOfInterestPoi;
    }
}

module.exports = AddPointOfInterest;