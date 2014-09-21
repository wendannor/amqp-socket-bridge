/**
 * Created by jordan on 7/15/14.
 */

var express = require('express');
var cors = require("cors");
var config = require('config');
var logger = require('./Logger');
var bodyParser = require('body-parser');

var app = express();

exports.createAppServer = function () {
    app.use(cors());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    return app;
}
