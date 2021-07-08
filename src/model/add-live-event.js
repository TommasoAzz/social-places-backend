class AddLiveEvent {
    /**
     * Constructs a live event creation request body.
     * 
     * @param {number} expireAfter Minutes after which the event expires.
     * @param {string} owner Username of the person which adds the event to the system.
     * @param {string} name Name of the event.
     * @param {string} address Address in which the event takes place.
     */
    constructor(expireAfter, owner, name, address) {
        if(!(typeof(expireAfter) === "number")) {
            console.error(`Argument ${expireAfter} is not a number`);
            throw TypeError(`Argument ${expireAfter} is not a number`);
        }
        if(!(typeof(owner) === "string")) {
            console.error(`Argument ${owner} is not a string`);
            throw TypeError(`Argument ${owner} is not a string`);
        }
        if(!(typeof(name) === "string")) {
            console.error(`Argument ${name} is not a string`);
            throw TypeError(`Argument ${name} is not a string`);
        }
        if(!(typeof(address) === "string")) {
            console.error(`Argument ${address} is not a string`);
            throw TypeError(`Argument ${address} is not a string`);
        }

        this.expireAfter = expireAfter;
        this.owner = owner;
        this.name = name;
        this.address = address;
    }
}

module.exports = AddLiveEvent;