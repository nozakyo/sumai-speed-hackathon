/**
 * 全画面共通JS
 */
// LocalStorageのお気に入り物件のキー
var BUKKENMYLIST_KEY = 'smp.bukken.mylist';

// LocalStorageのお気に入り注文住宅の保存先キー
var CHUMON_KAISHA_MYLIST_KEY = 'chumon.kaisha.mylist';

// LocalStorageのお気に入り注文住宅の保存先キー
var CHUMON_JITSUREI_MYLIST_KEY = 'chumon.jitsurei.mylist';

// LocalStorageのお気に入りリフォームの保存先キー
var REFORM_KAISHA_MYLIST_KEY = 'reform.kaisha.mylist';

// LocalStorageのお気に入りリフォームの保存先キー
var REFORM_JITSUREI_MYLIST_KEY = 'reform.jitsurei.mylist';

// LocalStorageの検索条件の保存先キー
var REGISTJOKEN_KEY = 'smp.registJoken';

// Cookieのお気に入り物件数キー（会員ログイン時）
var FAVORITE_BUKKEN_COUNT_KEY = 'favoriteBukkenCount';

// Cookieのお気に入り検索条件数キー（会員ログイン時）
var SAVED_CONDITION_COUNT_KEY = 'favoriteconditionCount';

// お気に入り件数の表示上の最大値
var MAX_FAVORITE_COUNT = 99;

/**
 * 全国トップ画面へ遷移するリンク 対象：header.tpl、パンくずの一番目、0件ヒット時のトップリンク
 */
var homeLink = function () {
	var expire_date = new Date();
	expire_date.setYear(expire_date.getYear() - 1);
	document.cookie = 'tf=;path=/;expires=' + expire_date.toGMTString();
};

/* 「ページの先頭へ」ボタンの処理（jQuery） */
(function () {
	if (typeof jQuery === 'undefined') {
		return;
	}
	jQuery(function ($) {
		function gotoPagetop () {
			var pageTop = $('#pagetop').position().top;
			// ページトップボタンを押した時、画面の一番上に移動する
			$('html,body').animate({ scrollTop: pageTop }, 25);
		}

		$('a.pagetop').attr('href', 'javascript:void(0)');
		$('a.pagetop').on('click.pageTop', function () {
			gotoPagetop();
		});
	});
})();

/* 「ページの先頭へ」ボタンの処理 */
function clickPageTop () {
	var move = window.scrollY / 25;
	var body = document.body;
	var topPosition = document.getElementById('pagetop').offsetTop;
	var currentPageTop = window.scrollY;

	var gotoPagetop = setInterval(function () {
		currentPageTop = currentPageTop - move;
		window.scrollTo(0, currentPageTop);
		if (currentPageTop <= topPosition) {
			clearInterval(gotoPagetop);
		}
	}, 1);

	return false;
}

/**
 * PC版へ遷移するリンク PC版SUUMOではスマートフォンからアクセスがあった時にスマホ版にリダイレクトさせる機能がある。
 * よってPC版に遷移させるときに単純にPC版に遷移させるだけでは、スマホ版にリダイレクトさせる機能によりスマホ版SUUMOにリダイレクトされてしまう。
 * これを回避するためSUUMO_PC_VIEWを設定し、そのexpire_dateを設定している
 *
 * @param string domain 遷移先のドメイン。このパラメータの中身はcookieに仕込まれます。
 * @param string link 遷移先のリンク。このパラメータで渡されたURLに遷移します。
 * @param string expire 有効期限
 */
var pcView = function (domain, link, expire) {
	var expire_date = new Date();
	expire_date.setTime(expire_date.getTime() + expire);
	document.cookie = 'SUUMO_PC_VIEW=1;path=/;domain=' + domain + ';expires=' +
        expire_date.toGMTString();
	window.open(link);
};

/**
 * 値の有無をチェック phpのisset()に相当
 *
 * @param data 値
 * @return true / false
 */
var isset = function (data) {
	if (data === '' || data === null || data === undefined) {
		return false;
	} else {
		return true;
	}
};

/**
 * 値の有無をチェック phpのempty()に相当
 *
 * @param data 値
 * @return true / false
 */
var empty = function (data) {
	var key;
	if (data === '' || data === 0 || data === '0' || data === null ||
        data === false || data === undefined) { return true; }
	if (typeof data === 'object') {
		for (key in data) {
			return false;
		}
		return true;
	}
	return false;
};

/**
 * phpのremoveHtmlTagに対応している関数
 */
var removeHtmlTag = function (target) {
	var re = /(<([^>]+)>)/gi;
	var res = '';
	for (var i = 0; i < target.length; i++) { res += target[i].replace(re, ''); }
	return res;
};

(function (S) {
	/**
     * サイドメニュー
     */
	S.fn['sideMenu'] = function (opts) {
		var tmp;
		if (this.length != 1) return;
		for (var i = 0; i < this.length; i++) {
			tmp = new sideMenu(this[i], opts);
		}
		return this.length == 1 ? tmp : this;
	};
	var sideMenu = (function () {
		var sideMenu = function (elID, opts) {
			if (this instanceof sideMenu) {
				if (typeof (opts) === 'object') {
					for (j in opts) {
						this[j] = opts[j];
					}
				}
			} else {
				return new sideMenu(elID, opts);
			}
			var that = this;
			var bodyElm;
			this.btnElm = S(elID);
			if (this.btnElm.length != 1) return false;
			// 初期化
			bodyElm = S('body');
			sideMenuOv = S('.js-side-menu-ov');
			sideMenuContent = S('.js-side-menu');
			this.sideMenuContainer = S('#' + this.sideMenuContId);
			// メニュー表示動作
			if (this.btnElm[0].tagName.toUpperCase() == 'A') { this.btnElm.attr('href', 'javascript:void(0);'); }
			this.btnElm.bind('click', function (e) {
				e.preventDefault();
				that.showMyMenu();
				return false;
			});
			sideMenuContent.find('.' + this.sideMenuCloseClass).bind('click',
				function () {
					that.hideMyMenu();
					return false;
				});
			sideMenuOv.bind('click', function () {
				that.hideMyMenu();
				return false;
			});
			// オーバーレイ表示部分を動かさないようにする
			sideMenuOv.on('touchmove', function (event) {
				event.preventDefault();
			});
			// 表示中回転対応
			S(window).bind(
				'resize',
				function () {
					if (sideMenuOv.css('display') === 'none') return false;
					var docHeight = window.innerHeight < that.sideMenuDocHeight
						? that.sideMenuDocHeight : window.innerHeight;
					that.sideMenuContainer.css('height', docHeight + 'px');
					sideMenuOv.css('height', docHeight + 'px');
					sideMenuContent.css('height', docHeight + 'px');
				});
		};
		sideMenu.prototype = {
			btnElm: null,
			sideMenuContId: 'wrapper_viewport',
			sideMenuInit: false,
			sideMenuContainer: null,
			sideMenuOv: null,
			sideMenuContent: null,
			sideMenuCloseClass: 'menuClose',
			sideMenuDocHeight: null,
			showMyMenu: function () {
				// 画面のお気に入り情報を更新
				updateFavoriteInfo();

				// 横メニューアイコンを押さない場合にも横メニューが一瞬表示されてしまうため、
				// 横メニューアイコンをタップした場合のみsideMenuDocHeightを取得させる対応をした
				// 2013/09/25 AW大久保
				if (this.sideMenuDocHeight === null) {
					this.sideMenuDocHeight = sideMenuContent[0].clientHeight;
				}
				var docHeight = window.innerHeight < this.sideMenuDocHeight
					? this.sideMenuDocHeight : window.innerHeight;
				this.sideMenuContainer.css({
					height: docHeight + 'px',
					overflowY: 'hidden',
				});
				S('body').addClass('sideMenuShow');
				sideMenuOv.css('height', docHeight + 'px');
				sideMenuContent.css('height', docHeight + 'px');
			},
			hideMyMenu: function () {
				this.sideMenuContainer.css({
					overflowY: 'visible',
					height: 'auto',
				});
				S('body').addClass('sideMenuHide');
				setTimeout(function () {
					S('body').removeClass('sideMenuHide');
					S('body').removeClass('sideMenuShow');
				}, 100);
			},
		};
		return sideMenu;
	})();
})(S);

// DOMの準備完了後に実行
S(document).ready(function () {
	// 画面上のお気に入り情報を更新
	updateFavoriteInfo();
});

/**
 * パラメータを取得する
 *
 * @return {object}
 */
var getParam = function () {
	var param = {};
	var tmpParam = [];
	var nowName = '';
	var tmpName = '';

	S('.param').each(function () {
		if (S(this).attr('name').slice(-2) === '[]') {
			if (tmpName !== S(this).attr('name')) {
				tmpName = S(this).attr('name');
				if (param[tmpName] === undefined) {
					param[tmpName] = new Array();
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
 * 文字列の先頭に任意の文字を付加し、文字数を調整する
 *
 * @param {string} format 先頭につけたい文字列
 * @param {string} value 調整したい文字列
 * @param {string} length 調整後の文字数
 * @return {string} 編集結果
 */
function formatLeftPaddingString (format, value, length) {
	var result = '';
	if (typeof format !== 'undefined' && format !== null &&
        typeof value !== 'undefined' && value !== null &&
        typeof length !== 'undefined' && length !== null) {
		var beforeValue = format + value;
		result = beforeValue.substring(beforeValue.length - length,
			beforeValue.length);
	}
	return result;
}

/**
 * お気に入り物件・注文住宅・リフォームの件数を取得する
 *
 * @return {number} 件数
 */
var getFavoriteCountForGuest = function () {
	// お気に入り物件数カウント
	var myListCount = 0;

	// ローカルストレージのお気に入り登録数を取得
	var getMyList = localStorage.getItem(BUKKENMYLIST_KEY);
	var localStorageMyList = '';
	if (getMyList) {
		localStorageMyList = JSON.parse(getMyList);
	}
	if (localStorageMyList) {
		myListCount += localStorageMyList.length ? localStorageMyList.length
			: 0;
	}

	// お気に入り注文住宅とリフォームの合計件数を取得
	myListCount += getFavoriteChumonAndReformCount();

	return myListCount;
};

/**
 * お気に入り検索条件数を取得する（会員未ログイン時）
 *
 * @return {number} 件数
 */
function getSavedConditionCountForGuest () {
	var count = 0;
	var savedConditionList = JSON.parse(localStorage.getItem(REGISTJOKEN_KEY));
	if (savedConditionList && savedConditionList.length) {
		count = savedConditionList.length;
	}
	return count;
}

/**
 * お気に入り注文住宅とリフォームの合計件数を取得する
 *
 * @return {number} 注文住宅とリフォームの合計件数
 */
function getFavoriteChumonAndReformCount () {
	var favCount = 0;
	// 注文住宅のお気に入り数を取得
	var chumonKaishaList = JSON.parse(localStorage
		.getItem(CHUMON_KAISHA_MYLIST_KEY));
	var chumonJitsureiList = JSON.parse(localStorage
		.getItem(CHUMON_JITSUREI_MYLIST_KEY));

	if (chumonKaishaList && chumonKaishaList.length > 0) {
		favCount += chumonKaishaList.length;
	}
	if (chumonJitsureiList && chumonJitsureiList.length > 0) {
		favCount += chumonJitsureiList.length;
	}

	// リフォームのお気に入り数を取得
	var reformKaishaList = JSON.parse(localStorage
		.getItem(REFORM_KAISHA_MYLIST_KEY));
	var reformJitsureiList = JSON.parse(localStorage
		.getItem(REFORM_JITSUREI_MYLIST_KEY));

	if (reformKaishaList && reformKaishaList.length > 0) {
		favCount += reformKaishaList.length;
	}
	if (reformJitsureiList && reformJitsureiList.length > 0) {
		favCount += reformJitsureiList.length;
	}

	return favCount;
}

/**
 * ヘッダーにお気に入り件数を表示する
 *
 * @param {number} count 表示する件数
 */
function showFavoriteCountOnHeader (count) {
	count = parseInt(count);
	if (!isNaN(count)) {
		if (count < 0) {
			count = 0;
		} else if (count > MAX_FAVORITE_COUNT) {
			count = MAX_FAVORITE_COUNT;
		}

		// ヘッダーにお気に入り件数を削除して新しい値を表示
		var $target = S('header .favorite');
		if ($target && $target.length > 0) {
			$target.find('span.count').remove();
			$target.append(S('<span>').addClass('count').text(count));
		}
	}
}

/**
 * サイドメニューにお気に入り件数を表示する
 *
 * @param {number} count 表示する件数
 */
function showFavoriteCountOnSidemenu (favoriteCount) {
	// お気に入り物件・注文住宅・リフォーム数
	var favoriteCount = parseInt(favoriteCount);
	if (!isNaN(favoriteCount)) {
		if (favoriteCount < 0) {
			favoriteCount = 0;
		} else if (favoriteCount > MAX_FAVORITE_COUNT) {
			favoriteCount = MAX_FAVORITE_COUNT;
		}

		var $target = S('li span.icnMyFavorite');
		if ($target && $target.length > 0) {
			$target.find('div').remove();
			$target.append(S('<div>').text(favoriteCount + '件'));
		}
	}
}

/**
 * サイドメニューに保存された検索条件数を表示する
 *
 * @param conditionCount 表示する件数
 */
function showSavedConditionCountOnSidemenu (conditionCount) {
	// お気に入り検索条件数
	var conditionCount = parseInt(conditionCount);
	if (!isNaN(conditionCount)) {
		if (conditionCount < 0) {
			conditionCount = 0;
		}

		var $target = S('li span.icnMySaveCond');
		if ($target && $target.length > 0) {
			$target.find('div').remove();
			$target.append(S('<div>').text(conditionCount + '件'));
		}
	}
}

/**
 * 画面上のお気に入り情報を更新する。
 *
 * @param {boolean} isForceSync trueは強制同期、falseはリファラが別サイトの時同期。会員ログイン時のみ有効。
 * @param {function} callback コールバック関数
 */
function updateFavoriteInfo (isForceSync, callback) {
	// 会員ログイン時
	// (JQMB-5194にて会員ログイン時の処理を除去)
	if (S.isLogin) {
		if (typeof callback === 'function') {
			callback();
		}
	}
	// 会員未ログイン時
	else {
		// お気に入り件数と保存された検索条件数を取得
		var favoriteCount = getFavoriteCountForGuest();
		var conditionCount = getSavedConditionCountForGuest();

		// ヘッダーとサイドメニューにお気に入り情報を表示
		showFavoriteCountOnHeader(favoriteCount);
		showFavoriteCountOnSidemenu(favoriteCount);
		showSavedConditionCountOnSidemenu(conditionCount);

		if (typeof callback === 'function') {
			callback();
		}
	}
}

/* アイコン画像がない場合、非表示の切り替え制御を行う */
function noImgIcnHandler (targetElement) {
	S(targetElement).css('display', 'none');
	var parentElement = S(S(targetElement).parent().get(0));
	parentElement.removeClass('tokushuIcn');
	parentElement.addClass('tokushuIcnNoImg');
}
