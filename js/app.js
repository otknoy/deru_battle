var lat = 34.705895;
var lng = 135.494474;
var user_pos = new google.maps.LatLng(lat, lng);
var circles = [];
var samples = [];
var r = 130;
var cir_num = 12;
var map = Map.createMap('map-canvas', lat, lng, 16);
// マーカーのドラッグ、ドロップ可（Demo用）ture - false
var marker = Map.createMarker(map, '現在地', lat, lng, true);

Data.loadOsakaData()
    .then(function(data) {
	circles = [];

	var update = function() {
	    var bounds = Map.getMapBounds(map);
            // 表示範囲内にあるデータをfiltersに格納
	    var filters = Data.filterByRegion(data,
					      bounds.lat1, bounds.lng1,
					      bounds.lat2, bounds.lng2);
            // そこから指定数のデータをランダムで選択して格納
	    samples = Data.sample(filters, cir_num);
            
            // 選択したデータを基にサークルを描画していく(連想配列の要素数は .lenght ではとれない)
            var sam_num = Data.getSamNum();
	    for (var i = 0; i < sam_num; i++) {
		var d = samples[i];
		var lat = d.latitude;
		var lng = d.longitude;
                console.log("表示するデータ\nアイコン番号：" + d.icon_number + "\n名前：" + d.name);
		
		var skill = Data.place2skill[Data.id2place[d.icon_number]];
		var color = {"身体的パワー": "#ff7f50",
			     "社会的パワー": "#4169e1",
			     "精神的パワー": "#3cb371"}[skill];

		var circle = Map.createCircle(map, lat, lng, r, color);
		circles.push(circle);
	    }
	};

	update();

        // 地図のスケールや中心が移動したとき、サークルを更新する
	google.maps.event.addListener(map, 'bounds_changed', function() {
	    circles.forEach(function(c, i) {
		c.setMap(null);
	    });
	    circles = [];

	    update();
	});
        
        // マーカーのドロップ（ドラッグ終了）時のイベント
	google.maps.event.addListener(marker, 'dragend', function(ev){
	    // イベントの引数evの、プロパティ.latLngが緯度経度。
            user_pos = ev.latLng;
	});
    });
