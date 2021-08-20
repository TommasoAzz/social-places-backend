/* eslint-disable no-unused-vars */
const FirebaseFirestore = require('firebase-admin').firestore;
const Friend = require('../model/friend');
const User = require('../model/user');
const LiveEvent = require('../model/live-event');
const PointOfInterest = require('../model/point-of-interest');
const FriendRequest = require('../model/friend-request');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');

class Persistence {
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
     * The Firestore document corrisponding to the friendship confirmations received.
     * @type {string}
     * @readonly
     */
    static _notifyFriendshipConfirmationDoc = 'addedfriend';

    /**
     * The Firestore document corrisponding to the live events created by the friends of a user.
     * @type {string}
     * @readonly
     */
    static _liveEventsDoc = 'live';

    /**
     * The Firestore document corrisponding to the live events created by the user.
     * @type {string}
     * @readonly
     */
    static _personalLiveEventsDoc = 'living';
    
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
     * Creates a user document if it does not exist in the persistence manager.
     * 
     * @param {string} user 
     */
    static async createUserIfNotExistent(user) {
        const userDoc = await this._connection.collection(`${this._usersDoc}`).doc(user).get();
        if(!userDoc.exists) {
            console.info(`Creating a new document for user ${user} since it does not exist.`);
            await this._connection.collection(`${this._usersDoc}`).doc(user).set({});
        }
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

        return returnedUsers;
    }

    /**
     * Retrieves a single user record.
     * 
     * @param {string} userId Identifier of the user of which data needs to be retrieved.
     * @returns instance of `User` with the collected data.
     */
    static async getUser(userId) {
        await this.createUserIfNotExistent(userId);

        const friends = await this._connection.collection(`${this._usersDoc}/${userId}/${this._friendsDoc}`).get();
        const liveEvents = await this._connection.collection(`${this._usersDoc}/${userId}/${this._liveEventsDoc}`).get();
        const pointsOfInterest = await this._connection.collection(`${this._usersDoc}/${userId}/${this._poisDoc}`).get();
        const expiredLiveEvents = await this._connection.collection(`${this._usersDoc}/${userId}/${this._expiredLiveEventsDoc}`).get();
        const friendRequests = await this._connection.collection(`${this._usersDoc}/${userId}/${this._friendRequestsDoc}`).get();

        return new User(
            userId,
            friends.empty ? [] : friends.docs.map(friendFromFirestore),
            liveEvents.empty ? [] : liveEvents.docs.map(liveEventFromFirestore),
            pointsOfInterest.empty ? [] : pointsOfInterest.docs.map(pointOfInterestFromFirestore),
            expiredLiveEvents.empty ? [] : expiredLiveEvents.docs.map(liveEventFromFirestore), 
            friendRequests.empty ? [] : friendRequests.docs.map(friendRequestFromFirestore)
        );
    }

    /**
     * Sends a friendship request from `sender` to `receiver`.
     * 
     * @param {string} sender Sender of the friendship request.
     * @param {string} receiver Receiver of the friendship request.
     * @returns The id of the request.
     */
    static async addFriendRequest(sender, receiver) {
        await this.createUserIfNotExistent(receiver);

        const friendRequestReference = await this._connection.collection(`${this._usersDoc}/${receiver}/${this._friendRequestsDoc}`).add({
            origin: sender
        });

        console.info(`Sent friend request from ${sender} to ${receiver}, identifier: ${friendRequestReference.id}.`);

        return friendRequestReference.id;
    }

    /**
     * Removes a friendship request from `sender` to `receiver`.
     * This is not to be confused with `removeFriend(user, friendToRemove)`.
     * 
     * @param {string} sender Sender of the friendship request.
     * @param {string} receiver Receiver of the friendship request.
     */
    static async removeFriendRequest(sender, receiver) {
        await this.createUserIfNotExistent(receiver);

        const friendRequestReference = await this._connection.collection(`${this._usersDoc}/${receiver}/${this._friendRequestsDoc}`).where('origin', '==', sender).get();
        if(friendRequestReference.empty) {
            console.error(`User ${sender} did not send a friendship request to ${receiver}.`);
            return;
        }

        const friendRequestIdentifier = friendRequestReference.docs[0].id;
        await this._connection.collection(`${this._usersDoc}/${receiver}/${this._friendRequestsDoc}`).doc(friendRequestIdentifier).delete();

        console.info(`Removed friend request from ${sender} to ${receiver} (the friend request has been approved), identifier: ${friendRequestIdentifier}.`);
    }

    /**
     * Adds `friendToAdd` to the list of friends of `user`.
     * 
     * @param {string} user username of the user in which `friendToAdd` will be added to.
     * @param {string} friendToAdd new friend to add.
     */
    static async addFriend(user, friendToAdd) {
        await this.createUserIfNotExistent(user);

        const addedFriend = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).add({
            friend: friendToAdd
        });

        console.info(`Confirmed friend request from ${friendToAdd} to ${user} (now they are friend), identifier: ${addedFriend.id}.`);

        return addedFriend.id;
    }

    /**
     * Triggers a friendship confirmation notification for user `senderOfTheFriendshipRequest`.
     * 
     * @param {string} senderOfTheFriendshipRequest User that will receive a notification.
     * @param {string} receiverOfTheFriendshipRequest User that confirmed the friendship request.
     */
    static async notifyAddedFriend(senderOfTheFriendshipRequest, receiverOfTheFriendshipRequest) {
        await this.createUserIfNotExistent(senderOfTheFriendshipRequest);

        const friendshipConfirmationReference = await this._connection.collection(`${this._usersDoc}/${senderOfTheFriendshipRequest}/${this._notifyFriendshipConfirmationDoc}`).add({
            friend: receiverOfTheFriendshipRequest
        });

        console.info(`Notified user ${senderOfTheFriendshipRequest} because ${receiverOfTheFriendshipRequest} confirmed the friendship request, identifier: ${friendshipConfirmationReference.id}.`);
    }

    /**
     * Removes `friendToRemove` from the list of friends of `user`.
     * 
     * @param {string} user username of the user in which `friendToRemove` will be removed from.
     * @param {string} friendToRemove friend to remove.
     */
    static async removeFriend(user, friendToRemove) {
        await this.createUserIfNotExistent(user);

        const friendsOfUser = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).where('friend', '==', friendToRemove).get();
        if(friendsOfUser.empty) {
            console.error(`${friendToRemove} is not friend of ${user} therefore no removal happened.`);
            return;
        }

        const friendIdentifier = friendsOfUser.docs[0].id;
        await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).doc(friendIdentifier).delete();
        const addedFriend = await this._connection.collection(`${this._usersDoc}/${user}/${this._notifyFriendshipConfirmationDoc}`).where('friend', '==', friendToRemove).get();
        if(!addedFriend.empty) {
            const addedFriendIdentifier = addedFriend.docs[0].id;
            await this._connection.collection(`${this._usersDoc}/${user}/${this._notifyFriendshipConfirmationDoc}`).doc(addedFriendIdentifier).delete();
        }

        console.info(`Confirmed friend removal from ${user} of ${friendToRemove} (now they are not friend anymore).`);
    }

    /**
     * Adds a new live event in the list of live events of the live event's owner and in their friends'.
     * 
     * @param {LiveEvent} liveEvent Live event data.
     * @returns the live event id if added, `null` if the user or their friends have already a live event in their list with the same name or address.
     */
    static async addLiveEvent(liveEvent) {
        await this.createUserIfNotExistent(liveEvent.owner);

        // Checking for live events with same name or address.
        const personalDuplicatedName = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._personalLiveEventsDoc}`).where('name', '==', liveEvent.name).get();
        const personalDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._personalLiveEventsDoc}`).where('address', '==', liveEvent.address).get();
        if(!personalDuplicatedName.empty && !personalDuplicatedAddr.empty) {
            return null;
        }

        const friends = await this.getFriends(liveEvent.owner);
        let found = false;
        for(let i = 0, len = friends.length; i < len && !found; i++) {
            const friendDuplicatedName = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._liveEventsDoc}`).where('name', '==', liveEvent.name).get();
            const friendDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._liveEventsDoc}`).where('address', '==', liveEvent.address).get();
            found = !friendDuplicatedName.empty || !friendDuplicatedAddr.empty;
        }
        if(found) {
            return null;
        }

        const personalLiveEventReference = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._personalLiveEventsDoc}`).add(liveEvent.toJsObject());
        friends.forEach(async (friend) => {
            await this._connection.collection(`${this._usersDoc}/${friend.friendUsername}/${this._liveEventsDoc}`).add(liveEvent.toJsObject());
        });
        
        console.info(`Added live event for user ${liveEvent.owner} and in their friends list: ${friends.map(friend => friend.friendUsername)}, identifier: ${personalLiveEventReference.id}.`);

        return personalLiveEventReference.id;
    }

    /**
     * Returns the list of friends of `user`.
     * 
     * @param {string} user User of which the list of friends must be returned.
     * @returns A list of `Friend` instances.
     */
    static async getFriends(user) {
        await this.createUserIfNotExistent(user);

        const friends = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).get();
        
        return friends.docs.map(friendFromFirestore);
    }

    /**
     * Returns all live events published by the user's friends.
     * 
     * @param {string} user User of which the list of friends' live events must be returned.
     * @returns A list of `LiveEvent`.
     */
    static async getLiveEventsFromFriends(user) {
        await this.createUserIfNotExistent(user);

        const liveEvents = await this._connection.collection(`${this._usersDoc}/${user}/${this._liveEventsDoc}`).get();

        return liveEvents.docs.map(liveEventFromFirestore);
    }

    /**
     * Returns all live events published by the user.
     * 
     * @param {string} user User of which the owned live events must be returned.
     * @returns A list of `LiveEvent`.
     */
    static async getPersonalLiveEvents(user) {
        await this.createUserIfNotExistent(user);

        const liveEvents = await this._connection.collection(`${this._usersDoc}/${user}/${this._personalLiveEventsDoc}`).get();

        return liveEvents.docs.map(liveEventFromFirestore);
    }

    /**
     * Returns the points of interest of the user given as argument.
     * 
     * @param {string} username Username.
     * @returns An `Array<PointOfInterest>` of point of interests.
     */
    static async getPOIsOfUser(username) {
        await this.createUserIfNotExistent(username);

        const pois = await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).get();
        
        return pois.docs.map(pointOfInterestFromFirestore);
    }

    /**
     * Adds a new point of interest in the list of points of interest of the user.
     * 
     * @param {string} user User which owns this point of interest.
     * @param {AddPointOfInterestPoi} poi Live event data.
     * @returns the point of interest's id if added, `null` if the user has already a point of interest in their list with the same name or address.
     */
    static async addPointOfInterest(user, poi) {
        await this.createUserIfNotExistent(user);

        // Checking for points of interest with same name or address.
        const personalDuplicatedName = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).where('name', '==', poi.name).get();
        const personalDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).where('address', '==', poi.address).get();
        if(!personalDuplicatedName.empty && !personalDuplicatedAddr.empty) {
            return null;
        }

        const poiReference = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).add(poi.toJsObject());
            
        console.info(`Added point of interest ${poi} for user ${user}, identifier: ${poiReference.id}.`);

        return poiReference.id;
    }

    /**
     * Removes the point of interest with identifier `poiId` from the list of point of interest owned by `username`.
     * 
     * @param {string} poiId Identifier of the point of interest to remove.
     * @param {string} username username of the user in which the point of interest should be found.
     */
    static async removePointOfInterest(poiId, username) {
        await this.createUserIfNotExistent(username);

        const poi = await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).doc(poiId).get();
        if(!poi.exists) {
            console.error(`The point of interest with id=${poiId} does not exist in the list of user ${username}.`);
        }

        await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).doc(poiId).delete();

        console.info(`Confirmed point of interest with id=${poiId} removal from ${username}.`);
    }
}

module.exports = Persistence;

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
        document.data().address,
        document.data().latitude,
        document.data().longitude,
        document.data().name,
        document.data().owner,
        parseInt(document.data().expirationDate)
    );
}


/**
 * Converts data of a point of interest to an instance of class `PointOfInterest`.
 * 
 * @param {FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>} document the data from Firestore.
 * @returns a `PointOfInterest` instance with data retrieved from `document`
 */
function pointOfInterestFromFirestore(document, _, __) {
    if(!document.exists) {
        return null;
    }

    return new PointOfInterest(
        document.id,
        document.data().address,
        document.data().type,
        parseFloat(document.data().latitude),
        parseFloat(document.data().longitude),
        document.data().name,
        document.data().phoneNumber,
        document.data().visibility,
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