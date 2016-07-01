(function (angular) {
    angular.module('app.service.session', [])
    .service('session',  function(){

        this.userJWTToken = null;

        this.authenticate = function(userJWTToken: string){
            this.authenticated = true;
            this.userJWTToken = userJWTToken;
        };

        this.reset = function () {
            this.authenticated = false;
        };
    });

})(angular);
