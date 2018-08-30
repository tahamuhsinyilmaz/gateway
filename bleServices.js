const bleno = require("bleno");
const WiFiControl = require("wifi-control")

let ss='';
let ps='';
let connectionCheck;
let sensorData;

// Servislere ait UUID'ler
const DEVICE_INFORMATION_UUID="0x180A";
const SENSOR_DATA_SERVICE_UUID = "0x736e" //"b508507d-7ce2-4b08-aeed-45f7a492433a";
const ONBOARD_SERVICE_UUID="696b6f6c-6974-7365-7276-6f6e626f6172";//"101b2ffe-67f4-4120-b69d-3ef0931bb7d7";

//  Karakteristiklere ait UUID'ler
const MOTION_UUID = "696b6f6c-6974-6368-6172-6d6f74696f6e";//"b7174acc-e6fa-4a27-b805-bed811727fec";
const FLOOD_UUID = "696b6f6c-6974-6368-6172-00666c6f6f64";//"9bd6dbe6-4bfd-490e-bb8f-ee03a6a449ce";
const SSID_UUID="696b6f6c-6974-6368-6172-000073736964";//"27426bb8-1778-427d-8b84-9d37b3a0a6ad";
const PASSWORD_UUID="696b6f6c-6974-6368-6172-706173737772";//"a01217ae-c376-4c20-b744-b2acf262dfdc";
const ACK_UUID="696b6f6c-6974-6368-6172-61636b6e6f77";//"b3d5a368-920c-458d-8525-c35cc1a35c7f";
const CONNECTION_CHECK="696b6f6c-6974-6368-6172-636f6e6e6563";
const SEARCH_UUID="696b6f6c-6974-6368-6172-736561726368";//"bf2e3566-aaee-423b-b6ae-004eb32c6f5b";
const LOCATION_UUID="696b6f6c-6974-6368-6172-6c6f6361746e";//"fbb763cd-d712-4f87-b6c1-f1657cb44d1c";
const SYSTEM_BATTERY_UUID="696b6f6c-6974-6368-6172-737973626174";//"08d53367-3763-408d-83c8-41dd7a0a4303";
const SMOKE_UUID="696b6f6c-6974-6368-6172-00736d6f6b6cd5";//"8a83e9a5-6c54-4220-8d20-0cb907305b23";
const GATEWAY_BATTERY_UUID="696b6f6c-6974-6368-6172-677477626174";//"4cb6ca17-b93a-49a6-8657-ed47a791657c";
const VELOCITY_UUID="696b6f6c-6974-6368-6172-76656c6f6374";//"ed5dfc95-8a72-41ae-9eed-1b1e0ee5c9aa";
const TEMPERATURE_HUMIDITY_UUID="696b6f6c-6974-6368-6172-74656d706572";//"b811dda1-0794-4f1b-b6b2-d0abcdf8c595";
const MANUFACTURER_NAME_UUID="2A29";
const MODEL_NUMBER="2A24";


class AckArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["write"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.argument = 0;
		this.name = name;
	}
	
	onWriteRequest(data, offset, withoutResponse, callback) {
		try {
			this.argument = data;
			if(data.toString()=="ok") {
				var _ap={
					ssid:ss,
					password:ps
				}
				WiFiControl.connectToAP(_ap,function (err,response) {
					if(err){
						connectionCheck=err
					}
					connectionCheck=response
					console.log(connectionCheck)
				});
			}
			callback(this.RESULT_SUCCESS);
			
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class SSIDArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["write"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.argument = 0;
		this.name = name;
	}
	
	onWriteRequest(data, offset, withoutResponse, callback) {
		try {
			this.argument = data;
			ss=data.toString()
			callback(this.RESULT_SUCCESS);
			
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class PassArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["write"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.argument = 0;
		this.name = name;
	}
	
	onWriteRequest(data, offset, withoutResponse, callback) {
		try {
			
			this.argument = data;
			ps=data.toString();
			callback(this.RESULT_SUCCESS);
			
			
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class SearchArgumentCharacteristic extends bleno.Characteristic {
	constructor(calcResultFunc) {
		super({
			uuid: SEARCH_UUID,
			properties: ["read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: "SSID'S"
				})
			]
		});
		
		this.calcResultFunc = calcResultFunc;
	}
	
	onReadRequest(offset, callback) {
		try {
			const result = this.calcResultFunc();
			var obj=[];
			var i
			for(i=0;i<5;i++){
				obj.push({name:result.networks[i].ssid})
				
				
			}
			
			console.log(obj)
			let data = new Buffer.from(JSON.stringify(obj))
			callback(this.RESULT_SUCCESS, data);
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class ReadArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.name = name;
	}
	
	onReadRequest(offset, callback) {
		try {
			var data=new Buffer.from(sensorData)
			callback(this.RESULT_SUCCESS, data);
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class ManufacturerReadArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.name = name;
	}
	
	onReadRequest(offset, callback) {
		try {
			callback(this.RESULT_SUCCESS, new Buffer("ikol Bilisim Ltd. Sti"));
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class ModelNumberReadArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.name = name;
	}
	
	onReadRequest(offset, callback) {
		try {
			callback(this.RESULT_SUCCESS, new Buffer("ikol-IoT-Gateway 1.0"));
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class connectionCheckReadArgumentCharacteristic extends bleno.Characteristic {
	constructor(uuid, name) {
		super({
			uuid: uuid,
			properties: ["read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.name = name;
	}
	
	onReadRequest(offset, callback) {
		try {
			callback(this.RESULT_SUCCESS, new Buffer.from(JSON.stringify(connectionCheck)));
			
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
}
class NotifyCharacteristic extends bleno.Characteristic {
	constructor(uuid,name) {
		super({
			uuid: uuid,
			properties: ["notify","read"],
			value: null,
			descriptors: [
				new bleno.Descriptor({
					uuid: "2901",
					value: name
				})
			]
		});
		
		this.counter = 0;
	}
	onReadRequest(offset, callback) {
		try {
			let data = new Buffer.from(sensorData)
			callback(this.RESULT_SUCCESS, data);
		} catch (err) {
			console.error(err);
			callback(this.RESULT_UNLIKELY_ERROR);
		}
	}
	onSubscribe(maxValueSize, updateValueCallback) {
		console.log(`Counter subscribed, max value size is ${maxValueSize}`);
		this.updateValueCallback = updateValueCallback;
	}
	
	onUnsubscribe() {
		console.log("Counter unsubscribed");
		this.updateValueCallback = null;
	}
	
	sendNotification(value) {
		if(this.updateValueCallback) {
			
			const notificationBytes = new Buffer.from(value);
			this.updateValueCallback(notificationBytes);
		}
	}
	
	start() {
		console.log("Starting counter");
		this.handle = setInterval(() => {
			this.counter = Math.random().toString();
			sensorData=this.counter
			this.sendNotification(this.counter);
		}, 3000);
	}
	
	stop() {
		console.log("Stopping counter");
		clearInterval(this.handle);
		this.handle = null;
	}
}


console.log("Starting bleno...");
process.env['BLENO_DEVICE_NAME'] = 'ikol-Gateway';

//wifi settings
WiFiControl.init({
	debug:true,
	iface:null
}); // wifi ilkleme


bleno.on("stateChange", state => {
	
	if (state === "poweredOn") {
		// Local name
		bleno.startAdvertising("Ikol-IoT", [ONBOARD_SERVICE_UUID,SENSOR_DATA_SERVICE_UUID], err => {
			if (err) console.log(err);
			process.env['BLENO_DEVICE_NAME'] = 'ikol-Gateway';
		});
		
		
	} else {
		console.log("Stopping...");
		bleno.stopAdvertising();
	}
});  //advertising baslatma

bleno.on("advertisingStart", err => {
	
	console.log("Configuring services...");
	process.env['BLENO_DEVICE_NAME'] = 'ikol-Gateway';
	if(err) {
		console.error(err);
		return;
	}
	
	// karakteristik tanimlamalari
	let motion = new NotifyCharacteristic(MOTION_UUID, "Motion ");
	motion.start()
	let flood = new NotifyCharacteristic(FLOOD_UUID, "Flood" );
	flood.start()
	let location = new NotifyCharacteristic(LOCATION_UUID,"Location");
	location.start()
	let battery = new NotifyCharacteristic(SYSTEM_BATTERY_UUID,"Battery");
	battery.start()
	let smoke = new NotifyCharacteristic(SMOKE_UUID,"Smoke");
	smoke.start()
	let gatewayBattery = new NotifyCharacteristic(GATEWAY_BATTERY_UUID,"Gateway Battery");
	gatewayBattery.start()
	let velocity = new NotifyCharacteristic(VELOCITY_UUID,"Velocity");
	velocity.start()
	let temperatureHumidity = new NotifyCharacteristic(TEMPERATURE_HUMIDITY_UUID,"Temperature and Humidity");
	temperatureHumidity.start()
	let ssid = new SSIDArgumentCharacteristic(SSID_UUID,"WIFI SSID");
	let pass = new PassArgumentCharacteristic(PASSWORD_UUID,"Password");
	let acknowledge = new AckArgumentCharacteristic(ACK_UUID,"Connect");
	let searcResult = new SearchArgumentCharacteristic(()=> WiFiControl.scanForWiFi( function(err, response) {
		if (err) console.log(err);
		return response
	}));
	let manufacturerName = new ManufacturerReadArgumentCharacteristic(MANUFACTURER_NAME_UUID,"Manufacturer Name");
	let modelNumberString= new ModelNumberReadArgumentCharacteristic(MODEL_NUMBER,"Model Number String");
	let connectionCheckData = new connectionCheckReadArgumentCharacteristic(CONNECTION_CHECK,"Connection Check");
	
	// Servisleri ve Bunların karakteristiklerini oluşturma
	let device_info = new bleno.PrimaryService({
		name:"Device Information",
		uuid:DEVICE_INFORMATION_UUID,
		characteristics:[
			manufacturerName,
			modelNumberString
		]});
	let onboard_iot = new bleno.PrimaryService({
		uuid:ONBOARD_SERVICE_UUID,
		characteristics:[
			ssid,
			pass,
			acknowledge,
			searcResult,
			connectionCheckData
		
		]
	});
	let sensor_data_iot = new bleno.PrimaryService({
		uuid: SENSOR_DATA_SERVICE_UUID,
		characteristics: [
			motion,
			flood,
			location,
			battery,
			smoke,
			gatewayBattery,
			velocity,
			temperatureHumidity
		
		]
	});
	
	bleno.setServices([device_info,sensor_data_iot,onboard_iot], err => {
		
		if(err)
			console.log(err);
		else
			console.log("Services configured");
	}); // servisleri başlatma
	
	
}); // advertising baslayinca eventi


bleno.on("advertisingStartError", err => console.log("Bleno: advertisingStartError"));
bleno.on("advertisingStop", err => console.log("Bleno: advertisingStop"));
bleno.on("servicesSet", err => console.log("Bleno: servicesSet"));
bleno.on("servicesSetError", err => console.log("Bleno: servicesSetError"));
bleno.on("accept",clientAddress=> console.log("Connecting "+clientAddress));
bleno.on("disconnect", clientAddress => console.log(`Bleno: disconnect ${clientAddress}`));