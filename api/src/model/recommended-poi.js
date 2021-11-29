const { validatePrimitiveType } = require('../utils/validate-arguments');
// eslint-disable-next-line no-unused-vars
const AddRecommendedPoi = require('./request-body/add-recommended-poi');

class RecommendedPoi {
    /**
     * Constructs an object that stores the point of interest with `markId` given
     * recommended on date given as argument.
     * 
     * @param {string} id Identifier.
     * @param {string} markId recommended poi Identifier.
     * @param {number} notificatedDate Notification date in seconds
     */
    constructor(id, markId, notificatedDate) {
        validatePrimitiveType(id, 'string');
        validatePrimitiveType(markId, 'string');
        validatePrimitiveType(notificatedDate, 'number');

        this.id = id;
        this.markId = markId;
        this.notificatedDate = notificatedDate;
    }

    /**
     * Constructs a recommended poi information object from an instance of `AddRecommendedPoi`.
     * 
     * @param {AddRecommendedPoi} addRecommendedPoi
     * @returns an instance of this class.
     */
    static fromAddRecommendedPoi(addRecommendedPoi) {
        return new RecommendedPoi(
            '',
            addRecommendedPoi.markId,
            addRecommendedPoi.notificatedDate
        );
    }

    /**
     * Return a plain JavaScript object representation of the object.
     * 
     * @returns a plain JavaScript object representation of the object.
     */
    toJsObject() {
        return {
            id: this.id,
            markId: this.markId,
            notificatedDate: this.notificatedDate,
        };
    }
}

module.exports = RecommendedPoi;