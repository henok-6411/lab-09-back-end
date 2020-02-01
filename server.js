/* eslint-disable no-trailing-spaces */
'use strict';
///Henok G
// Load environment variables from the .env
require('dotenv').config();
// DECLARING DEPENDENCIES 
const express = require('express');
const cors = require('cors');
//APPLICATION SETUP 
const PORT = process.env.PORT;
// const superagent = require('superagent');
const pg = require('pg');


// Application setup
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.err('pg problems', err));
const app = express();
app.use(cors());

// ROUTES
// route syntax = app.<operation>('route', callback);
// Home page route for server testing
app.get('/', (request, response) => {
  response.send('home page!');
});

// CONNECTING OUR MODULE FUNCTION WITH OUR ROUTES. 
const locationHandler = require('./modules/location.js');
const moviesHandler = require('./modules/movie.js');
const weatherHandler = require('./modules/weather.js');
const yelpHandler = require('./modules/yelp.js');
const eventsHandler = require('./modules/event.js');


/// ROUTES TO SERVER 

app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/events', eventsHandler);
app.get('/yelp', yelpHandler);
app.get('/movies', moviesHandler);



app.listen(PORT, () => console.log(`Server up on port ${PORT}`));

