const friends = require('./friends');
const {liveEvents, cleanExpiredLiveEvents} = require('./live-events');
const pointsOfInterest = require('./points-of-interest');
const {recommendation, setPrivateKey, cleanExpiredRecommendedPoi} = require('./recommendation');

const notification = require('./notification');

const index = {
    friends,
    liveEvents,
    pointsOfInterest,
    recommendation,
    setPrivateKey,
    notification,
    cleanExpiredLiveEvents,
    cleanExpiredRecommendedPoi
};

module.exports = index;