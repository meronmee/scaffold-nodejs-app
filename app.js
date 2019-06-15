/*=========Module dependencies=========*/
var fs = require('fs');
var util = require('util');
var path = require('path');
 
var _  = require('underscore');  
var log = require('./commons/logger');

var env = process.env.NODE_ENV || 'dev';
var config = require('./config/config');  
var Utils = require('./commons/utils');

/*
__dirname:脚本所在目录
*/
/*=========Main Begin=========*/
log.info('begin...');
 

log.info("config.xxx="+config.xxx);

/*=========Main end=========*/
var app = {};
// exports app
exports = module.exports = app;
