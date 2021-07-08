const Friend = require('../model/friend');

class PointOfInterests {
    /**
     * Retrieves the point of interests of a user.
     * @param {Friend} friend friend's data.
     */
    static getPOIsFromFriend(friend) {
        if(!(typeof(friend) === Friend)) {
            console.error(`Argument ${friend} is not of type Friend`);
            throw TypeError(`Argument ${friend} is not of type Friend`);
        }
        // Restante codice
    }
}

module.exports = PointOfInterests;