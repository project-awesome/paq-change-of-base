module.exports.title = "Change of Base Free Response";

Number.isSafeInteger = Number.isSafeInteger || function(n) {
    return Math.round(n) == n &&
        n < Math.pow(2, 53) &&
        n > -Math.pow(2, 53);
}

module.exports.defaultConversions = [ 
    { radix:{ from: 10, to: 2 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 10 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 8 }, range:{ min: 0, max: 511 } },
    { radix:{ from: 8, to: 2 }, range:{ min: 0, max: 63 } },
    { radix:{ from: 2, to: 16 }, range:{ min: 0, max: 65535} },
    { radix:{ from: 16, to: 2 }, range:{ min: 0, max: 65535} } 
];

module.exports.radixDescription = function (radix, useBase) {
    if (useBase)
        return "base " + radix;
    switch(radix) {
        case 8: return "octal";
        case 16: return "hexadecimal";
        case 2: return "binary";
        case 10: return "decimal";
        default: return "base " + radix;
    }
}


module.exports.getConversion = function(randomStream, params, defaultValue) {
    var conversions = defaultValue;
    if (params && params.conversions && params.conversions.length > 0)
    	conversions = params.conversions;
    return randomStream.pick(conversions);
}

module.exports.formatFrom = function(from, fromRad, toRad) {
    if (fromRad != 2 || (toRad != 8 && toRad != 16)) 
    	return from;
    var groupSize = (toRad == 8) ? 3 : 4;
    return formatBinary(from, groupSize);
}

module.exports.formatAnswer = function(answer, fromRad, toRad) {
    if (toRad != 2 || (fromRad != 8 && fromRad != 16))
    	return answer;
    var groupSize = (fromRad == 8) ? 3 : 4;
    return formatBinary(answer, groupSize);
}

function nZeros(n) {
    return Array(n+1).join("0");
}

function formatBinary(str, groupSize) {
    if (str.length % groupSize != 0)
        str = nZeros(groupSize - str.length % groupSize) + str;
    return str.match(new RegExp('.{1,' + groupSize + '}', 'g')).join(" ");
}



module.exports.generateQuestionText = function (randomStream, from, fromRad, toRad, spaceBinary) {
    var fromDesc = module.exports.radixDescription(fromRad, randomStream.nextIntRange(2));
    var toDesc = module.exports.radixDescription(toRad, randomStream.nextIntRange(2));
    if (spaceBinary)
    	from = module.exports.formatFrom(from, fromRad, toRad);
    return "Convert " + from + " from " + fromDesc + " to " + toDesc + ".";
}

module.exports.getSpaceBinary = function(params) {
	return (params && 'spaceBinary' in params) ? params.spaceBinary : true;
}

module.exports.generate = function(randomStream, params) {
	var conversion = module.exports.getConversion(randomStream, params, module.exports.defaultConversions);
	var spaceBinary = module.exports.getSpaceBinary(params);
    var numToConvert = randomStream.randIntBetweenInclusive(conversion.range.min, conversion.range.max);
    var fromRad = conversion.radix.from;
    var toRad = conversion.radix.to;      
    var from = numToConvert.toString(fromRad);

    var question = {};

	question.answer = numToConvert.toString(toRad);
    if (spaceBinary)
    	question.answer = module.exports.formatAnswer(question.answer, fromRad, toRad);

	question.question = module.exports.generateQuestionText(randomStream, from, fromRad, toRad, spaceBinary);
	question.format = 'free-response';
	return question;
};

	

module.exports.validateParameters = function(params) {var errors = [];
    if (params === undefined) return [];
    if (typeof params !== 'object') return [{ type: 'ExpectedObjectError', path: []}];

    // spaceBinary validation
    if ('spaceBinary' in params) {
        if (params.spaceBinary !== true && params.spaceBinary !== false)
            errors.unshift({ type: 'ExpectedBooleanError', path: ['spaceBinary']});
    }
    
    // conversions validation
    if ('conversions' in params) {
        if (!Array.isArray(params.conversions)) {
            errors.unshift({ type: 'ExpectedArrayError', path: ['conversions']});
        } else {
            for (var i = 0; params.conversions.length > i; i++) {
                var conversion = params.conversions[i];

                if (!('radix' in conversion)) {
                    errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'radix']});
                } else {
                    // must be [2-10] | [16]
                    if (!('from' in conversion.radix)) {
                        errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'radix', 'from']});
                    } else {
                        if (!(Number.isSafeInteger(conversion.radix.from))) 
                            errors.unshift({ type: 'ExpectedIntegerError', path: ['conversions', i, 'radix', 'from']});
                        if (conversion.radix.from < 2) 
                            errors.unshift({ type: 'MinimumValueError', path: ['conversions', i, 'radix', 'from']});
                        if (conversion.radix.from > 36)
                            errors.unshift({ type: 'MaximumValueError', path: ['conversions', i, 'radix', 'from']});
                    }

                    if (!('to' in conversion.radix)) {
                        errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'radix', 'to']});
                    } else {
                        if (!(Number.isSafeInteger(conversion.radix.to))) 
                            errors.unshift({ type: 'ExpectedIntegerError', path: ['conversions', i, 'radix', 'to']});
                        if (conversion.radix.to < 2) 
                            errors.unshift({ type: 'MinimumValueError', path: ['conversions', i, 'radix', 'to']});
                        if (conversion.radix.to > 36)
                            errors.unshift({ type: 'MaximumValueError', path: ['conversions', i, 'radix', 'to']});
                    }

                    if (('from' in conversion.radix) && ('to' in conversion.radix)) {
                        if (conversion.radix.from === conversion.radix.to) {
                            errors.unshift({ type: 'ToFromEqualError', path: ['conversions', i, 'radix']});
                        }
                    }
                }

                if (!('range' in conversion)) {
                    errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'range']});
                } else {
                    if (!('min' in conversion.range)) {
                        errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'range', 'min']});
                    } else {
                        if (!(Number.isSafeInteger(conversion.range.min))) 
                            errors.unshift({ type: 'ExpectedIntegerError', path: ['conversions', i, 'range', 'min']});
                        if (conversion.range.min < 0) 
                            errors.unshift({ type: 'MinimumValueError', path: ['conversions', i, 'range', 'min']});
                    }

                    if (!('max' in conversion.range)) {
                        errors.unshift({ type: 'RequiredError', path: ['conversions', i, 'range', 'max']});
                    } else {
                        if (!(Number.isSafeInteger(conversion.range.max))) 
                            errors.unshift({ type: 'ExpectedIntegerError', path: ['conversions', i, 'range', 'max']});
                        if (conversion.range.max < 0) 
                            errors.unshift({ type: 'MinimumValueError', path: ['conversions', i, 'range', 'max']});
                    }

                    if (('max' in conversion.range) && ('min' in conversion.range)) {
                        if (conversion.range.min > conversion.range.max) {
                            errors.unshift({ type: 'InvalidIntervalError', path: ['conversions', i, 'range']});
                        }
                    }
                }

            }
        }
    }

    return errors;
}



