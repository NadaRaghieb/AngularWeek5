(function () {
    'use strict';
  
    angular.module('RestaurantApp', ['ngRoute'])
      .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
          .when('/my-info', {
            templateUrl: './my-info.html',
            controller: 'MyInfoController'
          })
          .when('/sign-up', {
            templateUrl: 'sign-up.html',
            controller: 'SignUpController'
          })
          .otherwise({ redirectTo: '/my-info' });
      }])
      .controller('MyInfoController', ['$scope', 'UserService', function ($scope, UserService) {
        $scope.userInfo = UserService.getUserInfo();
      }])
      .controller('SignUpController', ['$scope', 'UserService', '$http', function ($scope, UserService, $http) {
        $scope.userInfo = {};
        $scope.errorMessage = '';
  
        $scope.submitForm = function () {
          if ($scope.signUpForm.$valid) {
            var menuNumber = $scope.userInfo.menuNumber;
            $http.get('https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/L/menu_items/' + menuNumber + '.json')
              .then(function (response) {
                if (response.data !== null) {
                  UserService.saveUserInfo($scope.userInfo);
                  $scope.successMessage = 'Your information has been saved.';
                  $scope.errorMessage = '';
                  $scope.userInfo = {};
                } else {
                  $scope.successMessage = '';
                  $scope.errorMessage = 'No such menu number exists.';
                }
              })
              .catch(function () {
                $scope.successMessage = '';
                $scope.errorMessage = 'Error occurred while retrieving menu item.';
              });
          }
        };
      }])
      .factory('UserService', function () {
        var userInfo = {};
  
        return {
          saveUserInfo: function (info) {
            userInfo = info;
          },
          getUserInfo: function () {
            return userInfo;
          }
        };
      });
  })();