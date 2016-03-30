'use strict';

// declare modules
angular.module('Authentication', []);
angular.module('Home', []);



angular.module('BasicHttpAuthExample', [
    'Authentication',
    'Home',
    'ngRoute',
    'ngCookies',
    'ngDialog'
  
    
])

.config(['$routeProvider','$httpProvider', function ($routeProvider,$httpProvider) {
	$httpProvider.defaults.useXDomain = false;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html'
        })

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        
        .when('/settings', {
            controller: 'HomeController',
            templateUrl: 'modules/Settings/views/settings.html'
        })

        .otherwise({ redirectTo: '/login' });
        
        
}])



.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        console.log($rootScope.globals.currentUser)
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
