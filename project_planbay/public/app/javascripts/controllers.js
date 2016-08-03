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
        
    }]);
//example
//.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

