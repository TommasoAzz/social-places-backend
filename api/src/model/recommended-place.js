class RecommendedPlace {
    /**
     * Recommendation returned by the Context Aware APIs.
     * 
     * @param {string} place_category suggested category.
     */
    constructor(place_category) {
        if(!(typeof(place_category) === 'string')) {
            console.error(`Argument ${place_category} is not a string`);
            throw TypeError(`Argument ${place_category} is not a string`);
        }
        
        this.place_category = place_category;
    }
}

module.exports = RecommendedPlace;