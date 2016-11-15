
/*

Mora is a module written specifically for the Espruino Pico.

MIT License

*/


/*

Abstraction class for button interface devices.

*/
exports.UserInterface = function UserInterface(debounce) {

	debounce = debounce || 5;
	var _actions = {};
	var _emit = {};

	this.onSinglePress = function(pin, cb) {

		if (_actions[pin]) dettach(pin);

		_actions[pin] = function(e) {

			if (e.state) cb(e);
		}

		attach(pin);
		process.on(''+pin, _actions[pin]);
	};

	this.offSinglePress = function(pin) {

		if (!_actions[pin]) return;
		dettach(pin);
	};


	function attach(pin) {

		_emit[pin] = function(e) {

			process.emit(''+pin, e);
		}
		pinMode(pin, "input_pulldown");
		setWatch(_emit[pin], pin, { repeat:true, debounce:debounce });
	}

	function dettach(pin) {

		pinMode(pin, "auto");
		clearWatch(_emit[pin], pin);
		delete _emit[pin];
	}

	function singlePressListener(cb) {

		return function(e) {

			if (e.state) cb(e);
		};
	}
};



/*

Abstraction class for I2C communication with the Mora
current regulator module (CRM).

*/
exports.I2cInterface = function I2cInterface(pins /* {sda:B6, scl:B7} */) {

	if (!pins || !pins.sda || !pins.scl) throw new Error('Missing SDA/SCL params');
	I2C1.setup(pins);

	var sending = false;
	var crmi = {
		setI: {
			address:   0x8,
			wInputReg: 0x0,
			uDacReg:   0x1,
			wuDacReg:  0x3,
			off:       0x4,
			setIref:   0x6,
			setEref:   0x7,
		},
		readI: {
			address: 0x9,
		},
		readV: {
			address: 0xa,
		},
	};
	var bytes = [
		crmi.setI.wInputReg,
		crmi.setI.uDacReg
	];

	function toi2c(val) {

		return [val >> 8, val & 0xFF];
	}

	function cmd(val) {

		I2C1.writeTo(crmi.setI.address, bytes);
	}

	this.i2cStart = function(freq) {

		freq = freq | 100;
		setInterval(function(){
			if (sending) {
				console.log(Date.now());
			}
		}, freq);
	};

	this.i2cStop = function() {

		clearInterval();
	};
};
