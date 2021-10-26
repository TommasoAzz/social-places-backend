let express = require('express');
let router = express.Router();

const recommendation = require('../service/recommendation');
const auth = require('../service/auth');
const APIError = require('../model/api-error');
const RecommendationRequest = require('../model/request-body/recommendation-request');
const ValidationRequest = require('../model/request-body/validation-request');

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

    const result = await recommendation.computeModelAccuracy(user);

    if(result !== null) {
        res.status(200).json(result).send();
    } else {
        res.status(400).send();
    }
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

    const recommendationRequest = new RecommendationRequest(
        user,
        parseFloat(query.latitude + ''),
        parseFloat(query.longitude + ''),
        query.human_activity + '',
        parseInt(query.seconds_in_day + ''),
        parseInt(query.week_day + '')
    );

    const result = await recommendation.recommendPlaceCategory(recommendationRequest);

    if(result !== null) {
        res.status(200).json(result).send();
    } else {
        res.status(400).send();
    }
});

router.get('/validity', async (req, res) => {
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

    const validationRequest = new ValidationRequest(
        user,
        parseFloat(query.latitude + ''),
        parseFloat(query.longitude + ''),
        query.human_activity + '',
        parseInt(query.seconds_in_day + ''),
        parseInt(query.week_day + ''),
        query.place_category + ''
    );

    const result = await recommendation.shouldAdvisePlaceCategory(validationRequest);

    if(result !== null) {
        res.status(200).json(result).send();
    } else {
        res.status(400).send();
    }
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
    if(user === null || user != body.user) {
        console.error(`> Status code 403 - User from the authentication service is ${user} and that from query is ${body.user}.`);
        res.status(403).json(APIError.build(`User from the authentication service is ${user} and that from query is ${body.user}.`)).send();
        return;
    }

    const trainRequest = new ValidationRequest(
        user,
        body.latitude,
        body.longitude,
        body.human_activity,
        parseInt(body.seconds_in_day + ''),
        parseInt(body.week_day + ''),
        body.place_category
    );

    await recommendation.trainAgainModel(trainRequest).then(console.info, console.error);

    res.status(200).send();
});

module.exports = router;
