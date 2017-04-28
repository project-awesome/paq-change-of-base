var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

describe("getConversion(randomStream, params, defaultValue)", function() {
	var randomStreamMock, params;
	var pickStub;
	var defaultValueDouble;
	beforeEach(function() {
		randomStreamMock = { pick: function() {} };
		defaultValueDouble = "defaultValue-double";
		pickStub = sinon.stub(randomStreamMock, "pick");
	});
	afterEach(function() {
		pickStub.restore();
	});
	describe("when no conversions are specified", function() {
		beforeEach(function() {
			params = { conversions: [] };
		});
		it("should call call pick with the defaultValue", function() {
			paqChangeOfBaseFR.getConversion(randomStreamMock, params, defaultValueDouble);
			expect(pickStub.calledOnce).to.be.true;
			expect(pickStub.calledWith(defaultValueDouble)).to.be.true;
		});
	});
	describe("when conversions are provided", function() {
		var conversionsDouble;
		beforeEach(function() {
			conversionsDouble = [ "conversions", "double" ];
			params = { conversions: conversionsDouble };
		});
		it("should call call pick with the provided conversions", function() {
			paqChangeOfBaseFR.getConversion(randomStreamMock, params, defaultValueDouble);
			expect(pickStub.calledOnce).to.be.true;
			expect(pickStub.calledWith(conversionsDouble)).to.be.true;
		});
	});
	describe("return value", function() {
		it("should be the result of randomStream.pick", function() {
			pickStub.returns("pick-return-double");
			var returnValue = paqChangeOfBaseFR.getConversion(randomStreamMock, params, defaultValueDouble);
			expect(returnValue).to.equal("pick-return-double");
		});
	});
});
