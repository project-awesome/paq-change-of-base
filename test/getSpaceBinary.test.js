var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

describe("getSpaceBinary", function() {
	describe("when spaceBinary is not defined in params", function() {
		it("should return true as the default value", function() {
			var res = paqChangeOfBaseFR.getSpaceBinary({});
			expect(res).to.be.true;
		});
	});
	describe("when params.spaceBinary is defined", function() {
		it("should return that value", function() {
			var res = paqChangeOfBaseFR.getSpaceBinary({ spaceBinary: "spaceBinary-double"});
			expect(res).to.equal("spaceBinary-double");
		});
	});
});