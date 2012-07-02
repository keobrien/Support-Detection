/*
Project Name: Support Detection
URL: https://github.com/keobrien/Support-Detection
Author: Kevin O'Brien
Company: Clockwork Acive Media Systems
Company Site: clockwork.net
License: MIT
Copyright (C) 2012 Clockwork Active Media Systems
Version: .1
**************************************/

(function($) {

	$.fn.supportdetection = function(s) {
		return new $.supportdetection($(this), s);
	};

	$.supportdetection = function(el, s) {

		// Settings
		this.el = el;
		this.s = $.extend({
			// Ref: http://www.useragentstring.com/pages/useragentstring.php
			// Cookies
			cookies:	true,
			mookie_msg:	'<p id="support-cookies">Please enable cookies to view this site. <a href="http://support.google.com/accounts/bin/answer.py?hl=en&answer=61416" target="_blank">How to enable Cookies</a>.</p>',
			// Browsers
			safari:		531,		// v5.0
			chrome:		535,		// v19
			msie:		7,
			mozilla:	12,
			opera:		false,		// no support
			browser_msg: '<p id="support-browser">Your browser may not support this site. Pages might not look or function quite right until you update your browser or download the latest version of <a href="http://www.google.com/chrome">Google Chrome</a> or <a href="http://www.mozilla.org/en-US/firefox/new/">Firefox</a>.</p>',
			test_browser: false,
			// Devices
			ipad:		534,		// v2:534, v1:533
			ipod:		6533,		// v4.3
			iphone:		6533,		// v4.3
			android:	533,		// 2.2
			blackberry:	false,		// no support
			windows_phone:	false,	// no support
			test_device:	false,
			// OS Version
			ipad_os:		4.3,
			ipod_os:		4.3,
			iphone_os:		4.3,
			android_os:		2.3,
			blackberry_os:	false,	// no support
			windows_phone_os: false,// no support
			device_msg:		'<p id="support-device">Your device may not support this site. Pages might not look or function quite right. If you are using Android or iOS (iPhone, iPad or iPods) please try updating your operating system</p>',
			test_mobile_os: false
		}, s);
		this.uagent = navigator.userAgent.toLowerCase();
		this.mobile = false;
		this.found = {};
		
		this.not_supported = [];
		
		this.test_cookies();
		this.test_devices();
		if(this.mobile) {
			this.get_os_version();
			if(this.s.test_mobile_os) this.test_os_version();
		}else {
			if(this.test_browser) this.test_browsers();
		}

		return this;
	};

	$.supportdetection.prototype = {
		test_cookies: function(){
			var cookieEnabled=(navigator.cookieEnabled)? true : false;
			
			if( typeof navigator.cookieEnabled == "undefined" && !cookieEnabled ){
				document.cookie = "testcookie";
				cookieEnabled = (document.cookie.indexOf("testcookie")!=-1) ? true : false;
			}
			
			if( !cookieEnabled && this.s.cookies ) {
				this.el
					.append(this.s.mookie_msg)
					.show();
				this.not_supported.push('cookies');
			}
		}
		
		, get_os_version: function() {
			
			// Blackberry
			if(this.found.device == 'blackberry') {
				if (this.uagent.indexOf("version/") >= 0) {
					var ver_position = this.uagent.indexOf("version/") + 8;
					this.found.os = parseInt(this.uagent.substring(ver_position, ver_position + 3));
				}else {
					this.found.os = parseInt(this.uagent.split("/")[1].substring(0, 3));
				}
			}
			
			// Android
			else if(this.found.device == 'android') {
				this.found.os = parseInt(this.uagent.toString().split(';')[2].replace(/android/g, '').replace(/ /g,''));
			}
			
			// iPad, iPod, iPhone
			else if((this.found.device == 'ipad') || (this.found.device == 'ipod') || (this.found.device == 'iphone')) {
				this.found.os = parseInt(this.uagent.toString().split(')')[0].split('os ')[1].split(' ')[0].replace('_','.'));
			}
			
			// Windows Phone
			else if(this.found.device == 'windows_phone') {
				this.found.os = parseInt(this.uagent.toString().split(';')[2].split('os ')[1]);
			}
			
			this.found.os_supported = this.s[this.found.device+'_os'];
		}
		
		, test_os_version: function() {
		
			if(this.s[this.found.device+'_os'] && (this.found.os < this.found.os_supported)) this.devive_not_supported(this.found.device.toString()+'_os');
			
		}
		
		, test_devices: function() {
		
			// iphone must be tested after ipad and ipod
			var devices = ['ipad', 'ipod', 'iphone', 'android', 'blackberry', 'windows phone'];
			for(var i = 0; i < devices.length; i++) {
				if(this.uagent.indexOf(devices[i]) > -1) {
					this.test_device_version(devices[i].replace(' ','_'));
					break;
				}
			}
			if(this.uagent.indexOf('iemobile') > -1) this.test_device_version('windows_phone');
		}
		
		, test_device_version: function(device) {
			this.mobile = true;
			this.found.device = device;
			this.found.browser_version = $.browser.version;
			this.found.supported_browser_version = this.s[device];
			
			if(this.s.test_mobile_os || !this.test_device) return;
			if(!this.s[device] || ($.browser.version < this.s[device])) this.devive_not_supported(device);
		}
		
		, test_browsers: function() {
			var is_chrome = this.uagent.indexOf('chrome') > -1;
			var is_safari = this.uagent.indexOf("safari") > -1;
			if ((is_chrome)&&(is_safari)) is_safari=false;
		
			if($.browser.msie) this.test_browser_version('msie');
			else if($.browser.mozilla) this.test_browser_version('mozilla');
			else if($.browser.opera) this.test_browser_version('opera');
			else if(!is_safari && $.browser.webkit) this.test_browser_version('chrome');
			else if(is_safari) this.test_browser_version('safari');
			else { this.browser_not_supported('unknown') }
		}
		
		, test_browser_version: function(browser) {
		
			this.found.browser = browser
			this.found.browser_version = $.browser.version;
			this.found.supported_browser_version = this.s[browser];

			if(this.s[browser] && ($.browser.version < this.s[browser])) this.browser_not_supported(browser);
			
		}
		
		, browser_not_supported: function(fail) {
			this.el
				.append(this.s.browser_msg)
				.show();
				
			this.not_supported.push(fail);
		}
		
		, devive_not_supported: function(fail) {
			this.el
				.append(this.s.device_msg)
				.show();
				
			this.not_supported.push(fail);
		}
	}
	
})(jQuery);