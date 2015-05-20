(function(){
 	var app = angular.module('ttime-web', []);

 	app.controller('MainController', function($scope, $http, $q){
 		var API_KEY = 'wX9NwuHnZU2ToO7GmGR9uw';
 		$scope.position = false;
 		$scope.route_names = ["Blue", "Orange", "Red"]; //, "Green-B", "Green-C", "Green-D", "Green-E", "741", "742", "751", "749"

 		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(foundLocation);
	    } else { 
	        alert("No location data available. Be sure wifi/location services are enabled.");
	    }

	    function foundLocation(position){
	    	$scope.position = position;
	        $scope.$apply();
	        console.log($scope.position);
	        http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=931_&format=json
			/*var r = "http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=" 
			        + API_KEY 
			        + "route=" 
			        + $scope.position.coords.latitude
			        + "&lon=" 
			        + $scope.position.coords.longitude
			        + "&format=json";
			r="http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=Blue&format=json"*/

			console.log(orange_stops);
			console.log(red_stops);
			console.log(blue_stops);
	    }


	    function distanceInKM(lat1,lon1,lat2,lon2) {
		  var R = 6371; // Radius of the earth in km
		  var dLat = deg2rad(lat2-lat1);  // deg2rad below
		  var dLon = deg2rad(lon2-lon1); 
		  var a = 
		    Math.sin(dLat/2) * Math.sin(dLat/2) +
		    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		    Math.sin(dLon/2) * Math.sin(dLon/2)
		    ; 
		  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		  var d = R * c; // Distance in km
		  return d;
		}
		function deg2rad(deg) {
		  return deg * (Math.PI/180)
		}
 	});
})();
