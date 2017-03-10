
    var fs          = require('fs'),

        protagonist = require('protagonist'),
        express     = require('express'),
        walker      = require('./lib/walker'),
        sslSupport  = require('./lib/ssl-support'),
        corsSupport = require('./lib/cors-support');


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





        var data = '';


        try {

            data = fs.readFileSync(settings.blueprintPath, 'utf8');

        } catch(e){}



        protagonist.parse(data, {type: "ast"}, function(error, result) {

            var app;

            if (error != null) {
                throw error;
            }

            app = express();

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


            ast_json = result.ast;

            //console.log(ast_json['resourceGroups']);
            //walker(app, ast_json['resourceGroups']);

            try {

                walker(app, result.ast['resourceGroups']);

            } catch (e) {

                throw error;
            }


            try {

                return app.listen(settings.options.port);

            } catch (e) {}
        });


        //console.log(data);
    }


/*
    var ApiMock, CorsSupport, SslSupport, express, fs, protagonist, walker;

    fs = require('fs');

    protagonist = require('protagonist');

    express = require('express');

    walker = require('./walker');

    SslSupport = require('./ssl-support');

    CorsSupport = require('./cors-support');

    ApiMock = (function() {
        function ApiMock(config) {
            var corsSupport, sslSupport;
            if (config['protagonist']) {
                protagonist = config['protagonist'];
            }
            if (config['express']) {
                express = config['express'];
            }
            if (config['blueprintPath']) {
                this.blueprintPath = config['blueprintPath'];
            }
            if (this.blueprintPath == null) {
                throw new Error("No blueprint path provided.");
            }
            this.configuration = config;
            this.app = express();
            if (this.configuration.options['ssl-enable']) {
                sslSupport = new SslSupport(this.app, {
                    port: this.configuration.options['ssl-port'],
                    host: this.configuration.options['ssl-host'],
                    cert: this.configuration.options['ssl-cert'],
                    key: this.configuration.options['ssl-key']
                });
            }
            if (!this.configuration.options['cors-disable']) {
                corsSupport = new CorsSupport(this.app);
            }
        }

        ApiMock.prototype.run = function() {
            var app, ast_json, data, e;
            app = this.app;
            try {
                data = fs.readFileSync(this.blueprintPath, 'utf8');
            } catch (_error) {
                e = _error;
                throw e;
            }
            ast_json = "";
            return protagonist.parse(data, {
                type: "ast"
            }, (function(_this) {
                return function(error, result) {
                    var ref, ref1;
                    if (error != null) {
                        throw error;
                    }
                    ast_json = result.ast;
                    try {
                        walker(app, ast_json['resourceGroups']);
                    } catch (_error) {
                        error = _error;
                        throw error;
                    }
                    try {
                        return app.listen(((ref = _this.configuration) != null ? (ref1 = ref.options) != null ? ref1.port : void 0 : void 0) != null ? _this.configuration.options.port : 3000);
                    } catch (_error) {
                        error = _error;
                    }
                };
            })(this));
        };

        return ApiMock;

    })();

    module.exports = ApiMock;*/
