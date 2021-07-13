const AddFriendshipRequest = require('../model/request-body/add-friendship-request');
const AddFriendshipConfirmation = require('../model/request-body/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/request-body/remove-friendship-request');
let express = require('express');
let router = express.Router();

const friendService = require('../service/friend');

router.post('/add', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friends/add');
    const body = req.body;
    console.log(body);
    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    
    await friendService.sendAddFriendshipRequest(addFriendshipRequest);
});

router.post('/confirm', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friends/confirm');
    const body = req.body;
    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    
    await friendService.sendAddFriendshipConfirmation(addFriendshipConfirmation);
});

router.delete('/remove', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - DELETE /friends/remove');
    const body = req.body;
    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);

    await friendService.sendRemoveFriendshipRequest(removeFriendshipRequest);
});

module.exports = router;