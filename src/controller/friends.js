let express = require('express');
let router = express.Router();

const friendshipService = require('../service/friendship');

router.post('/addFriend', (req, res) => {
    const body = req.body;
    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    
    friendshipService.sendAddFriendshipRequest(addFriendshipRequest);
});
router.post('/friendship/add', (req, res) => {
    const body = req.body;
    let addFriendshipRequest = new AddFriendshipRequest(body.receiver, body.sender);
    
    friendshipService.sendAddFriendshipRequest(addFriendshipRequest);
});

router.post('/confirmFriend', (req, res) => {
    const body = req.body;
    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    
    friendshipService.sendAddFriendshipConfirmation(addFriendshipConfirmation);
});
router.post('/friendship/confirm', (req, res) => {
    const body = req.body;
    let addFriendshipConfirmation = new AddFriendshipConfirmation(body.receiverOfTheFriendshipRequest, body.senderOfTheFriendshipRequest);
    
    friendshipService.sendAddFriendshipConfirmation(addFriendshipConfirmation);
});

router.post('/removeFriend', (req, res) => {
    const body = req.body;
    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);

    friendshipService.sendRemoveFriendshipRequest(removeFriendshipRequest);
});
router.post('/friendship/remove', (req, res) => {
    const body = req.body;
    let removeFriendshipRequest = new RemoveFriendshipRequest(body.receiver, body.sender);

    friendshipService.sendRemoveFriendshipRequest(removeFriendshipRequest);
});

module.exports = router;