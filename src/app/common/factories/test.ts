(function(angular) {
    'use strict';
    angular.module('app.test.tontunas', [])
        .factory('testTontunas', function() {
            let coche = 'mercedes';
            const velocidad = '140';

            function test1() {
                // console.log(coche + ' ' + velocidad);
                return coche + velocidad;
            }

            return {test1};
        });
})(angular);
