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
}

module.exports = AuthService;