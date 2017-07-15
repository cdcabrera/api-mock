

    const exampleToHttpPayloadPair    = require('./example-to-http-payload-pair');
    const winston                     = require('winston');


    module.exports = walker;


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

                        path = resource.uriTemplate.split('{?')[0].replace(new RegExp('}', 'g'), '').replace(new RegExp('{', 'g'), ':');


                        action.examples.map(function(subsubsubvalue, subsubsubindex) {

                            let payload = exampleToHttpPayloadPair(subsubsubvalue, action.headers);


                            payload.warnings.map(function(warningVal, warningIndex) {

                                winston.warn(`[${path}] ${warningVal}`);
                            });


                            payload.errors.map(function(errorVal, errorIndex) {

                                winston.warn(`[${path}] ${errorVal}`);
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

            winston.info(`\t${value.method}:\t${value.path}`);
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

                    winston.warn(`[${req.url}] Preferrered response ${req.headers['prefer']} not found. Falling back to ${response.status}`);
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