
var mora = require('mora');

function callback(name){

	return function(e) {
		console.log(name, e);
	};
}

// var crm = new mora.I2cInterface({sda:B6, scl:B7});

var board = new mora.UserInterface();
board.onSinglePress(B3, callback(B3));
board.onSinglePress(B4, callback(B4));
board.onSinglePress(B5, callback(B5));
