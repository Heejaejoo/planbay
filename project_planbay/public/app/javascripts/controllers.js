angular.module('planBay')
    .controller('DetailController', ['$scope','$state','$stateParams','planFactory','cmtFactory','ratingFactory','$location', function($scope,$state,$stateParams,planFactory, cmtFactory, ratingFactory, $location) {
        
        $scope.plan = {};
        $scope.showPlan = false;
        $scope.message = "Loading ...";
        $scope.stars = 0;
        $scope.feedback = {
            comment:''
        }
        $scope.rating = {
            rating: 0
        }
        $scope.ratingOnly = false;
        
        $scope.plan = planFactory.get({
                id: $stateParams.planId
        })
        .$promise.then(
            function (response) {
                $scope.plan = response;
                $scope.showPlan = true;
                $scope.stars = $scope.plan.ratingsNum===0?0:($scope.plan.ratingsSum/$scope.plan.ratingsNum).toFixed(1);
            },function (response) {
                $scope.message = "Error: " + response.status + " " + response.statusText;
            }
        );            
        
        $scope.goback = function (before) {
            $location.path(before);
        };
        
        $scope.submitComment = function () {
            if(!($scope.ratingOnly)){
                cmtFactory.save({id:$stateParams.planId}, $scope.feedback);
            }
            ratingFactory.save({id:$stateParams.planId}, $scope.rating);
            $state.go($state.current, {}, {reload: true});
            if(!($scope.ratingOnly)){
                $scope.feedback={
                     comment:'' 
                };
            }
            $scope.rating = {
                rating: 0
            };
        }
    }])

    .controller('LandingController', ['$scope',function($scope) {

    }])

    .controller('RegistrationController', ['$scope', '$localStorage', 'AuthFactory', function($scope, $localStorage, AuthFactory) {

        $scope.registerForm = {
            name:"",
            username:"",
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
            username:"",
            password:""
        };
        
        $localStorage.getObject('userinfo','{}');
        
        $scope.doLogin = function() {
        
        AuthFactory.login($scope.loginForm);

        };
        
    }])

    .controller('MypageController',  ['$scope', function($scope) {
        
    }])

    .controller('ProfileController',  ['$scope', '$routeParams', 'ProfileFactory', 'AuthFactory', function ($scope, $routeParams, ProfileFactory, AuthFactory) {
        
        $scope.profileForm = {
            name:""
        };

        $scope.userinfo = AuthFactory.getUserinfo();
        
        var user = ProfileFactory.get({ id:$routeParams.id });
        
        $scope.doUpdate = function() {
            ProfileFactory.update({ id:$routeParams.id }, user);
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
    
    .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userinfo = {};
    
        if(AuthFactory.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.username = AuthFactory.getUsername();
            $scope.userinfo = AuthFactory.getUserinfo();
        }
    
        $scope.logOut = function() {
            AuthFactory.logout();
            $scope.loggedIn = false;
            $scope.username = '';
            $scope.userinfo = {};
        };
    
        $rootScope.$on('login:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $scope.userinfo = AuthFactory.getUserinfo();
        });
        
        $rootScope.$on('registration:Successful', function () {
            $scope.loggedIn = AuthFactory.isAuthenticated();
            $scope.username = AuthFactory.getUsername();
            $scope.userinfo = AuthFactory.getUserinfo();
        });
    
        $scope.stateis = function(curstate) {
            return $state.is(curstate);  
        };
    
    }])

    .controller('WunderController', ['$scope', '$stateParams', function($scope, $stateParams) {
        $scope.token = $stateParams.token;
        
        var WunderlistSDK = window.wunderlist.sdk;
        var WunderlistAPI = new WunderlistSDK({
          'accessToken': $stateParams.token,
          'clientID': '3d53d79c4b15cfd87ba0'
        });
        
        WunderlistAPI.http.lists.all()
            .done(function (lists) {
                $scope.lists = lists;
                console.log(lists);
            })
            .fail(function () {
                console.error('there was a problem');
            });
        
        $scope.exportToWunderlist = function(listID) {
            //TODO: export all the tasks to the list which has this listID
        };
        
        $scope.listID;
        $scope.taskTitle;
        
        $scope.postTask = function() {
            console.log($scope.listID);
            console.log($scope.taskTitle);
            WunderlistAPI.http.tasks.create({
              'list_id': parseInt($scope.listID),
              'title': $scope.taskTitle
            })
            .done(function (taskData, statusCode) {
              console.log("post task success!");
            })
            .fail(function (resp, code) {
              console.log("post task fail!");
            });
        };
        
        $scope.dueDate = {
            'Mon': true,
            'Tue': true,
            'Wed': true,
            'Thu': true,
            'Fri': true,
            'Sat': true,
            'Sun': true
        };
        
    }])

    ;