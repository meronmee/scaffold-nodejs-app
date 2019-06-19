var log4js = require('log4js');
var _ = require('underscore');

log4js.configure(__dirname + '/log4js.json', {reloadSecs: 300});//The configuration file is checked for changes every 5 mins, and if changed, reloaded

var logger;
var env = process.env.NODE_ENV || 'dev';

if('prod' === env){
	logger = log4js.getLogger('prod');
} else {
	logger = log4js.getLogger('dev');
}

module.exports = logger;