const { validatePrimitiveType } = require('../utils/validate-arguments');

class PointOfInterest {
    /**
     * Creates a point of interest of a user.
     * 
     * @param {string} markId  Identifier.
     * @param {string} address Address reverse geocoded from latitude and longitude of the place.
     * @param {string} type Description of the place (what is it).
     * @param {number} latitude Latitude of the place.
     * @param {number} longitude Longitude of the place.
     * @param {string} name Name chosen by the user for the point of interest.
     * @param {string} phoneNumber Phone number for the point of interest.
     * @param {string} visibility Visibility of the event.
     * @param {string} url URL linked to the event.
     */
    constructor(markId, address, type, latitude, longitude, name, phoneNumber, visibility, url) {
        validatePrimitiveType(markId, 'string');
        validatePrimitiveType(address, 'string');
        validatePrimitiveType(type, 'string');
        validatePrimitiveType(latitude, 'number');
        validatePrimitiveType(longitude, 'number');
        validatePrimitiveType(name, 'string');
        validatePrimitiveType(phoneNumber, 'string');
        validatePrimitiveType(visibility, 'string');
        validatePrimitiveType(url, 'string');

        this.markId = markId;
        this.address = address;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.visibility = visibility;
        this.url = url;
    }
    
    toString() {
        return `PointOfInterest(markId: ${this.markId}, address: ${this.address}, type: ${this.type}, latitude: ${this.latitude}, longitude: ${this.longitude}, name: ${this.name}, phoneNumber: ${this.phoneNumber}, visibility: ${this.visibility}, url: ${this.url})`;
    }
}

module.exports = PointOfInterest;