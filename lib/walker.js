
    //var inheritHeaders = require('./inherit-headers');

    var exampleToHttpPayloadPair    = require('./example-to-http-payload-pair'),
        winston                     = require('winston');


    module.exports = walker;


    function walker(app, resourceGroups) {

        //var group, ref, resource, ref1, action, path, ref2;

        var responses   = [],
            results     = [];

        resourceGroups.map(function(value, index) {

            var group = value;

            group.resources.map(function(subvalue, subindex) {

                var resource = subvalue;

                resource.actions.map(function(subsubvalue, subsubindex) {

                    var action = subsubvalue,
                        path;

                    //action['headers'] = inheritHeaders(action['headers'], resource['headers']);
                    //action['parameters'] = inheritParameters(action['parameters'], resource['parameters']);

                    action.headers = action.headers || {};
                    action.parameters = action.parameters || {};

                    Object.assign(action.headers, resource.headers||{});
                    Object.assign(action.parameters, resource.parameters||{});


                    //console.log('ACTION',action);
                    //console.log('RESOURCE',resource);

                    if (resource.uriTemplate !== null) {

                        path = resource.uriTemplate.split('{?')[0].replace(new RegExp("}", "g"), "").replace(new RegExp("{", "g"), ":");
                        //ref2 = action.examples || [];

                        //console.log('PATH', path);
                        //console.log('REF2', ref2);


                        action.examples.map(function(subsubsubvalue, subsubsubindex) {

                            var example = subsubsubvalue,
                                payload = exampleToHttpPayloadPair(example, action.headers);


                            payload.warnings.map(function(warningVal, warningIndex) {

                                winston.warn('[{0}] {1}'.replace('{0}', path).replace('{1}', warningVal));
                            });


                            payload.errors.map(function(errorVal, errorIndex) {

                                winston.warn('[{0}] {1}'.replace('{0}', path).replace('{1}', errorVal));
                            });

                            responses.push({
                                method: action.method,
                                path: path,
                                responses: payload['pair']['responses']
                            });

                        });
                    }
                });
            });
        });


        responses.map(function(value, index) {

            switch (value.method)
            {
                case 'GET':
                    results.push(app.get(value.path, sendResponse(value.responses)));
                    break;
                case 'POST':
                    results.push(app.post(value.path, sendResponse(value.responses)));
                    break;
                case 'PUT':
                    results.push(app.put(value.path, sendResponse(value.responses)));
                    break;
                case 'DELETE':
                    results.push(app['delete'](value.path, sendResponse(value.responses)));
                    break;
                case 'PATCH':
                    results.push(app.patch(value.path, sendResponse(value.responses)));
                    break;
                default:
                    results.push(void 0);
                    break;
            }

            winston.info('\t{0}:\t{1}'.replace('{0}', value.method).replace('{1}', value.path));
        });


        function sendResponse(responses) {

            return function(req, res) {

                var header, headerName, headerValue, ref, response, value;

                response = responses[Object.keys(responses)[0]];

                if ('prefer' in req.headers) {

                    if (req.headers['prefer'] in responses) {

                        response = responses[req.headers['prefer']];

                    } else {

                        winston.warn("[" + req.url + "] Preferrered response " + req.headers['prefer'] + " not found. Falling back to " + response.status);
                    }
                }

                ref = response.headers;

                for (header in ref) {

                    value = ref[header];
                    headerName = value['name'];
                    headerValue = value['value'];
                    res.setHeader(headerName, headerValue);
                }

                res.setHeader('Content-Length', Buffer.byteLength(response.body));

                //return res.send(response.status, response.body);
                return res.status(response.status).send(response.body);
            };
        }
        

        //console.log('RESPONSES', results);

        return results;


        /*
        for (i = 0, len = resourceGroups.length; i < len; i++) {

            group = resourceGroups[i];
            ref = group['resources'];

            for (j = 0, len1 = ref.length; j < len1; j++) {
                resource = ref[j];
                ref1 = resource['actions'];

                for (k = 0, len2 = ref1.length; k < len2; k++) {
                    action = ref1[k];
                    action['headers'] = inheritHeaders(action['headers'], resource['headers']);
                    action['parameters'] = inheritParameters(action['parameters'], resource['parameters']);
                    if (resource['uriTemplate'] != null) {
                        path = resource['uriTemplate'].split('{?')[0].replace(new RegExp("}", "g"), "").replace(new RegExp("{", "g"), ":");
                        ref2 = action['examples'];
                        for (l = 0, len3 = ref2.length; l < len3; l++) {
                            example = ref2[l];
                            payload = exampleToHttpPayloadPair(example, action['headers']);
                            ref3 = payload['warnings'];
                            for (m = 0, len4 = ref3.length; m < len4; m++) {
                                warning = ref3[m];
                                winston.warn("[" + path + "] " + warning);
                            }
                            ref4 = payload['errors'];
                            for (n = 0, len5 = ref4.length; n < len5; n++) {
                                error = ref4[n];
                                winston.error("[" + path + "] " + error);
                            }
                            responses.push({
                                method: action.method,
                                path: path,
                                responses: payload['pair']['responses']
                            });
                        }
                    }
                }
            }
        }*/
    }

/*
var exampleToHttpPayloadPair, expandUriTemplateWithParameters, inheritHeaders, inheritParameters, ut, walker, winston;

inheritHeaders = require('./inherit-headers');

inheritParameters = require('./inherit-parameters');

expandUriTemplateWithParameters = require('./expand-uri-template-with-parameters');

exampleToHttpPayloadPair = require('./example-to-http-payload-pair');

ut = require('uri-template');

winston = require('winston');

walker = function(app, resourceGroups) {
    var action, error, example, group, i, j, k, l, len, len1, len2, len3, len4, len5, len6, m, n, o, path, payload, ref, ref1, ref2, ref3, ref4, resource, response, responses, results, sendResponse, warning;
    sendResponse = function(responses) {
        return function(req, res) {
            var header, headerName, headerValue, ref, response, value;
            response = responses[Object.keys(responses)[0]];
            if ('prefer' in req.headers) {
                if (req.headers['prefer'] in responses) {
                    response = responses[req.headers['prefer']];
                } else {
                    winston.warn("[" + req.url + "] Preferrered response " + req.headers['prefer'] + " not found. Falling back to " + response.status);
                }
            }
            ref = response.headers;
            for (header in ref) {
                value = ref[header];
                headerName = value['name'];
                headerValue = value['value'];
                res.setHeader(headerName, headerValue);
            }
            res.setHeader('Content-Length', Buffer.byteLength(response.body));
            return res.send(response.status, response.body);
        };
    };
    responses = [];
    for (i = 0, len = resourceGroups.length; i < len; i++) {
        group = resourceGroups[i];
        ref = group['resources'];
        for (j = 0, len1 = ref.length; j < len1; j++) {
            resource = ref[j];
            ref1 = resource['actions'];
            for (k = 0, len2 = ref1.length; k < len2; k++) {
                action = ref1[k];
                action['headers'] = inheritHeaders(action['headers'], resource['headers']);
                action['parameters'] = inheritParameters(action['parameters'], resource['parameters']);
                if (resource['uriTemplate'] != null) {
                    path = resource['uriTemplate'].split('{?')[0].replace(new RegExp("}", "g"), "").replace(new RegExp("{", "g"), ":");
                    ref2 = action['examples'];
                    for (l = 0, len3 = ref2.length; l < len3; l++) {
                        example = ref2[l];
                        payload = exampleToHttpPayloadPair(example, action['headers']);
                        ref3 = payload['warnings'];
                        for (m = 0, len4 = ref3.length; m < len4; m++) {
                            warning = ref3[m];
                            winston.warn("[" + path + "] " + warning);
                        }
                        ref4 = payload['errors'];
                        for (n = 0, len5 = ref4.length; n < len5; n++) {
                            error = ref4[n];
                            winston.error("[" + path + "] " + error);
                        }
                        responses.push({
                            method: action.method,
                            path: path,
                            responses: payload['pair']['responses']
                        });
                    }
                }
            }
        }
    }
    responses.sort(function(a, b) {
        if (a.path > b.path) {
            return -1;
        }
        if (a.path < b.path) {
            return 1;
        }
        return 0;
    });
    results = [];
    for (o = 0, len6 = responses.length; o < len6; o++) {
        response = responses[o];
        switch (response.method) {
            case 'GET':
                results.push(app.get(response.path, sendResponse(response.responses)));
                break;
            case 'POST':
                results.push(app.post(response.path, sendResponse(response.responses)));
                break;
            case 'PUT':
                results.push(app.put(response.path, sendResponse(response.responses)));
                break;
            case 'DELETE':
                results.push(app["delete"](response.path, sendResponse(response.responses)));
                break;
            case 'PATCH':
                results.push(app.patch(response.path, sendResponse(response.responses)));
                break;
            default:
                results.push(void 0);
        }
    }
    return results;
};

module.exports = walker;
*/