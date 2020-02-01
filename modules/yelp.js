'use strict';
//DEPENDENCIES 
const superagent = require('superagent');

////// YELP CONSTRACTOR FUNCTION

// Load environment variables from the .env

const superagent = require('superagent');


function Yelp(yelpData) {
  this.name = yelpData.name;
  this.image_url = yelpData.image_url;
  this.price = yelpData.price;
  this.rating = yelpData.rating;
  this.url = yelpData.url;
}

// FUNCTION YELP HANDLER 

function yelpHandler(request, response) {
  let city = request.query.city;
  let url = `https://api.yelp.com/v3/businesses/search?location=${city}`;
  superagent.get(url)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .then(data => {
      let yelpCall = data.body.businesses.map(value => new Yelp(value));
      response.send(yelpCall);
    })
    .catch(() => {
      errorHandler('sorry!!', request, response);
    })
}
// ERROR HANDLER .
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
/// CONNECT MODULE 

}

function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = yelpHandler;
