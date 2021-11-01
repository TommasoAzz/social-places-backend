const { validatePrimitiveType } = require('../../utils/validate-arguments');
const AddPointOfInterestPoi = require('./add-point-of-interest-poi');

class AddPointOfInterest {
    /**
     * Constructs an add point of interest request body.
     * 
     * @param {string} user Username of the owner of the point of interest.
     * @param {AddPointOfInterestPoi} poi new point of interest data.
     */
    constructor(user, poi) {
        validatePrimitiveType(user, 'string');
        if(!(poi instanceof AddPointOfInterestPoi)) {
            console.error(`Argument poi instantiated with ${poi} is not of type AddPointOfInterestPoi.`);
            throw new TypeError(`Argument poi instantiated with ${poi} is not of type AddPointOfInterestPoi.`);
        }
        
        this.user = user;
        this.poi = poi;
    }
}

module.exports = AddPointOfInterest;