(function(angular) {
    'use strict';
    angular.module('app.factory.jwtInterceptor', [])
        .factory('jwtInterceptor', function(session) {
            return {
                'request': function(config) {
                    if (session.authenticated) {
                        config.headers['x-access-token'] = session.userJWTToken;
                    }

                    return config;
                },
                'response': function(res) {
                    if (res.headers('x-access-token') !== null && session.authenticated) {
                        session.authenticate(res.headers('x-access-token'));
                    }

                    return res;
                }
            };
        });
})(angular);
