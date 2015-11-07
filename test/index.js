var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

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

// bad giant unit test...
describe("generate(randomStream, params)", function() {
	var res;
	var numToConvertMock, randomStreamMock;
	var randIntBetweenInclusiveStub, toStringStub, generateQuestionTextStub, getSpaceBinaryStub,
		formatAnswerStub;
	var fromRadDouble, toRadDouble, minDoube, maxDouble, paramsDouble, spaceBinaryDouble,
		fromDouble, answerDouble, indexDouble, questionTextDouble, formatDouble;
	var sandbox;
	function setupSandbox() {
		sandbox = sinon.sandbox.create();

		numToConvertMock = { toString: function() { } };
		randomStreamMock = { shuffle: function() { }, randIntBetweenInclusive: function() {} };
		fromDouble = sandbox.spy();
		answerDouble = sandbox.spy();
		paramsDouble = sandbox.spy();
		spaceBinaryDouble = sandbox.spy();
		maxDouble = sandbox.spy();
		minDouble = sandbox.spy();
		formatDouble = sandbox.spy();
		fromRadDouble = sandbox.spy();
		toRadDouble = sandbox.spy();
		questionTextDouble = sandbox.spy();
		conversionDouble = {
			radix: { from: fromRadDouble, to: toRadDouble },
			range: { min: minDouble, max: maxDouble }
		}

		getConversionStub = sandbox.stub(paqChangeOfBaseFR, "getConversion").returns(conversionDouble);
		randIntBetweenInclusiveStub = sandbox.stub(randomStreamMock, "randIntBetweenInclusive").returns(numToConvertMock);
		toStringStub = sandbox.stub(numToConvertMock, "toString")
			.withArgs(fromRadDouble).returns(fromDouble)
			.withArgs(toRadDouble).returns(answerDouble);
		getSpaceBinaryStub = sandbox.stub(paqChangeOfBaseFR, "getSpaceBinary").returns(spaceBinaryDouble);
		generateQuestionTextStub = sandbox.stub(paqChangeOfBaseFR, "generateQuestionText").returns(questionTextDouble);
		formatAnswerStub = sandbox.stub(paqChangeOfBaseFR, "formatAnswer").returns(formatDouble);
	}
	beforeEach(function() {
		setupSandbox();
		res = paqChangeOfBaseFR.generate(randomStreamMock, paramsDouble);

	});
	afterEach(function() {
		sandbox.restore();
	});

	describe("getConversion", function() {
		it("should be called with appropriate parameters", function() {
			expect(getConversionStub.calledOnce).to.be.true;
			expect(getConversionStub.calledWith(
				randomStreamMock, paramsDouble, paqChangeOfBaseFR.defaultConversions
			)).to.be.true;
		});
	});
	describe("getSpaceBinary", function() {
		it("should be called and passed params", function() {
			expect(getSpaceBinaryStub.calledOnce).to.be.true;
			expect(getSpaceBinaryStub.calledWith(paramsDouble)).to.be.true;
		});
	});
	describe("numToConvert", function() {
		it("should be selected with randIntBetweenInclusive with min, max from conversion", function() {
			expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
			expect(randIntBetweenInclusiveStub.calledWith(minDouble, maxDouble)).to.be.true;
		});
	});
	describe("number to convert string format", function() {
		it("should be determined by toString(fromRad) on numToConvert", function() {
			expect(toStringStub.withArgs(fromRadDouble).calledOnce).to.be.true;
		});
	});
	describe("properties assigned to this", function() {
		describe("answer", function() {
			describe("when spaceBinary is false", function() {
				it("should be determined by toString(toRad) on numToConvert", function() {
					sandbox.restore();
					setupSandbox();
					getSpaceBinaryStub.returns(false);
					res = paqChangeOfBaseFR.generate(randomStreamMock, paramsDouble);
					expect(toStringStub.withArgs(toRadDouble).calledOnce).to.be.true;
					expect(res.answer).to.equal(answerDouble);
				});
			});
			describe("when spaceBinary is true", function() {
				it("should be the formattedResult", function() {
					sandbox.restore();
					setupSandbox();
					getSpaceBinaryStub.returns(true);
					res = paqChangeOfBaseFR.generate(randomStreamMock, paramsDouble);
					expect(toStringStub.withArgs(toRadDouble).calledOnce).to.be.true;
					expect(formatAnswerStub.withArgs(answerDouble, fromRadDouble, toRadDouble).calledOnce).to.be.true;
					expect(res.answer).to.equal(formatDouble);
				});
			});
		});
		describe("question", function() {
			it("should be determined by generateQuestionText(randomStream, from, fromRad, toRad)", function() {
				expect(generateQuestionTextStub.withArgs(
					randomStreamMock, fromDouble, fromRadDouble, toRadDouble, spaceBinaryDouble
				).calledOnce).to.be.true;
			});
			it("should be assigned to result of generateQuestionText", function() {
				expect(res.question).to.equal(questionTextDouble);
			});
		});
		describe("format", function() {
			it("should be multiple-choice", function() {
				expect(res.format).to.equal("free-response");
			});
		});
	});
});

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























