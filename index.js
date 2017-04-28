exports.title = "Change of Base";
var paqUtils = require("./paq-utils");

exports.paramSchema = {
    title: 'change-of-base',
    type: 'object',
    additionalProperties: false,
    properties: {
        "outputType": { "type": "string"},
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

exports.formatChoices = function(choices, fromRad, toRad, spaceBinary) {
	if (!spaceBinary) return;
	choices.forEach(function(choice, i, arr) {
		arr[i] = exports.formatAnswer(choice, fromRad, toRad);
	});
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
        "conversion" : conversion,
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
	return (params && ("outputType" in params)) ? params.outputType : exports.defaultOutputType;
};

exports.generateAnswer = function(qInputs) {
    var answer = qInputs.numToConvert.toString(qInputs.toRad);
    if (qInputs.spaceBinary)
        answer = exports.formatAnswer(answer, qInputs.fromRad, qInputs.toRad);
    return answer;
}
/////////////// supporting functions for generating distractors for MC version ///////
exports.getDistractorRadices = function(rad) {
	var distractorRadices = {
    	"8" : [10,16],
    	"10" : [8,16],
    	"16" : [8,10]
	};
	return (rad in distractorRadices) ? distractorRadices[rad] : [];
}

exports.generateFromRadDistractors = function (fromRad, toRad, numToConvert, from) {
	var result = [];
	// If fromRad is in distractor radices, try interpreting the number in a different
	// radix than the intended one.   If the number we are converting is legit in that base,
	// convert from that number, correcttly, to the toRadix and try adding that as a distractor
	var distractorRadices = exports.getDistractorRadices(fromRad);
	distractorRadices.forEach(function(thisRad) {
		// can the string "from" be legally intepreted as a number in thisRad?
		// if so, then try to distract the student with that number correctly converted to the toRad
		var wrongInterpretationOfFrom = parseInt(from,thisRad);
		if (!isNaN(wrongInterpretationOfFrom)) {
			var badAnswer = wrongInterpretationOfFrom.toString(toRad);
			result.push(badAnswer);
		}
	});
	return result;
}

exports.generateToRadDistractors = function(toRad, numToConvert) {
	var distractorRadices = exports.getDistractorRadices(toRad);
	return distractorRadices.map(function(dRad) {
		return numToConvert.toString(dRad);
	});
}

exports.addDistractorChoices = function(answerChoices, fromRad, toRad, from, numToConvert) {
	// If toRad is in distractor radices, try adding the right answer in a wrong radix to the list.
	answerChoices.addAll(exports.generateToRadDistractors(toRad, numToConvert));
	answerChoices.addAll(exports.generateFromRadDistractors(fromRad, toRad, numToConvert, from));
}

exports.addRandomChoices = function(randomStream, answerChoices, toRad, min, max) {
	while (!answerChoices.full()) {
		var distractor = randomStream.randIntBetweenInclusive(min, max);
		answerChoices.add(distractor.toString(toRad));
	}
}

///////////////

exports.generate = function(randomStream, quizElement) {
    // later add code to validate schema for params and if invalid, then set errors
    // or warnings within the question ? 
    var qInputs = exports.generateQInputs(randomStream, quizElement.params);
    var question = {
        "outputType": exports.generateOutputType(quizElement.params),
        "problemType": "paq-change-of-base",
        "questionText" : exports.generateQuestionText(qInputs),
        "answer" : exports.generateAnswer(qInputs)
    };
    if ("points" in quizElement) {
       question.points = quizElement.points; 
    }
    if ("title" in quizElement) {
       question.title = quizElement.title;
    } else {
       // the question generating module can optionally supply the title
       // If this is not done, MoodleExporter will make up a title.
       question.title = "Change of Base";
    }

    if (question.outputType == "mc") {
      var from = qInputs.numToConvert.toString(qInputs.fromRad);
      var answerAsString = qInputs.numToConvert.toString(qInputs.toRad);
      var answerChoices = new paqUtils.UniqueChoices(5);
      answerChoices.add(answerAsString);

      exports.addDistractorChoices(answerChoices, qInputs.fromRad, qInputs.toRad, 
                                   from, qInputs.numToConvert);

      exports.addRandomChoices(randomStream, answerChoices, qInputs.toRad,
			                   qInputs.conversion.range.min, qInputs.conversion.range.max);
    
      var choices = answerChoices.getChoices();
      randomStream.shuffle(choices);

      exports.formatChoices(choices, qInputs.fromRad, qInputs.toRad, qInputs.spaceBinary);
      question.distractors = choices;
      question.answerIndex =  choices.indexOf(answerAsString);
      console.log("question": JSON.stringify(question));
      console.log("choices": JSON.stringify(choices));
      console.log("answerAsString": JSON.stringify(answerAsString));
    }

	return question;
};

