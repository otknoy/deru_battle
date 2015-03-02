
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

var pInfo = {
	"name": "おれ",
	"lv": 1,
	"hp": 20,
	"escape": 20,
	"body": 11,
	"social": 11,
	"mind": 11,
	"p_max": 200,
	"wanpaku": 2,
	"seigi": 4,
	"bosei": 5,
	"kasikosa": 2,
	"kane": 4,
	"antei": 5,
	"kiyome": 2,
	"reikan": 4,
	"kanjusei": 5,
	"s_max": 200};

function cokkie_check() {
	// Cokkieが無いときは新規作成しておく
	// collection
	if(localStorage.getItem("collection") === null){
		localStorage.setItem("collection", JSON.stringify(collInfo));
		console.log("collection - cokkie 作成");
	}
	// playerStatus
	if(localStorage.getItem("playerStatus") === null){
		localStorage.setItem("playerStatus", JSON.stringify(pInfo));
		console.log("playerStatus - cokkie 作成");
	}
	console.log(localStorage.getItem("playerStatus"));
}