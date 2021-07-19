/* eslint-disable no-unused-vars */
const FirebaseFirestore = require('firebase-admin').firestore;
const Friend = require('../model/friend');
const User = require('../model/user');
const LiveEvent = require('../model/live-event');
const Marker = require('../model/marker');
const FriendRequest = require('../model/friend-request');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');

class UserPersistence {
    /**
     * @type {FirebaseFirestore.Firestore}
     */
    static _connection;

    /**
     * The Firestore document corrisponding to the user list.
     * @type {string}
     * @readonly
     */
    static _usersDoc = 'user';

    /**
     * The Firestore document corrisponding to the friend list of a user.
     * @type {string}
     * @readonly
     */
    static _friendsDoc = 'friend';

    /**
     * The Firestore document corrisponding to the friend requests list of a user.
     * @type {string}
     * @readonly
     */
    static _friendRequestsDoc = 'friendrequest';

    /**
     * The Firestore document corrisponding to the live events list of a user.
     * @type {string}
     * @readonly
     */
    static _liveEventsDoc = 'live';
    
    /**
     * The Firestore document corrisponding to the point of interests list of a user.
     * @type {string}
     * @readonly
     */
    static _poisDoc = 'marker';

    /**
     * The Firestore document corrisponding to the expired live events list of a user.
     * @type {string}
     * @readonly
     */
    static _expiredLiveEventsDoc = 'timedLiveExpired';

    /**
     * Sets the connection to the Firestore instance.
     * @param {FirebaseFirestore.Firestore} firestoreConnection the connection already established with Firestore.
     */
    static set connection(firestoreConnection) {
        this._connection = firestoreConnection;
    }

    /**
     * Retrieves all user records available on Firestore.
     *
     * @returns all user records (`Array<User>`) available on Firestore.
     */
    static async getAllUsers() {
        const users = await this._connection.collection(this._usersDoc).get();
        let returnedUsers = [];
        const documents = users.docs; 
        for(let i = 0; i < documents.length; i++) {
            if(!documents[i].exists) {
                continue;
            }

            returnedUsers.push(await this.getUser(documents[i].id));
        }
    }

    /**
     * Retrieves a single user record.
     * 
     * @param {string} userId Identifier of the user of which data needs to be retrieved.
     * @returns instance of `User` with the collected data.
     */
    static async getUser(userId) {
        const friends = await this._connection.collection(`${this._usersDoc}/${userId}/${this._friendsDoc}`).get();
        const liveEvents = await this._connection.collection(`${this._usersDoc}/${userId}/${this._liveEventsDoc}`).get();
        const pointsOfInterest = await this._connection.collection(`${this._usersDoc}/${userId}/${this._poisDoc}`).get();
        const expiredLiveEvents = await this._connection.collection(`${this._usersDoc}/${userId}/${this._expiredLiveEventsDoc}`).get();
        const friendRequests = await this._connection.collection(`${this._usersDoc}/${userId}/${this._friendRequestsDoc}`).get();

        return new User(
            userId,
            friends.empty ? [] : friends.docs.map(friendFromFirestore),
            liveEvents.empty ? [] : liveEvents.docs.map(liveEventFromFirestore),
            pointsOfInterest.empty ? [] : pointsOfInterest.docs.map(markerFromFirestore),
            expiredLiveEvents.empty ? [] : expiredLiveEvents.docs.map(liveEventFromFirestore), 
            friendRequests.empty ? [] : friendRequests.docs.map(friendRequestFromFirestore)
        );
    }

    /**
     * Sends a friendship request from `sender` to `receiver`.
     * 
     * @param {string} sender Sender of the friendship request.
     * @param {string} receiver Receiver of the friendship request.
     */
    static async addFriendRequest(sender, receiver) {
        const friendRequestReference = await this._connection.collection(`${this._usersDoc}/${receiver}/${this._friendRequestsDoc}`).add({
            origin: sender
        });

        console.info(`Sent friend request from ${sender} to ${receiver}, identifier: ${friendRequestReference.id}.`);
    }

    /**
     * Adds `friendToAdd` to the list of friends of `user`.
     * 
     * @param {string} user username of the user in which `friendToAdd` will be added to.
     * @param {string} friendToAdd new friend to add.
     */
    static async addFriend(user, friendToAdd) {
        const friendRequestReference = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).add({
            friend: friendToAdd
        });

        console.info(`Confirmed friend request from ${friendToAdd} to ${user} (now they are friend), identifier: ${friendRequestReference.id}.`);
    }

    /**
     * Removes `friendToRemove` from the list of friends of `user`.
     * 
     * @param {string} user username of the user in which `friendToRemove` will be removed from.
     * @param {string} friendToRemove friend to remove.
     */
    static async removeFriend(user, friendToRemove) {
        const friendsOfUser = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).where('friend', '==', friendToRemove).get();
        if(friendsOfUser.empty) {
            console.error(`${friendToRemove} is not friend of ${user} therefore no removal happened.`);
        }

        const friendIdentifier = friendsOfUser.docs[0].id;
        await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).doc(friendIdentifier).delete();

        console.info(`Confirmed friend removal from ${user} of ${friendToRemove} (now they are not friend anymore).`);
    }

    /**
     * Adds a new live event in the list of live events of the live event's owner.
     * 
     * @param {LiveEvent} liveEvent Live event data.
     */
    static async addLiveEvent(liveEvent) {
        const liveEventReference = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._liveEventsDoc}`).add(liveEvent.toJsObject());
        
        console.info(`Added live event for user ${liveEvent.owner}, identifier: ${liveEventReference.id}.`);
    }

    /**
     * Returns the list of friends of `user`.
     * 
     * @param {string} user User of which the list of friends must be returned.
     * @returns A list of `Friend` instances.
     */
    static async getFriends(user) {
        const friends = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).get();
        
        return friends.docs.map(friendFromFirestore);
    }

    static async getLiveEvents(user) {
        const liveEvents = await this._connection.collection(`${this._usersDoc}/${user}/${this._liveEventsDoc}`).get();

        return liveEvents.docs.map(liveEventFromFirestore);
    }

    /**
     * Returns the points of interest of the user given as argument.
     * 
     * @param {string} username Username.
     * @returns An `Array<Marker>` of markers.
     */
    static async getPOIsOfUser(username) {
        const pois = await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).get();
        
        return pois.docs.map(markerFromFirestore);
    }

    /**
     * Adds a new point of interest in the list of points of interest of the user.
     * 
     * @param {string} user User which owns this point of interest.
     * @param {AddPointOfInterest} poi Live event data.
     */
    static async addPointOfInterest(user, poi) {
        const liveEventReference = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).add(poi.toJsObject());
            
        console.info(`Added point of interest ${poi} for user ${user}, identifier: ${liveEventReference.id}.`);
    }
}

module.exports = UserPersistence;

/**
 * Converts data of a friend to an instance of class `Friend`.
 * 
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} document the data from Firestore.
 * @returns a `Friend` instance with data retrieved from `document`
 */
function friendFromFirestore(document, _, __) {
    if(!document.exists) {
        return null;
    }

    return new Friend(document.id, document.data().friend);
}

/**
 * Converts data of a live event to an instance of class `LiveEvent`.
 * 
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} document the data from Firestore.
 * @returns a `LiveEvent` instance with data retrieved from `document`
 */
function liveEventFromFirestore(document, _, __) {
    if(!document.exists) {
        return null;
    }

    return new LiveEvent(
        document.id,
        document.data().addr,
        document.data().name,
        document.data().owner,
        parseInt(document.data().timer)
    );
}


/**
 * Converts data of a marker to an instance of class `Marker`.
 * 
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} document the data from Firestore.
 * @returns a `Marker` instance with data retrieved from `document`
 */
function markerFromFirestore(document, _, __) {
    if(!document.exists) {
        return null;
    }

    return new Marker(
        document.id,
        document.data().addr,
        document.data().cont,
        parseFloat(document.data().lat),
        parseFloat(document.data().lon),
        document.data().name,
        document.data().phone,
        document.data().type,
        document.data().url
    );
}

/**
 * Converts data of a friend request to an instance of class `FriendRequest`.
 * 
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} document the data from Firestore.
 * @returns a `FriendRequest` instance with data retrieved from `document`
 */
function friendRequestFromFirestore(document, _, __) {
    if(!document.exists) {
        return null;
    }

    return new FriendRequest(document.data().origin);
}