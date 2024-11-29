/**
 * お気に入りに追加する 最大保持件数を超えた場合、古い履歴を削除して新しい履歴を追加する 同一物件の場合、古い履歴を削除して新しい履歴を追加する
 */
var MYLIST_KEY;

// API URL
var httpsApiUrl = '/sp/api/';

var addMylist = function (saveData, type, done, fail) {
	var saveDataArray;
	if (S.isArray(saveData)) {
		saveDataArray = saveData;
	} else {
		saveDataArray = [saveData];
	}
	if (S.isLogin) {
		addMylistForApi(saveDataArray, true, type, done, fail);
	} else {
		addMylistForLocal(MYLIST_KEY, saveDataArray, type, done, fail);
	}
};

/**
 * お気に入りを表示する
 */
var startCnt = 0;
var $rirekiList;
var showMylist = function () {
	$rirekiList = S('#bukkenListAll');
	var cnt = 0;
	var show = S('#pCnt').val() ? parseInt(S('#pCnt').val()) : 150; // 2rd→3rdでマージが実施され、SUUMO/ブライダル/学生版で最大150件となる可能性があるため
	var ret = requestAPI(MYLIST_KEY, cnt, show);
};

/**
 * 10件毎にできてしまう隙間を削除するメソッド
 */
var spaceKiller = function () {
	var a = S(document).find('.listView.bukkenList.solid').length;
	for (i = 1; i < a; i++) {
		S(document).find('.listView.bukkenList.solid')[i].style.marginTop = '0';
	}
};

/**
 * お気に入りに登録のステータスを返すメソッド
 *
 * @param localStorageList ローカルストレージに登録されている物件データ配列
 * @param saveDataArray お気に入りに登録したい物件データ配列
 * @returns ステータス(1なら登録可能)
 */
var getStatusAddMylist = function (localStorageList, saveDataArray) {
	if (localStorageList.length > 50) {
		return -101;
	} else {
		return 1;
	}
};

// インジケータ無、ポップアップ有
var DISPLAY_NOT_DISP_INDICATOR = 'notDispIndicator';
// インジケータ無、ポップアップ無
var DISPLAY_POPUP_TYPE_NOT_DISP_SUCCESS = 'notDispSuccess';

/**
 * お気に入り登録を行うときの結果をアラートで表示するメソッド
 *
 * @param status 登録結果ステータス
 * @param count 登録件数
 * @param type ダイアログの動作の種類
 * @returns なし
 */
var displayResultAddMylist = function (status, count, type) {
	if (status === 1) {
		switch (type) {
			// 登録完了時にダイアログを表示しない
			case DISPLAY_POPUP_TYPE_NOT_DISP_SUCCESS:
				break;
				// 通常時のダイアログ表示
			default:
				if (count > 0) {
					PopupWindow.get().openWindow('#js-addMylistMSG');
				} else {
					PopupWindow.get().openWindow('#js-alreadyMylistMSG');
				}
				break;
		}
	} else if (status === -101) {
		PopupWindow.get().openWindow('#js-overMylistMSG');
	} else if (status === -201) {
		alertBySystemError();
	} else if (status === -408) {
		alertByServerError();
	} else if (status === -99999) {
		PopupWindow.get().openWindow('#js-sysErrorMylistMSG');
	}
};

/**
 * APIにお気に入り登録を行うメソッド
 *
 * @param saveData お気に入りに登録したい物件データ配列
 * @param isSetProjectCd プロジェクトコード付与処理を実行するか判定
 * @param type ダイアログの動作の種類
 * @param done 成功時コールバック関数
 * @param fail 失敗時コールバック関数
 * @returns なし
 */
var addMylistForApi = function (saveData, isSetProjectCd, type, done, fail) {
	addDataMap = {};
	// 物件一覧の場合はareaCd、shubetsuが1種類でないので分けた配列を作成
	for (var i = 0; i < saveData.length; i++) {
		var areaCd = saveData[i]['item']['areaCd'];
		var shubetsu = saveData[i]['item']['shubetsu'];

		addDataMap[areaCd] = addDataMap[areaCd] ? addDataMap[areaCd] : {};
		// (賃貸)物件コード、(売買)プロジェクトコードのみを配列に入れる
		addDataMap[areaCd][shubetsu] = addDataMap[areaCd][shubetsu]
			? addDataMap[areaCd][shubetsu] : [];
		if (shubetsu === '040') {
			addDataMap[areaCd][shubetsu].push(saveData[i]['item']['bukken_cd']);
		} else {
			addDataMap[areaCd][shubetsu]
				.push(saveData[i]['item']['project_cd']);
		}
	}

	// ダイアログの動作の種類が下記定数でない場合、インジケータを表示する
	if (type != DISPLAY_POPUP_TYPE_NOT_DISP_SUCCESS &&
        type != DISPLAY_NOT_DISP_INDICATOR) {
		S.showLoader();
	}

	// お気に入り登録APIがareaCdとshubetsuは複数パラメータを受け付けないので一つずつリクエストをだす
	var apiList = [];
	for (var areaCd in addDataMap) {
		for (var shubetsu in addDataMap[areaCd]) {
			var api = new FW.API();
			var conditions = new FW.API.Conditions();
			api.setURL(httpsApiUrl);
			// ↓jsから使用するDaoとサービスの指定
			conditions.setParam('service', 'MemberService');
			conditions.setParam('dao', 'SMPRegisterBukkenAPIDaoImpl');
			conditions.setParam('format', 'jsonp');
			// ↑jsから使用するDaoとサービスの指定
			conditions.setParam('callback', '?');
			conditions.setParam('keiSiteKbn', siteKbnCd);
			conditions.setParam('areaCd', areaCd);
			conditions.setParam('serviceShuCd', shubetsu);
			conditions.setParam('prjBknCd[]', addDataMap[areaCd][shubetsu]);
			api.setConditions(conditions);
			apiList.push(api);
		}
	}
	totalCount = 0;
	var api = apiList.pop();

	function startApi (api, totalCount) {
		api
			.start(
				function (res) {
					if (res.result < 0) {
						displayResultAddMylist(res.result, totalCount, type);
						S.hideLoader();

						// お気に入り登録処理失敗時の処理
						if (typeof fail === 'function') {
							fail(res);
						}
					} else {
						totalCount += res.result;
						if (apiList.length <= 0) {
							if (isSetProjectCd) {
								displayResultAddMylist(1, totalCount, type);
								api._conditions._params
									.forEach(function (paramInfo) {
										if (paramInfo[0] === 'prjBknCd[]') {
											paramInfo[1]
												.forEach(function (bukkenCd) {
													var star = S('a.icnFavorite[data-bukken-cd="' +
                                                        bukkenCd + '"]');
													if (star
														.hasClass('isRegisted') === false) {
														star
															.addClass('isRegisted');
														// 詳細画面のお気に入りボタン文言変更
														if (typeof changeRegistedFavoriteBtn === 'function') {
															changeRegistedFavoriteBtn();
														}
													}

													if (shubetsu === '010' ||
                                                        shubetsu === '011' ||
                                                        shubetsu === '020' ||
                                                        shubetsu === '021' ||
                                                        shubetsu === '030' ||
                                                        shubetsu === '040') {
														star.attr('data-seqNo',
															res.seqNo[0]);
													}

													// 棟名寄せ画面対応
													var $favoritePict = S('.js-juko-cassette-list[data-bukken-cd="' + bukkenCd + '"] .taglabel--favorite');
													if ($favoritePict.length > 0 &&
                                                        $favoritePict
                                                        	.css('visibility') === 'hidden') {
														$favoritePict.css(
															'visibility',
															'visible');
													}
												});
										}
									});
								S.hideLoader();
							}

							if (typeof done === 'function') {
								done(res);
							}

							// 画面上のお気に入り情報を更新
							updateFavoriteInfo(true);
						} else {
							var next = apiList.pop();
							startApi(next, totalCount);
						}
					}
				},
				function (res, opt) {
					displayResultAddMylist(opt.state);
					S.hideLoader();
				});
	}
	startApi(api, totalCount);
};

var removeDuplication = function (saveDataArray, localStorageList) {
	var getDuplicateIdx = function (target, localStorageList) {
		var i = 0;
		var len = 0;
		for (len = localStorageList.length; i < len; i++) {
			if (localStorageList[i]['item']['shubetsu'] === target['item']['shubetsu']) {
				if (target['item']['shubetsu'] === '040') {
					if (localStorageList[i]['item']['bukken_cd']
						.indexOf(target['item']['bukken_cd']) != -1) { return i; }
				} else {
					if (localStorageList[i]['item']['project_cd']
						.indexOf(target['item']['project_cd']) != -1) { return i; }
				}
			}
		}

		if (localStorageList.length <= i && i < MAX) {
			// 重複検索条件がなく、登録検索条件のMAX50件に達していない場合は、-1を返す
			return -1;
		} else if (i >= MAX) {
			// 重複検索条件がなく、登録検索条件がMAXを超えていた場合は、-1を返す
			return -1;
		} else {
			// それ以外であれば、新規登録が可能なので、配列の長さ-1のindex値を返す
			return len - 1;
		}
	};
	var newDataArray = [];
	for (var i = 0; i < saveDataArray.length; i++) {
		if (getDuplicateIdx(saveDataArray[i], localStorageList) === -1) {
			saveDataArray[i]['date'] = getOnedayString(1, 3);
			saveDataArray[i]['ssite'] = getSsite();
			newDataArray.push(saveDataArray[i]);
		}
	}
	return newDataArray.concat(localStorageList);
};

var addMylistForLocal = function (MYLIST_KEY, saveDataArray, type, done, fail) {
	var localStorageList = (localStorageUtil.get(MYLIST_KEY) !== null)
		? localStorageUtil.get(MYLIST_KEY) : [];
	var newDataArray = removeDuplication(saveDataArray, localStorageList);
	var status = getStatusAddMylist(newDataArray);
	if (status >= 0) {
		var setResult = localStorageUtil.set(MYLIST_KEY, newDataArray);
		if (!setResult) {
			PopupWindow.get().openWindow('#js-localStorageExceptionMSG');

			if (typeof fail === 'function') {
				fail();
			}
			return;
		} else {
			if (typeof done === 'function') {
				done();
			}
		}
	} else {
		if (typeof fail === 'function') {
			fail();
		}
	}
	var count = newDataArray.length - localStorageList.length;
	if (status === 1) {
		saveDataArray.forEach(function (saveData) {
			if (typeof saveData.item.bukken_cd !== 'undefined') {
				var star = S('a.icnFavorite[data-bukken-cd="' +
                    saveData.item.bukken_cd + '"]');
				var $favoritePict = S('.js-juko-cassette-list[data-bukken-cd="' + saveData.item.bukken_cd + '"] .taglabel--favorite');
			} else {
				var star = S('a.icnFavorite[data-bukken-cd="' +
                    saveData.item.project_cd + '"]');
			}
			if (star.hasClass('isRegisted') === false) {
				star.addClass('isRegisted');
				// 詳細画面のお気に入りボタン文言変更
				if (typeof changeRegistedFavoriteBtn === 'function') {
					changeRegistedFavoriteBtn();
				}
			}

			// 棟名寄せ画面対応
			if ($favoritePict && $favoritePict.length > 0 &&
                $favoritePict.css('visibility') === 'hidden') {
				$favoritePict.css('visibility', 'visible');
			}
		});

		// 画面上のお気に入り情報を更新
		updateFavoriteInfo(true);
	}
	displayResultAddMylist(status, count, type);
};

// 価格更新メール用
(function () {
	/**
     * 価格更新メール状態変更時のエラーアラートで表示するメソッド
     *
     * @param status 登録結果ステータス
     */
	var displayErrorChangeBukkenKoshinMailAPI = function (status) {
		if (status === -201) {
			alertBySystemError();
		} else if (status === -408) {
			alertByServerError();
		} else if (status === -99999) {
			alert('システムエラーにより、登録に失敗しました。');
		} else {
			alertBySystemError();
		}
	};

	/**
     * 価格更新メールの状態を変更する
     *
     * @param string seqNo シーケンス番号
     * @param string updMailFlg 更新メール登録フラグ（0:未登録、1:登録）
     * @param function successCallback 成功時コールバック関数
     */
	window.changeBukkenKoshinMailAPI = function (seqNo, updMailFlg,
		successCallback) {
		// お気に入りの処理が成功した場合のみ、価格更新メールへ登録する
		var api = new FW.API();
		api.setURL(httpsApiUrl);

		var conditions = new FW.API.Conditions();
		// ↓jsから使用するDaoとサービスの指定
		conditions.setParam('service', 'MemberService');
		conditions.setParam('dao', 'SMPChangeBukkenKoshinMailAPIDaoImpl');
		conditions.setParam('format', 'jsonp');
		// ↑jsから使用するDaoとサービスの指定
		conditions.setParam('callback', '?');
		conditions.setParam('seqNo', seqNo);
		conditions.setParam('updMailFlg', updMailFlg);
		api.setConditions(conditions);

		api.start(function (res) {
			if (res.result < 0) {
				displayErrorChangeBukkenKoshinMailAPI(res.result);
				S.hideLoader();
			} else {
				successCallback(res);
			}
		}, function (res, opt) {
			displayErrorChangeBukkenKoshinMailAPI(opt.state);
			S.hideLoader();
		});
	};

	/**
     * 価格更新メールを登録する
     * ※価格更新メールに登録する前に、お気に入り登録する必要があるため、本処理内でお気に入り登録も実施される
     *
     * @param {Object|Array} saveData お気に入りに登録したい物件データ配列
     * @param {Object} options {
     *     'addMylistDone': {function},
     *     'registBukkenKoshinMailDone': {function},
     * }
     */
	window.registBukkenKoshinMail = function (saveData, options) {
		if (S.isArray(saveData)) {
			saveDataArray = saveData;
		} else {
			saveDataArray = [saveData];
		}

		// お気に入りへ登録
		addMylistForApi(saveDataArray, false, DISPLAY_POPUP_TYPE_NOT_DISP_SUCCESS, function (res) {
			// 価格更新メールを登録する
			var seqNo = res.seqNo[0];
			changeBukkenKoshinMailAPI(seqNo, '1', function (res) {
				if (typeof options.registBukkenKoshinMailDone === 'function') {
					options.registBukkenKoshinMailDone(res.result);
				}
			});

			// addMylistDone（コールバック）が設定されている場合、seqNoを引数に渡してコールする
			if (typeof options.addMylistDone === 'function') {
				options.addMylistDone(seqNo);
			}
		});
	};
})();

/**
 * お気に入りの星を登録済み状態にする
 *
 * @param object elem 一覧画面のテンプレート
 * @param boolean isShowIndicator falseを指定するとインジケータを表示しない
 */
var changeStarStateRegistered = function (elem, isShowIndicator) {
	if (S.isLogin) {
		changeStorageStarStateRegisteredForApi(elem, isShowIndicator);
	} else {
		changeStorageStarStateRegisteredForLocalStorage(elem);
	}
};

/**
 * お気に入りの星を登録済み状態にする（ログイン時）
 *
 * @param object elem 一覧画面のテンプレート
 * @param boolean isShowIndicator falseを指定するとインジケータを表示しない
 */
var changeStorageStarStateRegisteredForApi = function (elem, isShowIndicator) {
	// isShowIndicatorが指定されていない、またはtrueの場合のみインジケータを表示する
	if (typeof isShowIndicator === 'undefined' || isShowIndicator) {
		S.showLoader();
	}
	var apiList = [];

	var api = new FW.API();
	var conditions = new FW.API.Conditions();
	api.setURL(httpsApiUrl);
	// ↓jsから使用するDaoとサービスの指定
	conditions.setParam('service', 'MemberService');
	conditions.setParam('dao', 'SMPGetBukkenAPIDaoImpl');
	conditions.setParam('format', 'jsonp');
	conditions.setParam('callback', '?');
	// ↑jsから使用するDaoとサービスの指定
	api.setConditions(conditions);

	api
		.start(
			function (res) {
				if (typeof elem.find('.icnFavorite') !== 'undefined') {
					var shubetsu_cds = ['010', '011', '020', '021', '030',
						'040',
					];
					for (var cd_key in shubetsu_cds) {
						var shubetsu_cd = shubetsu_cds[cd_key];
						if (res && res.listData && res.listData[shubetsu_cd] &&
                            res.listData[shubetsu_cd].length > 0) {
							var bukkenList = res.listData[shubetsu_cd];
							for (var key in bukkenList) {
								elem
									.find('.icnFavorite')
									.each(
										function () {
											var bukkenCd = S(this).attr(
												'data-bukken-cd');
											if (bukkenCd === bukkenList[key]['bukken_cd'] ||
                                                bukkenCd === bukkenList[key]['project_cd']) {
												if (S(this).hasClass(
													'isRegisted') === false) {
													S(this).addClass(
														'isRegisted');
													// 詳細画面のお気に入りボタン文言変更
													if (typeof changeRegistedFavoriteBtn === 'function') {
														changeRegistedFavoriteBtn();
													}
												}

												if (shubetsu_cd === '010' ||
                                                    shubetsu_cd === '011' ||
                                                    shubetsu_cd === '020' ||
                                                    shubetsu_cd === '021' ||
                                                    shubetsu_cd === '030' ||
                                                    shubetsu_cd === '040') {
													S(this)
														.attr(
															'data-seqNo',
															bukkenList[key]['seqNo']);
												}
												return false;
											}
										});
							}
						}
					}
				}
				S.hideLoader();
			},
			function (res, opt) {
				S.hideLoader();
			});
};

/**
 * お気に入りボタンを登録済み状態にする（非ログイン時)
 *
 * @param object elem 一覧画面のテンプレート
 */
var changeStorageStarStateRegisteredForLocalStorage = function (elem) {
	var localStorageList = (localStorageUtil.get(MYLIST_KEY) !== null)
		? localStorageUtil.get(MYLIST_KEY) : [];

	for (var key in localStorageList) {
		var icnFavorite = elem.find('.icnFavorite');
		if (typeof icnFavorite !== 'undefined') {
			icnFavorite.each(function () {
				var bukkenCd = S(this).attr('data-bukken-cd');
				if (bukkenCd === localStorageList[key]['item']['bukken_cd'] ||
                    bukkenCd === localStorageList[key]['item']['project_cd']) {
					if (S(this).hasClass('isRegisted') === false) {
						S(this).addClass('isRegisted');
						// 詳細画面のお気に入りボタン文言変更
						if (typeof changeRegistedFavoriteBtn === 'function') {
							changeRegistedFavoriteBtn();
						}
					}
					return false;
				}
			});
		}
	}
};
