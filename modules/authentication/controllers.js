'use strict';

angular.module('Authentication')

.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService',
    function ($scope, $rootScope, $location, AuthenticationService) {
        // reset login status
        AuthenticationService.ClearCredentials();

        $scope.login = function () {
        	
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (data,status) {
            	console.log(data)
            	console.log(status)
                if (status==200) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    console.log("test3")
                    $location.path('/');
                } else {
                	console.log("other")
                    $scope.error = "wrong username and/or password";
                    $scope.dataLoading = false;
                }
            });
        };
    }]);