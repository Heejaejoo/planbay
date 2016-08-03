'use strict';
angular.module('planBay')
    .controller('IndexController', ['$scope',function($scope) {

    }])

    .controller('LandingController', ['$scope',function($scope) {
        $scope.registerForm = {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        }
    }])

    .controller('HomeController',  ['$scope',function($scope) {

    }])

    .controller('MoreController',  ['$scope',function($scope) {
        
    }])
;
//example
//.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

