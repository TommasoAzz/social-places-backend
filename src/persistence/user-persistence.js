/* eslint-disable no-unused-vars */
const Friend = require('../model/friend');
const User = require('../model/user');
const LiveEvent = require('../model/live-event');
const Marker = require('../model/marker');
const FriendRequest = require('../model/friend-request');

class UserPersistence {
    static connection;
    
    /**
     * Sets the connection to the Firestore instance.
     * @param {FirebaseFirestore.Firestore} connection the connection already established with Firestore.
     */
    static setConnection(firestoreConnection) {
        this.connection = firestoreConnection;
    }

    /**
     * Retrieves all user records available on Firestore.
     *
     * @returns all user records (`Array<User>`) available on Firestore.
     */
    static async getAllUsers() {
        const users = await this.connection.collection('user').get();
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
        const friends = await this.connection.collection('user').doc(userId).collection('friend').get();
        const liveEvents = await this.connection.collection('user').doc(userId).collection('live').get();
        const markers = await this.connection.collection('user').doc(userId).collection('marker').get();
        const expiredliveEvents = await this.connection.collection('user').doc(userId).collection('timedLiveExpired').get();
        const friendRequests = await this.connection.collection('user').doc(userId).collection('friendrequest').get();

        return User(
            userId,
            friends.size > 0 ? friends.docs.map(friendFromFirestore) : [],
            liveEvents.size > 0 ? liveEvents.docs.map(liveEventFromFirestore) : [],
            markers.size > 0 ? markers.docs.map(markerFromFirestore) : [],
            expiredliveEvents.size > 0 ? expiredliveEvents.docs.map(liveEventFromFirestore) : [], 
            friendRequests.size > 0 ? friendRequests.docs.map(friendRequestFromFirestore) : []
        );
    }

    /**
     * Sends a friendship request from `sender` to `receiver`.
     * 
     * @param {string} sender Sender of the friendship request.
     * @param {string} receiver Receiver of the friendship request.
     */
    static async addFriendRequest(sender, receiver) {
        const friendRequestReference = await this.connection.collection('user').doc(receiver).collection('friendrequest').add({
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
        const friendRequestReference = await this.connection.collection('user').doc(user).collection('friend').add({
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
        const friendsOfUser = await this.connection.collection('user').doc(user).collection('friend').where('friend', '==', friendToRemove).get();
        if(friendsOfUser.empty) {
            console.error(`${friendToRemove} is not friend of ${user} therefore no removal happened.`);
        }

        const friendIdentifier = friendsOfUser.docs[0].id;
        await this.connection.collection('user').doc(user).collection('friend').doc(friendIdentifier).delete();

        console.info(`Confirmed friend removal from ${user} of ${friendToRemove} (now they are not friend anymore).`);
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

    return Friend(document.id, document.data().friend);
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

    return LiveEvent(
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

    return Marker(
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

    return FriendRequest(document.data().origin);
}