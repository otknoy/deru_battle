var field_bgm = new Audio("sound/field.mp3");
field_bgm.load();
field_bgm.volume = 0.7;
field_bgm.loop = true;
field_bgm.play();

var lat = 34.705895;
var lng = 135.494474;
var map = Map.createMap('map-canvas', lat, lng, 16);
var playerMarker = Map.createMarker(map, '現在地', lat, lng, true);

Data.loadOsakaData().then(function(data) {
    var circles = [];
    var samples = [];

    var updateCircles = function() {
	var bounds = Map.getMapBounds(map);

	var filters = Data.filterByRegion(data,
					  bounds.lat1, bounds.lng1,
					  bounds.lat2, bounds.lng2);

	var cir_num = 12;
	samples = Data.sample(filters, cir_num);
        
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


    // encout
    $("img.deru").click(function() {
	// sound
	field_bgm.pause();
	var buttonSound = new Audio("sound/deru_button.mp3");
	buttonSound.load();
	buttonSound.play();

	var items = samples;
	var playerPos = playerMarker.getPosition();
	var placeType = checkPlaceType(items, circles, playerPos);

	var enemyIndexes = getEncountingEnemyIndexes(placeType);
	var enemyId = enemyIndexes[Math.floor(Math.random() * enemyIndexes.length)];

	localStorage.setItem("current", enemyId);
	location.href = "battle.html";
    });
});

function checkPlaceType(items, circles,  playerPos) {
    var i = findNearestItemIndex(items, playerPos);
    var item = items[i];
    var circle = circles[i];
    
    var itemPos = new google.maps.LatLng(item.latitude, item.longitude);
    var dist = google.maps.geometry.spherical.computeDistanceBetween(playerPos, itemPos);

    var placeType = null;
    if (dist < circle.getRadius()) {
	placeType = item.type;
    }

    return placeType;
}

function findNearestItemIndex(items, playerPos) {
    var index = null;
    var minDist = Number.MAX_VALUE;
    for (var i = 0; i < items.length; i++) {
	var item = items[i];

	var itemPos = new google.maps.LatLng(item.latitude, item.longitude);
	var dist = google.maps.geometry.spherical.computeDistanceBetween(playerPos, itemPos);

	if (dist < minDist) {
	    minDist = dist;
	    index = i;
	}
    }
    return index;
}

function getEncountingEnemyIndexes(playceType) {
    var skillType = "normal";
    if (playceType != null) {
	skillType = Data.place2skill[playceType];
    }
    
    return {
	"身体的パワー": [3, 4, 5, 6, 7, 8, 9, 10, 11],
	"社会的パワー": [15, 16, 17, 18, 19, 20, 21, 22, 23],
	"精神的パワー": [27, 28, 29,30,31,32,33,34,35],
	"normal": [0, 1, 2, 12, 13, 14, 24, 25, 26]
    }[skillType];
}
