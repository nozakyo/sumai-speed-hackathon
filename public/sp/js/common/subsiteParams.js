(function () {
	var dataScript = window.document.getElementById('subsite-data-script');
	var sitePath = dataScript.getAttribute('data-sitePath');
	var deviceFlg = dataScript.getAttribute('data-deviceFlg') === '1' ? true : false;
	var bku = dataScript.getAttribute('data-bku');
	var iflg = dataScript.getAttribute('data-iflg');
	var ryoikiPctFlg = dataScript.getAttribute('data-ryoikiPctFlg') === '1' ? true : false;
	var suumo_cdn_url = dataScript.getAttribute('data-suumo_cdn_url');
	var siteNmInfo = {};
	var siteKbnNmInfo = {};
	var siteKbnUrl = {};
	var siteKskbn = {};
  
	var siteInfo = JSON.parse(dataScript.getAttribute('data-siteInfo'));
  
	for (var key in siteInfo) {
	  if (siteInfo.hasOwnProperty(key)) {
		siteNmInfo[key] = siteInfo[key].name;
		siteKbnNmInfo[key] = siteInfo[key].kbn;
		siteKbnUrl[key] = siteInfo[key].url;
		siteKskbn[key] = siteInfo[key].kskbn;
	  }
	}
  
	window.siteNmInfo = siteNmInfo;
	window.siteKbnNmInfo = siteKbnNmInfo;
	window.siteKbnUrl = siteKbnUrl;
	window.siteKskbn = siteKskbn;
	window.suumo_cdn_url = suumo_cdn_url;
	window.sitePath = sitePath;
	S.deviceFlg = deviceFlg;
	window.bku = bku;
	window.iflg = iflg;
	window.ryoikiPctFlg = ryoikiPctFlg;
  }());