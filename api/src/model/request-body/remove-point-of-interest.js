const { validatePrimitiveType } = require('../../utils/validate-arguments');

class RemovePointOfInterest {
    /**
     * Constructs a point of interest removal request body.
     * 
     * @param {string} user Sender of the remove point of interest request.
     * @param {string} markId Identifier of the point of interest to remove.
     */
    constructor(user, markId) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(markId, 'string');
        
        this.user = user;
        this.markId = markId;
    }
}

module.exports = RemovePointOfInterest;