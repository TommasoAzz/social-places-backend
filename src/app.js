const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// Loading environment
const environment = require('./config/enviroment');

// Firestore initialization
const serviceAccount = require(environment.firebaseSDK);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: environment.firebaseURL
});
const db = firebaseAdmin.firestore();

// Persistence manager initialization
const UserPersistence = require('./persistence/user-persistence');
UserPersistence.connection = db;

// HTTPS initialization
const options = {
    key: fs.readFileSync(environment.certificateKey),
    cert: fs.readFileSync(environment.certificateCert)
};

// Routes configuration
const { friends, liveEvents, pointsOfInterest } = require('./controller');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/friends', friends);

app.use('/live-events', liveEvents);

app.use('/points-of-interest', pointsOfInterest);

// Server setup
const port = environment.serverPort;
https.createServer(options, app).listen(port, () => {
    console.log('Server started on port ' + port);
});
