const LiveEvent = require('../model/live-event');
const AddLiveEvent = require('../model/request-body/add-live-event');

const UserPersistence = require('../persistence/user-persistence');

class LiveEventService {
    /**
     * Gets the list of live events published by `user`.
     * 
     * @param {string} user The user of which the list must be retrieved.
     * @returns a list of `LiveEvent`. 
     */
    static async getLiveEvents(user) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not a string`);
            throw TypeError(`Argument ${user} is not a string`);
        }
        
        
        return await UserPersistence.getLiveEvents(user);
    }
    /**
     * Publishes a new live event.
     * 
     * @param {AddLiveEvent} liveEvent the new live event.
     */
    static async addLiveEvent(liveEvent)  {
        if(!(liveEvent instanceof AddLiveEvent)) {
            console.error(`Argument ${liveEvent} is not of type AddLiveEvent`);
            throw TypeError(`Argument ${liveEvent} is not of type AddLiveEvent`);
        }

        const liveEventToAdd = LiveEvent.fromLiveEvent(liveEvent);
        
        await UserPersistence.addLiveEvent(liveEventToAdd);
    }
}

module.exports = LiveEventService;