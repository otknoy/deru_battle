var circles_pos = [];		// サークルの座標(latlng)
var circles_prop = [];		// サークルの属性
var distance = [];			// プレイヤーとサークルの距離
var belong = [];			// サークルにプレイヤーが属しているかどうか
var bel_cir = [];			// どの添字のサークルにプレイヤーが属しているか
var circle_r;				// サークルの半径
var deru = new Audio("sound/deru_button.mp3");

/*-- デルボタンがクリックされたとき --*/
$("img.deru").click(function() {
	field_bgm.pause();
	deru.load();
	deru.play();
	encount(user_pos, samples);
});

/*-- エンカウント処理 --*/
function encount(player, circles){
	console.log(player);

	var sam_num = Data.getSamNum();
	var prop = {"身体的パワー": 0,
		        "社会的パワー": 1,
			    "精神的パワー": 2};
	circle_r = r;
	var bel_num = 0;
	var game_prop;

	for(var i = 0; i < sam_num; i++){
		circles_pos[i] = new google.maps.LatLng(circles[i].latitude, circles[i].longitude);
		circles_prop[i] = prop[Data.place2skill[Data.id2place[circles[i].icon_number]]];
		distance[i] = google.maps.geometry.spherical.computeDistanceBetween(player, circles_pos[i]);
		if(distance[i] <= circle_r) belong[i] = 1;
		else belong[i] = 0;
	}
	console.log(belong);

	for(var i = 0, j = 0; i < sam_num; i++){
		if(belong[i] == 1){
			bel_cir[bel_num] = i;
			bel_num++;
		}
	}
	console.log(bel_cir);

	if(bel_num == 0) {
		game_prop = 3;
	}else{
		game_prop = circles_prop[bel_cir[Math.floor(Math.random() * (bel_num))]];
	}
	console.log(game_prop);

	selene(game_prop);

	location.href = "battle.html";
}

/*-- 敵の決定をする --*/
function selene(g_p){
	var prop_enemy = loading_csv("data/area_enemy.csv");
	var en_enemy = prop_enemy[g_p][String(Math.floor(Math.random() * 9))];
	console.log(prop_enemy[g_p]);
	console.log(en_enemy);

	// Cokkieに保存
	localStorage.setItem("current", en_enemy);
}

/*-- CSVファイル読み込み --*/
function loading_csv(filename){
	var csv2txt = Data2.loadFile(filename);
	var csv_data = Data2.parseCSV(csv2txt); 
	var csv_dict = Data2.csv2dict(csv_data);

	return csv_dict; 
}
