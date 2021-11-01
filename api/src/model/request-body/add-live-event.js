const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddLiveEvent {
    /**
     * Constructs a live event creation request body.
     * 
     * @param {number} expiresAfter Seconds after which the event expires.
     * @param {string} owner Username of the person which adds the event to the system.
     * @param {string} name Name of the event.
     * @param {string} address Address in which the event takes place.
     * @param {number} latitude Latitude of the place.
     * @param {number} longitude Longitude of the place.
     */
    constructor(expiresAfter, owner, name, address, latitude, longitude) {
        validatePrimitiveType(address, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(owner, 'string');
        validatePrimitiveType(expiresAfter, 'number');

        this.expiresAfter = expiresAfter;
        this.owner = owner;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
}

module.exports = AddLiveEvent;