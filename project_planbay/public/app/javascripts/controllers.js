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
        
    }]);
//example
//.controller('MenuController', ['$scope', 'menuFactory', function($scope, menuFactory) {

