/* eslint-disable no-trailing-spaces */
'use strict';

// Load environment variables from the .env
require('dotenv').config();

// Declare application dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');


// Application setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.err('pg problems', err));
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// ROUTES
// route syntax = app.<operation>('route', callback);
// Home page route for server testing
app.get('/', (request, response) => {
  response.send('home page!');
});

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
// app.get('/events', eventsHandler);
//app.get('/yelp', yelpHandler);
app.get('/movies', moviesHandler);

// Movie Handler function 

function moviesHandler(request, response) {
  let city = request.query.city;

  let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${city}&page=1&include_adult=false`;
  superagent.get(url)
    .then(data => {
      // console.log(data);
      const movieData = data.body.results.map(value => {
        // console.log(value);
        return new Movie(value)

      });
      // console.log(movieData);
      response.send(movieData);
    })
    .catch(() => {
      errorHandler('sorry!!', request, response);
    })

}

/// MOVIE CONSTRACTOR FUNCTION 

function Movie(movieName) {
  this.title = movieName.title;
  this.overview = movieName.overview;
  this.average_votes = movieName.vote_avarage;
  this.total_votes = movieName.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movieName.poster_path}`;
  this.popularity = movieName.popularity;
  this.released_on = movieName.release_date;

}
////// YELP CONSTRACTOR FUNCTION

// function Yelp(yelpData) {
//   this.name = 
//     this.image_url =
//     this.price =
//     this.rating =
//     this.url = 
// }

//////  


// Location Functions      
function locationHandler(request, response) {
  // city is a query parameter : example location?city='denver'&name='bob'
  let city = request.query.city;
  let SQL = `SELECT * FROM locations WHERE city='${city}';`;
  // client.query executes sql commands
  client.query(SQL)
    // .then waits for a promise to return and will be executed if the request was successful , read 
    .then(results => {
      if (results.rows.length > 0) {
        response.send(results.rows[0]);
      } else {
        try {
          // //Getting info for object
          // const city = request.query.city;
          let key = process.env.GEOCODE_API_KEY;
          let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
          /**
           * superagent makes an api request 
           * .get get is the method used. You can use post for more secure requests
           *  */
          superagent.get(url)
            .then(data => {
              const geoData = data.body[0]; //first item
              const locationData = new Location(city, geoData);
              const { search_query, formatted_query, latitude, longitude } = locationData;
              let apiToSQL = `INSERT INTO locations (city, formattedquery, latitude, longitude) VALUES ('${search_query}', '${formatted_query}', '${latitude}', '${longitude}');`;

              client.query(apiToSQL);
              response.send(locationData);
            })
            // .catch waits will execute if there is an error
            .catch(() => {
              errorHandler('something went wrong!', request, response);
            });
        }
        // .catch waits will execute if there is an error
        catch (error) {
          errorHandler('it went wrong.', request, response);
        }
      }
    });
}

/// location DB pg and cache
// function getLocationData(city) {
//   let SQL = `SELECT * FROM locations WHERE search_query = $1`;
//   let values = [city];

//   return client.query(SQL, values)
//     .then(results => {
//       if (results.rowCount) { return results.rows[0]; }
//       else {



//       }
//     })
// }









// Weather Object Constructor

function Weather(weatherObj) {
  this.forecast = weatherObj.summary
  this.time = new Date(weatherObj.time * 1000).toString().slice(0, 15);
}

// Location Object Constructor
function Location(city, geoData) {
  this.city = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}
// End Location Functions
// Begin Weather Functions

function weatherHandler(request, response) {
  try {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    let weatherURL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;
    // console.log(weatherURL);

    superagent.get(weatherURL)
      .then(data => {
        const forecastArray = data.body.daily.data.map(object => new Weather(object));
        response.send(forecastArray);
      })
  } catch (error) {
    errorHandler('something went wrong', request, response);
  }
}



// End Weather Functions
// Begin Events Functions

function eventsHandler(request, response) {
  try {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    let eventurl = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&keywords=books&where=${latitude},${longitude}&within=7&date=Future&page_size=20`;
    console.log(eventurl);

    superagent.get(eventurl)
      .then(data => {
        console.log('test');
        let obj = JSON.parse(data.text);
        let parsedObj = obj.events.event;
        console.log(parsedObj);
        let eventsarray = parsedObj.map(object => new Event(object));
        response.send(eventsarray);
      })
  } catch (error) {
    errorHandler('something went wrong', request, response);
  }
}

// Error Handler
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Events Constructor
function Event(eventsObj) {
  this.link = eventsObj.url;
  this.name = eventsObj.title;
  this.event_date = eventsObj.start_time;
  this.summary = eventsObj.description;
}

// End Events Functions

// Ensure the server is listening for requests
// ***This must be at the end of the file***

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Server up on port ${PORT}`))
  });
