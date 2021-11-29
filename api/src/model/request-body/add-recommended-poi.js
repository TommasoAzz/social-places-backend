const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddRecommendedPoi {
    /**
     * Constructs a request body for storing the fact that the point of interest with `markId` given was
     * recommended on date given as argument.
     * 
     * @param {string} markId recommended poi identifier.
     * @param {number} notificatedDate Notification date in seconds
     */
    constructor(markId, notificatedDate) {
        validatePrimitiveType(markId, 'string');
        validatePrimitiveType(notificatedDate, 'number');

        this.markId = markId;
        this.notificatedDate = notificatedDate;
    }
}

module.exports = AddRecommendedPoi;