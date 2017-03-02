document.addEventListener("cloudbridgeready", function(event) {
	if (window.app === undefined) {
		window.app = new App();

		log("event cloudbridgeready fired!");
	}
}, false);

window.onerror = function(message, source, lineno, colno, error) {
	var msg = "<div style='color: red'>";
	msg += '<b>Unhandled Error!</b></br>';
	msg += 'Message: ' + message + '</br>';

	if (source)
		msg += 'Source: ' + source + '</br>';

	if (lineno)
		msg += 'Line: ' + lineno + '</br>';

	if (colno)
		msg += 'Column: ' + colno + '</br>';

	if (error)
		msg += 'Error: ' + error + '</br>';

	msg += "</div>";

	log(msg);
};

function log(text) {
	var elem = $('#content-log');
	elem.append('<p>' + text + '<p>');
	elem[0].scrollTop = elem[0].scrollHeight;


	var label = $("#tab-log > .totvs-tab-label");
	var originalText = label.text().trim();
	var matches = originalText.match(/\(\d+\)/g);

	if (matches === null) {
		label.text(originalText + " (1)");
	}
	else {
		var count = Number(matches[0].replace(/[\(\)]/g, ''));

		label.text(originalText.replace(matches[0], "(" + (count + 1) + ")"));
	}
}

var App = function() {
	try {
		$('.splash').remove();
		$("#map").modal({ show: false });

		this.on('click', 'device_cam', this.on_device_cam);
		this.on('click', 'device_barcode', this.on_device_barcode);
		this.on('click', 'device_bt_paired', this.on_device_bt_paired);
		this.on('click', 'device_geolocation', this.on_device_geolocation);
		this.on('click', 'device_orientation_lock', this.on_device_orientation_lock);
		this.on('click', 'device_orientation_unlock', this.on_device_orientation_unlock);
		this.on('click', 'device_notify', this.on_device_notify);
		this.on('click', 'device_vibrate', this.on_device_vibrate);
		this.on('click', 'test_bluetooth', this.on_test_bluetooth);
		this.on('click', 'test_nfc', this.on_test_nfc);
		this.on('click', 'test_wifi', this.on_test_wifi);
		this.on('click', 'test_gps', this.on_test_gps);
		this.on('click', 'test_wifi_conn', this.on_test_wifi_conn);
		this.on('click', 'test_3g_conn', this.on_test_3g_conn);
		this.on('click', 'config_bluetooth', this.on_config_bluetooth);
		this.on('click', 'config_nfc', this.on_config_nfc);
		this.on('click', 'config_wifi', this.on_config_wifi);
		this.on('click', 'config_gps', this.on_config_gps);
		this.on('click', 'db_create', this.on_db_create);
		this.on('click', 'db_insert', this.on_db_insert);
		this.on('click', 'db_delete', this.on_db_delete);
		this.on('click', 'db_query', this.on_db_query);
		this.on('click', 'db_tables', this.on_db_tables);
		this.on('click', 'db_rollback', this.on_db_rollback);
		this.on('click', 'db_commit', this.on_db_commit);
		this.on('click', 'misc_advpl', this.on_misc_advpl);
		this.on('click', 'misc_message', this.on_misc_message);
		this.on('click', 'misc_version', this.on_misc_version);
		this.on('click', 'misc_ajax', this.on_misc_ajax);
		this.on('click', 'misc_temp', this.on_misc_temp);

		$('.totvs-tabstrip').on('click', '.totvs-tab', function(event) {
			var tab = $(this);

			tab.addClass('active')
				.siblings('.totvs-tab').removeClass('active');

			var content = $('#' + tab.attr('id').replace('tab-', 'content-'));

			content.show()
				.siblings().hide();

		});

		log("Started");
	}
	catch (ex) {
		log("Error");
		log(ex);
	}
};

App.prototype.on = function on(event, name, listener) {
	var elem = document.getElementById(name);
	elem.addEventListener(event, listener.bind(this));
};

App.prototype.on_device_cam = function on_device_cam(event) {
	cloudbridge.getPicture().then(function(result) {
		log('getPicture returned: ' + JSON.stringify(result));
		log('<img src="file:///' + result + '" width="100%" />');
	});
};

App.prototype.on_device_barcode = function on_device_barcode(event) {
	cloudbridge.barCodeScanner().then(function(result) {
		log('barCodeScanner returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_device_bt_paired = function on_device_bt_paired(event) {
	cloudbridge.pairedDevices().then(function(result) {
		log('pairedDevices returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_device_geolocation = function on_device_geolocation(event) {
	cloudbridge.getCurrentPosition().then(function(position) {
		log('getCurrentPosition returned: ' + JSON.stringify(position));

		if (position.latitude === undefined) {
			return;
		}

		var map = $("#map");

		map.find('.modal-title').html(position.latitude + ", " + position.longitude);
		map.find('iframe')
			.attr('src', 'http://maps.google.com/?q=' + position.latitude + "," + position.longitude + '&output=embed')
			.css({
				'height': (window.innerHeight - 120) + 'px'
				//'width': (window.innerWidth - 40) + 'px'
			});
		map.modal('show');
	});
};

App.prototype.on_device_orientation_lock = function on_device_orientation_lock(event) {
	cloudbridge.lockOrientation();
};

App.prototype.on_device_orientation_unlock = function on_device_orientation_unlock(event) {
	cloudbridge.unlockOrientation();
};

App.prototype.on_device_notify = function on_device_notify(event) {
	var options = {
		id: 1,
		title: "Titulo da Notificação",
		message: "Corpo da Notificação"
	};

	cloudbridge.createNotification(options);
};

App.prototype.on_device_vibrate = function on_device_vibrate(event) {
	cloudbridge.vibrate(1000);
};

App.prototype.on_test_bluetooth = function on_test_bluetooth(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.BLUETOOTH_FEATURE).then(function(result) {
		log('testDevice BLUETOOTH_FEATURE returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_test_nfc = function on_test_nfc(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.NFC_FEATURE).then(function(result) {
		log('testDevice NFC_FEATURE returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_test_wifi = function on_test_wifi(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.WIFI_FEATURE).then(function(result) {
		log('testDevice WIFI_FEATURE returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_test_gps = function on_test_gps(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.LOCATION_FEATURE).then(function(result) {
		log('testDevice LOCATION_FEATURE returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_test_wifi_conn = function on_test_wifi_conn(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.CONNECTED_WIFI).then(function(result) {
		log('testDevice CONNECTED_WIFI returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_test_3g_conn = function on_test_3g_conn(event) {
	cloudbridge.testDevice(TOTVS.TWebChannel.CONNECTED_MOBILE).then(function(result) {
		log('testDevice CONNECTED_MOBILE returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_config_bluetooth = function on_config_bluetooth(event) {
	cloudbridge.openSettings(TOTVS.TWebChannel.BLUETOOTH_FEATURE);
};

App.prototype.on_config_nfc = function on_config_nfc(event) {
	cloudbridge.openSettings(TOTVS.TWebChannel.NFC_FEATURE);
};

App.prototype.on_config_wifi = function on_config_wifi(event) {
	cloudbridge.openSettings(TOTVS.TWebChannel.WIFI_FEATURE);
};

App.prototype.on_config_gps = function on_config_gps(event) {
	cloudbridge.openSettings(TOTVS.TWebChannel.LOCATION_FEATURE);
};

App.prototype.on_db_create = function on_db_create(event) {
	var query = "create table newTab (cod INTEGER, name TEXT)";

	cloudbridge.dbExec(query).then(function(result) {
		log('dbExec "' + query + '" returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_db_insert = function on_db_insert(event) {
	var query = "select max(cod) as RESULT from newTab";

	cloudbridge.dbExecuteScalar(query).then(function(result) {
		log('dbExecuteScalar "' + query + '" returned: ' + JSON.stringify(result));

		var recno = result.data || 0;
		recno++;

		query = "insert into newTab values (" + recno + ", 'User é: " + recno + "')";

		cloudbridge.dbExec(query).then(function(result) {
			log('dbExec "' + query + '" returned: ' + JSON.stringify(result));
		});
	});
};

App.prototype.on_db_delete = function on_db_delete(event) {
	var query = "drop table newTab";

	cloudbridge.dbExec(query).then(function(result) {
		log('dbExec "' + query + '" returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_db_query = function on_db_query(event) {
	var query = "select * from newTab";

	cloudbridge.dbGet(query).then(function(result) {
		log('dbGet: "' + query + '" returned ' + JSON.stringify(result));

		var rows = result.data,
			tbl = '';

		tbl += '<table class="table table-striped">';
		tbl += '<thead>';
		tbl += '<tr>';
		tbl += '<th>ID</th>';
		tbl += '<th>Name</th>';
		tbl += '</tr>';
		tbl += '</thead>';
		tbl += '<tbody>';

		for (var i = 0; i < rows.length; i++) {
			tbl += '<tr>';
			tbl += '<td>' + rows[i].COD + '</td>';
			tbl += '<td>' + rows[i].NAME + '</td>';
			tbl += '</tr>';
		}

		tbl += '</tbody>';
		tbl += '</table>';

		log(tbl);
	});
};

App.prototype.on_db_tables = function on_db_tables(event) {
	var query = 'SELECT name FROM sqlite_master WHERE type="table"';

	cloudbridge.dbGet(query).then(function(result) {
		log('dbGet: "' + query + '" returned ' + JSON.stringify(result));
	});
};

App.prototype.on_db_rollback = function on_db_rollback(event) {
	log("dbBegin");

	cloudbridge.dbBegin().then(function(result) {
		cloudbridge.dbExec("insert into newTab values (4,'User 4')");
		cloudbridge.dbExec("insert into newTab values (5,'User 5')");
		cloudbridge.dbExec("insert into newTab values (6,'User 6')");

		throw new Error('Rollback the transaction');
	})
	.then(function(result) {
		log("dbCommit");

		cloudbridge.dbCommit();
	})
	.catch(function(error) {
		log("dbRollback: " + error);

		cloudbridge.dbRollback();
	});

};

App.prototype.on_db_commit = function on_db_commit(event) {
	log("dbBegin");

	cloudbridge.dbBegin().then(function(result) {
		cloudbridge.dbExec("insert into newTab values (4,'User 4')");
		cloudbridge.dbExec("insert into newTab values (5,'User 5')");
		cloudbridge.dbExec("insert into newTab values (6,'User 6')");
	})
	.then(function(result) {
		cloudbridge.dbCommit();
	})
	.catch(function(error) {
		log("dbRollback: " + error);

		cloudbridge.dbRollback();
	});

};

App.prototype.on_misc_advpl = function on_misc_advpl(event) {
	var command = 'AllTrim(Upper("   teste advpl 123     "))';

	cloudbridge.runAdvpl(command).then(function(result) {
		log('runAdvpl: "' + command + '" returned: ' + JSON.stringify(result));
	});
};

App.prototype.on_misc_message = function on_misc_message(event) {
	cloudbridge.sendMessage({
			"message": "print",
			"value": "Message from CloudBridge App!"
		})
		.then(function(result) {
			log("sendMessage returned:");
			log("type: " + (typeof result));
			log("<pre>value: " + JSON.stringify(result, null, 2) + "</pre>");
		});
};

App.prototype.on_misc_version = function on_misc_version(event) {
	log("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);

	alert("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);
};

App.prototype.on_misc_ajax = function on_misc_ajax(event) {
	try {
		$.get("cloudbridge.json", function(result) {
			log("<pre>" + result + "</pre>");

			alert("success");
		})
			.done(function() {
				alert("second success");
			})
			.fail(function() {
				alert("error");
			})
			.always(function() {
				alert("finished");
			});

	}
	catch (ex) {
		log("Error");
		log(ex);
	}
};

App.prototype.on_misc_temp = function on_misc_temp(event) {
	cloudbridge.getTempPath().then(function(result) {
		log('Temporary Path: ' + JSON.stringify(result));
	});
};
