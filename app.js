/*=========Module dependencies=========*/
var fs = require('fs');
var util = require('util');
var path = require('path');
 
var _  = require('underscore');  
var s = require("underscore.string");
_.mixin(s.exports());

var log = require('./commons/logger');

var env = process.env.NODE_ENV || 'dev';
var config = require('./config/config');  
var Utils = require('./commons/utils');


/*=========Main Begin=========*/

 
log.info("xxx="+config.xxx);




/*=========Main end=========*/
var app = {};
// exports app
exports = module.exports = app;
