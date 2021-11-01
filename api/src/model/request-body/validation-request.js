const { validatePrimitiveType } = require('../../utils/validate-arguments');

class ValidationRequest {
    /**
     * Constructs a validation request body.
     * For validation is meant "check if place_category has any sense".
     * 
     * @param {string} user The user requesting the recommendation.
     * @param {number} latitude Latitude where the user is sending the request from.
     * @param {number} longitude Longitude where the user is sending the request from.
     * @param {string} human_activity Recognized human activity.
     * @param {number} seconds_in_day Hours in seconds + minutes in seconds + seconds.
     * @param {number} week_day Day of the week (0-6 --> monday-sunday).
     * @param {string} place_category Category that should be advised by the recommendation system.
     */
    constructor(user, latitude, longitude, human_activity, seconds_in_day, week_day, place_category) {
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(human_activity, 'string');
        validatePrimitiveType(seconds_in_day, 'number');
        validatePrimitiveType(week_day, 'number');
        validatePrimitiveType(place_category, 'string');
        
        this.user = user;
        this.latitude = latitude;
        this.longitude = longitude;
        this.human_activity = human_activity;
        this.seconds_in_day = seconds_in_day;
        this.week_day = week_day;
        this.place_category = place_category;
    }
}

module.exports = ValidationRequest;