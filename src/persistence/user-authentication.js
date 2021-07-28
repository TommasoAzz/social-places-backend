// eslint-disable-next-line no-unused-vars
const FirebaseAuthentication = require('firebase-admin').auth;

class UserAuthentication {
    /**
     * @type {FirebaseAuthentication.Auth}
     */
    static _connection;

    /**
     * Sets the connection to the Firebase Authentication instance.
     * 
     * @param {FirebaseAuthentication.Auth} firebaseAuthentication the connection already established with Firebase Authentication.
     */
    static set connection(firebaseAuthentication) {
        this._connection = firebaseAuthentication;
    }

    /**
     * Checks whether the token is still valid.
     * 
     * @param {string} token token to check
     * @returns the user id if the token is valid, `null` otherwise.
     */
    static async verifyToken(token) {
        try {
            const decodedToken = await this._connection.verifyIdToken(token);
            return decodedToken.email.replace('@gmail.com', '');
        } catch(wrongToken) {
            return null;
        }
    }
}

module.exports = UserAuthentication;