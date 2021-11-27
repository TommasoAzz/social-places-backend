const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');
const AddFriendshipDenial = require('../model/request-body/add-friendship-denial');

let express = require('express');
let router = express.Router();

const friendService = require('../service/friend');
const auth = require('../service/auth');
const APIError = require('../model/api-error');

router.get('/', async (req, res) => {
    const query = req.query;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != query.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${query.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${query.user}.`)).send();
        return;
    }

    res.status(200).json(await friendService.getFriends(user)).send();
});

router.post('/add', async (req, res) => {
    const body = req.body;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.sender) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.sender}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.sender}.`)).send();
        return;
    }

    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    try {
        await friendService.sendAddFriendshipRequest(addFriendshipRequest);
        res.status(200).send();
    } catch(e) {
        console.log('A');
        res = res.status(400);
        console.log('B');
        if(typeof(e) === 'string') {
            console.log('C');
            res = res.json(APIError.build(e));
        }
        res.send();
        console.log('D');
    }
});

router.post('/confirm', async (req, res) => {
    const body = req.body;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        res.status(401).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.receiverOfTheFriendshipRequest) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.receiverOfTheFriendshipRequest}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.receiverOfTheFriendshipRequest}.`)).send();
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
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        res.status(401).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.receiverOfTheFriendshipRequest) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.receiverOfTheFriendshipRequest}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.receiverOfTheFriendshipRequest}.`)).send();
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
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.sender) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.sender}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.sender}.`)).send();
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
