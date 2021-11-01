const superagent = require('superagent');
const geolib = require('geolib');

// eslint-disable-next-line no-unused-vars
const ValidationRequest = require('../model/request-body/validation-request');
// eslint-disable-next-line no-unused-vars
const RecommendationRequest = require('../model/request-body/recommendation-request');
const RecommendationAccuracy = require('../model/recommendation-accuracy');
const RecommendedPlace = require('../model/recommended-place');
const Persistence = require('../persistence/persistence');
// eslint-disable-next-line no-unused-vars
const PointOfInterest = require('../model/point-of-interest');

class RecommendationService {
    /**
     * @type {string}
     */
    static _api_url;

    /**
     * Sets the URL for the Context Aware REST APIs.
     * @param {string} apiUrl 
     */
    static set api_url(apiUrl) {
        this._api_url = apiUrl + 'recommendation/';
    }

    /**
     * Checks whether `validationRequest` is correct.
     * 
     * @param {ValidationRequest} validationRequest the request for validation.
     * @returns {Promise<boolean>} `true` if the suggested category for the place is valid, `false` if not valid, `null` otherwise.
     */
    static async shouldAdvisePlaceCategory(validationRequest) {
        if (!(validationRequest instanceof ValidationRequest)) {
            console.error(`Argument validationRequest instantiated with ${validationRequest} is not of type ValidationRequest.`);
            throw new TypeError(`Argument validationRequest instantiated with ${validationRequest} is not of type ValidationRequest.`);
        }
        try {
            const validity_result = await superagent.get(this._api_url + 'validity').query(validationRequest);

            /**
             * @type number
             */
            const isPlaceValid = validity_result.body.result; // 1 (true) or 0 (false).

            if (isPlaceValid === 1) {
                await Persistence.notifyValidPlace(validationRequest);
            }

            return isPlaceValid === 1;
        } catch (error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * Given data from {query} returns the recommended place category.
     * 
     * @param {RecommendationRequest} recommendationRequest (latitude, longitude, human_activity, seconds_in_day, week_day)
     * @returns {Promise<RecommendedPlace>} the recommended place category if data is correct, `null` otherwise.
     */
    static async recommendPlaceCategory(recommendationRequest) {
        if (!(recommendationRequest instanceof RecommendationRequest)) {
            console.error(`Argument recommendationRequest instantiated with ${recommendationRequest} is not of type RecommendationRequest.`);
            throw new TypeError(`Argument recommendationRequest instantiated with ${recommendationRequest} is not of type RecommendationRequest.`);
        }
        try {
            const response = await superagent.get(this._api_url + 'places').query(recommendationRequest);

            const body = response.body;
            const recommendedPlace = new RecommendedPlace(body.place_category);

            const suggestPointOfInterest = await this.getSuggestedPoiFromFriend(recommendedPlace, recommendationRequest);

            if (suggestPointOfInterest !== null) {
                await Persistence.notifyTypePlace(suggestPointOfInterest, recommendationRequest.user);
            }

            return recommendedPlace;
        } catch (error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }



    /**
     * Asks for the current model accuracy.
     * 
     * @param {string} user to be notified.
     * @returns {Promise<RecommendationAccuracy>} the new accuracy of the model.
     */
    static async computeModelAccuracy(user) {
        try {
            const accuracy_result = await superagent.get(this._api_url + 'accuracy');

            const body = accuracy_result.body;
            const recommendationAccuracy = new RecommendationAccuracy(body.accuracy, body.correct_samples);

            await Persistence.notifyRetrainedModel(recommendationAccuracy, user);

            return recommendationAccuracy;
        } catch (error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * Asks for the current model to be trained again with the new given record `recommendationRequest`.
     * @param {RecommendationRequest} recommendationRequest the new data for the model to be trained.
     * @returns {Promise<RecommendationAccuracy>} the new accuracy of the model.
     */
    static async trainAgainModel(recommendationRequest) {
        try {
            const train_result = await superagent.post(this._api_url + 'train').send(recommendationRequest);

            const body = train_result.body;

            const recommendationAccuracy = new RecommendationAccuracy(body.accuracy, body.correct_samples);

            await Persistence.notifyRetrainedModel(recommendationAccuracy, recommendationRequest.user);

            return recommendationAccuracy;
        } catch (error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * 
     * @param {RecommendedPlace} recommendedPlace contains place_category to be notified
     * @param {RecommendationRequest} recommendationRequest name of user that made the request
     * @returns {Promise<PointOfInterest>}
     */
    static async getSuggestedPoiFromFriend(recommendedPlace, recommendationRequest) {
        const user = recommendationRequest.user;
        await Persistence.checkUser(user);

        // Returns the whole objects of the friends of user.
        const friendList = await Persistence.getFriends(user);
        
        /**
         * @type Array<PointOfInterest>
         */
        let poisList = [];

        // Retrieving the list of points of interest of the friends and of the user.
        for (const friend of friendList) {
            const friendPoint = await Persistence.getPOIsOfUser(friend.friendUsername);
            poisList = poisList.concat(friendPoint);
        }
        poisList = poisList.concat(await Persistence.getPOIsOfUser(user));


        // eslint-disable-next-line no-unused-vars
        const lat_lon_mapped = poisList.map((poi, _, __) => {
            return { latitude: poi.latitude, longitude: poi.longitude };
        });
        const userPosition = { latitude: recommendationRequest.latitude, longitude: recommendationRequest.longitude };

        const nearest = geolib.findNearest(userPosition, lat_lon_mapped);

        const distance = geolib.getDistance(userPosition, nearest);

        let poi = null;
        if (distance < 3000) {
            // @ts-ignore
            const index = lat_lon_mapped.indexOf(nearest);
            poi = poisList[index];
        }
        
        return poi;
    }
}

module.exports = RecommendationService;