
    const https   = require('https');
    const fs      = require('fs');
    const winston = require('winston');


    module.exports = sslSupport;


    function sslSupport(app, options, logging) {

        let serverOptions = {

            key: fs.readFileSync(options.key),
            cert: fs.readFileSync(options.cert)
        };

        https.createServer(serverOptions, app).listen(options.port, options.host);

        if(logging) {

            winston.info(`\tListening on ${options.host}:${options.port} (HTTPS)`);
        }
    }


