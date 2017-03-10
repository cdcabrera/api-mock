
    module.exports = exampleToHttpPayloadPair;
    

    function exampleToHttpPayloadPair(example, inheritingHeaders) {

        var request     = {},
            responses   = {};

        var result = {
            warnings:   [],
            errors:     [],
            pair:       {}
        };

        inheritingHeaders = inheritingHeaders || {};


        if (example.requests.length > 1) {

            result.warnings.push('Multiple requests, using first.');
        }


        if (example.responses.length === 0) {

            result.warnings.push('No response available. Can\'t create HTTP transaction.');

        } else {

            var selectedRequest = {

                body: '',
                headers: {}
            };

            if (example['requests'].length > 1) {

                selectedRequest = example['requests'][0];
            }


            request.body = selectedRequest.body;
            request.headers = Object.assign(selectedRequest.headers, inheritingHeaders);
            //request['headers'] = inheritHeaders(selectedRequest['headers'], inheritingHeaders);


            example.responses.map(function(value, index) {

                responses[value.name] = {

                    body: value.body,
                    headers: Object.assign(value.headers, inheritingHeaders),
                    status: value.name
                };

                if (value.schema && value.schema !== '') {

                    responses[value.name].schema = value.schema;
                }
            });

            result.pair['request'] = request;
            result.pair['responses'] = responses;
        }

        //console.log('EXAMPLETOHTTPPAYLOADPAIR', JSON.stringify(result));

        return result;
    }

/*var exampleToHttpPayloadPair, inheritHeaders;

inheritHeaders = require('./inherit-headers');

exampleToHttpPayloadPair = function(example, inheritingHeaders) {
    var i, len, ref, request, response, responses, result, selectedRequest, selectedResponse, text;
    if (inheritingHeaders == null) {
        inheritingHeaders = {};
    }
    result = {
        warnings: [],
        errors: [],
        pair: {}
    };
    request = {};
    responses = {};
    if (example['requests'].length > 1) {
        text = "Multiple requests, using first.";
        result['warnings'].push(text);
    }
    if (example['responses'].length === 0) {
        text = "No response available. Can't create HTTP transaction.";
        result['warnings'].push(text);
    } else {
        selectedRequest = example['requests'][0];
        if (example['requests'].length === 0) {
            selectedRequest = {
                body: "",
                headers: {}
            };
        }
        request['body'] = selectedRequest['body'];
        request['headers'] = inheritHeaders(selectedRequest['headers'], inheritingHeaders);
        ref = example['responses'];
        for (i = 0, len = ref.length; i < len; i++) {
            selectedResponse = ref[i];
            response = {};
            response['body'] = selectedResponse['body'];
            response['headers'] = inheritHeaders(selectedResponse['headers'], inheritingHeaders);
            response['status'] = selectedResponse['name'];
            if (selectedResponse['schema'] !== "") {
                response['schema'] = selectedResponse['schema'];
            }
            responses[response['status']] = response;
        }
        result['pair']['request'] = request;
        result['pair']['responses'] = responses;
    }
    return result;
};

module.exports = exampleToHttpPayloadPair;*/
