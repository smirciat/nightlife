'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var YelpResponseSchema = new Schema({
  userId: String,
  city: String,
  going: [{url:String}]
});

module.exports = mongoose.model('YelpResponse', YelpResponseSchema);