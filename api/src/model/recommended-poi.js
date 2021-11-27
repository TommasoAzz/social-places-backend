const { validatePrimitiveType } = require('../utils/validate-arguments');
// eslint-disable-next-line no-unused-vars
const AddRecommendedPoi = require('./request-body/add-recommended-poi');

class RecommendedPoi {
    /**
     * Constructs a live event information object.
     * 
     * @param {string} id Identifier.
     * @param {string} markId recommended poi Identifier.
     * @param {number} notificatedDate Notification date in seconds
     */
    constructor(id,markId, notificatedDate) {
        validatePrimitiveType(id, 'string');
        validatePrimitiveType(markId, 'string');
        validatePrimitiveType(notificatedDate, 'number');

        this.id = id;
        this.markId = markId;
        this.notificatedDate = notificatedDate;
    }

    /**
     * Constructs a recommended poi information object from an instance of `AddRecommendedPoi`.
     * Field notificatedDate
     * 
     * @param {AddRecommendedPoi} addRecommendedPoi
     * @returns an instance of this class.
     */
    static fromRecommendedPoi(addRecommendedPoi) {
        return new RecommendedPoi(
            '',
            addRecommendedPoi.markId,
            addRecommendedPoi.notificationDate
        );
    }

    /**
     * Return a plain JavaScript object representation of the object, without field `id`.
     * 
     * @returns a plain JavaScript object representation of the object, without field `id`.
     */
    toJsObject() {
        return {
            id: this.id,
            markId: this.markId,
            notificationDate: this.notificationDate,
        };
    }
}

module.exports = RecommendedPoi;