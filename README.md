Support Detection
=================

Default:
 - Detect Javascript enabled
 - Detect Cookies enabled

Settings:
 - {test_browser: true} tests safari 5+, chrome 19+, IE7+, Firefox 12
 - {test_mobile_os: true} tests iOS 4.3+, Android 2.3+
 - {test_device: true} test device build browser version.
 
Usage
-----
var supportDetection = CWjQuery('#support').supportdetection();

returns an object of what was found vs. what is supported.  #support targets the messaging area.  Optionally pass in changes to default support.
{
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
}