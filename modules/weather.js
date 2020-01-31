'use strict';

// Load environment variables from the .env

const superagent = require('superagent');

// Weather Object Constructor

function Weather(weatherObj) {
  this.forecast = weatherObj.summary
  this.time = new Date(weatherObj.time * 1000).toString().slice(0, 15);
}

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
// Error Handler
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = weatherHandler;
