/**
 * ビーコン
 */
var _WkWkParams = _WkWkParams || [];

(function () {
	// ページIDの各構成要素のキー
	const
		SC = 'sc';
	const
		BS = 'bs';
	const
		AR = 'ar';
	const
		LV = 'lv';
	const
		TA = 'ta';
	const
		SEQ = 'seq';

	var selfJs = S('#beaconJs');

	// ビーコンURL

	var beaconUrl = selfJs.attr('data-url');

	// テンプレートID
	var templateId = selfJs.attr('data-templateId');

	// ページID
	var pageId = selfJs.attr('data-pageId');

	// kid
	var kid = selfJs.attr('data-kid') || '';

	// bc、nc、jc、kc、kiss、pageid
	var bcList = selfJs.attr('data-bcList') || 'null';
	bcList = JSON.parse(bcList) || [];
	var ncList = selfJs.attr('data-ncList') || 'null';
	ncList = JSON.parse(ncList) || [];
	var krSnetIdList = selfJs.attr('data-krsnetidList') || 'null';
	krSnetIdList = JSON.parse(krSnetIdList) || [];
	var jcList = selfJs.attr('data-jcList') || '';
	var kcList = selfJs.attr('data-kcList') || '';
	var kissList = selfJs.attr('data-kissList') || '';
	var smk = selfJs.attr('data-smk') || '';
	var hyokaVal = selfJs.attr('data-hyokaVal') || '';
	var commentNum = selfJs.attr('data-commentNum') || '';
	var icList = selfJs.attr('data-icList') || '';
	var customerTrendsParamsForPageView = selfJs
		.attr('data-customerTrendsParamsForPageView') ||
		'null';
	customerTrendsParamsForPageView = JSON
		.parse(customerTrendsParamsForPageView) ||
		'';
	var customerTrendsParamsForMylist = selfJs
		.attr('data-customerTrendsParamsForMylist') ||
		'null';
	customerTrendsParamsForMylist = JSON.parse(customerTrendsParamsForMylist) ||
		'';
	var customerTrendsParamsForSaveJoken = selfJs
		.attr('data-customerTrendsParamsForSaveJoken') ||
		'null';
	customerTrendsParamsForSaveJoken = JSON
		.parse(customerTrendsParamsForSaveJoken) ||
		'';
	var pageidList = selfJs.attr('data-pageidList') || '';

	// beacon_kbn
	var kbn = selfJs.attr('data-kbn') || '';

	// total_hit
	var totalHit = selfJs.attr('data-totalHit');

	// juko_total_hit
	var jukoTotalHit = selfJs.attr('data-jukoTotalHit') || '';

	// abtestResult
	var abtestResult = selfJs.attr('data-abtestResult') || '';

	var abtestAbCookie = selfJs.attr('data-abCookie') || '';
	var abtestAbTestBin = selfJs.attr('data-abTestbin') || '';

	var ekemcList = selfJs.attr('data-ekemcList') || '';
	var beaconPageviewArrayInfo = selfJs.attr('data-pageviewArrayInfo') || '';

	// ページビューを送信するか
	var isSendPageView = true;
	if (selfJs.attr('data-isSendPageView') != null) {
		isSendPageView = (selfJs.attr('data-isSendPageView') != '');
	}

	_WkWkParams.push(['TEMPLATE_ID', templateId]);
	_WkWkParams.push(['PAGE_ID', pageId]);

	if (kid !== '') {
		_WkWkParams.push(['PARAMETER', 'kid', kid]);
	}

	if (ncList.length > 0) {
		for (var i = 0; i < ncList.length; i++) {
			_WkWkParams.push(['PARAMETER', 'nc', ncList[i]]);
		}
	}

	if (bcList.length > 0) {
		for (var i = 0; i < bcList.length; i++) {
			_WkWkParams.push(['PARAMETER', 'bc', bcList[i]]);
		}
	}

	if (krSnetIdList.length > 0) {
		for (var i = 0; i < krSnetIdList.length; i++) {
			_WkWkParams.push(['PARAMETER', 'krsnetid', krSnetIdList[i]]);
		}
	}

	if (jcList !== '') {
		var buf = jcList.split(',');
		for (var i = 0; i < buf.length; i++) {
			_WkWkParams.push(['PARAMETER', 'jc', buf[i]]);
		}
	}

	if (kcList !== '') {
		var buf = kcList.split(',');
		for (var i = 0; i < buf.length; i++) {
			_WkWkParams.push(['PARAMETER', 'kc', buf[i]]);
		}
	}

	if (icList !== '') {
		var buf = icList.split(',');
		for (var i = 0; i < buf.length; i++) {
			_WkWkParams.push(['PARAMETER', 'ic', buf[i]]);
		}
	}

	if (kissList !== '') {
		var buf = kissList.split(',');
		for (var i = 0; i < buf.length; i++) {
			_WkWkParams.push(['PARAMETER', 'kiss', buf[i]]);
		}
	}

	if (smk !== '') {
		_WkWkParams.push(['PARAMETER', 'smk', smk]);
	}

	if (hyokaVal !== '') {
		_WkWkParams.push(['PARAMETER', 'hyokaVal', hyokaVal]);
	}

	if (commentNum !== '') {
		_WkWkParams.push(['PARAMETER', 'commentNum', commentNum]);
	}

	if (pageidList !== '') {
		var buf = pageidList.split(',');
		_WkWkParams.push(['PARAMETER', SC, buf[0]]);
		_WkWkParams.push(['PARAMETER', BS, buf[1]]);
		_WkWkParams.push(['PARAMETER', AR, buf[2]]);
		_WkWkParams.push(['PARAMETER', LV, buf[3]]);
		_WkWkParams.push(['PARAMETER', TA, buf[4]]);
		_WkWkParams.push(['PARAMETER', SEQ, buf[5]]);
	}

	if (kbn !== '') {
		_WkWkParams.push(['PARAMETER', 'kbn', kbn]);
	}

	if (totalHit === '0') {
		_WkWkParams.push(['PARAMETER', 'ZEROHIT', 1]);
	}

	if (templateId === 'MSLOG_SP_SUUMO' && totalHit !== '') {
		_WkWkParams.push(['PARAMETER', 'totalhit', totalHit]);
	}

	if (jukoTotalHit !== '') {
		_WkWkParams.push(['PARAMETER', 'totalhit', jukoTotalHit]);
	}

	if (customerTrendsParamsForPageView !== '') {
		for (var paramKey in customerTrendsParamsForPageView) {
			if (Array.isArray(customerTrendsParamsForPageView[paramKey]) === true) {
				for (var index in customerTrendsParamsForPageView[paramKey]) {
					_WkWkParams.push(['PARAMETER', paramKey,
						customerTrendsParamsForPageView[paramKey][index]]);
				}
			} else {
				_WkWkParams.push(['PARAMETER', paramKey,
					customerTrendsParamsForPageView[paramKey]]);
			}
		}
	}

	if (abtestResult !== '') {
		_WkWkParams.push(['PARAMETER', 'abtestResult', abtestResult]);
	}

	if (abtestAbCookie !== '') {
		_WkWkParams.push(['PARAMETER', 'abCookie', abtestAbCookie]);
	}
	if (abtestAbTestBin !== '') {
		_WkWkParams.push(['PARAMETER', 'abTestBin', abtestAbTestBin]);
	}

	if (ekemcList !== '') {
		var ekemc = ekemcList.split(',');
		for (var i = 0; i < ekemc.length; i++) {
			_WkWkParams.push(['PARAMETER', 'ekemc', ekemc[i]]);
		}
	}

	if (beaconPageviewArrayInfo != '') {
		var beaconPageInfo = getParamsForArrayInfo(beaconPageviewArrayInfo, true);
		_WkWkParams = _WkWkParams.concat(beaconPageInfo);
	}

	// 賃貸の時のみ画面サイズを送信※pageidListはアサインされないケースがあるのでpageIdの2桁目で判定
	if (pageId.substr(1, 1) === 'F') {
		var minVal = window.screen.width;
		var maxVal = window.screen.height;
		// landscape時は値を入れ替えて0番目が小さい値にする
		if (window.screen.width > window.screen.height) {
			minVal = window.screen.height;
			maxVal = window.screen.width;
		}
		_WkWkParams.push(['PARAMETER', 'windowSize', minVal + 'x' + maxVal]);
	}

	// ビーコンのページビューを送信
	if (isSendPageView) {
		sendBeaconForPageView();
	}

	/**
	 * ビーコンのページビューを送信する
	 */
	function sendBeaconForPageView () {
		var scriptTag = document.createElement('script');
		scriptTag.type = 'text/javascript';
		// scriptTag.async = true;
		scriptTag.src = (document.location.protocol == 'https:' ? 'https://'
			: 'http://') +
			beaconUrl;
		var firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentNode.insertBefore(scriptTag, firstScript);

		var pageViewInfoText = selfJs.attr('data-pageViewInfo') || '';
		if (pageViewInfoText) {
			var pageViewInfo = JSON.parse(pageViewInfoText);
			var key;
			for (key in pageViewInfo) {
				if (pageViewInfo[key].push) {
					var i;
					for (i = 0; i < pageViewInfo[key].length; i++) {
						_WkWkParams.push(['PARAMETER', key,
							pageViewInfo[key][i]]);
					}
				} else {
					_WkWkParams.push(['PARAMETER', key, pageViewInfo[key]]);
				}
			}
		}

		// ブラウザバックによる画面アクセスの場合
		if (isBrowserBack) {
			_WkWkParams.push(['PARAMETER', 'ignore_log', 'browserback']);
		}
	}

	/**
	 * ビーコンのアクションEventを送信する
	 *
	 * @param イベント送信用のパラメータ(配列)
	 * @return boolean 送信イベントを実行したらtrue返る
	 */
	window.sendEventForBeacon = function (params) {
		// WkWkTrackerが存在するかをチェック (trackEventがあるかもチェックする)
		if (typeof WkWkTracker !== 'undefined') {
			// ページビューで送ったパラメータをイベント送信時に再送信させないため、_WkWkParamsを初期化する。
			_WkWkParams = [];
			_WkWkParams.push(['TEMPLATE_ID', templateId]);
			_WkWkParams.push(['PAGE_ID', pageId]);
			if (kid !== '') {
				_WkWkParams.push(['PARAMETER', 'kid', kid]);
			}
			// smkが設定されている場合、パラメータに付加
			if (smk !== '') {
				_WkWkParams.push(['PARAMETER', 'smk', smk]);
			}

			WkWkTracker.trackEvent(event, params);

			return true;
		} else {
			return false;
		}
	};

	/**
	 * ビーコンのアクションEventにABtestIDを追加して送信する
	 *
	 * @param {array} params イベント送信用のパラメータ(配列)
	 * @return {boolean} 送信イベントを実行したらtrue返る
	 */
	window.sendEventBeaconForAbtest = function (params) {
		var sendParams = abtestResult ? params.concat([['abtestResult', abtestResult]]) : params;
		return sendEventForBeacon(sendParams);
	};

	/**
	 * ビーコンのページビューを送信する （情報が一件もなかった場合用）
	 */
	window.sendBeaconForPageViewZeroHit = function () {
		_WkWkParams.push(['PARAMETER', 'ZEROHIT', 1]);

		// ビーコンのページビューを送信
		sendBeaconForPageView();
	};

	/**
	 * ビーコンのページビューを送信する （会社お気に入り用）
	 *
	 * @param array chumonBeaconList 注文ビーコンパラメータ一覧
	 * @param array reformBeaconList リフォームビーコンパラメータ一覧
	 */
	window.sendBeaconForPageViewKaishaMylist = function (chumonBeaconList,
		reformBeaconList) {
		// 一件も無かった場合
		if (chumonBeaconList.length <= 0 && reformBeaconList.length <= 0) {
			// ビーコンのページビュー（0件用）を送信
			sendBeaconForPageViewZeroHit();
		}
		// 一件以上設定されている場合
		else {
			// ビーコンパラメータを設定
			for (var i = 0; i < chumonBeaconList.length; i++) {
				if (chumonBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'rn',
						chumonBeaconList[i].value]);
				}
			}
			// ビーコンパラメータを設定
			for (var i = 0; i < reformBeaconList.length; i++) {
				if (reformBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'kc',
						reformBeaconList[i].value]);
				}
			}
			// ビーコンのページビューを送信
			sendBeaconForPageView();
		}
	};

	/**
	 * ビーコンのページビューを送信する （実例お気に入り用）
	 *
	 * @param array chumonBeaconList 注文ビーコンパラメータ一覧
	 * @param array reformBeaconList リフォームビーコンパラメータ一覧
	 */
	window.sendBeaconForPageViewJitsureiMylist = function (chumonBeaconList,
		reformBeaconList) {
		// 一件も無かった場合
		if (chumonBeaconList.length <= 0 && reformBeaconList.length <= 0) {
			// ビーコンのページビュー（0件用）を送信
			sendBeaconForPageViewZeroHit();
		}
		// 一件以上設定されている場合
		else {
			// ビーコンパラメータを設定
			for (var i = 0; i < chumonBeaconList.length; i++) {
				if (chumonBeaconList[i].value.length === 14) {
					_WkWkParams.push(['PARAMETER', 'jc',
						chumonBeaconList[i].value]);
				}
			}
			// ビーコンパラメータを設定
			for (var i = 0; i < reformBeaconList.length; i++) {
				if (reformBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'jc',
						reformBeaconList[i].value]);
				}
			}
			// ビーコンのページビューを送信
			sendBeaconForPageView();
		}
	};

	/**
	 * ビーコンのページビューを送信する （会社閲覧履歴用）
	 *
	 * @param array chumonBeaconList 注文ビーコンパラメータ一覧
	 * @param array reformBeaconList リフォームビーコンパラメータ一覧
	 */
	window.sendBeaconForPageViewKaishaRireki = function (chumonBeaconList,
		reformBeaconList) {
		// 一件も無かった場合
		if (chumonBeaconList.length === 0 && reformBeaconList.length === 0) {
			// ビーコンのページビュー（0件用）を送信
			sendBeaconForPageViewZeroHit();
		}
		// 一件以上設定されている場合
		else {
			// ビーコンパラメータを設定
			for (var i = 0; i < chumonBeaconList.length; i++) {
				if (chumonBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'rn',
						chumonBeaconList[i].value]);
				}
			}
			// ビーコンパラメータを設定
			for (var i = 0; i < reformBeaconList.length; i++) {
				if (reformBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'kc',
						reformBeaconList[i].value]);
				}
			}
			// ビーコンのページビューを送信
			sendBeaconForPageView();
		}
	};

	/**
	 * ビーコンのページビューを送信する （実例閲覧履歴用）
	 *
	 * @param array chumonBeaconList 注文ビーコンパラメータ一覧
	 * @param array reformBeaconList リフォームビーコンパラメータ一覧
	 */
	window.sendBeaconForPageViewJitsureiRireki = function (chumonBeaconList,
		reformBeaconList) {
		// 一件も無かった場合
		if (chumonBeaconList.length === 0 && reformBeaconList.length === 0) {
			// ビーコンのページビュー（0件用）を送信
			sendBeaconForPageViewZeroHit();
		}
		// 一件以上設定されている場合
		else {
			// ビーコンパラメータを設定
			for (var i = 0; i < chumonBeaconList.length; i++) {
				if (chumonBeaconList[i].value.length === 14) {
					_WkWkParams.push(['PARAMETER', 'jc',
						chumonBeaconList[i].value]);
				}
			}
			// ビーコンパラメータを設定
			for (var i = 0; i < reformBeaconList.length; i++) {
				if (reformBeaconList[i].value !== '') {
					_WkWkParams.push(['PARAMETER', 'jc',
						reformBeaconList[i].value]);
				}
			}
			// ビーコンのページビューを送信
			sendBeaconForPageView();
		}
	};

	/**
	 * ビーコンのページビューを送信する （会員閲覧履歴用）
	 *
	 * @param array resultList
	 */
	window.sendBeaconForPageViewMemberRireki = function (resultList) {
		for (var i = 0; i < resultList.length; i++) {
			// APIのレスポンスを信じるということで、賃貸であるか
			// そうでないかしかチェックしていません。
			if (resultList[i].se === '040') {
				// 賃貸の場合
				_WkWkParams.push(['PARAMETER', 'bc', resultList[i].id]);
			} else {
				// 売買の場合
				_WkWkParams.push(['PARAMETER', 'nc', resultList[i].id]);
			}
		}

		// ビーコンのページビューを送信
		sendBeaconForPageView();
	};

	/**
	 * ビーコンのページビューを送信する （会員お気に入り用）
	 *
	 * @param array listDatas
	 * @param array options
	 */
	window.sendBeaconForPageViewMemberMylist = function (listDatas, options) {
		for (var key in listDatas) {
			for (var i in listDatas[key]) {
				if (key === '040') {
					_WkWkParams.push(['PARAMETER', 'bc', listDatas[key][i].id]);
				} else {
					_WkWkParams.push(['PARAMETER', 'nc', listDatas[key][i].id]);
				}
			}
		}
		// pv送信オプションがあればPARAMETERに追加
		for (var key in options) {
			if (Array.isArray(options[key])) {
				// 配列で渡されているものはそれぞれ格納されている値をPARAMETERに設定する
				for (var index in options[key]) {
					_WkWkParams.push(['PARAMETER', key, options[key][index]]);
				}
			} else {
				_WkWkParams.push(['PARAMETER', key, options[key]]);
			}
		}

		// ビーコンのページビューを送信
		sendBeaconForPageView();
	};

	/**
	 * 検索のビーコンEvent送信を行う
	 *
	 * @param object element
	 */
	window.sendEventBeaconForSearch = function (element) {
		if (S(element).hasClass('disabled') === false) {
			sendEventForBeacon([['eventName', 'search']]);
		}
	};

	/**
	 * さらに検索条件を指定のビーコンEvent送信を行う
	 *
	 * @param object element
	 */
	window.sendEventBeaconForJokenSet = function (element) {
		if (S(element).hasClass('disabled') === false) {
			sendEventForBeacon([['eventName', 'joken_set']]);
		}
	};

	/**
	 * 選択した沿線で駅を指定のビーコンEvent送信を行う
	 *
	 * @param object element
	 */
	window.sendEventBeaconForEkiSet = function (element) {
		if (S(element).hasClass('disabled') === false) {
			sendEventForBeacon([['eventName', 'eki_set']]);
		}
	};

	/**
	 * 電話タップ時のビーコンEvent送信を行う ※特にsuffixが付かないもの用
	 */
	window.sendEventBeaconForPhone = function () {
		sendEventForBeacon([['eventName', 'phone']]);
	};

	/**
	 * 領域x都道府県 オススメ物件のaタグのonclickイベントにビーコンのイベント送信用functionを付加する
	 */
	window.appendClickBeaconEventForbukkenListAll = function () {
		// オススメ物件一覧のエレメントを取得
		var bukkenListAll = document.getElementById('bukkenListAll');
		if (bukkenListAll) {
			// オススメ物件一覧のaタグの一覧を取得
			var aTags = bukkenListAll.getElementsByTagName('a');
			if (aTags) {
				for (var i = 0; i < aTags.length; i++) {
					if (!aTags[i].onclick) {
						var href = aTags[i].href;
						var nc = href.match(/pj_([0-9]+)/);
						if (nc && nc.length === 2) {
							aTags[i].onclick = function () {
								// ビーコン
								if (typeof getProjectCodeWithATag === 'function') {
									sendEventForBeacon([
										['eventName', 'recom'],
										[
											'nc',
											"'" + getProjectCodeWithATag(this) +
												"'"]]);
								}
							};
						}

						var bc = href.match(/bc_([0-9]+)/);
						if (bc && bc.length === 2) {
							aTags[i].onclick = function () {
								// ビーコン
								if (typeof getBukkenCodeWithATag === 'function') {
									sendEventForBeacon([
										['eventName', 'recom'],
										[
											'bc',
											"'" + getBukkenCodeWithATag(this) +
												"'"]]);
								}
							};
						}
					}
				}
			}
		}
	};

	/**
	 * バス検索 > 物件一覧 物件コード、プロジェクトコードをビーコンへ送信
	 *
	 * @param items : ビーコンへ送信する対象の物件（listGeneratorのlistData構成）
	 */
	window.sendEventBeaconForCode = function (items) {
		if (items) {
			// ビーコンパラメータ送信
			var eventParam = [];
			var kissCdList = [];
			for (var i = 0; i < items.length; i++) {
				// APIのレスポンスを信じるということで、賃貸であるかそうでないかしかチェックしていません
				if (items[i]['se'] === '040') {
					eventParam.push(['bc', '' + items[i]['id']]);
					kissCdList.push(['kiss', '' + items[i]['kiss_cd']]);
				} else {
					eventParam.push(['nc', '' + items[i]['id']]);
				}
			}

			// KISSコードをパラメータに付加
			eventParam = eventParam.concat(kissCdList);

			// ページIDの各構成要素をパラメータに付加
			var pageIdElementList = getPageIdElementList();
			eventParam = eventParam.concat(pageIdElementList);

			sendEventForBeacon(eventParam);
		}
	};

	/**
	 * 更に読み込む時のビーコンEvent送信を行う
	 *
	 * @param array res
	 */
	window.sendEventBeaconForMemberMoreSearch = function (res) {
		var eventParam = [];
		for (var i = 0; i < res.length; i++) {
			var sendKey;
			var sendValue;
			if (res[i]['item']['shubetsu'] === '040') {
				sendKey = 'bc';
				sendValue = res[i]['item']['bukken_cd'];
			} else {
				sendKey = 'nc';
				sendValue = res[i]['item']['project_cd'];
			}

			eventParam.push([sendKey, sendValue]);
		}

		sendEventForBeacon(eventParam);
	};

	/**
	 * 注文：資料請求のビーコン(サイカタ)Event送信を行う
	 *
	 * @param object element
	 */
	window.sendEventBeaconForChumonRequestDocument = function (element) {
		if (S(element.parentElement).hasClass('top') === true) {
			sendEventForBeacon([['eventName', 'hankyo_top']]);
		} else if (S(element.parentElement).hasClass('btm') === true) {
			sendEventForBeacon([['eventName', 'hankyo_btm']]);
		} else {
			sendEventForBeacon([['eventName', 'hankyo']]);
		}
	};

	/**
	 * 物件詳細_物件地図の現在地検索のビーコンEvent送信を行う
	 *
	 * @param {string|number} ido parametersに付与する緯度情報
	 * @param {string|number} keido parametersに付与する経度情報
	 */
	window.sendEventBeaconForCurrentPosition = function (ido, keido) {
		// ビーコンパラメータ送信
		sendEventForBeacon([['eventName', 's_groot'], ['grlat', '' + ido],
			['grlng', '' + keido]]);
	};

	/**
	 * 賃貸：物件詳細において、指定したキーと値の後ろに物件コード、KISSコード、ページIDの各構成要素をパラメータとして付加してビーコンEvent送信を行う
	 *
	 * @param {String} sendKey 送信するキー
	 * @param {String} sendValue 送信する値
	 * @param {Object} sendOptionList オプションとして送信するキーと値のリスト
	 */
	window.sendEventBeaconForBukkenDetail = function (sendKey, sendValue, sendOptionList) {
		var sendOptionList = sendOptionList || {};
		var eventParams = [];
		// 指定したキーと値をパラメータに付加
		eventParams.push([sendKey, sendValue]);
		// 物件コードをパラメータに付加
		if (typeof bcList[0] === 'string') {
			eventParams.push(['bc', bcList[0]]);
		}
		// KISSコードをパラメータに付加
		if (kissList !== '') {
			eventParams.push(['kiss', kissList]);
		}
		// オプションのキーと値をパラメータに付加
		for (var key in sendOptionList) {
			eventParams.push([key, sendOptionList[key]]);
		}

		// ページIDの各構成要素をパラメータに付加
		var pageIdElementList = getPageIdElementList();
		eventParams = eventParams.concat(pageIdElementList);

		// ビーコンパラメータ送信
		// AB時にアサインされたパターン名も送信するため、AB用のsendEventBeacon
		sendEventBeaconForAbtest(eventParams);
	};

	/**
	 * 賃貸：取扱い店舗一覧において、指定したキーと値、物件コード、KISSコードの後ろにページIDの各構成要素をパラメータとして付加してビーコンEvent送信を行う
	 *
	 * @param array sendList 送信するキーと値のリスト
	 * @param array bukkenCdList 物件コードリスト
	 * @param array kissCdList KISSコードリスト
	 */
	window.sendEventBeaconForBukkenList = function (sendList, bukkenCdList, kissCdList) {
		var eventParams = [];
		// eventNameを含む設定されたキーと値をパラメータに付加
		for (var sendKey in sendList) {
			eventParams.push([sendKey, sendList[sendKey]]);
		}
		// 物件コードをパラメータに付加
		for (var i = 0; i < bukkenCdList.length; i++) {
			eventParams.push(['bc', bukkenCdList[i]]);
		}
		// KISSコードをパラメータに付加
		for (var i = 0; i < kissCdList.length; i++) {
			eventParams.push(['kiss', kissCdList[i]]);
		}
		// ページIDの各構成要素をパラメータに付加
		var pageIdElementList = getPageIdElementList();
		eventParams = eventParams.concat(pageIdElementList);

		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * 【賃貸】店舗一覧画面でイベントを押下された際に、イベント名、KISSコード、プロジェクトコード、ページIDの各構成要素をパラメータとして付加してビーコンEvent送信を行う
	 *
	 * @param string sendKey 送信するキー
	 * @param string sendValue 送信する値
	 * @param string kissCode 送信するkissコード
	 */
	window.sendEventBeaconForTenpoBukkenList = function (sendKey, sendValue,
		kissCode) {
		var eventParams = [];
		// 指定したキーと値をパラメータに付加
		eventParams.push([sendKey, sendValue]);
		// KISSコードをパラメータに付加
		if (typeof kissCode !== 'undefined' && kissCode !== '') {
			eventParams.push(['kiss', kissCode]);
		}
		// ページIDの各構成要素をパラメータに付加
		var pageIdElementList = getPageIdElementList();
		eventParams = eventParams.concat(pageIdElementList);
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * 賃貸_物件詳細：お気に入りボタンイベント用ビーコン処理 物件詳細において、お気に入りボタンをタップした際に指定したキーと値の後ろに、
	 * 物件コード、KISSコード、ページIDの各構成要素、カスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param {String} sendValue 送信する値
	 * @param {Array} option 追加で付与するパラメータのTuple
	 */
	window.sendEventBeaconForBukkenDetailMylistOfChintai = function (sendValue, option) {
		var eventParams = [];
		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);
		// 物件コードをパラメータに付加
		if (typeof bcList[0] === 'string') {
			eventParams.push(['bc', bcList[0]]);
		}
		// KISSコードをパラメータに付加
		if (kissList !== '') {
			eventParams.push(['kiss', kissList]);
		}
		// ページIDの各構成要素をパラメータに付加
		var pageIdElementList = getPageIdElementList();
		eventParams = eventParams.concat(pageIdElementList);
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		if (option) {
			option.forEach(function (sendValue) {
				eventParams.push(sendValue);
			});
		}
		// ビーコンパラメータ送信
		sendEventBeaconForAbtest(eventParams);
	};

	/**
	 * 売買_物件詳細：お気に入りボタンイベント用ビーコン処理 物件詳細において、お気に入りボタンをタップした際に指定したキーと値の後ろに、 PJコード、カスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 */
	window.sendEventBeaconForBukkenDetailMylistOfBaibai = function (sendValue) {
		var eventParams = [];
		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);
		// PJコードをパラメータに付加
		if (typeof ncList[0] === 'string') {
			eventParams.push(['nc', ncList[0]]);
		}

		// 物件コードとS-net売買ログインIDをパラメータに付加
		if (typeof bcList[0] === 'string' &&
			typeof krSnetIdList[0] === 'string') {
			eventParams.push(['bc', bcList[0]]);
			eventParams.push(['krsnetid', krSnetIdList[0]]);
		}

		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * KR_物件詳細：お気に入りボタンイベント用ビーコン処理 物件詳細において、お気に入りボタンをタップした際に指定したキーと値の後ろに、
	 * PJコード、カスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 * @param array addParameters 追加パラメーター
	 */
	window.sendEventBeaconForBukkenDetailMylistOfKR = function (sendValue, addParameters) {
		var eventParams = [];
		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);
		// PJコードをパラメータに付加
		if (typeof ncList[0] === 'string') {
			eventParams.push(['nc', ncList[0]]);
		}

		// 物件コードとS-net売買ログインIDをパラメータに付加
		if (typeof bcList[0] === 'string' &&
			typeof krSnetIdList[0] === 'string') {
			eventParams.push(['bc', bcList[0]]);
			eventParams.push(['krsnetid', krSnetIdList[0]]);
		}

		// 追加パラメーターを付加
		if (addParameters) {
			eventParams = eventParams.concat(addParameters);
		}
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * 賃貸_物件一覧：お気に入りボタンイベント用ビーコン処理 賃貸物件一覧において、お気に入りボタンをタップした際に指定したキーと値の後ろに、
	 * 選択された物件の物件コード、KISSコードとページIDの各構成要素、カスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 * @param array bcList 送信するBC/PJコード
	 * @param array kissCdList 送信するKISSコード
	 * @param {[key: string, value: string][]} [optionalParamTuples] 追加で付与するパラメータのTupleの配列
	 */
	window.sendEventBeaconForBukkenListMylistOfChintai = function (sendValue,
		bcList, kissCdList, optionalParamTuples = []) {
		var eventParams = [];

		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);

		// 物件コードをパラメータに付加
		for (var i = 0; i < bcList.length; i++) {
			eventParams.push(['bc', bcList[i]]);
		}
		// KISSコードをパラメータに付加
		for (var i = 0; i < kissCdList.length; i++) {
			eventParams.push(['kiss', kissCdList[i]]);
		}
		// その他オプショナルパラメータを付加
		optionalParamTuples.forEach(tuple => {
			eventParams.push(tuple);
		});
		// ページIDの各構成要素をパラメータに付加
		var pageIdElementList = getPageIdElementList();
		eventParams = eventParams.concat(pageIdElementList);
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventBeaconForAbtest(eventParams);
	};

	/**
	 * WkWkTrackerが生成されるのを待ってビーコンEvent送信を行う
	 *
	 * @param array eventParams イベントパラメータ
	 * @param int delayTime  インターバル時間(ミリ秒)
	 * @param int execCountValue  実行回数
	 */
	window.sendEventBeaconOnTrackerCreated = function (eventParams, delayTime, execCountValue) {
		var delay = delayTime || 100;
		var execCount = execCountValue || 100;

		var count = 0;
		var loadFlag = false;
		// 指定したミリ秒間隔で送信処理実行
		var execProc = setInterval(function () {
			if (typeof WkWkTracker !== 'undefined' && !loadFlag) {
				loadFlag = true;
				sendEventForBeacon(eventParams);
			}
			count++;
			// 一度送信済みあるいは実行回数に到達したら停止
			if (loadFlag || count >= execCount) {
				clearInterval(execProc);
			}
		}, delay);
	};

	/**
	 * 売買_物件一覧：お気に入りボタンイベント用ビーコン処理 売買物件一覧において、お気に入りボタンをタップした際に指定されたキーと値の後ろに、
	 * 選択された物件のプロジェクトコードとカスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 * @param array ncCdList 送信するPJコード
	 * @param array bcList 送信するBCコード
	 * @param array krSnetId 送信するS-net売買ログインID
	 */
	window.sendEventBeaconForBukkenListMylistOfBaibai = function (sendValue,
		ncCdList, bcList, krSnetId) {
		var eventParams = [];
		var bukkenCdList = [];
		var krSnetIdList = [];

		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);

		// プロジェクトコードをパラメータに付加
		for (var i = 0; i < ncCdList.length; i++) {
			eventParams.push(['nc', ncCdList[i]]);
			if (typeof bcList !== 'undefined' &&
				typeof krSnetId !== 'undefined' &&
				typeof bcList[i] === 'string' &&
				typeof krSnetId[i] === 'string') {
				bukkenCdList.push(['bc', bcList[i]]);
				krSnetIdList.push(['krsnetid', krSnetId[i]]);
			}
		}
		eventParams = eventParams.concat(bukkenCdList, krSnetIdList);
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * KR_物件一覧：お気に入りボタンイベント用ビーコン処理 売買物件一覧において、お気に入りボタンをタップした際に指定されたキーと値の後ろに、
	 * 選択された物件のプロジェクトコードとカスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 * @param array ncCdList 送信するPJコード
	 * @param array bcList 送信するBCコード
	 * @param array krSnetId 送信するS-net売買ログインID
	 * @param array addParameters 追加パラメーター
	 */
	window.sendEventBeaconForBukkenListMylistOfKR = function (sendValue,
		ncCdList, bcList, krSnetId, addParameters) {
		var eventParams = [];
		var bukkenCdList = [];
		var krSnetIdList = [];

		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);

		// プロジェクトコードをパラメータに付加
		for (var i = 0; i < ncCdList.length; i++) {
			eventParams.push(['nc', ncCdList[i]]);
			if (typeof bcList !== 'undefined' &&
				typeof krSnetId !== 'undefined' &&
				typeof bcList[i] === 'string' &&
				typeof krSnetId[i] === 'string') {
				bukkenCdList.push(['bc', bcList[i]]);
				krSnetIdList.push(['krsnetid', krSnetId[i]]);
			}
		}
		eventParams = eventParams.concat(bukkenCdList, krSnetIdList);
		// 追加パラメーターを付加
		if (addParameters) {
			eventParams = eventParams.concat(addParameters);
		}
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * MS_物件一覧：お気に入りボタンイベント用ビーコン処理 売買物件一覧において、お気に入りボタンをタップした際に指定されたキーと値の後ろに、
	 * 選択された物件のプロジェクトコードとカスタマー動向基盤用パラメータをそれぞれ付加してビーコンEvent送信を行う
	 *
	 * @param string sendValue 送信する値
	 * @param array ncCdList 送信するPJコード
	 * @param array bcList 送信するBCコード
	 * @param array krSnetId 送信するS-net売買ログインID
	 * @param array addParameters 追加パラメーター
	 */
	window.sendEventBeaconForBukkenListMylistOfMS = function (sendValue,
		ncCdList, bcList, krSnetId, addParameters) {
		var eventParams = [];
		var bukkenCdList = [];
		var krSnetIdList = [];

		// 指定したキーと値をパラメータに付加
		eventParams.push(['eventName', sendValue]);

		// プロジェクトコードをパラメータに付加
		for (var i = 0; i < ncCdList.length; i++) {
			eventParams.push(['nc', ncCdList[i]]);
			if (typeof bcList !== 'undefined' &&
				typeof krSnetId !== 'undefined' &&
				typeof bcList[i] === 'string' &&
				typeof krSnetId[i] === 'string') {
				bukkenCdList.push(['bc', bcList[i]]);
				krSnetIdList.push(['krsnetid', krSnetId[i]]);
			}
		}
		eventParams = eventParams.concat(bukkenCdList, krSnetIdList);
		// 追加パラメーターを付加
		if (addParameters) {
			eventParams = eventParams.concat(addParameters);
		}
		// カスタマー動向基盤用パラメータを付加
		if (customerTrendsParamsForMylist !== '') {
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForMylist);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * 物件一覧：検索条件保存ボタンイベント用ビーコン処理 検索条件保存ボタンをタップした際に指定されているキーと値の後ろに、 カスタマー動向基盤用パラメータを付加してビーコンEvent送信を行う
	 */
	window.sendEventBeaconForBukkenListSaveJoken = function () {
		var eventParams = [];
		// 指定されているキーと値をパラメータに付加
		eventParams.push(['eventName', 'save_search']);

		if (customerTrendsParamsForSaveJoken !== '') {
			// カスタマー動向基盤用パラメータを付加
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForSaveJoken);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * 物件一覧：検索条件保存ボタンイベント用ビーコン処理 検索条件保存ボタンをタップした際に指定されているキーと値の後ろに、 カスタマー動向基盤用パラメータを付加してビーコンEvent送信を行う
	 */
	window.sendEventBeaconForBukkenListSaveJokenOfMS = function (addParameters) {
		var eventParams = [];
		// 指定されているキーと値をパラメータに付加
		eventParams.push(['eventName', 'save_search']);

		if (customerTrendsParamsForSaveJoken !== '') {
			// カスタマー動向基盤用パラメータを付加
			var customerTrendsParams = getCustomerTrendsParams(customerTrendsParamsForSaveJoken);
			eventParams = eventParams.concat(customerTrendsParams);
		}
		// 追加パラメーターを付加
		if (addParameters) {
			eventParams = eventParams.concat(addParameters);
		}
		// ビーコンパラメータ送信
		sendEventForBeacon(eventParams);
	};

	/**
	 * ページIDの各構成要素を持つ配列を返す
	 */
	window.getPageIdElementList = function () {
		var pageIdElementList = [];
		pageIdElementList.push([SC, pageId.substr(0, 1)]);
		pageIdElementList.push([BS, pageId.substr(1, 1)]);
		pageIdElementList.push([AR, pageId.substr(2, 1)]);
		pageIdElementList.push([LV, pageId.substr(3, 1)]);
		pageIdElementList.push([TA, pageId.substr(4, 2)]);
		pageIdElementList.push([SEQ, pageId.substr(6, 2)]);

		return pageIdElementList;
	};

	/**
	 * カスタマー動向基盤用パラメータ配列を返す
	 *
	 * @param array params カスタマー動向基盤用パラメータ
	 * @return array イベント送信用パラメータ
	 */
	var getCustomerTrendsParams = function (params) {
		var customerTrendsParams = [];
		for (var paramKey in params) {
			if (Array.isArray(params[paramKey]) === true) {
				for (var index in params[paramKey]) {
					customerTrendsParams.push([paramKey,
						params[paramKey][index]]);
				}
			} else {
				customerTrendsParams.push([paramKey, params[paramKey]]);
			}
		}

		return customerTrendsParams;
	};
})();

/**
 * 下記形式の連想配列から、イベント送信用のパラメータを生成する
 * array(
 *  array("key1" => "value1", "key2" => "value2"),
 *  array("key1" => "value1", "key2" =>"value2"),...
 * );
 *
 * @param array $params 送信値（連想配列）
 * @param bool $isTPV 送信タイミングの種類がTPVであるか
 * @return array イベント送信用パラメータ
 */
function getParamsForArrayInfo ($params, $isTPV) {
	var $resultList = [];
	var $pageviewArray = JSON.parse($params);
	for (var $firstKey in $pageviewArray) {
		var $pageviewInfo = $pageviewArray[$firstKey];
		for ($sendKey in $pageviewInfo) {
			if ($isTPV) {
				$resultList.push(['PARAMETER', $sendKey, $pageviewInfo[$sendKey]]);
			} else {
				$resultList.push([$sendKey, $pageviewInfo[$sendKey]]);
			}
		}
	}

	return $resultList;
}
