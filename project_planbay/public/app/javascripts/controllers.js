'use strict';
angular.module('planBay')
    .controller('DetailController', ['$scope','$location', function($scope, $location) {
        $scope.abc = true;
        $scope.goback = function(before) {
            $location.path(before);
        }
    }])
    .controller('AnimateController', ['$scope', function($scope){
        $scope.pageClass = 'Detail';
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
    }])
        
    .controller('MypageController',  ['$scope',function($scope) {
        
    }])
        
    .controller('MyplanController',  ['$scope',function($scope) {
        
    }])
        
    }]);

