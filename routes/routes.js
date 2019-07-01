//load express so we can control our endpoint via routing
const express = require('express');

const router = express.Router();

//allows us to make a query string from a json object
const queryString = require('querystring');

//handles the http request and response for us
const request = require('request');

//base nasa api url path
const nasaQueryRoot = 'https://api.nasa.gov/neo/rest/v1/feed?';

//handle the post request with json in the body
//The NASA api will use the start and end date
//1) build our api query string
//2) send a get request to the api
//      after we get our response we will determine if there was an error or if we have results
//      1) if there was an error - process error and return
//      2) else if the query returned no results within the date range - process empty list and return
//      3) if the query returned results within the date range then we need to filter based on given distance value
//      need to query result set on miss-distance.miles
router.post('/', (req, res) => {
    const resultSet = {"asteroids":[]};
    const queryParams = {};
    //setup query params needed to build our query string
    queryParams.start_date = req.body.dateStart;
    queryParams.end_date = req.body.dateEnd;
    queryParams.detailed = true;
    queryParams.api_key = 'DEMO_KEY';

    //build the query part of the string and concatenate with root api url
    queryUp = queryString.stringify(queryParams);
    const httpGet = nasaQueryRoot + queryUp;

    //add remaining params to json object
    queryParams.distance = req.body.within.value;
    queryParams.units    = 'miles';

    //process request
    request(httpGet, {json: true}, (err, queryResponse, body) => {
        if('http_error' in body){
            return res.send({'error': true});
        }
        else if(body.element_count > 0){
            const near_earth_objects = body.near_earth_objects;

            Object.entries(near_earth_objects).forEach(
                ([key, value]) => {
                    for (let i = 0; i < value.length; i++){
                        for (let j = 0; j < value[i].close_approach_data.length; j++){
                            if(value[i].close_approach_data[j].miss_distance.miles <= queryParams.distance){
                                resultSet.asteroids.push(value[i].name);
                            }
                        }
                    }        
            });
                    
            return res.send(resultSet);    
        }
        else {
            return resultSet;
        }
    });
});

module.exports = router;