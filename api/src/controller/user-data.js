let express = require('express');
let router = express.Router();

const auth = require('../service/auth');
const { validateApiCall } = require('../utils/validate-api-call');

router.post('/notification-token', async (req, res) => {
    const body = req.body;
    const user = body.user + '';
    const apiCallCheck = await validateApiCall(req.headers, user);
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    await auth.updatePushNotificationToken(user, body.token);

    res.status(200).send();
});


router.post('/public-key', async (req, res) => {
    const body = req.body;
    const user = body.user + '';
    const apiCallCheck = await validateApiCall(req.headers, user);
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    await auth.updatePublicKey(user, body.publicKey);

    res.status(200).send();
});

module.exports = router;
