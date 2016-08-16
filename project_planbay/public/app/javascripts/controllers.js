angular.module('planBay')
    .controller('DetailController', ['$scope','$state','$stateParams','planFactory','cmtFactory','$location', function($scope,$state,$stateParams,planFactory, cmtFactory, $location) {
        
        $scope.plan = {};
        $scope.showPlan = false;
        $scope.message = "Loading ...";
        $scope.stars = 0;
        $scope.plan = planFactory.get({
                id: $stateParams.planId
        })
        .$promise.then(
            function (response) {
                $scope.plan = response;
                $scope.showPlan = true;
                $scope.stars = $scope.plan.ratingsNum==0?0:$scope.plan.ratingsSum/$scope.plan.ratingsNum;
            },function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );            
        
        $scope.goback = function (before) {
            $location.path(before);
        };
        $scope.ratingInput = 0;
    
        $scope.commentSubmit = function () {
             cmtFactory.save({id:$stateParams.planId}, $scope.inputText);
             $state.go($state.current, {}, {reload: true});
             $scope.commentForm.$setPristine();
             $scope.inputText='';
            };
    }])

    .controller('AnimateController', ['$scope', function($scope){
        $scope.pageClass = 'Detail';
    }])

    .controller('LandingController', ['$scope',function($scope) {

    }])

    .controller('RegistrationController', ['$scope', '$localStorage', 'AuthFactory', function($scope, $localStorage, AuthFactory) {

        $scope.registerForm = {
            name:"",
            email:"",
            password:"",
            confirmPassword:""
        };

        $scope.re= /[a-zA-Z][0-9]/;
        
        $scope.doRegister = function() {
        console.log('Doing registration', $scope.registerForm);

        AuthFactory.register($scope.registerForm);

    };
        
    }])

    .controller('HomeController',  ['$scope', 'planFactory',function($scope, planFactory) {
            planFactory.query(
            function(response){
                    $scope.plans = response;
                 },
            function(response){
                    $scope.message = "Error: " + response.status + " "+ response.statusText;
            });
    }])

    .controller('MoreController',  ['$scope',function($scope) {

    }])

    .controller('LoginController', ['$scope', '$localStorage', 'AuthFactory', function($scope, $localStorage, AuthFactory) {

        $scope.loginForm = {
            email:"",
            password:""
        };
        
        $localStorage.getObject('userinfo','{}');
        
        $scope.doLogin = function() {
        
        AuthFactory.login($scope.loginForm);

        };
        
    }])

    .controller('MypageController',  ['$scope', function($scope) {
        
    }])

    .controller('MyplanController',  ['$scope',function($scope) {

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
    
    .controller('WunderController',  ['$scope', function($scope) {
        $scope.token='';
    }])

    ;