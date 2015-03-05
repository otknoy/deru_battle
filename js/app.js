var lat = 34.705895;
var lng = 135.494474;
var map = Map.createMap('map-canvas', lat, lng, 16);
var marker = Map.createMarker(map, '現在地', lat, lng, true);

Data.loadOsakaData().then(function(data) {
    var circles = [];

    var updateCircles = function() {
	var bounds = Map.getMapBounds(map);

	var filters = Data.filterByRegion(data,
					  bounds.lat1, bounds.lng1,
					  bounds.lat2, bounds.lng2);

	var cir_num = 12;
	var samples = Data.sample(filters, cir_num);
        
	for (var i = 0; i < samples.length; i++) {
	    var d = samples[i];

	    var lat = d.latitude;
	    var lng = d.longitude;
	    
	    var skill = Data.place2skill[d.type];
	    var color = {"身体的パワー": "#ff7f50",
			 "社会的パワー": "#4169e1",
			 "精神的パワー": "#3cb371"}[skill];

	    var r = 130;
	    var circle = Map.createCircle(map, lat, lng, r, color);
	    circles.push(circle);
	}
    };

    updateCircles();

    google.maps.event.addListener(map, 'bounds_changed', function() {
	circles.forEach(function(c, i) {
	    c.setMap(null);
	});
	circles = [];

	updateCircles();
    });
    
    // マーカーのドロップ（ドラッグ終了）時のイベント
    google.maps.event.addListener(marker, 'dragend', function(ev){
	// イベントの引数evの、プロパティ.latLngが緯度経度。
        user_pos = ev.latLng;
    });
});

