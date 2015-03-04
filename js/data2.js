var Data2 = {};

Data2.loadFile = function(filename) {
	//　csvをテキストで読み込む(同期処理)	
	var xhr = new XMLHttpRequest();
	xhr.open("GET", filename, false);
	xhr.send(null);
	var res = xhr.responseText;
	return res;
};

Data2.parseCSV = function(csv_text) {
    var rows = csv_text.split(/\r\n|\r|\n/);

    var data = [];
    for (var i = 0; i < rows.length; i++) {
	var cells = rows[i].split(",");
	data.push(cells);
    }
    return data;
};


Data2.csv2dict = function(csv) {
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