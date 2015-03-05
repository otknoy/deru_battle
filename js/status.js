var Status = {};

Status.update = function(status) {
    function updateBasicStatus(name, lv, hp) {
	$("#status .name").text(name);
	$("#status .lv").text(lv);
	$("#status .hp").text(hp);
    }

    function drawRadarChart(body, social, mind) {
	var data = [
	    {
		className: 'playerStatus', // optional can be used for styling
		axes: [
		    {axis: "フィジカル", value: body},
		    {axis: "ソーシャル", value: social},
		    {axis: "スピリチュアル", value: mind}
		]
	    }
	];
	// RadarChart.draw("#radar-chart", data);

	var chart = RadarChart.chart();
	chart.config({
	    containerClass: 'radar-chart', // target with css, default stylesheet targets .radar-chart
	    w: 240,
	    h: 240,
	    factor: 0.95,
	    factorLegend: 1,
	    levels: 3,
	    maxValue: 0,
	    radians: 2 * Math.PI,
	    color: d3.scale.category10(), // pass a noop (function() {}) to decide color via css
	    axisLine: true,
	    axisText: true,
	    circles: true,
	    radius: 5,
	    axisJoin: function(d, i) {
		return d.className || i;
	    },
	    transitionDuration: 300
	});

	var svg = d3.select('#radar-chart').append('svg')
		.attr('width', 240)
		.attr('height', 240);

	svg.append('g').classed('focus', 1).datum(data).call(chart);

    }

    function updatePhysicalStatus(wanpaku, seigi, bosei) {
	$("#status .wanpaku").text(wanpaku);
	$("#status .seigi").text(seigi);
	$("#status .bosei").text(bosei);
    }

    function updateSocialStatus(kasikosa, kane, antei) {
	$("#status .kasikosa").text(kasikosa);
	$("#status .kane").text(kane);
	$("#status .antei").text(antei);
    }

    function updateSpiritualStatus(kiyome, reikan, kanjusei) {
	$("#status .kiyome").text(kiyome);
	$("#status .reikan").text(reikan);
	$("#status .kanjusei").text(kanjusei);
    }


    updateBasicStatus(status.name, status.lv, status.hp);

    drawRadarChart(status.body, status.social, status.mind);

    updatePhysicalStatus(status.wanpaku, status.seigi, status.bosei);
    updateSocialStatus(status.kasikosa, status.kane, status.antei);
    updateSpiritualStatus(status.kiyome, status.reikan, status.kanjusei);
};


// var playerStatus = {
//     "name": "おれ",
//     "lv": 1,
//     "hp": 20,
//     "escape": 20,
//     "body": 11,
//     "social": 1,
//     "mind": 5,
//     "p_max": 200,
//     "wanpaku": 2,
//     "seigi": 4,
//     "bosei": 5,
//     "kasikosa": 2,
//     "kane": 4,
//     "antei": 5,
//     "kiyome": 2,
//     "reikan": 4,
//     "kanjusei": 5,
//     "s_max": 200
// };

// var playerStatus = JSON.parse(localStorage.getItem("playerStatus"));
// Status.update(playerStatus);
