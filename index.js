
    const fs          = require('fs');
    const drafter     = require('drafter');
    const express     = require('express');
    const walker      = require('./lib/walker');
    const sslSupport  = require('./lib/ssl-support');
    const corsSupport = require('./lib/cors-support');


    module.exports = apiMock;


    /**
     *
     * @param settings
     */
    function apiMock(settings={blueprintPath:null, options:null}) {

        settings.options = Object.assign({
            port: 3000,
            'ssl-enable': null,
            'ssl-port': null,
            'ssl-cert': null,
            'ssl-key': null,
            'cors-disable': null,
            logging: true
        }, settings.options);


        let data = '';


        try {

            data = fs.readFileSync(settings.blueprintPath, 'utf8');

        } catch(e){

            throw e;
        }


        drafter.parse(data, {type: 'ast'}, function(error, result) {

            if (error !== null) {

                throw error;
            }


            let app = express();


            if (settings.options['ssl-enable']) {

                sslSupport(app, {

                    port: settings.options['ssl-port'],
                    host: settings.options['ssl-host'],
                    cert: settings.options['ssl-cert'],
                    key : settings.options['ssl-key']
                 }, settings.options.logging);
            }


            if (!settings.options['cors-disable']) {

                corsSupport(app, settings.options.logging);
            }


            try {

                walker(app, result.ast['resourceGroups'], settings.options.logging);

            } catch (e) {

                throw e;
            }


            try {

                return app.listen(settings.options.port);

            } catch (e) {

                throw e;
            }
        });
    }