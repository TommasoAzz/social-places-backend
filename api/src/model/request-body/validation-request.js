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
        if(!(typeof(seconds_in_day) === 'number')) {
            console.error(`Argument ${seconds_in_day} is not a number`);
            throw TypeError(`Argument ${seconds_in_day} is not a number`);
        }
        if(!(typeof(week_day) === 'number')) {
            console.error(`Argument ${week_day} is not a number`);
            throw TypeError(`Argument ${week_day} is not a number`);
        }
        if(!(typeof(place_category) === 'string')) {
            console.error(`Argument ${place_category} is not a string`);
            throw TypeError(`Argument ${place_category} is not a string`);
        }
        
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