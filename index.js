exports.title = "Change of Base Free Response";

exports.paramSchema = {
    title: 'fr-change-of-base',
    type: 'object',
    additionalProperties: false,
    
    properties: {
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

Number.isSafeInteger = Number.isSafeInteger || function(n) {
    return Math.round(n) == n &&
        n < Math.pow(2, 53) &&
        n > -Math.pow(2, 53);
}

exports.defaultConversions = [ 
    { radix:{ from: 10, to: 2 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 10 }, range:{ min: 0, max: 255} },
    { radix:{ from: 2, to: 8 }, range:{ min: 0, max: 511 } },
    { radix:{ from: 8, to: 2 }, range:{ min: 0, max: 63 } },
    { radix:{ from: 2, to: 16 }, range:{ min: 0, max: 65535} },
    { radix:{ from: 16, to: 2 }, range:{ min: 0, max: 65535} } 
];

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



exports.generateQuestionText = function (randomStream, from, fromRad, toRad, spaceBinary) {
    var fromDesc = exports.radixDescription(fromRad, randomStream.nextIntRange(2));
    var toDesc = exports.radixDescription(toRad, randomStream.nextIntRange(2));
    if (spaceBinary)
    	from = exports.formatFrom(from, fromRad, toRad);
    return "Convert " + from + " from " + fromDesc + " to " + toDesc + ".";
}

exports.getSpaceBinary = function(params) {
	return (params && 'spaceBinary' in params) ? params.spaceBinary : true;
}

exports.generate = function(randomStream, params) {
	var conversion = exports.getConversion(randomStream, params, exports.defaultConversions);
	var spaceBinary = exports.getSpaceBinary(params);
    var numToConvert = randomStream.randIntBetweenInclusive(conversion.range.min, conversion.range.max);
    var fromRad = conversion.radix.from;
    var toRad = conversion.radix.to;      
    var from = numToConvert.toString(fromRad);

    var question = {};

	question.answer = numToConvert.toString(toRad);
    if (spaceBinary)
    	question.answer = exports.formatAnswer(question.answer, fromRad, toRad);

	question.question = exports.generateQuestionText(randomStream, from, fromRad, toRad, spaceBinary);
	question.format = 'free-response';
    question.title = exports.title;
	return question;
};



