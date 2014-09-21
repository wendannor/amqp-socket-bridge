/**
 * Created by jordan on 9/21/14.
 */
angular.module('bridge', [
        'jsonFormatter',
        'btford.socket-io'
    ])
    .constant('STREAMER_HOST', 'localhost')
    .constant('STREAMER_PORT', '9006')
    .factory('socket', function (socketFactory, STREAMER_HOST, STREAMER_PORT) {
        return socketFactory({
            ioSocket: io.connect('http://' + STREAMER_HOST + ':' + STREAMER_PORT)
        });
    })
    .controller('BridgeController', ['$scope', 'socket', function ($scope, socket) {
        $scope.messages = [];

        socket.on('queue1', function (message) {
            console.log('message', message);
            $scope.messages.push(message);
        });

    }])