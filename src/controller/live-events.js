const AddLiveEvent = require('../model/request-body/add-live-event');
let express = require('express');
let router = express.Router();
let liveEvent = require('../service/live-event');


router.get('/', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /live-events');
    const query = req.query;
    let username = query.user + ''; // Workaround per evitare di mettere disable a ESLint.
    
    res.json(await liveEvent.getLiveEvents(username)).status(200).send();
});

router.post('/add', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /live-events/add');
    const body = req.body;

    let addLiveEvent = new AddLiveEvent(body.expiresAfter, body.owner, body.name, body.address);

    await liveEvent.addLiveEvent(addLiveEvent);

    res.status(200).send();
});

module.exports = router;