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
	var p = document.createElement("p");
	p.innerHTML = text;

	var elem = document.getElementById('log');
	if (elem === null) {
		elem = document.createElement("div");
		elem.id = 'log';
		elem.classList.add('log');

		document.body.appendChild(elem);
	}

	elem.appendChild(p);
	elem.scrollTop = elem.scrollHeight;
}

var App = function(wsport) {
	try {
		$('.splash').remove();
		$('body').removeClass('disabled');
		$("#map").modal({ show: false });

		this.channel = new TOTVS.TWebChannel(wsport);

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
	this.channel.getPicture(function(value) {
		log('getPicture returned: ' + value);
	});
};

App.prototype.on_device_barcode = function on_device_barcode(event) {
	this.channel.barCodeScanner(function(value) {
		log('barCodeScanner returned: ' + JSON.stringify(value, null, 2));
	});
};

App.prototype.on_device_bt_paired = function on_device_bt_paired(event) {
	this.channel.pairedDevices(function(value) {
		log('pairedDevices returned: ' + JSON.stringify(value, null, 2));
	});
};

App.prototype.on_device_geolocation = function on_device_geolocation(event) {
	this.channel.getCurrentPosition(function(position) {
		log('getCurrentPosition returned: ' + position);

		if (!position) {
			//position = '23.50623S,46.64419W';
			return;
		}

		// Necessario retirar o sinal de Grau para que o MAPS reconheca a posicao
		//position = position.replace(/\xB0/g, '');
		position = position.replace(/[^\w\d\.\,]/g, '');

		var map = $("#map");

		map.find('.modal-title').html(position);
		map.find('iframe')
			.attr('src', 'http://maps.google.com/?q=' + position + '&output=embed')
			.css({
				'height': (window.innerHeight - 120) + 'px'
				//'width': (window.innerWidth - 40) + 'px'
			});
		map.modal('show');
	});
};

App.prototype.on_device_orientation_lock = function on_device_orientation_lock(event) {
	this.channel.lockOrientation(function(value) {
		log('lockOrientation returned: ' + value);
	});
};

App.prototype.on_device_orientation_unlock = function on_device_orientation_unlock(event) {
	this.channel.unlockOrientation(function(value) {
		log('unlockOrientation returned: ' + value);
	});
};

App.prototype.on_device_notify = function on_device_notify(event) {
	var options = {
		id: 1,
		title: "Titulo da Notificação",
		message: "Corpo da Notificação"
	};

	this.channel.createNotification(options, function(value) {
		log('createNotification returned: ' + value);
	});
};

App.prototype.on_device_vibrate = function on_device_vibrate(event) {
	this.channel.vibrate(1000, function(value) {
		log('vibrate returned: ' + value);
	});
};

App.prototype.on_test_bluetooth = function on_test_bluetooth(event) {
	this.channel.testDevice(TOTVS.TWebChannel.BLUETOOTH_FEATURE, function(value) {
		log('testDevice BLUETOOTH_FEATURE returned: ' + value);
	});
};

App.prototype.on_test_nfc = function on_test_nfc(event) {
	this.channel.testDevice(TOTVS.TWebChannel.NFC_FEATURE, function(value) {
		log('testDevice NFC_FEATURE returned: ' + value);
	});
};

App.prototype.on_test_wifi = function on_test_wifi(event) {
	this.channel.testDevice(TOTVS.TWebChannel.WIFI_FEATURE, function(value) {
		log('testDevice WIFI_FEATURE returned: ' + value);
	});
};

App.prototype.on_test_gps = function on_test_gps(event) {
	this.channel.testDevice(TOTVS.TWebChannel.LOCATION_FEATURE, function(value) {
		log('testDevice LOCATION_FEATURE returned: ' + value);
	});
};

App.prototype.on_test_wifi_conn = function on_test_wifi_conn(event) {
	this.channel.testDevice(TOTVS.TWebChannel.CONNECTED_WIFI, function(value) {
		log('testDevice CONNECTED_WIFI returned: ' + value);
	});
};

App.prototype.on_test_3g_conn = function on_test_3g_conn(event) {
	this.channel.testDevice(TOTVS.TWebChannel.CONNECTED_MOBILE, function(value) {
		log('testDevice CONNECTED_MOBILE returned: ' + value);
	});
};

App.prototype.on_config_bluetooth = function on_config_bluetooth(event) {
	this.channel.openSettings(TOTVS.TWebChannel.BLUETOOTH_FEATURE, function(value) {
		log('openSettings BLUETOOTH_FEATURE returned: ' + value);
	});
};

App.prototype.on_config_nfc = function on_config_nfc(event) {
	this.channel.openSettings(TOTVS.TWebChannel.NFC_FEATURE, function(value) {
		log('openSettings BLUETOOTH_FEATURE returned: ' + value);
	});
};

App.prototype.on_config_wifi = function on_config_wifi(event) {
	this.channel.openSettings(TOTVS.TWebChannel.WIFI_FEATURE, function(value) {
		log('openSettings BLUETOOTH_FEATURE returned: ' + value);
	});
};

App.prototype.on_config_gps = function on_config_gps(event) {
	this.channel.openSettings(TOTVS.TWebChannel.LOCATION_FEATURE, function(value) {
		log('openSettings BLUETOOTH_FEATURE returned: ' + value);
	});
};

App.prototype.on_db_create = function on_db_create(event) {
	this.channel.dbExec("create table newTab (cod INTEGER, name TEXT)", function(value) {
		log('dbExec "create table newTab (cod INTEGER, name TEXT)" returned: ' + value);
	});
};

App.prototype.on_db_insert = function on_db_insert(event) {
	var channel = this.channel,
		query = "select max(cod) as RESULT from newTab";

	channel.dbExecuteScalar(query, function(result) {
		log('dbExecuteScalar "' + query + '" returned: ' + JSON.stringify(result));

		var recno = result.data || 0;
		recno++;

		query = "insert into newTab values (" + recno + ", 'User " + recno + "')";

		channel.dbExec(query, function(result) {
			log('dbExec "' + query + '" returned: ' + JSON.stringify(result));
		});
	});
};

App.prototype.on_db_delete = function on_db_delete(event) {
	throw new Error('dbDropTable');
};

App.prototype.on_db_query = function on_db_query(event) {
	this.channel.dbGet("select * from newTab", function(data) {
		log('dbGet: "select * from newTab" returned ' + data);
	});
};

App.prototype.on_db_tables = function on_db_tables(event) {
	this.channel.dbGet("SELECT name FROM sqlite_master WHERE type=\"table\"", function(data) {
		log('dbGet: "SELECT name FROM sqlite_master WHERE type=\"table\"" returned ' + data);
	});
};

App.prototype.on_db_rollback = function on_db_rollback(event) {
	//testRollbackProcess
};

App.prototype.on_db_commit = function on_db_commit(event) {
	//testCommitProcess
};

App.prototype.on_misc_advpl = function on_misc_advpl(event) {
	this.channel.runAdvpl("DtoS(CtoD(\"" + getDate() + "\"))", runAdvplSuccess);
};

App.prototype.on_misc_message = function on_misc_message(event) {
	this.channel.sendMessage({
			"message": "print",
			"value": "Message from CloudBridge App!"
		})
		.then(function(value) {
			log("sendMessage returned:");
			log("type: " + (typeof value));
			log("<pre>value: " + JSON.stringify(value, null, 2) + "</pre>");
		});
};

App.prototype.on_misc_version = function on_misc_version(event) {
	console.log("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);

	alert("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);
};

App.prototype.on_misc_ajax = function on_misc_ajax(event) {
	try {
		$.get("cloudbridge.json", function(data) {
			$("body").append(data);

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



function getPictureSuccess(image) {
	this.channel.createNotification(1, "getPicture", image);
};

function barCodeScannerSuccess(barCode) {
	this.channel.createNotification(1, "barCodeScanner", barCode);
};

function pairedDevicesSuccess(paired) {
	alert(paired);
};

function getDate() {
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();

	return mm + '/' + dd + '/' + yyyy;
};

function runAdvplSuccess(retStr) {
	alert(retStr);
};

function testDeviceSuccess(lRet) {
	alert(lRet);
};

function dbError(error) {
	alert("dbError: " + error);
};
function dbSuccess() {
	// Dummy
};

// Cria tabela
function dbCreateTableSuccess() {
	this.channel.dbExec("insert into newTab values (1,'User 1')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (2,'User 2')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (3,'User 3')", dbSuccess, dbError);
	alert("dbCreateTableSuccess: Tabela criada com sucesso");
};
function dbCreateTable() {
	this.channel.dbExec("create table newTab (cod INTEGER, name TEXT)", dbCreateTableSuccess, dbError);
};

// Deleta tabela
function dbDropTableSuccess() {
	alert("dbDropTable: Ok");
};
function dbDropTable() {
	this.channel.dbExec("drop table newTab", dbDropTableSuccess, dbError);
};

function testCommitProcess() {
	this.channel.dbBegin(dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (4,'User 4')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (5,'User 5')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (6,'User 6')", dbSuccess, dbError);
	this.channel.dbCommit(dbSuccess, dbError);
	alert("testCommitProcess: Ok");
};

function testRollbackProcess() {
	this.channel.dbBegin(dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (4,'User 4')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (5,'User 5')", dbSuccess, dbError);
	this.channel.dbExec("insert into newTab values (6,'User 6')", dbSuccess, dbError);
	this.channel.dbRollback(dbSuccess, dbError);
	alert("testRollbackProcess: Ok");
};


