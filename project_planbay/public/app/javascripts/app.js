'use strict';

angular.module('planBay', ['ui.router','ngResource','ngAnimate'])
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
                        templateUrl: 'views/header.html'
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
            .state('app.detail', {
                url: 'detail',
                views: {
                    'content@' : {
                        templateUrl:'views/plandetail.html'
                    }
                }
            })
            .state('app.detail.details', {
                url: '/details',
                templateUrl: 'views/detail.html',
                controller: 'DetailController'
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
                url:'login',
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
                url:'register',
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
        
            .state('app.myplan', {
                url:'myplan',
                views: {
                    'content@': {
                        templateUrl : 'views/myplan.html',
                        controller  : 'MyplanController'
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

        $urlRouterProvider.otherwise('/');

    });