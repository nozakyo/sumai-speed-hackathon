/**
 * 蜈ｨ逕ｻ髱｢蜈ｱ騾哽S
 */
// LocalStorage縺ｮ縺頑ｰ励↓蜈･繧顔黄莉ｶ縺ｮ繧ｭ繝ｼ
var BUKKENMYLIST_KEY = 'smp.bukken.mylist';

// LocalStorage縺ｮ縺頑ｰ励↓蜈･繧頑ｳｨ譁�ｽ丞ｮ��菫晏ｭ伜�繧ｭ繝ｼ
var CHUMON_KAISHA_MYLIST_KEY = 'chumon.kaisha.mylist';

// LocalStorage縺ｮ縺頑ｰ励↓蜈･繧頑ｳｨ譁�ｽ丞ｮ��菫晏ｭ伜�繧ｭ繝ｼ
var CHUMON_JITSUREI_MYLIST_KEY = 'chumon.jitsurei.mylist';

// LocalStorage縺ｮ縺頑ｰ励↓蜈･繧翫Μ繝輔か繝ｼ繝�縺ｮ菫晏ｭ伜�繧ｭ繝ｼ
var REFORM_KAISHA_MYLIST_KEY = 'reform.kaisha.mylist';

// LocalStorage縺ｮ縺頑ｰ励↓蜈･繧翫Μ繝輔か繝ｼ繝�縺ｮ菫晏ｭ伜�繧ｭ繝ｼ
var REFORM_JITSUREI_MYLIST_KEY = 'reform.jitsurei.mylist';

// LocalStorage縺ｮ讀懃ｴ｢譚｡莉ｶ縺ｮ菫晏ｭ伜�繧ｭ繝ｼ
var REGISTJOKEN_KEY = 'smp.registJoken';

// Cookie縺ｮ縺頑ｰ励↓蜈･繧顔黄莉ｶ謨ｰ繧ｭ繝ｼ�井ｼ壼藤繝ｭ繧ｰ繧､繝ｳ譎ゑｼ�
var FAVORITE_BUKKEN_COUNT_KEY = 'favoriteBukkenCount';

// Cookie縺ｮ縺頑ｰ励↓蜈･繧頑､懃ｴ｢譚｡莉ｶ謨ｰ繧ｭ繝ｼ�井ｼ壼藤繝ｭ繧ｰ繧､繝ｳ譎ゑｼ�
var SAVED_CONDITION_COUNT_KEY = 'favoriteconditionCount';

// 縺頑ｰ励↓蜈･繧贋ｻｶ謨ｰ縺ｮ陦ｨ遉ｺ荳翫�譛螟ｧ蛟､
var MAX_FAVORITE_COUNT = 99;

/**
 * 蜈ｨ蝗ｽ繝医ャ繝礼判髱｢縺ｸ驕ｷ遘ｻ縺吶ｋ繝ｪ繝ｳ繧ｯ 蟇ｾ雎｡�喇eader.tpl縲√ヱ繝ｳ縺上★縺ｮ荳逡ｪ逶ｮ縲�0莉ｶ繝偵ャ繝域凾縺ｮ繝医ャ繝励Μ繝ｳ繧ｯ
 */
var homeLink = function () {
	var expire_date = new Date();
	expire_date.setYear(expire_date.getYear() - 1);
	document.cookie = 'tf=;path=/;expires=' + expire_date.toGMTString();
};

/* 縲後�繝ｼ繧ｸ縺ｮ蜈磯�ｭ縺ｸ縲阪�繧ｿ繝ｳ縺ｮ蜃ｦ逅�ｼ�jQuery�� */
(function () {
	if (typeof jQuery === 'undefined') {
		return;
	}
	jQuery(function ($) {
		function gotoPagetop () {
			var pageTop = $('#pagetop').position().top;
			// 繝壹�繧ｸ繝医ャ繝励�繧ｿ繝ｳ繧呈款縺励◆譎ゅ∫判髱｢縺ｮ荳逡ｪ荳翫↓遘ｻ蜍輔☆繧�
			$('html,body').animate({ scrollTop: pageTop }, 25);
		}

		$('a.pagetop').attr('href', 'javascript:void(0)');
		$('a.pagetop').on('click.pageTop', function () {
			gotoPagetop();
		});
	});
})();

/* 縲後�繝ｼ繧ｸ縺ｮ蜈磯�ｭ縺ｸ縲阪�繧ｿ繝ｳ縺ｮ蜃ｦ逅� */
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
 * PC迚医∈驕ｷ遘ｻ縺吶ｋ繝ｪ繝ｳ繧ｯ PC迚�SUUMO縺ｧ縺ｯ繧ｹ繝槭�繝医ヵ繧ｩ繝ｳ縺九ｉ繧｢繧ｯ繧ｻ繧ｹ縺後≠縺｣縺滓凾縺ｫ繧ｹ繝槭�迚医↓繝ｪ繝繧､繝ｬ繧ｯ繝医＆縺帙ｋ讖溯�縺後≠繧九�
 * 繧医▲縺ｦPC迚医↓驕ｷ遘ｻ縺輔○繧九→縺阪↓蜊倡ｴ斐↓PC迚医↓驕ｷ遘ｻ縺輔○繧九□縺代〒縺ｯ縲√せ繝槭�迚医↓繝ｪ繝繧､繝ｬ繧ｯ繝医＆縺帙ｋ讖溯�縺ｫ繧医ｊ繧ｹ繝槭�迚�SUUMO縺ｫ繝ｪ繝繧､繝ｬ繧ｯ繝医＆繧後※縺励∪縺��
 * 縺薙ｌ繧貞屓驕ｿ縺吶ｋ縺溘ａSUUMO_PC_VIEW繧定ｨｭ螳壹＠縲√◎縺ｮexpire_date繧定ｨｭ螳壹＠縺ｦ縺�ｋ
 *
 * @param string domain 驕ｷ遘ｻ蜈医�繝峨Γ繧､繝ｳ縲ゅ％縺ｮ繝代Λ繝｡繝ｼ繧ｿ縺ｮ荳ｭ霄ｫ縺ｯcookie縺ｫ莉戊ｾｼ縺ｾ繧後∪縺吶�
 * @param string link 驕ｷ遘ｻ蜈医�繝ｪ繝ｳ繧ｯ縲ゅ％縺ｮ繝代Λ繝｡繝ｼ繧ｿ縺ｧ貂｡縺輔ｌ縺欟RL縺ｫ驕ｷ遘ｻ縺励∪縺吶�
 * @param string expire 譛牙柑譛滄剞
 */
var pcView = function (domain, link, expire) {
	var expire_date = new Date();
	expire_date.setTime(expire_date.getTime() + expire);
	document.cookie = 'SUUMO_PC_VIEW=1;path=/;domain=' + domain + ';expires=' +
        expire_date.toGMTString();
	window.open(link);
};

/**
 * 蛟､縺ｮ譛臥┌繧偵メ繧ｧ繝�け php縺ｮisset()縺ｫ逶ｸ蠖�
 *
 * @param data 蛟､
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
 * 蛟､縺ｮ譛臥┌繧偵メ繧ｧ繝�け php縺ｮempty()縺ｫ逶ｸ蠖�
 *
 * @param data 蛟､
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
 * php縺ｮremoveHtmlTag縺ｫ蟇ｾ蠢懊＠縺ｦ縺�ｋ髢｢謨ｰ
 */
var removeHtmlTag = function (target) {
	var re = /(<([^>]+)>)/gi;
	var res = '';
	for (var i = 0; i < target.length; i++) { res += target[i].replace(re, ''); }
	return res;
};

(function (S) {
	/**
     * 繧ｵ繧､繝峨Γ繝九Η繝ｼ
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
			// 蛻晄悄蛹�
			bodyElm = S('body');
			sideMenuOv = S('.js-side-menu-ov');
			sideMenuContent = S('.js-side-menu');
			this.sideMenuContainer = S('#' + this.sideMenuContId);
			// 繝｡繝九Η繝ｼ陦ｨ遉ｺ蜍穂ｽ�
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
			// 繧ｪ繝ｼ繝舌�繝ｬ繧､陦ｨ遉ｺ驛ｨ蛻�ｒ蜍輔°縺輔↑縺�ｈ縺�↓縺吶ｋ
			sideMenuOv.on('touchmove', function (event) {
				event.preventDefault();
			});
			// 陦ｨ遉ｺ荳ｭ蝗櫁ｻ｢蟇ｾ蠢�
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
				// 逕ｻ髱｢縺ｮ縺頑ｰ励↓蜈･繧頑ュ蝣ｱ繧呈峩譁ｰ
				updateFavoriteInfo();

				// 讓ｪ繝｡繝九Η繝ｼ繧｢繧､繧ｳ繝ｳ繧呈款縺輔↑縺��ｴ蜷医↓繧よｨｪ繝｡繝九Η繝ｼ縺御ｸ迸ｬ陦ｨ遉ｺ縺輔ｌ縺ｦ縺励∪縺�◆繧√�
				// 讓ｪ繝｡繝九Η繝ｼ繧｢繧､繧ｳ繝ｳ繧偵ち繝��縺励◆蝣ｴ蜷医�縺ｿsideMenuDocHeight繧貞叙蠕励＆縺帙ｋ蟇ｾ蠢懊ｒ縺励◆
				// 2013/09/25 AW螟ｧ荵�ｿ�
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

// DOM縺ｮ貅門ｙ螳御ｺ�ｾ後↓螳溯｡�
S(document).ready(function () {
	// 逕ｻ髱｢荳翫�縺頑ｰ励↓蜈･繧頑ュ蝣ｱ繧呈峩譁ｰ
	updateFavoriteInfo();
});

/**
 * 繝代Λ繝｡繝ｼ繧ｿ繧貞叙蠕励☆繧�
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
 * 譁�ｭ怜�縺ｮ蜈磯�ｭ縺ｫ莉ｻ諢上�譁�ｭ励ｒ莉伜刈縺励∵枚蟄玲焚繧定ｪｿ謨ｴ縺吶ｋ
 *
 * @param {string} format 蜈磯�ｭ縺ｫ縺､縺代◆縺�枚蟄怜�
 * @param {string} value 隱ｿ謨ｴ縺励◆縺�枚蟄怜�
 * @param {string} length 隱ｿ謨ｴ蠕後�譁�ｭ玲焚
 * @return {string} 邱ｨ髮�ｵ先棡
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
 * 縺頑ｰ励↓蜈･繧顔黄莉ｶ繝ｻ豕ｨ譁�ｽ丞ｮ��繝ｪ繝輔か繝ｼ繝�縺ｮ莉ｶ謨ｰ繧貞叙蠕励☆繧�
 *
 * @return {number} 莉ｶ謨ｰ
 */
var getFavoriteCountForGuest = function () {
	// 縺頑ｰ励↓蜈･繧顔黄莉ｶ謨ｰ繧ｫ繧ｦ繝ｳ繝�
	var myListCount = 0;

	// 繝ｭ繝ｼ繧ｫ繝ｫ繧ｹ繝医Ξ繝ｼ繧ｸ縺ｮ縺頑ｰ励↓蜈･繧顔匳骭ｲ謨ｰ繧貞叙蠕�
	var getMyList = localStorage.getItem(BUKKENMYLIST_KEY);
	var localStorageMyList = '';
	if (getMyList) {
		localStorageMyList = JSON.parse(getMyList);
	}
	if (localStorageMyList) {
		myListCount += localStorageMyList.length ? localStorageMyList.length
			: 0;
	}

	// 縺頑ｰ励↓蜈･繧頑ｳｨ譁�ｽ丞ｮ�→繝ｪ繝輔か繝ｼ繝�縺ｮ蜷郁ｨ井ｻｶ謨ｰ繧貞叙蠕�
	myListCount += getFavoriteChumonAndReformCount();

	return myListCount;
};

/**
 * 縺頑ｰ励↓蜈･繧頑､懃ｴ｢譚｡莉ｶ謨ｰ繧貞叙蠕励☆繧具ｼ井ｼ壼藤譛ｪ繝ｭ繧ｰ繧､繝ｳ譎ゑｼ�
 *
 * @return {number} 莉ｶ謨ｰ
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
 * 縺頑ｰ励↓蜈･繧頑ｳｨ譁�ｽ丞ｮ�→繝ｪ繝輔か繝ｼ繝�縺ｮ蜷郁ｨ井ｻｶ謨ｰ繧貞叙蠕励☆繧�
 *
 * @return {number} 豕ｨ譁�ｽ丞ｮ�→繝ｪ繝輔か繝ｼ繝�縺ｮ蜷郁ｨ井ｻｶ謨ｰ
 */
function getFavoriteChumonAndReformCount () {
	var favCount = 0;
	// 豕ｨ譁�ｽ丞ｮ��縺頑ｰ励↓蜈･繧頑焚繧貞叙蠕�
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

	// 繝ｪ繝輔か繝ｼ繝�縺ｮ縺頑ｰ励↓蜈･繧頑焚繧貞叙蠕�
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
 * 繝倥ャ繝繝ｼ縺ｫ縺頑ｰ励↓蜈･繧贋ｻｶ謨ｰ繧定｡ｨ遉ｺ縺吶ｋ
 *
 * @param {number} count 陦ｨ遉ｺ縺吶ｋ莉ｶ謨ｰ
 */
function showFavoriteCountOnHeader (count) {
	count = parseInt(count);
	if (!isNaN(count)) {
		if (count < 0) {
			count = 0;
		} else if (count > MAX_FAVORITE_COUNT) {
			count = MAX_FAVORITE_COUNT;
		}

		// 繝倥ャ繝繝ｼ縺ｫ縺頑ｰ励↓蜈･繧贋ｻｶ謨ｰ繧貞炎髯､縺励※譁ｰ縺励＞蛟､繧定｡ｨ遉ｺ
		var $target = S('header .favorite');
		if ($target && $target.length > 0) {
			$target.find('span.count').remove();
			$target.append(S('<span>').addClass('count').text(count));
		}
	}
}

/**
 * 繧ｵ繧､繝峨Γ繝九Η繝ｼ縺ｫ縺頑ｰ励↓蜈･繧贋ｻｶ謨ｰ繧定｡ｨ遉ｺ縺吶ｋ
 *
 * @param {number} count 陦ｨ遉ｺ縺吶ｋ莉ｶ謨ｰ
 */
function showFavoriteCountOnSidemenu (favoriteCount) {
	// 縺頑ｰ励↓蜈･繧顔黄莉ｶ繝ｻ豕ｨ譁�ｽ丞ｮ��繝ｪ繝輔か繝ｼ繝�謨ｰ
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
			$target.append(S('<div>').text(favoriteCount + '莉ｶ'));
		}
	}
}

/**
 * 繧ｵ繧､繝峨Γ繝九Η繝ｼ縺ｫ菫晏ｭ倥＆繧後◆讀懃ｴ｢譚｡莉ｶ謨ｰ繧定｡ｨ遉ｺ縺吶ｋ
 *
 * @param conditionCount 陦ｨ遉ｺ縺吶ｋ莉ｶ謨ｰ
 */
function showSavedConditionCountOnSidemenu (conditionCount) {
	// 縺頑ｰ励↓蜈･繧頑､懃ｴ｢譚｡莉ｶ謨ｰ
	var conditionCount = parseInt(conditionCount);
	if (!isNaN(conditionCount)) {
		if (conditionCount < 0) {
			conditionCount = 0;
		}

		var $target = S('li span.icnMySaveCond');
		if ($target && $target.length > 0) {
			$target.find('div').remove();
			$target.append(S('<div>').text(conditionCount + '莉ｶ'));
		}
	}
}

/**
 * 逕ｻ髱｢荳翫�縺頑ｰ励↓蜈･繧頑ュ蝣ｱ繧呈峩譁ｰ縺吶ｋ縲�
 *
 * @param {boolean} isForceSync true縺ｯ蠑ｷ蛻ｶ蜷梧悄縲’alse縺ｯ繝ｪ繝輔ぃ繝ｩ縺悟挨繧ｵ繧､繝医�譎ょ酔譛溘ゆｼ壼藤繝ｭ繧ｰ繧､繝ｳ譎ゅ�縺ｿ譛牙柑縲�
 * @param {function} callback 繧ｳ繝ｼ繝ｫ繝舌ャ繧ｯ髢｢謨ｰ
 */
function updateFavoriteInfo (isForceSync, callback) {
	// 莨壼藤繝ｭ繧ｰ繧､繝ｳ譎�
	// (JQMB-5194縺ｫ縺ｦ莨壼藤繝ｭ繧ｰ繧､繝ｳ譎ゅ�蜃ｦ逅�ｒ髯､蜴ｻ)
	if (S.isLogin) {
		if (typeof callback === 'function') {
			callback();
		}
	}
	// 莨壼藤譛ｪ繝ｭ繧ｰ繧､繝ｳ譎�
	else {
		// 縺頑ｰ励↓蜈･繧贋ｻｶ謨ｰ縺ｨ菫晏ｭ倥＆繧後◆讀懃ｴ｢譚｡莉ｶ謨ｰ繧貞叙蠕�
		var favoriteCount = getFavoriteCountForGuest();
		var conditionCount = getSavedConditionCountForGuest();

		// 繝倥ャ繝繝ｼ縺ｨ繧ｵ繧､繝峨Γ繝九Η繝ｼ縺ｫ縺頑ｰ励↓蜈･繧頑ュ蝣ｱ繧定｡ｨ遉ｺ
		showFavoriteCountOnHeader(favoriteCount);
		showFavoriteCountOnSidemenu(favoriteCount);
		showSavedConditionCountOnSidemenu(conditionCount);

		if (typeof callback === 'function') {
			callback();
		}
	}
}

/* 繧｢繧､繧ｳ繝ｳ逕ｻ蜒上′縺ｪ縺��ｴ蜷医�撼陦ｨ遉ｺ縺ｮ蛻�ｊ譖ｿ縺亥宛蠕｡繧定｡後≧ */
function noImgIcnHandler (targetElement) {
	S(targetElement).css('display', 'none');
	var parentElement = S(S(targetElement).parent().get(0));
	parentElement.removeClass('tokushuIcn');
	parentElement.addClass('tokushuIcnNoImg');
}