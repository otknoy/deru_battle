function initCollection() {
    var collection = {};
    var n = 36;
    for (var i = 0; i < n; i++) {
	collection[String(i)] = 0;
    }

    localStorage.setItem("collection", JSON.stringify(collection));
}

function initPlayerStatus() {
    var playerStatus = {
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
	"s_max": 200
    };

    localStorage.setItem("playerStatus", JSON.stringify(playerStatus));
}


(function init() {
    var debug = false;
    if (debug) {
	localStorage.removeItem("collection");
	localStorage.removeItem("playerStatus");
    }

    // collection
    if(localStorage.getItem("collection") === null) {
	initCollection();
	console.log("Init localStorage: collection");
    }
    console.log(localStorage.getItem("collection"));

    // player status
    if(localStorage.getItem("playerStatus") === null) {
	initPlayerStatus();
	console.log("Init localStorage: playerStatus");
    }
    console.log(localStorage.getItem("playerStatus"));
})();
