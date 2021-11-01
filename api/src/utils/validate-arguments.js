/**
 * Checks whether the argument is okay w.r.t. the given type.
 * Throws a TypeError if not.
 * @param {any} argument the variable to check
 * @param {string} type can be string, number, boolean.
 * @returns nothing if everything is okay
 * @throws {TypeError} if types do not match.
 */
function validatePrimitiveType(argument, type) {
    if(type !== 'string' && type !== 'number' && type !== 'boolean') {
        console.error(`Invalid type specified: was ${type}, should have been string, number, or boolean.`);
        throw new TypeError(`Invalid type specified: was ${type}, should have been string, number, or boolean.`);
    }
    if(!(typeof(argument) === type)) {
        console.error(`Argument ${Object.keys({argument})[0]} instantiated with ${argument} is not of primitive type: ${type}.`);
        throw new TypeError(`Argument ${Object.keys({argument})[0]} instantiated with ${argument} is not of primitive type: ${type}.`);
    }
}

module.exports = {
    validatePrimitiveType
};