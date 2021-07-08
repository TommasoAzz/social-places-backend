let express = require('express');
let router = express.Router()
let liveEvents = require('../service/live-events');


router.get('/startLive', (req, res) => {
    const body = req.body;

    let addLiveEvent = new AddLiveEvent(body.expireAfter, body.owner, body.name, body.address);

    liveEvents.addLiveEvent(addLiveEvent);
});
router.post('/live-events/add', (req, res) => {
    const body = req.body;

    let addLiveEvent = new AddLiveEvent(body.expireAfter, body.owner, body.name, body.address);

    liveEvents.addLiveEvent(addLiveEvent);
});

module.exports = router;