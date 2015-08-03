'use strict';

var _ = require('lodash');
var YelpResponse = require('./yelpResponse.model');

// Get list of yelpResponses
exports.index = function(req, res) {
  YelpResponse.find(function (err, yelpResponses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(yelpResponses);
  });
};

exports.yelp = function(req, res) {
  var yelp = require("yelp").createClient({
    consumer_key: process.env.YELP_ID,
    consumer_secret: process.env.YELP_SECRET,
    token: process.env.YELP_TOKEN,
    token_secret: process.env.YELP_TOKEN_SECRET,
    ssl: true
  });
  var place = req.body.place||"San Francisco, CA";
  yelp.search({term: "bar", location: place}, function(error, data) {
    console.log(error);
    return res.status(200).json(data);
  });
  
};

// Get a single yelpResponse
exports.show = function(req, res) {
  YelpResponse.findById(req.params.id, function (err, yelpResponse) {
    if(err) { return handleError(res, err); }
    if(!yelpResponse) { return res.status(404).send('Not Found'); }
    return res.json(yelpResponse);
  });
};

// Creates a new yelpResponse in the DB.
exports.create = function(req, res) {
  YelpResponse.create(req.body, function(err, yelpResponse) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(yelpResponse);
  });
};

// Updates an existing yelpResponse in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  YelpResponse.findById(req.params.id, function (err, yelpResponse) {
    if (err) { return handleError(res, err); }
    if(!yelpResponse) { return res.status(404).send('Not Found'); }
    var updated = _.merge(yelpResponse, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(yelpResponse);
    });
  });
};

// Deletes a yelpResponse from the DB.
exports.destroy = function(req, res) {
  YelpResponse.findById(req.params.id, function (err, yelpResponse) {
    if(err) { return handleError(res, err); }
    if(!yelpResponse) { return res.status(404).send('Not Found'); }
    yelpResponse.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}