class AddLiveEvent {
    /**
     * Constructs a live event creation request body.
     * 
     * @param {string} expireAfter Minutes after which the event expires.
     * @param {string} owner Username of the person which adds the event to the system.
     * @param {string} name Name of the event.
     * @param {string} address Address in which the event takes place.
     */
    constructor(expireAfter, owner, name, address) {
        this.expireAfter = expireAfter;
        this.owner = owner;
        this.name = name;
        this.address = address;
    }
}