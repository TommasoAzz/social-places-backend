let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');

router.get('/', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /points-of-interest');
    const query = req.query;
    let user = query.user + ''; // Workaround per evitare di mettere disable a ESLint.

    const pois = await pointOfInterest.getPOIsOfUser(user);
    
    res.json(pois).status(200).send();
});

router.post('/add', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /points-of-interest/add');
    const body = req.body;
    let addPointOfInterest = new AddPointOfInterest(
        body.poi.address,
        body.poi.type,
        body.poi.latitude,
        body.poi.longitude,
        body.poi.name,
        body.poi.phoneNumber,
        body.poi.visibility,
        body.poi.url
    );

    const poiId = await pointOfInterest.addPointOfInterest(body.user, addPointOfInterest);
    
    res.json(poiId).status(200).send();
});

router.delete('/remove', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - DELETE /points-of-interest/remove');
    const body = req.body;
    let poiId = body.poiId;
    let username = body.username;

    await pointOfInterest.removePointOfInterest(poiId, username);

    res.status(200).send();
});

module.exports = router;