var draw_qrcode = function(text, typeNumber, errorCorrectLevel) {
	document.write(create_qrcode(text, typeNumber, errorCorrectLevel) );
};

var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {

	var qr = qrcode(typeNumber || 4, errorCorrectLevel || 'M');
	qr.addData(text);
	qr.make();

	return qr.createImgTag(10, 10);
};

var update_qrcode = function(text) {
	document.getElementById('qr').innerHTML = create_qrcode(text);
};