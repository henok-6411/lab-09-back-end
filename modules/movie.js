'use strict';
/// DECLARING DEPENDENCIES
const superagent = require('superagent');




/// MOVIE CONSTRACTOR FUNCTION .
function Movie(movieName) {
  this.title = movieName.title;
  this.overview = movieName.overview;
  this.average_votes = movieName.vote_avarage;
  this.total_votes = movieName.vote_count;
  this.image_url = `https://image.tmdb.org/t/p/w500${movieName.poster_path}`;
  this.popularity = movieName.popularity;
  this.released_on = movieName.release_date;
}

// Movie Handler function   .
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

// FUNCTIN FOR ERROR . 
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

module.exports = moviesHandler;