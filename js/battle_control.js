
/*-- 変数 --*/
var stage = 0;		// UIの段階区別
var ui_trick = 0;	// フィジカル：0 , ソーシャル：1 , スピルチュアル：2
var comment_flg = false;
var game_result;	// 勝敗を保存 
var bat_res;		// 戦闘の勝敗 0:win, 1:lose, 2:tie(player win) 3:tie(player lose)
var comInfo;		// コメント文字列データ
var enemyInfo;		// 敵情報の格納
var playerInfo;		// プレイヤー情報の格納
var damege;			// 現在の戦闘によるダメージを保存
var cInfo;			// コレクション情報
var pInfo;			// プレイヤー情報
var battle_bgm = new Audio("sound/battle_bgm.mp3");
var button = new Audio("sound/button.mp3");
var modoru = new Audio("sound/modoru.mp3");

/*-- プレイヤーのクラス --*/
var Player = function(playerStatus) {
    var ps = playerStatus;

    this.name = ps["name"];
    this.lv = ps["lv"];
    this.hp = ps["hp"];
    this.escape = ps["escape"];

    this.p_max = ps["p_max"];
    this.s_max = ps["s_max"];

    this.power = [
	ps["body"],
	ps["social"],
	ps["mind"]
    ];

    this.status = [
	ps["wanpaku"],
	ps["seigi"],
	ps["bosei"],
	ps["kasikosa"],
	ps["kane"],
	ps["antei"],
	ps["kiyome"],
	ps["reikan"],
	ps["kanjusei"],
    ];

    this.trick = null;
};

/*-- 敵のクラス --*/
var Enemy = function(enemyStatus) {
    var es = enemyStatus;

    this.id = parseInt(es.id);
    this.name = es.name;
    this.image = es.file;
    this.hp = parseInt(es.hp);

    this.power = [
	parseInt(es.body),
	parseInt(es.social),
	parseInt(es.mind)
    ];

    this.status = [
	parseInt(es.wanpaku),
	parseInt(es.seigi),
	parseInt(es.bosei),
	parseInt(es.kasikosa),
	parseInt(es.kane),
	parseInt(es.antei),
	parseInt(es.kiyome),
	parseInt(es.reikan),
	parseInt(es.kanjusei)
    ];
};

/*-- 技のクラス --*/
function Trick(){
    // 技の名前
    this.name = ["わんぱく", "正義感", "母性",
		 "かしこさ", "金の力", "安定感",
		 "清めの力", "霊感", "感受性"];
    // 技の属性 0:body 1:social 2:mind
    this.prop = [0, 0, 0, 1, 1, 1, 2, 2, 2];
    // 属性の強弱 0win1 1win2 2win0
    this.win = [1, 2, 0];
    this.los = [2, 0, 1];
}
var trick = new Trick();

var player = null;
var enemy = null;
/*-- 戦闘画面が開かれたとき --*/
$(window).load(function() {
    // 各種情報を読み込む
    // loading_cinfo();

    var playerStatus = JSON.parse(localStorage.getItem("playerStatus"));
    player = new Player(playerStatus);

    var enemyId = localStorage.getItem("current");
    var enemyStatus = loading_csv("data/enemy_info.csv")[enemyId];
    enemy = new Enemy(enemyStatus);

    loading_panel();
    loading_comment();
    // 戦闘画面を構築する
    set_battle();
    // 敵の出す技を決める
    set_Etrick();
    // BGM
    battle_bgm.load();
    battle_bgm.volume = 0.7;
    battle_bgm.loop = true;
    battle_bgm.play();
    button.load();
});

/*------------- 以下、戦闘用メソッド -------------*/

/*-- 敵の出す技の決定 --*/
function set_Etrick(){
    // 出す技の基本属性の決定
    var start = enemy.power[0];
    var inter = start + enemy.power[1];
    var end = inter + enemy.power[2];
    // 0 ～ end までのランダムな数値を取得し、0 ～ start = body, start ～ inter = social, inter ～ end = mind
    var ran = Math.floor(Math.random() * end);
    var prop;	// 0:body , 1:social, 2:mind
    if(0 <= ran && ran <= start){
	prop = 0;
    } else if(start < ran && ran <= inter){
	prop = 1;
    } else if(inter < ran && ran <= end){
	prop = 2;
    }
    /*
     console.log("start = " + start);
     console.log("inter = " + inter);
     console.log("end = " + end);
     console.log("ran = " + ran);
     console.log("prop = " + prop);
     */

    // 出す技の決定
    start = enemy.status[0 + prop * 3];
    inter = start + enemy.status[1 + prop * 3];
    end = inter + enemy.status[2 + prop * 3];
    ran = Math.floor(Math.random() * end);
    var tri;
    if(0 <= ran && ran <= start){
	tri = 0 + prop * 3;
    } else if(start < ran && ran <= inter){
	tri = 1 + prop * 3;
    } else if(inter < ran && ran <= end){
	tri = 2 + prop * 3;
    }
    /*
     console.log("start = " + start);
     console.log("inter = " + inter);
     console.log("end = " + end);
     console.log("ran = " + ran);
     console.log("trick = " + tri);
     */
    enemy.trick = tri;
}

/*-- 配列の最大値を返す --*
 function MaxValue(array){
 var max = 0;
 for(i = 0; i < array.size; i++){
 if(max < array[i]) max = array[i];
 }
 return max;
 }

 /*-- 勝ち負け判定 --*/
function battle_result(){
    if(trick.win[trick.prop[player.trick]] == trick.prop[enemy.trick]){
	// 勝ち
	return 0;
    }else if(trick.los[trick.prop[player.trick]] == trick.prop[enemy.trick]){
	// 負け
	return 1;
    }else{
	// あいこ
	return 2;
    }
}

/*-- ダメージ計算 --*/
function Damage(result){
    switch(result){
    case 0:		//勝ち
	console.log("Win");
	bat_res = 0;
	// 敵のhpを減らす
	damage = (player.status[player.trick] + player.power[trick.prop[player.trick]] / 10);
	damage = Math.floor(damage);
	enemy.hp = enemy.hp - damage;
	// 0以下になったときは、勝敗を保存する
	if(enemy.hp <= 0){
	    enemy.hp = 0;
	    game_result = 1;
	}
	/*
	 console.log(player.status[player.trick]);
	 console.log(player.power[trick.prop[player.trick]] / 10);
	 console.log(player.status[player.trick] + player.power[trick.prop[player.trick]] / 10);
	 console.log(enemy);
	 */
	break;
    case 1:		//負け
	console.log("Lose");
	bat_res = 1;
	// プレイヤーのHPを減らす
	damage = (enemy.status[enemy.trick] + enemy.power[trick.prop[enemy.trick]] / 10);
	damage = Math.floor(damage);
	player.hp = player.hp - damage;
	// 0以下になったときは、勝敗を保存する
	if(player.hp <= 0){
	    player.hp = 0;
	    game_result = 0;
	}
	/*
	 console.log(enemy.status[enemy.trick]);
	 console.log(enemy.power[trick.prop[enemy.trick]] / 10);
	 console.log(enemy.status[enemy.trick] + enemy.power[trick.prop[enemy.trick]] / 10);
	 console.log(player);
	 */
	break;
    case 2:		//あいこ
	console.log("Tie");
	// プレイヤーの攻撃力と敵の攻撃力の差を計算
	damage = (player.status[player.trick] + player.power[trick.prop[player.trick]] / 10) - (enemy.status[enemy.trick] + enemy.power[trick.prop[enemy.trick]] / 10);
	damage = Math.floor(damage);
	// マイナスのときはプレイヤーがダメージを受ける
	if(damage < 0){
	    player.hp = player.hp + damage;
	    bat_res = 3;
	}else{
	    enemy.hp = enemy.hp - damage;
	    bat_res = 2;
	}
	// 0以下になったときは、勝敗を保存
	if(player.hp <= 0){
	    player.hp = 0;
	    game_result = 0;
	}else if(enemy.hp <= 0){
	    enemy.hp = 0;
	    game_result = 1;
	}

	/*
	 console.log(damamage);
	 console.log(player);
	 console.log(enemy);
	 */
	break;
    default:
	break;
    }
}

/*-- バトル処理メイン --*/
function Battle(){
    console.log("プレイヤー：" + trick.name[player.trick]);
    console.log("敵：" + trick.name[enemy.trick]);
    
    // 勝ち負け判定 0:win 1:los 2:tie
    var result = battle_result();
    // ダメージ計算
    Damage(result);
    // ダメージ反映（敵のHP）
    $(".hp").text("HP " + enemy.hp);
    // 敵の出す技をリロード
    set_Etrick();
    
    // コメント画面を出す
    //	$(".comment").css("visibility", "visible");
    comment_flg = true;
    // コメント出力
    Comment();

    // UIを最初の選択画面へ
    com_battle();

    // HPが0になっているときは戦闘の終了処理へ
    if(enemy.hp == 0 || player.hp == 0){
	end_battle();
    }
}

/*-- ローマ字変換 --*/
function roma(str){
    switch(str){
    case "わんぱく":
	return "wanpaku";
    case "正義感":
	return "seigi";
    case "母性":
	return "bosei";
    case "かしこさ":
	return "kasikosa";
    case "金の力":
	return "kane";
    case "安定感":
	return "antei";
    case "清めの力":
	return "kiyome";
    case "霊感":
	return "reikan";
    case "感受性":
	return "kanjusei";
    }
}

/*-- 戦闘終了時の処理 --*/
function end_battle(){
    var com_str;
    var sta = enemy_max_status();
    console.log(game_result);
    // 経験値の計算
    if(game_result == 1){	// 勝ったとき
	// レベルを上げる
	player.lv++;
	player.hp += 4;
	// ステータスを上げる
	player.status[sta] += 2;
	for(i = 0; i < 9; i++){
	    player.status[i]++;
	}
	// コレクション情報の更新
	cInfo[String(enemy.id)] = 1;
	localStorage.setItem("collection", JSON.stringify(cInfo));
	// プレイヤー情報の更新
	pInfo["lv"]++;
	pInfo["hp"] += 4;
	pInfo[roma(trick.name[sta])] += 2;
	for(i = 0; i < 9; i++){
	    pInfo[roma(trick.name[i])]++;
	}
	pInfo["body"] = pInfo["wanpaku"] + pInfo["seigi"] + pInfo["bosei"];
	pInfo["social"] = pInfo["kasikosa"] + pInfo["kane"] + pInfo["antei"];
	pInfo["mind"] = pInfo["kiyome"] + pInfo["reikan"] + pInfo["kanjusei"];
	console.log(pInfo);
	localStorage.setItem("playerStatus", JSON.stringify(pInfo));

	com_str = "戦闘に勝利した！\n";
	com_str += "レベルが上がった\n現在のレベル：" + player.lv + "\n" + "現在のHP：" + pInfo["hp"] + "\n";
	com_str += trick.name[sta] + "とその他のステータスが上昇した!!\n";
    }else{				// 負けたとき
	// ステータスを下げる
	player.status[sta]--;
	// プレイヤー情報の更新
	pInfo[roma(trick.name[sta])]--;
	pInfo["body"] = pInfo["wanpaku"] + pInfo["seigi"] + pInfo["bosei"];
	pInfo["social"] = pInfo["kasikosa"] + pInfo["kane"] + pInfo["antei"];
	pInfo["mind"] = pInfo["kiyome"] + pInfo["reikan"] + pInfo["kanjusei"];
	localStorage.setItem("playerStatus", JSON.stringify(pInfo));
	com_str = "戦闘に負けてしまった！\n";
	com_str += trick.name[sta] + "のステータスが奪われてしまった\n";
    }
    com_str += "現在の" + trick.name[sta] + "：" + player.status[sta];

    // 試合終了コメント出力
    alert(com_str);

    // フィールドへもどる
    location.href = "tab.html";
}


/*-- 敵のステータスで最大のものの添字を返す --*/
function enemy_max_status(){
    var max;
    var id;
    switch(enemy.prop){
    case 0:		// body
	max = enemy.status[0];
	id = 0;
	if(max < enemy.status[1]){
	    max = enemy.status[1];
	    id = 1;
	}else if(max < enemy.status[2]){
	    max = enemy.status[2];
	    id = 2;
	}
	break;
    case 1:		// social
	max = enemy.status[3];
	id = 3;
	if(max < enemy.status[4]){
	    max = enemy.status[4];
	    id = 4;
	}else if(max < enemy.status[5]){
	    max = enemy.status[5];
	    id = 5;
	}
	break;
    case 2:		// mind
	max = enemy.status[6];
	id = 6;
	if(max < enemy.status[7]){
	    max = enemy.status[7];
	    id = 7;
	}else if(max < enemy.status[8]){
	    max = enemy.status[8];
	    id = 8;
	}
	break;
    case 3:		// normal
	id = Math.floor(Math.random() * 9);
	break;
    }
    return id;
}

/*------------- 以下、戦闘時のコメント処理 -------------*/

/*-- コメント処理メイン --*/
function Comment(){
    //$(".comment").text("テストテストテストテストテスト");
    var com_str;
    damage = Math.abs(damage);
    switch(bat_res){
    case 0:		// 戦闘に勝ったとき
	com_str = trick.name[player.trick] + "で攻撃！よし、勝ったぞ！\n";
	com_str += enemy.name + comInfo[player.trick][Math.floor(Math.random() * 3)] + "\n";
	com_str += damage + "のダメージを与えた！！";
	break;
    case 1:		// 戦闘に負けたとき
	com_str = trick.name[player.trick] + "で攻撃！\nしかし" + enemy.name + "の" + trick.name[enemy.trick] + "には敵わなかった\n";
	com_str += player.name + comInfo[enemy.trick][Math.floor(Math.random() * 3)] + "\n";
	com_str += damage + "のダメージをくらった！！";
	break;
    case 2:		// 引き分け-勝ち
	com_str = trick.name[player.trick] + "で攻撃！あいこだ！\n";
	com_str += enemy.name + comInfo[player.trick][Math.floor(Math.random() * 3)] + "\n";
	com_str += damage + "のダメージだけ与えることができたぞ！！";
	break;
    case 3:		// 引き分け-負け
	com_str = trick.name[player.trick] + "で攻撃！あいこだ！\n";
	com_str += player.name + comInfo[enemy.trick][Math.floor(Math.random() * 3)] + "\n";
	com_str += damage + "のダメージだけくらってしまった！！";
	break;
    }
    alert(com_str);
}

/*-- コメントUIの処理（コメントdivがクリックされたとき） --*/
$(".comment").click(function() {
    if(comment_flg){
	$(".comment").css("visibility", "hidden");
	comment_flg = false;	
    }
    console.log("hoge");
});


/*------------- 以下、各種情報のローディング -------------*/

/*-- CSVファイル読み込み --*/
function loading_csv(filename){
    var csv2txt = Data2.loadFile(filename);
    var csv_data = Data2.parseCSV(csv2txt);
    var csv_dict = Data2.csv2dict(csv_data);

    return csv_dict; 
}

/*-- Cokkie読み込み --*/
function loading_cinfo(){
    cInfo = JSON.parse(localStorage.getItem("collection"));
    console.log("cokkie - 読み込み完了");
}

/*-- Cokkie読み込み --*/
function loading_pinfo(){
    pInfo = JSON.parse(localStorage.getItem("playerStatus"));
    console.log("cokkie - 読み込み完了");
    console.log(pInfo);
}

/*-- コメント文字列読み込み  --*/
function loading_comment(){
    // comment.csvからコメント文字列の読み込み
    comInfo = Data2.parseCSV(Data2.loadFile("data/comment.csv"));
}

/*-- 画面上に敵を反映する --*/
function set_battle(){
    // 敵の名前
    $(".name").text(enemy.name);
    // 敵の画像
    $("img.enemy").attr("src", "image/" + enemy.image);
    // 敵のHP
    $(".hp").text("HP " + enemy.hp);
}



/*------------- 以下、UI操作 -------------*/


/*-- 画面読み込み時のメソッド --*/
function loading_panel(){
    // 左上
    $(".button_leftup").text("たたかう");
    $(".button_leftup").css("background-color", "#ffff99");
    // 右上
    $(".button_rightup").text("死ににくさ" + player.hp);
    $(".button_rightup").css("background-color", "#ffff99");
    // 左下
    $(".button_leftdown").text("ステータス");
    $(".button_leftdown").css("background-color", "#ffff99");
    // 右下
    $(".button_rightdown").text("にげる");
}

/*-- 左上パネルが選択されたとき --*/
$("div.button_leftup").click(function() {
    // 効果音
    button.load();
    button.play();
    switch(stage){
    case 0:		// たたかう
	com_battle();
	
	break;
    case 1:		// フィジカル
	com_physical();
	
	break;
    case 2:		// 技選択
	com_trick_leftup();
	break;
	default :
	break;
    }
});

/*-- 右上パネルが選択されたとき --*/
$("div.button_rightup").click(function() {
    // 効果音
    button.load();
    button.play();
    switch(stage){
    case 0:		// 「HP」
	// 何もしない
	break;
    case 1:		// 「ソーシャル」
	com_social();
	
	break;
    case 2:		// 技選択
	com_trick_rightup();
	break;
	default :
	break;
    }
});

/*-- 左下パネルが選択されたとき --*/
$("div.button_leftdown").click(function() {
    // 効果音
    button.load();
    button.play();
    switch(stage){
    case 0:		// 「ステータス」
	com_status();
	
	break;
    case 1:		// 「スピルチュアル」
	com_spiritual();
	
	break;
    case 2:		// 技選択
	com_trick_leftdown();
	break;
	default :
	break;
    }
});

/*-- 右下パネルが選択されたとき --*/
$("div.button_rightdown").click(function() {
    // 効果音
    modoru.load();
    modoru.play();
    switch(stage){
    case 0:		// にげる
	com_escape();
	break;
    case 1:		// もどる
	com_back();
	
	break;
    case 2:		// もどる
	com_back();
	
	break;
	default :
	break;
    }
});


/*-- にげる選択時のメソッド --*/
function com_escape(){
    // にげあし計算
    // にげる
    location.href = "tab.html";
}

/*-- ステータス選択時のメソッド --*/
function com_status(){
    var str_status;
    str_status = "現在の" + pInfo["name"] + "のステータス" + "\n";
    str_status += "レベル：" + pInfo["lv"] + "\n";
    str_status += "ＨＰ：" + pInfo["hp"] + "\n\n";
    str_status += "フィジカル：" + pInfo["body"] + "\n";
    str_status += "ソーシャル：" + pInfo["social"] + "\n";
    str_status += "マインド：" + pInfo["mind"] + "\n\n";
    str_status += "わんぱく：" + pInfo["wanpaku"] + "\n";
    str_status += "正義感：" + pInfo["seigi"] + "\n";
    str_status += "母性：" + pInfo["bosei"] + "\n";
    str_status += "かしこさ：" + pInfo["kasikosa"] + "\n";
    str_status += "金の力：" + pInfo["kane"] + "\n";
    str_status += "安定感：" + pInfo["antei"] + "\n";
    str_status += "清めの力：" + pInfo["kiyome"] + "\n";
    str_status += "霊感：" + pInfo["reikan"] + "\n";
    str_status += "感受性：" + pInfo["kanjusei"] + "\n";
    alert(str_status);
}

/*-- もどる選択時のメソッド --*/
function com_back(){
    switch(stage){
    case 1:
	stage = 0;
	loading_panel();
	break;
    case 2:
	stage = 1;
	com_battle();
	break;
    default:
	
	break;
    }
}


/*-- たたかう選択時のメソッド --*/
function com_battle() {
    // ステージの進行
    stage = 1;
    // 左上
    $(".button_leftup").text("フィジカル");
    $(".button_leftup").css("background-color", "#dd8558");
    // 右上
    $(".button_rightup").text("ソーシャル");
    $(".button_rightup").css("background-color", "#b0c4de");
    // 左下
    $(".button_leftdown").text("スピリチュアル");
    $(".button_leftdown").css("background-color", "#99ff99");
    // 右下
    $(".button_rightdown").text("もどる");
}

/*-- フィrジカル選択時のメソッド --*/
function com_physical() {
    // ステージの進行
    stage = 2;
    // 技種の決定
    ui_trick = 0;
    // 左上
    $(".button_leftup").text(trick.name[0]);
    $(".button_leftup").css("background-color", "#dd8558");
    // 右上
    $(".button_rightup").text(trick.name[1]);
    $(".button_rightup").css("background-color", "#dd8558");
    // 左下
    $(".button_leftdown").text(trick.name[2]);
    $(".button_leftdown").css("background-color", "#dd8558");
    // 右下
    $(".button_rightdown").text("もどる");
}

/*-- ソーシャル選択時のメソッド --*/
function com_social() {
    // ステージの進行
    stage = 2;
    // 技種の決定
    ui_trick = 1;
    // 左上
    $(".button_leftup").text(trick.name[3]);
    $(".button_leftup").css("background-color", "#b0c4de");
    // 右上
    $(".button_rightup").text(trick.name[4]);
    $(".button_rightup").css("background-color", "#b0c4de");
    // 左下
    $(".button_leftdown").text(trick.name[5]);
    $(".button_leftdown").css("background-color", "#b0c4de");
    // 右下
    $(".button_rightdown").text("もどる");
}

/*-- スピルチュアル選択時のメソッド --*/
function com_spiritual() {
    // ステージの進行
    stage = 2;
    // 技種の決定
    ui_trick = 2;
    // 左上
    $(".button_leftup").text(trick.name[6]);
    $(".button_leftup").css("background-color", "#99ff99");
    // 右上
    $(".button_rightup").text(trick.name[7]);
    $(".button_rightup").css("background-color", "#99ff99");
    // 左下
    $(".button_leftdown").text(trick.name[8]);
    $(".button_leftdown").css("background-color", "#99ff99");
    // 右下
    $(".button_rightdown").text("もどる");
}

/*-- 技が選択されたとき - 左上パネル --*/
function com_trick_leftup(){
    switch(ui_trick){
    case 0:		// フィジカル - わんぱくさ
	player.trick = 0;
	break;
    case 1:		// ソーシャル - かしこさ
	player.trick = 3;
	break;
    case 2:		// スピルチュアル - 清めの力
	player.trick = 6;
	break;
    default:
	
	break;
    }
    // バトル処理へ
    Battle();
}

/*-- 技が選択されたとき - 右上パネル --*/
function com_trick_rightup(){
    switch(ui_trick){
    case 0:		// フィジカル - 正義感
	player.trick = 1;
	break;
    case 1:		// ソーシャル - 金の力
	player.trick = 4;
	break;
    case 2:		// スピルチュアル - 霊感
	player.trick = 7;
	break;
    default:
	
	break;
    }
    // バトル処理へ
    Battle();
}

/*-- 技が選択されたとき - 左下パネル --*/
function com_trick_leftdown(){
    switch(ui_trick){
    case 0:		// フィジカル - 母性
	player.trick = 2;
	break;
    case 1:		// ソーシャル - 安定感
	player.trick = 5;
	break;
    case 2:		// スピルチュアル - 感受性
	player.trick = 8;
	break;
    default:
	
	break;
    }
    // バトル処理へ
    Battle();
}


