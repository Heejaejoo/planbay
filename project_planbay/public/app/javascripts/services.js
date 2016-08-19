/*global angular*/
'use strict';
angular.module('planBay')
       .constant("baseURL","https://planbay-heejae-joo.c9users.io/")
       .factory('planFactory', ['$resource','baseURL', function($resource, baseURL){
            return $resource(baseURL+"plans/:id",null, {'update':{
                      method:'PUT'
                  }
            });
        }])
        .factory('cmtFactory', ['$resource','baseURL', function($resource, baseURL){
            return $resource(baseURL+"plans/:id/comments/:commentid",{id:"@Id", commentId: "@CommentId"}, {'update':{
                      method:'PUT'
                  }
            });
        }])
        .factory('ratingFactory', ['$resource','baseURL', function($resource, baseURL){
            return $resource(baseURL+"plans/:id/ratings/:ratingid",{id:"@Id", ratingId: "@RatingId"}, {'update':{
                      method:'PUT'
                  }
            });
        }])
        .factory('ProfileFactory', ['$resource','baseURL', function($resource, baseURL){
            return $resource(baseURL+"users/:id",null, {'update':{
                      method:'PUT'
                  }
            });
        }])
        .factory('$localStorage', ['$window', function ($window) {
        return {
        store: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        remove: function (key) {
            $window.localStorage.removeItem(key);
        },
        storeObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key, defaultValue) {
            return JSON.parse($window.localStorage[key] || defaultValue);
        }
        }
        }])
        
        .factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', '$state', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog, $state){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var userinfo = {};
    var authToken = undefined;
    

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
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
              storeUserCredentials({username:loginForm.username, token: response.token, userinfo: response.userinfo});
              $rootScope.$broadcast('login:Successful');
              $state.go('app.home', {}, {reload:true});
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseURL + "users/register")
        .save(registerData,
           function(response) {
              authFac.login({username:registerData.username, password:registerData.password});
              $rootScope.$broadcast('registration:Successful');
              
           },
           function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + 
                  '</p><p>' + response.data.err.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

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

    loadUserCredentials();
    
    return authFac;
    
}])
        
        
        
        ;
