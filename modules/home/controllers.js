'use strict';

var home = angular.module('Home',[])

home.controller('HomeController',function ($scope, $cookieStore, $window, staticsService, dataService,matchService,betService,myBetService,changePassword, $http,$location,$anchorScroll,ngDialog) {
	
	$scope.show = true;
	
    	
    $scope.scrollTo = function(id) {
    	
    	var old = $location.hash();
    	$location.hash(id);
    	$anchorScroll();
    	//reset to old to keep any additional routing logic from kicking in
    	$location.hash(old);
    	
   	};

    $scope.sortStatistics = 'Truppvarde';
    $scope.sortStatisticsReverse = true;

    $scope.changeSortStatistics = function(value){
        console.log("changing sort to: "+value)
        if (value==$scope.sortStatistics){
            $scope.sortStatisticsReverse = !$scope.sortStatisticsReverse;
        }
        $scope.sortStatistics = value

    }

    $scope.ShowStatistic = function(){
        staticsService.getPlayerValues().then(function(d){
        $scope.teamValues = d.data;
        console.log($scope.teamValues)
    })
        console.log("Visar statistik")
        ngDialog.open({template: 'modules/home/views/statistik.html', className: 'ngdialog-theme-defaultdddd custom-width',
                  scope:$scope})

  };
    

    $scope.checkStatiticsExist = function(){
        if ($scope.teamValues.length>0){
      return true
    }
    else{
      return false
    }
    }

   	
    	
	$scope.test = $cookieStore.get('globals')
	console.log($scope.test.currentUser)

    $scope.re = '^[0-9]+\-[0-9]+$'
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
    $scope.ChangeSettings = function(){
		
		changePassword.setPass($scope.password1,$scope.test)
		$window.location.href = '#/login';
			
		
	}
    

    myBetService.getMyBets($scope.test).then(function(d){
    	$scope.mybets = d.data;
    	$scope.saved = angular.copy($scope.mybets)
    	
    });
    $http.defaults.headers.common.Authorization = 'Basic';
    $http.get("/api/getResultsFromHattrick?access_token_secret=KPSKKNqpy58pk5L3&access_token_key=jApo2OYPH5rw4WSJ")
    
    
    $scope.placeBets = function(){
    	for (var i = 0; i < $scope.mybets.length ; i++) {
    		$scope.placeBet(i)
    		$scope.Test.$setPristine()
    }}
    
   
    $scope.rePlaceBets = function(){
    	angular.copy($scope.saved,$scope.mybets)
    	$scope.Test.$setPristine()
    	
    }
    
    $scope.placeBet = function(index){
    	console.log(index)
    	//console.log(this.mybets[index][1])
    	
    	$http.defaults.headers.common.Authorization = 'Basic';
    	$http.put("/api/placeBet/"+this.test.currentUser.username+"/"+this.test.currentUser.password+"/"+this.mybets[index].MatchId+"/"+this.mybets[index].bet+"?comment="+this.mybets[index].comment )
    	//$scope.mybets.saved[index]=$scope.mybets.bet[index]    	
    };
    $scope.teamValues=[]
    //Det tar för lång tid att ladda in det
    /*staticsService.getPlayerValues().then(function(d){
        $scope.teamValues = d.data;
        console.log($scope.teamValues)
    })*/
    
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
home.factory('changePassword', function($http,Base64){
	return {
		setPass:function(newPass,user){
			$http.defaults.headers.common.Authorization = 'Basic ' + user.currentUser.authdata;
			
			return $http.put("/api/SetPassword/"+user.currentUser.username+"/"+newPass);
		}
	};
});


home.factory('dataService', function($http,Base64){
	return{
		gettable:function(){
		
		$http.defaults.headers.common['Authorization'] = 'Basic';
    	
		return $http.get("/api/table");
		}
	};	
});

home.factory('staticsService',function($http){
    return{
        getPlayerValues:function(){
            $http.defaults.headers.common.Authorization = 'Basic';
            return $http.get("/api/getTeamValues?access_token_secret=KPSKKNqpy58pk5L3&access_token_key=jApo2OYPH5rw4WSJ&TeamIDS=760344,46011,450978,454612,755725");
        }
    };
});

home.factory('matchService', function($http){
	return{
		getmatches:function(){
			$http.defaults.headers.common.Authorization = 'Basic';
			return $http.get("/api/matches");
		}
	};
});

home.factory('betService',function($http){
	return{
		getbets:function(){
			$http.defaults.headers.common.Authorization = 'Basic';
			return $http.get("/api/officialBets");
		}
		
	};
});
home.factory('myBetService',function($http,Base64){
	return {
		getMyBets:function(user){
			console.log(user.currentUser.username);
			console.log(user.currentUser.authdata);
			$http.defaults.headers.common.Authorization = 'Basic ' + user.currentUser.authdata;//Base64.encode('per' + ':' + 'per');
			
			return $http.get("/api/getBets/"+user.currentUser.username);
			
		}
	};
});

