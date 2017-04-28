var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");


describe("generateQuestionText(qInputs)", function() {
	it('should generate the correct question text', function() {
		var qInputs = {
	        spaceBinary : false,
	        numToConvert : 5,
	        fromRad : 2,
	        toRad : 10,     
	        fromDesc : "binary",
	        toDesc : "decimal"
	    };
		var res = paqChangeOfBaseFR.generateQuestionText(qInputs);
		expect(res).to.eql("Convert 101 from binary to decimal.");
	});

	it('should generate the correct question text', function() {
		var qInputs = {
	        spaceBinary : true,
	        numToConvert : 16,
	        fromRad : 2,
	        toRad : 16,
	        fromDesc : "base 2",
	        toDesc : "base 16"
	    };
		var res = paqChangeOfBaseFR.generateQuestionText(qInputs);
		expect(res).to.eql("Convert 0001 0000 from base 2 to base 16.");
	});

});

/*
describe("generateQuestionText(randomStream, from, fromRad, toRad, spaceBinary)", function() {
	var res;
	var randomStreamMock;
	var nextIntRangeStub, radixDescriptionStub;
	var fromDouble, fromRadDouble, toRadDouble;
	beforeEach(function() {
		randomStreamMock = {
			nextIntRange: function() {}
		}
		fromDouble = "from-double";
		fromRadDouble = "fromRad-double";
		toRadDouble = "toRad-double";
		nextIntRangeStub = sinon.stub(randomStreamMock, "nextIntRange");
		nextIntRangeStub.withArgs(2)
		.onFirstCall().returns("first-nextInt-double")
		.onSecondCall().returns("second-nextInt-double");

		radixDescriptionStub = sinon.stub(paqChangeOfBaseFR, "radixDescription");
		radixDescriptionStub.withArgs(fromRadDouble, "first-nextInt-double").returns("from-description-double")
		.withArgs(toRadDouble, "second-nextInt-double").returns("to-description-double");
	});
	afterEach(function() {
		nextIntRangeStub.restore();
		radixDescriptionStub.restore();
	});

	it('should call randomStream.nextIntRange with argument 2, twice', function() {
		res = paqChangeOfBaseFR.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(nextIntRangeStub.calledTwice).to.be.true;
	});

	it('should produce the random description for fromRad', function() {
		res = paqChangeOfBaseFR.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(radixDescriptionStub.withArgs(fromRadDouble, "first-nextInt-double").calledOnce).to.be.true;
	});

	it('should produce the random description for toRad', function() {
		res = paqChangeOfBaseFR.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(radixDescriptionStub.withArgs(toRadDouble, "second-nextInt-double").calledOnce).to.be.true;
	});

	it('should return the question text with appropriate radix formats', function() {
		res = paqChangeOfBaseFR.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble);
		expect(res).to.equal("Convert " + fromDouble + " from from-description-double to to-description-double.");
	});

	describe("when spaceBinary is true", function() {
		var formatFromStub, formattedDouble;
		beforeEach(function() {
			formattedDouble = "formatted-double";
			formatFromStub = sinon.stub(paqChangeOfBaseFR, "formatFrom").returns("formatted-double");
		});
		afterEach(function() {
			formatFromStub.restore();
		});
		it("should format from", function() {
			res = paqChangeOfBaseFR.generateQuestionText(randomStreamMock, fromDouble, fromRadDouble, toRadDouble, true);
			expect(formatFromStub.calledOnce).to.be.true;
			expect(formatFromStub.calledWith(fromDouble, fromRadDouble, toRadDouble)).to.be.true;
			expect(res).to.equal("Convert " + formattedDouble + " from from-description-double to to-description-double.");
		});
	});

});

*/




