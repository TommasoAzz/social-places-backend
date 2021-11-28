const auth = require('../service/auth');
const APIError = require('../model/api-error');
// eslint-disable-next-line no-unused-vars
const { IncomingHttpHeaders } = require('http');
/**
 * 
 * @param {IncomingHttpHeaders} headers
 * @param {string} user 
 * @returns {Promise<object>} with both keys `code` and `error` or none of them.
 */
async function validateApiCall(headers, user) {
    const token = auth.parseHeaders(headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        return {
            code: 401,
            error: APIError.build('Token not available.')
        };
    }
    let userInPersistence = await auth.verifyToken(token);
    if(userInPersistence === null || userInPersistence != user) {
        console.error(`> Status code 403 - User from the authentication service is ${userInPersistence} and that from query is ${user}.`);
        return {
            code: 403,
            error: APIError.build(`User from the authentication service is ${userInPersistence} and that from query is ${user}.`)
        };
    }

    return {};
}

module.exports = {
    validateApiCall
};