const { validatePrimitiveType } = require('../utils/validate-arguments');

class RecommendedPlace {
    /**
     * Recommendation returned by the Context Aware APIs.
     * 
     * @param {string} place_category suggested category.
     */
    constructor(place_category) {
        validatePrimitiveType(place_category, 'string');
        
        this.place_category = place_category;
    }
}

module.exports = RecommendedPlace;