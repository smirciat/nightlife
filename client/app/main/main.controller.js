'use strict';

angular.module('workspaceApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth, city, $window) {
    $scope.city=city;
    $scope.hasLocation=false;
    $scope.businesses=[];
    $scope.getCurrentUser=Auth.getCurrentUser;
    $scope.isLoggedIn=Auth.isLoggedIn;
    $scope.userRecord={};
    
    $scope.checkLogin = function(callback){
      if ($scope.isLoggedIn()){
        $http.get('/api/yelpResponses').success(function(data){
          //find record with userID matching id of current user
          var record = data.filter(function(element){
            return ($scope.getCurrentUser()._id==element.userId);
          });
          $scope.userRecord=record[0];
          callback();
        });
      }
    };
    
    $scope.checkLogin(function(){
      if ($scope.userRecord!==undefined){
          $scope.city.set({name:$scope.userRecord.city});
          $scope.hasLocation=true;
          //$scope.buildBusinesses();
          if ($scope.userRecord!==undefined){
            
          }
      }
    });
      
    $scope.setLocation = function(){
      $scope.city.set({name:$scope.place});
      $scope.place='';
      $scope.checkLogin(function(){
        if ($scope.userRecord!==undefined){
            $http.put('/api/yelpResponses/'+ $scope.userRecord._id,{city: $scope.city.get().name,
                                                            userId: $scope.getCurrentUser()._id});
          }
        else {
            $http.post('api/yelpResponses', { city: $scope.city.get().name,
                                              userId: $scope.getCurrentUser()._id});
        }
      });
      $scope.buildBusinesses();
    };
    
    $scope.buildBusinesses = function(){
      $http.post('/api/yelpResponses/yelp',{place:$scope.city.get().name}).success(function(data) {
        $scope.businesses=[];
        for (var i=0;i<20;i++){
          $scope.businesses.push({name: data.businesses[i].name,
                                  url: data.businesses[i].url,
                                  image: data.businesses[i].image_url,
                                  address: data.businesses[i].location.address[0],
                                  cross_streets: data.businesses[i].location.cross_streets
          });
        }
        
        $scope.checkLogin(function(){
          
          if ($scope.userRecord!==undefined){
            $http.put('/api/yelpResponses/'+ $scope.userRecord._id,{city: $scope.city.get().name,
                                                            userId: $scope.getCurrentUser()._id,
                                                            businesses: $scope.businesses
            });
          }
          else {
            $http.post('api/yelpResponses', { city: $scope.city.get().name,
                                              userId: $scope.getCurrentUser()._id,
                                              businesses: $scope.businesses
            });
          }
        });
        $scope.hasLocation=true;
      });
    };
    
    $scope.gotoYelp = function(url){
      $window.open(url);
    };
    
  })
  .controller('InnerCtrl', function ($scope, $http, socket, Auth, city, $window) {
    $scope.buttonClass="btn btn-warning";
    $scope.numGoing=0;
    
  });
