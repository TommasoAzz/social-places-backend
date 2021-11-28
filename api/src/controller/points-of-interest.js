let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');
const AddPointOfInterestPoi = require('../model/request-body/add-point-of-interest-poi');
const RemovePointOfInterest = require('../model/request-body/remove-point-of-interest');
const APIError = require('../model/api-error');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');
const { validateApiCall } = require('../utils/validate-api-call');
// eslint-disable-next-line no-unused-vars
const PointOfInterest = require('../model/point-of-interest');

router.get('/', async (req, res) => {
    const query = req.query;
    const user = query.user + '';
    const apiCallCheck = await validateApiCall(req.headers, user);
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    /**
     * @type Array<PointOfInterest>
     */
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
    const user = body.user + '';
    const apiCallCheck = await validateApiCall(req.headers, user);
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
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
        res.status(200).json({markId: poiId}).send();
    }
});

router.delete('/remove', async (req, res) => {
    const body = req.body;
    const user = body.user + '';
    const apiCallCheck = await validateApiCall(req.headers, user);
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let removePointOfInterest = new RemovePointOfInterest(user, body.poiId);

    await pointOfInterest.removePointOfInterest(removePointOfInterest);

    res.status(200).send();
});

module.exports = router;
