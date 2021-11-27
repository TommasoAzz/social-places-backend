const firebaseAdmin = require('firebase-admin');
const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express();

// Loading environment
const environment = require('./config/enviroment');
environment.printConfiguration();

// Firestore initialization
const serviceAccount = require(environment.firebaseSDK);
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: environment.firebaseURL
});

// Persistence manager initialization
const Persistence = require('./persistence/persistence');
Persistence.connection = firebaseAdmin.firestore();

// Authentication manager 
const Authentication = require('./persistence/authentication');
Authentication.connection = firebaseAdmin.auth();

// Context Aware Server
const RecommendationService = require('./service/recommendation');
RecommendationService.api_url = environment.contextAwareServerUrl;

// Routes loading
const { friends, liveEvents, pointsOfInterest, recommendation, setPrivateKey, notification, cleanExpiredLiveEvents, cleanExpiredRecommendedPoi } = require('./controller');

// RSA private key
const privateKey = fs.readFileSync(
    environment.privateKey, 
    'utf8'
);

setPrivateKey(privateKey);

// Routes configuration
app.use(express.json());
app.use(express.text());
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

app.use('/notification', notification);

// HTTPS initialization
const options = {
    key: fs.readFileSync(environment.certificateKey),
    cert: fs.readFileSync(environment.certificateCert)
};

// Server setup
const port = parseInt(environment.serverPort);
https.createServer(options, app).listen(port, () => {
    console.log('Server started on port ' + port);
});

const intervalCleanLiveEvents = parseInt(environment.cleanLiveEventsSecondsInterval) * 1000;
// One-shot clean on startup + interval
function cleanLiveEvents() {
    console.info('Cleaning expired live events (if any)...');
    cleanExpiredLiveEvents().then(() => {
        console.info('...cleaned expired live events!');
    });
    
    return cleanLiveEvents;
}
setInterval(cleanLiveEvents(), intervalCleanLiveEvents);

const intervalCleanRecommendationPoi = parseInt(environment.cleanRecommendationNotificationSecondsInterval) * 1000;
// One-shot clean on startup + interval
function cleanRecommendedPoi() {
    console.info('Cleaning old recommended poi (if any)...');
    cleanExpiredRecommendedPoi().then(() => {
        console.info('...cleaned old recommended poi!');
    });
    
    return cleanLiveEvents;
}
setInterval(cleanRecommendedPoi(), intervalCleanRecommendationPoi);
