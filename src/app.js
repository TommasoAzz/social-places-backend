var firebaseAdmin = require('firebase-admin');
const fs = require('fs');
var serviceAccount = require('../findmycar-271019-firebase-adminsdk-q91xw-6ce22b9fde.json');
var https = require('https');
const dotenv = require('dotenv').config();
const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: 'https://findmycar-271019.firebaseio.com'
});
const db = firebaseAdmin.firestore();
var carInterval = {};
var carIntervalExpired = {};
var liveFriendInterval = {};

app.get('/', (req, res) => {
    res.send('Chat Server is running on port 3000');
});
app.get('/get', (req, res) => {
    res.send('Chat Server is running on port 3000');
});
app.get('/addFriend', (req, res) => {

    var user = req.query.username.replace('@gmail.com', '');
    var sender = req.query.sender.replace('@gmail.com', '');
    var notfriend = true;
    console.log('user ' + user + '\nsender ' + sender);
    db.collection('user').doc(user).get().then(documentSnapshot => {

        if (documentSnapshot.exists) {
            db.collection('user').doc(user).collection('friend').get().then(friendSnapshot => {
                //check if already friends
                console.log('FRIEND DATA');
                try {
                    friendSnapshot.forEach(doc => {
                        var friend = doc.data();
                        if (friend.friend == sender) {
                            notfriend = false;
                            console.log('already friend');
                        }
                    });
                }
                catch (e) { 
                    console.error(`error ${e}`);
                }
                if (notfriend) {
                    db.collection('user').doc(user).collection('friendrequest').add({
                        origin: sender
                    }).then(ref => {
                        console.log('Added friendrequest with ID: ', ref.id);
                    });
                }
            });
        }
    });
    res.send('Fine api addFriend');
});

app.get('/confirmFriend', (req, res) => {

    var receiver = req.query.receiver.replace('@gmail.com', '');
    var sender = req.query.sender.replace('@gmail.com', '');
    var notfriend = true;
    console.log('receiver ' + receiver + '\nsender ' + sender);
    db.collection('user').doc(receiver).get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
            db.collection('user').doc(receiver).collection('friend').get().then(friendSnapshot => {
                friendSnapshot.forEach(doc => {
                    var friend = doc.data();
                    if (friend.friend == sender) {
                        console.log('already friend');
                        notfriend = false;
                    }
                });
                if (notfriend) {
                    db.collection('user').doc(receiver).collection('friend').add({
                        friend: sender
                    }).then(ref => {
                        console.log('Added friend with ID: ', ref.id);
                    });
                    db.collection('user').doc(sender).get().then(documentSnapshot => {
                        if (documentSnapshot.exists) {
                            db.collection('user').doc(sender).collection('friend').add({
                                friend: receiver
                            }).then(ref => {
                                console.log('Added friend with ID: ', ref.id);
                            });
                            db.collection('user').doc(sender).collection('addedfriend').add({
                                friend: receiver
                            }).then(ref => {
                                console.log('Added friend with ID: ', ref.id);
                            });
                        }
                    });
                }
            });
        }
    });
    res.send('Fine api confirmFriend');

});

app.get('/removeFriend', (req, res) => {
    var receiver = req.query.receiver.replace('@gmail.com', '');
    var sender = req.query.sender.replace('@gmail.com', '');
    console.log('receiver ' + receiver + '\nsender ' + sender);
    db.collection('user').doc(receiver).get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
            db.collection('user').doc(receiver).collection('friend').get().then(friendSnapshot => {
                //check if already friends
                console.log('deliting FRIEND');
                friendSnapshot.forEach(doc => {
                    var friend = doc.data();
                    if (friend.friend == sender) {
                        db.collection('user').doc(receiver).collection('friend').doc(doc.id).delete();
                    }
                });
            });
        }
    });

    db.collection('user').doc(sender).get().then(documentSnapshot => {
        if (documentSnapshot.exists) {
            db.collection('user').doc(sender).collection('friend').get().then(friendSnapshot => {
                //check if already friends
                friendSnapshot.forEach(doc => {
                    var friend = doc.data();
                    if (friend.friend == receiver) {
                        db.collection('user').doc(sender).collection('friend').doc(doc.id).delete();
                        res.send('deleted friend');
                    }
                });
            });
        }
    });
});

app.get('/getPoiFromFriend', async (req, res) => {
    var myList = {};
    var friend = req.query.friend.replace('@gmail.com', '');
    console.log('friend ' + friend);
    db.collection('user').doc(friend).collection('marker')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var tmp = doc.data();
                var myjson = {};
                if (tmp['type'] == 'Pubblico') {
                    for (var i in tmp) {
                        myjson[i] = tmp[i];
                    }
                    var pos = '(' + myjson['lat'] + ',' + myjson['lon'] + ')';
                    myList[pos] = myjson;
                }
            });
            res.send(myList);
        });

});

app.get('/reminderAuto', async (req, res) => {
    var timer = req.query.timer;
    if (timer == 0) timer = 1;
    var owner = req.query.owner;
    var name = req.query.name;
    var address = req.query.addr;
    var key = owner + name;
    var mycar = {};
    mycar['timer'] = timer.toString();
    mycar['owner'] = owner;
    mycar['name'] = name;
    mycar['addr'] = address;
    console.log(mycar);

    var remind = setInterval(function () {
        db.collection('user').doc(owner).collection('timed').add({
            key: mycar
        }).then(ref => {
            console.log('Added timer scaduto ', mycar);
        });
        clearInterval(remind);
    }, timer * 60 * 1000 - 300000);

    carInterval[key] = remind;
    var exp = setInterval(function () {
        db.collection('user').doc(owner).collection('timedExpired').add({
            key: mycar
        }).then(ref => {
            console.log('Added timer finito ', mycar);
        });
        clearInterval(exp);
    }, timer * 60 * 1000);

    carIntervalExpired[key] = exp;
    res.send('Fine api reminderAuto');

});


app.get('/startLive', async (req, res) => {
    var timer = req.query.timer;
    if (timer == 0) timer = 1;
    var owner = req.query.owner;
    var name = req.query.name;
    var address = req.query.addr;
    var key = owner + name;
    var mylive = {};
    mylive['timer'] = timer.toString();
    mylive['owner'] = owner;
    mylive['name'] = name;
    mylive['addr'] = address;
    console.log(mylive);
    console.log(owner);
    db.collection('user').doc(owner).collection('friend')
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                var tmp = doc.data();
                var friend = tmp['friend'];
                console.log('IN');
                db.collection('user').doc(friend).collection('live').add({
                    key: mylive
                }).then(ref => {
                    console.log('EVENTO LIVE AGGIUNTO', mylive);
                });
            });
        });
    var exp = setInterval(function () {


        db.collection('user').doc(owner).collection('friend')
            .get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    var tmp = doc.data();
                    var friend = tmp['friend'];
                    console.log('IN');
                    //aggiungo fine evento all'amico
                    db.collection('user').doc(friend).collection('timedLiveExpired').add({
                        key: mylive
                    }).then(ref => {
                        console.log('Added timer finito live ', mylive);
                    });
                });
            });
        //aggiungo fine evento al proprietario
        db.collection('user').doc(owner).collection('timedLiveExpired').add({
            key: mylive
        }).then(ref => {
            console.log('Added timer finito live owner', mylive);
            clearInterval(exp);
        });

    }, timer * 60 * 1000);
    res.send('fine api live');
    //add interval to delete the event
});


const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(3000, () => {
    console.log('started server');
});
