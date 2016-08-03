'use strict';
angular.module('planBay')
    .controller('IndexController', ['$scope',function($scope) {

    }])

    .controller('RegistrationController', ['$scope',function($scope) {

        $scope.registerForm = {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        };
        
        $scope.re= /[a-zA-Z][0-9]/;
        
    }])

    .controller('HomeController',  ['$scope',function($scope) {

    }])

    .controller('MoreController',  ['$scope',function($scope) {
        
    }])

    .controller('LoginController', ['$scope',function($scope) {
        
        $scope.loginForm = {
            email:"",
            password:""
        }
        
    }])
;
//example
//.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

