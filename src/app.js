const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();
const dotenv = require('dotenv');

// Environment loading
dotenv.config();

// Firestore initialization
const serviceAccount = require('../' + process.env.FIREBASE_SDK);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_URL
});
const db = firebaseAdmin.firestore();

// Persistence manager initialization
const UserPersistence = require('./persistence/user-persistence');
UserPersistence.connection = db;

// HTTPS initialization
const options = {
    key: fs.readFileSync(process.env.CERTIFICATE_KEY),
    cert: fs.readFileSync(process.env.CERTIFICATE_CERT)
};

// Routes configuration
const { friends, liveEvents, pointsOfInterest } = require('./controller');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/friends', friends);

app.use('/live-events', liveEvents);

app.use('/points-of-interest', pointsOfInterest);

// Server setup
const port = process.env.SERVER_PORT;
https.createServer(options, app).listen(port, () => {
    console.log('Server started on port ' + port);
});
