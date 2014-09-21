/**
 * Created by jordan on 7/15/14.
 */

var CONFIG = require('config');
var winston = require('winston');

var loggerTransports = [];
if (process.env.NODE_ENV != 'production') {
    loggerTransports.push(new (winston.transports.Console)({
        level: CONFIG.Logger.level,
        colorize: true,
        prettyPrint: true
    }));
}
loggerTransports.push(new (winston.transports.File)({
    filename: 'server.log',
    colorize: true,
    prettyPrint: true,
    level: CONFIG.Logger.level
}));

var logger = new (winston.Logger)({
    transports: loggerTransports
});

module.exports = logger;
