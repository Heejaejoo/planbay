angular.module('planBay')
    .controller('DetailController', ['$scope', '$state', '$stateParams', 'planFactory', 'cmtFactory', 'ratingFactory','AuthFactory', '$location','ngDialog', function($scope, $state, $stateParams, planFactory, cmtFactory, ratingFactory, AuthFactory, $location, ngDialog) {
        $scope.plan = {};
        $scope.showPlan = false;
        $scope.message = "Loading ...";
        $scope.stars = 0;
        $scope.feedback = {
            comment: ''
        }
        $scope.rating = {
            rating: 0
        }
        $scope.ratingOnly = false;

        $scope.plan = planFactory.get({
                id: $stateParams.planId
            })
            .$promise.then(
                function(response) {
                    $scope.plan = response;
                    $scope.showPlan = true;
                    $scope.stars = $scope.plan.ratingsAvg.toFixed(1);
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
        $scope.goback = function(before) {
            if(before)
            {$state.go(before);
            }else{
                $state.go('app.home');
            }
        };
        $scope.submitComment = function() {
            if (!($scope.ratingOnly)) {
                cmtFactory.save({
                    id: $stateParams.planId
                }, $scope.feedback);
            }
            ratingFactory.save({
                id: $stateParams.planId
            }, $scope.rating);
            $state.go($state.current, {}, {
                reload: true
            });
            if (!($scope.ratingOnly)) {
                $scope.feedback = {
                    comment: ''
                };
            }
            $scope.rating = {
                rating: 0
            };
        };
        $scope.addToMyPage = function() {
            var userId = AuthFactory.getUserinfo()._id;
            var privatePlan = {
                title: $scope.plan.title,
                description: $scope.plan.description,
                category: $scope.plan.category,
                taskArr: $scope.plan.taskArr,
                origin: $scope.plan._id,
                day: $scope.plan.day
            };
            planFactory.addToPrivatePlan({
                id: userId
            }, privatePlan).$promise.then(
                function(response) {
                    ngDialog.open({
                    template: '<div>성공하였습니다.</div>',
                    plain: true
                 })
                },
                function(response) {
                    ngDialog.open({
                    template: '<div>실패하였습니다. 다시 시도해 주세요.</div>',
                    plain: true
                 })
                }
            );
        };
        $scope.conFirm = function() {
            ngDialog.openConfirm({            
                template: '<div>내 플랜에 추가하시겠습니까?<br>(마이페이지에서 확인하실 수 있습니다.)<br><br> <div class="col-xs-offset-1"><button class="btn btn-success" value="confirm" ng-click="confirm()">추가</button><button class="btn btn-danger" value="close" ng-click="closeThisDialog()">취소</button></div>',
                plain: true,
                scope:$scope           
            }).then(function(value){
                $scope.addToMyPage();
                
            },function(reject){
                ngDialog.open({
                    template: '<div>취소하였습니다.</div>',
                    plain: true
                })
            });
        }
    }])

.controller('LandingController', ['$scope', function($scope) {

}])

.controller('RegistrationController', ['$scope', '$localStorage', 'AuthFactory', function($scope, $localStorage, AuthFactory) {

    $scope.registerForm = {
        name: "",
        username: "",
        password: "",
        confirmPassword: ""
    };

    $scope.re = /[a-zA-Z][0-9]/;

    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registerForm);

        AuthFactory.register($scope.registerForm);

    };

}])

.controller('HomeController', ['$scope', 'planFactory', function($scope, planFactory) {
    planFactory.getOrderOfDownloads(
        function(response) {
            $scope.plansDownloadOrdered = response;
            planFactory.getOrderOfRatings(
                function(resp) {
                    $scope.plansRatingsOrdered = resp;
                },
                function(resp) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                });
        },
        function(response) {
            $scope.message = "Error: " + response.status + " " + response.statusText;
        });
}])

.controller('MoreController', ['$scope', function($scope) {

}])

.controller('LoginController', ['$scope', '$localStorage', 'AuthFactory', function($scope, $localStorage, AuthFactory) {

    $scope.loginForm = {
        username: "",
        password: ""
    };

    $localStorage.getObject('userinfo', '{}');

    $scope.doLogin = function() {

        AuthFactory.login($scope.loginForm);

    };

}])

.controller('MypageController', ['$scope', 'AuthFactory', 'MypageFactory' ,'planFactory','$state', function($scope, AuthFactory,  MypageFactory, planFactory, $state) {

    var userid = AuthFactory.getUserinfo()._id;
    MypageFactory.getPrivatePlans({
                id: userid
            })
            .$promise.then(
                function(response) {
                    $scope.privatePlans = response;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    var plans = MypageFactory.getPlans({
                id: userid
            })
            .$promise.then(
                function(response) {
                    plans = response;
                    console.log(plans);
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
    
    $scope.editingPlans = [];
    $scope.myPlans = [];
    $scope.publicPlans = [];
    var len = plans.length;
    for(var i = 0; i < len; i++) {
        if(plans[i].postedBy === userid) //editing===false
            $scope.myPlans.push(plans[i]);
        else if (plans[i].postedBy !== userid) //editing===false
            $scope.publicPlans.push(plans[i]);
        else
            $scope.editingPlans.push(plans[i]);
    }
    
    
    $scope.delete = function(planId){
        planFactory.delete({id: planId});
        $state.go($state.current, {}, {
                reload: true
            });
    }

}])

.controller('ProfileController', ['$scope', '$state', 'Upload', '$timeout', '$rootScope', '$stateParams', 'ProfileFactory', 'AuthFactory', 'ngDialog', function($scope, $state, Upload, $timeout, $rootScope, $stateParams, ProfileFactory, AuthFactory, ngDialog) {

    $scope.profileForm = {
        name: "",
        password: "",
        picture:""
    };

    $scope.userinfo = AuthFactory.getUserinfo();

    $scope.doUpdate = function() {
        
        if ($scope.profileForm.file)
            $scope.profileForm.picture = 'images/' + $scope.userinfo._id + '.' + $scope.profileForm.file.name.split('.').pop();
        
        ProfileFactory.update({
                id: $stateParams.userId
            }, $scope.profileForm,
            function(response) {
                AuthFactory.updateUserInfo($scope.profileForm);
                $rootScope.$broadcast('login:Successful');
                $state.go('app.mypage', {}, {
                    reload: true
                });
            },
            function(response) {

                var message = '\
                <div class="ngdialog-message">\
                <div><h3>Unsuccessful</h3></div>' +
                    '<div><p>' + response.data.err.message +
                    '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({
                    template: message,
                    plain: 'true'
                });
            });
            
    };

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory','$http','ngDialog', function($scope, $state, $rootScope, ngDialog, AuthFactory,$http,ngDialog) {

    $scope.loggedIn = false;
    $scope.username = '';
    $scope.userinfo = {};
    
    $scope.showMenubar = false;
    $scope.changeMenubarState = function() {
        $scope.showMenubar = !$scope.showMenubar;
    };

    if (AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.username = AuthFactory.getUsername();
        $scope.userinfo = AuthFactory.getUserinfo();
    };

    $scope.logOut = function() {
        AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.username = '';
        $scope.userinfo = {};
    };

    $rootScope.$on('login:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userinfo = AuthFactory.getUserinfo();
    });

    $rootScope.$on('registration:Successful', function() {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.username = AuthFactory.getUsername();
        $scope.userinfo = AuthFactory.getUserinfo();
    });

    $scope.stateis = function(curstate) {
        return $state.is(curstate);
    };
    
}])

//TODO: make the function to create new List and export to the list
.controller('EditController', ['$scope', '$stateParams', 'AuthFactory', 'MypageFactory', 'planFactory', 'duedateFactory', 'exportFactory', function($scope, $stateParams, AuthFactory, MypageFactory, planFactory, duedateFactory, exportFactory) {
    
    //TODO: if possible, put this lines for getting lists to services.js
    var WunderlistSDK = window.wunderlist.sdk;
    var WunderlistAPI = new WunderlistSDK({
        'accessToken': $stateParams.token,
        'clientID': '3d53d79c4b15cfd87ba0'
    });
    
    //get lists from wunderlist
    WunderlistAPI.http.lists.all()
        .done(function(lists) {
            console.log("success to get lists");
            $scope.lists = lists;
        })
        .fail(function() {
            console.error("fail to get lists");
        });
    
   $scope.plans = MypageFactory.getPlans({
                id: AuthFactory.getUserinfo()._id
            })
            .$promise.then(
                function(response) {
                    $scope.plans = response;
                },
                function(response) {
                    $scope.message = "Error: " + response.status + " " + response.statusText;
                }
            );
            
    //default plan
    $scope.plan = {
        title: "",
        category: "",
        description: "",
        taskArr: [],
        dueDates: []
    }
    
    var planId;
    $scope.loadedPlan;
    $scope.listID;
    
    //define default values
    $scope.days = 12;
    $scope.duePattern = {
        'start': new Date(),
        'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true, 'Sat': true, 'Sun': true
    };
    
    $scope.checkWeekdays = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkMonWedFri = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': true, 'Tue': false, 'Wed': true, 'Thu': false, 'Fri': true, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkTueThu = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': false, 'Tue': true, 'Wed': false, 'Thu': true, 'Fri': false, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkWeekends = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': false, 'Tue': false, 'Wed': false, 'Thu': false, 'Fri': false, 'Sat': true, 'Sun': true
        }
    };
    
    //bring the core functions
    $scope.exportToWunderlist = exportFactory.exportToWunderlist;
    $scope.dueDateGenerator = duedateFactory.dueDateGenerator;
    
    //get duedates from current state
    $scope.plan.dueDates = $scope.dueDateGenerator($scope.days, $scope.duePattern);

    /*
        TODO: 지금 하는 방식은 일단 60일의 계획을 만들어 놓고
        days의 값에 따라서 그날들을 보여주거나 안보여주는 방식이다.
        이걸 바꿔서 days에 연동하여 날짜들 자체가 생성되거나 삭제되게
        하면 어떨까? 물론 이 방법의 단점이 있다. days를 늘렸다가 줄였다가
        하다보면 자신이 만들어 놓은 계획이 삭제될 수도 있다.
    */
        
    //the maximum value of days is 60
    for (var i = 1; i <= 60; i++) {
        $scope.plan.taskArr.push([{'title': ''}]);
    }

    $scope.addTask = function(day) {
        if($scope.taskArr === undefined) {
            $scope.taskArr = [];
            for (var i = 1; i <= 60; i++) {
                $scope.plan.taskArr.push([{'title': ''}]);
            }
        } else {
            var tasks = $scope.plan.taskArr[day];
            tasks.push({
                'title': ''
            });
        }
    };

    $scope.removeTask = function(day, task) {
        var tasks = $scope.plan.taskArr[day];
        if (tasks.length < 2)
            return;
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
    };
    
    $scope.savePlan = function() {
        if(planId === undefined) {
            console.log("saving!");
            planFactory.save($scope.plan);
        } else {
            planFactory.update({
                id: planId
            }, $scope.plan,
            function(response) {
                console.log("success to save plan");
            });
        }
    };
  
    $scope.loadPlan = function() {
        $scope.plan = $scope.loadedPlan;
        planId = $scope.plan._id;
    };
}])

.controller('MakeController', ['$scope', 'AuthFactory', 'MypageFactory', function($scope, AuthFactory, MypageFactory) {
    var userinfo = AuthFactory.getUserinfo();
    console.log(userinfo);
    $scope.plans = MypageFactory.getPrivatePlans({id:userinfo._id});
    $scope.planId;
    //default plan
    $scope.plan = {
        title: "",
        category: "",
        description: "",
        taskArr: [],
    }
    
    //define default values
    $scope.days = 12;

    /*
        TODO: 지금 하는 방식은 일단 60일의 계획을 만들어 놓고
        days의 값에 따라서 그날들을 보여주거나 안보여주는 방식이다.
        이걸 바꿔서 days에 연동하여 날짜들 자체가 생성되거나 삭제되게
        하면 어떨까? 물론 이 방법의 단점이 있다. days를 늘렸다가 줄였다가
        하다보면 자신이 만들어 놓은 계획이 삭제될 수도 있다.
    */
        
    //the maximum value of days is 60
    for (var i = 1; i <= 60; i++) {
        $scope.plan.taskArr.push([{'title': ''}]);
    }

    $scope.addTask = function(day) {
        if($scope.taskArr === undefined) {
            $scope.taskArr = [];
            for (var i = 1; i <= 60; i++) {
                $scope.plan.taskArr.push([{'title': ''}]);
            }
        } else {
            var tasks = $scope.plan.taskArr[day];
            tasks.push({
                'title': ''
            });
        }
    };

    $scope.removeTask = function(day, task) {
        var tasks = $scope.plan.taskArr[day];
        if (tasks.length < 2)
            return;
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
    };
    
    $scope.savePlan = function(i) {
        if($scope.planId === undefined) {
            MypageFactory.addPrivatePlan($scope.plan);
        } else {
            MypageFactory.updatePrivatePlan({id:$scope.planId}, $scope.plan);
        }
    }
    
    /*
    $scope.loadPlan = function(i) {
        $scope.plan = userinfo.privatePlans[i];
    }
    
    $scope.savePlan = function() {
        
        console.log("here");
        if(planId === undefined) {
            console.log("saving!");
            planFactory.save($scope.plan);
        } else {
            planFactory.update({
                id: planId
            }, { $set: $scope.plan },
            function(response) {
                console.log("success to save plan");
            });
        }
    };
  
    $scope.loadPlan = function() {
        $scope.plan = $scope.loadedPlan;
        planId = $scope.plan._id;
    };
    
    */
    
    
    $scope.completePlan = function() {
        //TODO: validation check + remove this plan in the private plans + save this plan in the public plans
    }
}])

.controller('ExportController', ['$scope', '$stateParams', 'AuthFactory', 'MypageFactory', 'planFactory', 'duedateFactory', 'exportFactory', function($scope, $stateParams, AuthFactory, MypageFactory, planFactory, duedateFactory, exportFactory) {
    
    if($stateParams.token !== undefined) {
        //TODO: if possible, put this lines for getting lists to services.js
        var WunderlistSDK = window.wunderlist.sdk;
        var WunderlistAPI = new WunderlistSDK({
            'accessToken': $stateParams.token,
            'clientID': '3d53d79c4b15cfd87ba0'
        });
        
        //get lists from wunderlist
        WunderlistAPI.http.lists.all()
            .done(function(lists) {
                console.log("success to get lists");
                $scope.lists = lists;
            })
            .fail(function() {
                console.error("fail to get lists");
            });
    }
            
    //default plan
    $scope.plan = {
        title: "",
        category: "",
        description: "",
        taskArr: [],
        dueDates: []
    }
    
    var planId;
    $scope.loadedPlan;
    $scope.listID;
    
    //define default values
    $scope.days = 12;
    $scope.duePattern = {
        'start': new Date(),
        'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true, 'Sat': true, 'Sun': true
    };
    
    $scope.checkWeekdays = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': true, 'Tue': true, 'Wed': true, 'Thu': true, 'Fri': true, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkMonWedFri = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': true, 'Tue': false, 'Wed': true, 'Thu': false, 'Fri': true, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkTueThu = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': false, 'Tue': true, 'Wed': false, 'Thu': true, 'Fri': false, 'Sat': false, 'Sun': false
        }
    };
    
    $scope.checkWeekends = function() {
        $scope.duePattern = {
            'start': $scope.duePattern.start,
            'Mon': false, 'Tue': false, 'Wed': false, 'Thu': false, 'Fri': false, 'Sat': true, 'Sun': true
        }
    };
    
    //bring the core functions
    $scope.exportToWunderlist = exportFactory.exportToWunderlist;
    $scope.dueDateGenerator = duedateFactory.dueDateGenerator;
    
    //get duedates from current state
    $scope.plan.dueDates = $scope.dueDateGenerator($scope.days, $scope.duePattern);

    /*
        TODO: 지금 하는 방식은 일단 60일의 계획을 만들어 놓고
        days의 값에 따라서 그날들을 보여주거나 안보여주는 방식이다.
        이걸 바꿔서 days에 연동하여 날짜들 자체가 생성되거나 삭제되게
        하면 어떨까? 물론 이 방법의 단점이 있다. days를 늘렸다가 줄였다가
        하다보면 자신이 만들어 놓은 계획이 삭제될 수도 있다.
    */
        
    //the maximum value of days is 60
    for (var i = 1; i <= 60; i++) {
        $scope.plan.taskArr.push([{'title': ''}]);
    }

    $scope.addTask = function(day) {
        if($scope.taskArr === undefined) {
            $scope.taskArr = [];
            for (var i = 1; i <= 60; i++) {
                $scope.plan.taskArr.push([{'title': ''}]);
            }
        } else {
            var tasks = $scope.plan.taskArr[day];
            tasks.push({
                'title': ''
            });
        }
    };

    $scope.removeTask = function(day, task) {
        var tasks = $scope.plan.taskArr[day];
        if (tasks.length < 2)
            return;
        var index = tasks.indexOf(task);
        tasks.splice(index, 1);
    };
    
    $scope.savePlan = function() {
        
        if(planId === undefined) {
            console.log("saving!");
            planFactory.save($scope.plan);
        } else {
            
            planFactory.update({
                id: planId
            }, $scope.plan,
            function(response) {
                console.log("success to save plan");
            });
        }
    };
  
    $scope.loadPlan = function() {
        $scope.plan = $scope.loadedPlan;
        planId = $scope.plan._id;
    };
    
}])
;