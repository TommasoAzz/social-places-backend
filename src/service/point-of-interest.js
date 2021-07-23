// eslint-disable-next-line no-unused-vars
const PointOfInterest = require('../model/point-of-interest');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');

const UserPersistence = require('../persistence/user-persistence');

class PointOfInterestService {
    /**
     * Retrieves the point of interests of a user.
     * 
     * @param {string} user user's data.
     * @returns An `Array<PointOfInterest>` of points of interest.
     */
    static async getPOIsOfUser(user) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not of type string`);
            throw TypeError(`Argument ${user} is not of type string`);
        }
        
        return await UserPersistence.getPOIsOfUser(user);
    }

    /**
     * Adds `poi` to the list of points of interest of `user`.
     * 
     * @param {string} user User asking to update their list of points of interest.
     * @param {AddPointOfInterest} poi Point of interest to add.
     */
    static async addPointOfInterest(user, poi) {
        if(!(poi instanceof AddPointOfInterest)) {
            console.error(`Argument ${poi} is not of type AddPointOfInterest`);
            throw TypeError(`Argument ${poi} is not of type AddPointOfInterest`);  
        }

        return await UserPersistence.addPointOfInterest(user, poi);
    }

    /**
     * Removes a point of interest (identified by `poiId`) owned by user identified with `username`.
     * 
     * @param {string} poiId Identifier of the point of interest to remove. 
     * @param {string} username Username of the user owning the point of interest.
     */
    static async removePointOfInterest(poiId, username) {
        if(!(typeof(poiId) === 'string')) {
            console.error(`Argument ${poiId} is not of type string`);
            throw TypeError(`Argument ${poiId} is not of type string`);
        }
        if(!(typeof(username) === 'string')) {
            console.error(`Argument ${username} is not of type string`);
            throw TypeError(`Argument ${username} is not of type string`);
        }

        await UserPersistence.removePointOfInterest(poiId, username);
    }
}

module.exports = PointOfInterestService;