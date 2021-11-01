const { validatePrimitiveType } = require('../utils/validate-arguments');
// eslint-disable-next-line no-unused-vars
const AddLiveEvent = require('./request-body/add-live-event');

class LiveEvent {
    /**
     * Constructs a live event information object.
     * 
     * @param {string} id Identifier.
     * @param {string} address Address in which the event takes place.
     * @param {number} latitude Latitude of the place.
     * @param {number} longitude Longitude of the place.
     * @param {string} name A descriptive name for the event.
     * @param {string} owner Username of the user that created the event.
     * @param {number} expirationDate Expiration date in seconds
     */
    constructor(id, address, latitude, longitude, name, owner, expirationDate) {
        validatePrimitiveType(id, 'string');
        validatePrimitiveType(address, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(owner, 'string');
        validatePrimitiveType(expirationDate, 'number');

        this.id = id;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.owner = owner;
        this.expirationDate = expirationDate;
    }

    /**
     * Constructs a live event information object from an instance of `AddLiveEvent`.
     * Field expirationDate
     * 
     * @param {AddLiveEvent} addLiveEvent
     * @returns an instance of this class.
     */
    static fromLiveEvent(addLiveEvent) {
        const currentDate = Math.floor(Date.now() / 1000); // It's in seconds.
        const expiresAfter = addLiveEvent.expiresAfter; // addLiveEvent.expiresAfter is in seconds
        return new LiveEvent(
            '',
            addLiveEvent.address,
            addLiveEvent.latitude,
            addLiveEvent.longitude,
            addLiveEvent.name,
            addLiveEvent.owner,
            currentDate + expiresAfter,
        );
    }

    /**
     * Return a plain JavaScript object representation of the object, without field `id`.
     * 
     * @returns a plain JavaScript object representation of the object, without field `id`.
     */
    toJsObject() {
        return {
            address: this.address,
            latitude: this.latitude,
            longitude: this.longitude,
            name: this.name,
            owner: this.owner,
            expirationDate: this.expirationDate
        };
    }
}

module.exports = LiveEvent;