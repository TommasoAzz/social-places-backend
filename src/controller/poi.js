let express = require('express');
let router = express.Router()
const pointOfInterests = require('../service/pointofinterests');

router.get('/getPoiFromFriend', (req, res) => {
    const body = req.body;
    let friend = Friend(body.friend);

    pointOfInterests.getPOIsFromFriend(friend);
});
router.get('/poi', (req, res) => {
    const body = req.body;
    let friend = Friend(body.friend);

    pointOfInterests.getPOIsFromFriend(friend);
});

module.exports = router;