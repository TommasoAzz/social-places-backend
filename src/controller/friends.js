const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');
let express = require('express');
let router = express.Router();

const friendService = require('../service/friend');

router.get('/', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - GET /friends');
    const query = req.query;
    let username = query.user + ''; // Workaround per evitare di mettere disable a ESLint.
    //let auth = req.headers.Authorization + ''; // Workaround per evitare di mettere disable a ESLint.
    //console.info((new Date()).toLocaleString() + ' - GET /friends ' + auth);
    //user doesnt exist
    //401 senza token
    //403 token scaduto

    res.json(await friendService.getFriends(username)).status(200).send();
});

router.post('/add', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friends/add');
    const body = req.body;
    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);

    await friendService.sendAddFriendshipRequest(addFriendshipRequest);

    res.status(200).send();
});

router.post('/confirm', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friends/confirm');
    const body = req.body;
    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);

    await friendService.sendAddFriendshipConfirmation(addFriendshipConfirmation);

    res.status(200).send();
});

router.delete('/remove', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - DELETE /friends/remove');
    const body = req.body;
    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);

    await friendService.sendRemoveFriendshipRequest(removeFriendshipRequest);

    res.status(200).send();
});

module.exports = router;
