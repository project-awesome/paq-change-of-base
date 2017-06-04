var chai = require("chai"),
	sinon = require("sinon"),
	expect = chai.expect,
	randomStream = require("random-bits");

var paqChangeOfBase = require("../");


describe("generate(randomStream, params)", function() {
	var genQInputsStub, genInputStub, genAnswerStub;
	var rs, params, question;
	beforeEach(function() {
			genQInputsStub = sinon.stub(paqChangeOfBase, 'generateQInputs')
								.returns("qInputs-double");
			genQuestionTextStub = sinon.stub(paqChangeOfBase, 'generateQuestionText')
								.returns("questionText-double");
			genAnswerStub = sinon.stub(paqChangeOfBase, 'generateAnswer')
								.returns("answer-double");
		    rs = new randomStream.random(7);
			params = {};
			question = paqChangeOfBase.generate(rs, params);
	});
	afterEach(function() {
		genQInputsStub.restore();
		genQuestionTextStub.restore();
		genAnswerStub.restore();
	});
	describe('problemType', function() {
		it('should equal the question module\'s name', function(){
			expect(question.problemType).to.equal("paq-change-of-base");
		});
	});
	describe('outputType', function() {
		it('should be one of "fr" or "mc"', function() {
			expect(question.format).to.oneOf(["fr","mc"]);
		});
	});
	describe('questionText', function() {
		it('should be what generateQuestionText returns', function() {
			expect(genQInputsStub.calledWith(rs, params)).to.be.true;
			expect(genQuestionTextStub.calledWith("qInputs-double")).to.be.true;
			expect(question.questionText).to.equal("questionText-double");
		});
	});
	describe('answer', function() {
		it('should be whatever generateAnswer returns', function() {
			expect(genAnswerStub.calledWith("qInputs-double")).to.be.true;
			expect(question.answer).to.equal("answer-double");
		});
	});
});







