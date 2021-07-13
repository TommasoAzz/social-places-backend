const Friend = require('../model/friend');
let express = require('express');
let router = express.Router();
const pointOfInterest = require('../service/point-of-interest');

router.get('/points-of-interest', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /points-of-interest');
    const body = req.body;
    let friend = new Friend(body.friend);

    const markers = await pointOfInterest.getPOIsFromFriend(friend);
    
    res.json(markers);
});

module.exports = router;