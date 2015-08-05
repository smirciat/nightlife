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
        $scope.userList=data;
        //socket.syncUpdates('yelpResponse', $scope.userList);
        var record = data.filter(function(element){
          return ($scope.getCurrentUser()._id==element.userId);
        });
        if (record[0]){
          $scope.userListCurrent=record[0];
          city.set({name:record[0].city});
          $scope.hasLocation=true
          $scope.buildBusinesses();
        }
      });
      
    }
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('yelpResponse');
    });
    $scope.reset = function(){
      $scope.hasLocation=false;
    };
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
                                                            userId: $scope.getCurrentUser()._id,
                                                            going:[]});
          }
          else {
            $http.post('api/yelpResponses', { city: $scope.city.get().name,
                                              userId: $scope.getCurrentUser()._id,
                                              going:[]});
          }
        });
      }
      $scope.buildBusinesses();
    };
    
    $scope.buildBusinesses = function(){
      $http.post('/api/yelpResponses/yelp',{place:$scope.city.get().name}).success(function(data) {
        $scope.businesses=data.businesses;
        //socket.syncUpdates('yelpResponse', $scope.businesses);
        $scope.hasLocation=true;
        console.log($scope.businesses);
      });
    };
   
    $scope.gotoYelp = function(url){
      $window.open(url);
    };
  })
  .controller('InnerCtrl', function ($scope, $http, socket, Auth) {
    var notGoing="btn btn-danger";
    var going="btn btn-success";
    //is current user going
    $scope.isGoing=[];
    $scope.amIGoing = function(itemUrl, itemIndex){
      $scope.isGoing[itemIndex]=false;
      for (var i=0;i<$scope.userListCurrent.going.length;i++){
        if ($scope.userListCurrent.going[i].url==itemUrl) $scope.isGoing[itemIndex]=true;
      }
    };
    
    $scope.setNumGoing=function(url){
      if (!Auth.isLoggedIn()) {
        $scope.numGoing=0;
      }
      else {
        //return total number of users going array includes url
          var records =$scope.userList.filter(function(element){
            var included=false;
            element.going.forEach(function(e){
              if (e.url==url) included = true;
            });
            return included;
          });
          $scope.numGoing={count:records.length};
      }
    };
    $scope.init = function(url, index){
      $scope.setNumGoing(url);
      $scope.amIGoing(url, index);
    };
    
    $scope.addGoing = function(itemUrl, itemIndex){
      if (!Auth.isLoggedIn()) return;
      //toggle current user to have going element matching url
      //does current user have url in going[]?
      //yes - remove that element, no - add that element
      //toggle $scope.buttonClass
      var record = $scope.userList.filter(function(element){
            return (Auth.getCurrentUser()._id==element.userId);
      });
      //console.log(record);
      var itemGoing;
      
      
      if (!$scope.isGoing[itemIndex]) {
        $scope.isGoing[itemIndex]=true;
        $scope.numGoing.count++; 
          if (record[0]){
            //add url to going array
            
            record[0].going.push({url:itemUrl});
            //update record
            
            $http.put('/api/yelpResponses/'+ record[0]._id,{going:record[0].going});
          }
      }
      else {
        
        $scope.isGoing[itemIndex]=false;
        console.log($scope.isGoing[itemIndex]);
        $scope.numGoing.count--;  
          if (record[0]){
            //remove url from going array
            itemGoing = record[0].going.filter(function(element){
              return (element.url!=itemUrl);
            });
            record[0].going=itemGoing;
            //update record
            $http.put('/api/yelpResponses/'+ record[0]._id,{going:itemGoing});
          }
      }
    };
    
  });
