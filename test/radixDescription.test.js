var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

describe('radixDescription(radix, useBase)', function() {
	describe('when useBase is true and radix is  8', function() {
		it('should return "base 8"', function() {
			expect(paqChangeOfBaseFR.radixDescription(8, true)).to.equal("base 8");
		});
	});
	describe('when useBase is false', function() {
		describe('when radix is 2', function() {
			it('should return "binary"', function() {
				expect(paqChangeOfBaseFR.radixDescription(2, false)).to.equal("binary");
			});
		});
		describe('when radix is 8', function() {
			it('should return "octal"', function() {
				expect(paqChangeOfBaseFR.radixDescription(8, false)).to.equal("octal");
			});
		});
		describe('when radix is 16', function() {
			it('should return "hexadecimal"', function() {
				expect(paqChangeOfBaseFR.radixDescription(16, false)).to.equal("hexadecimal");
			});
		});
		describe('when radix is 10', function() {
			it('should return "decimal"', function() {
				expect(paqChangeOfBaseFR.radixDescription(10, false)).to.equal("decimal");
			});
		});
		describe('when radix is 5', function() {
			it('should return "base 5"', function() {
				expect(paqChangeOfBaseFR.radixDescription(5, false)).to.equal("base 5");
			});
		});
	});
});
