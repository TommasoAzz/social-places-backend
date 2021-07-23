/* eslint-disable no-unused-vars */
const Friend = require('./friend');
const LiveEvent = require('./live-event');
const PointOfInterest = require('./point-of-interest');
const FriendRequest = require('./friend-request');

class User {
    /**
     * Builds a user object retrieved by the data storage.
     * 
     * @param {string} id Identifier
     * @param {Array<Friend>} friends List of friends of the user.
     * @param {Array<LiveEvent>} liveEvents List of live events created by the user.
     * @param {Array<PointOfInterest>} pois List of pois created by the user.
     * @param {Array<LiveEvent>} expiredliveEvents List of previously created by the user but already expired.
     * @param {Array<FriendRequest>} friendRequests List of received friend requests.
     */
    constructor(id, friends, liveEvents, pois, expiredliveEvents, friendRequests) {
        this.id = id;
        this.friends = friends;
        this.liveEvents = liveEvents;
        this.pois = pois;
        this.expiredliveEvents = expiredliveEvents;
        this.friendRequests = friendRequests;
    }
}

module.exports = User;