// eslint-disable-next-line no-unused-vars
const Friend = require('../model/friend');
// eslint-disable-next-line no-unused-vars
const PointOfInterest = require('../model/point-of-interest');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');
const RemovePointOfInterest = require('../model/request-body/remove-point-of-interest');

const Persistence = require('../persistence/persistence');
const { validatePrimitiveType } = require('../utils/validate-arguments');

class PointOfInterestService {
    /**
     * Retrieves the point of interests of a user.
     * 
     * @param {string} user user's data.
     * @returns An `Array<PointOfInterest>` of points of interest.
     */
    static async getPOIsOfUser(user) {
        validatePrimitiveType(user, 'string');
        
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
        validatePrimitiveType(user, 'string');
        validatePrimitiveType(friend, 'string');

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
            console.error(`Argument poi instantiated with ${poi} is not of type AddPointOfInterestPoi.`);
            throw new TypeError(`Argument poi instantiated with ${poi} is not of type AddPointOfInterestPoi.`);
        }

        return await Persistence.addPointOfInterest(user, poi);
    }

    /**
     * Removes a point of interest (identified by `removePointOfInterest.markId`) owned by user identified with `removePointOfInterest.user`.
     * 
     * @param {RemovePointOfInterest} removePointOfInterest Request of removal of point of interest.
     */
    static async removePointOfInterest(removePointOfInterest) {
        if(!(removePointOfInterest instanceof RemovePointOfInterest)) {
            console.error(`Argument removePointOfInterest instantiated with ${removePointOfInterest} is not of type RemovePointOfInterest.`);
            throw new TypeError(`Argument removePointOfInterest instantiated with ${removePointOfInterest} is not of type RemovePointOfInterest.`);  
        }


        await Persistence.removePointOfInterest(removePointOfInterest.markId, removePointOfInterest.user);
    }
}

module.exports = PointOfInterestService;