const dotenv = require('dotenv');

// Environment loading
dotenv.config();

const firebaseSDK = '../' + process.env.FIREBASE_SDK;
const firebaseURL =  process.env.FIREBASE_URL;
const certificateKey = process.env.CERTIFICATE_KEY;
const certificateCert = process.env.CERTIFICATE_CERT;
const serverPort = process.env.SERVER_PORT;
const contextAwareServerUrl = process.env.CONTEXT_AWARE_SERVER_URL;

const index = {
    firebaseSDK,
    firebaseURL,
    certificateKey,
    certificateCert,
    serverPort,
    contextAwareServerUrl
};

module.exports = index;