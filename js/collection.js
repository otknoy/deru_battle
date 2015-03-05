var Collection = {};

Collection.loadItems = function(collection) {
    var dfd = $.Deferred();

    Data.loadFile("data/collection.csv")
	.then(function(data) {
	    var csv = Data.parseCSV(data);
	    var collection = Data.csv2dict(csv);

	    var collected = JSON.parse(localStorage.getItem("collection"));
	    var n = collection.length;

	    var items = [];
	    for (var i = 0; i < n; i++) {
		var filename = collection[i].file;
		if (collected[String(i)] == 0) {
		    filename += "_s.png";
		} else {
		    filename += ".png";
		}

		var name = collection[i].name;

		items.push({"filename": filename, "name": name});
	    }

	    dfd.resolve(items);
	});

    return dfd.promise();
};

Collection.displayCollection = function(items) {
    var $table = $('table#collection');
    var w = 3;
    var h = items.length / w;
    for (var i = 0; i < h; i++) {
	var $tr = $('<tr>');

	for (var j = 0; j < w; j++) {
	    var k = i*w + j;

	    if (k >= items.length-1) {
		break;
	    }

	    var $td = $('<td>');
	    var $img = $('<img>').attr('src', 'image/' + items[k].filename)
		    .attr({'id': 'e' + k, 'class': 'collection'});

	    var name = items[k].name;
	    name = name.replace(/\s/g, '</br>');
	    var $p = $('<p>').html(name);

	    $td.append($img);
	    $td.append($p);

	    $tr.append($td);
	}

	$table.append($tr);
    }
};
