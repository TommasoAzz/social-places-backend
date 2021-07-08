class LiveEvent {
    /**
     * Constructs a live event information object.
     * 
     * @param {string} id Identifier.
     * @param {string} address Address in which the event takes place.
     * @param {string} name A descriptive name for the event.
     * @param {string} owner Username of the user that created the event.
     * @param {number} expirationDate Expiration date in ms
     */
    constructor(id, address, name, owner, expirationDate) {
        if(!(typeof(id) === 'string')) {
            console.error(`Argument ${id} is not a string`);
            throw TypeError(`Argument ${id} is not a string`);
        }
        if(!(typeof(address) === 'string')) {
            console.error(`Argument ${address} is not a string`);
            throw TypeError(`Argument ${address} is not a string`);
        }
        if(!(typeof(name) === 'string')) {
            console.error(`Argument ${name} is not a string`);
            throw TypeError(`Argument ${name} is not a string`);
        }
        if(!(typeof(owner) === 'string')) {
            console.error(`Argument ${owner} is not a string`);
            throw TypeError(`Argument ${owner} is not a string`);
        }
        if(!(typeof(expirationDate) === 'number')) {
            console.error(`Argument ${expirationDate} is not a number`);
            throw TypeError(`Argument ${expirationDate} is not a number`);
        }

        this.id = id;
        this.address = address;
        this.name = name;
        this.owner = owner;
        this.expirationDate = expirationDate;
    }
}

module.exports = LiveEvent;