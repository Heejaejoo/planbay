'use strict';
angular.module('planBay', ['ui.router','ngResource'])
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
                    }
                }
            });

        $urlRouterProvider.otherwise('/');

    })
;
