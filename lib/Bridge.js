/**
 * Created by jordan on 9/21/14.
 */
var amqp = require('amqp');
var socket = require('./Socket');
var CONFIG = require('config');
var logger = require('./Logger');
var Transformer = require('./Transformer');

var Bridge = function () {


    var transformer = new Transformer();

    // connection RabbitMQ
    var rabbitMqConfiguration = {
        host: CONFIG.RabbitMQ.server.host,
        port: CONFIG.RabbitMQ.server.port,
        login: CONFIG.RabbitMQ.server.login,
        password: CONFIG.RabbitMQ.server.password,
        vhost: CONFIG.RabbitMQ.server.vhost
    };

    var rabbitMq = amqp.createConnection(rabbitMqConfiguration);

    rabbitMq.on('error', function (err) {
        throw new Error('Cannot connect to RabbitMQ : ' + err);
    });


    this.run = function (server) {

        var io = socket.listen(server);

        // when 7-way-hanshake with rabbitMQ is done
        rabbitMq.on('ready', function (error, data) {

            CONFIG.bridges.forEach(function (bridge) {

                // create / connect to queue
                var queueOptions = {
                    passive: bridge.fromQueue.options.passive,
                    durable: bridge.fromQueue.options.durable
                };
                var queue = rabbitMq.queue(bridge.fromQueue.name, queueOptions, function () {

                    if (bridge.fromQueue.bindings) {
                        bridge.fromQueue.bindings.forEach(function (binding) {
                            var exchange = binding.exchange;
                            var routing = binding.routing;
                            queue.bind(exchange, routing);
                        });
                    }

                    var transformMethod = 'default';
                    if (bridge.transform.function) {
                        transformMethod = bridge.transform.function;
                    }

                    queue.subscribe(function (message, headers, deliverydebug, messageObject) {

                        var messageString = message.data.toString();
                        try {
                            var data = JSON.parse(messageString);
                            console.log('messageString', messageString);
                            data = transformer[transformMethod](data);
                            io.sockets.emit(bridge.toChannel.channel, data);

                            logger.debug('Message via transformer "' + transformMethod+ '" to channel "' + bridge.toChannel.channel + '" -> ', data);
                        } catch (e) {
                            logger.error('An error has occured while parsing message', e);
                        }

                    });
                });
            });

        });
    }
}

module.exports = Bridge;

