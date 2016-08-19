'use strict';
angular.module('planBay', ['ui.router','ngResource','ngAnimate','ngDialog','angular-input-stars'])
    .filter('range', function() {
        return function(input, total) {
            total = parseInt(total);

            for (var i=0; i<total; i++) {
                input.push(i);
            }

            return input;
        };
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            // route for the landing page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController'
                    },
                    'content': {
                        templateUrl: 'views/landing.html',
                        controller: 'RegistrationController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    }
                }
            })
            //route for the home page
            .state('app.home', {
                url:'home',
                views: {
                    'content@': {
                        templateUrl : 'views/home.html',
                        controller  : 'HomeController'
                    }
                }
            })
            
            .state('app.home.details', {
                url: '/:planId',
                templateUrl:'views/detail.html',
                controller:'DetailController'
            })

            //route for the category
            .state('app.category', {
                url:'category',
                views: {
                    'content@': {
                        templateUrl : 'views/category.html',
                        controller  : 'HomeController'
                    }
                }
            })
            //route for the more
            .state('app.more', {
                url:'more',
                views: {
                    'content@': {
                        templateUrl : 'views/more.html',
                        controller  : 'MoreController'
                    }
                }
            })
            //route for the login page
            .state('app.login', {
                url:'users/login',
                views: {
                    'content@': {
                        templateUrl: 'views/login.html',
                        controller: 'LoginController'
                    }
                }
            })

            //route for the search
            .state('app.search', {
                url:'search',
                views: {
                    'content@': {
                        templateUrl : 'views/search.html',
                        controller  : 'MoreController'
                    }
                }
            })
        
            //route for the registration page
            .state('app.register', {
                url:'users/register',
                views: {
                    'content@': {
                        templateUrl:'views/register.html',
                        controller:'RegistrationController'
                    }
                }
            })

            .state('app.mypage', {
                url:'mypage',
                views: {
                    'content@': {
                        templateUrl : 'views/mypage.html',
                        controller  : 'MypageController'
                    }
                }
            })
        
            .state('app.profile', {
                url: 'users/:userId',
                views: {
                    'content@': {
                        templateUrl : 'views/profile.html',
                        controller  : 'ProfileController'
                    }
                }
            })

            .state('app.edit', {
                url:'edit',
                views: {
                    'content@': {
                        templateUrl : 'views/plan-edit.html',
                        controller  : 'EditController'
                    }
                }
            })
            
            .state('app.wunderlist', {
                url:'wunderlist?token',
                views: {
                    'content@': {
                        templateUrl : 'views/wunderlist.html',
                        controller  : 'WunderController'
                    }
                }
            })
            
        $urlRouterProvider.otherwise('/');

})

.run(function ($rootScope, $location) {

    var history = [];

    $rootScope.$on('$routeChangeSuccess', function() {
        history.push($location.$$path);
    });

    $rootScope.back = function () {
        var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
        $location.path(prevUrl);
    };

});