const { validatePrimitiveType } = require('../utils/validate-arguments');

class APIError {
    /**
     * Constructs an error to be returned to the user.
     * 
     * @param {string} message The explicative message of the error.
     * 
     */
    constructor(message) {
        validatePrimitiveType(message, 'string');
        this.message = message;
    }

    /**
     * Constructs an error to be returned to the user.
     * 
     * @param {string} message The explicative message of the error.
     * 
     */
    static build(message) {
        return new APIError(message);
    }
}

module.exports = APIError;