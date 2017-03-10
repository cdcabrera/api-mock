
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


        return result;
    }