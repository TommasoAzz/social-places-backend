const AddLiveEvent = require('../model/request-body/add-live-event');
let express = require('express');
let router = express.Router();
let liveEvent = require('../service/live-event');
const auth = require('../service/auth');
const APIError = require('../model/error');


router.get('/', async (req, res) => {
    const query = req.query;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != query.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${query.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${query.user}.`)).send();
        return;
    }

    const usersLiveEvents = await liveEvent.getLiveEvents(user);
    
    res.status(200).json(usersLiveEvents).send();
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.owner) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.owner}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.owner}.`)).send();
        return;
    }

    let addLiveEvent = new AddLiveEvent(body.expiresAfter, body.owner, body.name, body.address, body.latitude, body.longitude);

    const leId = await liveEvent.addLiveEvent(addLiveEvent);

    console.log(leId);
    var response = {}
    if(leId === null) {
        console.info("NULLLL")
        response = APIError.build(
            'Trying to add a live event with a name or address already existent in the user\'s list of live events.'
        )
        console.info(response)

        res.status(400).json(
            response
        ).send();
    } else {    
        console.info("non NULLLL")
        response = {"id": leId}
        console.log(response)
        res.status(200).json(response).send();
    }
});

module.exports = router;