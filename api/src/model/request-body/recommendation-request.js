class RecommendationRequest {
    /**
     * Constructs a recommendation request body.
     * 
     * @param {string} user The user requesting the recommendation.
     * @param {number} latitude Latitude where the user is sending the request from.
     * @param {number} longitude Longitude where the user is sending the request from.
     * @param {string} human_activity Recognized human activity.
     * @param {number} date_time Date time when the request is sent.
     */
    constructor(user, latitude, longitude, human_activity, date_time) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        if(!(typeof(latitude) === 'number')) {
            console.error(`Argument ${latitude} is not a number`);
            throw TypeError(`Argument ${latitude} is not a number`);
        }
        if(!(typeof(longitude) === 'number')) {
            console.error(`Argument ${longitude} is not a number`);
            throw TypeError(`Argument ${longitude} is not a number`);
        }
        if(!(typeof(human_activity) === 'string')) {
            console.error(`Argument ${human_activity} is not a string`);
            throw TypeError(`Argument ${human_activity} is not a string`);
        }
        if(!(typeof(date_time) === 'number')) {
            console.error(`Argument ${date_time} is not a number`);
            throw TypeError(`Argument ${date_time} is not a number`);
        }
        
        this.user = user;
        this.latitude = latitude;
        this.longitude = longitude;
        this.human_activity = human_activity;
        this.date_time = date_time;
    }
}

module.exports = RecommendationRequest;