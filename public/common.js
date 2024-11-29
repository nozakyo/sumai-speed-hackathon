/**
 * さらに読み込むを非表示にする
 */
// eslint-disable-next-line no-unused-vars
var hideReload = function () {
	S('div.readmore, div.reload').css('display', 'none');
};
// eslint-disable-next-line no-unused-vars
var showReload = function () {
	S('div.readmore, div.reload').css('display', 'block');
};

/**
 * 並べ替えボタンの非表示 common.jsから呼ばれる必要があるためグローバルに定義
 */
// eslint-disable-next-line no-unused-vars
var hideSortBtn = function () {
	S('.iSort').css('display', 'none');
};
/**
 * 並べ替えボタンの表示 common.jsから呼ばれる必要があるためグローバルに定義
 */
// eslint-disable-next-line no-unused-vars
var showSortBtn = function () {
	S('.iSort').css('display', 'block');
};

/**
 * APIのURLを作成する
 */
// eslint-disable-next-line no-unused-vars
var makeAPIUrl = function (baseUrl, param) {
	var url = baseUrl + '?';
	// eslint-disable-next-line one-var
	var ret, buf = [];

	for (var key in param) {
		if (S.isArray(param[key])) {
			for (var i = 0; i < param[key].length; i++) {
				buf.push(key + '=' + encodeURIComponent(param[key][i]));
			}
		} else {
			buf.push(key + '=' + encodeURIComponent(param[key]));
		}
	}
	ret = buf.join('&');
	url += ret;
	return url;
};
// eslint-disable-next-line no-unused-vars
var htmlEscape = (function () {
	var map = {
		'<': '&lt;',
		'>': '&gt;',
		'&': '&amp;',
		"'": '&#39;',
		'"': '&quot;',
		' ': '&nbsp;',
		'　': '&emsp;',
	};
	var replaceStr = function (s) {
		return map[s];
	};
	return function (str) {
		return str.replace(/<|>|&|'|"|\s/g, replaceStr);
	};
})();
// eslint-disable-next-line no-unused-vars
var checkResponse = function (res) {
	if (!res || !res['smatch'] || !res['smatch']['resultset'] ||
		!res['smatch']['resultset']['item'] || res['smatch']['errors']) {
		S.hideLoader();
		alert('申し訳ありません、只今回線が混み合っております。\nしばらくたってからアクセスし直してください。');
		return false;
	}
	return true;
};

/**
 * 更に読み込む
 */
// eslint-disable-next-line no-unused-vars
var sajax = function (apiUrl, reqType, errorCallback) {
	var url = apiUrl + '&FORMAT=2&CALLBACK=?';

	var reqFunc;
	switch (reqType) {
		case 'onSuccess':
			reqFunc = onSuccess;
			break;
		case 'onSuccessMap':
			reqFunc = onSuccessMap;
			break;
		case 'onChintaiSuccess':
			reqFunc = onChintaiSuccess;
			break;
		case 'onBaibaiSuccess':
			reqFunc = onBaibaiSuccess;
			break;
		case 'onSuccessAndRedirect':
			reqFunc = onSuccessAndRedirect;
			break;
	}
	var api = new Api({
		url: url,
		success: function (res) {
			reqFunc(res);
		},
		error: function () {
			if (typeof errorCallback === 'function') {
				errorCallback();
			} else {
				onError();
			}
		},
	});
	api.start();
};

var Api = function (opt) {
	var self = this;
	self._url = opt.url;
	self._success = opt.success;
	self._error = opt.error;
	self._cancelFlg = false;
	self._timeout = 10000;
};

Api.prototype = {
	start: function () {
		var self = this;
		S.ajax({
			dataType: 'jsonp',
			url: self._url,
			success: function (res) {
				if (self._cancelFlg !== true) {
					self._success(res);
				}
			},
			error: function () {
				self._cancelFlg = true;
				self._error();
			},
			timeout: self._timeout,
		});
	},
};

/**
 * チェックボックスの値によるボタンの制御 チェックボックスが1つも選択されていない場合はdisabledにする
 */
// eslint-disable-next-line no-unused-vars
var checkChecked = function (classNm, target) {
	var cnt = S('div').find('.' + classNm + ':checked').length;

	if (cnt > 0) {
		var ass = S('.' + target);
		ass.removeAttr('disabled');
	} else {
		S('.' + target).attr('disabled', true);
	}
};

/**
 * システム日付取得関数 引数：onedayFlg 日付(1:今日、2:昨日、3:一週間前) formatFlg 形式(1:YYYYMMDD形式、2:YYYY/MM/DD形式、3:YYYYMMDDHHmmss)
 */
// eslint-disable-next-line no-unused-vars
var getOnedayString = function (onedayFlg, formatFlg) {
	var sysdate = new Date();
	var Oneday = '';
	var temp;

	// eslint-disable-next-line eqeqeq
	if (onedayFlg == 2) {
		sysdate.setDate(sysdate.getDate() - 1);
	// eslint-disable-next-line eqeqeq
	} else if (onedayFlg == 3) {
		sysdate.setDate(sysdate.getDate() - 7);
	}

	// 年はそのまま 4 桁を取得します。
	Oneday += sysdate.getFullYear();

	// eslint-disable-next-line eqeqeq
	if (formatFlg == 2) {
		Oneday += '/';
	}

	// 月は 2 桁になるように調整します。月は 0 から始まるので +1 を忘れずに。
	// 調整は文字列として頭に "0" を付加して、後ろ 2 文字を切り出します。
	temp = '0' + (sysdate.getMonth() + 1);
	temp = temp.substr(temp.length - 2, temp.length);
	Oneday += temp;

	// eslint-disable-next-line eqeqeq
	if (formatFlg == 2) {
		Oneday += '/';
	}

	// 日も同様に調整します。
	temp = '0' + sysdate.getDate();
	temp = temp.substr(temp.length - 2, temp.length);
	Oneday += temp;

	// 時刻も取得
	// eslint-disable-next-line eqeqeq
	if (formatFlg == 3) {
		temp = '0' + sysdate.getHours();
		temp = temp.substr(temp.length - 2, temp.length);
		Oneday += temp;
		temp = '0' + sysdate.getMinutes();
		temp = temp.substr(temp.length - 2, temp.length);
		Oneday += temp;
		temp = '0' + sysdate.getSeconds();
		temp = temp.substr(temp.length - 2, temp.length);
		Oneday += temp;
	}

	return Oneday;
};

// パラメータ比較用関数
// eslint-disable-next-line no-unused-vars
var equals = function (other) {
	// eslint-disable-next-line one-var
	var i, flg = false, otherType = '', thisType = '', otherCount = 0, thisCount = 0;

	for (i in this) { thisCount++; }
	for (i in other) { otherCount++; }
	if (thisCount !== otherCount) { return false; }

	for (i in this) {
		if (!this.hasOwnProperty(i)) {
			continue;
		}
		otherType = typeof other[i];
		thisType = typeof this[i];

		if (S.isArray(other[i]) && thisType === 'string') {
			if (otherType.length === 1) {
				return otherType[0] === thisType;
			} else {
				return false;
			}
		}
		if (otherType === 'string' && S.isArray(this[i])) {
			if (thisType.length === 1) {
				return thisType[0] === otherType;
			} else {
				return false;
			}
		}

		if (S.isArray(other[i])) {
			flg = compareArray(this[i], other[i]);
		} else if (otherType === 'string' && (other[i].indexOf('&') !== -1)) {
			flg = compareArray((i + '=' + this[i]).split('&'),
				(i + '=' + other[i]).split('&'));
		} else {
			flg = this[i] === other[i];
		}

		if (!flg) { return false; }
	}
	return flg;
};
var compareArray = function (ar1, ar2) {
	var flg = false;

	if (ar1.length !== ar2.length) { return false; }
	ar1.sort();
	ar2.sort();
	for (var i = 0, len = ar1.length; i < len; i++) {
		flg = (ar1[i] === ar2[i]);
		if (!flg) { return false; }
	}
	return flg;
};

/**
 * 現在の表示画面のssiteの番号を返します。
 */
// eslint-disable-next-line no-unused-vars
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
 * 現在の表示画面のssiteに対応する名称を取得。
 *
 * @param ssite
 */
// eslint-disable-next-line no-unused-vars
var ssiteName = function (ssite) {
	switch (ssite) {
		case 2:
			return siteNmInfo['02'];
		case 3:
			return siteNmInfo['03'];
		default:
			return siteNmInfo['01'];
	}
};

// eslint-disable-next-line no-unused-vars
var getSitePath = function (ssite) {
	switch (ssite) {
		case 2:
			return siteKbnUrl['02'];
		case 3:
			return siteKbnUrl['03'];
		default:
			return siteKbnUrl['01'];
	}
};

// eslint-disable-next-line no-unused-vars
var alertBySystemError = function () {
	alert('システムエラーが発生しました。再度ログインを実施してください。');
};

// eslint-disable-next-line no-unused-vars
var alertByServerError = function () {
	alert('サーバとの接続が失敗しました。ネットワーク環境のよい場所で再度操作し直してください。');
};

// eslint-disable-next-line no-unused-vars
var alertByNetworkError = function () {
	alert('申し訳ありません、只今回線が混み合っております。\nしばらくたってからアクセスし直してください。');
};

// eslint-disable-next-line no-unused-vars
var alertByAuthError = function () {
	alert('認証の有効期限が切れました。再度ログインを実施してください。');
};

/**
 * 数値を表示する際、3桁ごとカンマを打つ
 *
 * @param APIから返ってくる件数
 * @return 3桁ごとカンマで区切った件数
 */
// eslint-disable-next-line no-unused-vars
function addCommaForCount (resultSetCount) {
	// eslint-disable-next-line no-new-wrappers
	var hitsCount = new String(resultSetCount).replace(/,/g, '');
	// eslint-disable-next-line eqeqeq
	while (hitsCount != (hitsCount = hitsCount
		.replace(/^(\d+)(\d{3})/, '$1,$2')))
		;
	return hitsCount;
}

/**
 * フォームを作成し、設定された値をsubmitする
 *
 * @param string action データの送信先URL
 * @param string method データの送信形式（get か post）
 * @param array params 送信したいパラメータの連想配列
 * @param string target 送信結果をどのウィンドウで表示するか（_blankなど）
 */
// eslint-disable-next-line no-unused-vars
var formAction = function (action, method, params, target) {
	var formOption = {
		'action': action,
		'method': method,
	};
	if (target) {
		formOption['target'] = target;
	}
	var form = makeHtmlTag('form', formOption);

	for (var key in params) {
		if (S.isArray(params[key])) {
			for (var val in params[key]) {
				form.append(makeHtmlTag('input', {
					type: 'hidden',
					name: key,
					value: params[key][val],
				}));
			}
		} else {
			form.append(makeHtmlTag('input', {
				type: 'hidden',
				name: key,
				value: params[key],
			}));
		}
	}
	S(document.body).append(form);
	form[0].submit();
	form.remove();
};

/* フォームタグを生成する */
var makeHtmlTag = function (tagName, attrs) {
	var tag = S('<' + tagName + '/>');
	for (var key in attrs) {
		tag.attr(key, attrs[key]);
	}
	return tag;
};

// eslint-disable-next-line no-unused-vars
var escapeForRftApi = function (param) {
	var replacedParam = param.replace(/[&]/g, '＆');
	return replacedParam;
};

// eslint-disable-next-line no-unused-vars
var isValidTargetRange = function (dispRect, targetRect) {
	var isValid = false;

	var xDiff = targetRect.x - dispRect.x;
	var yDiff = targetRect.y - dispRect.y;

	if (-targetRect.width < xDiff && xDiff < dispRect.width &&
		-targetRect.height < yDiff && yDiff < dispRect.height) {
		isValid = true;
	}
	return isValid;
};

// eslint-disable-next-line no-unused-vars
var isValidTargetElementRange = function (dispRect, elem) {
	// eslint-disable-next-line no-unused-vars
	var isValid = false;

	var sElem = S(elem);

	var elemOffset = sElem.offset();
	var elemRect = {
		x: elemOffset.left,
		y: elemOffset.top,
		width: parseInt(sElem.css('width').replace(/(px|%)/gi, '')),
		height: parseInt(sElem.css('height').replace(/(px|%)/gi, '')),
	};

	return isValidTargetRange(dispRect, elemRect);
};

// eslint-disable-next-line no-unused-vars
var isValidTargetElementRangeInWindow = function (elem) {
	var windowRect = {
		x: document.documentElement.scrollLeft || document.body.scrollLeft,
		y: document.documentElement.scrollTop || document.body.scrollTop,
		width: window.innerWidth,
		height: window.innerHeight,
	};

	return isValidTargetElementRange(windowRect, elem);
};

// eslint-disable-next-line no-unused-vars
var isValidTargetRangeInWindow = function (targetRect) {
	var windowRect = {
		x: document.documentElement.scrollLeft || document.body.scrollLeft,
		y: document.documentElement.scrollTop || document.body.scrollTop,
		width: window.innerWidth,
		height: window.innerHeight,
	};

	return isValidTargetRange(windowRect, targetRect);
};

/**
 * 数字を千位毎にグループ化してフォーマットする
 *
 * @param n フォーマットする数値。
 * @param d 小数点以下の桁数。
 * @param dP 小数点を表す区切り文字。
 * @param tSep 千位毎の区切り文字。
 */
// eslint-disable-next-line no-unused-vars
function numberFormat (n, d, dP, tSep) {
	if (typeof d === 'undefined') {
		d = 0;
	}
	if (typeof dP === 'undefined') {
		dP = '.';
	}
	if (typeof tSep === 'undefined') {
		tSep = ',';
	}
	var tmp = String(n).split('.');
	var intStr = tmp[0];
	// eslint-disable-next-line eqeqeq
	while (intStr != (intStr = intStr.replace(/^(\d+)(\d{3})/, '$1,$2'))) {
	}
	if (tSep !== ',') {
		// eslint-disable-next-line eqeqeq
		while (intStr != (intStr = intStr.replace(',', tSep))) {
		}
	}

	var dec = '';
	if (tmp[1] && d > 0) {
		dec = tmp[1];
		if (d <= dec.length) {
			dec = dec.substring(0, d);
		} else {
			var sub = d - dec.length;
			var zero = '';
			for (var i = 0; i < sub; i++) {
				zero = zero + '0';
			}
			dec = dec + zero;
		}
		dec = dP + dec;
	}
	return intStr + dec;
}
