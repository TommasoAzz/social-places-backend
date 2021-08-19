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
     * @param {number} expirationDate Expiration date in ms
     */
    constructor(id, address, latitude, longitude, name, owner, expirationDate) {
        if(!(typeof(id) === 'string')) {
            console.error(`Argument ${id} is not a string`);
            throw TypeError(`Argument ${id} is not a string`);
        }
        if(!(typeof(address) === 'string')) {
            console.error(`Argument ${address} is not a string`);
            throw TypeError(`Argument ${address} is not a string`);
        }
        if(!(typeof(latitude) === 'number')) {
            console.error(`Argument ${latitude} is not a number`);
            throw TypeError(`Argument ${latitude} is not a number`);
        }
        if(!(typeof(longitude) === 'number')) {
            console.error(`Argument ${longitude} is not a number`);
            throw TypeError(`Argument ${longitude} is not a number`);
        }
        if(!(typeof(name) === 'string')) {
            console.error(`Argument ${name} is not a string`);
            throw TypeError(`Argument ${name} is not a string`);
        }
        if(!(typeof(owner) === 'string')) {
            console.error(`Argument ${owner} is not a string`);
            throw TypeError(`Argument ${owner} is not a string`);
        }
        if(!(typeof(expirationDate) === 'number')) {
            console.error(`Argument ${expirationDate} is not a number`);
            throw TypeError(`Argument ${expirationDate} is not a number`);
        }

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
        return new LiveEvent(
            '',
            addLiveEvent.address,
            addLiveEvent.latitude,
            addLiveEvent.longitude,
            addLiveEvent.name,
            addLiveEvent.owner,
            addLiveEvent.expiresAfter + Date.now(),
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