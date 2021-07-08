const Friend = require('./friend');
const LiveEvent = require('./live-event');
const Marker = require('./marker');

class User {
    /**
     * Builds a user object retrieved by the data storage.
     * 
     * @param {string} id Identifier
     * @param {Array<Friend>} friends List of friends of the user.
     * @param {Array<LiveEvent>} liveEvents List of live events created by the user.
     * @param {Array<Marker>} markers List of markers created by the user.
     * @param {Array<LiveEvent>} expiredliveEvents List of previously created by the user but already expired.
     */
    constructor(id, friends, liveEvents, markers, expiredliveEvents) {
        this.id = id;
        this.friends = friends;
        this.liveEvents = liveEvents;
        this.markers = markers;
        this.expiredliveEvents = expiredliveEvents;
    }
}

module.exports = User;