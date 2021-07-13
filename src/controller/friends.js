const AddFriendshipRequest = require('../model/add-friendship-request');
const AddFriendshipConfirmation = require('../model/add-friendship-confirmation');
const RemoveFriendshipRequest = require('../model/remove-friendship-request');
let express = require('express');
let router = express.Router();

const friendshipService = require('../service/friendship');

router.post('/friendship/add', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friendship/add');
    const body = req.body;
    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    
    await friendshipService.sendAddFriendshipRequest(addFriendshipRequest);
});

router.post('/friendship/confirm', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - POST /friendship/confirm');
    const body = req.body;
    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    
    await friendshipService.sendAddFriendshipConfirmation(addFriendshipConfirmation);
});

router.delete('/friendship/remove', async (req, res) => {
    console.info((new Date()).toLocaleString() + ' - DELETE /friendship/remove');
    const body = req.body;
    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);

    await friendshipService.sendRemoveFriendshipRequest(removeFriendshipRequest);
});

module.exports = router;