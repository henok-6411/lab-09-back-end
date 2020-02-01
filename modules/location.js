'use strict';
/// OUR DEPENDENCIES. 
// Henok G.
const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));
client.connect();


// Location Object Constructor
function Location(city, geoData) {
  this.city = city;
  this.formatted_query = geoData.display_name;
  this.latitude = geoData.lat;
  this.longitude = geoData.lon;
}

// Location Functions .   
function locationHandler(request, response) {
  // city is a query parameter : example location?city='denver'&name='bob'
  let city = request.query.city;
  let SQL = `SELECT * FROM locations WHERE city='${city}';`;
  // client.query executes sql commands
  client.query(SQL)
    .then(results => {
      if (results.rows.length > 0) {
        response.send(results.rows[0]);
      } else {
        try {
          // //Getting info for object
          // const city = request.query.city;
          let key = process.env.GEOCODE_API_KEY;
          let url = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json&limit=1`;
          superagent.get(url)
            .then(data => {
              const geoData = data.body[0]; //first item
              const locationData = new Location(city, geoData);
              const { city, formatted_query, latitude, longitude } = locationData;
              let apiToSQL = `INSERT INTO locations (city, formattedquery, latitude, longitude) VALUES ('${city}', '${formatted_query}', '${latitude}', '${longitude}');`;

              client.query(apiToSQL);
              response.send(locationData);
            })
            .catch(() => {
              errorHandler('something went wrong!', request, response);
            });
        }
        catch (error) {
          errorHandler('it went wrong.', request, response);
        }
      }
    });
}

//// ERROR HANDLER FUNCTION .
function errorHandler(error, request, response) {
  response.status(500).send(error);
}


///// EXPORT LOCATIONHANDLER . 
module.exports = locationHandler;