const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');
const AddFriendshipDenial = require('../model/request-body/add-friendship-denial');

let express = require('express');
let router = express.Router();

const friendService = require('../service/friend');
const APIError = require('../model/api-error');
const { validateApiCall } = require('../utils/validate-api-call');

router.get('/', async (req, res) => {
    const query = req.query;
    const apiCallCheck = await validateApiCall(req.headers, query.user + '');
    if(Object.keys(apiCallCheck).length === 0) {
        res.status(200).json(await friendService.getFriends(query.user + '')).send();
    } else {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
    }
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const apiCallCheck = await validateApiCall(req.headers, body.sender + '');

    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    try {
        await friendService.sendAddFriendshipRequest(addFriendshipRequest);
        res.status(200).send();
    } catch(e) {
        res = res.status(400);
        if(typeof(e) === 'string') {
            res = res.json(APIError.build(e));
        }
        res.send();
    }
});

router.post('/confirm', async (req, res) => {
    const body = req.body;
    const apiCallCheck = await validateApiCall(req.headers, body.receiverOfTheFriendshipRequest + '');
    
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    try {
        await friendService.sendAddFriendshipConfirmation(addFriendshipConfirmation);
        res.status(200).send();
    } catch(e) {
        res = res.status(400);
        if(typeof(e) === 'string') {
            res = res.json(APIError.build(e));
        }
        res.send();
    }
});

router.post('/deny', async (req, res) => {
    const body = req.body;
    const apiCallCheck = await validateApiCall(req.headers, body.receiverOfTheFriendshipRequest + '');
    
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let denyFriendshipConfirmation = new AddFriendshipDenial(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    try {
        await friendService.sendAddFriendshipDenial(denyFriendshipConfirmation);
        res.status(200).send();
    } catch(e) {
        res = res.status(400);
        if(typeof(e) === 'string') {
            res = res.json(APIError.build(e));
        }
        res.send();
    }
});

router.delete('/remove', async (req, res) => {
    const body = req.body;
    const apiCallCheck = await validateApiCall(req.headers, body.sender + '');
    
    if(Object.keys(apiCallCheck).length === 2) {
        res.status(apiCallCheck.code).json(apiCallCheck.error).send();
        return;
    }

    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);
    try {
        await friendService.sendRemoveFriendshipRequest(removeFriendshipRequest);
        res.status(200).send();
    } catch(e) {
        res = res.status(400);
        if(typeof(e) === 'string') {
            res = res.json(APIError.build(e));
        }
        res.send();
    }
});

module.exports = router;
