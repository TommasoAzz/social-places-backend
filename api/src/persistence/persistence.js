/* eslint-disable no-unused-vars */
const FirebaseFirestore = require('firebase-admin').firestore;
const FirebaseCloudMessaging = require('firebase-admin').messaging();
const Friend = require('../model/friend');
const User = require('../model/user');
const LiveEvent = require('../model/live-event');
const PointOfInterest = require('../model/point-of-interest');
const FriendRequest = require('../model/friend-request');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');
const ValidationRequest = require('../model/request-body/validation-request');
const RecommendationAccuracy = require('../model/recommendation-accuracy');
const RecommendedPlace = require('../model/recommended-category');

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
    static async createUserDocumentIfDoesNotExist(user) {
        const userDoc = await this._connection.collection(`${this._usersDoc}`).doc(user).get();
        if (!userDoc.exists) {
            console.info(`Creating a new document for user ${user} since it does not exist.`);
            await this._connection.collection(`${this._usersDoc}`).doc(user).set({});
        }
    }

    /**
     * 
     * @param {string} user 
     */
    static async checkIfUserDocumentExists(user) {
        const userDoc = await this._connection.collection(this._usersDoc).doc(user).get();
        if (!userDoc.exists) {
            console.error(`Document for user ${user} does not exist.`);
        }
    }

    /**
     * Retrieves all user records available on Firestore.
     *
     * @returns {Promise<Array<User>>}all user records available on Firestore.
     */
    static async getAllUsers() {
        const users = await this._connection.collection(this._usersDoc).get();
        let returnedUsers = [];
        const documents = users.docs;
        for (let i = 0; i < documents.length; i++) {
            if (!documents[i].exists) {
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
     * @returns {Promise<User>} with the collected data.
     */
    static async getUser(userId) {
        await this.checkIfUserDocumentExists(userId);

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
     * @returns {Promise<string>} The id of the request.
     */
    static async addFriendRequest(sender, receiver) {
        await this.checkIfUserDocumentExists(sender);

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
        await this.checkIfUserDocumentExists(receiver);

        const friendRequestReference = await this._connection.collection(`${this._usersDoc}/${receiver}/${this._friendRequestsDoc}`).where('origin', '==', sender).get();
        if (friendRequestReference.empty) {
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
        await this.checkIfUserDocumentExists(user);

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
        await this.checkIfUserDocumentExists(senderOfTheFriendshipRequest);

        const friendshipConfirmationReference = await this._connection.collection(`${this._usersDoc}/${senderOfTheFriendshipRequest}/${this._notifyFriendshipConfirmationDoc}`).add({
            friend: receiverOfTheFriendshipRequest
        });

        const senderDoc = await this._connection.collection(this._usersDoc).doc(senderOfTheFriendshipRequest).get();

        /**
         * @type {string}
         */
        const pushToken = senderDoc.data().notificationToken;
        const title = 'Frienship request confirmed';
        const body = `You and ${receiverOfTheFriendshipRequest} are now friends!`;

        const messageId = await createAndSendNotification(pushToken, title, body, 'friend-request-accepted');

        console.info(`Notified user ${senderOfTheFriendshipRequest} because ${receiverOfTheFriendshipRequest} confirmed the friendship request, identifier: ${friendshipConfirmationReference.id}. Sent notification, identifier: ${messageId}.`);
    }


    /**
     * Triggers a friendship request notification for user `receiverOfTheFriendshipRequest`.
     * 
     * @param {string} senderOfTheFriendshipRequest User that sended friend request.
     * @param {string} receiverOfTheFriendshipRequest User that will receive the notification of friendship request.
     */
    static async notifyFriendRequest(senderOfTheFriendshipRequest, receiverOfTheFriendshipRequest) {
        await this.checkIfUserDocumentExists(receiverOfTheFriendshipRequest);

        const receiverDoc = await this._connection.collection(this._usersDoc).doc(receiverOfTheFriendshipRequest).get();

        /**
         * @type {string}
         */
        const pushToken = receiverDoc.data().notificationToken;
        const title = 'New Friend Request';
        const body = `${receiverOfTheFriendshipRequest} has just sent you a friend request!`;

        const messageId = await createAndSendNotification(pushToken, title, body, 'new-friend-request');

        console.info(`Notified user ${receiverOfTheFriendshipRequest} because ${senderOfTheFriendshipRequest} sent the friendship request. Sent notification, identifier: ${messageId}.`);
    }


    /**
     * Removes `friendToRemove` from the list of friends of `user`.
     * 
     * @param {string} user username of the user in which `friendToRemove` will be removed from.
     * @param {string} friendToRemove friend to remove.
     */
    static async removeFriend(user, friendToRemove) {
        await this.checkIfUserDocumentExists(user);

        const friendsOfUser = await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).where('friend', '==', friendToRemove).get();
        if (friendsOfUser.empty) {
            console.error(`${friendToRemove} is not friend of ${user} therefore no removal happened.`);
            return;
        }

        const friendIdentifier = friendsOfUser.docs[0].id;
        await this._connection.collection(`${this._usersDoc}/${user}/${this._friendsDoc}`).doc(friendIdentifier).delete();
        const addedFriend = await this._connection.collection(`${this._usersDoc}/${user}/${this._notifyFriendshipConfirmationDoc}`).where('friend', '==', friendToRemove).get();
        if (!addedFriend.empty) {
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
        await this.checkIfUserDocumentExists(liveEvent.owner);

        // Checking for live events with same name or address.
        const personalDuplicatedName = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._personalLiveEventsDoc}`).where('name', '==', liveEvent.name).get();
        const personalDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${liveEvent.owner}/${this._personalLiveEventsDoc}`).where('address', '==', liveEvent.address).get();
        if (!personalDuplicatedName.empty || !personalDuplicatedAddr.empty) {
            console.error('Found duplicate event name in list of live events of the user requesting to add it.');
            return null;
        }

        const friends = await this.getFriends(liveEvent.owner);
        let found = false;
        for (let i = 0, len = friends.length; i < len && !found; i++) {
            const friendPersonalDuplicatedName = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._personalLiveEventsDoc}`).where('name', '==', liveEvent.name).get();
            const friendPersonalDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._personalLiveEventsDoc}`).where('address', '==', liveEvent.address).get();
            const friendOtherDuplicatedName = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._liveEventsDoc}`).where('name', '==', liveEvent.name).get();
            const friendOtherDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${friends[i].friendUsername}/${this._liveEventsDoc}`).where('address', '==', liveEvent.address).get();
            found = !friendPersonalDuplicatedName.empty || !friendPersonalDuplicatedAddr.empty || !friendOtherDuplicatedName.empty || !friendOtherDuplicatedAddr.empty;
        }
        if (found) {
            console.error('Found duplicate event name in list of live events of the friends of the user requesting to add it.');
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
     * Create notification for new live event for everu friend of liveEvent.owner
     * 
     * @param {LiveEvent} liveEvent Live event data.
     */
    static async notifyAddLiveEvent(liveEvent) {
        await this.checkIfUserDocumentExists(liveEvent.owner);

        const friends = await this.getFriends(liveEvent.owner);

        friends.forEach(async (friend) => {
            var friendDoc = await this._connection.collection(this._usersDoc).doc(friend.friendUsername).get();

            const pushToken = friendDoc.data().notificationToken;
            const title = 'New live event!';
            const body = `${liveEvent.owner} added a new live event!`;

            const messageId = await createAndSendNotification(pushToken, title, body, 'new-live-event');
            console.info(`Notified user ${friend.friendUsername} because ${liveEvent.owner} added new live event. Sent notification, identifier: ${messageId}.`);
        });
    }

    /**
     * 
     * @param {ValidationRequest} placeValidated contains all information of the place validated to be notified
     * @returns 
     */
    static async notifyValidPlace(placeValidated) {
        await this.checkIfUserDocumentExists(placeValidated.user);

        const userDoc = await this._connection.collection(this._usersDoc).doc(placeValidated.user).get();

        const pushToken = userDoc.data().notificationToken;
        const title = 'Suggestion!';
        const body = `You may be interested to this ${placeValidated.place_category}. You are near this point`;

        const messageId = await createAndSendNotification(pushToken, title, body, 'place-recommendation');
        console.info(`Notified user ${placeValidated.user} because ${placeValidated.place_category} has to be suggested to the user. Sent notification, identifier: ${messageId}.`);

    }

    /**
      * 
      * @param {PointOfInterest} recommendedPlace contains poi to be notified
      * @param {string} user user that made the request

      * @returns 
      */
    static async notifySuggestionForPlace(recommendedPlace, user) {
        await this.checkIfUserDocumentExists(user);

        var userDoc = await this._connection.collection(this._usersDoc).doc(user).get();

        const pushToken = userDoc.data().notificationToken;

        const title = 'Suggestion!';
        const body = `You may be interested to this category ${recommendedPlace.type}`;

        const messageId = await createAndSendNotification(pushToken, title, body, 'place-recommendation');
        console.info(`Notified user ${user} because place: ${recommendedPlace.name}  of type: ${recommendedPlace.type} has to be suggested to the user. Sent notification, identifier: ${messageId}.`);

    }

    /**
     * 
     * @param {RecommendationAccuracy} recommendationAccuracy contains accuracy and correct sample number
     * @param {string} user user that made the request
     * @returns 
     */
    static async notifyRetrainedModel(recommendationAccuracy, user) {
        await this.checkIfUserDocumentExists(user);
        var userDoc = await this._connection.collection(this._usersDoc).doc(user).get();
        const pushToken = userDoc.data().notificationToken;

        const title = 'Model retrained!';
        const body = `Thanks for improving our model, new accuray: ${recommendationAccuracy.accuracy}`;

        const messageId = await createAndSendNotification(pushToken, title, body, 'model-retrained');
        console.info(`Notified user ${user} because the model retrained and get accuracy: ${recommendationAccuracy.accuracy} and correct sample: ${recommendationAccuracy.correct_samples}. Sent notification, identifier: ${messageId}.`);

    }




    /**
     * Returns the list of friends of `user`.
     * 
     * @param {string} user User of which the list of friends must be returned.
     * @returns A list of `Friend` instances.
     */
    static async getFriends(user) {
        await this.checkIfUserDocumentExists(user);

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
        await this.checkIfUserDocumentExists(user);

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
        await this.checkIfUserDocumentExists(user);

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
        await this.checkIfUserDocumentExists(username);

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
        await this.checkIfUserDocumentExists(user);

        // Checking for points of interest with same name or address.
        const personalDuplicatedName = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).where('name', '==', poi.name).get();
        const personalDuplicatedAddr = await this._connection.collection(`${this._usersDoc}/${user}/${this._poisDoc}`).where('address', '==', poi.address).get();
        if (!personalDuplicatedName.empty && !personalDuplicatedAddr.empty) {
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
        await this.checkIfUserDocumentExists(username);

        const poi = await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).doc(poiId).get();
        if (!poi.exists) {
            console.error(`The point of interest with id=${poiId} does not exist in the list of user ${username}.`);
        }

        await this._connection.collection(`${this._usersDoc}/${username}/${this._poisDoc}`).doc(poiId).delete();

        console.info(`Confirmed point of interest with id=${poiId} removal from ${username}.`);
    }

    /**
     * Updates the notification token for user `username`.
     * 
     * @param {string} username username of the user of which the token should be saved.
     * @param {string} token The Firebase Cloud Messaging notification token.
     */
    static async updatePushNotificationToken(username, token) {
        await this.createUserDocumentIfDoesNotExist(username);

        const writeTime = await this._connection.collection(this._usersDoc).doc(username).set({ notificationToken: token });

        console.info(`Confirmed writing of notification token for user ${username} at ${writeTime.writeTime.toDate().toLocaleDateString()}.`);
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
    if (!document.exists) {
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
    if (!document.exists) {
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
    if (!document.exists) {
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
    if (!document.exists) {
        return null;
    }

    return new FriendRequest(document.data().origin);
}

/**
 * 
 * @param {string} pushToken 
 * @param {string} title 
 * @param {string} body 
 * @param {string} click_action 
 * @returns 
 */
async function createAndSendNotification(pushToken, title, body, click_action) {
    const message = {
        notification: {
            title: title,
            body: body
        },
        android: {
            notification: {
                clickAction: click_action
            }
        },
        token: pushToken
    };

    try {
        const messageId = await FirebaseCloudMessaging.send(message);
        return messageId;
    } catch(error) {
        console.error(error);
        return null;
    }
}

