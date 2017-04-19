exports.title = "Change of Base";

exports.paramSchema = {
    title: 'change-of-base',
    type: 'object',
    additionalProperties: false,
    properties: {
        "outputType": { "type": "string"},
        "points": {"type": "number"},
        'conversions': {
            type: 'array',
            items: {
                type: 'object',
                required: ['radix', 'range'],
                additionalProperties: false,
                
                properties: {
                    'radix': {
                        type: 'object',
                        required: ['from', 'to'],
                        additionalProperties: false,
                        
                        properties: {
                            'from': {
                                type: 'integer',
                                minimum: 2,
                                maximum: 36,
                            },
                            'to': {
                                type: 'integer',
                                minimum: 2,
                                maximum: 36,
                                not: {constant: {'$data': '1/from'}},
                            },
                        },
                    },
                    'range': {
                        type: 'object',
                        required: ['min', 'max'],
                        additionalProperties: false,
                        
                        properties: {
                            'min': {
                                type: 'integer',
                                minimum: 0,
                            },
                            'max': {
                                type: 'integer',
                                minimum: {'$data': '1/min'},
                            },
                        },
                    },
                },
            },
        },
        'spaceBinary': {
            type: 'boolean',
        },
    },
};

exports.defaultOutputType = "fr";
exports.defaultPoints = 1;
exports.defaultConversions = [ 
    { radix:{ from: 10, to: 2 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 10 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 8 }, range:{ min: 0, max: 511 } },
    { radix:{ from: 8, to: 2 }, range:{ min: 0, max: 63 } },
    { radix:{ from: 2, to: 16 }, range:{ min: 0, max: 65535} },
    { radix:{ from: 16, to: 2 }, range:{ min: 0, max: 65535} } 
];

Number.isSafeInteger = Number.isSafeInteger || function(n) {
    return Math.round(n) == n &&
        n < Math.pow(2, 53) &&
        n > -Math.pow(2, 53);
}

exports.radixDescription = function (radix, useBase) {
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


exports.getConversion = function(randomStream, params, defaultValue) {
    var conversions = defaultValue;
    if (params && params.conversions && params.conversions.length > 0)
    	conversions = params.conversions;
    return randomStream.pick(conversions);
}

exports.formatFrom = function(from, fromRad, toRad) {
    if (fromRad != 2 || (toRad != 8 && toRad != 16)) 
    	return from;
    var groupSize = (toRad == 8) ? 3 : 4;
    return exports.formatBinary(from, groupSize);
}

exports.formatAnswer = function(answer, fromRad, toRad) {
    if (toRad != 2 || (fromRad != 8 && fromRad != 16))
    	return answer;
    var groupSize = (fromRad == 8) ? 3 : 4;
    return exports.formatBinary(answer, groupSize);
}

exports.nZeros = function(n) {
    if (typeof n != 'number' || !Number.isSafeInteger(n)) {
        throw new TypeError("nonnegative integer expected");
    }
    if (n < 0) {
        throw new RangeError("nonnegative integer expected");
    }
    return Array(n+1).join("0");
}

exports.formatBinary = function(str, groupSize) {
    if (str.length == 0) {
        return ""; // not handled automatically: regexp match returns null for no matches
    }
    if (groupSize == 0) {
        return str;
    }
    if (str.length % groupSize != 0) {
        str = exports.nZeros(groupSize - str.length % groupSize) + str;
    }
    return str.match(new RegExp('.{' + groupSize + '}', 'g')).join(" ");
}



exports.generateQuestionText = function (qInputs){ // fromRad, toRad, spaceBinary, fromDesc, toDesc
    var numToConvertInFromRadix = qInputs.numToConvert.toString(qInputs.fromRad);
    if (qInputs.spaceBinary)
    	numToConvertInFromRadix = 
            exports.formatFrom(numToConvertInFromRadix, qInputs.fromRad, qInputs.toRad);
    return "Convert " + numToConvertInFromRadix + " from " + qInputs.fromDesc + " to " + qInputs.toDesc + ".";
}

exports.getSpaceBinary = function(params) {
	return (params && 'spaceBinary' in params) ? params.spaceBinary : true;
}

exports.generateQInputs = function(randomStream, params) {
    var conversion = exports.getConversion(randomStream, params, exports.defaultConversions);

    var fromRad = conversion.radix.from;
    var toRad = conversion.radix.to;
    var qInputs = {
        spaceBinary : exports.getSpaceBinary(params),
        numToConvert : randomStream.randIntBetweenInclusive(conversion.range.min, conversion.range.max),
        fromRad : fromRad,
        toRad : toRad,     
        fromDesc : exports.radixDescription(fromRad, randomStream.nextIntRange(2)),
        toDesc : exports.radixDescription(toRad, randomStream.nextIntRange(2))
    };
    return qInputs;
}

exports.generateOutputType = function(params) {
    console.log("params are "+ JSON.stringify(params));
	return (params && ("outputType" in params)) ? params.outputType : exports.defaultOutputType;
};

exports.generateAnswer = function(qInputs) {
    var answer = qInputs.numToConvert.toString(qInputs.toRad);
    if (qInputs.spaceBinary)
        answer = exports.formatAnswer(answer, qInputs.fromRad, qInputs.toRad);
    return answer;
}

exports.generate = function(randomStream, quizElement) {
    // later add code to validate schema for params and if invalid, then set errors
    // or warnings within the question ? 
    var qInputs = exports.generateQInputs(randomStream, quizElement.params);
    var question = {
        "outputType": exports.generateOutputType(quizElement.params),
        "problemType": "paq-change-of-base",
        "points": ((quizElement & "points" in quizElement) ? quizElement.points: 1), 
        "questionText" : exports.generateQuestionText(qInputs),
        "answer" : exports.generateAnswer(qInputs)
    };
    // more work needs to be done here -- This code must exist in paq-mc-change-of-base
    // for now do dumb generation of incorrect distractors
    if (question.outputType == "mc") {
        question.disractors = [question.answer, "distractor", "distractor", "distractor"];
        question.answerIndex = 0;
    }

	return question;
};

