var log4js = require('log4js');
var _ = require('underscore');

//log4js.configure('commons/log4js.json', {reloadSecs: 300});//The configuration file is checked for changes every 5 mins, and if changed, reloaded
log4js.configure(__dirname + '/log4js.json', {reloadSecs: 300});//The configuration file is checked for changes every 5 mins, and if changed, reloaded

var logger;
var env = process.env.NODE_ENV || 'development';

if('production' === env){
	logger = log4js.getLogger('prod');
	logger.setLevel('INFO');
} else {
	logger = log4js.getLogger('dev');
	logger.setLevel('INFO');
}

module.exports = logger;