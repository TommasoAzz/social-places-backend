// @ts-nocheck
const superagent = require('superagent');
// eslint-disable-next-line no-unused-vars
const ValidationRequest = require('../model/request-body/validation-request');
// eslint-disable-next-line no-unused-vars
const RecommendationRequest = require('../model/request-body/recommendation-request');
const RecommendationAccuracy = require('../model/recommendation-accuracy');
const RecommendedPlace = require('../model/recommended-place');
const Persistence = require('../persistence/persistence');
const geolib = require('geolib');

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
     * @param {RecommendationRequest} recommendationRequest (latitude, longitude, human_activity, seconds_in_day, week_day)
     * @returns {Promise<RecommendedPlace>} the recommended place category if data is correct, `null` otherwise.
     */
    static async recommendPlaceCategory(recommendationRequest) {
        try {
            const response = await superagent.get(this._api_url + 'places').query(recommendationRequest);

            const body = response.body;
            const recommendedPlace = new RecommendedPlace(body.place_category);
            console.log('preticted activity');
            console.log(body.place_category);

            const suggestPointOfInterest = await getSuggestedPoiFromFriend(recommendedPlace,recommendationRequest);
            console.log(suggestPointOfInterest);

            if(suggestPointOfInterest !== null){
                console.log(suggestPointOfInterest.name);
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

/**
      * 
      * @param {RecommendedPlace} recommendedPlace contains place_category to be notified
      * @param {RecommendationRequest} recommendationRequest name of user that made the request
      * @param {number} latitude of user that made the request
      * @param {number} longitude of user that made the request

      * @returns {PointOfInterest}
*/
async function getSuggestedPoiFromFriend(recommendedPlace,recommendationRequest){
    const user = recommendationRequest.user;
    await Persistence.checkUser(user);
    //anche user poi
    const friendList = await Persistence.getFriends(user);
    /**
     * @type Array<PointOfInterest>
     */
    let poisList = [];

    for(const friend of friendList){
        let friendPoint = await Persistence.getPOIsOfUser(friend.friendUsername);
        poisList = poisList.concat(friendPoint);
    }
    poisList = poisList.concat(await Persistence.getPOIsOfUser(user));


    let lat_lon_mapped = poisList.map((poi,_,__) => {
        return {latitude:poi.latitude,longitude:poi.longitude};
    });
    const userPosition = { latitude: recommendationRequest.latitude, longitude: recommendationRequest.longitude };

    let nearest = geolib.findNearest(userPosition,lat_lon_mapped);

    const distance = geolib.getDistance(userPosition,nearest);

    let poi = null;
    if(distance < 3000){
        const index = lat_lon_mapped.indexOf(nearest);
        poi = poisList[index];
    }
    return poi;


    // let minDistance = Distance('3 km'); // Equator in km
    // console.log('minDistance');
    // console.log(minDistance);

    // /**
    //  * @type PointOfInterest
    //  */
    // let resPoi = null;
    // for(const poi of poisList){

    //     if(poi.type.toLowerCase() == recommendedPlace.place_category){
    //         const lat = poi.latitude;
    //         const lon = poi.longitude;
    //         let newDistance = checkDistance(latitude,longitude,lat,lon);
    //         console.log(newDistance);
    //         if(newDistance < minDistance){
    //             console.log('New min distance');
    //             console.log(poi);
    //             minDistance = newDistance;
    //             resPoi = poi;
    //         }
    //     }
    // }    
    // return resPoi;
}

/**
 * 
 * @param {number} userLatitude 
 * @param {number} userLongitude 
 * @param {number} poiLatitude 
 * @param {number} poiLongitude     
 * 
 */
function checkDistance(userLatitude,userLongitude,poiLatitude,poiLongitude){
    var userPos = {
        lat: userLatitude,
        lon: userLongitude
    };

    var poiPos = {
        lat: poiLatitude,
        lon: poiLongitude
    };

    var distanceBetweenPos = Distance.between(userPos, poiPos);
    return distanceBetweenPos;
}

module.exports = RecommendationService;