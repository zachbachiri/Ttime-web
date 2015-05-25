(function(){
 	var app = angular.module('ttime-web', []);

 	app.controller('MainController', function($scope, $http, $q){
 		var API_KEY = 'wJuqWtvdIECadwe4fAl-qg';
 		$scope.position = null;
 		$scope.inbound = true;
 		$scope.stops = {};

 		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(foundLocation);
	    } else { 
	        alert("No location data available. Be sure wifi/location services are enabled.");
	    }

	    function foundLocation(position){
	    	$scope.position = position;
	        $scope.$apply();
	        console.log($scope.position);
			/*var r = "http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=" 
			        + API_KEY 
			        + "route=" 
			        + $scope.position.coords.latitude
			        + "&lon=" 
			        + $scope.position.coords.longitude
			        + "&format=json";

			r="http://realtime.mbta.com/developer/api/v2/stopsbyroute?api_key=wX9NwuHnZU2ToO7GmGR9uw&route=Blue&format=json";*/

			$scope.closest_stops = getClosestStops();
	    }


	    	function distanceInMi(lat1, lon1, lat2, lon2) {
				var radlat1 = Math.PI * lat1/180
				var radlat2 = Math.PI * lat2/180
				var radlon1 = Math.PI * lon1/180
				var radlon2 = Math.PI * lon2/180
				var theta = lon1-lon2
				var radtheta = Math.PI * theta/180
				var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
				dist = Math.acos(dist)
				dist = dist * 180/Math.PI
				dist = dist * 60 * 1.1515
				return dist
			}
			function getClosestStops(){
				var closest_stops = {}
				for(var x in TTIME_LINES){
					var line_name = TTIME_LINES[x].name;
					x = TTIME_LINES[x]["routes"];
					closest_stops[line_name] = {};

					for(var y in x){
						y = x[y];
						var inbound_var = $scope.inbound ? "inbound" : "outbound";
						var closest_id = "-1";
						var closest_distance = 1000;
						for(var z in y[inbound_var]["stop"]){
							z = y[inbound_var]["stop"][z];
							var dist = distanceInMi(parseFloat($scope.position.coords.latitude),
													parseFloat($scope.position.coords.longitude),
													parseFloat(z.stop_lat),
													parseFloat(z.stop_lon));
							if(dist < closest_distance){
								closest_id = z.stop_id;
								closest_distance = dist;
							}
						}
		    			closest_stops[line_name][y.name] = closest_id;
					}
				}
				return closest_stops;
			}
 	});
})();
