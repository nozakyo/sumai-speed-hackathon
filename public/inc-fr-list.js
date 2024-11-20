/**
 * @license Copyright (C) Recruit Co., Ltd.
 */

/* global login */

/**
 * [suumo すべての基幹となるsuumoオブジェクト]
 * @type {Object}
 */
var suumo = suumo || {};

/**
 * [inc suumoの差込用となる名前空間]
 * @namespace
 */
suumo.inc = suumo.inc || {};

/**
 * [ifExists]
 *
 * @example
 * ifExists.dom($('#js-ifExistsPanel'), function() {
 *   var $target = this;
 *
 *   $target.css('width', 1000).addClass('dn');
 * };
 */
suumo.inc.ifExists = {
	/**
	 * [要素の存在をチェックして実行]
	 * @param  {Object}   $target  チェックしたい要素
	 * @param  {Function} callback 存在した場合の処理
	 * @return {Boolean}  ifExists?
	 */
	dom: function($target, callback) {
		'use strict';

		var args = Array.prototype.slice.call(arguments, 1);

		if ($target === null || $target.length === 0 || !callback) {
			return false;
		}

		callback.call($target, args);

		return true;
	}
};

/**
 * [isEmptyInput インプット欄が空かどうか]
 * @param {String} targetID インプット欄ID.
 * @return {Boolean} 空の場合はfalse.
 */
suumo.inc.isEmptyInput = function(targetID) {
	var $searchText = $(targetID);
	var val = $searchText.attr('value');
	var defaultVal = $searchText.attr('placeholder');
	if (val === defaultVal || val === '') {
		return true;
	} else {
		return false;
	}
};

/**
 * [heightLine 対象となるDOMの高さを揃える関数]
 * @param  {String} opt_target 高さを揃えたい要素のクラス.
 * HTMLには判別しやすいよう class="js-heightline"を挿入済みです.
 */
suumo.inc.heightLine = function(opt_target) {
	var max = 0, height;
	$(opt_target)
	.each(function() {
		height = $(this).height();
		if (height > max) {
			max = height;
		}
	})
	.height(max);
};

/**
 * [placeholderEvent プレースフォルダー制御]
 *
 * @param {Object} options 対象DOM設定.
 * @example
 * suumo.inc.placeholderEvent({
 *     // targetID トリガーとなるチェックボックス.
 *     targetID: '#js-keywordSearchText'
 * });
 */
suumo.inc.placeholderEvent = function(options) {
	if ('placeholder' in document.createElement('input')) {
		// 自己定義関数で上書きする
		// placeholderがサポートされているので処理は不要
		suumo.inc.placeholderEvent = function() {};
		return false;
	}
	// 自己定義関数で必要処理を上書きする
	suumo.inc.placeholderEvent = function(options) {
		var $target = $(options.targetID);
		var placeholderVal = $target.attr('placeholder');

		// 初期ロード時
		if ($target.val() === '') {
			$target.val(placeholderVal).addClass('js-placeholder');
		} else {
			$target.removeClass('js-placeholder');
		}
		$target.focus(function() {
			if ($target.hasClass('js-placeholder')) {
				$target.val('').removeClass('js-placeholder');
			}
		}).blur(function() {
			if ($target.val() === '' || $target.val() === placeholderVal) {
				$target.val(placeholderVal).addClass('js-placeholder');
			}
		});
	};
	// 上書きしたので再実行
	suumo.inc.placeholderEvent(options);
};

/**
 * [setCookie クッキー値をセットする関数]
 * @param {Object} options クッキー名とクッキー値.
 */
suumo.inc.setCookie = function(options) {
	var date = new Date();
	date.setFullYear(date.getFullYear() + 1);
	var value = options.value + ';path=/ ;expires=' + date.toGMTString() + ';';
	document.cookie = options.name + '=' + value;
};

/**
 * [slideUpDown よく使うアニメーションのエイリアス]
 *
 * @param {[String]}
 *            opt_target アニメーションさせるDOM.
 * @param {[Number]}
 *            opt_sec ミリ秒.
 * @param {[String]}
 *            opt_ease イージング. 例:suumo.inc.slideUpDown('js-anime', '100', 'swing'); .
 */
suumo.inc.slideUpDown = function(opt_target, opt_sec, opt_ease) {
	var $target = opt_target;
	$target.animate({
		'opacity': 'toggle',
		'height': 'toggle',
		'padding-top': 'toggle',
		'padding-bottom': 'toggle'
	}, opt_sec, opt_ease);
};

/**
 * controller
 */
// フッターの検索
var $wordSearchForm = $('#js-wordSearch');

$('#js-footerKensakuBtn').click(function() {
	$wordSearchForm.submit();
	return false;
});

$wordSearchForm.submit(function() {
	if (suumo.inc.isEmptyInput('#js-linkbox-search')) {
		return false;
	}
	return true;
});

suumo.inc.placeholderEvent({
	targetID: '#js-linkbox-search'
});

// フッターの高さ揃える
suumo.inc.heightLine('#js-footnav .js-heightline');

// 全国へ飛ぶ時のクッキー値更新
$(document).delegate('.js-setCookieArZenkoku', 'click', function() {
	suumo.inc.setCookie({
		'name' : 'ar',
		'value' : '000'
	});
});

/*
 * @todo 例外的にfr-list.jsに相乗り.
 * 新着物件お知らせメールを登録.
 */
$('#js-incKensakuJokenMail').click(function() {
	suumo.frList.COMMON.registKensakuJokenMail(login);
});

// 地域情報パネル開閉
$('#js-localInfoPanel').delegate('.js-readmore', 'click', function() {
	var $this = $(this);
	$this.find('.js-readmoreToggle').toggle();
	suumo.inc.slideUpDown($this.siblings('.js-readmoreTogglePanel'), '200', 'swing');
});
