﻿'use strict';

var home = angular.module('Home',[])

home.controller('HomeController',function ($scope, $cookieStore, dataService,matchService,betService,myBetService,$http) {
    	
    	$scope.test = $cookieStore.get('globals')
    	console.log($scope.test.currentUser)

    
    dataService.gettable().then(function(d){
    	console.log("ttt")
    	$scope.table = d.data;
    });
    
    matchService.getmatches().then(function(d){
    	$scope.matches = d.data;
    });
    betService.getbets().then(function(d){
    	$scope.bets = d.data;
    });
    console.log($scope.test)
    myBetService.getMyBets($scope.test).then(function(d){
    	$scope.mybets = d.data;
    });
    
    $scope.placeBet = function(index){
    	console.log(this.mybets[index][1])
    	$http.defaults.headers.common.Authorization = 'Basic ';
    	resp = $http.put("http://127.0.0.1:5000/placeBet/"+this.test.currentUser.username+"/"+this.test.currentUser.password+"/"+this.mybets[index].MatchId+"/"+this.mybets[index].bet)
    	console.log(resp)
    	
    };
    
    });
    

home.factory('Base64', function() {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
            'QRSTUVWXYZabcdef' +
            'ghijklmnopqrstuv' +
            'wxyz0123456789+/' +
            '=';
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                alert("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
});

home.factory('dataService', function($http,Base64){
	return{
		gettable:function(){
		//return {"table":{"pe":0}};
		$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('per' + ':' + 'per');
    	
		return $http.get("http://127.0.0.1:5000/table",{username:"per",password:"per"});
		}
	};	
});

home.factory('matchService', function($http){
	return{
		getmatches:function(){
			$http.defaults.headers.common.Authorization = 'Basic ';
			return $http.get("http://127.0.0.1:5000/matches");
		}
	};
});

home.factory('betService',function($http){
	return{
		getbets:function(){
			$http.defaults.headers.common.Authorization = 'Basic ';
			return $http.get("http://127.0.0.1:5000/officialBets");
		}
		
	};
});
home.factory('myBetService',function($http,Base64){
	return {
		getMyBets:function(user){
			console.log(user.currentUser.username);
			console.log(user.currentUser.authdata);
			$http.defaults.headers.common.Authorization = 'Basic ' + user.currentUser.authdata;//Base64.encode('per' + ':' + 'per');
			
			//return $http.get("http://127.0.0.1:5000/table");
			return $http.get("http://127.0.0.1:5000/getBets/"+user.currentUser.username);
			
		}
	};
});

