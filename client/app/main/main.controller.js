'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, city, $window) {
    $scope.city=city;
    $scope.hasLocation=false;
    $scope.businesses=[];
    $scope.getCurrentUser=Auth.getCurrentUser;
    $scope.isLoggedIn=Auth.isLoggedIn;
    if ($scope.isLoggedIn()){
      $http.get('/api/yelpResponses').success(function(data){
        //find record with userID matching id of current user
        var record = data.filter(function(element){
          return ($scope.getCurrentUser()._id==element.userId);
        });
        if (record[0]){
          city.set({name:record[0].city});
          $scope.hasLocation=true
          $scope.buildBusinesses();
        }
      });
      
    }
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
    
    $scope.setLocation = function(){
      $scope.city.set({name:$scope.place});
      $scope.place='';
      if ($scope.isLoggedIn()){
        $http.get('/api/yelpResponses').success(function(data){
          //find record with userID matching id of current user
          var record = data.filter(function(element){
            return ($scope.getCurrentUser()._id==element.userId);
          });
          if (record[0]){
            $http.put('/api/yelpResponses/'+ record[0]._id,{city: $scope.city.get().name,
                                                            userId: $scope.getCurrentUser()._id});
          }
          else {
            $http.post('api/yelpResponses', { city: $scope.city.get().name,
                                              userId: $scope.getCurrentUser()._id});
          }
        });
      }
      $scope.buildBusinesses();
    };
    
    $scope.buildBusinesses = function(){
      $http.post('/api/yelpResponses/yelp',{place:$scope.city.get().name}).success(function(data) {
        $scope.businesses=data.businesses;
        $scope.hasLocation=true;
        console.log($scope.businesses);
      });
    };
    $scope.gotoYelp = function(url){
      $window.open(url);
    };
  });
