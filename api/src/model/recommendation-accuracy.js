const { validatePrimitiveType } = require('../utils/validate-arguments');

class RecommendationAccuracy {
    /**
     * Recommendation accuracy of the classifier implemented in the context aware server.
     * 
     * @param {number} accuracy Accuracy in [0,1].
     * @param {number} correct_samples Number of correct samples in the total number of samples in the training dataset.
     */
    constructor(accuracy, correct_samples) {
        validatePrimitiveType(accuracy, 'number');
        validatePrimitiveType(correct_samples, 'number');
        
        this.accuracy = accuracy;
        this.correct_samples = correct_samples;
    }
}

module.exports = RecommendationAccuracy;