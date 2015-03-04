var Data = {};
var data_num = 0;
var sample_num = 0;
var areaInfo = loading_csv("data/area.csv");
var prop_num = [0, 0, 0];

/*-- CSVファイル読み込み --*/
function loading_csv(filename){
	var csv2txt = Data2.loadFile(filename);
	var csv_data = Data2.parseCSV(csv2txt); 
	var csv_dict = Data2.csv2dict(csv_data);

	return csv_dict; 
}

Data.loadFile = function(filename) {
    var dfd = $.Deferred();

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
	dfd.resolve(xhr.responseText);
    };

    xhr.open("GET", filename, true);
    xhr.send(null);

    return dfd.promise();
};

Data.parseCSV = function(csv_text) {
    var rows = csv_text.split(/\r\n|\r|\n/);

    var data = [];
    for (var i = 0; i < rows.length; i++) {
	var cells = rows[i].split(",");
	data.push(cells);
    }
    return data;
};


Data.csv2dict = function(csv) {
    var dict = [];

    var labels = csv[0];
    for (var i = 1; i < csv.length; i++) {
	var item = {};
	for (var j = 0; j < csv[i].length; j++) {
	    var key = labels[j];
	    var value = csv[i][j];
	    item[key] = value;
	}
	dict.push(item);
    }

    return dict;
};


Data.places = [
    "交番",
    "公園",
    "幼稚園",
    "保育園",

    "図書館",
    "小学校",
    "中学校",
    "高等学校",
    "専門学校",
    "短期大学・大学",
    "銀行",
    "市役所・町村役場",
    "区役所",
    "職業安定所",

    "公衆便所",
    "ごみ処理施設",
    "神社",
    "寺院",
    "美術館",
    "博物館・資料館"
];

Data.id2place = {
    "119": "交番",
    "154": "公園",
    "125": "幼稚園",
    "124": "保育園",

    "151": "図書館",
    "126": "小学校",
    "127": "中学校",
    "128": "高等学校",
    "129": "専門学校",
    "130": "短期大学・大学",
    "203": "銀行",
    "100": "市役所・町村役場",
    "101": "区役所",
    "111": "職業安定所",

    "169": "公衆便所",
    "114": "ごみ処理施設",
    "147": "神社",
    "148": "寺院",
    "150": "博物館・資料館",
    "152": "美術館"
};

Data.place2skill = {
    "公園": "身体的パワー",
    "交番": "身体的パワー",
    "保育園": "身体的パワー",
    "幼稚園": "身体的パワー",

    "図書館": "社会的パワー",
    "小学校": "社会的パワー",
    "中学校": "社会的パワー",
    "高等学校": "社会的パワー",
    "専門学校": "社会的パワー",
    "短期大学・大学": "社会的パワー",
    "銀行": "社会的パワー",
    "市役所・町村役場": "社会的パワー",
    "区役所": "社会的パワー",
    "職業安定所": "社会的パワー",

    "公衆便所": "精神的パワー",
    "ごみ処理施設": "精神的パワー",
    "神社": "精神的パワー",
    "寺院": "精神的パワー",
    "博物館・資料館": "精神的パワー",
    "美術館": "精神的パワー"
};



Data.parseOsakaData = function(dictArray) {
    return dictArray.map(function(dict) {
		// X,Y,施設名,施設名かな,施設名（施設名かな）,所在地,地区名,TEL,FAX,詳細情報,開館時間,URL,バリアフリー情報,駐輪場 PC,駐輪場 携,大分類,小分類,カテゴリ,アイコン番号,施設ID
		var item = {
			"id": parseInt(dict["施設ID"]),
			"latitude": parseFloat(dict["Y"]),
			"longitude": parseFloat(dict["X"]),
			"name": dict["施設名"],
			"icon_number": parseInt(dict["アイコン番号"])
		};

		return item;
    });
};

Data.filterOsakaData = function(osakaData) {
    return osakaData.filter(function(d) {
		return d["icon_number"] in Data.id2place;
    });
};

Data.addTypeToOsakaData = function(osakaData) {
    return osakaData.map(function(d) {
	var id = String(d["icon_number"]);
	d["type"] = Data.id2place[id];
	return d;
    });
};

Data.loadOsakaData = function() {
    var dfd = $.Deferred();

    Data.loadFile("data/osaka/mapnavoskdat_shisetsuall.csv")
	.then(function(data) {
	    var csv = Data.parseCSV(data);
	    var dict = Data.csv2dict(csv);
	    var osakaData = Data.parseOsakaData(dict);

	    // osakaData = Data.filterOsakaData(osakaData);
	    // osakaData = Data.addTypeToOsakaData(osakaData);

	    dfd.resolve(osakaData);
	});

    return dfd.promise();
};



Data.filterByRegion = function(data, lat1, lng1, lat2, lng2) {
    var filteredData = [];
    var prop = {"身体的パワー": 0,
		        "社会的パワー": 1,
			    "精神的パワー": 2};
	console.log("オリジナルデータの数\n" + data.length);
	data_num = 0;
	prop_num = [0, 0, 0];
    for (var i = 0; i < data.length; i++) {
		var d = data[i];
		// データが表示範囲内にあるかどうか
		if (lat1 < d.latitude  && d.latitude  < lat2 &&
		    lng1 < d.longitude && d.longitude < lng2) {
			// アイコン番号がNaNでないもの
			if(!isNaN(d['icon_number'])){
				for( k = 0; k < 20; k++){
					// アイコン番号が指定のアイコン番号と一致しているもの、かつundefinedでない
					if(areaInfo[k]["icon"] == d['icon_number'] && d != undefined){
						filteredData.push(d);
						data_num++;
						prop_num[prop[Data.place2skill[Data.id2place[d.icon_number]]]]++;
						break;
					}
				}
			}
		}
    }
    return filteredData;
};

Data.sample = function(data, n) {
    function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
    }
	
    console.log("表示範囲内のデータの数\n" + data_num);
	console.log("body : " + prop_num[0]);
	console.log("social : " + prop_num[1]);
	console.log("mind : " + prop_num[2]);
    if (data_num < n) {
		sample_num = data_num;
		console.log("選択したデータの数\n" + sample_num);
		return data;
    }

    var samples = [];
	var num_max = data_num;
    for (var i = 0; i < n; i++) {
		// 表示範囲内のデータからランダムでデータを選択する
		var j = getRandomInt(0, num_max-1);
		//if(data[j]
		samples.push(data[j]);
		// data[j]をdata[]の中から取り除く
		data.splice(j, 1);
		num_max--;
	}
	sample_num = n;
	console.log("選択したデータの数\n" + sample_num);
    return samples;
};

Data.getSamNum = function(){
	return sample_num;
}

Data.filter = function(data, lat1, lng1, lat2, lng2, sample) {
    data = Data.filterByRegion(data, lat1, lng1, lat2, lng2);
    data = Data.sample(data, sample);
    return data;
};
