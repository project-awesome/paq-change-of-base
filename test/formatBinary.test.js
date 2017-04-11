// formatBinary.test.js

var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

describe('formatBinary(str, groupSize)', function() {
    describe('when zero-padding is needed', function() {
        it('should return "0011 0001"', function() {
            expect(paqChangeOfBaseFR.formatBinary("110001", 4)).to.equal("0011 0001");
        });
    });
    describe('when no zero-padding is needed', function() {
        it('should return "110 001"', function() {
            expect(paqChangeOfBaseFR.formatBinary("110001", 3)).to.equal("110 001");
        });
    });
    describe('when groupSize is 1', function() {
        it('should return "1 1 0 0 0 1"', function() {
            expect(paqChangeOfBaseFR.formatBinary("110001", 1)).to.equal("1 1 0 0 0 1");
        });
    });
    describe('when str is empty', function() {
        it('should return ""', function() {
            expect(paqChangeOfBaseFR.formatBinary("", 3)).to.equal("");
        });
    });
    describe('when groupSize is 0', function() {
        it('should return "10101"', function() {
            expect(paqChangeOfBaseFR.formatBinary("10101", 0)).to.equal("10101");
        });
    });

});
