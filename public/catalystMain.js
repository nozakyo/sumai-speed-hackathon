/**
 * サイカタ
 */
/* global s */
(function () {
	var selfJs = S('#catalystMainJs');

	// ページID
	var catalystPageId = selfJs.attr('data-pageId');

	// 種別 (se)
	var bukkenSyubetsu = selfJs.attr('data-syubetsu') || '';
	// window.alert(bukkenSyubetsu);

	// rsid、tb
	var rsid = selfJs.attr('data-rsid');
	var tb = '';

	// kid、prop20
	var kid = selfJs.attr('data-kid') || '';

	var prop4 = selfJs.attr('data-prop4') || '';
	var prop11 = selfJs.attr('data-prop11') || '';
	var prop12 = selfJs.attr('data-prop12') || '';

	var prop19 = selfJs.attr('data-prop19') || '';

	var prop20 = selfJs.attr('data-prop20') || '';
	var prop21 = selfJs.attr('data-prop21') || '';

	var prop55 = selfJs.attr('data-prop55') || '';
	var prop56 = selfJs.attr('data-prop56') || '';
	var prop65 = selfJs.attr('data-prop65') || '';

	// 物件詳細用のページビューかどうか
	var isForDetail = ((selfJs.attr('data-isForDetail') || '') != '');

	// リフォームのページビューかどうか
	var isReform = ((selfJs.attr('data-is-reform') || '') != '');

	// ABテスト判定結果
	var eVar40 = selfJs.attr('data-eVar40') || '';

	// 記号がエンコードされているので、まずはデコードする
	var url = decodeURI(window.location.href);

	// prop32、eVar32を学生版、ブライダル版、通常導線毎に動的に設定
	/**
	 * 現在の表示画面のssiteの番号を返します。
	 */
	var getSsite = function () {
		switch (sitePath) {
			case '/bridal':
				return 2;
			case '/gakusei':
				return 3;
			default:
				return 1;
		}
	};

	/**
	 * 配列から重複した値を取り除く
	 * @param 配列(1次配列)
	 */
	function getUniqueArray (array) {
		// 値重複チェック用のオブジェクト
		var storage = {};
		// 結果として出力するユニークな値の配列
		var uniqueArray = [];
		for (var i = 0; i < array.length; i++) {
			var value = array[i];
			// 重複をチェック
			if (!(value in storage)) {
				// 重複していない値を、重複チェック用のオブジェクトに登録
				storage[value] = true;
				// 値を結果の配列へ格納
				uniqueArray.push(value);
			}
		}
		return uniqueArray;
	}

	/**
	 * 特集CDの取得
	 */
	function getTokushuCode () {
		var tokushuCd = '';

		var tc = url.match(/tm_([A-Za-z0-9]+)/);
		if (tc !== null) {
			tokushuCd = tc[1];
		}

		return tokushuCd;
	}

	/**
	 * prop13：階層CDの取得 (ページIDから)
	 */
	function getKaisoCode () {
		var kaisoCode = '';
		// ページIDの仕様を元に4文字目を抽出
		kaisoCode = catalystPageId.substr(3, 1);

		return kaisoCode;
	}

	/**
	 * prop14：領域CDの取得 (ページIDから)
	 */
	function getRyoikiCode () {
		var ryoikiCode = '';

		ryoikiCode = catalystPageId.substr(1, 1);

		return ryoikiCode;
	}

	/**
	 * prop15：版CDの取得 (ページIDから)
	 */
	function getHanCode () {
		var hanCode = '';

		hanCode = catalystPageId.substr(2, 1);

		return hanCode;
	}

	/**
	 * prop16：エリア県CDの取得 (ページIDから)
	 */
	function getAreaCode () {
		var areaCode = '';

		// ページIDの仕様を元に4文字目を抽出
		var result = parseInt(catalystPageId.substr(4, 2));
		if (result > 0) {
			areaCode = parseInt(catalystPageId.substr(4, 2));
		}

		return areaCode;
	}

	/**
	 * prop25：検索:エリアの取得 (ページIDから)
	 * prop15と同じため、prop15の処理を呼ぶ
	 */
	function getAreaInfo () {
		return getHanCode();
	}

	/**
	 * prop26：検索：路線の取得 (URLから)
	 * (沿線コードの取得)
	 */
	function getEnsenInfo () {
		var ensenInfo = '';
		var ensenCodeList = [];

		// s[]を取得
		var s = url.match(/s\[\]=[0-9]+/g);
		if (s !== null) {
			// s[] の場合は、沿線コードが複数ある場合がある
			var ensenCodeList = [];
			var infoCount = s.length;
			for (var i = 0; i < infoCount; i++) {
				if (ensenInfo.length > 0) {
					ensenInfo += ',';
				}
				var info = s[i].match(/=([0-9]+)/);
				if (info !== null) {
					var value = info[1].substr(0, 4);
					ensenCodeList.push(value);
				}
			}
		}

		// line_を取得
		var line = url.match(/line_([0-9]+)/);
		if (line !== null) {
			ensenCodeList.push(line[1]);
		}

		// en_を取得
		var en = url.match(/en_([0-9]+)/);
		if (en !== null) {
			ensenCodeList.push(en[1]);
		}

		// 沿線コード+駅コードの可能性があるので
		// そちらもチェックを行う

		// e[]の取得
		var e = url.match(/e\[\]=[0-9]+/g);
		if (e !== null) {
			// e[] の場合は、沿線コードが複数ある場合がある
			var infoCount = e.length;
			for (var i = 0; i < infoCount; i++) {
				var info = e[i].match(/=([0-9]+)/);
				if (info !== null) {
					var value = info[1].substr(0, 4);
					ensenCodeList.push(value);
				}
			}
		}

		// ekの取得
		var ek = null;
		if (!url.match(/ek_([0-9]{5}\/)/)) {
			ek = url.match(/ek_([0-9]+)/);
		}
		if (ek !== null) {
			ensenCodeList.push(ek[1].substr(0, 4));
		}

		var uniqueList = getUniqueArray(ensenCodeList);
		ensenInfo = uniqueList;

		return ensenInfo;
	}

	/**
	 * prop17：行政区CDの取得 (URLから)
	 */
	function getGyoseikuInfo () {
		var gyouseikuInfo = '';
		var scList = [];

		// sc[]の取得
		var sc = url.match(/sc\[\]=[0-9]+/g);
		if (sc !== null) {
			// sc[] の場合は、沿線コードが複数ある場合がある
			var infoCount = sc.length;

			for (var i = 0; i < infoCount; i++) {
				var info = sc[i].match(/=([0-9]+)/);
				if (info !== null) {
					var value = info[1];
					scList.push(value);
				}
			}
		}

		var singleSc = url.match(/sc_([0-9]+)/);
		if (singleSc !== null) {
			scList.push(singleSc[1]);
		}

		var uniqueList = getUniqueArray(scList);
		gyouseikuInfo = uniqueList;

		return gyouseikuInfo;
	}

	/**
	 * prop28：検索：価格帯の取得 (URLから)
	 */
	function getKakakuRange () {
		var kakakuRange = '';

		var kb = null;
		var kt = null;

		// 賃料または月額から取得
		var getsugakumin = url.match(/chinryomin=([0-9\.]+)/);
		if (getsugakumin === null) {
			getsugakumin = url.match(/getsugakumin=([0-9\.]+)/);
		}
		var getsugakumax = url.match(/chinryomax=([0-9\.]+)/);
		if (getsugakumax === null) {
			getsugakumax = url.match(/getsugakumax=([0-9\.]+)/);
		}
		// 価格から取得
		var kamin = url.match(/kamin=([0-9\.]+)/);
		var kamax = url.match(/kamax=([0-9\.]+)/);

		if (getsugakumin !== null || getsugakumax !== null) {
			// 賃貸の賃料または月額の場合
			kb = getsugakumin !== null ? getsugakumin[1] : '0.0';
			kt = getsugakumax !== null ? getsugakumax[1] : '9999999';
		} else if (kamin !== null || kamax !== null) {
			// 売買の価格の場合
			kb = kamin !== null ? kamin[1] : '0.0';
			kt = kamax !== null ? kamax[1] : '9999999';
		}

		if (kb !== null || kt !== null) {
			kakakuRange = kb + '_' + kt;
		}

		return kakakuRange;
	}

	/**
	 * prop29：検索：専有面積の取得 (URLから)
	 */
	function getMensekiRange () {
		var mensekiRange = '';

		var mb = null;
		var mt = null;

		var menmin = url.match(/menmin=([0-9\.]+)/);
		var menmax = url.match(/menmax=([0-9\.]+)/);

		var frSenyumenmin = url.match(/fr_senyumenmin=([0-9\.]+)/);
		var frSenyumenmax = url.match(/fr_senyumenmax=([0-9\.]+)/);

		if (frSenyumenmin !== null || frSenyumenmax !== null) {
			mb = frSenyumenmin !== null ? frSenyumenmin[1] : '0';
			mt = frSenyumenmax !== null ? frSenyumenmax[1] : '9999999';
		} else if (menmin !== null || menmax !== null) {
			mb = menmin !== null ? menmin[1] : '0';
			mt = menmax !== null ? menmax[1] : '9999999';
		}
		if (mb !== null || mt !== null) {
			mensekiRange = mb + '_' + mt;
		}

		return mensekiRange;
	}

	/**
	 * prop30：検索：間取りの取得 (URLから)
	 */
	function getMadori () {
		var madoriInfo = [];

		var cinmMadori = null;
		var madori = null;

		// 賃貸のバージョンを取得
		cinmMadori = url.match(/cinm\[\]=[0-9]+/g);
		if (cinmMadori === null) {
			// 賃貸のバージョンを取得できない場合は、
			// 売買のバージョンを取得
			madori = madori = url.match(/m\[\]=[0-9]+/g);
		}

		// 格納されている方を使用する
		var checkMadori = cinmMadori || madori;
		if (checkMadori !== null) {
			// 情報nullでなければ、値を取得する

			var infoCount = checkMadori.length;
			for (var i = 0; i < infoCount; i++) {
				var info = checkMadori[i].match(/=([0-9]+)/);
				if (info !== null) {
					var value = info[1];
					// madori (売買) の場合は、送る値の開始値が0なので、-1する
					if (madori !== null) {
						value -= 1;
					}
					madoriInfo.push(value);
				}
			}
		}

		return madoriInfo;
	}

	/**
	 * prop31：検索：駅徒歩の取得 (URLから)
	 */
	function getEkiToho () {
		var ekitoho = '';

		var et = url.match(/et=([0-9]+)/);
		if (et !== null) {
			ekitoho = et[1];
		}

		return ekitoho;
	}

	/**
	 * prop48：物件CDの取得
	 * (物件コード、もしくはプロジェクトコード)
	 */
	function getBukkenCode () {
		var bukkenCd = '';

		var pj = url.match(/pj_([0-9]+)/);
		var bk = url.match(/bk_([0-9]+)/);

		if (pj !== null) {
			bukkenCd = pj[1];
		} else if (bk !== null) {
			bukkenCd = bk[1];
		}

		return bukkenCd;
	}

	/**
	 * eValr22：種別 (se)
	 * (seの値は、Smartyでassginされている。ない場合は、空文字)
	 */
	function getSyubetsu () {
		return bukkenSyubetsu;
	}

	/**
	 * eVar40：ABテスト結果
	 * (Smartyでassginされている。ない場合は、空文字)
	 */
	function getAbtestResult () {
		return eVar40;
	}
	var baikyakuEvents = selfJs.attr('data-baikyaku-events') || '';
	s.events = '';

	var baikyakuProducts = selfJs.attr('data-baikyaku-products') || '';
	s.products = '';
	ke = '';
	bs = '';
	ss = '';
	bc = '';
	nc = '';
	tjh = '';
	jjh = '';
	kc = '';
	seq = '';
	s.pageName = catalystPageId;
	shiryoType = '';
	s.pageType = '';
	s.prop3 = catalystPageId;
	s.prop12 = 'JJ';
	s.prop13 = getKaisoCode();
	s.prop14 = getRyoikiCode();
	s.prop15 = getHanCode();
	s.prop16 = getAreaCode();
	s.prop17 = selfJs.attr('data-prop17') || getGyoseikuInfo();
	s.prop18 = '';
	s.prop25 = getAreaInfo();
	s.prop26 = selfJs.attr('data-prop26') || getEnsenInfo();
	s.prop27 = selfJs.attr('data-prop27') || '';
	s.prop28 = getKakakuRange();
	s.prop29 = getMensekiRange();
	s.prop30 = getMadori();
	s.prop31 = getEkiToho();
	s.prop33 = '01';
	s.prop36 = '';
	s.prop37 = '';
	s.eVar12 = 'JJ';
	s.eVar13 = s.prop13;
	s.eVar14 = s.prop14;
	s.eVar15 = s.prop15;
	s.eVar16 = s.prop16;
	s.eVar17 = s.prop17;
	s.eVar18 = s.prop18;
	s.eVar22 = getSyubetsu();
	s.eVar25 = s.prop25;
	s.eVar26 = s.prop26;
	s.eVar27 = s.prop27;
	s.eVar28 = s.prop28;
	s.eVar29 = s.prop29;
	s.eVar30 = s.prop30;
	s.eVar31 = s.prop31;
	s.eVar33 = s.prop33;
	s.eVar36 = s.prop36;
	s.eVar37 = s.prop37;
	s.eVar40 = getAbtestResult();
	s.eVar57 = selfJs.attr('data-eVar57') || '';
	s.eVar66 = selfJs.attr('data-eVar66') || '';
	seikyuFlg = '';
	trace_p = catalystPageId;

	s.eVar47 = kid;
	s.prop47 = kid;

	// 特集
	var tokushuCd = selfJs.attr('data-eVar1') || getTokushuCode();
	if (tokushuCd !== '') {
		// prop1：特集CD
		s.eVar1 = tokushuCd;
		//	s.prop1 にはURLが自動設定される

		// prop11：商品企画CD
		var shohinKikakuCd = tokushuCd.substr(0, 5);
		s.eVar11 = shohinKikakuCd;
		s.prop11 = shohinKikakuCd;
	}

	// 物件コード(もしくはプロジェクトコード)
	bk = selfJs.attr('data-prop48') || getBukkenCode();
	if (bk !== '') {
		// 値があれば、セットする
		s.prop48 = bk;
		s.eVar48 = bk;
	}

	// prop4の設定を行う
	if (prop4 !== '') {
		s.prop4 = prop4;
	}

	// prop11の設定を行う
	if (prop11 !== '') {
		s.prop11 = prop11;
	}

	// KissCd（売却）
	if (prop12 !== '') {
		s.prop12 = prop12;
	}

	// HPKコード
	if (prop19 !== '') {
		s.prop19 = prop19;
	}

	// 導線を判断する
	if (prop20 !== '') {
		s.eVar20 = prop20;
		s.prop20 = prop20;
	}

	// prop21、eVar21の設定を行う
	if (prop21 !== '') {
		s.eVar21 = prop21;
		s.prop21 = prop21;
	}

	// prop55、eVar55の設定を行う
	if (prop55 !== '') {
		s.eVar55 = prop55;
		s.prop55 = prop55;
	}

	// prop56、eVar56の設定を行う
	if (prop56 !== '') {
		s.eVar56 = prop56;
		s.prop56 = prop56;
	}

	// prop65の設定を行う
	if (prop65 !== '') {
		s.prop65 = prop65;
	}

	// prop32、eVar32を学生版、ブライダル版、通常導線毎に動的に設定
	siteKbn = getSsite();
	s.prop32 = '16';
	if (siteKbn !== null && siteKbn !== '') {
		switch (siteKbn) {
			case 2:
				s.prop32 = '19';
				break;
			case 3:
				s.prop32 = '18';
				break;
		}
	}
	s.eVar32 = s.prop32;

	var areaCd3 = getAreaCd(s.products, s.pageName);
	if (seikyuFlg == '2') {
		var shiryoId = getShiryoId(ss, bs);
		s.products = editShiryoParam(bc, nc, tjh, jjh, kc, seq, rsid, shiryoId, seikyuFlg, s.prop15, s.eVar22);
	} else if (seikyuFlg == '1') {
		var shiryoId = getShiryoId(ss, bs);
		var pageName = getPageName(shiryoId);
		s.products = editShiryoParam(bc, nc, tjh, jjh, kc, seq, rsid, shiryoId, seikyuFlg, s.prop15, s.eVar22);
		s.pageName = pageName;
		s.prop3 = pageName;
		trace_p = pageName;
	} else if (seikyuFlg == '3') {
		var shiryoId = '20';
		s.products = editShiryoParam(bc, nc, tjh, jjh, kc, seq, rsid, shiryoId, seikyuFlg, s.prop15, s.eVar22);
	} else {
		s.products = editProductsParam(s.products, rsid, s.eVar22, seikyuFlg);
	}
	if (baikyakuProducts !== '') {
		s.products = baikyakuProducts;
	}

	// 売却詳細用の処理
	if (bukkenSyubetsu !== '100' || prop12 === '') {
		s.prop12 = getKaisha(rsid, s.prop12);
	}
	// リフォームの場合
	if (isReform) {
		s.prop12 = selfJs.attr('data-prop12') || '';
	}
	s.eVar12 = getKaisha(rsid, s.eVar12);

	trace_p = editVOSCode(s.eVar15, s.eVar25, areaCd3, s.eVar22, nc, bc, trace_p);
	s.pageName = getFrPageName(trace_p);
	s.prop3 = getFrPageName(trace_p);
	s.events = editEvents(s.eVar22, s.events);

	// 物件詳細用のページビューの場合
	if (isForDetail) {
		switch (bukkenSyubetsu) {
			case '010': {
				s.events = 'event46';
				break;
			}
			case '011': {
				s.events = 'event47';
				break;
			}
			case '020': {
				s.events = 'event48';
				break;
			}
			case '021': {
				s.events = 'event49';
				break;
			}
			case '030': {
				s.events = 'event50';
				break;
			}
			case '040': {
				s.events = 'event45';
				break;
			}
			default: {
				break;
			}
		}
	}

	if (baikyakuEvents !== '') {
		s.events = baikyakuEvents;
	}

	var s_code = s.t(); if (s_code)document.write(s_code);

	/**
	 * サイカタ：イベント送信
	 */
	function sendCatalystEvent (eventName) {
		// eventNameが存在しなければ、イベントは送信しない
		if (typeof eventName !== 'undefined' &&
			eventName !== null &&
			eventName.length > 0) {
			var s = s_gi(rsid);
			// s.eventsを設定しないといけないということなので、設定するようにしました。
			s.events = eventName;
			s.linkTrackVars = 'events';
			s.linkTrackEvents = eventName;
			// s.trackExternalLinksをfalseにしないと、イベント送信の際に、サイト外に出た出口の計測が行われてしまうということなので
			// falseを設定
			s.trackExternalLinks = false;
			s.tl(this, 'o', 'Sample Link Click');
		}
	}

	/**
	 * サイカタ アクションクリックトラッキング（MS用）
	 *
	 * @param {String} linkName s.tl関数実行時に送信するリンク名
	 * @param {String} eventName s.eventに設定する値
	 * @param {String} linkTrackVars s.linkTrackVarsに設定する値
	 */
	window.sendCatalystMsClickEvent = function (linkName, eventName, linkTrackVars) {
		// eslint-disable-next-line no-undef
		var s = s_gi(rsid);
		s.linkTrackVars = linkTrackVars !== '' ? linkTrackVars + ',prop1,prop2,prop3,prop4' : 'prop1,prop2,prop3,prop4';
		if (typeof eventName !== 'undefined' && eventName !== null && eventName.length > 0) {
			s.linkTrackVars += ',events';
			s.linkTrackEvents = eventName;
			s.events = eventName;
		} else {
			s.linkTrackEvents = 'none';
		}
		// s.trackExternalLinksをfalseにしないと、イベント送信の際に、サイト外に出た出口の計測が行われてしまうということなので
		// falseを設定
		s.trackExternalLinks = false;
		s.tl(true, 'o', linkName);
	};

	/**
	 * サイカタ クリックトラッキング
	 *
	 * @param linkTrackVars   {String}    s.linkTrackVarsに設定する値
	 * @param eventName {String}    s.eventに設定する値
	 * @param linkName {String}    s.tl関数実行時に送信するリンク名
	 */
	window.sendCatalystCustomEvent = function (linkTrackVars, eventName, linkName) {
		var s = s_gi(rsid);
		if (typeof eventName !== 'undefined' && eventName !== null && eventName.length > 0) {
			s.events = eventName;
			s.linkTrackVars = linkTrackVars + ',events';
			s.linkTrackEvents = 'events';
		} else {
			s.linkTrackVars = linkTrackVars;
		}
		// s.trackExternalLinksをfalseにしないと、イベント送信の際に、サイト外に出た出口の計測が行われてしまうということなので
		// falseを設定
		s.trackExternalLinks = false;
		s.tl(true, 'o', linkName);
	};

	/**
	 * eVar62：VWO実施時にイベント送信
	 */
	window.sendEventForVwoCatalyst = function (_vis_data) {
		// _vis_dataが存在しなければ、イベントは送信しない
		if (typeof _vis_data !== 'undefined' &&
			_vis_data !== null &&
			_vis_data.length > 0) {
			var s = s_gi(rsid);
			// s.eventsを設定しないといけないということなので、設定するようにしました。
			s.events = _vis_data;
			s.linkTrackVars = 'eVar62';
			s.linkTrackEvents = 'None';
			s.eVar62 = _vis_data;
			// s.trackExternalLinksをfalseにしないと、イベント送信の際に、サイト外に出た出口の計測が行われてしまうということなので
			// falseを設定
			s.trackExternalLinks = false;
			s.tl(this, 'o', 'Sample Link Click');
		}
	};

	/**
	 * サイカタ：見学予約
	 */
	window.sendCatalystEventForKengakuYoyaku = function () {
		var eventName = '';
		switch (bukkenSyubetsu) {
			case '040': {
				eventName = 'event32';
				break;
			}
			default: {
				break;
			}
		}

		// 今回、飛ばさないということだったので、コメントアウト
		// sendCatalystEvent(eventName);
	};

	/**
	 * サイカタ：反響
	 */
	window.sendCatalystEventForHankyo = function () {
		var eventName = '';
		switch (bukkenSyubetsu) {
			case '010': {
				eventName = 'event34';
				break;
			}
			case '011': {
				eventName = 'event35';
				break;
			}
			case '020': {
				eventName = 'event36';
				break;
			}
			case '021': {
				eventName = 'event37';
				break;
			}
			case '030': {
				eventName = 'event38';
				break;
			}
			case '040': {
				eventName = 'event33';
				break;
			}
			default: {
				break;
			}
		}

		// 今回、飛ばさないということだったので、コメントアウト
		// sendCatalystEvent(eventName);
	};

	/**
	 * サイカタ：電話 (一戸建て)
	 */
	window.sendCatalystEventForPhoneIkkodate = function () {
		sendCatalystEvent('event42');
	};

	/**
	 * サイカタ：電話 (土地)
	 */
	window.sendCatalystEventForPhoneTochi = function () {
		sendCatalystEvent('event44');
	};

	/**
	 * サイカタ：電話
	 */
	window.sendCatalystEventForPhone = function () {
		var eventName = '';
		switch (bukkenSyubetsu) {
			case '010': {
				eventName = 'event40';
				break;
			}
			case '011': {
				eventName = 'event41';
				break;
			}
			case '020': {
				eventName = 'event42';
				break;
			}
			case '021': {
				eventName = 'event43';
				break;
			}
			case '030': {
				eventName = 'event44';
				break;
			}
			case '040': {
				eventName = 'event39';
				break;
			}
			case '100': {
				eventName = 'event60';
				break;
			}
			default: {
				break;
			}
		}

		sendCatalystEvent(eventName);
	};

	/**
	 * リフォーム:会社詳細(サイカタ)
	 */
	window.sendCatalystEventForReformKaishaDetail = function () {
		sendCatalystEvent('event54');
	};

	/**
	 * リフォーム:電話(サイカタ)
	 */
	window.sendCatalystEventForReformPhone = function () {
		sendCatalystEvent('event55');
	};
})();
