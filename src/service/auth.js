// @ts-nocheck
const UserAuthentication = require('../persistence/user-authentication');

class AuthService {
    /**
     * Returns the username of the user authenticated if the token is valid, null otherwise.
     * 
     * @param {string} token retrieved from Firebase Client SDK.
     * @returns the username of the user authenticated if the token is valid, null otherwise.
     */
    static async verifyToken(token) {
        return await UserAuthentication.verifyToken(token);
    }

    /**
     * Returns the token from the "Authorization" header.
     * 
     * @param {Request<{}, any, any, qs.ParsedQs, Record<string, any>>} headers Header retrieved from the request.
     * @returns '-1' if the "Authorization" header was not set, '0' if it was not Bearer.
     */
    static parseHeaders(headers) {
        const authHeader = headers.authorization;

        if(authHeader === undefined) {
            return -1;
        }

        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }

        return 0;
    }
}

module.exports = AuthService;