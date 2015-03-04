var Map = {};

Map.createMap = function(id, lat, lng, zoom) {
    var mapOptions = {
		center: new google.maps.LatLng(lat, lng),
		zoom: zoom
    };
    var map = new google.maps.Map(document.getElementById(id), mapOptions);
    return map;
};

Map.getMapBounds = function(map) {
    var mapBounds = map.getBounds();
    var sw = mapBounds.getSouthWest();
    var ne = mapBounds.getNorthEast();
    var bounds = {
	'lat1': sw.lat(), 'lng1': sw.lng(),
	'lat2': ne.lat(), 'lng2': ne.lng()
    };
    return bounds;
};

Map.createMarker = function(map, title, lat, lng, draggable) {
    var marker = new google.maps.Marker({
	position: new google.maps.LatLng(lat, lng),
	map: map,
	title : title,
	draggable: draggable
    });
    return marker;
};

Map.createCircle = function(map, lat, lng, r, color) {
    var options = {
	strokeColor: color,
	strokeOpacity: 0.8,
	strokeWeight: 1,
	fillColor: color,
	fillOpacity: 0.35,
	map: map,
	center: new google.maps.LatLng(lat, lng),
	radius: r
    };
    var circle = new google.maps.Circle(options);
    return circle;
};
