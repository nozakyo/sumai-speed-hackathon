// --------------------------------------------------
// 検索履歴に追加する
// --------------------------------------------------
// 最大保持件数を超えた場合、古い履歴を削除して新しい履歴を追加する
// 同一物件の場合、古い履歴を削除して新しい履歴を追加する
var JOKEN_KEY;
var MAX;
// eslint-disable-next-line no-use-before-define
var todofuken = (typeof todofuken !== 'undefined') ? todofuken : [];
// eslint-disable-next-line no-use-before-define
var ryoiki = (typeof ryoiki !== 'undefined') ? ryoiki : [];

/**
 * パラメータ取得
 */
var getParam = function () {
	var param = {};
	var tmpName = '';

	S('.param').each(function () {
		if (S(this).attr('name').slice(-2) === '[]') {
			if (tmpName !== S(this).attr('name')) {
				tmpName = S(this).attr('name');
				if (param[tmpName] === undefined) {
					param[tmpName] = [];
				}
			}
			param[tmpName].push(S(this).val());
		} else {
			param[S(this).attr('name')] = S(this).val();
		}
	});
	return param;
};

/**
 * 市区郡の情報をローカルストレージに保存する
 */
// eslint-disable-next-line no-unused-vars
var saveShikugun = function (kensaku) {
	var kensakuArray = ['shikugun_nm', kensaku];
	var route = 1;
	addJoken(kensakuArray, route);
};

/**
 * 沿線の情報をローカルストレージに保存する
 */
// eslint-disable-next-line no-unused-vars
var saveEnsen = function (kensaku) {
	var kensakuArray = ['ensen_nm', kensaku];
	var route = 2;
	addJoken(kensakuArray, route);
};

/**
 * 駅の情報をローカルストレージに保存する
 */
// eslint-disable-next-line no-unused-vars
var saveEki = function (kensaku) {
	var kensakuArray = ['eki_nm', kensaku];
	var route = 3;
	addJoken(kensakuArray, route);
};

/**
 * フリーワードの情報をローカルストレージに保存する
 */
// eslint-disable-next-line no-unused-vars
var saveFreeword = function (kensaku) {
	var kensakuArray = ['freeword_nm', kensaku];
	var route = 5;
	addJoken(kensakuArray, route);
};

/**
 * ローカルストレージに保存する
 */
var addJoken = function (kensaku, route) {
	var jokenData = getParam();

	// 条件履歴に登録させないパラメータがついた場合、条件を保存させない
	if (S('#savehistory').val() === 'false') {
		return;
	}

	// 検索条件お気に入り登録パラメータを除外する
	delete (jokenData.registJoken);

	// eslint-disable-next-line one-var, no-unused-vars
	var point, obj = {}, index;

	/**
	 * 重複履歴のインデックスを返す
	 *
	 * @param param 物件一覧でAPIに投げるパラメータ
	 * @param rirekiArray localStorageに保存してある履歴配列
	 * @return idx 重複のある履歴インデックス（重複がない場合、50件未満なら-1、50件以上なら一番古い履歴インデックス）
	 */
	var getDuplicateIdx = function (param, rirekiArray) {
		// eslint-disable-next-line one-var
		var i = 0, len = 0;
		// 条件履歴の配列をループにかけ、履歴ごとにURLパラメータ比較を行う。
		for (len = rirekiArray.length; i < len; i++) {
			// 重複履歴がある場合、そのインデックスを返す。
			if (equals.call(param, rirekiArray[i].param)) { return i; }
		}

		// 重複履歴がない場合
		// 履歴件数が、50件未満の場合は-1を
		// それ以上なら配列の長さを返す。
		return len < MAX ? -1 : len - 1;
	};

	var localStorageArray = localStorageUtil.get(JOKEN_KEY) || [];
	idx = getDuplicateIdx(jokenData, localStorageArray);
	if (idx !== -1) {
		localStorageArray.splice(idx, 1);
	}

	// localStorageに保存する履歴配列の先頭に、現在の履歴を追加する。
	obj['route'] = route;
	obj['joken_nm'] = kensaku['1'];
	obj['date'] = getOnedayString(1, 1);
	obj['param'] = jokenData;
	obj['ssite'] = getSsite();
	obj['jiGamenUrl'] = window.location.pathname + filterUrlParams(window.location.search.substring(1));

	// 配列の先頭に要素を追加。
	localStorageArray.unshift(obj);
	// 配列をJSON.stringifyで文字列に変換してからStorage保存
	localStorageUtil.set(JOKEN_KEY, localStorageArray);
};

var $jokenRirekiList;
// eslint-disable-next-line no-unused-vars
var cnt = 0;

/**
 * 遷移先URL作成
 */
// eslint-disable-next-line no-unused-vars
var makeURL = function (data) {
	var buf = [];
	var ryoikiUrl = '';
	// eslint-disable-next-line eqeqeq
	if (data.route == 1 || data.route == 2 || data.route == 3 || data.route == 4 || data.route == 5) {
		ryoikiUrl = ryoiki[data.param.se]['url'];
	} else {
		// 存在しないroute値の場合
		return ryoikiUrl;
	}

	var ret = '/sp' + getSitePath(data['ssite']) + '/' + ryoikiUrl + '/' +
		todofuken[data.param.tf]['url'] + '/';
	if (data.route === 1) {
		if (data.param['sa']) {
			ret += 'sa_' + data.param.sa + '/';
		} else if (data.param['sc[]'] || data.param['sa[]']) {
			ret += 'sc/';
		} else if (data.param['oz']) {
			ret += 'oz_' + data.param.oz + '/';
		} else if (data.param['oz[]']) {
			ret += 'oz/';
		} else {
			ret += 'sc_' + data.param.sc + '/';
		}
	} else if (data.route === 2) {
		if (data.param['s[]']) {
			ret += 'en/';
		} else {
			ret += 'en_' + data.param.s + '/';
		}
	} else if (data.route === 3) {
		if (data.param['e[]']) {
			ret += 'ek/';
		} else {
			ret += 'ek_' + data.param.e + '/';
		}
		// } else if (data.route === 4) {
		// ret += 'bus/ek_' + data.param.e + '/list/';
	} else if (data.route === 5) {
		ret += 'fwbukken/';
	}
	for (var key in data.param) {
		if (key === 'se' || key === 'tf' || key === 'sa' || key === 'sc' ||
			key === 'bparam[]' || key === 'oz' || key === 's' || key === 'e') {
			continue;
		}

		if (S.isArray(data.param[key])) {
			for (var i = 0; i < data.param[key].length; i++) {
				buf.push(encodeURIComponent(S.htmlUnescape(key)) + '=' +
					encodeURIComponent(S.htmlUnescape(data.param[key][i])));
			}
		} else {
			buf.push(encodeURIComponent(S.htmlUnescape(key)) + '=' +
				encodeURIComponent(S.htmlUnescape(data.param[key])));
		}
	}
	/*
	 * 遷移先URLにパラメータを付与する。 検索条件履歴から物件一覧画面に遷移したことを物件一覧画面で判断し、 サイカタにそれに対応したprop20とeVar20を設定する為に、prv=lというパラメータを必ず付与する。
	 */
	ret += '?prv=l';

	// 検索条件履歴
	if (buf.length !== 0) {
		ret += '&' + buf.join('&');
	}

	return ret;
};

/**
 * 情報を取得し始める位置をリセットする
 */
// eslint-disable-next-line no-unused-vars
var reset = function () {
	cnt = 0;
	$jokenRirekiList.empty();
};

/**
 * データを削除するメソッド
 */
// eslint-disable-next-line no-unused-vars
var deleteList = function () {
	var viewList = S('.listView.bukkenList input');

	cnt -= S('.listView.bukkenList input:checked').length;
	var checkList = [];
	for (i = 0; i < viewList.length; i++) {
		if (viewList[i].checked === true) {
			checkList.unshift(i);
		}
	}
	S('.listView.bukkenList input:checked').parent().parent().parent().parent()
		.remove();

	localStorageUtil.del(JOKEN_KEY, checkList);
	var storageData = localStorageUtil.get(JOKEN_KEY) || [];
	$jokenRirekiAcd.empty();
	$jokenRirekiAcd.html('検索条件（' + storageData.length + '件）');
	if (storageData.length === 0) {
		S('div.acdTgl.acdMylist').removeClass('acd_opn').attr('rel', 'none');
		S('p.acdHead.icnArrowDLGC.searchLine').removeClass('icnArrowU')
			.addClass('icnArrowD');
		S('div.secBody.acd').css('display', 'none');
	}
};

// 自画面urlの取得
// urlから条件登録に不要なパラメタを除却する関数
var filterUrlParams = function (params) {
	var filterParams = '';
	if (params.length > 0) {
		var paramList = [];
		if (params.indexOf('&') > -1) {
			paramList = params.split('&');
		} else {
			paramList.push(params);
		}
		/*
			page(ページネーション)、
			vos(vosコード)、
			prv(検索条件履歴or登録検索条件からの遷移フラグ)、
			tourokuFlg(メール配信登録されたか判断するフラグ)、
			registJoken(条件絞り込み画面から遷移した際に検索条件をお気に入りに登録するフラグ)
		*/
		for (var i = 0; i < paramList.length; i++) {
			if (paramList[i].match(/^page=/) ||
					paramList[i].match(/^vos=/) ||
					paramList[i].match(/^prv=/) ||
					paramList[i].match(/^tourokuFlg=/) ||
					paramList[i].match(/^registJoken=/)) {
				continue;
			}
			if (filterParams) {
				filterParams += '&' + paramList[i];
			} else {
				filterParams += '?' + paramList[i];
			}
		}
	}
	return filterParams;
};
