var Geo = {};

Geo.getCurrentPosition = function() {
    var deferred = Promise.defer();

    if ("geolocation" in navigator) {
	navigator.geolocation.getCurrentPosition(function(position) {
	    deferred.resolve(position.coords);
	});
    } else {
	deferred.reject("Geolocation API is not available.");
    }

    return deferred.promise;
};
