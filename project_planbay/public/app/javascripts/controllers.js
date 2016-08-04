'use strict';
angular.module('planBay')
    .controller('DetailController', ['$scope',function($scope) {
        $scope.checked = false;
        $scope.size = '100px';

        $scope.toggle = function() {
            $scope.checked = !$scope.checked
        }
    }])
    .controller('LandingController', ['$scope',function($scope) {
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
        
    }]);

