angular.module('planBay')
    .controller('DetailController', ['$scope','$location', function($scope, $location) {
        $scope.abc = true;
        $scope.goback = function (before) {
            $location.path(before);
            $scope.stars = 0;
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
    
    }])

    .controller('MypageController',  ['$scope',function($scope) {

    }])

    .controller('ProfileController',  ['$scope',function($scope) {
        
        $scope.showPassword = false;
        $scope.togglePassword = function () {
            $scope.showPassword = !$scope.showPassword;
        };
        
        $scope.showInfo=false;
        $scope.toggleInfo = function () {
            $scope.showInfo = !$scope.showInfo;
        };
        
       
    }])

    .controller('EditController',  ['$scope',function($scope) {
        $scope.plan = [];

        for(var i=1; i <= 30; i++) {
            $scope.plan.push({id:i, 'tasks':[{id:0, 'time':'1:00'}]});
        }

        $scope.days = 12;

        $scope.addNewTask = function(day) {
            var tasks = $scope.plan[day].tasks;
            var lastItem = tasks[tasks.length-1];
            tasks.push({'id':lastItem.id + 1, 'time':'1:00'});
        };

        $scope.removeTask = function(day, task) {
            var tasks = $scope.plan[day].tasks;
            if(tasks.length < 2)
                return;
            var index = tasks.indexOf(task);
            tasks.splice(index, 1);
        };
    }])

    ;
