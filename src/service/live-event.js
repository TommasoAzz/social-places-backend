const LiveEvent = require('../model/live-event');
const AddLiveEvent = require('../model/request-body/add-live-event');

const UserPersistence = require('../persistence/user-persistence');

class LiveEventService {
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