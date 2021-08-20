// eslint-disable-next-line no-unused-vars
const Friend = require('../model/friend');
// eslint-disable-next-line no-unused-vars
const PointOfInterest = require('../model/point-of-interest');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');
const RemovePointOfInterest = require('../model/request-body/remove-point-of-interest');

const Persistence = require('../persistence/persistence');

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
        
        return await Persistence.getPOIsOfUser(user);
    }

    /**
     * Retrieves the point of interests of a user which is their friend.
     * Previously check if `user` and `friend` are friends.
     * 
     * @param {string} user user's username.
     * @param {string} friend user's friend username
     * @returns An `Array<PointOfInterest>` of points of interest.
     */
    static async getPOIsOfFriend(user, friend) {
        if(!(typeof(user) === 'string')) {
            console.error(`Argument ${user} is not of type string`);
            throw TypeError(`Argument ${user} is not of type string`);
        }
        if(!(typeof(friend) === 'string')) {
            console.error(`Argument ${friend} is not of type string`);
            throw TypeError(`Argument ${friend} is not of type string`);
        }

        const friendsOfFriend = await Persistence.getFriends(friend);
        if(!friendsOfFriend.map((f) => f.friendUsername).includes(user)) {
            return null;
        }
        
        return (await Persistence.getPOIsOfUser(friend)).filter((poi) => poi.visibility.toLowerCase() == 'public');
    }

    /**
     * Adds `poi` to the list of points of interest of `user`.
     * 
     * @param {string} user User asking to update their list of points of interest.
     * @param {AddPointOfInterestPoi} poi Point of interest to add.
     * @returns the point of interest's id if added, `null` if the user has already a point of interest in their list with the same name or address.
     */
    static async addPointOfInterest(user, poi) {
        if(!(poi instanceof AddPointOfInterestPoi)) {
            console.error(`Argument ${poi} is not of type AddPointOfInterest`);
            throw TypeError(`Argument ${poi} is not of type AddPointOfInterest`);  
        }

        return await Persistence.addPointOfInterest(user, poi);
    }

    /**
     * Removes a point of interest (identified by `removePointOfInterest.poiId`) owned by user identified with `removePointOfInterest.user`.
     * 
     * @param {RemovePointOfInterest} removePointOfInterest Request of removal of point of interest.
     */
    static async removePointOfInterest(removePointOfInterest) {
        if(!(removePointOfInterest instanceof RemovePointOfInterest)) {
            console.error(`Argument ${removePointOfInterest} is not of type RemovePointOfInterest`);
            throw TypeError(`Argument ${removePointOfInterest} is not of type RemovePointOfInterest`);  
        }


        await Persistence.removePointOfInterest(removePointOfInterest.poiId, removePointOfInterest.user);
    }
}

module.exports = PointOfInterestService;