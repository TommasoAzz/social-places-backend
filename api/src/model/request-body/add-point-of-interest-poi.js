const { validatePrimitiveType } = require('../../utils/validate-arguments');

class AddPointOfInterestPoi {
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
        validatePrimitiveType(address, 'string');
        validatePrimitiveType(type, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(phoneNumber, 'string');
        validatePrimitiveType(visibility, 'string');
        validatePrimitiveType(url, 'string');

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

    toString() {
        return `AddPointOfInterestPoi(address: ${this.address}, type: ${this.type}, latitude: ${this.latitude}, longitude: ${this.longitude}, name: ${this.name}, phoneNumber: ${this.phoneNumber}, visibility: ${this.visibility}, url: ${this.url})`;
    }
}

module.exports = AddPointOfInterestPoi;
