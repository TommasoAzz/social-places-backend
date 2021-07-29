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
            const atSymbolIndex = decodedToken.email.indexOf('@');
            let username = decodedToken.email; // Design choice was to use the e-mail as a username.
            if(atSymbolIndex !== -1) {
                username = username.substring(0, atSymbolIndex);
            }
            
            return username;
        } catch(wrongToken) {
            console.error('> Error while verifying the user\'s token:');
            console.error(wrongToken);

            return null;
        }
    }
}

module.exports = UserAuthentication;