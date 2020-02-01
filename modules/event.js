'use strict';
/// DEPENDENSIES .
const superagent = require('superagent');
// Events Constructor
function Event(eventsObj) {
  this.link = eventsObj.url;
  this.name = eventsObj.title;
  this.event_date = eventsObj.start_time;
  this.summary = eventsObj.description;
}
// FUNCTION OF EVENTSHANDLER
function eventsHandler(request, response) {
  try {
    const latitude = request.query.latitude;
    const longitude = request.query.longitude;
    let eventurl = `http://api.eventful.com/json/events/search?app_key=${process.env.EVENTFUL_API_KEY}&keywords=books&where=${latitude},${longitude}&within=7&date=Future&page_size=20`;
    // console.log(eventurl);
    superagent.get(eventurl)
      .then(data => {
        // console.log('test');
        let obj = JSON.parse(data.text);
        let parsedObj = obj.events.event;
        // console.log(parsedObj);
        let eventsarray = parsedObj.map(object => new Event(object));
        response.send(eventsarray);
      })
  } catch (error) {
    errorHandler('something went wrong', request, response);
  }
}
// ERROR FUNCITON 
function errorHandler(error, request, response) {
  response.status(500).send(error);
}
/// CONNECTING OUR MODULE. 
module.exports = eventsHandler;