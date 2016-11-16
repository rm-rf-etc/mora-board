
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
exports.I2cInterface = function I2cInterface(pins /* {sda:B7, scl:B6} */) {

	if (!pins || !pins.sda || !pins.scl) throw new Error('Missing SDA/SCL params');
	I2C1.setup(pins);

	var self = this;

	var vref = 4.096;
	var sending = false;

	var set_i = {
		address:  0x20,
		write:    0x0,
		confirm:  0x1,
		update:   0x3,
		shutdown: 0x4,
		setIref:  0x6,
		setEref:  0x7,
	};
	var get_i = {
		address: 0x66,
	};
	var get_v = {
		address: 0x66,
	};
	var get_b = {
		address: 0x55,
	};



	self.setI = function(action, val) {

		if (!set_i.hasOwnProperty(action)) return;

		I2C1.writeTo(set_i.address, [
			set_i[action]
		,	val >> 8
		,	val & 0xff
		]);
	};

	self.i2cStart = function(freq) {

		freq = freq || 100;
		setInterval(function(){
			if (sending) {
				console.log(Date.now());
			}
		}, freq);
	};

	self.i2cStop = function() {

		clearInterval();
	};
};
