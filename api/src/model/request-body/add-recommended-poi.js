const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddRecommendedPoi {
    /**
     * Constructs a live event creation request body.
     * 
     * @param {string} markId recommended poi Identifier.
     * @param {number} notificatedDate Notification date in seconds
     */
    constructor(markId, notificationDate) {
        validatePrimitiveType(notificationDate, 'number');

        this.markId = markId;
        this.notificationDate = notificationDate;
    }
}

module.exports = AddRecommendedPoi;