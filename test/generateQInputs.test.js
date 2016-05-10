var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect,
	randomStream = require("random-bits");

var paqChangeOfBaseFR = require("../");


describe("generateQInputs(randomStream, params)", function() {
	it("should generate a reasonable question", function() {
	    var rs = new randomStream.random(5);
		var params = {
	    	"conversions": [
	    		{ 
	    			"range": { "min": 1, "max": 255 },
	    			"radix": { "from": 2, "to": 16 }
	    		}
	    	]
	    };
		var qInputs = paqChangeOfBaseFR.generateQInputs(rs, params);
		expect(qInputs.spaceBinary).to.be.a('boolean');
		expect(qInputs.numToConvert <= 255).to.be.true;
		expect(qInputs.numToConvert >= 1).to.be.true;
		expect(qInputs.fromRad).to.equal(2);
		expect(qInputs.toRad).to.equal(16);
		expect(qInputs.fromDesc == "binary" || qInputs.fromDesc == "base 2").to.be.true;
		expect(qInputs.toDesc == "hexidecimal" || qInputs.toDesc == "base 16").to.be.true;
	});
});