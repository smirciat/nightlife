/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var YelpResponse = require('./yelpResponse.model');

exports.register = function(socket) {
  YelpResponse.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  YelpResponse.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('yelpResponse:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('yelpResponse:remove', doc);
}