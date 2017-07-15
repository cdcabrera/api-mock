
    const fs          = require('fs');
    const drafter     = require('drafter');
    const express     = require('express');
    const walker      = require('./lib/walker');
    const sslSupport  = require('./lib/ssl-support');
    const corsSupport = require('./lib/cors-support');


    module.exports = apiMock;


    //apiMock({
    //    blueprintPath: './samples/test.apib'
    //});

    /**
     *
     * @param settings
     */
    function apiMock(settings) {

        settings = Object.assign({

            blueprintPath: null,
            options: {
                port: 3000,
                'ssl-enable': null,
                'ssl-port': null,
                'ssl-cert': null,
                'ssl-key': null,
                'cors-disable': null
            }

        }, settings);


        let data = '';


        try {

            data = fs.readFileSync(settings.blueprintPath, 'utf8');

        } catch(e){

            throw e;
        }


        drafter.parse(data, {type: "ast"}, function(error, result) {

            if (error !== null) {

                throw error;
            }


            let app = express();


            if (settings.options['ssl-enable']) {

                sslSupport(app, {

                    port: settings.options['ssl-port'],
                    host: settings.options['ssl-host'],
                    cert: settings.options['ssl-cert'],
                    key: settings.options['ssl-key']
                 });
            }


            if (!settings.options['cors-disable']) {

                corsSupport(app);
            }


            try {

                walker(app, result.ast['resourceGroups']);

            } catch (e) {

                throw error;
            }


            try {

                return app.listen(settings.options.port);

            } catch (e) {}
        });
    }