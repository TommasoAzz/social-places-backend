const AddLiveEvent = require('../model/request-body/add-live-event');
let express = require('express');
let router = express.Router();
let liveEvent = require('../service/live-event');
const APIError = require('../model/api-error');
const { validateApiCall } = require('../utils/validate-api-call');


router.get('/', async (req, res) => {
    const query = req.query;
    const apiCallCheck = await validateApiCall(req.headers, query.user + '');
    if(Object.keys(apiCallCheck).length === 0) {
        res.status(200).json(await liveEvent.getLiveEvents(query.user + '')).send();
    } else {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
    }
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const apiCallCheck = await validateApiCall(req.headers, body.owner + '');
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let addLiveEvent = new AddLiveEvent(body.expiresAfter, body.owner, body.name, body.address, body.latitude, body.longitude);
    const leId = await liveEvent.addLiveEvent(addLiveEvent);
    console.log(leId);
    if(leId === null) {
        res.status(400).json(
            APIError.build(
                'Trying to add a live event with a name or address already existent in the user\'s list of live events.'
            )
        ).send();
    } else {
        res.status(200).json({id: leId}).send();
    }
});

async function cleanExpiredLiveEvents() {
    await liveEvent.clearExpiredLiveEvents();
}

module.exports = {
    liveEvents: router,
    cleanExpiredLiveEvents
};