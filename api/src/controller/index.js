const friends = require('./friends');
const {liveEvents, cleanExpiredLiveEvents} = require('./live-events');
const pointsOfInterest = require('./points-of-interest');
const {recommendation, setPrivateKey, cleanExpiredRecommendedPoi} = require('./recommendation');

const userData = require('./user-data');

const index = {
    friends,
    liveEvents,
    pointsOfInterest,
    recommendation,
    setPrivateKey,
    userData,
    cleanExpiredLiveEvents,
    cleanExpiredRecommendedPoi
};

module.exports = index;