//stmt_sp.js  20240627

var stmt_params={};

//============ realtimelog start ==================================
	var __realtimelogFlg = false;
	if('SuumoPageData'in window && SuumoPageData && SuumoPageData.rtLog && SuumoPageData.rtLog.service_shubetsu_cd){
		if(SuumoPageData.rtLog.service_shubetsu_cd === '010' ||SuumoPageData.rtLog.service_shubetsu_cd === '011' ||SuumoPageData.rtLog.service_shubetsu_cd === '020' ||SuumoPageData.rtLog.service_shubetsu_cd === '021' ||SuumoPageData.rtLog.service_shubetsu_cd === '030' ||SuumoPageData.rtLog.service_shubetsu_cd === '040' ||SuumoPageData.rtLog.service_shubetsu_cd === '160'){
			__realtimelogFlg = true;
		}
	}
	if(__realtimelogFlg){
		(function(){
			var __realtimelogJsPath = '';
			var kenpinHost = location.host.match(/^wwwtst\.(k[0-9]?[0-9]+\.)?/);
			if(kenpinHost && kenpinHost[0]){
				__realtimelogJsPath = kenpinHost[0];
			}

			var tagjs = document.createElement('script');
			var scr = document.getElementsByTagName('script')[0];
			tagjs.async = true;
			tagjs.src = '//' + __realtimelogJsPath + 'suumo.jp/front/tag/stmt/realtimelog_sp.min.js';
			scr.parentNode.insertBefore(tagjs, scr);
		})();
	}
//============ realtimelog end ====================================

//============ custom event function start ==================================
	var tagCustomEvent = function(id){
	    var tag_event_id  = id || "";

		try
		{
			dataLayer.push({'event': tag_event_id}); //GTM
		}
		catch(e)
		{

		}
	};

//============ custom event function end ==================================

//============ GTM start ==================================
	var gtmContainerSelector = function(url)
	{
		var matchList=function(text,list)
		{
			for(var i=0;i<list.length;i++)
			{
				if(text.match(list[i]))
				{
					return true;
				}
			}
			return false;
		};

		//Config
		var gtmInfo = [];

		//for Hontai - honban
		gtmInfo.push({'id':'GTM-PZNRBVLW'
					,'matches':['^(bessou\\\.|bridal\\\.|inaka\\\.|gakunavi\\\.|library\\\.)?suumo\\\.jp/']
					,'exclusion':[]});
		//for Chintai(Gakusei) - honban
		gtmInfo.push({'id':'GTM-TRBQ7V6'
					,'matches':['^gakusei\\\.suumo\\\.jp/']
					,'exclusion':[]});
		//for Counter - honban
		gtmInfo.push({'id':'GTM-5N3H3BD'
					,'matches':['^www\\\.suumocounter\\\.jp/']
					,'exclusion':[]});
		//for JikaiJisui - honban
		gtmInfo.push({'id':'GTM-5NQ8S23G'
					,'matches':['^hikkoshi\\\.suumo\\\.jp/','^suumoreformstore\\\.jp/','^www\\\.suumo-onr\\\.jp/','^point\\\.recruit\\\.co\\\.jp/','^krs\\\.bz/rsc-gnpkfs']
					,'exclusion':[]});
		//for Reform - honban
		gtmInfo.push({'id':'GTM-KWD2SQ2'
					,'matches':['^reform\\\.suumocounter\\\.jp/','^inquiry\\\.reform\\\.suumo\\\.jp/m/(?!.*test).*(\\\d)?(/)?$']
					,'exclusion':[]});
		//for JikaiJisui - kenpin
		gtmInfo.push({'id':'GTM-P28V3K2K'
					,'matches':['^wwwtst\\\.hikkoshi\\\.suumo\\\.jp/','feature\\\d{4}\\\.qa\\\.hikkoshi\\\.suumo\\\.jp/','^stg(\\\d)?\\\.suumoreformstore\\\.jp/','suumo-onr\\\.jp/','krs\\\.bz/rsc-gnpkfs','point\\\.recruit\\\.co\\\.jp/','dev254-front\\\.apf\\\.e\\\.recruit\\\.co\\\.jp']
					,'exclusion':[]});
		//for Reform - kenpin
		gtmInfo.push({'id':'GTM-547RNXS'
					,'matches':['^wwwtst\\\.reform\\\.suumocounter\\\.jp/','^inquiry\\\.reform\\\.suumo\\\.jp/m/(?=.*test).*(\\\d)?(/)?$']
					,'exclusion':[]});
		//for Counter - kenpin
		gtmInfo.push({'id':'GTM-MQCKPRG'
					,'matches':['^wwwtst\\\.(k\\\d\\\.)?suumocounter\\\.jp/','^wwwtst\\\.(.*\\\.)?suumocounter\\\.jp/']
					,'exclusion':[]});
		//for Chintai(Gakusei) - kenpin
		gtmInfo.push({'id':'GTM-TL84DV5'
					,'matches':['^wwwtst\\\.gakusei\\\.suumo\\\.jp/']
					,'exclusion':[]});
		//for Hontai - kenpin
		gtmInfo.push({'id':'GTM-WP54XPG5'
					,'matches':['^wwwtst\\\.(.*\\\.)?suumo\\\.jp/']
					,'exclusion':[]});
		//for Other
		gtmInfoOtherId = 'GTM-PZNRBVLW';

		var id=gtmInfoOtherId;
		for(var i=0;i<gtmInfo.length;i++)
		{
			var isMatch=matchList(url,gtmInfo[i].matches);

			if(isMatch)
			{
				var isEx=matchList(url,gtmInfo[i].exclusion);
				if(!isEx)
				{
					id=gtmInfo[i].id;
					break;
				}
			}
		}

		if (id == 'GTM-WP54XPG5' || id == 'GTM-PZNRBVLW') {
			try {
				var honbanCheckFlag = false;
				if (id == 'GTM-PZNRBVLW') {
					honbanCheckFlag = true;
				}

				var rf_reg = '/oyaku/(remodel|oyaku_category/remodel)/';

				if(new RegExp(rf_reg, 'i').test(location.pathname)){
					return getRFContainerIdFromLocationPathname(id, honbanCheckFlag);
				}

				if(typeof s.prop14 !== 'undefined' && s.prop14 != ''){
					return getContainerIdFromProp14(id, honbanCheckFlag, s.prop14);
				}

				if(location.pathname.indexOf('/JJ010FG420/') > 0){
					return getKRContainerIdFromLocationPathname(id, honbanCheckFlag);
				}

				if(location.pathname.indexOf('/JJ010FG310/') > 0 || location.pathname.indexOf('/JJ010FG320/') > 0 || location.pathname.indexOf('/JJ010FG330/') > 0){
					return getMSContainerIdFromLocationPathname(id, honbanCheckFlag);
				}

				if(location.pathname.indexOf('/FR301FG101/') > 0 || location.pathname.indexOf('/FR301FG102/') > 0 || location.pathname.indexOf('/FR301FG103/') > 0){
					return getFRContainerIdFromLocationPathname(id, honbanCheckFlag);
				}

				if(location.pathname.indexOf('/house/') == 0){
					return getCHContainerIdFromLocationPathname(id, honbanCheckFlag);
				}

				if(typeof gapSuumoSpForKr != 'undefined' && gapSuumoSpForKr.length == 1){
					if(typeof gapSuumoSpForKr[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id ,honbanCheckFlag, gapSuumoSpForKr[0].ryoikiShuCd);
					}
				}

				if(typeof gapSuumoPcForKr != 'undefined' && gapSuumoPcForKr.length == 1){
					if(typeof gapSuumoPcForKr[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id, honbanCheckFlag, gapSuumoPcForKr[0].ryoikiShuCd);
					}
				}

				if(typeof gapSuumoSpForMs != 'undefined' && gapSuumoSpForMs.length == 1){
					if(typeof gapSuumoSpForMs[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id ,honbanCheckFlag, gapSuumoSpForMs[0].ryoikiShuCd);
					}
				}

				if(typeof gapSuumoPcForMs != 'undefined' && gapSuumoPcForMs.length == 1){
					if(typeof gapSuumoPcForMs[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id, honbanCheckFlag, gapSuumoPcForMs[0].ryoikiShuCd);
					}
				}

				if(typeof gapSuumoSpForFr != 'undefined' && gapSuumoSpForFr.length == 1){
					if(typeof gapSuumoSpForFr[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id ,honbanCheckFlag, gapSuumoSpForFr[0].ryoikiShuCd);
					}
				}

				if(typeof gapSuumoPcForFr != 'undefined' && gapSuumoPcForFr.length == 1){
					if(typeof gapSuumoPcForFr[0].ryoikiShuCd != 'undefined'){
						return getContainerIdFromRyoikiShuCd(id, honbanCheckFlag, gapSuumoPcForFr[0].ryoikiShuCd);
					}
				}
			} catch(e) {
			}
		}

		return id;
	};

	function getContainerIdFromProp14(id, honbanCheckFlag, prop14){
		switch (prop14) {
			case 'H':
				if (honbanCheckFlag) {
					id = 'GTM-PZT6X8M'; // chumon - honban
				} else {
					id = 'GTM-PH3HT69'; // chumon - kenpin
				}
				break;
			case 'F':
				if (honbanCheckFlag) {
					id = 'GTM-TRBQ7V6'; // chintai - honban
				} else {
					id = 'GTM-TL84DV5'; // chintai - kenpin
				}
				break;
			case 'M':
				if (honbanCheckFlag) {
					id = 'GTM-PR6PH9R'; // MS - honban
				} else {
					id = 'GTM-5KX9P6P'; // MS - kenpin
				}
				break;
			case 'R':
				if (honbanCheckFlag) {
					id = 'GTM-KWD2SQ2'; // RF - honban
				} else {
					id = 'GTM-547RNXS'; // RF - kenpin
				}
				break;
			case 'S':
			case 'K':
			case 'D':
			case 'T':
				if (honbanCheckFlag) {
					id = 'GTM-PCHB8WQ'; // KR - honban
				} else {
					id = 'GTM-MSL28RQ'; // KR - kenpin
				}
				break;
			case 'B':
				if (honbanCheckFlag) {
					id = 'GTM-WJL8TJ4'; // baikyaku - honban
				} else {
					id = 'GTM-T6R3L8C'; // baikyaku - kenpin
				}
				break;
			default:
				break;
		}

		return id;
	};

	function getKRContainerIdFromLocationPathname(id, honbanCheckFlag){
		if (honbanCheckFlag) {
			id = 'GTM-PCHB8WQ'; // KR - honban
		} else {
			id = 'GTM-MSL28RQ'; // KR - kenpin
		}

		return id;
	};

	function getRFContainerIdFromLocationPathname(id, honbanCheckFlag){
		if (honbanCheckFlag) {
			id = 'GTM-KWD2SQ2'; // RF - honban
		} else {
			id = 'GTM-547RNXS'; // RF - kenpin
		}

		return id;
	};

	function getMSContainerIdFromLocationPathname(id, honbanCheckFlag){
		if (honbanCheckFlag) {
			id = 'GTM-PR6PH9R'; // MS - honban
		} else {
			id = 'GTM-5KX9P6P'; // MS - kenpin
		}

		return id;
	};

	function getFRContainerIdFromLocationPathname(id, honbanCheckFlag){
		if (honbanCheckFlag) {
			id = 'GTM-TRBQ7V6'; // chintai - honban
		} else {
			id = 'GTM-TL84DV5'; // chintai - kenpin
		}

		return id;
	};

	function getCHContainerIdFromLocationPathname(id, honbanCheckFlag){
		if (honbanCheckFlag) {
			id = 'GTM-PZT6X8M'; // chumon - honban
		} else {
			id = 'GTM-PH3HT69'; // chumon - kenpin
		}

		return id;
	};

	function getContainerIdFromRyoikiShuCd(id, honbanCheckFlag, ryoikiShuCd){
		switch (ryoikiShuCd) {
			case '040':
				if (honbanCheckFlag) {
					id = 'GTM-TRBQ7V6'; // chintai - honban
				} else {
					id = 'GTM-TL84DV5'; // chintai - kenpin
				}
				break;
			case '010':
				if (honbanCheckFlag) {
					id = 'GTM-PR6PH9R'; // MS - honban
				} else {
					id = 'GTM-5KX9P6P'; // MS - kenpin
				}
				break;
			case '011':
			case '020':
			case '021':
			case '030':
				if (honbanCheckFlag) {
					id = 'GTM-PCHB8WQ'; // KR - honban
				} else {
					id = 'GTM-MSL28RQ'; // KR - kenpin
				}
				break;
			default:
				break;
		}

		return id;
	};

	var gtmContainerIds = gtmContainerSelector(location.hostname + location.pathname);

		((navigator.userAgent.match(/\/SUUMO_APP/)) ? '':(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
		new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
		j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
		'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer',gtmContainerIds));
//============ GTM end ==================================
