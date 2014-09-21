var underscore = require('underscore');
var http = require('http');
var CONFIG = require('config');
var logger = require('./lib/Logger');
var app = require('./lib/Server').createAppServer();
var Bridge = require('./lib/Bridge.js');

server = http.createServer(app);
server.on('error',function(err){
    logger.error('An error has occurred', err);
    throw new Error(err);
});

var bridge = new Bridge();

bridge.run(server);

server.listen(CONFIG.Express.server.port);
var env = process.env.NODE_ENV;
if (!env) {
    env = 'default';
}
logger.debug('Server running ' + env + ' environment');
logger.debug('listening on port ' + CONFIG.Express.server.port);
