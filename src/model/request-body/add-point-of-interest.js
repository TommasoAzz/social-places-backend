class AddPointOfInterest {
    /**
     * Constructs a point of interest creation request body.
     *
     * @param {string} address Address reverse geocoded from latitude and longitude of the place.
     * @param {string} type Description of the place (what is it).
     * @param {number} latitude Latitude of the place.
     * @param {number} longitude Longitude of the place.
     * @param {string} name Name chosen by the user for the point of interest.
     * @param {string} phoneNumber Phone number for the point of interest.
     * @param {string} visibility Visibility of the event.
     * @param {string} url URL linked to the event.
     */
    constructor(address, type, latitude, longitude, name, phoneNumber, visibility, url) {
        if(!(typeof(address) === 'string')) {
            console.error(`Argument ${address} is not a string`);
            throw TypeError(`Argument ${address} is not a string`);
        }
        if(!(typeof(type) === 'string')) {
            console.error(`Argument ${type} is not a string`);
            throw TypeError(`Argument ${type} is not a string`);
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
        if(!(typeof(phoneNumber) === 'string')) {
            console.error(`Argument ${phoneNumber} is not a string`);
            throw TypeError(`Argument ${phoneNumber} is not a string`);
        }
        if(!(typeof(visibility) === 'string')) {
            console.error(`Argument ${visibility} is not a string`);
            throw TypeError(`Argument ${visibility} is not a string`);
        }
        if(!(typeof(url) === 'string')) {
            console.error(`Argument ${url} is not a string`);
            throw TypeError(`Argument ${url} is not a string`);
        }

        this.address = address;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.visibility = visibility;
        this.url = url;
    }

    /**
     * Return a plain JavaScript object representation of the object, with the following mapping:
     * - address -> addr
     * - type -> cont
     * - latitude -> lat
     * - longitude -> lon
     * - name -> name
     * - phoneNumber -> phone
     * - visibility -> type
     * - url -> url
     *
     * @returns a plain JavaScript object representation of the object, without field `id`.
     */
    toJsObject() {
        return {
            address: this.address,
            type: this.type,
            latitude: this.latitude,
            longitude: this.longitude,
            name: this.name,
            phoneNumber: this.phoneNumber,
            visibility: this.visibility,
            url: this.url
        };
    }
}

module.exports = AddPointOfInterest;
