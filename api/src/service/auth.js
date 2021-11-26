// @ts-nocheck
const Authentication = require('../persistence/authentication');
const Persistence = require('../persistence/persistence');

class AuthService {
    /**
     * Returns the username of the user authenticated if the token is valid, null otherwise.
     * 
     * @param {string} token retrieved from Firebase Client SDK.
     * @returns the username of the user authenticated if the token is valid, null otherwise.
     */
    static async verifyToken(token) {
        return await Authentication.verifyToken(token);
    }

    /**
     * Returns the token from the "Authorization" header.
     * Authentication uses the Bearer token technique.
     * 
     * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} headers Header retrieved from the request.
     * @returns The token if the "Authorization" header was  set, `null` otherwise.
     */
    static parseHeaders(headers) {
        const authHeader = headers.authorization; // The lower case is correct.

        if(authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }

        return null;
    }

    /**
     * Updates the notification token for user `username`.
     * 
     * @param {string} username username of the user of which the token should be saved.
     * @param {string} token The notification token.
     */
    static async updatePushNotificationToken(username, token) {
        await Persistence.updatePushNotificationToken(username, token);
    }
    /**
     * Updates the public key for user `username`.
     * 
     * @param {string} username username of the user of which the publicKey should be saved.
     * @param {string} publicKey The publicKey of the user username.
     */
    static async updatePublicKey(username, publicKey) {
        await Persistence.updatePublicKey(username, publicKey);
    }
}

module.exports = AuthService;