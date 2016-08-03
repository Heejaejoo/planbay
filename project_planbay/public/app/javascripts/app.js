'use strict';
angular.module('planBay', ['ui.router','ngResource'])
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

        ;

        $urlRouterProvider.otherwise('/');

    });