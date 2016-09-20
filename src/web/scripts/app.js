var App = function(wsport) {
	try {
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
		this.on('click', 'db_delete', this.on_db_delete);
		this.on('click', 'db_query', this.on_db_query);
		this.on('click', 'db_tables', this.on_db_tables);
		this.on('click', 'db_rollback', this.on_db_rollback);
		this.on('click', 'db_commit', this.on_db_commit);
		this.on('click', 'misc_advpl', this.on_misc_advpl);
		this.on('click', 'misc_message', this.on_misc_message);
		this.on('click', 'misc_version', this.on_misc_version);
		this.on('click', 'misc_ajax', this.on_misc_ajax);
		
		document.body.classList.remove('disabled');
		
		this.appendText("Started");
	}
	catch (ex) {
		this.appendText("Error");
		this.appendText(ex);
	}
}

App.prototype.on = function on(event, name, listener) {
    var elem = document.getElementById(name);
    elem.addEventListener(event, listener.bind(this));
}

App.prototype.on_device_cam = function on_device_cam(event) {
    this.channel.getPicture(getPictureSuccess);
}

App.prototype.on_device_barcode = function on_device_barcode(event) {
    this.channel.barCodeScanner(barCodeScannerSuccess);
}

App.prototype.on_device_bt_paired = function on_device_bt_paired(event) {
    this.channel.pairedDevices(pairedDevicesSuccess);
}

App.prototype.on_device_geolocation = function on_device_geolocation(event) {
    this.channel.getCurrentPosition(getCurrentPositionSuccess);
}

App.prototype.on_device_orientation_lock = function on_device_orientation_lock(event) {
    this.channel.lockOrientation();
}

App.prototype.on_device_orientation_unlock = function on_device_orientation_unlock(event) {
    this.channel.unlockOrientation();
}

App.prototype.on_device_notify = function on_device_notify(event) {
    this.channel.createNotification(1, "Titulo da Notifica&ccedil;&atilde;o", "Corpo  da Notifica&ccedil;&atilde;o");
}

App.prototype.on_device_vibrate = function on_device_vibrate(event) {

}

App.prototype.on_test_bluetooth = function on_test_bluetooth(event) {
    this.channel.testDevice(this.channel.BLUETOOTH_FEATURE, testDeviceSuccess);
}

App.prototype.on_test_nfc = function on_test_nfc(event) {
    this.channel.testDevice(this.channel.NFC_FEATURE, testDeviceSuccess);
}

App.prototype.on_test_wifi = function on_test_wifi(event) {
    this.channel.testDevice(this.channel.WIFI_FEATURE, testDeviceSuccess);
}

App.prototype.on_test_gps = function on_test_gps(event) {
    this.channel.testDevice(this.channel.LOCATION_FEATURE, testDeviceSuccess);
}

App.prototype.on_test_wifi_conn = function on_test_wifi_conn(event) {
    this.channel.testDevice(this.channel.CONNECTED_WIFI, testDeviceSuccess)
}

App.prototype.on_test_3g_conn = function on_test_3g_conn(event) {
    this.channel.testDevice(this.channel.CONNECTED_MOBILE, testDeviceSuccess)
}

App.prototype.on_config_bluetooth = function on_config_bluetooth(event) {
    this.channel.openSettings(this.channel.BLUETOOTH_FEATURE);
}

App.prototype.on_config_nfc = function on_config_nfc(event) {
    this.channel.openSettings(this.channel.NFC_FEATURE);
}

App.prototype.on_config_wifi = function on_config_wifi(event) {
    this.channel.openSettings(this.channel.WIFI_FEATURE);
}

App.prototype.on_config_gps = function on_config_gps(event) {
    this.channel.openSettings(this.channel.LOCATION_FEATURE);
}

App.prototype.on_db_create = function on_db_create(event) {

    this.channel.dbExec("create table newTab (cod INTEGER, name TEXT)", dbCreateTableSuccess, dbError);
}

App.prototype.on_db_delete = function on_db_delete(event) {
    dbDropTable
}

App.prototype.on_db_query = function on_db_query(event) {
    this.channel.dbGet("select * from newTab", dbGetSuccess, dbError);
}

App.prototype.on_db_tables = function on_db_tables(event) {
    this.channel.dbGet("SELECT name FROM sqlite_master WHERE type=\"table\"", dbGetSuccess, dbError);
}

App.prototype.on_db_rollback = function on_db_rollback(event) {
    testRollbackProcess
}

App.prototype.on_db_commit = function on_db_commit(event) {
    testCommitProcess
}

App.prototype.on_misc_advpl = function on_misc_advpl(event) {
    this.channel.runAdvpl("DtoS(CtoD(\"" + getDate() + "\"))", runAdvplSuccess);
}

App.prototype.on_misc_message = function on_misc_message(event) {
	this.channel.sendMessage("CLOUDBRIDGE X", function(p1) {
		var msg = "Return:\n";
		msg += "type: " + (typeof p1) + "\n";
		msg += "value: " + p1 + "\n";
		
		alert(msg);
	});
}

App.prototype.on_misc_version = function on_misc_version(event) {
	console.log("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);
		
    alert("Versão da lib TWebChannel: " + TOTVS.TWebChannel.version);
}

App.prototype.on_misc_ajax = function on_misc_ajax(event) {
	try {
		$.get("cloudbridge.json", function(data) {
			$( "body" ).append( data );
			
			alert( "success" );
		})
		.done(function() {
			alert( "second success" );
		})
		.fail(function() {
			alert( "error" );
		})
		.always(function() {
			alert( "finished" );
		});
		
	}
	catch (ex) {
		this.appendText("Error");
		this.appendText(ex);
	}
}



App.prototype.appendText = function appendText(text) {
	var p = document.createElement("p");
	p.innerHTML = text;
	
	document.body.appendChild(p);
}




function getPictureSuccess(image) {
    this.channel.createNotification(1, "getPicture", image);
}

function barCodeScannerSuccess(barCode) {
    this.channel.createNotification(1, "barCodeScanner", barCode);
}

function pairedDevicesSuccess(paired) {
    alert(paired);
}

function getCurrentPositionSuccess(position) {
    // Necessario retirar o sinal de Grau para que o MAPS reconheca a posicao
    position = position.replace(/�/g, "");
    window.location.href = "http://maps.google.com/?q=" + position;
}

function getDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    return mm + '/' + dd + '/' + yyyy;
}

function runAdvplSuccess(retStr) {
    alert(retStr);
}

function testDeviceSuccess(lRet) {
    alert(lRet);
}

function dbGetSuccess(data) {
    var jsonStr = JSON.stringify(data);
    alert('dbGetSuccess: ' + jsonStr.replace(/"/g, "'"));
}

function dbError(error) {
    alert("dbError: " + error);
}
function dbSuccess() {
    // Dummy
}

// Cria tabela
function dbCreateTableSuccess() {
    this.channel.dbExec("insert into newTab values (1,'User 1')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (2,'User 2')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (3,'User 3')", dbSuccess, dbError);
    alert("dbCreateTableSuccess: Tabela criada com sucesso");
}
function dbCreateTable() {
    this.channel.dbExec("create table newTab (cod INTEGER, name TEXT)", dbCreateTableSuccess, dbError);
}

// Deleta tabela
function dbDropTableSuccess() {
    alert("dbDropTable: Ok");
}
function dbDropTable() {
    this.channel.dbExec("drop table newTab", dbDropTableSuccess, dbError);
}

function testCommitProcess() {
    this.channel.dbBegin(dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (4,'User 4')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (5,'User 5')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (6,'User 6')", dbSuccess, dbError);
    this.channel.dbCommit(dbSuccess, dbError);
    alert("testCommitProcess: Ok");
}

function testRollbackProcess() {
    this.channel.dbBegin(dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (4,'User 4')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (5,'User 5')", dbSuccess, dbError);
    this.channel.dbExec("insert into newTab values (6,'User 6')", dbSuccess, dbError);
    this.channel.dbRollback(dbSuccess, dbError);
    alert("testRollbackProcess: Ok");
}


