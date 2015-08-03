'use strict';

angular.module('workspaceApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, city) {
    $scope.city = city;
    $scope.menu = [{
      'title': 'Home' ,
      'link': '/'
    }];
    
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $scope.city.set({name:"None Yet"});
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });