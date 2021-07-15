const Friend = require('../model/request-body/friend');
// eslint-disable-next-line no-unused-vars
const Marker = require('../model/marker');

const UserPersistence = require('../persistence/user-persistence');

class PointOfInterestService {
    /**
     * Retrieves the point of interests of a user.
     * @param {Friend} friend friend's data.
     * @returns An `Array<Marker>` of points of interest.
     */
    static async getPOIsFromFriend(friend) {
        if(!(friend instanceof Friend)) {
            console.error(`Argument ${friend} is not of type Friend`);
            throw TypeError(`Argument ${friend} is not of type Friend`);
        }
        
        return await UserPersistence.getPOIsOfUser(friend.friendUsername);
    }
}

module.exports = PointOfInterestService;