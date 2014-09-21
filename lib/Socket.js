/**
 * Created by jordan on 7/15/14.
 */

var socketio = require('socket.io');
var logger = require('./Logger');

exports.listen = function (server) {
    var io = socketio.listen(server);

    io.on('connection', function (socket) {
        logger.log('debug', 'New client connected');
        socket.on('disconnect', function () {
            logger.log('debug', 'Client disconnected');
        });
    });

    return io;
};
