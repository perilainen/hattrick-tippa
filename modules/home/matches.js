var app = angular.module('myApp', []);

app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])
app.controller('customersCtrl', function($scope, dataService,matchService,betService) {
    $scope.names = [
      { "Name" : "Max Joe", "City" : "Lulea", "Country" : "Sweden" },
      { "Name" : "Manish", "City" : "Delhi", "Country" : "India" },
      { "Name" : "Koniglich", "City" : "Barcelona", "Country" : "Spain" },
      { "Name" : "Wolski", "City" : "Arhus", "Country" : "Denmark" }
    ];
    //$scope.table=[
    //{"table":{"pe":0}}
    //dataService.getTable()
    //$http.get('/someUrl', config).then(successCallback, errorCallback);
    //{"MatchID": "563747405", "MatchRound": "1", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-02-21 10:00:00"}, {"MatchID": "563747406", "MatchRound": "1", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-02-21 10:00:00"}, {"MatchID": "563747408", "MatchRound": "1", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-02-21 10:00:00"}, {"MatchID": "563747409", "MatchRound": "1", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-02-21 10:00:00"}, {"MatchID": "563747410", "MatchRound": "2", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-02-28 10:00:00"}, {"MatchID": "563747411", "MatchRound": "2", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-02-28 10:00:00"}, {"MatchID": "563747412", "MatchRound": "2", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-02-28 10:00:00"}, {"MatchID": "563747413", "MatchRound": "2", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-02-28 10:00:00"}, {"MatchID": "563747415", "MatchRound": "3", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-03-06 10:00:00"}, {"MatchID": "563747416", "MatchRound": "3", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-03-06 10:00:00"}, {"MatchID": "563747417", "MatchRound": "3", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-03-06 10:00:00"}, {"MatchID": "563747422", "MatchRound": "3", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-03-06 10:00:00"}, {"MatchID": "563747418", "MatchRound": "4", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-03-13 10:00:00"}, {"MatchID": "563747419", "MatchRound": "4", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-03-13 10:00:00"}, {"MatchID": "563747420", "MatchRound": "4", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-03-13 10:00:00"}, {"MatchID": "563747421", "MatchRound": "4", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-03-13 10:00:00"}, {"MatchID": "563747423", "MatchRound": "5", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-03-20 10:00:00"}, {"MatchID": "563747424", "MatchRound": "5", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-03-20 10:00:00"}, {"MatchID": "563747426", "MatchRound": "5", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-03-20 10:00:00"}, {"MatchID": "563747428", "MatchRound": "5", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-03-20 10:00:00"}, {"MatchID": "563747425", "MatchRound": "6", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-03-27 10:00:00"}, {"MatchID": "563747427", "MatchRound": "6", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-03-27 10:00:00"}, {"MatchID": "563747429", "MatchRound": "6", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-03-27 10:00:00"}, {"MatchID": "563747430", "MatchRound": "6", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-03-27 10:00:00"}, {"MatchID": "563747431", "MatchRound": "7", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-04-03 10:00:00"}, {"MatchID": "563747432", "MatchRound": "7", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-04-03 10:00:00"}, {"MatchID": "563747433", "MatchRound": "7", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-04-03 10:00:00"}, {"MatchID": "563747434", "MatchRound": "7", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-04-03 10:00:00"}, {"MatchID": "563747435", "MatchRound": "8", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-04-10 10:00:00"}, {"MatchID": "563747436", "MatchRound": "8", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-04-10 10:00:00"}, {"MatchID": "563747437", "MatchRound": "8", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-04-10 10:00:00"}, {"MatchID": "563747438", "MatchRound": "8", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-04-10 10:00:00"}, {"MatchID": "563747439", "MatchRound": "9", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-04-17 10:00:00"}, {"MatchID": "563747440", "MatchRound": "9", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-04-17 10:00:00"}, {"MatchID": "563747441", "MatchRound": "9", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-04-17 10:00:00"}, {"MatchID": "563747442", "MatchRound": "9", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-04-17 10:00:00"}, {"MatchID": "563747443", "MatchRound": "10", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-04-24 10:00:00"}, {"MatchID": "563747444", "MatchRound": "10", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-04-24 10:00:00"}, {"MatchID": "563747445", "MatchRound": "10", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-04-24 10:00:00"}, {"MatchID": "563747447", "MatchRound": "10", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-04-24 10:00:00"}, {"MatchID": "563747446", "MatchRound": "11", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-05-01 10:00:00"}, {"MatchID": "563747448", "MatchRound": "11", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-05-01 10:00:00"}, {"MatchID": "563747449", "MatchRound": "11", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-05-01 10:00:00"}, {"MatchID": "563747450", "MatchRound": "11", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-05-01 10:00:00"}, {"MatchID": "563747451", "MatchRound": "12", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-05-08 10:00:00"}, {"MatchID": "563747452", "MatchRound": "12", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-05-08 10:00:00"}, {"MatchID": "563747453", "MatchRound": "12", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-05-08 10:00:00"}, {"MatchID": "563747454", "MatchRound": "12", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-05-08 10:00:00"}, {"MatchID": "563747455", "MatchRound": "13", "HomeTeam": {"HomeTeamID": "43522", "HomeTeamName": "Kulturelitens FF"}, "AwayTeam": {"AwayTeamID": "454612", "AwayTeamName": "Tusker Boys"}, "MatchDate": "2016-05-15 10:00:00"}, {"MatchID": "563747456", "MatchRound": "13", "HomeTeam": {"HomeTeamID": "46011", "HomeTeamName": "Perilainen United"}, "AwayTeam": {"AwayTeamID": "12535", "AwayTeamName": "BadBoyBubbysBoys"}, "MatchDate": "2016-05-15 10:00:00"}, {"MatchID": "563747457", "MatchRound": "13", "HomeTeam": {"HomeTeamID": "14912", "HomeTeamName": "Von Astons FC"}, "AwayTeam": {"AwayTeamID": "763287", "AwayTeamName": "FC Rya \u00c5sar"}, "MatchDate": "2016-05-15 10:00:00"}, {"MatchID": "563747458", "MatchRound": "13", "HomeTeam": {"HomeTeamID": "450978", "HomeTeamName": "FC Invandrarverket"}, "AwayTeam": {"AwayTeamID": "760344", "AwayTeamName": "Maaloula FC"}, "MatchDate": "2016-05-15 10:00:00"}, {"MatchID": "563747459", "MatchRound": "14", "HomeTeam": {"HomeTeamID": "454612", "HomeTeamName": "Tusker Boys"}, "AwayTeam": {"AwayTeamID": "46011", "AwayTeamName": "Perilainen United"}, "MatchDate": "2016-05-22 10:00:00"}, {"MatchID": "563747460", "MatchRound": "14", "HomeTeam": {"HomeTeamID": "763287", "HomeTeamName": "FC Rya \u00c5sar"}, "AwayTeam": {"AwayTeamID": "43522", "AwayTeamName": "Kulturelitens FF"}, "MatchDate": "2016-05-22 10:00:00"}, {"MatchID": "563747461", "MatchRound": "14", "HomeTeam": {"HomeTeamID": "760344", "HomeTeamName": "Maaloula FC"}, "AwayTeam": {"AwayTeamID": "14912", "AwayTeamName": "Von Astons FC"}, "MatchDate": "2016-05-22 10:00:00"}, {"MatchID": "563747462", "MatchRound": "14", "HomeTeam": {"HomeTeamID": "12535", "HomeTeamName": "BadBoyBubbysBoys"}, "AwayTeam": {"AwayTeamID": "450978", "AwayTeamName": "FC Invandrarverket"}, "MatchDate": "2016-05-22 10:00:00"}
    //];
    
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
    
    
    
});

app.factory('Base64', function() {
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

app.factory('dataService', function($http,Base64){
	return{
		gettable:function(){
		//return {"table":{"pe":0}};
		$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode('per' + ':' + 'per');
    	
		return $http.get("http://127.0.0.1:5000/table",{username:"per",password:"per"});
		}
	};	
});

app.factory('matchService', function($http){
	return{
		getmatches:function(){
			$http.defaults.headers.common.Authorization = 'Basic ';
			return $http.get("http://127.0.0.1:5000/matches");
		}
	};
});

app.factory('betService',function($http){
	return{
		getbets:function(){
			$http.defaults.headers.common.Authorization = 'Basic ';
			return $http.get("http://127.0.0.1:5000/officialBets");
		}
	};
});

