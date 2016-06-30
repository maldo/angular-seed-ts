(function () {
    angular.module('routes', ['ui.router'])
    .config(function ($urlRouterProvider, $stateProvider) {
        'use strict';

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('body', {
                abstract: true,
                templateUrl: 'layout/body.html'
            })
            .state('body.layout', {
                abstract: true,
                views: {
                    'header@body': { templateUrl: 'layout/header.html' },
                    'footer@body': { templateUrl: 'layout/footer.html' }
                }
            })
            .state('home', {
                parent: 'body.layout',
                url: '/home',
                views: {
                    'view@body': { templateUrl: 'views/home.html' }
                }
            });
    });

})(angular);
