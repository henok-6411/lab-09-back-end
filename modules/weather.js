'use strict';
// DEPENDENCIES 
//Henok g
const superagent = require('superagent');

//WEATHER CONSTRACTOR . 
function Weather(weatherObj) {
  this.forecast = weatherObj.summary
  this.time = new Date(weatherObj.time * 1000).toString().slice(0, 15);
}

// WEATHERHANDLER FUNCTION . 
function weatherHandler(request, response) {
  try {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    let weatherURL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
    console.log(weatherURL);

    superagent.get(weatherURL)
      .then(data => {
        console.log(data);
        const forecastArray = data.body.daily.data.map(object => new Weather(object));
        response.send(forecastArray);
      })
  }
  catch (error) {
    errorHandler('something went wrong', request, response);
  }
}

// FUNCITON FOR ERRORHANDLER .
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

///CONNECTING MY FUNCTION WITH MODULE . 
module.exports = weatherHandler;
