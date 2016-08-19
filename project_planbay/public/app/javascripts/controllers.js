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
                $scope.stars = $scope.plan.ratingsAvg.toFixed(1);
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
            planFactory.getOrderOfDownloads(
            function(response){
                    $scope.plansDownloadOrdered = response;
                    planFactory.getOrderOfRatings(
                        function(resp){
                            $scope.plansRatingsOrdered = resp;
                        }, function(resp){
                            $scope.message = "Error: " + response.status + " " + response.statusText;
                        });
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

    .controller('ProfileController',  ['$scope', '$state', '$rootScope', '$stateParams', 'ProfileFactory', 'AuthFactory', 'ngDialog', function ($scope, $state, $rootScope, $stateParams, ProfileFactory, AuthFactory, ngDialog) {
        
        $scope.profileForm = {
            name:"",
            password:""
        };

        $scope.userinfo = AuthFactory.getUserinfo();
        
        $scope.doUpdate = function() {
            ProfileFactory.update({ id:$stateParams.userId }, $scope.profileForm,
            function(response){
                AuthFactory.updateUserInfo($scope.profileForm);
                $rootScope.$broadcast('login:Successful');
                $state.go('app.mypage', {}, {reload:true});
            },
            function(response){
                
                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});
                
            });
            
            
        };

    }])
    
    .controller('UploadController', ['$scope', 'upload', function($scope, upload) {
        upload({
          url: '/upload',
          method: 'POST',
          data: {
            aFile: $scope.myFile, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
            }
        }).then(
          function (response) {
          console.log(response.data); // will output whatever you choose to return from the server on a successful upload
        },
          function (response) {
          console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
        });
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
        $scope.listID;
        $scope.taskTitle;
        
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
        
        
        function postTask(listID, title, dueDate) {
            WunderlistAPI.http.tasks.create({
              'list_id': parseInt(listID),
              'title': title,
              'due_date': dueDate.toISOString()
            })
            .done(function (taskData, statusCode) {
              console.log(taskData);
            })
            .fail(function (resp, code) {
              console.log("post task fail!");
            });
        };
        
        $scope.dueDate = {
            'start': new Date(),
            'Mon': true,
            'Tue': true,
            'Wed': true,
            'Thu': true,
            'Fri': true,
            'Sat': true,
            'Sun': true
        };
        
        function getNextDayOfWeek(date, dayOfWeek) {
            var resultDate = new Date(date.getTime());
            resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
            
            return resultDate;
        }
        
        function getDayStr(dayNum) {
            var dayStr;
            
            switch (dayNum % 7) {
                case 0:
                    dayStr = "Sun";
                    break;
                case 1:
                    dayStr = "Mon";
                    break;
                case 2:
                    dayStr = "Tue";
                    break;
                case 3:
                    dayStr = "Wed";
                    break;
                case 4:
                    dayStr = "Thu";
                    break;
                case 5:
                    dayStr = "Fri";
                    break;
                case 6:
                    dayStr = "Sat";
            }
            
            return dayStr;
        }
        
        //this function gives the array of Date which has pattern
        $scope.dueDateGenerator = function(num, duePattern) {
            var dueDates = [];
            var currentDate = duePattern.start;
            var currentDay = currentDate.getDay();
            
            while(num > 0) {
                if(duePattern[getDayStr(currentDay)]) {
                    currentDate = getNextDayOfWeek(currentDate, currentDay);
                    dueDates.push(currentDate);
                    num--;
                }
                
                currentDay++;
            }
            
            return dueDates;
        };
        
        $scope.exportToWunderlist = function(listID, plan, dueDates) {
            var num = plan.length;
            
            if(num !== dueDates.length) {
                console.log("invalid plan and dueDates")
                return;
            }
            
            for(var i = 0; i < num; i++) {
                for(var j = 0; j < plan[i].length; j++) {
                    postTask(listID, plan[i][j].title, dueDates[i]);
                }
            }
        };
        
        /* for testing
        $scope.exportToWunderlist(262265036,
            [[{'title':'a1'}, {'title':'a2'}], [{'title':'b1'}, {'title':'b2'}, {'title':'b3'}], [{'title':'c1'}, {'title':'c2'}]],
            $scope.dueDateGenerator(3, {
                'start': new Date(),
                'Mon': false,
                'Tue': true,
                'Wed': true,
                'Thu': false,
                'Fri': true,
                'Sat': false,
                'Sun': true
            })
        );
        */
        
    }])

    ;