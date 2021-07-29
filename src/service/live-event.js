const LiveEvent = require('../model/live-event');
const AddLiveEvent = require('../model/request-body/add-live-event');

const Persistence = require('../persistence/persistence');

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
        
        
        return (await Persistence.getPersonalLiveEvents(user)).concat(
            await Persistence.getLiveEventsFromFriends(user)
        );
    }
    /**
     * Publishes a new live event.
     * 
     * @param {AddLiveEvent} liveEvent the new live event.
     * @returns `true` if the live event was added, `false` otherwise.
     */
    static async addLiveEvent(liveEvent)  {
        if(!(liveEvent instanceof AddLiveEvent)) {
            console.error(`Argument ${liveEvent} is not of type AddLiveEvent`);
            throw TypeError(`Argument ${liveEvent} is not of type AddLiveEvent`);
        }

        const liveEventToAdd = LiveEvent.fromLiveEvent(liveEvent);
        
        const opResult = await Persistence.addLiveEvent(liveEventToAdd);

        return opResult != null;
    }
}

module.exports = LiveEventService;