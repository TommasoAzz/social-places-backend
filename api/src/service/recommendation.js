const superagent = require('superagent');
const options_accuracy = {
    hostname: 'localhost',
    port: 4000,
    path: '/recommendation/accuracy',
    method: 'GET'
},

 options_validity = {
    hostname: 'localhost',
    port: 4000,
    path: '/recommendation/validity',
    method: 'GET'
},
 options_places = {
    hostname: 'localhost',
    port: 4000,
    path: '/recommendation/places',
    method: 'GET'
},
 options_post = {
    hostname: 'localhost',
    port: 4000,
    path: '/recommendation/train',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }
class recommendationService{

    static checkQueryType(query){
        const latitude = query.latitude,
        longitude = query.longitude,
        human_activity = query.human_activity,
        date_time = query.date_time
        

        if(!(typeof(latitude) === 'float')) {
            console.error(`Argument ${latitude} is not a float`);
            throw TypeError(`Argument ${latitude} is not a float`);
        }
        if(!(typeof(longitude) === 'float')) {
            console.error(`Argument ${longitude} is not a float`);
            throw TypeError(`Argument ${longitude} is not a float`);
        }
        if(!(typeof(human_activity) === 'string')) {
            console.error(`Argument ${human_activity} is not a string`);
            throw TypeError(`Argument ${human_activity} is not a string`);
        }

        if(!(typeof(date_time) === 'string')) {
            console.error(`Argument ${date_time} is not a string`);
            throw TypeError(`Argument ${date_time} is not a string`);
        }

        if(query.hasOwnProperty('place_category')){
            const place_category = query.place_category
            if(!(typeof(place_category) === 'string')) {
                console.error(`Argument ${place_category} is not a string`);
                throw TypeError(`Argument ${place_category} is not a string`);
            }
        }
    }
    static async getValidity(query) {
        console.log("DENTRO VALIDITY SERVICE");
        
        //this.checkQueryType(query);

        var validity_result = {}
        try{
            validity_result = await superagent
            .get('http://context_aware:4000/recommendation/validity')
            .query(query);
            let response = validity_result.text;
            return response;
        }
        catch(error){
            console.log("Validity get this error ",error);
        }
        console.log("RITORNO VALIDITY SERVICE");

        return null;
    }
    
    static async getPlace(query) {
        this.checkQueryType(query);
        var places_result = {}
        try{
            places_result = await superagent
            .get('http://context_aware:4000/recommendation/places')
            .query(query);
            let response = validity_result.text;
            return response;
        }
        catch(error){
            console.log("Places_result get this error ",error);
        }
        return null;

    }

    static async getAccuracy(query) {
        this.checkQueryType(query);

        var accuracy_result = {}
        try{
            accuracy_result = await superagent
            .get('http://context_aware:4000/recommendation/accuracy')
            .query(query);
            let response = validity_result.text;
            return response;
        }
        catch(error){
            console.log("Accuracy get this error ",error);
        }
        return null;

    }

    static async testModel(body){
        this.checkQueryType(body);
        var train_result = {}
        try{
            train_result = await superagent
            .post('http://context_aware:4000/recommendation/train')
            .query(body);
            let response = validity_result.text;
            return response;
        }
        catch(error){
            console.log("Test model get this error ",error);
        }
        return null;
        
    }
}
module.exports = recommendationService;