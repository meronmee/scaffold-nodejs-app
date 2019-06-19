/**
 * 工具类库
 */  
var _ = require('underscore');
 
var log = require('./logger');
var fs = require('fs');
 
var Utils = {
	//取得字符串的实际长度，一个汉字两个字符
	strlen: function(str){
		var len = 0;
		for(var i=0;i<str.length;i++){
			var c = str.substr(i,1);
			var ts = encodeURI(c);
			if(ts.substring(0,2) == "%u"){
				len+=2;
			} else if(ts== "%B7"){
				len+=2;
			} else {
				len+=1;
			}
		}//eof:for
		return len;
	},//strlen
	/**
	 * 字符串工具类
	 */
	startsWith: function(str, starts){
			if (starts === '') return true;
			if (str === null || starts === null) return false;
			str = String(str);
			starts = String(starts);
			return str.length >= starts.length && str.slice(0, starts.length) === starts;
	},
	/**
	 * 字符串工具类
	 */
	endsWith: function(str, ends){
		if (ends === '') return true;
		if (str == null || ends == null) return false;
		str = String(str); ends = String(ends);
		return str.length >= ends.length && str.slice(str.length - ends.length) === ends;
	},
	trimStart: function(str, starts){
		var re = new RegExp('^' + starts + '\\.?', 'i');
		return str.replace(re, '');
	},
	trimEnd: function(str, ends){
		var re = new RegExp('\\.?' + ends + '$', 'i');
		return str.replace(re, '');
	},
	isBlankString: function(str) { return !str || /^\s*$/.test(str); },
	escapeRegExChars: function(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
	},
	/*取得字符串的实际长度（中文两个字节，英文一个字节）*/
  getByteLength: function(s){
    var len = 0;
    for(i=0;i<s.length;i++) {
        var c = s.substr(i,1);
        var ts = escape(c);
        if(ts.substring(0,2) == "%u"){
           len+=2;
        } else if(ts== "%B7"){
           len+=2;
        } else  {
           len+=1;
        }
   	}//eof:for
   	return len;
  },//eof:function getByteLength

	/**
	 * 校验器
	 */
	validators: {
		//只能输入数字、字母、下划线
		"alphanumeric": function(value) {
			return /^\w+$/i.test(value);
		},

		//只能输入字母或常见字符
		"letterswithbasicpunc": function(value) {
			return /^[a-z-.,()'\"\s]+$/i.test(value);
		}, 
		//只能输入字母或可见字符
		"lettersandpunc": function(value) {
			return /^[a-z-.,()'\"\s]+$/i.test(value);
		},
		//只能输入字母
		"lettersonly": function(value) {
			return /^[a-z]+$/i.test(value);
		},

		//不能输入空白符号
		"nowhitespace": function(value) {
			return /^\S+$/i.test(value);
		},
		//只能输入正负整数
		"integer": function(value) {
			return /^[-+]?\d+$/.test(value);
		},

		//24小时的时间格式
		"time": function(value) {
			return /^([01]\d|2[0-3])(:[0-5]\d){0,2}$/.test(value);
		},
		//中文标准如期格式yyyy-MM-dd
		"stdDate": function(value) {
			var pattern;
			var regexp = /^(\d{4})-(\d{2})-(\d{2})$/;
			if(regexp.test(value)) {
				pattern = regexp.exec(value);
				var date =  new Date(pattern[1],(pattern[2]-1),pattern[3]);			
				return (typeof(date) == "object") && (date instanceof Date) && (pattern[1] == date.getFullYear()) && (pattern[2] == (date.getMonth()+1)) && (pattern[3] == date.getDate());
			}
			return false;
		},

		//排除
		"except": function(value, params) {
		    if(!_.isArray(params)){
		        params = [params];
		    }  
			return (_.find(params, function(p){ return p === value; }) === undefined);
		},
		//Return true if the field value matches the given format RegExp
		"match": function(value, param) {
		    return param.test(value);
		},
		//不能超过len个字符, 1个汉字两个字符
		"maxLen": function(value, len) {
			return Utils.getByteLength(value) <= len;
		},    
		//不能少于len个字符, 1个汉字两个字符
		"minLen": function(value, len) {
		  return Utils.getByteLength(value) >= len;
		},
		//不能少于min个字符，或大于max个字符，1个汉字两个字符
		"rangeLen": function(value, min, max) {
		  var len = Utils.getByteLength(value);
			return (len >= min && len <= max);
		},
		//不能超过len个字符
		"maxLength": function(value, len) {
			return value.length <= len;
		},    
		//不能少于len个字符
		"minLength": function(value, len) {
		  return value.length >= len;
		},
		//不能少于min个字符
		"rangeLength": function(value, min, max) {
		  var len = value.length;
			return (len >= min && len <= max);
		},
		"email": function(value) {
			// contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
		},
		"notEmpty": function(value){
			return !!(value+'').trim().length;
		}
	},//validators

	/**
	 * 取得富格式的时间对象，
	 * time = {
		date	 : 	date,
		ms		 : 	date.getTime(),
		year	 : 	date.getFullYear(),
		month	: 	date.getFullYear() + '-' + (date.getMonth() + 1),
		day		:		date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
		minute : 	date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
	};
	 */
	time: function(basetime){
		var date;
		if(_.isDate(basetime)) {
			date = basetime;
		} else if(_.isNumber(basetime)) {
			date = new Date(basetime);
		} else {
			date = new Date();
		}

		var timeObj = {
			date	 : 	date,
			ms		 : 	date.getTime(),
			year	 : 	date.getFullYear(),
			month	: 	date.getFullYear() + '-' + (date.getMonth() + 1),
			day		:		date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
			minute : 	date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
		};
		return timeObj;
	},//time
	
  /**
   * 格式化时间
   * @param  {[type]} date [description]
   * @param  {[type]} fmt  [description]
   * @return {[type]}      [description]
   */
   formatDate: function(date, fmt) { 
        if(!date){
      	 date = new Date();
        }
        date = new Date(date);//可以将字符串，long型的日期转为Date
        if(!fmt){
          fmt = 'yyyy-MM-dd hh:mm:ss';
        }
        var o = {
            "M+": date.getMonth() + 1, //月份 
            "d+": date.getDate(), //日 
            "h+": date.getHours(), //小时 
            "H+": date.getHours(), //小时 
            "m+": date.getMinutes(), //分 
            "s+": date.getSeconds(), //秒 
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
            "S": date.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
   },//formatDate
    

	/**
	 * 获取请求参数的第一个值
	 * @param  {[type]} paramIn [description]
	 * @return {String}       
	 */
	getFirstParam: function(paramIn){
		if(_.isArray(paramIn)){
			return paramIn[0]||'';
		} else if(_.isObject(paramIn)){
			return (_.toArray(paramIn))[0];
		} else {
			return paramIn;
		}		
	}

/**
	   * 左补位
	   * @param  {[type]} obj     [description]
	   * @param  {[type]} len     [description]
	   * @param  {[type]} padding [description]
	   * @return {[type]}         [description]
	   */
     ,leftPad: function(obj, len, padding){
		    return this.strPad(obj, len, padding, true);		
     }
	  /**
	   * 右补位
	   * @param  {[type]} obj     [description]
	   * @param  {[type]} len     [description]
	   * @param  {[type]} padding [description]
	   * @return {[type]}         [description]
	   */
		,rightPad: function(obj, len, padding){
			return this.strPad(obj, len, padding, false);		
		}
	  /**
	   * 补位
	   * @param  {[type]} obj     [description]
	   * @param  {[type]} len     [description]
	   * @param  {[type]} padding [description]
	   * @param  {[type]} left    [description]
	   * @return {[type]}         [description]
	   */
		,strPad: function(obj, len, padding, left){
			var str = obj==null||obj==undefined? "" : obj+"";
			
			var diff = len - str.length;
			if(diff <= 0){
				return str;
			}
			
			var sb = '';
			for(var i=0; i<diff; i++){
				sb += padding;
			}
			
			if(left){
				return sb+''+str;
			} else {
				return str+''+sb;
			}		
		},
		deleteDir: function(path) {
			var that = this;
			var files = [];
			if( fs.existsSync(path) ) {
				files = fs.readdirSync(path);
				files.forEach(function(file,index){
					var curPath = path + "/" + file;
					if(fs.statSync(curPath).isDirectory()) { // recurse
						that.deleteDir(curPath);
					} else { // delete file
						fs.unlinkSync(curPath);
					}
				});
				fs.rmdirSync(path);
			}
		},
	noop: function(){
	}
};

module.exports = Utils;