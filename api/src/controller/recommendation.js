let express = require('express');
let router = express.Router();

const recommendationService = require('../service/recommendation');
const auth = require('../service/auth');
const APIError = require('../model/error');




router.get('/accuracy', async (req, res) => {
    const query = req.query;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != query.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${query.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${query.user}.`)).send();
        return;
    }
    
    res.json(await recommendationService.getAccuracy()).status(200).send();
});

router.get('/places', async (req, res) => {
    const query = req.query;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != query.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${query.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${query.user}.`)).send();
        return;
    }
    const place_predicted = await recommendationService.getPlace(query)
    let js = {"place_predicted":place_predicted}
    res.json(js).status(200).send();
});

router.get('/validity', async (req, res) => {
    console.log("DENTRO VALIDITY");

    // need cast of element of query
    const query = req.query;
    const token = auth.parseHeaders(req.headers);
    /*if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != query.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${query.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${query.user}.`)).send();
        return;
    }*/
    console.log("PRIMA SERVICE VALIDITY");

    const is_place_good = await recommendationService.getValidity(query)
    let js = {"is_place_good":is_place_good}

    // { is_place_good: '{"validate":true}\n' }
    console.log("RITORNO VALIDITY SERVICE ", js);

    res.json(js).status(200).send();
});


router.post('/train', async (req, res) => {
    const body = req.body;
    const token = auth.parseHeaders(req.headers);
    if(token === null) {
        console.error('> Status code 401 - Token not available.');
        res.status(401).json(APIError.build('Token not available.')).send();
        return;
    }
    let user = await auth.verifyToken(token);
    if(user === null || user != body.sender) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.sender}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.sender}.`)).send();
        return;
    }
    // await solo se vogliamo vedere il risultato nel server

    const train_result = await recommendationService.testModel(body)
    let js = {"train_result":train_result}
    res.json(js).status(200).send();
});

module.exports = router;
