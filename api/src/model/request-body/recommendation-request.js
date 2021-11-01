const { validatePrimitiveType } = require('../../utils/validate-arguments');

class RecommendationRequest {
    /**
     * Constructs a recommendation request body.
     * 
     * @param {string} user The user requesting the recommendation.
     * @param {number} latitude Latitude where the user is sending the request from.
     * @param {number} longitude Longitude where the user is sending the request from.
     * @param {string} human_activity Recognized human activity.
     * @param {number} seconds_in_day Hours in seconds + minutes in seconds + seconds.
     * @param {number} week_day Day of the week (0-6 --> monday-sunday).
     */
    constructor(user, latitude, longitude, human_activity, seconds_in_day, week_day) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(human_activity, 'string');
        validatePrimitiveType(seconds_in_day, 'number');
        validatePrimitiveType(week_day, 'number');
        
        this.user = user;
        this.latitude = latitude;
        this.longitude = longitude;
        this.human_activity = human_activity;
        this.seconds_in_day = seconds_in_day;
        this.week_day = week_day;
    }
}

module.exports = RecommendationRequest;