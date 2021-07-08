const AddLiveEvent = require('../model/add-live-event');

class LiveEvents {
    /**
     * Publishes a new live event.
     * 
     * @param {AddLiveEvent} liveEvent the new live event.
     */
    static addLiveEvent(liveEvent) {
        if(!(typeof(liveEvent) === AddLiveEvent)) {
            console.error(`Argument ${liveEvent} is not of type AddLiveEvent`);
            throw TypeError(`Argument ${liveEvent} is not of type AddLiveEvent`);
        }
        // Restante codice
    }
}

module.exports = LiveEvents;