

    const exampleToHttpPayloadPair  = require('./example-to-http-payload-pair'),
          winston                   = require('winston');


    function walker(app, resourceGroups) {


        let responses   = [],
            results     = [];


        resourceGroups.map(function(value, index) {

            let group = value;

            group.resources.map(function(subvalue, subindex) {

                let resource = subvalue;

                resource.actions.map(function(subsubvalue, subsubindex) {

                    let action = subsubvalue,
                        path;

                    action.headers = action.headers || {};
                    action.parameters = action.parameters || {};

                    Object.assign(action.headers, resource.headers||{});
                    Object.assign(action.parameters, resource.parameters||{});



                    if (resource.uriTemplate !== null) {

                        path = resource.uriTemplate.split('{?')[0].replace(new RegExp("}", "g"), "").replace(new RegExp("{", "g"), ":");


                        action.examples.map(function(subsubsubvalue, subsubsubindex) {

                            let example = subsubsubvalue,
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


        return results;
    }



    function sendResponse(responses) {

        return function(req, res) {

            let header, headerName, headerValue, ref, response, value;

            response = responses[Object.keys(responses)[0]];

            if ('prefer' in req.headers) {

                if (req.headers['prefer'] in responses) {

                    response = responses[req.headers['prefer']];

                } else {

                    winston.warn(
                        '[{0}] Preferrered response {1} not found. Falling back to {2}'
                        .replace('{0}',req.url)
                        .replace('{1}',req.headers['prefer'])
                        .replace('{2}',response.status));
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

            return res.status(response.status).send(response.body);
        };
    }


    module.exports = walker;