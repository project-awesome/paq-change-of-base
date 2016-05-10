var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");


describe("generateAnswer(qInputs)", function() {
	it('should generate the correct answer', function() {
		var qInputs = {
	        spaceBinary : false,
	        numToConvert : 5,
	        fromRad : 2,
	        toRad : 10,     
	        fromDesc : "binary",
	        toDesc : "decimal"
	    };
		var res = paqChangeOfBaseFR.generateAnswer(qInputs);
		expect(res).to.equal('5');
	});
});