// 最初の状態
$(".contents_frameA").show();
$(".contents_frameB").hide();
$(".contents_frameC").hide();

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

