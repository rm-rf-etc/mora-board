
var mora = require('mora');

function callback(name){

	return function(e) {
		console.log(name, e);
	};
}

var crmi = new mora.I2cInterface({sda:B7, scl:B6});
var board = new mora.UserInterface();
board.onSinglePress(B3, function(){
	crmi.setI('confirm', 3000);
});
board.onSinglePress(B4, function(){
	crmi.setI('write', 0);
});
board.onSinglePress(B5, function(){
	crmi.setI('update', 2000);
});
