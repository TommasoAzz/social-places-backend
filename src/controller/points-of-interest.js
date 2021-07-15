const Friend = require('../model/request-body/friend');
let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');

router.get('/', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /points-of-interest');
    const body = req.body;
    let friend = new Friend(body.friend);

    const markers = await pointOfInterest.getPOIsFromFriend(friend);
    
    res.json(markers).status(200).send();
});

module.exports = router;