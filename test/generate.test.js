var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect,
	randomStream = require("random-bits");

var paqChangeOfBaseFR = require("../");


describe("generate(randomStream, params)", function() {
	var genQInputsStub, genInputStub, genAnswerStub;
	var rs, params, question;
	beforeEach(function() {
			genQInputsStub = sinon.stub(paqChangeOfBaseFR, 'generateQInputs')
								.returns("qInputs-double");
			genQuestionTextStub = sinon.stub(paqChangeOfBaseFR, 'generateQuestionText')
								.returns("questionText-double");
			genAnswerStub = sinon.stub(paqChangeOfBaseFR, 'generateAnswer')
								.returns("answer-double");
		    rs = new randomStream.random(7);
			params = {};
			question = paqChangeOfBaseFR.generate(rs, params);
	});
	afterEach(function() {
		genQInputsStub.restore();
		genQuestionTextStub.restore();
		genAnswerStub.restore();
	});
	describe('title', function() {
		it('should equal the question module\'s title', function(){
			expect(question.title).to.equal("Change of Base Free Response");
			expect(question.title).to.equal(paqChangeOfBaseFR.title);
		});
	});
	describe('format', function() {
		it('should be "free-response"', function() {
			expect(question.format).to.equal("free-response");
		});
	});
	describe('question', function() {
		it('should be what generateQuestionText returns', function() {
			expect(genQInputsStub.calledWith(rs, params)).to.be.true;
			expect(genQuestionTextStub.calledWith("qInputs-double")).to.be.true;
			expect(question.question).to.equal("questionText-double");
		});
	});
	describe('answer', function() {
		it('should be whatever generateAnswer returns', function() {
			expect(genAnswerStub.calledWith("qInputs-double")).to.be.true;
			expect(question.answer).to.equal("answer-double");
		});
	});
});







