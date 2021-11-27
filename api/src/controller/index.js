const friends = require('./friends');
const {liveEvents, cleanExpiredLiveEvents} = require('./live-events');
const pointsOfInterest = require('./points-of-interest');
const {recommendation, setRecommendationPrivateKey, cleanExpiredRecommendedPoi} = require('./recommendation');

const notification = require('./notification');

const index = {
    friends,
    liveEvents,
    pointsOfInterest,
    recommendation,
    setRecommendationPrivateKey,
    notification,
    cleanExpiredLiveEvents,
    cleanExpiredRecommendedPoi
};

module.exports = index;