var chai = require("chai"),
    expect = chai.expect;

var paqChangeOfBaseFR = require("../");


describe('paramSchema', function() {
    var schema = paqChangeOfBaseFR.paramSchema;

    var validates = require('ajv')({
        //useDefaults: true,
        v5: true,
        allErrors: true,
        verbose: true,
        format: 'full',
    }).compile(schema);
    var validateParameters = function(params) {
        return validates(params) ? [] : validates.errors;
    }

	it('should be an object', function() {
		expect(schema).to.be.an('object');
	});
	describe('when parameters is an empty object', function() {
		it('should be valid', function() {
			expect(validateParameters({})).to.eql([]);
		});
	});

	describe('spaceBinary', function() {
        describe('when value is true', function() {
            it('should be valid', function() {
                var errors = validateParameters({ spaceBinary: true });
                expect(errors).to.eql([]);
            });
        });
        describe('when value is false', function() {
            it('should be valid', function() {
                var errors = validateParameters({ spaceBinary: false });
                expect(errors).to.eql([]);
            });
        });
        describe('when typeof spaceBinary is not boolean', function() {
            it('should give a type error', function() {
                var errors = validateParameters({spaceBinary: 'true'});
                expect(errors.length).to.equal(1);
                expect(errors[0].keyword).to.equal('type');
            });
        });
	});

	describe('conversions', function() {
		var params = {};
        describe('valid conversions values', function() {
            describe('when params is array of size 1', function() {
                before(function() {
                    params.conversions = [ { radix: {from: 2, to: 10}, range:{min: 0, max: 10} } ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when params is array of size greater than 1', function() {
                before(function() {
                    params.conversions = [
                        { radix: {from: 2, to: 10}, range:{min: 0, max: 10} },
                        { radix: {from: 10, to: 8}, range:{min: 0, max: 10} }
                    ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when minVal equals maxVal', function() {
                before(function() {
                    params.conversions = [
                        { radix: {from: 2, to: 10}, range:{min: 0, max: 10} }
                    ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when fromRad is 2 and toRad is 16', function() {
                before(function() {
                    params.conversions = [
                        { radix: {from: 2, to: 16}, range:{min: 1, max: 1000} }
                    ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when fromRad is 3 and toRad is 10', function() {
                before(function() {
                    params.conversions = [
                        { radix: {from: 3, to: 10}, range:{min: 1, max: 1000} }
                    ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when fromRad is 35 and toRad is 36', function() {
                before(function() {
                    params.conversions = [
                        { radix: {from: 35, to: 36}, range:{min: 1, max: 1000} }
                    ];
                });
                it('should be valid', function() {
                    expect(validateParameters(params)).to.eql([]);
                });
            });
            describe('when conversions is an empty array', function() {
                it('should be valid', function() {
                    params.conversions = [];
                    expect(validateParameters(params)).to.eql([]);
                });
            });
        });

        describe('invalid conversions values', function() {
            describe('when conversions is not an array', function() {
                it('should give a type error', function() {
                    var errors = validateParameters({conversions: {}});
		            expect(errors.length).to.equal(1);
	                expect(errors[0].keyword).to.equal('type');
                });
            });

            describe('conversion properties', function() {
                var params = {};

                describe('radix', function() {
                    describe('from', function() {
                        describe('when undefined', function() {
                            before(function() {
                                params.conversions = [ { radix: {to: 10}, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a required error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('required');
                            });
                        });
                        describe('when not an integer', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 3.1, to: 10}, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a type error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('type');
                            });
                        });
                        describe('when less than 2', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 1, to: 10}, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a minimum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('minimum');
                            });
                        });
                        describe('when greater than 36', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 37, to: 10}, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a maximum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('maximum');
                            });
                        });
                    });
                    describe('to', function() {
                        describe('when undefined', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2}, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a required error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('required');
                            });
                        });
                        describe('when not an integer', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 9.1 }, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a type error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('type');
                            });
                        });
                        describe('when less than 2', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 1 }, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a minimum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('minimum');
                            });
                        });
                        describe('when greater than 36', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 37 }, range:{min: 0, max: 10} } ];
                            });
                            it('should contain a maximum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('maximum');
                            });
                        });
                    });

                    describe('when radix.from is the same as radix.to', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 2 }, range:{min: 0, max: 10} } ];
                            });
                        it('should contain an error', function() {
                            var errors = validateParameters(params);
                            expect(errors.length).to.equal(1);
                        });
                    });
                    
                });
                
                describe('range', function() {
                    describe('min', function() {
                        describe('when undefined', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{max: 10} } ];
                            });
                            it('should contain a required error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('required');
                            });
                        });
                        describe('when not an integer', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: 1.1, max: 10} } ];
                            });
                            it('should contain a type error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('type');
                            });
                        });
                        describe('when less than 0', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: -1, max: 10} } ];
                            });
                            it('should contain a minimum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('minimum');
                            });
                        });
                    });

                    describe('max', function() {
                        describe('when undefined', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: 0 } } ];
                            });
                            it('should contain a required error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('required');
                            });
                        });
                        describe('when not an integer', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: 0, max: 10.1 } } ];
                            });
                            it('should contain a type error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('type');
                            });
                        });
                        describe('when less than 0', function() {
                            before(function() {
                                params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: 0, max: -1 } } ];
                            });
                            it('should contain a minimum value error', function() {
                                var errors = validateParameters(params);
                                expect(errors.length).to.equal(1);
                                expect(errors[0].keyword).to.equal('minimum');
                            });
                        });
                    });
                    describe('when range.max is less than range.min', function() {
                        before(function() {
                            params.conversions = [ { radix: {from: 2, to: 10 }, range:{ min: 10, max: 5 } } ];
                        });
                        it('should contain a minimum value error', function() {
                            var errors = validateParameters(params);
                            expect(errors.length).to.equal(1);
                            expect(errors[0].keyword).to.equal('minimum');
                        });
                    });
                    
                });
            });
        });
	});
});