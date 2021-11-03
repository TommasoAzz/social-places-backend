const dotenv = require('dotenv');

// Environment loading
dotenv.config();

const firebaseSDK = process.env.FIREBASE_SDK === undefined ? '' : '../' + process.env.FIREBASE_SDK;
const firebaseURL =  process.env.FIREBASE_URL === undefined ? '' : process.env.FIREBASE_URL;
const certificateKey = process.env.CERTIFICATE_KEY === undefined ? '' : process.env.CERTIFICATE_KEY;
const certificateCert = process.env.CERTIFICATE_CERT === undefined ? '' : process.env.CERTIFICATE_CERT;
const serverPort = process.env.SERVER_PORT === undefined ? '3000' : process.env.SERVER_PORT;
const contextAwareServerUrl = process.env.CONTEXT_AWARE_SERVER_URL === undefined ? 'http://localhost:4000/' : process.env.CONTEXT_AWARE_SERVER_URL;
const cleanLiveEventsSecondsInterval = process.env.CLEAN_LIVE_EVENTS_SECONDS_INTERVAL === undefined ? '10800' : process.env.CLEAN_LIVE_EVENTS_SECONDS_INTERVAL;

function printConfiguration() {
    console.info('Firebase SDK file: ' + firebaseSDK);
    console.info('Firebase URL: ' + firebaseURL);
    console.info('HTTPS Certificate key: ' + certificateKey);
    console.info('HTTPS Certificate cert: ' + certificateCert);
    console.info('HTTPS Server port: ' + serverPort);
    console.info('Context-Aware Server URL: ' + contextAwareServerUrl);
    console.info('Clean live events interval (seconds): ' + cleanLiveEventsSecondsInterval);
}

const index = {
    printConfiguration,
    firebaseSDK,
    firebaseURL,
    certificateKey,
    certificateCert,
    serverPort,
    contextAwareServerUrl,
    cleanLiveEventsSecondsInterval
};

module.exports = index;