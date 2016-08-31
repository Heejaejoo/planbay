/*global angular*/
'use strict';
angular.module('planBay')
    .constant("baseURL", "https://planbay-heejae-joo.c9users.io/")
    .factory('planFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + "plans/:id", null, {
            'update': {
                method: 'PUT'
            },
            'getWhenInit': {
                method:'GET'
            },
            'getWithQuery': {
              method: 'GET',
              isArray: true
            },
            'getOrderOfDownloads': {
                url: baseURL + 'plans/top8downloads',
                method: 'GET',
                isArray: true
            },
            'getOrderOfRatings': {
                url: baseURL + 'plans/top8ratings',
                method: 'GET',
                isArray: true
            },
            'addToPrivatePlan': {
                url: baseURL + 'users/privateplan/:id',
                method: 'POST'
            }
        });
    }])
    
    .factory('cmtFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + "plans/:id/comments/:commentid", {
            id: "@Id",
            commentId: "@CommentId"
        }, {
            'update': {
                method: 'PUT'
            }
        });
    }])
    
    .factory('ratingFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + "plans/:id/ratings/:ratingid", {
            id: "@Id",
            ratingId: "@RatingId"
        }, {
            'update': {
                method: 'PUT'
            }
        });
    }])
    
    .factory('MypageFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        return $resource(baseURL + "users/:id", null, {
            'getPlans': {
                url: baseURL + 'users/publicplan/:id',
                method: 'GET',
                isArray: true
            },
            'getPrivatePlans': {
                url: baseURL + 'users/privateplan/:id',
                method: 'GET',
                isArray: true
            },
            'updatePrivatePlan': {
                url: baseURL + 'users/privateplan/:userId/:planId',
                method: 'PUT'
            },
            'addPrivatePlan': {
                url: baseURL + 'users/privateplan/:id',
                method: 'POST'
            },
            'deletePrivatePlan': {
                url: baseURL + 'users/privateplan/:id/:planId',
                method: 'DELETE'
            }
        });
    }])
    //위아래 팩토리 통합 필요
    
    .factory('ProfileFactory', ['$resource', 'baseURL', function($resource, baseURL) {
        var formDataObject = function(data) {
            var fd = new FormData();
            angular.forEach(data, function(value, key) {
                fd.append(key, value);
            });
            return fd;
        }
        return $resource(baseURL + "users/:id", null, {
            'update': {
                method: 'PUT',
                transformRequest: formDataObject,
                headers: {'Content-Type':undefined, enctype:'multipart/form-data'}
            }
        });
    }])
    
    .factory('$localStorage', ['$window', function($window) {
        return {
            store: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            },
            storeObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key, defaultValue) {
                return JSON.parse($window.localStorage[key] || defaultValue);
            }
        }
    }])

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', '$state', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog, $state) {

    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var userinfo = {};
    var authToken = undefined;

    function loadUserCredentials() {
        var credentials = $localStorage.getObject(TOKEN_KEY, '{}');
        if (credentials.username != undefined) {
            useCredentials(credentials);
        }
    }

    function storeUserCredentials(credentials) {
        $localStorage.storeObject(TOKEN_KEY, credentials);
        useCredentials(credentials);
    }

    function useCredentials(credentials) {
        isAuthenticated = true;
        username = credentials.username;
        authToken = credentials.token;
        userinfo = credentials.userinfo;
        // Set the token as header for your requests!
        $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        username = '';
        userinfo = {};
        isAuthenticated = false;
        $http.defaults.headers.common['x-access-token'] = authToken;
        $localStorage.remove(TOKEN_KEY);
    }

    authFac.login = function(loginForm) {

        $resource(baseURL + "users/login")
            .save(loginForm,
                function(response) {
                    storeUserCredentials({
                        username: loginForm.username,
                        token: response.token,
                        userinfo: response.userinfo
                    });
                    $rootScope.$broadcast('login:Successful');
                    $state.go('app.home', {}, {
                        reload: true
                    });
                },
                function(response) {
                    isAuthenticated = false;

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message + '</p><p>' +
                        response.data.err.name + '</p></div>' +
                        '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'

                    ngDialog.openConfirm({
                        template: message,
                        plain: 'true'
                    });
                }

            );

    };

    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
    };

    authFac.register = function(registerData) {

        $resource(baseURL + "users/register")
            .save(registerData,
                function(response) {
                    authFac.login({
                        username: registerData.username,
                        password: registerData.password
                    });
                    $rootScope.$broadcast('registration:Successful');

                },
                function(response) {

                    var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                        '<div><p>' + response.data.err.message +
                        '</p><p>' + response.data.err.name + '</p></div>';

                    ngDialog.openConfirm({
                        template: message,
                        plain: 'true'
                    });

                }

            );
    };

    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };

    authFac.getUsername = function() {
        return username;
    };

    authFac.getUserinfo = function() {
        return userinfo;
    };

    authFac.updateUserInfo = function(newinfo) {
        Object.assign(userinfo, newinfo);
    };

    loadUserCredentials();

    return authFac;
}])

.factory('exportFactory',  ['$stateParams', function($stateParams) {
    var exportFac = {};
    
    var WunderlistSDK = window.wunderlist.sdk;
        var WunderlistAPI = new WunderlistSDK({
            'accessToken': $stateParams.token,
            'clientID': '3d53d79c4b15cfd87ba0'
        });
    
    function postTask(listID, title, dueDate) {
        WunderlistAPI.http.tasks.create({
                'list_id': parseInt(listID),
                'title': title,
                'due_date': dueDate.toISOString()
            })
            .done(function(taskData, statusCode) {
                console.log("success to post task!");
            })
            .fail(function(resp, code) {
                console.log("fail to post task!");
            });
    };
    
    exportFac.exportToWunderlist = function(listID, plan) {
        var numDay = plan.dueDates.length;

        for (var i = 0; i < numDay; i++) {
            var numTask = plan.taskArr[i].length;
            for (var j = 0; j < numTask; j++) {
                if(plan.taskArr[i][j].time !== undefined) {
                    postTask(listID, plan.taskArr[i][j].title + "(" + plan.taskArr[i][j].time + ")", plan.dueDates[i]);
                } else {
                    postTask(listID, plan.taskArr[i][j].title, plan.dueDates[i]);   
                }
            }
        }
        
        console.log("success to export!");
    };
    
    return exportFac;
}])

.factory('duedateFactory', function() {
    var duedateFac = {};

    function getNextDayOfWeek(date, dayOfWeek) {
        var resultDate = new Date(date.getTime());
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

        return resultDate;
    }

    function getDayStr(dayNum) {
        var dayStr;

        switch (dayNum % 7) {
            case 0: dayStr = "Sun"; break;
            case 1: dayStr = "Mon"; break;
            case 2: dayStr = "Tue"; break;
            case 3: dayStr = "Wed"; break;
            case 4: dayStr = "Thu"; break;
            case 5: dayStr = "Fri"; break;
            case 6: dayStr = "Sat";
        }

        return dayStr;
    }

    //this function gives the array of Date which has pattern
    duedateFac.dueDateGenerator = function(num, duePattern) {
        var dueDates = [];
        var currentDate = duePattern.start;
        var currentDay = currentDate.getDay();

        while (num > 0) {
            if (duePattern[getDayStr(currentDay)]) {
                currentDate = getNextDayOfWeek(currentDate, currentDay);
                dueDates.push(currentDate);
                num--;
            }

            currentDay++;
        }
        console.log("success to generate duedates!");
        return dueDates;
    };
    
    return duedateFac;
})

;
