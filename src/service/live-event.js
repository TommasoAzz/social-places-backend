const AddLiveEvent = require('../model/request-body/add-live-event');

const UserPersistence = require('../persistence/user-persistence');

class LiveEventService {
    /**
     * Publishes a new live event.
     * 
     * @param {AddLiveEvent} liveEvent the new live event.
     */
    static async addLiveEvent(liveEvent)  {
        if(!(typeof(liveEvent) === AddLiveEvent)) {
            console.error(`Argument ${liveEvent} is not of type AddLiveEvent`);
            throw TypeError(`Argument ${liveEvent} is not of type AddLiveEvent`);
        }
        
        await UserPersistence.addLiveEvent(liveEvent);
    }
}

module.exports = LiveEventService;