
    var winston = require('winston');


    module.exports = corsSupport;


    function corsSupport(app) {


        var options = {

            origin: '*',
            methods: 'GET, PUT, POST, PATCH, DELETE, TRACE, OPTIONS',
            headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Referer, Prefer'
        };


        app.all('*', function(req, res, next) {

            if (req.get('Origin')) {

                res.set('Access-Control-Allow-Origin', options.origin);
                res.set('Access-Control-Allow-Methods', options.methods);
                res.set('Access-Control-Allow-Headers', options.headers);

                if ('OPTIONS' == req.method) {

                    return res.send(200);

                }
            }

            return next();
        });


        winston.info('Enabled Cross-Origin-Resource-Sharing (CORS)');
        winston.info('\tAllow-Origin: {0}'.replace('{0}',options.origin));
        winston.info('\tAllow-Methods: {0}'.replace('{0}',options.methods));
        winston.info('\tAllow-Headers: {0}'.replace('{0}',options.headers));
    }



