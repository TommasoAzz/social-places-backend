const superagent = require('superagent');
// eslint-disable-next-line no-unused-vars
const ValidationRequest = require('../model/request-body/validation-request');
// eslint-disable-next-line no-unused-vars
const RecommendationRequest = require('../model/request-body/recommendation-request');
const RecommendationAccuracy = require('../model/recommendation-accuracy');
const RecommendedPlace = require('../model/recommended-place');

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
     * 
     * @param {ValidationRequest} validationRequest 
     * @returns 
     */
    static async shouldAdvisePlaceCategory(validationRequest) {
        try{
            const validity_result = await superagent.get(this._api_url + 'validity').query(validationRequest);

            const body = validity_result.body;

            return body;
        } catch(error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }
    
    static async recommendPlaceCategory(query) {
        try{
            const places_result = await superagent.get(this._api_url + 'places').query(query);

            const body = places_result.body;

            return new RecommendedPlace(body.place_category);
        } catch(error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * Asks for the current model accuracy.
     * 
     * @returns a `RecommendationAccuracy` instance.
     */
    static async computeModelAccuracy() {
        try{
            const accuracy_result = await superagent.get(this._api_url + 'accuracy');

            const body = accuracy_result.body;

            return new RecommendationAccuracy(body.accuracy, body.correct_samples);
        } catch(error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }
    }

    /**
     * 
     * @param {RecommendationRequest} recommendationRequest 
     * @returns 
     */
    static async trainAgainModel(recommendationRequest) {
        try{
            this._api_url =  "http://localhost:4000/recommendation/";
            console.log(this._api_url)

            //const train_result = await superagent.post(this._api_url + 'train').send(recommendationRequest);
            const train_result = await superagent.post('http://localhost:4000/recommendation/train').send(recommendationRequest);

            const body = train_result.body;

            return new RecommendationAccuracy(body.accuracy, body.correct_samples);
        } catch(error) {
            console.error('The HTTP call to the context aware APIs returned the following error:' + error);

            return null;
        }   
    }
}

module.exports = RecommendationService;