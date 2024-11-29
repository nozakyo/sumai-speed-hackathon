/**
 * お気に入りに関する処理。
 */
var Mylist = (function () {
	var MYLIST_KEY = 'smp.bukken.mylist';
	var httpsApiUrl = '/sp/api/';
	/**
	 * APIにお気に入り登録だけを行う API(ログイン時に利用)
	 *
	 * @param saveData お気に入りに登録したい物件データ
	 * @param done 成功時コールバック関数
	 * @param fail 失敗時コールバック関数
	 * @returns なし
	 */
	var addAPI = function (saveData, done, fail) {
		saveData = saveData || {};
		var api = new FW.API();
		var conditions = new FW.API.Conditions();
		api.setURL(httpsApiUrl);
		// ↓jsから使用するDaoとサービスの指定
		conditions.setParam('service', 'MemberService');
		conditions.setParam('dao', 'SMPRegisterBukkenAPIDaoImpl');
		conditions.setParam('format', 'jsonp');
		// ↑jsから使用するDaoとサービスの指定
		conditions.setParam('callback', '?');
		conditions.setParam('keiSiteKbn', window.siteKbnCd);
		conditions.setParam('areaCd', saveData['areaCd']);
		conditions.setParam('serviceShuCd', saveData['shubetsu']);
		conditions.setParam('prjBknCd[]', saveData['prjBknCdList']);
		api.setConditions(conditions);
		api.start(done, fail);
	};

	/**
	 * お気に入りを削除 API(ログイン時に利用)
	 *
	 * @param seqNo
	 * @param done API成功時処理 削除した件数が返ってくる function(res)
	 * @param fail API失敗時処理 function(res, opt)
	 */
	function removeAPI (seqNo, done, fail) {
		var api = new FW.API();
		var conditions = new FW.API.Conditions();
		conditions.setParam('service', 'MemberService');
		conditions.setParam('dao', 'SMPDeleteBukkenAPIDaoImpl');
		conditions.setParam('format', 'jsonp');
		conditions.setParam('seqNo', seqNo);
		conditions.setParam('callback', '?');
		api.setConditions(conditions);
		api.setURL(httpsApiUrl);
		api.start(done, fail);
	}

	/**
	 * お気に入りをAPIから取得する(ログイン時に利用)
	 *
	 * @param done API成功時処理 削除した件数が返ってくる function(res)
	 * @param fail API失敗時処理 function(res, opt)
	 */
	function loadAPI (done, fail) {
		loadAPIFav(done, fail);
	}

	/**
	 * お気に入りをローカルストレージに追加
	 *
	 * @param saveDataList 物件コード
	 * @param done 成功時処理
	 * @param fail 失敗時処理
	 */
	function addLocalStorage (saveDataList, done, fail) {
		var MYLIST_KEY = window.MYLIST_KEY;
		var localStorageList = (window.localStorageUtil.get(MYLIST_KEY) !== null) ? window.localStorageUtil.get(MYLIST_KEY) : [];
		var newDataArray = window.removeDuplication(saveDataList, localStorageList);
		var status = window.getStatusAddMylist(newDataArray);
		if (status >= 0) {
			var setResult = window.localStorageUtil.set(MYLIST_KEY, newDataArray);
			if (!setResult) {
				if (typeof fail === 'function') fail(status, setResult);
			} else {
				if (typeof done === 'function') done(status);
			}
		} else {
			if (typeof fail === 'function') fail(status, true);
		}
	}

	/**
	 * お気に入りをローカルストレージから削除
	 *
	 * @param bukkenCd 物件コード
	 */
	function removeLocalStorage (bukkenCd) {
		var localStorageList = window.localStorageUtil.get(MYLIST_KEY);
		var deleteIndexAry = [];
		var i = 0;
		for (len = localStorageList.length; i < len; i++) {
			if (String(bukkenCd) === localStorageList[i].item.project_cd ||
				String(bukkenCd) === localStorageList[i].item.bukken_cd) {
				deleteIndexAry.unshift(i);
				break;
			}
		}
		window.localStorageUtil.del(MYLIST_KEY, deleteIndexAry);
	}

	/**
	 * お気に入りを、ローカルストレージから取得（非ログイン)
	 *
	 * @param done 物件リスト配列を引数に取るコールバック function(localStorageList){}
	 */
	function loadLocalStorage (done) {
		var localStorageList = localStorageUtil.get(MYLIST_KEY) || [];
		done(localStorageList);
	}

	/**
	 * お気に入りを削除 API(ログイン時に利用)
	 *
	 * @param seqNo
	 * @param done API成功時処理 削除した件数が返ってくる function(res)
	 * @param fail API失敗時処理 function(res, opt)
	 */
	function removeAPIFav (seqNo, done, fail) {
		var api = new FW.API();
		var conditions = new FW.API.Conditions();
		conditions.setParam('service', 'MemberService');
		conditions.setParam('dao', 'SMPDeleteBukkenAPIDaoImpl');
		conditions.setParam('format', 'jsonp');
		conditions.setParam('seqNo', seqNo);
		conditions.setParam('callback', '?');
		api.setConditions(conditions);

		api.setURL('/sp/api/');
		api.start(function (res) {
			// 画面上のお気に入り情報を更新
			updateFavoriteInfo(true);

			if (typeof done === 'function') {
				done(res);
			}
		}, fail);
	}

	/**
	 * お気に入りをAPIから取得する(ログイン時に利用)
	 *
	 * @param done API成功時処理
	 * @param fail API失敗時処理
	 */
	function loadAPIFav (done, fail) {
		if (!fail) {
			fail = function () {
			};
		}
		var api = new FW.API();
		var conditions = new FW.API.Conditions();
		conditions.setParam('service', 'MemberService');
		conditions.setParam('dao', 'SMPGetBukkenAPIDaoImpl');
		conditions.setParam('format', 'jsonp');
		conditions.setParam('callback', '?');
		api.setConditions(conditions);
		api.setURL('/sp/api/');
		api.start(done, fail);
	}

	/**
	 * お気に入りをローカルストレージから削除
	 *
	 * @param bukkenCd 物件コード
	 */
	function removeLocalStorageFav (bukkenCd) {
		var localStorageList = localStorageUtil.get(MYLIST_KEY);
		var deleteIndexAry = [];
		var i = 0;
		for (len = localStorageList.length; i < len; i++) {
			if (String(bukkenCd) === localStorageList[i].item.project_cd ||
				String(bukkenCd) === localStorageList[i].item.bukken_cd) {
				deleteIndexAry.unshift(i);
				break;
			}
		}
		localStorageUtil.del(MYLIST_KEY, deleteIndexAry);

		// 画面上のお気に入り情報を更新
		updateFavoriteInfo();
	}

	/**
	 * お気に入りを、ローカルストレージから取得（非ログイン)
	 *
	 * @param done 物件リスト配列を引数に取るコールバック function(localStorageList){}
	 */
	function loadLocalStorageFav (done) {
		if (localStorageUtil.get(MYLIST_KEY) !== null) {
			var localStorageList = localStorageUtil.get(MYLIST_KEY);
			if (localStorageList.length > 0) {
				done(localStorageList);
			}
		}
	}

	// exports
	function exports () {
		this.removeAPIFav = removeAPIFav;
		this.loadAPIFav = loadAPIFav;
		this.removeLocalStorageFav = removeLocalStorageFav;
		this.loadLocalStorageFav = loadLocalStorageFav;

		this.addAPI = addAPI;
		this.removeAPI = removeAPI;
		this.loadAPI = loadAPI;
		this.addLocalStorage = addLocalStorage;
		this.removeLocalStorage = removeLocalStorage;
		this.loadLocalStorage = loadLocalStorage;
	}
	return new exports();
})();
