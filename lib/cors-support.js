
    const winston = require('winston');


    module.exports = corsSupport;


    function corsSupport(app) {


        let options = {

            origin: '*',
            methods: 'GET, PUT, POST, PATCH, DELETE, TRACE, OPTIONS',
            headers: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Referer, Prefer'
        };


        app.all('*', function(req, res, next) {

            if (req.get('Origin')) {

                res.set('Access-Control-Allow-Origin', options.origin);
                res.set('Access-Control-Allow-Methods', options.methods);
                res.set('Access-Control-Allow-Headers', options.headers);

                if ('OPTIONS' === req.method) {

                    return res.send(200);

                }
            }

            return next();
        });


        winston.info('Enabled Cross-Origin-Resource-Sharing (CORS)');
        winston.info(`\tAllow-Origin: ${options.origin}`);
        winston.info(`\tAllow-Methods: ${options.methods}`);
        winston.info(`\tAllow-Headers: ${options.headers}`);
    }



