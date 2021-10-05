class RecommendationAccuracy {
    /**
     * Recommendation accuracy of the classifier implemented in the context aware server.
     * 
     * @param {number} accuracy Accuracy in [0,1].
     * @param {number} correct_samples Number of correct samples in the total number of samples in the training dataset.
     */
    constructor(accuracy, correct_samples) {
        if(!(typeof(accuracy) === 'number')) {
            console.error(`Argument ${accuracy} is not a number`);
            throw TypeError(`Argument ${accuracy} is not a number`);
        }
        if(!(typeof(correct_samples) === 'number')) {
            console.error(`Argument ${correct_samples} is not a number`);
            throw TypeError(`Argument ${correct_samples} is not a number`);
        }
        
        this.accuracy = accuracy;
        this.correct_samples = correct_samples;
    }
}

module.exports = RecommendationAccuracy;