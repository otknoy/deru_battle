
/*-- 図鑑変数 --*/
var coll = [];		// イラストが有効かどうか
var file = [];		// ファイル名
var ename = [];		// 敵の名前
var collInfo = {	// 有効かどうか
    "0":0,
    "1":0,
    "2":0,
    "3":0,
    "4":0,
    "5":0,
    "6":0,
    "7":0,
    "8":0,
    "9":0,
    "10":0,
    "11":0,
    "12":0,
    "13":0,
    "14":0,
    "15":0,
    "16":0,
    "17":0,
    "18":0,
    "19":0,
    "20":0,
    "21":0,
    "22":0,
    "23":0,
    "24":0,
    "25":0,
    "26":0,
    "27":0,
    "28":0,
    "29":0,
    "30":0,
    "31":0,
    "32":0,
    "33":0,
    "34":0,
    "35":0};


/*-- 画面が開かれたとき --*/
$(window).load(function() {
    // 各種情報を読み込む
    loading_info();
    loading_coll();
    // 画像と名前を出力
    var sel_img;
    var sel_p;
    for(i = 0; i < 36; i++){
	sel_img = "img#e" + i;
	sel_p = "p#p" + i;
	$(sel_img).attr("src", "image/" + file[i]);
	$(sel_p).html(ename[i]);
    }
});

/*-- CSVファイル読み込み --*/
function loading_csv(filename){
    var csv2txt = Data2.loadFile(filename);
    var csv_data = Data2.parseCSV(csv2txt);
    var csv_dict = Data2.csv2dict(csv_data);

    return csv_dict; 
}

/*-- Cokkie読み込み --*/
function loading_info(){
    collInfo = JSON.parse(localStorage.getItem("collection"));
    console.log("cokkie - 読み込み完了");
}

/*-- イラストが有効かどうか取得 --*/
function loading_coll(){
    // data/collection.csvから取得
    var colf = loading_csv("data/collection.csv");
    
    // イラストが有効かどうか
    for(i = 0; i < 36; i++){
	coll[i] = collInfo[String(i)];
    }
    console.log(coll);
    
    // ファイル名を取得
    for(i = 0; i < 36; i++){
	file[i] = colf[i]["file"];
	if(coll[i] == 0){
	    file[i] += "_s.png";
	}else{
	    file[i] += ".png";
	}
    }
    
    // 敵の名前を取得
    var str;
    for(i = 0; i < 36; i++){
	ename[i] = colf[i]["name"];
	str = ename[i].split(" ");
	if(str[1] != null){
	    ename[i] = str[0] + "<br/>" + str[1];
	}
    }

}
