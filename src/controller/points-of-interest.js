const Friend = require('../model/request-body/friend');
let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');
const AddPointOfInterest = require('../model/request-body/add-point-of-interest');

router.get('/', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /points-of-interest');
    const body = req.body;
    let friend = new Friend(body.friend);

    const markers = await pointOfInterest.getPOIsFromFriend(friend);
    
    res.json(markers).status(200).send();
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

    const markers = await pointOfInterest.addPointOfInterest(body.user, addPointOfInterest);
    
    res.json(markers).status(200).send();
});

module.exports = router;