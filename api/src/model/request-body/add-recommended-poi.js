const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddRecommendedPoi {
    /**
     * Constructs a live event creation request body.
     * 
     * @param {string} markId recommended poi Identifier.
     * @param {number} notificatedDate Notification date in seconds
     */
    constructor(markId, notificatedDate) {
        validatePrimitiveType(notificatedDate, 'number');

        this.markId = markId;
        this.notificatedDate = notificatedDate;
    }
}

module.exports = AddRecommendedPoi;