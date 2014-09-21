/**
 * Created by jordan on 9/21/14.
 */
function Transformer() {

    this.default = function (message) {
        return message;
    }

    this.addTimeStamp = function (message) {

        var timestamp = new Date().getTime();
        return  {
            timestamp: timestamp,
            message: message
        };

    }

}

module.exports = Transformer;