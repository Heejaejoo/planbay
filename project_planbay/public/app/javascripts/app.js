'use strict';
angular.module('planBay', ['ui.router','ngResource','pageslide-directive'])
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
        // route for the home page
            .state('app', {
                url: '/',
                views: {
                    'header': {
                        templateUrl: 'views/header.html'
                    },
                    'content': {
                        templateUrl: 'views/landing.html',
                        controller: 'LandingController'
                    },
                    'footer': {
                        templateUrl: 'views/footer.html'
                    },
                    'detail': {
                        templateUrl: 'views/detail.html',
                        controller: 'DetailController'
                    }
                }
            })
            .state('app.detail', {
                url: 'detail',
                views: {
                    'content@' : {
                        templateUrl:'views/plandetail.html',
                        controller: 'DetailController'
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

    })
;
