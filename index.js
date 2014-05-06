    define([
        'intern/dojo/Deferred',
        'intern/dojo/promise/when',
        'intern/dojo/topic',
        'intern/dojo/node!browsermob-proxy'
    ], function (Deferred, when, topic, browsermob) {

        function setupBrowsermob() {
            topic.subscribe('/suite/new', function(s) {
                var dfd = new Deferred();
                var setup = s.parent.setup.bind(s.parent);
                s.parent.setup = function foo() {
                    s.parent.remote.proxy = new browsermob.Proxy({ host: 'localhost', port: 8080, selHost: 'localhost', selPort: 9000 });

                    s.parent.remote.proxy.start(function(err, data) {
                        var proxyUrl = 'localhost' + ':' +  data.port;
                        console.log("proxy started on" + proxyUrl);

                        // REALLY NEED TO FAIL ON ERROR HERE!!!!!
                        s.parent.remote._desiredEnvironment.proxy = { httpProxy: proxyUrl, proxyType: 'MANUAL' };
                        s.parent.remote.proxyPort = data.port;

                        s.parent.remote.proxy.startHAR(s.parent.remote.proxyPort, "yello", function() {
                            console.log("har started");
                            setup().then(dfd.resolve);
                        });
                    });

                    return dfd.promise;
                };
            });
        }

        function addGetHAR(remote) {
            remote.__proto__.getHAR = function() {
                var remote = this;

                this._lastPromise = when(this._lastPromise).then(function () {
                    var dfd = new Deferred();

                    remote.proxy.getHAR(remote.proxyPort, function(err, harData) {
                        var har = JSON.parse(harData);
                        dfd.resolve(har);
                    });

                    return dfd.promise;
                });
                return this;
            }
        }

        return {
            setupBrowsermob: setupBrowsermob,
            addGetHAR: addGetHAR
        };
    });
