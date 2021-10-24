let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');
const auth = require('../service/auth');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');
const RemovePointOfInterest = require('../model/request-body/remove-point-of-interest');
const APIError = require('../model/error');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');

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

    let pois;
    if(query.friend === undefined || query.friend === '') {
        pois = await pointOfInterest.getPOIsOfUser(user);
    } else {
        let friend = query.friend + ''; // Workaround per evitare di mettere disable a ESLint.
        pois = await pointOfInterest.getPOIsOfFriend(user, friend);
    }

    if(pois === null) { // friend and user are not friends.
        console.error(`> Status code 400 - ${user} and ${query.friend} are not friends.`);
        res.status(400).json(APIError.build(`${user} and ${query.friend} are not friends.`)).send();
    } else { // friend and users are friends, pois can be empty.
        res.status(200).json(pois).send();
    }
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
    if(user === null || user != body.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.user}.`)).send();
        return;
    }

    let addPointOfInterest = new AddPointOfInterest(
        body.user,
        new AddPointOfInterestPoi(
            body.poi.address,
            body.poi.type,
            body.poi.latitude,
            body.poi.longitude,
            body.poi.name,
            body.poi.phoneNumber,
            body.poi.visibility,
            body.poi.url
        )
    );
    const poiId = await pointOfInterest.addPointOfInterest(addPointOfInterest.user, addPointOfInterest.poi);

    if(poiId === null) {
        res.status(400).json(
            APIError.build(
                'Trying to add a point of interest with a name or address already existent in the user\'s list of points of interest.'
            )
        ).send();
    } else {            
        res.status(200).json({"markId": poiId}).send();
    }
});

router.delete('/remove', async (req, res) => {
    const body = req.body;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.user}.`)).send();
        return;
    }

    let removePointOfInterest = new RemovePointOfInterest(user, body.poiId);

    await pointOfInterest.removePointOfInterest(removePointOfInterest);

    res.status(200).send();
});

module.exports = router;
