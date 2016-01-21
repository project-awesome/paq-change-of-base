var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect;

var paqChangeOfBaseFR = require("../");

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
        describe("title", function() {
			it("should be the module.exports.title", function() {
				expect(res.title).to.equal("Change of Base Free Response");
			});
		});
	});
});

