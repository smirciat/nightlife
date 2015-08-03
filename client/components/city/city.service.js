'use strict';

angular.module('workspaceApp')
  .factory('city', function () {
    var savedData = {name:'None Yet'};
    function set(data) {
      savedData = data;
    }
    function get() {
      return savedData;
    }
    return {
      savedData:savedData,
      set:set,
      get:get
    };
});
