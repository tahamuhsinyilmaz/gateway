const noble = require('noble');


noble.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        // only scan for devices advertising these service UUID's (default or empty array => any peripherals
        var serviceUuids = ['fff0'];

        // allow duplicate peripheral to be returned (default false) on discovery event
        var allowDuplicates = true;

        noble.startScanning(serviceUuids, allowDuplicates);

    } else {
        noble.stopScanning();
    }
});

noble.on('discover', function(peripheral) {
    console.log('Found device with local name: ' + peripheral.advertisement.localName);
    console.log('advertising the following service uuids: ' + peripheral.advertisement.serviceUuids);
    console.log();
    noble.stopScanning()
    peripheral.connect(function(error) {
       if(error){console.log('Can not connected to peripheral: ' + peripheral.uuid);}
    });

    peripheral.once('connect',()=>{
        console.log('connected to peripheral: ' + peripheral.uuid);
        peripheral.discoverServices(['fff0'], function(error, services) {
            var deviceInformationService = services[0];

            deviceInformationService.discoverCharacteristics(['fff4'], function(error, characteristics) {
                var manufacturerNameCharacteristic = characteristics[0];

                manufacturerNameCharacteristic.read(function(error, data) {
                    console.log('The value is: ' + data.toString('utf8'));

                });
            });
        });
    })
});



