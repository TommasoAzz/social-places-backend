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
const firestore = firebaseAdmin.firestore();
const auth = firebaseAdmin.auth();

// Persistence manager initialization
const Persistence = require('./persistence/persistence');
Persistence.connection = firestore;

// Authentication manager 
const Authentication = require('./persistence/authentication');
Authentication.connection = auth;

// Context Aware Server
const RecommendationService = require('./service/recommendation');
RecommendationService.api_url = environment.contextAwareServerUrl;
// HTTPS initialization
const options = {
    key: fs.readFileSync(environment.certificateKey),
    cert: fs.readFileSync(environment.certificateCert)
};

// Routes configuration
const { friends, liveEvents, pointsOfInterest, recommendation } = require('./controller');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Interceptor: all requests pass through here and then get forwarded to their true handler.
app.use((req, _, next) => {
    console.info(`${(new Date()).toLocaleString()} - ${req.method} ${req.path}`);
    next();
});

app.use('/friends', friends);

app.use('/live-events', liveEvents);

app.use('/points-of-interest', pointsOfInterest);

app.use('/recommendation', recommendation);

// Server setup
const port = environment.serverPort;
https.createServer(options, app).listen(port, () => {
    console.log('Server started on port ' + port);
});
