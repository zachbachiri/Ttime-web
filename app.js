(function(){
 	var app = angular.module('ttime-web', []);

 	app.controller('MainController', function($scope, $http, $q, $interval){
 		var API_KEY = 'wJuqWtvdIECadwe4fAl-qg';
 		$scope.position = null;
 		$scope.inbound = true;
 		$scope.trips = {};
 		$scope.closest_stops = {};
 		findLocation();
 		$interval(findLocation(), 10000); //update our data every 60 seconds

	    function findLocation(){
	    	console.log('in findLocation');
	    	if (navigator.geolocation) {
		        navigator.geolocation.getCurrentPosition(foundLocation);
		    } else { 
		        alert("No location data available. Be sure wifi/location services are enabled.");
		    }
	    }

	    $scope.switchDirection = function(){
	    	$scope.inbound = !$scope.inbound;
	    	findLocation();
	    }

	    function foundLocation(position){
	    	$scope.position = position;
	        $scope.$apply();
	        //console.log($scope.position);


			getClosestStops();
			console.log($scope.closest_stops);

			//need to get necessary data in here, time to arrival in minutes,
			//stop name, end stop, etc
			angular.forEach($scope.closest_stops, function(value,key) {
				$scope.trips[key] = {};
				angular.forEach(value,function(stop,line_name) {
					$http.get(predictionAPIString(stop.stop_id)).
					  success(function(data, status, headers, config) {
					  	//console.log(data);
					  	$scope.trips[key][line_name] = {};
					  	$scope.trips[key][line_name]['trips'] = data.mode[0].route[0].direction[0].trip;
					  	$scope.trips[key][line_name]['route_name'] = line_name;
					  	$scope.trips[key][line_name]['parent_route_name'] = key;
					  	$scope.trips[key][line_name]['closest_stop_name'] = stop.stop_name;
					  	angular.forEach($scope.trips[key][line_name].trips,function(trip,key) {
					  		trip['pre_away_rounded'] = Math.ceil(parseFloat(trip['pre_away'])/60);
					  	})
					  	console.log($scope.trips);
					  }).
					  error(function(data, status, headers, config) {
					    console.log("ERROR - data:");
					  });
				})
			})
	    }

	    function getClosestStops(){

			for(var x in TTIME_LINES){
				var line_name = TTIME_LINES[x].name;
				x = TTIME_LINES[x]["routes"];
				$scope.closest_stops[line_name] = {};

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
							closest_name = z.parent_station_name ? z.parent_station_name : z.stop_name;
							closest_distance = dist;
						}
					}
	    			$scope.closest_stops[line_name][y.name] = {};
	    			$scope.closest_stops[line_name][y.name]["stop_id"] = closest_id;
	    			$scope.closest_stops[line_name][y.name]["stop_name"] = closest_name;
				}
			}
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

		function predictionAPIString(stop_id){
			var r = "http://realtime.mbta.com/developer/api/v2/predictionsbystop?api_key=" 
			        + API_KEY 
			        + "&stop=" 
			        + stop_id
			        + "&format=json";
			return r;
		}
 	});
})();
