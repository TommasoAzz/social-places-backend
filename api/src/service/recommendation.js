// @ts-nocheck
const superagent = require('superagent');
// eslint-disable-next-line no-unused-vars
const ValidationRequest = require('../model/request-body/validation-request');
// eslint-disable-next-line no-unused-vars
const RecommendationRequest = require('../model/request-body/recommendation-request');
const RecommendationAccuracy = require('../model/recommendation-accuracy');
const RecommendedPlace = require('../model/recommended-place');
const Persistence = require('../persistence/persistence');

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
     * @param {ValidationRequest} validationRequest the request for validation.
     * @returns {Promise<boolean>} `true` if the suggested category for the place is valid, `false` if not valid, `null` otherwise.
     */
    static async shouldAdvisePlaceCategory(validationRequest) {
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
     * @param {*} query (latitude, longitude, human_activity, seconds_in_day, week_day)
     * @returns {Promise<RecommendedPlace>} the recommended place category if data is correct, `null` otherwise.
     */
    static async recommendPlaceCategory(query) {
        try {
            const places_result = await superagent.get(this._api_url + 'places').query(query);

            const body = places_result.body;
            const recommendedPlace = new RecommendedPlace(body.place_category);

            await Persistence.notifyTypePlace(recommendedPlace, query.user);

            return recommendedPlace;
        } catch (error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * Asks for the current model accuracy.
     * 
     * @param {string} user to be notified
     * @returns {Promise<RecommendationAccuracy>}the new accuracy of the model.
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
}

module.exports = RecommendationService;