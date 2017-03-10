
    var https   = require('https'),
        fs      = require('fs'),
        winston = require('winston');


    module.exports = sslSupport;


    function sslSupport(app, options) {

        var serverOptions;

        serverOptions = {

            key: fs.readFileSync(options.key),
            cert: fs.readFileSync(options.cert)
        };

        https.createServer(serverOptions, app).listen(options.port, options.host);

        winston.info('Listening on {0}:{1} (HTTPS)'.replace('{0}',options.host).replace('{1}',options.port));
    }


