'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var YelpResponseSchema = new Schema({
  userId: String,
  city: String,
  businesses: [{name: String, url: String, image: String, address: String, cross_streets: String}],
  going: {type:Boolean, default:false}
});

module.exports = mongoose.model('YelpResponse', YelpResponseSchema);