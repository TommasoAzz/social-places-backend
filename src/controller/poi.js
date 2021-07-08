const Friend = require('../model/friend');
let express = require('express');
let router = express.Router();
const pointOfInterests = require('../service/point-of-interests');

router.get('/getPoiFromFriend', (req, res) => {
    const body = req.body;
    let friend = new Friend(body.friend);

    pointOfInterests.getPOIsFromFriend(friend);
});
router.get('/poi', (req, res) => {
    const body = req.body;
    let friend = new Friend(body.friend);

    pointOfInterests.getPOIsFromFriend(friend);
});

module.exports = router;