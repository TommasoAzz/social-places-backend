const friends = require('./friends');
const {liveEvents, cleanExpiredLiveEvents} = require('./live-events');
const pointsOfInterest = require('./points-of-interest');
const recommendation = require('./recommendation');
const notification = require('./notification');

const index = {
    friends,
    liveEvents,
    pointsOfInterest,
    recommendation: recommendation.router,
    setRecommendationPrivateKey: recommendation.setPrivateKey,
    notification,
    cleanExpiredLiveEvents
};

module.exports = index;