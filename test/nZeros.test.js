// nZeros.test.js

var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

describe('nZeros(n)', function() {
    describe('when n is 0', function() {
        it('should return ""', function() {
            expect(paqChangeOfBaseFR.nZeros(0)).to.equal("");
        });
    });
    describe('when n is 1', function() {
        it('should return "0"', function() {
            expect(paqChangeOfBaseFR.nZeros(1)).to.equal("0");
        });
    });
    describe('when n is 300', function() {
        it('should return a string of 300 "0" chars', function() {
            expect(/^0{300}$/.test(paqChangeOfBaseFR.nZeros(300))).to.be.true;
        });
    });
    describe('when n is negative', function() {
        it('should throw a RangeError', function() {
            expect(function() {return paqChangeOfBaseFR.nZeros(-1);}).to.throw(RangeError);
        });
    });
    describe('when n is not an number', function() {
        it('should throw a TypeError', function() {
            expect(function() {return paqChangeOfBaseFR.nZeros("1");}).to.throw(TypeError);
        });
    });
    describe('when n is not an integer', function() {
        it('should throw a TypeError', function() {
            expect(function() {return paqChangeOfBaseFR.nZeros(1.5);}).to.throw(TypeError);
        });
    });
});
