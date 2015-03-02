
var field_bgm = new Audio("sound/field.mp3");

// 最初の状態
$(".contents_frameA").show();
$(".contents_frameB").hide();
$(".contents_frameC").hide();
	field_bgm.load();
	field_bgm.volume = 0.7;
	field_bgm.loop = true;
	field_bgm.play();

// ボタンをクリックしたときのイベント処理
$(".tab-buttonA").on("click", function() {
    $(".contents_frameA").show(); 
    $(".contents_frameB").hide();
    $(".contents_frameC").hide();    
});
$(".tab-buttonB").on("click", function() {
    $(".contents_frameB").show();
    $(".contents_frameA").hide();
    $(".contents_frameC").hide();
});
$(".tab-buttonC").on("click", function() {
    $(".contents_frameC").show();
    $(".contents_frameA").hide();
    $(".contents_frameB").hide();
});

