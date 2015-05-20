(function(){
 	var app = angular.module('ttime-web', []);

 	app.controller('MainController', function($scope, $http){
 		var API_KEY = 'wX9NwuHnZU2ToO7GmGR9uw';
 		$scope.position = false;
 		if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(foundLocation);
	    } else { 
	        alert("No location data available. Be sure wifi/location services are enabled.");
	    }

	    function foundLocation(position){
	    	$scope.position = position;
	        $scope.$apply();
	        console.log($scope.position);
			var r = "http://realtime.mbta.com/developer/api/v2/stopsbylocation?api_key=" 
			        + API_KEY 
			        + "&lat=" 
			        + $scope.position.coords.latitude
			        + "&lon=" 
			        + $scope.position.coords.longitude
			        + "&format=json";

			$http.get(r)
				.success(function(data, status, headers, config) {
				  console.log(data);
				})
  				.error(function(data, status, headers, config) {
  				  console.log('error')
  				});
	    }
 	});
})();
