let express = require('express');
let router = express.Router();

const auth = require('../service/auth');
const APIError = require('../model/api-error');

router.post('/token', async (req, res) => {
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

    await auth.updatePushNotificationToken(user, body.token);

    res.status(200).send();
});

module.exports = router;
