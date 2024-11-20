/**
 * Copyright (C) Recruit Co., Ltd.
 */

/* global CLIP_KAIIN:false, CLIP_HIKAIIN:false, JOKEN_KAIIN, JOKEN_HIKAIIN */
/* global JOKEN_AND_MAIL_KAIIN, login */

/**
 * [frList fr一覧用クラス]
 * @constructor
 */
suumo.frList = function() {};

/**
 * [賃貸一覧用名前空間]
 * @namespace
 */
suumo.frList.constants = {
	// activeクラス
	ACTIVE_CLASS: 'is-active',
	INACTIVE_CLASS: 'is-inactive',
	HIDDEN_CLASS: 'is-hidden',
	LODING_CLASS: 'is-loading',
	NOSCROLL_CLASS: 'is-noscroll',
	DURATION: '300',
	//DSE判定条件用フラグ
	DSE_FLAG: $('#js-dseFlgId').val()
};

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
suumo.frList.ifExists = {
	/**
	 * [要素の存在をチェックして実行]
	 * @param  {Object}   $target  チェックしたい要素
	 * @param  {Function} callback 存在した場合の処理
	 * @return {Boolean}  ifExists?
	 */
	dom: function($target, callback) {
		'use strict';
		var args = Array.prototype.slice.call(arguments, 1);
		if ($target === null || $target.length === 0) {
			return false;
		}
		if (typeof callback === 'function') {
			callback.call($target, args);
		}
		return true;
	}
};

/**
 * [unEscapeHTML xj1のString拡張]
 *
 * @return {[String]} 文字列.
 */
String.prototype.unEscapeHTML = function() {
	return this.replace(/\&amp;/g, '&').replace(/\&lt;/g, '<').replace(/\&gt;/g, '>').replace(/\&#39;/g, '\'').replace(/\&quot;/g, '\"');
};

/**
 * [trim xj1のString拡張]
 *
 * @return {[String]} 文字列.
 */
String.prototype.trim = function() {
	return this.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, '');
};

/**
 * [checkAllCheckbox ターゲットのチェックTrue・False切替用]
 *
 * @param {[String]}
 *            options.triggerID トリガーとなるチェックボックス
 * @param {[String]}
 *            options.targetClass 切替対象のチェックボックス
 */
suumo.frList.checkAllCheckbox = function(options) {

	var $triggerID = $(options.triggerID);

	// ターゲット要素に合わせて、親の状態を変更する（ajax＋初期表示用）
	var $targetClass = $(options.targetClass + ':enabled');
	var $targetClassChecked = $(options.targetClass + ':enabled:checked');
	if($targetClass.length !== 0 && $targetClass.length === $targetClassChecked.length){
		$triggerID.attr('checked', true);
	}

	// チェックをトリガーのチェックボックスに反映
	$targetClass.click(function() {
		var $targetClassChecked = $(options.targetClass + ':enabled:checked');
		if($targetClass.length === $targetClassChecked.length){
			$triggerID.attr('checked', true);
		} else {
			$triggerID.attr('checked', false);
		}
	});
};

/**
 * [showHideSearchResultProcFlg 検索条件パネルの表示・非表示処理制御フラグ]
 * @type {Boolean}
 * @default false
 */
suumo.frList.showHideSearchResultProcFlg = false;

/**
 * [showHideSearchResult 検索条件パネルの表示・非表示]
 * @param  {[string]} options.result           表示内容のDOM.
 * @param  {[string]} options.target           アニメーションさせるDOM.
 * @param  {[string]} options.close_text       close判定のテキスト.
 * @param  {[string]} options.open_html        open時のタグ.
 * @param  {[string]} options.close_html       close時のタグ.
 * @return {[Boolean]} falseを返す.
 */
suumo.frList.showHideSearchResult = function (options) {
	// 制御フラグ判定
	if (suumo.frList.showHideSearchResultProcFlg) {
		return true;
	}
	suumo.frList.showHideSearchResultProcFlg = true;
	var varName = $(options.result);
	var prevResult = varName.prev();
	var allHeight = varName.height();
	var target = $(options.target);
	suumo.frList.slideUpDown(varName, '200', 'swing');
	if(target.text() === options.close_text) {
		prevResult.animate({
			'height': '30px'
		}, '200', 'swing');
		setTimeout(function () {
			varName.css('background-color', 'transparent');
		}, 400);
		target.html(options.open_html);
	} else {
		prevResult.animate({
			'height': allHeight
		}, '200', 'swing');
		varName.css('background-color', '#FFFFFF');
		target.html(options.close_html);
	}

	// 制御フラグ初期化
	var procFlg = setInterval(function() {
		suumo.frList.showHideSearchResultProcFlg = false;
		clearTimeout(procFlg);
	}, 400);

	return false;
};

/**
 * [slideUpDown よく使うアニメーションのエイリアス]
 * @param  {[String]} opt_target アニメーションさせるDOM.
 * @param  {[Number]} opt_sec    ミリ秒.
 * @param  {[String]} opt_ease   イージング.
 * 例:suumo.frList.slideUpDown('js-anime', '100', 'swing'); .
 */
suumo.frList.slideUpDown = function (opt_target, opt_sec, opt_ease) {
	var $target = opt_target;
	$target.animate({
		'opacity': 'toggle',
		'height': 'toggle',
		'padding-top': 'toggle',
		'padding-bottom': 'toggle'
	}, opt_sec, opt_ease);
};

/**
 * [toggleCondbox 絞り込みボックス開閉アニメ用関数]
 * @param  {[Object]} options オプションパラメーターをオブジェクトで受け取ります.
 * @return {[Boolean]}   falseを返す.
 */
suumo.frList.toggleCondbox = function(options) {
	// アイコン切り替え
	var $hiddenBlock = $(options.hiddenBlock);
	var $dispStatus = $hiddenBlock.is(':visible');
	if($dispStatus){
		$(options.targetIcon).removeClass(options.iconFalse).addClass(options.iconTrue);
	} else {
		$(options.targetIcon).removeClass(options.iconTrue).addClass(options.iconFalse);
	}

	// 表示非表示切り替え
	$hiddenBlock.slideToggle(options.sec);

	return false;
};

/**
 * [toggleOpenCloseProcFlg 絞り込みボックス開閉処理制御フラグ]
 * @type {Boolean}
 * @default false
 */
suumo.frList.toggleOpenCloseProcFlg = false;

/**
 * [toggleOpenClose 絞り込みボックス開閉アニメ用関数]
 * @param  {[Object]} options オプションパラメーターをオブジェクトで受け取ります.
 * @return {[Boolean]}   falseを返す.
 */
suumo.frList.toggleOpenClose = function(options) {
	var targetID = '#' + $(options.target).attr('id');
	var hiddenBlockID = targetID + '-panel';
	var iconID = targetID + '-icon';

	// 親トグル
	$(targetID).click(function() {
		// 制御フラグ判定
		if (suumo.frList.toggleOpenCloseProcFlg) {
			return true;
		}
		suumo.frList.toggleOpenCloseProcFlg = true;

		var dispStatus = $(hiddenBlockID).is(':visible');

		// アイコン切り替え
		if (dispStatus) {
			$(iconID).removeClass(options.iconFalse).addClass(options.iconTrue);
		} else {
			$(iconID).removeClass(options.iconTrue).addClass(options.iconFalse);
		}

		// 表示非表示切り替え
		$(hiddenBlockID).slideToggle(options.sec);

		// 制御フラグ初期化
		var procFlg = setInterval(function() {
			suumo.frList.toggleOpenCloseProcFlg = false;
			clearTimeout(procFlg);
		}, 500);
	});

	// 子トグル
	if (options.setCloseBtn === true) {
		$(hiddenBlockID + ' .js-boxToggleClose').click(function() {
			// 制御フラグ判定
			if (suumo.frList.toggleOpenCloseProcFlg) {
				return true;
			}
			suumo.frList.toggleOpenCloseProcFlg = true;

			// アイコン切り替え
			$(iconID).removeClass(options.iconFalse).addClass(options.iconTrue);

			// 表示非表示切り替え
			$(hiddenBlockID).slideToggle(options.sec);

			// 制御フラグ初期化
			var procFlg = setInterval(function() {
				suumo.frList.toggleOpenCloseProcFlg = false;
				clearTimeout(procFlg);
			}, 500);
		});
	}

};

/**
 * [showAreaDetailProcFlg 開閉パネル処理制御フラグ]
 * @type {Boolean}
 * @default false
 */
suumo.frList.showAreaDetailProcFlg = false;

/**
 * [showAreaDetail エリア詳細指定パネル開閉]
 *
 * @param {[Object]}
 */
suumo.frList.showAreaDetail = function(options) {
	// 制御フラグ判定
	if (suumo.frList.showAreaDetailProcFlg) {
		return true;
	}
	suumo.frList.showAreaDetailProcFlg = true;

	var $panel = $(options.panel);
	var $icon = $(options.icon);
	var $button = $(options.button);
	var iconOpen = options.iconOpen;
	var iconClose = options.iconClose;

	suumo.frList.slideUpDown($panel, '400', 'swing');
	if (!$icon.hasClass(iconOpen)) {
		var tmp = iconClose;
		iconClose = iconOpen;
		iconOpen = tmp;
	}
	$icon.removeClass(iconOpen);
	$icon.addClass(iconClose);
	$button.toggleClass('dn');

	// 制御フラグ初期化
	var procFlg = setInterval(function() {
		suumo.frList.showAreaDetailProcFlg = false;
		clearTimeout(procFlg);
	}, 200);
};
// エリアの詳細を指定するボタン
$('#js-areaDetail').click(function() {
	suumo.frList.showAreaDetail({
		panel: '#js-areaDetailPanel',
		icon: '#js-areaIcon',
		iconOpen: 'ui-icon--plus',
		iconClose: 'ui-icon--minus'
	});
});
// エリアの詳細「沿線の駅を全て表示する/元に戻す」ボタン
$('.js-searchallToggle').click(function() {
	$('.js-searchallToggle').toggle();
	suumo.frList.slideUpDown($('#js-areaDetailPanel-scAll'), '200', 'swing');
});

/**
 * [slideImage 物件カセットの画像スライド用オブジェクト.]
 * @constructor
 */
suumo.frList.slideImages = function() {};

/**
 * [init 物件カセットの画像スライド初期化]
 * @param  {Object} options ボタンなどの設定.
 * @example
 * suumo.frList.slideImages.init({
 *	targetList: '#js-bukkenList', //ターゲットとなる一覧.
 *	casset: '.js-slideImage', //スライドとコントローラのあるカセット.
 *	imageList: '.js-imageView', //スライドさせたい画像リスト.
 *	backBtn: '.js-slideBack',
 *	nextBtn: '.js-slideNext',
 *	madoriBtn: '.js-slideMadoriBtn',
 *	caption: '.js-slideCaption', //画像のaltを表示するDOM.
 *	currentNum: '.js-currentCount', //現在の画像が何番目かを表示するDOM.
 *	madoriImage: '#js-madorizuImg' //間取り画像のID（連番抜き）.
 * });
 */
suumo.frList.slideImages.init = function(options) {
	// 一覧DOM
	var $targetList = $(options.targetList);
	// スライドのあるカセットDOM[]
	var $cassets = $targetList.find(options.casset);
	// カセット単体、カセットごとのスライド用
	var $casset;
	var $images;
	// スライドのあるカセットの数
	var count = $cassets.length;
	// 各種ボタンなどの宣言
	var $madoriImage, $backBtn, $nextBtn, $madoriBtn;
	var $caption;
	var $currentNum;
	var i;

	// 「<」ボタンを薄くしておく
	$targetList.find(options.backBtn).css('opacity', '0.5');

	for (i = 0; i < count; i++) {
		$casset = $cassets.eq(i);
		$madoriImage = $(options.madoriImage + i);
		$backBtn = $casset.find(options.backBtn);
		$nextBtn = $casset.find(options.nextBtn);
		$madoriBtn = $casset.find(options.madoriBtn);
		$images = $casset.find(options.imageList);
		$caption = $casset.find(options.caption);
		$currentNum = $casset.find(options.currentNum);

		// コントローラに、それぞれのターゲットを関係させるため、dataにセット
		$backBtn.data('targetImage', $images);
		$nextBtn.data('targetImage', $images);
		$madoriBtn.data('targetImage', $images);
		$images.data({
			'targetCaption': $caption,
			'madoriImage': $madoriImage,
			'currentNum': $currentNum,
			'backBtn': $backBtn,
			'nextBtn': $nextBtn
		});

		$images.css('width', ($images.find('li').length * 180));
	}
};

/**
 * [clickFlg スライドの連打抑止フラグ]
 * @type {Boolean}
 * @default true
 */
suumo.frList.slideImages.clickFlg = true;

/**
 * [update コントローラの更新とアニメーションの実行]
 * @param  {Object} options [description]
 */
suumo.frList.slideImages.update = function(options) {
	var $caption = options.caption;
	// ボタンなどのコントローラを整える
	suumo.frList.slideImages.setControler({
		backBtn: options.backBtn,
		nextBtn: options.nextBtn,
		max: options.max,
		slideNum: options.slideNum
	});
	// キャプションを置き換える
	$caption.text(options.text);
	// スライドさせる
	suumo.frList.slideImages.animate({
		target: options.target,
		targetChild: options.targetChild,
		width: options.width
	});
};

/**
 * [setControler コントローラの体裁を更新]
 * @param  {Object} options ボタンなどの設定.
 * @see suumo.frList.slideImages.update
 */
suumo.frList.slideImages.setControler = function(options) {
	var $backBtn = options.backBtn;
	var $nextBtn = options.nextBtn;

	if (options.slideNum >= options.max && options.max > 2) {
		$nextBtn.animate({
			opacity: '0.5'
		}, {
			duration: 500,
			easing: 'swing'
		});
	} else if (options.slideNum <= 1 && options.max > 2) {
		$backBtn.animate({
			opacity: '0.5'
		}, {
			duration: 500,
			easing: 'swing'
		});
	} else if (options.slideNum <= 1 && options.max <= 2) {
		$backBtn.animate({
			opacity: '0.5'
		}, {
			duration: 500,
			easing: 'swing'
		});
		$nextBtn.animate({
			opacity: '1'
		}, {
			duration: 500,
			easing: 'swing'
		});
	}  else if (options.slideNum >= options.max && options.max <= 2) {
		$backBtn.animate({
			opacity: '1'
		}, {
			duration: 500,
			easing: 'swing'
		});
		$nextBtn.animate({
			opacity: '0.5'
		}, {
			duration: 500,
			easing: 'swing'
		});
	} else {
		$nextBtn.animate({
			opacity: '1'
		}, {
			duration: 500,
			easing: 'swing'
		});
		$backBtn.animate({
			opacity: '1'
		}, {
			duration: 500,
			easing: 'swing'
		});
	}
};

/**
 * [animate アニメーション処理]
 * @param  {Object} options ボタンなどの設定.
 * @see suumo.frList.slideImages.update
 */
suumo.frList.slideImages.animate = function(options) {
	suumo.frList.slideImages.clickFlg = false;
	var $target = options.target;
	var $targetChild = options.targetChild;
	// 画像のスライド処理
	$target.animate({
		left: '+=' + (options.width + 'px')
	}, {
		duration: 500,
		easing: 'swing',
		complete: function() {
			$target.queue([]).stop();
			suumo.frList.slideImages.clickFlg = true;
		}
	});
	// 画像のフラッシュ処理
	$targetChild
	.animate({
		opacity: '0.3'
	}, {
		duration: 250,
		easing: 'swing'
	})
	.animate({
		opacity: '1'
	}, {
		duration: 250,
		easing: 'swing',
		complete: function() {
			$targetChild.queue([]).stop();
		}
	});
};

/**
 * [getNext 次の画像を表示する]
 * @param  {Object} obj 押されたボタンDOM.
 */
suumo.frList.slideImages.getNext = function(obj) {
	if (!suumo.frList.slideImages.clickFlg) {
		return;
	}

	var $target = $(obj).data('targetImage');
	var $targetChild = $target.find('li');
	var imageLength = $targetChild.length;
	var $currentNum = $target.data('currentNum');
	var slideNum = parseInt($currentNum.text(), 10);

	if (slideNum >= (imageLength)) {
		return;
	}

	slideNum = slideNum + 1;

	var $backBtn = $target.data('backBtn');
	var $nextBtn = $target.data('nextBtn');
	var $caption = $target.data('targetCaption');
	var captionText = $targetChild.eq(slideNum - 1).find('img').attr('alt');

	suumo.frList.slideImages.update({
		backBtn: $backBtn,
		nextBtn: $nextBtn,
		max: imageLength,
		slideNum: slideNum,
		caption: $caption,
		text: captionText,
		target: $target,
		targetChild: $targetChild,
		width: -180
	});

	$target.data('currentNum').text(slideNum);
};

/**
 * [getNext 前の画像を表示する]
 * @param  {Object} obj 押されたボタンDOM.
 */
suumo.frList.slideImages.getPrev = function(obj) {
	if (!suumo.frList.slideImages.clickFlg) {
		return;
	}

	var $target = $(obj).data('targetImage');
	var $targetChild = $target.find('li');
	var imageLength = $targetChild.length;
	var $currentNum = $target.data('currentNum');
	var slideNum = parseInt($currentNum.text(), 10);

	if (slideNum <= 1) {
		return;
	}
	slideNum = slideNum - 1;

	var $backBtn = $target.data('backBtn');
	var $nextBtn = $target.data('nextBtn');
	var $caption = $target.data('targetCaption');
	var captionText = $targetChild.eq(slideNum - 1).find('img').attr('alt');

	suumo.frList.slideImages.update({
		backBtn: $backBtn,
		nextBtn: $nextBtn,
		max: imageLength,
		slideNum: slideNum,
		caption: $caption,
		text: captionText,
		target: $target,
		targetChild: $targetChild,
		width: 180
	});

	$target.data('currentNum').text(slideNum);
};

/**
 * [getNext 間取りの画像を表示する]
 * @param  {Object} obj 押されたボタンDOM.
 */
suumo.frList.slideImages.getMadori = function(obj) {
	if (!suumo.frList.slideImages.clickFlg) {
		return;
	}
	var $target = $(obj).data('targetImage');
	var $targetChild = $target.find('li');
	var imageLength = $targetChild.length;
	var $madoriImage = $target.data('madoriImage');
	var madoriNum = $targetChild.index($madoriImage);

	var slideNum = madoriNum + 1;

	if (madoriNum * 180 === parseInt($target.css('left'), 10) * -1) {
		return;
	}

	if (madoriNum >= imageLength) {
		return;
	}

	var $backBtn = $target.data('backBtn');
	var $nextBtn = $target.data('nextBtn');
	var $caption = $target.data('targetCaption');
	var captionText = $madoriImage.find('img').attr('alt');

	suumo.frList.slideImages.setControler({
		backBtn: $backBtn,
		nextBtn: $nextBtn,
		max: imageLength,
		slideNum: slideNum
	});
	$caption.text(captionText);

	// 画像のスライド処理
	$target.animate({
		left: (-180 * madoriNum) + 'px'
	}, {
		duration: 500,
		easing: 'swing',
		complete: function() {
			$target.queue([]).stop();
		}
	});
	// 画像のフラッシュ処理
	$targetChild
	.animate({
		opacity: '0.3'
	}, {
		duration: 250,
		easing: 'swing'
	})
	.animate({
		opacity: '1'
	}, {
		duration: 250,
		easing: 'swing',
		complete: function() {
			$targetChild.queue([]).stop();
		}
	});

	$target.data('currentNum').text(slideNum);
	suumo.frList.slideImages.clickFlg = true;
};

//FACE-5121 【2015/1/7反映：2014/11/7開発納品】賃貸一覧カセット改善
/**
 * [redirectPulldownChange プルダウン変更時に遷移先を生成してリダイレクトする]
 * @param  {$pullDownObj} Object 変更されたプルダウンのDOM.
 * @param  {param} String リダイレクト時に渡すパラメータ名.
 * @param  {redirectPath} String リダイレクト先のURL.
 *
 * @example
 * suumo.frList.redirectPulldownChange($('#js-pulldown'), 'pe|pl', '/edit/test/apli/?xxx=****&yyy=***');
 */
suumo.frList.redirectPulldownChange = function($pullDownObj, param, redirectPath){
	var actionUrl = suumo.frList.COMMON.removeQueryParams2( param, redirectPath );
	location.href = actionUrl + '&' + $pullDownObj.serialize();
};

/**
 * [redirectPulldownChangeDse 特定条件下にプルダウン変更時に遷移先を生成してリダイレクトする]
 * @param  {$pullDownObj} Object 変更されたプルダウンのDOM.
 * @param  {param} String リダイレクト時に渡すパラメータ名.
 * @param  {redirectPath} String リダイレクト先のURL.
 *
 * @example
 * suumo.frList.redirectPulldownChange($('#js-pulldown'), 'pe|pl', '/edit/test/apli/?xxx=****&yyy=***');
 */
suumo.frList.redirectPulldownChangeDse = function($pullDownObj, param, redirectPath){
	var actionUrl = suumo.frList.COMMON.removeQueryParams2(param, redirectPath);
	var last = actionUrl.substr(actionUrl.length-1,1);
	var unite;

    if (last === '/') {
    	unite = '?';
    } else if (last === '?') {
    	unite = '';
    } else {
    	unite ='&';
	}
    location.href = actionUrl + unite + $pullDownObj.serialize();
};

/**
 * 複数のトリガー指定が必要になったので、
 * トリガーAチェック→トリガーBチェック、トリガーCチェック、トリガーD・・・
 * トリガーAアンチェック→トリガーBアンチェック、トリガーC・・・
 * 処理を追加
 */
// http://wwwtst.suumo.jp/jj/jjcommon/js/chintai_ichiran.js
//Start of checkAllCheckbox plugin
$.fn.checkAllCheckbox = function(target, options) {
	options = $.extend({}, $.fn.checkAllCheckbox.defaults, options);
	var triggerElm = this.filter(':checkbox:enabled');
	var targetElm = $(target).filter(':checkbox:enabled');
	if(triggerElm.size() < 1){
		return this;
	}
	triggerElm.click(function(){
		if($(this).attr('checked')){
			triggerElm.attr('checked', true);
			targetElm.attr('checked', true);
			$('[id^=checkall]').attr('checked', true);
		}else{
			targetElm.attr('checked', false);
			triggerElm.attr('checked', false);
			$('[id^=checkall]').attr('checked', false);
		}
	});
	targetElm.click( function(){
		if(!$(this).attr('checked')){
			triggerElm.attr('checked', false);
		}
	});
	return this;
};

// http://wwwtst.suumo.jp/jj/jjcommon/js/chintai_ichiran.js
suumo.frList.COMMON = {
	hideResultMSec : 1500,
	hideResultTimeout : null,

	//「まとめてマイリストに追加する」ボタン
	/* jshint maxdepth:4 */
	registClipMulti : function() {
		if (suumo.frList.COMMON.mySubmitfunc()) {
			$('#hidden_post').html('');
			$('#clipMailError').html('&nbsp;');
			$('#CLIP_MAIL').attr({
				value : ''
			});
			if (login) {
				$('.mail_clp_change').attr({
					value : CLIP_KAIIN
				});
			} else {
				$('.mail_clp_change').attr({
					value : CLIP_HIKAIIN
				});
			}
			var objDiv = document.getElementById('hidden_post');
			var grchk = $('input:checkbox');
			var cnt = 0;
			for(var i=0;i<grchk.size();i++){
				if(grchk.get(i).checked) {
					var val = $(grchk.get(i)).parents('.property_unit, .js-property').find('.js-clipkey').attr('value');
					if (val !== '' && val !== undefined) {
						suumo.frList.COMMON.createClipkey(objDiv, val);
						++cnt;
					}
				}
			}
			if (cnt > 0) {
				suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL007/', '#js-addMylistForm');
			} else {
				var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録対象が選択されていません。</p></div>';
				suumo.frList.COMMON.showResult('',chkMsg);
			}
		}
	},
	//「マイリストに追加」ボタン
	registClipSingle : function(obj) {
		if (suumo.frList.COMMON.mySubmitfunc()) {
			$('#hidden_post').html('');
			$('#clipMailError').html('&nbsp;');
			$('#CLIP_MAIL').attr({
				value : ''
			});
			if (login) {
				// 会員：検索条件登録
				$('.mail_clp_change').attr({
					value : CLIP_KAIIN
				});
			} else {
				// 非会員：検索条件登録
				$('.mail_clp_change').attr({
					value : CLIP_HIKAIIN
				});
			}
			// キー情報の取得
			var val = $(obj).parents('.property_unit, .js-property').find('.js-clipkey').attr('value');

			// キー情報の取得結果により表示振分
			if(val !== '' && val !== undefined) {
				var objDiv = document.getElementById('hidden_post');
				// 送信キー情報作成
				suumo.frList.COMMON.createClipkey(objDiv, val);
				// 非画面Ajax送信
				suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL007/', '#js-addMylistForm');
			} else {
				var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録が行えませんでした。</p></div>';
				suumo.frList.COMMON.showResult('',chkMsg);
			}
		}
	},
	//「お気に入り」ボタン（建物ごと・部屋ごと一覧画面用）
	registClipSingleForNayose : function(obj) {
		if (suumo.frList.COMMON.mySubmitfunc()) {
			$('#hidden_post').html('');
			$('#clipMailError').html('&nbsp;');
			$('#CLIP_MAIL').attr({
				value : ''
			});
			if (login) {
				// 会員：検索条件登録
				$('.mail_clp_change').attr({
					value : CLIP_KAIIN
				});
			} else {
				// 非会員：検索条件登録
				$('.mail_clp_change').attr({
					value : CLIP_HIKAIIN
				});
			}
			// キー情報の取得
			var val = $(obj).parents('.property_unit, .js-property').find('.js-clipkey').attr('value');

			// キー情報の取得結果により表示振分
			if(val !== '' && val !== undefined) {
				var objDiv = document.getElementById('hidden_post');
				// 送信キー情報作成
				suumo.frList.COMMON.createClipkey(objDiv, val);
				// 「お気に入り」ボタンにスタイルを指定
				$(obj).attr('id', 'js-addMyListTaishou');
				// 非画面Ajax送信
				suumo.headerfooter.ajaxForm({
					'targetForm' : '#js-addMylistForm',
					'action' : '/jj/common/function/JJ901FL007/',
					'successFunc' : suumo.frList.mylistSingleAjaxResponseSuccessFunc
				});
			} else {
				var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録が行えませんでした。</p></div>';
				suumo.frList.COMMON.showResult('',chkMsg);
			}
		}
	},
	/* jshint maxdepth:3 */
	// この条件を保存する
	registKensakuJoken:function(login){
		if (login) {
			$('.seaf_change').attr({
				value : JOKEN_KAIIN
			});
			$('.ksk_email_change').attr({
				value : ''
			});
		} else {
			$('.seaf_change').attr({
				value : JOKEN_HIKAIIN
			});
			$('.ksk_email_change').attr({
				value : ''
			});
		}
		suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL008/', '#kensakujokentoroku');
	},
	// 新着メールを登録
	registKensakuJokenMail:function(login){
		if (login) {
			$('.seaf_change').attr({
				value : JOKEN_AND_MAIL_KAIIN
			});
			$('.ksk_email_change').attr({
				value : ''
			});
			suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL008/', '#kensakujokentoroku');
		} else {
			var $objForm = $('#js-kensakuJoukenTourokuForm');
			$objForm.attr('target', 'kensakuJoukenWindow');
			$objForm.attr('method', 'post');
			$objForm.submit();
		}
	},

	submittedFlg :false,

	mySubmitfunc:function(){
		if (suumo.frList.COMMON.submittedFlg) {
			alert('送信中');
			return false;
		}else{
			suumo.frList.COMMON.submittedFlg = true;
			return true;
		}
	},
	/**
	 * [ajaxSend 条件登録ボタンなどの通信とメッセージ表示用関数]
	 *
	 * @param {[String]}
	 *            url 通信先URL.
	 * @param {[String]}
	 *            form formID.
	 */
	ajaxSend : function(url, form) {
		$.ajax({
			type : 'POST',
			url : url,
			data : $(form).serialize(),
			success : function(msg) {
				suumo.frList.COMMON.showResult(msg);
				suumo.headerfooter.updateHeaderMylistCnt('#js-mylistBukkenPopCount', '#js-mylistbarcnt-bukken', 'mylist_bukken_cnt', '#js-mylistBukkenPopCookie');
				suumo.headerfooter.updateHeaderMylistCnt('#js-mylistKaishaPopCount', '#js-mylistbarcnt-company', 'mylist_kaisha_cnt', '#js-mylistKaishaPopCookie');
				suumo.headerfooter.updateHeaderMylistCnt('#js-mylistKensakuJokenPopCount', '#js-mylistbarcnt-sch', 'mylist_sch_cnt', '#js-mylistKensakuJokenPopCookie');
			}
		});
	},
	/**
	 * [showResult ポップアップメッセージ表示]
	 *
	 * @param {[String]}
	 *            msg    メッセージ. メッセージ用DOMを変更.グレー背景用ラッピング要素追加.
	 * @param {[String]}
	 *            chkMsg メッセージ. チェックエラーメッセージ用DOMを変更.グレー背景用ラッピング要素追加.
	 */
	showResult : function(msg,chkMsg) {
		var $showMsg;
		var $wrapElm = $('#js-mylistPop');
		if (msg === '') {
			$showMsg = chkMsg;
		} else {
			$showMsg = msg;
		}
		clearTimeout(suumo.frList.COMMON.hideResultTimeout);
		$wrapElm.html($showMsg);
		$wrapElm.show();
		setTimeout(function(){
			suumo.frList.COMMON.hideResult();
		}, suumo.frList.COMMON.hideResultMSec);
		suumo.frList.COMMON.submittedFlg = false;
	},
	/**
	 * [hideResult ポップアップメッセージ非表示] メッセージ用DOMを変更.グレー背景用ラッピング要素追加.
	 */
	hideResult:function(){
		clearTimeout(suumo.frList.COMMON.hideResultTimeout);
		$('#js-mylistPop').hide();
		$('#js-mylistPop').empty();
	},

	createClipkey:function(objDiv, val) {
		var objClipKey = document.createElement('Input');
		objClipKey.type = 'hidden';
		objClipKey.name = 'clipkey';
		objClipKey.id = 'clipkey';
		objClipKey.value = val;
		objDiv.appendChild(objClipKey);
	},
	trimMessage:function(message){
		var trimedMessage = '';
		if(message == null || message === ''){
			trimedMessage = message;
		} else {
			trimedMessage = message.replace(/[\n]*$/gim, '').replace(/[\r\n]*$/gim, '').replace(/^[ 　]*/gim, '').replace(/[ 　]*$/gim, '');
		}
		return trimedMessage;
	},
	getAjaxResult:function(url,formId,jspId) {
		var param = $(formId).serialize();
		var syncFun = function(msg){
			$(jspId).html(msg);
		};
		this.syncAjax(url,param,syncFun);
	},
	syncAjax: function(url,param,syncFunction){
		$.ajax({
			type:'POST',
			url:url,
			data:param,
			success:function(msg){
				if(typeof syncFunction === 'function') {
					syncFunction(msg);
				}
			}
		});
	},
	//選択沿線のチェック
	/* jshint maxdepth:4, maxstatements:69, maxcomplexity:21 */
	doSubmitTaRa2:function(trg) {
		var flag = true;
		var id = trg.id.split('_');
		var msgArr = {
			rnMessage:'沿線・駅を１個以上選択してください。',
			scMessage:'エリアを１個以上選択してください。'
		};
		var name = trg.name;
		if(name == null || name === '') {
			if(trg.checked) {
				$('#js-conditionbox :checkbox[id^='+trg.id+']').attr('checked','true');
				$('#js-conditionbox :checkbox[id=ensenCd'+trg.id+']').attr('checked','true');
				$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+trg.id+']').attr('checked','true');
			} else {
				$('#js-conditionbox :checkbox[id^='+trg.id+']').attr('checked','');
				$('#js-conditionbox :checkbox[id=ensenCd'+trg.id+']').attr('checked','');
				$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+trg.id+']').attr('checked','');
				$('#js-conditionbox :checkbox[id^='+id[0]+'_]').each(function(){
					if(this.checked) {
						flag = false;
						$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','true');
					}
				});
				if($('#js-conditionbox :checkbox[checked]').length === 0) {
					trg.checked = true;
					$('#js-conditionbox :checkbox[id^='+trg.id+']').attr('checked','true');
					$('#js-conditionbox :checkbox[id=ensenCd'+trg.id+']').attr('checked','true');
					$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+trg.id+']').attr('checked','true');
					if (trg.id.match(/^sc.*/)) {
						alert(msgArr.scMessage);
					} else {
						alert(msgArr.rnMessage);
					}
					return;
				}
			}
		}
		if(name === 'ek') {
			if(!trg.checked) {
				$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','');
				$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','');
				if($('#js-conditionbox :checkbox[checked]').length === 0) {
					trg.checked = true;
					if($('#js-conditionbox :checkbox[id^='+id[0]+'_]').length === 1) {
						$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','true');
					}
					$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','true');
					alert(msgArr.rnMessage);
					return;
				}
				$('#js-conditionbox :checkbox[id^='+id[0]+'_]').each(function(){
					if(this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','');
				} else {
					$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','true');
				}
			} else {
				$('#js-conditionbox :checkbox[id^='+id[0]+'_]').each(function(){
					if(!this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','true');
				}
				$('#js-conditionbox :checkbox[id=ensenCd'+id[0]+']').attr('checked','true');
			}
		}
		if(name === 'sc') {
			if(trg.checked) {
				$('#js-conditionbox :checkbox[id^='+trg.id+'_]').attr('checked','true');
			} else {
				$('#js-conditionbox :checkbox[id^='+trg.id+'_]').attr('checked','');
				if($('#js-conditionbox :checkbox[checked]').length === 0) {
					trg.checked = true;
					$('#js-conditionbox :checkbox[id^='+trg.id+'_]').attr('checked','true');
					alert(msgArr.scMessage);
					return;
				}
			}
		}
		if(name === 'oz') {
			if(!trg.checked) {
				$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','');
				$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+id[0]+']').attr('checked','');
				if($('#js-conditionbox :checkbox[checked]').length === 0) {
					trg.checked = true;
					if($('#js-conditionbox :checkbox[id^='+id[0]+'_]').length === 1) {
						$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','true');
					}
					$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+id[0]+']').attr('checked','true');
					alert(msgArr.scMessage);
					return;
				}
				$('#js-conditionbox :checkbox[id^='+id[0]+'_]').each(function(){
					if(this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+id[0]+']').attr('checked','');
				} else {
					$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+id[0]+']').attr('checked','true');
				}
			} else {
				$('#js-conditionbox :checkbox[id^='+id[0]+'_]').each(function(){
					if(!this.checked) {
						flag = false;
					}
				});
				if(flag) {
					$('#js-conditionbox :checkbox[id='+id[0]+']').attr('checked','true');
				}
				$('#js-conditionbox :checkbox[id=shikugunKukuriCd'+id[0]+']').attr('checked','true');
			}
		}
	},
	/* jshint maxdepth:3, maxstatements:30, maxcomplexity:10 */
	//「この条件で検索する」ボタン
	doSubmitALL: function(formId){
		var form = document.getElementById(formId);
		var rnSelectId = $('#rnSelectId');
		var taSelectId = $('#taSelectId');
		if(rnSelectId != null && rnSelectId.val() === '') {
			rnSelectId.attr('disabled','disabled');
		}
		if(taSelectId != null && taSelectId.val() === '') {
			taSelectId.attr('disabled','disabled');
		}
		if($('#tm_tmpRn li') != null && $('#tm_tmpRn li').length > 0) {
			var tmpRn = [];
			$('#tm_tmpRn li').each(function(index){
				tmpRn[index] = $(this).attr('id');
			});
			if(tmpRn.length > 0) {
				$('#js-conditionbox :checkbox[id^=ensenCdrn]').each(function(index){
					if(jQuery.inArray(this.value, tmpRn) !== -1) {
						$('#js-conditionbox :checkbox[id^=rn'+index+'_]').each(function(){
							if($('#js-conditionbox :checkbox[id^=rn'+index+']').attr('checked')) {
								this.disabled = 'disabled';
							}
						});
					}
				});
			}
		}
		form.submit();
	},

	doSubmit: function(formId,actionUrl,trg,fwValue,radioValue){
		if(null != trg && trg.type === 'radio'){
			if(trg.value === radioValue){
				return ;
			}
		}
		var form = document.getElementById(formId);
		if(form.fw2 != null) {
			if(null != trg && trg.id !== 'fwWord') {
				if(fwValue != null) {
					form.fw2.value = fwValue;
				} else {
					form.fw2.value = '';
				}
			}
		}
		var rnSelectId = $('#rnSelectId');
		var taSelectId = $('#taSelectId');
		if(rnSelectId != null && rnSelectId.val() === '') {
			rnSelectId.attr('disabled','disabled');
		}
		if(taSelectId != null && taSelectId.val() === '') {
			taSelectId.attr('disabled','disabled');
		}
		if($('#tm_tmpRn li') != null && $('#tm_tmpRn li').length > 0) {
			var tmpRn = [];
			$('#tm_tmpRn li').each(function(index){
				tmpRn[index] = $(this).attr('id');
			});
			if(tmpRn.length > 0) {
				$('#js-conditionbox :checkbox[id^=ensenCdrn]').each(function(index){
					if(jQuery.inArray(this.value, tmpRn) !== -1) {
						$('#js-conditionbox :checkbox[id^=rn'+index+'_]').each(function(){
							if($('#js-conditionbox :checkbox[id^=rn'+index+']').attr('checked')) {
								this.disabled = 'disabled';
							}
						});
					}
				});
			}
		}
		form.action = actionUrl;
		form.submit();
	},
	// 並び替えの「リセット」ボタン
	bknIchiranSortReset: function() {
		// 新旧テンプレのID差異を吸収
		var path, $ancher;
		$ancher = $('#pcLink');
		if($ancher.length === 0){
			$ancher = $('#js-pcLink');
		}
		path = $ancher.attr('href');

		var actionUrl = suumo.frList.COMMON.removeQueryParams2( 'po1|po2|page|sngz', path );
		location.href = actionUrl;
	},
	//「並び替える」ボタン
	bknIchiranSort: function() {
		// 新旧テンプレのID差異を吸収
		var path, $ancher;
		$ancher = $('#pcLink');
		if($ancher.length === 0){
			$ancher = $('#js-pcLink');
		}
		path = $ancher.attr('href');

		var actionUrl = suumo.frList.COMMON.removeQueryParams2( 'po1|po2|page', path );
		location.href = actionUrl + '&' + $('#js-sortbox-sortPulldown1').serialize() + '&' + $('#js-sortbox-sortPulldown2').serialize();
	},
	//「並び替える」ボタン 会社一覧用
	kaishaIchiranSort: function(){
		// 新旧テンプレのID差異を吸収
		var path, $ancher;
		$ancher = $('#pcLink');
		if($ancher.length === 0){
			$ancher = $('#js-pcLink');
		}
		path = $ancher.attr('rel');

		var actionUrl = this.removeQueryParams2( 'po|pj', path );
		location.href = actionUrl + $('#js-sortbox').val();
	},
	//並び替え：第一候補、第二候補
	fr301fk0041_change: function(id) {
		var select1 = $('#js-sortbox-sortPulldown1');
		var select2 = $('#js-sortbox-sortPulldown2');
		var val1 = $('#js-sortbox-sortPulldown1').val();
		var val2 = $('#js-sortbox-sortPulldown2').val();
		var _select;
		var _rmval;
		var _setId;
		var selectedId;
		if('opt1_' === id) {
			_select = document.getElementById('js-sortbox-sortPulldown2');
			select2.empty();
			_rmval = val1;
			_setId = 'opt2_';
			selectedId = val2;
		}else {
			_select = document.getElementById('js-sortbox-sortPulldown1');
			select1.empty();
			_rmval = val2;
			_setId = 'opt1_';
			selectedId = val1;
		}
		if(_setId === 'opt2_') {
			var _opt = new Option('指定なし', '99');
			_opt.id = _setId+'99';
			_select.options.add(_opt);
		}
		/* jshint noempty:false */
		$('#FR301FK0041_OPTIONS li').each(function(){
			var basicId = $(this).attr('id');
			var basicVal = $(this).html();
			if((_rmval === '00' || _rmval === '01') && (basicId === '00' || basicId === '01')) {
			}else if((_rmval === '06' || _rmval === '07') && (basicId === '06' || basicId === '07')) {
			}else if(basicId !== _rmval) {
				var _opt = new Option(basicVal, basicId);
				_select.options.add(_opt);
				_opt.id = _setId+basicId;
				if(selectedId === basicId) {
					_opt.selected = true;
				}
			}
		});
		/* jshint noempty: true */
	},
	removeQueryParams2: function(params,query){
		var regExp = new RegExp ('(&?)(' + params + ')=([^&]*)', 'g');
		var result = query.replace(regExp, '');
		result = result.replace('?&', '?');
		return result;
	},
	kobetsuShiryoSanPostAction: function(bckValue) {
		var form = $('#js-bcSpanList').empty();
		form.append('<input type="hidden" name="bck" value="' + bckValue + '"/>');
		$('#js-shiryouseikyuForm').submit();
	},
	clickJokenButton: function(resetFlag) {
		if (suumo.frList.clickFlg === true) {
			return false;
		}
		suumo.frList.clickFlg = true;
		$.ajax({
			type: 'POST',
			url: '/jj/chintai/common/frBukkenKensakuPanel01/searchKodawari2/',
			data: $('#js-searchPanel,#js-sub-lightboxParam').serialize(),
			success: function(msg) {
				if (resetFlag === false) {
					suumo.frList.lightbox.open({
						msg: msg
					});
				} else {
					suumo.frList.jokenLightBoxPanelInit(msg);
				}
				suumo.frList.clickFlg = false;
				$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
			},
			error: function() {
				suumo.frList.clickFlg = false;
				alert('error');
			}
		});
	},
	clickKoshaJokenButton : function() {
		$.ajax({
			type : 'POST',
			url : '/jj/chintai/common/FR301FK401/searchKodawari/',
			data : $('#js-searchPanel,#js-sub-lightboxParam').serialize(),
			success : function(msg) {
				suumo.frList.lightbox.open({
					'msg': msg
				});
				suumo.frList.jokenAddLightBoxInit(msg);
				$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
			},
			error : function() {
				alert('error');
			}
		});
	},
	// sdパラメータ捻じ曲げ処理
	shubetsuSdPost : function() {
		// sdパラメータ除去判断（tsが一つではない場合除去）
		var tsCnt = $('#js-searchpanel-tatemonoshurui-panel :checked').length;
		if (tsCnt !== 1) {
			$('#js-sd').attr('disabled', 'disabled');
		}
	},
	// sdパラメータ捻じ曲げ処理
	searchPanelShubetsuSdPost : function() {
		// sdパラメータ除去判断（tsが一つではない場合除去）
		var tsCnt = $('#js-searchpanel-designateitem-panel :checked').length;
		if (tsCnt !== 1) {
			$('#js-searchPanel-sd').attr('disabled', 'disabled');
		}
	},
	openWindow : function (url,w,h,n) {
		var LeftPosition = (screen.width) ? (screen.width-w)/2 : 0;
		var TopPosition = (screen.height) ? (screen.height-h)/2 : 0;
		var settings ='height='+h+',width='+w+',toolbar='+1+',top='+TopPosition+',left='+LeftPosition+',scrollbars='+1+',menubar='+1+',location='+1+',status='+1+',resizable';
		var win = window.open(url,n,settings);
		win.focus();
	},

	/**
	 * お気に入りから削除処理
	 *
	 * @param obj 「追加済み」ボタン
	 */
	deleteClipSingle : function(obj) {
		if (suumo.frList.COMMON.mySubmitfunc()) {
			var $btnObj = $(obj);
			var clipkey = $btnObj.parents('.property_unit, .js-property').find('.js-clipkey').attr('value');
			if (clipkey === undefined) {
				clipkey = $btnObj.parents('.js-bukkenCassette').find('.js-clipkey').attr('value');
			}
			var msg = '';
			if(clipkey !== '' && clipkey !== undefined) {
				$.ajax({
					type : 'GET',
					data : 'clipkey=' + clipkey,
					url : '/jj/common/function/JJ901FL022/delete/',
					dataType : 'json',
					success : function(data){
						if (data && data.statusCode && data.statusCode === '200' && data.results) {
							if (data.results.myListBkn) {
								suumo.headerfooter.noticeCnt({
									targetID : '#js-mylistbarcnt-bukken',
									value : data.results.myListBkn.cnt
								});

								suumo.headerfooter.setCookie({
									name : 'mylist_bukken_cnt',
									value : data.results.myListBkn.cookieInfo
								});
							}
							if (data.results.myListKsh) {
								suumo.headerfooter.noticeCnt({
									targetID : '#js-mylistbarcnt-company',
									value : data.results.myListKsh.cnt
								});

								suumo.headerfooter.setCookie({
									name : 'mylist_kaisha_cnt',
									value : data.results.myListKsh.cookieInfo
								});
							}
							msg = data.msg;
							$btnObj.removeClass('is-inactive');
						} else {
							msg = 'お気に入り削除に失敗しました。';
						}
						suumo.frList.COMMON.showResult(suumo.frList.COMMON.mylistPopTemplate(msg));
					},
					timeout:10000,
					error : function(data, textStatus) {
						if (textStatus === 'timeout') {
							msg = '一定時間経過した為、お気に入り削除処理を終了しました。';
						} else {
							msg = 'お気に入り削除に失敗しました。';
						}
						suumo.frList.COMMON.showResult(suumo.frList.COMMON.mylistPopTemplate(msg));
					}
				});
			} else {
				msg = '削除が行えませんでした。';
				suumo.frList.COMMON.showResult(suumo.frList.COMMON.mylistPopTemplate(msg));
			}
		}
	},

	/**
	 * お気に入り削除時のポップアップ用のテンプレートを取得
	 *
	 * @param msg ポップアップメッセージ
	 */
	mylistPopTemplate : function(msg) {
		return '<div class="mylist_pop"><p class="mylist_pop-txt">' + msg + '</p></div>';
	}
};

/**
 * [mylistSingleAjaxResponseSuccessFunc お気に入りボタン用]
 *
 * @param {[String]}
 *            msg レスポンス結果.
 */
suumo.frList.mylistSingleAjaxResponseSuccessFunc = function(msg) {
	suumo.frList.COMMON.showResult(msg);
	suumo.headerfooter.updateHeaderMylistCnt('#js-mylistBukkenPopCount', '#js-mylistbarcnt-bukken', 'mylist_bukken_cnt', '#js-mylistBukkenPopCookie');
	suumo.headerfooter.updateHeaderMylistCnt('#js-mylistKaishaPopCount', '#js-mylistbarcnt-company', 'mylist_kaisha_cnt','#js-mylistKaishaPopCookie');
	var $addMyListTaishouBtn = $('#js-addMyListTaishou');
	$addMyListTaishouBtn.removeAttr('id');
	if ($('#js-mylistBukkenPopCount')[0] === undefined && $('#js-mylistKaishaPopCount')[0] === undefined) {
		return;
	}
	$addMyListTaishouBtn.addClass('is-inactive');
};

suumo.frList.areaEnsenLightBoxPanelInit = function(data) {
	$('#js-lightbox-window').html(data);
	$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
	// 対象のチェックボックスにチェックを付ける
	$('.js-checkall').each(function() {
		suumo.frList.checkAllCheckbox({
			'triggerID' : this,
			'targetClass' : '#js-' + $(this).attr('id') + '-panel .js-checkSingle'
		});
	});
};
// 条件変更ライトボックスパネルの初期化
suumo.frList.jokenLightBoxPanelInit = function(data) {
	var lightboxInnerScrollTop = $('#js-lightbox-inner').scrollTop();
	$('#js-lightbox-window').html(data);
	$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
	$('#js-lightbox-inner').scrollTop(lightboxInnerScrollTop);
};

/**
 * [cassetteLink 物件カセットまるごとリンク]
 * @param  {Object} e       eventオブジェクト.
 * @param  {Object} obj     対象カセットオブジェクト.
 * @param  {Object} options 飛び先urlのあるaタグのクラス.
 */
suumo.frList.cassetteLink = function(e, obj, options){
	var targetHref = $(obj).find(options.anchor).attr('href');
	var $target = $(e.target);
	if ($target.parents().hasClass('js-linkSuppresser') && $target.hasClass('js-linkImage') === false || $target.hasClass('js-linkSuppresser')) {
		e.preventDefault();
		return;
	} else if ($target.hasClass('js-noCassetteLink')) {
		return true;
	} else {
		e.preventDefault();
	}

	if ($target.parents().hasClass('js-normalLink') || $target.hasClass('js-normalLink')) {
		location.href = targetHref;
	} else {
		window.open(targetHref, '', '');
	}
};
suumo.frList.msgArr = {
	shiryouMessage0:'物件が選択されていません。問い合わせしたい物件を選択してください。',
	shiryouMessage1:'物件が31件以上選択されています。同時に問い合わせできるのは最大30件となります。',
	shiryouMessage2:'チェックボックスが11個以上選択されています。\r\n（まとめて詳細表示は10物件まで可能です）'
};
// 既存修正関数
// イベントバインドをhtmlへ移動し、関数を命名し、名前空間でラッピングしました。
// http://wwwtst.suumo.jp/jj/jjcommon/js/chintai_ichiran.js
// まとめて資料請求チェック用
suumo.frList.reqLumpInfo = function() {
	var form = $('#js-bcSpanList').empty();
	var $checkbox = $('#js-bukkenList').find('.js-ikkatsuCB:checkbox[checked]');
	var count = 0;
	$checkbox.each(function(){
		var id = this.id;
		var flag = id.split('_');
		if(flag.length === 2) {
			var bck = $('#kskbnId').val() + '_' + this.value;
			form.append('<input type="hidden" name="bck" value="' + bck + '"/>');
			//住戸代表物件コード
			if($(this).hasClass('js-ikkatsuDBC') ===true){
				form.append('<input type="hidden" name="dbc" value="' + this.value + '"/>');
			}
			count += 1;
		}
	});
	if(count === 0) {
		alert(suumo.frList.msgArr.shiryouMessage0);
		return false;
	} else if(count > 30) {
		alert(suumo.frList.msgArr.shiryouMessage1);
		return false;
	} else {
		$('#js-shiryouseikyuForm').submit();
	}
};

/**
 * [reqSingleInfo 1物件（カセット）の情報をsubmitする]
 * @param  {Object} options.$submitForm submitするform要素
 * @param  {Object} options.$submitList submit対象の物件情報をinput要素でまとめたもの
 * @param  {Object} options.$checkbox チェックボックス要素 
 * @param  {Object} options.$clickTarget クリックした要素
 * @return  {void} 返り値なし
 */
suumo.frList.reqSingleInfo = function(options) {
	var $form = options.$submitList.empty();
	var $checkbox = options.$checkbox;
	var id = $checkbox.attr("id");
	var flag = id.split('_');
	var bck = $('#kskbnId').val() + '_' + $checkbox.val();
	if(flag.length === 2) {
		$form.append('<input type="hidden" name="bck" value=' + bck + '>');
		// 住戸代表物件コード
		// 2016年7月～11月で使用されておりましたが、現在は利用されておりません
		if($checkbox.hasClass('js-ikkatsuDBC') === true){
			$form.append('<input type="hidden" name="dbc" value="' + $checkbox.val() + '"/>');
		}
	}
    options.$submitForm.submit();
};

//http://wwwtst.suumo.jp/jj/jjcommon/js/xfr.js
suumo.frList.searchFw = function(url) {
	var fwValue = $('#keyword').val();
	if(fwValue !== '') {
		url = url + '&' + $('#keyword').serialize();
		location.href = url;
	} else {
		return false;
	}
};

// 既存修正関数
// DOM構造が変化したため取得するクラス/id名を変更しました。
// $('#form2 :input[name=kskbn]').val(); -> $('#js-leftColumnForm :input[name=kskbn]').val();
// http://wwwtst.suumo.jp/jj/jjcommon/js/xfr.js
/**
 * 資料請求するJavaScript
 * BJBchenys
 */
// 2009/11/11 yingwy Start
//var submitted = false;
suumo.frList.shiryoSanPost = function(kckvalue) {
//if(submitted){
//  return false;
//}else{
	var form = $('#js-kckSpanList').empty();
	if(kckvalue === 0){
		var kskbn = $('#js-leftColumnForm :input[name=kskbn]').val();
		var checkboxs =  $('.dataTable').find('input:checkbox[checked]');
		var len = checkboxs.size();
		if(len === 0)
			{alert(suumo.frList.msgArr.shiryouMessage0); return false;}
		else if(len > 30)
			{alert(suumo.frList.msgArr.shiryouMessage1); return false;}
		else {
			$.each(checkboxs, function(){
				var kckvalue = kskbn + '_' + $(this).val();
				form.append('<input type="hidden" name="kck" value="' + kckvalue + '"/>');
			});
		}
	}else{
		form.append('<input type="hidden" name="kck" value="' + kckvalue + '"/>');
	}
	$('#js-shiryouseikyuForm').submit();
//}
};
// 2009/11/11 yingwy End

// 既存修正関数
// イベントバインドをhtmlへ移動し、関数を命名し、名前空間でラッピングしました。
// DOM構造が変わったためそれに合わせて取得するクラス名を変更しました。
// $('.data_table .hoverOrange') -> $('.data_table .property_unit, .js-property')
// http://wwwtst.suumo.jp/jj/jjcommon/js/chintai_ichiran.js
// まとめて物件詳細チェック人気条件引き継ぎなし用
suumo.frList.frDefDetail = function(url) {
	url = suumo.frList.COMMON.removeQueryParams2( 'nj', url );
	var $checkbox = $('.data_table .property_unit, .js-property').find('input:checkbox[checked]');
	if($checkbox.length === 0) {
		alert(suumo.frList.msgArr.shiryouMessage0);
		return false;
	} else if($checkbox.length > 10) {
		alert(suumo.frList.msgArr.shiryouMessage2);
		return false;
	} else {
		location.href = url + '&' + $('.data_table, #js-bukkenList').find('input:checkbox[checked]').serialize();
	}
};

// 既存修正関数
// イベントバインドをhtmlへ移動し、関数を命名し、名前空間でラッピングしました。
// http://wwwtst.suumo.jp/jj/jjcommon/js/chintai_ichiran.js
suumo.frList.dispCntChange = function(opt_obj) {
	// 新旧テンプレのID差異を吸収
	var path, $ancher;
	$ancher = $('#pcLink');
	if($ancher.length === 0){
		$ancher = $('#js-pcLink');
	}
	path = $ancher.attr('href');

	var query = suumo.frList.COMMON.removeQueryParams2('pc|page', path);
	var actionUrl = query + '&pc=' + $(opt_obj).val();
	location.href = actionUrl;
};

// 特定条件下での遷移
suumo.frList.dispCntChangeDse = function(opt_obj) {
	var path = location.href;
    var query = suumo.frList.COMMON.removeQueryParams2('pc|page', path);
	var last = query.substr(query.length-1,1);
	var actionUrl;
	var unite;

    if (last === '/') {
    	unite = '?';
    } else if (last === '?') {
    	unite = '';
    } else {
    	unite = '&';
    }
	actionUrl = query + unite +'pc=' + $(opt_obj).val();
    location.href = actionUrl;
};

//（会社一覧）の表示件数切り替えの関数
suumo.frList.kaishaDispCntChange = function(opt_obj) {
	// 新旧テンプレのID差異を吸収
	var path, $ancher;
	$ancher = $('#pcLink');
	if($ancher.length === 0){
		$ancher = $('#js-pcLink');
	}
	path = $ancher.attr('rel');

	var query = suumo.frList.COMMON.removeQueryParams2('pc|page', path);
	var actionUrl = query + '&pc=' + $(opt_obj).val();
	location.href = actionUrl;
};

// 既存修正関数
// scrollイベントに名前空間を付与しました。
// http://wwwtst.suumo.jp/jj/jjcommon/js/jquery.suumo_frPremiumBanner.js
/*
 * suumo.jp - jQuery Top Slide banner Plugin
 */

(function(jQuery){
	jQuery.fn.suumoPremiumBanner=function(options){
		var defaults={moveSpeed : 300, content : '#bannerContent', closeBtn : '#bannerClose', firstFlg : '1', successFlg : '0'};
		var settings=jQuery.extend({}, defaults, options);
		var mainColumnTrigger = {trigger : '.js-bannerTrigger5'};
		settings=jQuery.extend({}, mainColumnTrigger, settings);
		var subColumnTrigger = '.js-bannerTrigger';

		return this.each(function(){
			//init Properties
			var $win=jQuery(window);
			var winW=$win.width();
			var winH=$win.height();
			var $bannerPanel=jQuery(this);
			var $bannerTrigger=jQuery(settings.trigger + ',' + subColumnTrigger);
			var $bannerContent=jQuery(settings.content);

			//Initialization Panel UI
			function initPanel(){
				if(typeof document.documentElement.style.maxHeight !== 'undefined'){
					$bannerPanel.css({ 'position':'fixed','bottom':'70px','right':'20px' });
				}
			}
			initPanel();

			//Whick trigger has setted ID
			if(typeof document.documentElement.style.maxHeight !== 'undefined'){
				$win.bind('scroll.reco',function(){
					var distanceFromArray = [];
					$bannerTrigger.each(function(index) {
						distanceFromArray[index]=$(this).offset().top - winH + 240;
					});
					var distanceFrom = Math.max.apply(null, distanceFromArray);
					if($win.scrollTop() > distanceFrom){
						if(settings.firstFlg === '1'){
							settings.firstFlg='0';
							jQuery.ajax({
								type:'POST',
								url:settings.ajaxurl,
								data:jQuery('#'+settings.ajaxdata).serialize(),
								success:function(msg){
									$bannerContent.html(msg);
									if($bannerContent.find('img').length !== 0){
										if($win.scrollTop() > distanceFrom){
											$bannerPanel.fadeIn(settings.moveSpeed);
										}
										settings.successFlg='1';
									}else{
										$bannerPanel.remove();
										$win.unbind('scroll.reco').unbind('resize');
									}
								}
							});
						}else if(settings.successFlg === '1'){
							$bannerPanel.fadeIn(settings.moveSpeed);
						}
					}else{
						$bannerPanel.fadeOut(settings.moveSpeed);
					}
				}).bind('resize',function(){
					winW=$win.width();
					winH=$win.height();
					initPanel();
				});

				//Click to close banner panel
				jQuery(settings.closeBtn).bind('click',function(){
					$bannerPanel.remove();
					$win.unbind('scroll.reco').unbind('resize');
					document.cookie='FR_DISABLE_PREM_BANNER=true;path=/;';
				});

				//Initialization Panel
				$win.scroll();
			}
		});//End of this.each()
	};//End of suumoSlideBannerTop() method
})(jQuery);

/**
 * [lightbox ライトボックス用オブジェクト]
 * @constructor
 */
suumo.frList.lightbox = {};

/**
 * [open ライトボックスの起動]
 * @param  {Object} options ライトボックスに入れる中身、サイズなど.
 * @example
 * suumo.frList.lightbox.open({
 *     'msg': msg,
 *     'width': 830, // 省略可（defaultはCSSのまま）
 *     'height': 500 // 省略可（defaultはCSSのまま）
 * });
 */
suumo.frList.lightbox.open = function(options) {
	var $backLayer, $lightboxWindow, styles = [];

	if (options.width !== undefined) {
		styles.width = options.width;
		styles.marginLeft = -(options.width / 2);
	}
	if (options.height !== undefined) {
		styles.height = options.height;
		styles.marginTop = -(options.height / 2);
	}

	$backLayer = $('<div id="js-lightbox-overlay" class="lightbox_overlay js-lightbox-close" />')
	.css('opacity', 0.7)
	.fadeIn(200);

	$lightboxWindow = $('<div id="js-lightbox-window" class="lightbox_window" />')
	.css(styles)
	.html(options.msg)
	.fadeIn(350);

	$('body').append($backLayer).append($lightboxWindow);
};

/**
 * [close ライトボックスを閉じる]
 */
suumo.frList.lightbox.close = function() {
	var $backLayer = $('#js-lightbox-overlay');
	var $lightboxWindow = $('#js-lightbox-window');

	$backLayer.fadeOut(200, function() {
		$backLayer.remove();
	});
	$lightboxWindow.fadeOut(200, function() {
		$lightboxWindow.remove();
	});
};

//選択変更後の条件で絞り込んだ物件件数で画面の物件件数を再表示
suumo.frList.getAjaxResult = function (url,formId,jspId) {
	var param = $(formId).serialize();
	var syncFun = function(msg){
		$(jspId).html(msg);
	};
	this.syncAjax(url,param,syncFun);
};
suumo.frList.syncAjax = function(url,param,syncFunction){
	$.ajax({
		type:'POST',
		url:url,
		data:param,
		success:function(msg){
			if(typeof syncFunction === 'function') {
				syncFunction(msg);
			}
		}
	});
};

//指定した検索条件で、物件を検索する
suumo.frList.tbJokenSearch = function (formId) {
	var form = document.getElementById(formId);
	form.submit();
};

//doTurnback
//
suumo.frList.doTurnback = function (url) {
	var tnbkFrm = document.getElementById('js-turnbackPostForm');
	tnbkFrm.action = url;
	tnbkFrm.submit();
	return false;
};
suumo.frList.doSubmitFw = function (formId, actionUrl, trg, fwValue) {
	var form = document.getElementById(formId);
	var name = trg.name;
	if (name === 'tfClear') {
		form.ta.disabled = 'disabled';
		form.sc.disabled = 'disabled';
		if (form.oz != null) {
			form.oz.disabled = 'disabled';
		}
	}
	if (name === 'scClear') {
		form.sc.disabled = 'disabled';
		if (form.oz != null) {
			form.oz.disabled = 'disabled';
		}
	}
	if (name === 'ozClear') {
		form.oz.disabled = 'disabled';
	}
	if (name === 'rnClear') {
		form.rn.disabled = 'disabled';
		form.ek.disabled = 'disabled';
	}
	if (name === 'ekClear') {
		form.ek.disabled = 'disabled';
	}
	suumo.frList.COMMON.doSubmit(formId, actionUrl, trg, fwValue);
};
//検索条件登録処理
/**
 * [frListkensakuJokenTouroku 検索条件登録処理]
 */
suumo.frList.kensakuJokenTouroku = function (){
	$('.kensakujokenmail').attr({value:$('#js-lightbox-kensakuJokenMail').attr('value')});
	$.ajax({
		type:'POST',
		url :'/jj/common/function/JJ901FL008/',
		data:$('#js-kensakuJokenTorokuForm').serialize(),
		success:function(msg){
			var form = document.getElementById('js-kensakuJokenTorokuForm');
			var style = 'width=650,height=236,toolbar=0,location=0,status=0,menubar=1,scrollbars=1,resizable=1';
			var trimedMessage = suumo.frList.COMMON.trimMessage(msg);
			if(trimedMessage == null || trimedMessage === ''){
				var popup = window.open('' ,'clipPopup', style);
				form.target = popup.name;
				form.action = '/jj/common/function/JJ901FL008/';
				$('.seaf_change').attr({value:22});
				form.submit();
				suumo.frList.lightbox.close();
			}else{
				$('#js-kensakuJokenMailError').show();
				$('#js-kensakuJokenMailError').html(trimedMessage);
			}
			suumo.frList.COMMON.submittedFlg = false;
		},
		//エラーの場合
		error:function(){
			suumo.frList.COMMON.submittedFlg = false;
		}
	});
};

suumo.frList.checkSubmit = function(form, countId) {
	if ($.trim($(countId).html()) === '0') {
		return false;
	} else {
		var myPageUrl = $('#' + form).find(':input[name=myPageUrl]');
		if (null != myPageUrl) {
			myPageUrl.remove();
		}
		$('#' + form).submit();
	}
};
/**
 * [scrollLazyDepth scrollLazyでのスクロール数保持]
 * @type {Number}
 */
suumo.frList.scrollLazyDepth = 0;

/**
 * [scrollLazy 縦ウィンドウサイズに合わせての画像取得]
 * @param  {Object} options ターゲットのクラス名(options.className).
 * @return {Boolean}   falseを返す.
 */
suumo.frList.scrollLazy = function(options) {
	var $target = $('.' + options.className);
	var $win = $(window);
	var count = $target.length;
	if (count === 0) {
		// ターゲットが0個ならアンバインド
		$win.unbind('scroll.lazy');
		return false;
	}

	var $loadImg;
	var loadImgHeight;
	var border = $win.scrollTop() + $win.height() * 2;
	if (border <= suumo.frList.scrollLazyDepth) {
		// 一度スクロールした位置までの表示ならリターン
		return;
	}
	suumo.frList.scrollLazyDepth = border;
	for (var i = 0; i < count; i++) {
		$loadImg = $target.eq(i);
		loadImgHeight = $loadImg.offset().top;
		if (loadImgHeight >= border) {
			// ターゲット画像がボーダーより下位置なら次ループ処理へ
			continue;
		}
		$loadImg.attr('src', $loadImg.attr('rel'));
		$loadImg.removeClass(options.className);
	}
	return false;
};
/**
 * [slideLazy 一覧カセットのスライドボタン押下時の画像取得]
 *
 * @param {[Object]}
 *            obj クリックされたボタン要素.
 * @return {[Boolean]} falseを返す.
 */
suumo.frList.slideLazy = function(obj) {
	var $loadImg;
	var $imgList = $('#' + $(obj).attr('rel'));
	var $target = $imgList.find('.js-slideLazy');
	var count = $target.length;
	var jadgeVal;
	for ( var i = 0; i < count; i++) {
		$loadImg = $target.eq(i);
		jadgeVal = $loadImg.attr('rel');
		if (jadgeVal !== undefined ) {
			$loadImg.attr('src', $loadImg.attr('rel'))
			.removeAttr('rel')
			.removeClass('js-slideLazy');
		}
	}
	return false;
};

/**
 * [adjustImg 画像の高さ幅の返還とマージントップ調整]
 * @param  {Object} options ターゲット(options.target).
 * @param  {Object} options ターゲットの最大幅(options.width).
 * @param  {Object} options ターゲットの最大高さ(options.height).
 * @param  {Object} options ターゲットの枠組みの調整する高さ(options.frameHeight).
 */
suumo.frList.adjustImg = function(options) {
	var $target = $(options.target);
	var $img;
	var maxWidth = options.width;
	var maxHeight = options.height;
	var width, height, diameter;
	var frameHeight = options.frameHeight;
	var imgCount = $target.length;

	for (var i = 0; i < imgCount; i++) {
		$img = $target.eq(i);
		$img.removeAttr('width');
		$img.removeAttr('height');
		width = $img.width();
		height = $img.height();
		diameter = 1;

		// 幅縮小倍率計算
		if (width > maxWidth) {
			diameter = maxWidth / width;
		}

		// 高さ縮小倍率計算
		if (height * diameter > maxHeight) {
			diameter = maxHeight / height;
		}

		// 画像のマージントップ計算
		var marginTop = 0;
		if (frameHeight !== undefined ) {
			marginTop = (frameHeight - height * diameter) / 2;
		}

		// 幅と高さとマージントップの適用
		$img.attr({
			width: width * diameter,
			height: height * diameter
		}).css({
			marginTop: marginTop
		});
	}
};

/**
 * [carrousel おすすめカルーセル]
 *
 * @param {Object}
 *            obj 各要素の指定とduration.
 */
suumo.frList.carrousel = function(obj) {
	var $e = $(obj.innerId); // カルーセルの要素
	var $f = $(obj.nextId); // nextBtn
	var $h = $(obj.prevId); // prevBtn
	var g = obj.speed; // animate duration
	var b = 1;
	var c = $('.recSection', $e).size();
	var a = $('.recSection', $e).width();
	// width値を入れる
	$e.css('width', a * (c + 1) + 'px');
	// prevBtnをまず隠す
	$h.hide();
	if (1 >= c) {
		$f.hide();
	}
	// nextBtnクリック時
	$f.bind('click', function() {
		if (b < c) {
			b++;
			$e.animate({
				left : (a * (b - 1)) * -1
			}, g, function() {
				if (b === c) {
					$f.hide();
				}
				$h.show();
			});
		}
		suumo.frList.accessPrint('next');
		return false;
	});
	// prevBtnクリック時
	$h.bind('click', function() {
		if (1 < b) {
			b--;
			$e.animate({
				left : (a * (b - 1)) * -1
			}, g, function() {
				if (b === 1) {
					$h.hide();
				}
				$f.show();
			});
		}
		suumo.frList.accessPrint('prev');
		return false;
	});
};
/**
 * [scrollNum オススメの物件カルーセルスライド物件数保持]
 * @type {Number}
 */
suumo.frList.scrollNum = 0;
/**
 * [accessPrint オススメの物件カルーセル行動履歴]
 *
 * @param {Object}
 *            scrollWay 起動時のトリガー.
 */
suumo.frList.accessPrint = function(scrollWay) {
	/* jshint noempty:false */
	var type = '';
	if (scrollWay === 'next') {
		suumo.frList.scrollNum++;
		type = 'CL';
	} else if (scrollWay === 'first'){
		type = 'IP';
	} else {
		suumo.frList.scrollNum--;
		type = 'CL';
	}
	/* jshint noempty:true */
	var url;
	if ($('#js-searchCarouselForm').length > 0) {
		url = $('#js-searchCarouselForm').val().unEscapeHTML();
	}
	if ($('#js-repeatCarousel-mediaBoxBukken0').length > 0) {
		var i = suumo.frList.scrollNum * 3;
		var j = i + 3;

		while(i < j) {
			if($('#js-repeatCarousel-mediaBoxBukken'+i).length > 0) {
				url = url + '&bc=' + $('#js-repeatCarousel-mediaBoxBukken'+i).html().trim();
			}
			i++;
		}
		var accessPrintFun = function(msg){return null;};
		this.syncAjax(url,null,accessPrintFun);
	}
};

/**
 * [placeholderEvent プレースフォルダー制御]
 *
 * @param {Object} options 対象DOM設定.
 * @example
 * suumo.frList.placeholderEvent({
 *     // targetID トリガーとなるチェックボックス.
 *     targetID: '#js-keywordSearchText'
 * });
 *
 */
suumo.frList.placeholderEvent = function(options) {
	if ('placeholder' in document.createElement('input')) {
		return false;
	}
	suumo.frList.placeholderEvent = function(options) {
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
	suumo.frList.placeholderEvent(options);
};

/**
 * [ placeholderClear プレースフォルダー制御（削除） ]
 * @param {[string]} options.targetID 値削除対象.
 */
suumo.frList.placeholderClear = function(options) {
	var $target = $(options.targetID);
	var placeholderVal = $target.attr('placeholder');
	if ($target.val() === placeholderVal) {
		$target.val('');
	}
};

/**
 * [removePulldownList プルダウンリスト削除処理]
 *
 * @param {[String]}
 *            options.target トリガーとなるプルダウンリスト
 * @param {[String]}
 *            options.targetRmOpt 削除対象のプルダウンリスト項目
 */
suumo.frList.removePulldownList = function(options) {
	var selectVal = $(options.target).val();
	var rmOpt = options.targetRmOpt;

	if(selectVal === '00' || selectVal === '01') {
		$(rmOpt + '00').remove();
		$(rmOpt + '01').remove();
	}
	else if(selectVal === '06' || selectVal === '07') {
		$(rmOpt + '06').remove();
		$(rmOpt + '07').remove();
	}
	else if(selectVal !== '99' ) {
		$(rmOpt + selectVal).remove();
	}
};

/**
 * [showBigImage 拡大画像を表示]
 * @param {Object} options トリガーとなる要素, 閉じるかどうか.
 */
suumo.frList.showBigImage = function(options) {
	var targetID = $(options.obj).attr('rel');
	var $target = $('#' + targetID);

	if (options.close === true) {
		// 拡大を閉じる
		$target.addClass('dn');
		return;
	}
	$target.removeClass('dn');
};

/**
 * [allAddMyList まとめてマイリスト登録処理(会社/個社)]
 */
/* jshint maxdepth:4 */
suumo.frList.allAddMyList = function() {
	if (suumo.frList.COMMON.mySubmitfunc()) {
		$('#hidden_post').html('');
		$('#clipMailError').html('&nbsp;');
		$('#CLIP_MAIL').attr({
			value : ''
		});
		if (login) {
			$('.mail_clp_change').attr({
				value : CLIP_KAIIN
			});
		} else {
			$('.mail_clp_change').attr({
				value : CLIP_HIKAIIN
			});
		}
		var objDiv = document.getElementById('hidden_post');
		var grchk = $('.js-ikkatsuCB:checkbox[checked]');
		var cnt = 0;
		for(var i=0;i<grchk.size();i++){
			if(grchk.get(i).checked) {
				var val = $(grchk.get(i)).siblings('.js-clipkey').attr('value');
				if (val !== '' && val !== undefined) {
					suumo.frList.COMMON.createClipkey(objDiv, val);
					++cnt;
				}
			}
		}
		if (cnt > 0) {
			suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL007/', '#js-addMylistForm');
		} else {
			var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録対象が選択されていません。</p></div>';
			suumo.frList.COMMON.showResult('',chkMsg);
		}
	}
};

/**
 * [addMyListSingle マイリスト登録処理(会社/個社用)]
 */
suumo.frList.addMyListSingle = function(obj) {
	if (suumo.frList.COMMON.mySubmitfunc()) {
		$('#hidden_post').html('');
		$('#clipMailError').html('&nbsp;');
		$('#CLIP_MAIL').attr({
			value : ''
		});
		if (login) {
			// 会員：検索条件登録
			$('.mail_clp_change').attr({
				value : CLIP_KAIIN
			});
		} else {
			// 非会員：検索条件登録
			$('.mail_clp_change').attr({
				value : CLIP_HIKAIIN
			});
		}
		// キー情報の取得
		var val = $(obj).parents('.js-bukkenCassette').find('.js-clipkey').attr('value');

		// キー情報の取得結果により表示振分
		if(val !== '' && val !== undefined) {
			var objDiv = document.getElementById('hidden_post');
			// 送信キー情報作成
			suumo.frList.COMMON.createClipkey(objDiv, val);
			// 非画面Ajax送信
			suumo.frList.COMMON.ajaxSend('/jj/common/function/JJ901FL007/', '#js-addMylistForm');
		} else {
			var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録が行えませんでした。</p></div>';
			suumo.frList.COMMON.showResult('',chkMsg);
		}
	}
};

/**
 * [shiryoSanPostKaisha 問い合わせ登録処理(会社用)]
 */
suumo.frList.shiryoSanPostKaisha = function(kckvalue) {
	var form = $('#js-kckSpanList').empty();
	if(kckvalue === 0){
		var kskbn = $('#js-leftColumnForm :input[name=kskbn]').val();
		var checkboxs = $('.js-ikkatsuCB:checkbox[checked]');
		var len = checkboxs.size();
		if(len === 0) {
			var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録対象が選択されていません。</p></div>';
			suumo.frList.COMMON.showResult('',chkMsg);
			return false;
		} else if(len > 30) {
			alert(suumo.frList.msgArr.shiryouMessage1);
			return false;
		} else {
			$.each(checkboxs, function(){
				var kckvalue = kskbn + '_' + $(this).val();
				form.append('<input type="hidden" name="kck" value="' + kckvalue + '"/>');
			});
		}
	} else {
		form.append('<input type="hidden" name="kck" value="' + kckvalue + '"/>');
	}
	$('#js-shiryouseikyuForm').submit();
};

/**
 * [allDispDetaileInfo まとめて物件詳細遷移処理(個社用)]
 */
suumo.frList.allDispDetaileInfo = function(url) {
	url = suumo.frList.COMMON.removeQueryParams2( 'nj', url );
	var $checkbox = $('.js-ikkatsuCB:checkbox[checked]');
	if($checkbox.length === 0) {
		alert(suumo.frList.msgArr.shiryouMessage0);
		return false;
	} else if($checkbox.length > 10) {
		alert(suumo.frList.msgArr.shiryouMessage2);
		return false;
	} else {
		location.href = url + '&' + $checkbox.serialize();
	}
};

/**
 * [allShiryoSeikyu まとめて資料請求登録処理(個社用)]
 */
suumo.frList.allShiryoSeikyu = function() {
	var form = $('#js-bcSpanList').empty();
	var $checkbox = $('.js-ikkatsuCB:checkbox[checked]');
	var count = 0;
	$checkbox.each(function(){
		var id = this.id;
		var flag = id.split('_');
		if(flag.length === 2) {
			var bck = $('#kskbnId').val() + '_' + this.value;
			form.append('<input type="hidden" name="bck" value="' + bck + '"/>');
			count += 1;
		}
	});
	if(count === 0) {
		var chkMsg = '<div class="mylist_pop"><p class="mylist_pop-txt">登録対象が選択されていません。</p></div>';
		suumo.frList.COMMON.showResult('',chkMsg);
	} else if(count > 30) {
		alert(suumo.frList.msgArr.shiryouMessage1);
		return false;
	} else {
		$('#js-shiryouseikyuForm').submit();
	}
};

/**
 * [areaEnsenClear 賃貸会社検索パネルの学校コードパターン]
 */
/* jshint maxstatements:35, maxcomplexity:22 */
suumo.frList.areaEnsenClear = function(name) {
	if (name === null) {
		return false;
	}
	var $targetRn = $('#js-searchPanel :input[name=rn]');
	var $targetEk = $('#js-searchPanel :input[name=ek]');
	var $targetTa = $('#js-searchPanel :input[name=ta]');
	var $targetSc = $('#js-searchPanel :input[name=sc]');
	var rnVa = $targetRn.val();
	var ekVa = $targetEk.val();
	var taVa = $targetTa.val();
	var scVa = $targetSc.val();
	if (name === 'taClear') {
		$targetTa.attr('disabled','disabled');
		$targetSc.attr('disabled','disabled');
		if (rnVa == null || rnVa === '') {
			$targetRn.attr('disabled','disabled');
		}
		if (ekVa == null || ekVa === '') {
			$targetEk.attr('disabled','disabled');
		}
	} else if (name === 'scClear') {
		$targetSc.attr('disabled','disabled');
		if (rnVa == null || rnVa === '') {
			$targetRn.attr('disabled','disabled');
		}
		if (ekVa == null || ekVa === '') {
			$targetEk.attr('disabled','disabled');
		}
	} else if (name === 'rnClear') {
		$targetRn.attr('disabled','disabled');
		$targetEk.attr('disabled','disabled');
		if (taVa == null || taVa === '') {
			$targetTa.attr('disabled','disabled');
		}
		if (scVa == null || scVa === '') {
			$targetSc.attr('disabled','disabled');
		}
	} else if (name === 'ekClear') {
		$targetEk.attr('disabled','disabled');
		if (taVa == null || taVa === '') {
			$targetTa.attr('disabled','disabled');
		}
		if (scVa == null || scVa === '') {
			$targetSc.attr('disabled','disabled');
		}
	}
	$('#js-searchPanel').submit();
	return false;
};
/* jshint maxstatements:30, maxcomplexity:10 */

suumo.frList.clickFlg = false;

suumo.frList.openChangeConditionLightbox = function(target) {
	if (suumo.frList.clickFlg === true) {
		return false;
	}
	suumo.frList.clickFlg = true;

	var $form = $('#' + target);
	$.ajax({
		type: $form.attr('method'),
		url: $form.attr('action'),
		data: $form.serialize(),
		success: function(msg) {
			suumo.frList.lightbox.open({
				msg: msg
			});
			suumo.frList.areaEnsenLightBoxPanelInit(msg);
			suumo.frList.clickFlg = false;
			$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
		},
		error: function() {
			suumo.frList.clickFlg = false;
		}
	});
};

suumo.frList.toggleInactiveClass = function(options) {
	var targetClassChecked = $(options.targetClass + ':checked').length;
	var $target = $(options.targetId);
	if (targetClassChecked === 0) {
		$target.addClass('inactive');
	} else if ($target.hasClass('inactive')) {
		$target.removeClass('inactive');
	}
};

/**
 * [graphModalOpen 相場情報のmodal表示]
 * @param  {String} targetID モーダル表示したいDOM.
 */
suumo.frList.graphModalOpen = function (targetID) {
	var $modalBox = $(targetID);
	var $backLayer;

	$modalBox.addClass('is-active');

	// body全体を囲むDOM
	$backLayer = $('<div id="js-graphModal-overlay" class="graphmodal_overlay js-graphModal-close" />');

	// 表示中のモーダルを格納
	$backLayer.data('graphModal', $modalBox);

	$('body').append($backLayer);
};

/**
 * [graphModalClose 相場情報のmodalを非表示]
 */
suumo.frList.graphModalClose = function (){
	var $modalBox;
	var $backLayer = $('#js-graphModal-overlay');

	// 表示中のモーダルを取得
	$modalBox = $backLayer.data('graphModal');

	$modalBox .removeClass('is-active');
	$backLayer.remove();
};

/**
 * [adjustHeight グループの高さを揃える]
 * @param  {Object} $targetGroup 高さを揃えたいDOMのjQueryオブジェクトグループ.
 */
suumo.frList.adjustHeight = function ($targetGroup) {
	var height = 0;
	var tmpHeight;

	// 高さの最大値を取得
	$targetGroup.each(function(){
		tmpHeight = $(this).innerHeight();
		if(height < tmpHeight){
			height = tmpHeight;
		}
	});

	// 高さを設定
	$targetGroup.css('height', height + 'px');
};

/**
 * [setGraphDispVertical 棒グラフの幅を計算してセットする（縦グラフ）]
 *
 * @param {Object} options.targetID グラフ描画領域ID
 * @param {Object} options.maxWidth グラフの長さ（最大値）
 * @param {Object} options.minWidth グラフの長さ（最小値）
 */
suumo.frList.setGraphDispVertical = function(options) {
	var $graphData = $(options.targetID).find('.js-graph-data');
	var arData = [], $graph;
	var maxVal, minVal;
	var maxHeight = options.maxHeight;
	var minHeight = options.minHeight;
	var arrDuplicated =[];
	var isArrDuplicated = false;
	// 高さ最大値の初期値
	if(!maxHeight) {
		maxHeight = 235;
	}
	// 高さ最小値の初期値
	if(!minHeight) {
		minHeight = 66;
	}

	// グラフの値の最大、最小値を取得
	for(var i = 0, j = $graphData.length; i < j; i++) {
		arData[i] = Number($graphData.eq(i).attr('data-value'));
	}
	maxVal = Math.max.apply(null, arData);
	minVal = Math.min.apply(null, arData);

	// グラフが全て同じ値 or グラフがひとつしかない時 を判定
	arrDuplicated = suumo.frList.isDuplicated({
		arr: arData
	});
	if (arrDuplicated.length === 1) {
		isArrDuplicated = true;
	}

	// グラフサイズを算出
	for(i = 0, j = $graphData.length; i < j; i++) {
		$graph = $graphData.eq(i);
		// グラフの長さを設定
		$graph.find('.js-graph-data-target')
		.css({
			height: suumo.frList.getGraphVerticalSize({
				maxVal: maxVal,
				minVal: minVal,
				maxLength: maxHeight,
				minLength: minHeight,
				val: arData[i],
				isArrDuplicated: isArrDuplicated
			}) + 'px'
		});
	}
};

suumo.frList.isDuplicated = function(options) {
	return options.arr.filter(
		function (x, i, self) {
			return self.indexOf(x) === i;
		}
	);
};

/**
 * [getGraphVerticalSize 棒グラフの幅を計算してセットする]
 *
 * @param {Object} options.maxVal 値の最大値
 * @param {Object} options.minVal 値の最小値
 * @param {Object} options.maxLength 長さの最大値
 * @param {Object} options.minLength 長さの最小値
 * @return {Number} グラフの長さ
 */
suumo.frList.getGraphVerticalSize = function(options) {
	var height = 0;
	if (options.isArrDuplicated) {
		height = options.maxLength / 2;
	} else {
		height = (options.maxLength - options.minLength) / ((options.maxVal - options.minVal) / (options.val - options.minVal)) + options.minLength;
	}
	return height;
};

/**
 * [setCheckedCount チェック数の表示制御]
 *
 * @param {Object} options 引数オブジェクト
 * @param {Object} options.$target 物件リストのチェックボックス
 * @param {Object} options.$countNum 物件リストのチェック数を表示する場所
 * @return {Void} 特になし
 */
suumo.frList.setCheckedCount = function(options) {
	'use strict';
	var count = options.$target.filter(':checked').length;
	var $countNum = options.$countNum;

	if (count > 0) {
		$countNum.text(count);
	}
};

/**
 * [displayFixfooter 固定フッターの表示制御]
 *
 * @param {Object} options 引数オブジェクト
 * @param {Object} options.$countTarget 物件リストのチェックボックス
 * @param {Object} options.$target 固定フッター
 * @return {Void} 特になし
 */
suumo.frList.displayFixfooter = function(options) {
	'use strict';
	var $target = options.$target;
	var count = options.$countTarget.filter(':checked').length;

	if (count > 0) {
		$target.fadeIn(250);
	} else {
		$target.fadeOut(250);
	}
};

/**
 * [cautionDisplay 10件以上チェック時の注釈表示制御]
 *
 * @param {jQuery} $target ターゲット要素
 * @return {Void} 特になし
 */
suumo.frList.cautionDisplay = function($target) {
	'use strict';
	var $cautionElement = $('.js-fixinquiry_caution');
	var checkedCount = $target.filter(':checked').length;

	if(checkedCount > 9) {
		$cautionElement.show();
	} else {
		$cautionElement.hide();
	}
};

// FACE-13467 一覧カセットリニューアル フェーズ1
/*
 * [ サムネイル画像挙動 初期設定 ]
 * @param {object} options.targetID 制御対象のモジュールID
 */
suumo.frList.Modal = function(options){
	'use strict';

	var self = this;

	// 初期load設定
	self.$targetID = $(options.targetID);// 大枠

	self.$modalOverlay = self.$targetID.find(options.targetID + '-overlay');//js-view_gallery-overlay
	self.$modalView = self.$targetID.find(options.targetID + '-modalview');//js-view_gallery-modalview
	self.$modalSlickActive = self.$targetID.find('.' + self.$targetID.attr('id') + '-modalview_object');//js-view_gallery-modalview_object
	self.$modalViewList = self.$targetID.find(options.targetID + '-modalview_list');//js-view_gallery-modalview_list
	self.$modalViewLink = self.$targetID.find(options.targetID + '-modalview_link');//js-view_gallery-modalview_link

	// インデックス設定
	self.idx = 0;
	self.thumbIdx = 0;

	// インデックス最大数
	self.maxIdx = self.$modalViewList.children().length;
};
/*
 * [モーダル 表示/非表示]
 * @param {String} imgs 画像パス
 * @param {String} href 詳細リンク
 */
suumo.frList.Modal.prototype.toggleModal = function(imgs, href){
	'use strict';

	var self = this;

	if(self.$modalOverlay.hasClass(suumo.frList.constants.ACTIVE_CLASS)){
		self.$modalOverlay.removeClass(suumo.frList.constants.ACTIVE_CLASS);
		self.$modalView.removeClass(suumo.frList.constants.ACTIVE_CLASS);
		$('body').removeClass(suumo.frList.constants.NOSCROLL_CLASS);
		self.idx = 0;
	} else {
		self.$modalViewList.html('');
		self.$modalOverlay.addClass(suumo.frList.constants.ACTIVE_CLASS);
		self.$modalView.addClass(suumo.frList.constants.ACTIVE_CLASS);
		$('body').addClass(suumo.frList.constants.NOSCROLL_CLASS);
		self.createModalGallery(imgs, href);
	}
};

/*
 * [モーダル内　カルーセルギャラリー生成]
 * @param {String} imgs 画像パス
 * @param {String} href 詳細リンク
 */
suumo.frList.Modal.prototype.createModalGallery = function(imgs, href){
	'use strict';

	var self = this;

	var imgsArr = imgs.replace(/\s+/g, "").split(',');
	var append = '';

	self.maxIdx = imgsArr.length;
	for (var i = 0; i < self.maxIdx; i++) {
		append = '';
		append += '<li>\n';
		if (i === 0) {
			append += '    <div class="js-view_gallery-modalview_object modalview_object ' + suumo.frList.constants.ACTIVE_CLASS + '">\n';
		} else {
			append += '    <div class="js-view_gallery-modalview_object modalview_object">\n';
		}
		append += '        <div class="modalview_object-item js-lazyload is-loading">\n' +
					'            <img src="/edit/assets/suumo/img/fr_list_modal_now_print.png" data-src="' + imgsArr[i] + '" />\n' +
					'         </div>\n' +
					'         <div class="modalview_object-caption">\n' +
					'            <div class="modalview_object-caption-count"><span>' + (i + 1) + '</span>/<span>' + self.maxIdx + '</span></div>\n' +
					'        </div>\n' +
					'    </div>\n' +
					'</li>\n';
		self.$modalViewList.append(append);
	}
	self.$modalSlickActive = self.$targetID.find('.' + self.$targetID.attr('id') + '-modalview_object');
	// lazy load
	self.$modalViewList.find('.js-lazyload').each(function() {
		suumo.frList.lazyload( {
			targetID: this,
			npImg: {
				path: '/edit/assets/suumo/img/fr_list_modal_now_print.png',
				width: 128,
				height: 74
			}
		});
	});

	// 物件の詳細はこちらボタンのリンク
	self.$modalViewLink.attr('href', href);
};

/*
 * [modal nextボタン カルーセル進む]
*/
suumo.frList.Modal.prototype.next = function(){
	'use strict';

	var self = this;

	if(self.flgAnimate){
		return false;
	}

	// カセットを動かすごとに+1
	if(self.idx === self.maxIdx -1){
		self.idx = 0;
	} else {
		self.idx++;
	}

	// カセット移動処理
	self.modalMove();
};

/*
 * [modal Prevボタン カルーセル戻る]
*/
suumo.frList.Modal.prototype.prev = function(){
	'use strict';

	var self = this;


	if(self.flgAnimate){
		return false;
	}

	// カセットを動かすごとに-1
	if(self.idx -1 === -1) {
		self.idx = self.maxIdx -1;
	} else {
		self.idx--;
	}

	// カセット移動処理
	self.modalMove();
};

/**
 * [galleryMove]
 */
suumo.frList.Modal.prototype.modalMove = function(){
	'use strict';

	var self = this;

	// naviのis-activeをremove
	self.$modalSlickActive.removeClass(suumo.frList.constants.ACTIVE_CLASS);

	// naviのactiveを付与
	self.$modalSlickActive.eq(self.idx).addClass(suumo.frList.constants.ACTIVE_CLASS);
};


/**
 * [画像遅延読み込み]
 * @param {object} options.targetID 制御対象のモジュールID
 * @param {object} options.npIMg.path ローディング画像のパす
 * @param {object} options.npImg.width ローディング画像の幅
 * @param {object} options.npImg.height ローディング画像の高さ
 */
suumo.frList.lazyload = function(options) {
	'use strict';

	var $target = $(options.targetID);
	var $img = $(options.targetID).find('img');
	$img.each(function(){
		$(this)
		.attr('src', $(this).attr('data-src'))
		.bind('load', function() {
			// 裏側のDOMのloadEventをキャッチする為に止む無くここにハンドラを記述する
			$(this).removeClass(suumo.frList.constants.HIDDEN_CLASS);
			$target.removeClass(suumo.frList.constants.LODING_CLASS);
		})
		.bind('error', function() {
			// 裏側のDOMのloadEventをキャッチする為に止む無くここにハンドラを記述する
			$img.attr({
				src: options.npImg.path,
				width: options.npImg.width,
				height: options.npImg.height
			});
			$img.removeClass(suumo.frDetail.constants.HIDDEN_CLASS);
			$target.removeClass(suumo.frDetail.constants.LODING_CLASS);
		});
	});
};

/**
 * [cassetteCheck 物件カセットチェックボックスクリック領域拡張]
 * @param  {Object} $checkbox       チェックボックスオブジェクト
 */
suumo.frList.cassetteCheck = function($checkbox){
	$checkbox.trigger('click');
};

/**
 * [linkedCheckbox 複数個あるチェックボックスの連動処理]
 *
 * @param {Object} options.$this クリックされた要素
 * @param {Object} options.$form 親のform要素
 * @param {String} options.property クリックされた要素の属性
 * @param {String} options.selector 連動させたい要素を探す対象群が持つセレクタ
 * @param {String} options.targetProperty 連動させたい要素の属性
 */
suumo.frList.linkedCheckbox = function(options){
	var $this = options.$this;
	var value = $this.attr(options.property);
	var $targetCheckbox = options.$form.find(options.selector).filter(function(){
		return $(this).attr(options.targetProperty) === value;
	});

	if($this.attr('checked') === true) {
		$targetCheckbox.attr('checked', true);
	} else {
		$targetCheckbox.attr('checked', false);
	}
};

/**
 * controller
 */

// 検索条件変更ボタン
$('#js-condTop-panel')
.delegate('#js-ekiButton', 'click', function() {
	suumo.frList.openChangeConditionLightbox('js-ekiSelectForm');
})
.delegate('#js-areaButton', 'click', function() {
	suumo.frList.openChangeConditionLightbox('js-areaSelectForm');
})
.delegate('#js-ensenButton', 'click', function() {
	suumo.frList.openChangeConditionLightbox('js-ensenSelectForm');
})
.delegate('#js-machiButton', 'click', function() {
	suumo.frList.openChangeConditionLightbox('js-machiSelectForm');
});

// スクロールレイジー
suumo.frList.scrollLazy({
	className: 'js-scrollLazy'
});
var $win = $(window);
$win.load(function() {
	suumo.frList.scrollLazy({
		className: 'js-scrollLazy'
	});
})
.bind('scroll.lazy', function() {
	suumo.frList.scrollLazy({
		className: 'js-scrollLazy'
	});
});

// このキーワードで検索する テキストボックス
suumo.frList.placeholderEvent({
	'targetID' : '#js-kensakuJoken-freeword'
});

suumo.frList.placeholderEvent({
	'targetID' : '#js-searchpanel-freeWordInput'
});

// このキーワードで検索する ENTERキー無効化
$('#js-kensakuJoken-freeword').keydown(function(event) {
	if (event.keyCode === 13) {
		return false;
	}
});

// このキーワードで検索する ボタン
$('#js-kensakuJoken-freeWordSearchBtn').click(function(){
	var $form = $('#js-keyword-reSearchForm');
	var targetVal = $('#js-kensakuJoken-freeword').val();
	if(targetVal !== ''){
		$form.find('[name=fw]').val(targetVal);
		$form.submit();
	}
	return false;
});

// 表示件数（上部）
$('#js-tabmenu1-pcChange').change(function() {
	if(suumo.frList.constants.DSE_FLAG === '1') {
		suumo.frList.dispCntChangeDse(this);
	} else {
		suumo.frList.dispCntChange(this);
	}
});

// 表示件数（下部）
$('#js-tabmenu2-pcChange').change(function() {
	if(suumo.frList.constants.DSE_FLAG === '1') {
		suumo.frList.dispCntChangeDse(this);
	} else {
		suumo.frList.dispCntChange(this);
	}
});

//表示件数（上部）（会社一覧）
$('#js-kaisha-tabmenu1-pcChange').change(function() {
	suumo.frList.kaishaDispCntChange(this);
});

// 表示件数（下部）（会社一覧）
$('#js-kaisha-tabmenu2-pcChange').change(function() {
	suumo.frList.kaishaDispCntChange(this);
});

// 並び替え： 第一候補 プルダウン
suumo.frList.removePulldownList({
	target: '#js-sortbox-sortPulldown1',
	targetRmOpt: '#opt2_'
});
$('#js-sortbox-sortPulldown1').change(function() {
	suumo.frList.COMMON.fr301fk0041_change('opt1_');
});
// 並び替え： 第二候補 プルダウン
suumo.frList.removePulldownList({
	target: '#js-sortbox-sortPulldown2',
	targetRmOpt: '#opt1_'
});
$('#js-sortbox-sortPulldown2').change(function() {
	suumo.frList.COMMON.fr301fk0041_change('opt2_');
});
// 並び替える ボタン
$('#js-sortbox-sortSubmit').click(function() {
	suumo.frList.COMMON.bknIchiranSort();
});
// リセット リンク
$('#js-sortbox-sortReset').click(function() {
	suumo.frList.COMMON.bknIchiranSortReset();
});

// 並び替える ボタン（会社一覧）
$('#js-kaisha-sortbox-sortSubmit').click(function() {
	suumo.frList.COMMON.kaishaIchiranSort();
});

// すべてをチェック
suumo.frList.checkAllCheckbox({
	'triggerID' : '.js-checkall-input',
	'targetClass' : '#js-bukkenList .js-ikkatsuCB'
});

$(document)
.delegate('#js-lightbox-joken-reset', 'click', function() {
	// 条件の追加・変更ライトボックスのリセットボタン
	suumo.frList.COMMON.clickJokenButton(true);
	return false;
})
.delegate('.js-checkall-input', 'click', function() {
	// 対象のチェックボックスにチェックを付ける
	$('.js-checkall-input').attr('checked', $(this).attr('checked'));
	$('#js-bukkenList .js-ikkatsuCB:enabled').attr('checked', $(this).attr('checked'));
})
// ライトボックス - エリアパネル
.delegate('.js-areaBtn', 'click', function() {
    // 各都道府県ボタン
    var targetRel = $(this).attr('rel');
    $('#js-lightboxAreaSelectForm input[name=ta]').val(targetRel);
    $('#js-lightboxAreaSelectForm input[name=ra]').val(targetRel);

    var dataVal = $('#js-lightboxAreaSelectForm').serialize();
    suumo.headerfooter.ajaxForm({
        'targetForm': '#js-lightboxAreaSelectForm',
        'data': dataVal,
        'successFunc': suumo.frList.areaEnsenLightBoxPanelInit
    });
})
.delegate('.js-checkall', 'click', function() {
	// 都道府県-市区郡・鉄道会社-沿線・沿線-駅チェックボックス（大分類）
	// 対象のチェックボックスにチェックを付ける
	$('#js-' + $(this).attr('id') + '-panel .js-checkSingle:enabled').attr('checked', $(this).attr('checked'));
})
// ライトボックス検索ボタン 活性・非活性切り替え
.delegate('.js-checkSingle', 'change', function() {
	suumo.frList.toggleInactiveClass({
		targetClass: '#js-lightboxShiborikomiForm .js-checkSingle',
		targetId: '#js-lightbox-searchSubmit'
	});
	suumo.frList.toggleInactiveClass({
		targetClass: '#js-lightboxShiborikomiForm .js-checkSingle',
		targetId: '#js-lightbox-ensenSubmit'
	});
	suumo.frList.toggleInactiveClass({
		targetClass: '#js-lightboxShiborikomiForm .js-checkSingle',
		targetId: '#js-lightbox-ekiSubmit'
	});
})
.delegate('.js-checkall', 'change', function() {
	suumo.frList.toggleInactiveClass({
		targetClass: '#js-lightboxShiborikomiForm .js-checkall',
		targetId: '#js-lightbox-searchSubmit'
	});
	suumo.frList.toggleInactiveClass({
		targetClass: '#js-lightboxShiborikomiForm .js-checkall',
		targetId: '#js-lightbox-ekiSubmit'
	});
})
//周辺環境距離リストボックス選択を、hiddenの各距離に反映
.delegate('#shkrAll', 'change', function() {
	var kr = $('#shkrAll').val();
	$('#shkr1').val(kr);
	$('#shkr2').val(kr);
	$('#shkr3').val(kr);
	$('#shkr4').val(kr);
})
// 沿線ライトボックス - 沿線リンク
.delegate('.js-ensenLink', 'click', function() {
	// 各都道府県ボタン
	var targetRel = $(this).attr('rel');
	var targetRelAe = targetRel + '1';
	$('#js-ekiLinkForm input[name=rn]').val(targetRel);
	$('#js-ekiLinkForm input[name=ae]').val(targetRelAe);

	var dataVal = $('#js-ekiLinkForm').serialize();
	suumo.headerfooter.ajaxForm({
		'targetForm': '#js-ekiLinkForm',
		'data': dataVal,
		'successFunc': suumo.frList.areaEnsenLightBoxPanelInit
	});
});

// 詳細表示する ボタン
$('.js-allDispDetaileInfo').click(function() {
	suumo.frList.frDefDetail(this.rel);
});
// まとめてマイリストに登録するボタン
$('.js-allAddMyList').click(function() {
	suumo.frList.COMMON.registClipMulti();
});
// まとめて問い合わせする ボタン
$('.js-allShiryoSeikyu').click(function() {
	suumo.frList.reqLumpInfo();
	return false;
});
//まとめて問い合わせする ボタン(会社)
$('.js-allKaisyaShiryoSeikyu').click(function() {
	suumo.frList.shiryoSanPost(0);
	return false;
});
// 1件のみ問い合わせする ボタン
$('.js-kobetsuShiryoSeikyu').click(function() {
	var submitOptions = {
		$submitForm: $('#js-shiryouseikyuForm'),
		$submitList: $('#js-bcSpanList'),
		$checkbox: $(this).closest('.js-cassette_link').find('.js-ikkatsuCB'),
		$clickTarget: this
	};
	suumo.frList.reqSingleInfo(submitOptions);
});

// 物件カセット画像：カルーセル＆スライドレイジー
suumo.frList.slideImages.init({
	targetList: '#js-bukkenList',
	casset: '.js-slideImage',
	imageList: '.js-imageView',
	backBtn: '.js-slideBack',
	nextBtn: '.js-slideNext',
	madoriBtn: '.js-slideMadoriBtn',
	caption: '.js-slideCaption',
	currentNum: '.js-currentCount',
	madoriImage: '#js-madorizuImg'
});

//物件カセット画像：画像の高さ幅を調整
$('#js-bukkenList')
.find('.js-adjustImg').load(function() {
	suumo.frList.adjustImg({
		target: $(this),
		width: 180,
		height: 180,
		frameHeight: 180
	});
});

//個社物件カセットサムネイル画像：画像の高さ幅を調整
$('#js-bukkenList')
.find('.js-adjustImgSamuneiru').load(function() {
	suumo.frList.adjustImg({
		target: $(this),
		width: 90,
		height: 90,
		frameHeight: 90
	});
});

//個社(間取り図・写真)物件カセットサムネイル画像：画像の高さ幅を調整
$('#js-bukkenList')
.find('.js-adjustImgThumbnail').load(function() {
	suumo.frList.adjustImg({
		target: $(this),
		width: 90,
		height: 90
	});
});

$('#js-bukkenList')
.delegate('.js-slideBack', 'click', function() {
	suumo.frList.slideImages.getPrev(this);
})
.delegate('.js-slideNext', 'click', function() {
	suumo.frList.slideLazy(this);
	suumo.frList.slideImages.getNext(this);
})
.delegate('.js-slideMadoriBtn', 'click', function() {
	suumo.frList.slideLazy(this);
	suumo.frList.slideImages.getMadori(this);
})
// カセットリンク
.delegate('.js-cassetLink', 'click', function(e){
	suumo.frList.cassetteLink(e, this, {
		anchor: '.js-cassetLinkHref'
	});
})
// カセット内画像をホバーで拡大（個社）
.delegate('.js-imgzoombox', 'mouseenter', function() {
	suumo.frList.showBigImage({
		obj: this
	});

	var targetID = $(this).attr('rel');
	var $target = $('#' + targetID + ' .js-adjustImgKakudai');
	if($target.length === 0){
		return;
	}
	suumo.frList.adjustImg({
		target: $target,
		width: 280,
		height: 280
	});
	$target.removeClass('js-adjustImgKakudai');
})
.delegate('.js-imgzoombox', 'mouseleave', function() {
	suumo.frList.showBigImage({
		obj: this,
		close: true
	});
});

// 現在の検索条件パネルの表示・非表示
$('#js-showHideTxt').click(function() {
	suumo.frList.showHideSearchResult({
		result : '#js-conditionbox-txtInfoAll',
		target : '#js-showHideTxt a',
		close_text : '閉じる',
		open_html : '<span class="ui-icon--plus2"></span>すべて見る',
		close_html : '<span class="ui-icon--minus2"></span>閉じる'
	});
	return false;
});

// 現在の検索条件：保存する
$('#js-addMyListJoken').click(function() {
	suumo.frList.COMMON.registKensakuJoken(login);
});
// 現在の検索条件：新着メールを登録
$('#js-kensakuJokenMail').click(function() {
	suumo.frList.COMMON.registKensakuJokenMail(login);
});

// 検索パネル：パネル開閉（クローズ無し）
$('.js-boxToggle').each(function(){
	suumo.frList.toggleOpenClose({
		'target' : this,
		'iconTrue': 'ui-icon--plus1_2',
		'iconFalse': 'ui-icon--minus1_2',
		'sec': '500'
	});
});

// 検索パネル：パネル開閉１（クローズ有り）
$('.js-boxToggleSetCloseBtn1').each(function(){
	suumo.frList.toggleOpenClose({
		'target' : this,
		'iconTrue': 'ui-icon--plus1_2',
		'iconFalse': 'ui-icon--minus1_2',
		'sec': '500',
		'setCloseBtn': true
	});
});

// 検索パネル：パネル開閉２（クローズ有り）
$('.js-boxToggleSetCloseBtn2').each(function(){
	suumo.frList.toggleOpenClose({
		'target' : this,
		'iconTrue': 'ui-icon--plus',
		'iconFalse': 'ui-icon--minus',
		'sec': '500',
		'setCloseBtn': true
	});
});

// この条件で検索する ボタン
$('#js-searchPanel .js-btCondSearch').click(function() {
	suumo.frList.placeholderClear({
		'targetID': '#js-searchpanel-freeWordInput'
	});
	// sdパラメータ除去判断（tsが一つではない場合除去）
	suumo.frList.COMMON.searchPanelShubetsuSdPost();
	suumo.frList.COMMON.doSubmitALL('js-searchPanel', this);
	return false;
});
// 検索条件変更 エリア チェックボックス
$('#js-searchPanel .js-checkbox').click(function() {
	suumo.frList.COMMON.doSubmitTaRa2(this);
});

// 検索パネル
$('#js-searchPanel')
.delegate('.js-freeWordClearBtn', 'click', function() {
	// フリーワードクリア
	var targetUrl = $('#js-searchPanel').attr('action');
	var targetVal = $('#js-freeWord2').attr('value');
	suumo.frList.doSubmitFw('js-searchPanel',targetUrl,this,targetVal);
	return false;
})
.delegate('#js-addJouken1', 'click', function() {
	suumo.frList.placeholderClear({
		'targetID': '#js-searchpanel-freeWordInput'
	});
	// sdパラメータ除去判断（tsが一つではない場合除去）
	suumo.frList.COMMON.shubetsuSdPost();
	// 条件追加ボタン
	suumo.frList.COMMON.clickJokenButton(false);
})
.delegate('#js-addJouken2', 'click', function() {
	// sdパラメータ除去判断（tsが一つではない場合除去）
	suumo.frList.COMMON.shubetsuSdPost();
	// 条件追加ボタン
	suumo.frList.COMMON.clickJokenButton(false);
})
.delegate('#js-koshaAddJouken1', 'click', function() {
	// 個社一覧の条件追加ボタン
	suumo.frList.COMMON.clickKoshaJokenButton();
})
.delegate('#js-koshaAddJouken2', 'click', function() {
	// 個社一覧の条件追加ボタン
	suumo.frList.COMMON.clickKoshaJokenButton();
});

// 検索パネル - キーワード検索 テキストボックス
$('#js-searchpanel-freeWordInput').keydown(function(event) {
	if (event.keyCode === 13) {
		return false;
	}
});

// 画像右クリック禁止
$('.js-noContextMenu').bind('contextmenu',function() {
	return false;
});

// オススメの物件：カルーセル
suumo.frList.carrousel({
	innerId: '#js-searchCarousel-inner',
	nextId: '#js-searchCarousel-nextBtn',
	prevId: '#js-searchCarousel-previewBtn',
	speed: 200
});

//  オススメの物件：カセットリンク
$('#js-searchCarousel-inner')
.delegate('.js-carouselSubmitRelLink', 'click', function() {
	// 指定箇所のRel属性用のリンクサブミット
	var targetUrl = $('#' + $(this).attr('rel')).attr('href');
	location.href = targetUrl;
	return false;
});

// ライトボックス共用
// ライトボックスの閉じるボタン
$(document)
.delegate('.js-lightbox-close', 'click', function() {
	suumo.frList.lightbox.close();
})
.delegate('body', 'keydown', function(e) {
	if (e.keyCode === 27) {
		suumo.frList.lightbox.close();
	}
});

// 新着メールライトボックス用
// 会員の方はこちらよりログインのうえ、「この条件でメールを受け取る」ボタンをクリックしてください
$('#js-doTurnback').live( 'click', function() {
	$('#js-turnbackPostForm').submit();
});

// 新着お知らせメールを登録する ENTERキー無効化
$('#js-lightbox-kensakuJokenMail').live('keydown', function(event) {
	if (event.keyCode === 13) {
		return false;
	}
});

// 上記に同意の上、メルマガを登録する
$('#js-submitMail').live('click', function() {
	if(suumo.frList.COMMON.mySubmitfunc()){
		suumo.frList.kensakuJokenTouroku();
	}
	return false;
});

// 絞り込み条件パネル
$(document)
// 絞り込み条件パネル
// 絞り込み条件：チェックボックス・プルダウン
.delegate('.js-onChangeAjax', 'change', function() {
	// 重複している項目のチェックボックス連動
	suumo.frList.linkedCheckbox({
		$this: $(this),
		$form: $('#js-lightbox-jokenPanel'),
		selector: '.js-onChangeAjaxCopy',
		property: 'value',
		targetProperty: 'data-value'
	});
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-lightbox-checkAjaxForm, #js-lightboxShiborikomiForm',
		'action' : $('#js-lightbox-checkAjaxForm').attr('action'),
		'method' : 'post',
		'successFunc' : suumo.frList.jokenAddLightBoxInit
	});
})
.delegate('.js-onChangeAjaxCopy', 'click', function() {
	// 重複している項目のチェックボックス連動
	suumo.frList.linkedCheckbox({
		$this: $(this),
		$form: $('#js-lightbox-jokenPanel'),
		selector: '.js-onChangeAjax',
		property: 'data-value',
		targetProperty: 'value'
	});
	suumo.headerfooter.ajaxForm({
		'targetForm' : '#js-lightbox-checkAjaxForm, #js-lightboxShiborikomiForm',
		'action' : $('#js-lightbox-checkAjaxForm').attr('action'),
		'method' : 'post',
		'successFunc' : suumo.frList.jokenAddLightBoxInit
	});
});

// ライトボックスパネル（条件変更時の件数）の初期化
suumo.frList.jokenAddLightBoxInit = function(data) {
	var lightboxInnerScrollTop = $('#js-lightbox-inner').scrollTop();
	$('#js-lightbox-window').html(data);
	$('#js-searchFooter-totalCountBox').text($('#js-searchFooter-totalCount').text());
	$('#js-lightbox-inner').scrollTop(lightboxInnerScrollTop);
};

// ライトボックスの検索ボタン
$('#js-lightbox-searchSubmit').live('click', function() {
	var targetClassChecked = $('#js-lightboxShiborikomiForm input[type=checkbox]:checked').length;
	if(targetClassChecked === 0) {
		return false;
	}
	suumo.frList.checkSubmit('js-lightboxShiborikomiForm','#js-searchFooter-totalCount');
});

//さらに条件を追加するライトボックスの検索ボタン
$('#js-lightbox-jokenSearchSubmit').live('click', function() {
	suumo.frList.checkSubmit('js-lightboxShiborikomiForm','#js-searchFooter-totalCount');
});

//駅ライトボックスの検索ボタン
$('#js-lightbox-ekiSubmit').live('click', function() {
	var targetClassChecked = $('#js-lightboxShiborikomiForm input[type=checkbox]:checked').length;
	if(targetClassChecked === 0) {
		return false;
	}
	var param='';
	$('.js-checkall').each(function() {
		if(this.checked) {
			param += '&rn=' + this.value;
		} else {
			var ensenFlag = false;
			$('#js-' + $(this).attr('id') + '-panel .js-checkSingle:checked').each(function(){
				param += '&ek=' + this.value;
				ensenFlag = true;
			});
			if(ensenFlag) {
				param += '&rn=' + this.value;
			}
		}
	});
	var aeParam = $('#js-lightboxShiborikomiForm').find('input:hidden[name=ae]').serialize();
	if (aeParam !== ''){
		param += '&' + aeParam;
	}
	window.location.href = $('#js-shiborikomiPanel-searchBtnForm').attr('action') +  '?'  + $('#js-ekiLightboxShiborikomiForm').serialize() + param;
	return false;
});

//ライトボックスの検索ボタン 沿線⇒駅
$('#js-lightbox-ensenSubmit').live('click', function() {
	var targetClassChecked = $('#js-lightboxShiborikomiForm input[type=checkbox]:checked').length;
	if(targetClassChecked === 0) {
		return false;
	}
	var targetClassCheckedList = $('#js-lightboxShiborikomiForm input[type=checkbox]:checked');
	for (var i = 0; i < targetClassCheckedList.size(); i++) {
		var ae = $(targetClassCheckedList.get(i)).attr('value') + '1';
		$('#js-lightboxShiborikomiForm input[class=js-ae'+ae+']').removeAttr('disabled');
	}
	suumo.headerfooter.ajaxForm({
		'targetForm': '#js-lightboxShiborikomiForm',
		'targetID' : '#js-lightbox-window'
	});
});

// 条件を変更して、もっと多くの物件を見てみる
suumo.headerfooter.ajaxForm({
	'targetForm' : '#js-jokenHenkouSearchBukkenForm',
	'targetID' : '#js-jokenHenkouSearchBukken'
});

// あなたが最近チェックした物件
suumo.headerfooter.ajaxForm({
	'targetForm' : '#js-saikinCheckBukkenForm',
	'targetID' : '#js-saikinCheckBukken'
});

// オススメの物件 初回行動履歴出力用
suumo.frList.accessPrint('first');

//建物ごとに表示 タブ(上)
$('#js-tabBuildView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj', $('#js-tabBuildViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 建物ごとに表示 タブ(下)
$('#js-tabBuildView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj', $('#js-tabBuildViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 部屋ごとに表示 タブ(上)
$('#js-tabListView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj', $('#js-tabListViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 部屋ごとに表示 タブ(下)
$('#js-tabListView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj', $('#js-tabListViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 個社間取り画面：リストで表示 タブ(上)
$('#js-tabKoshaListView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj', $('#js-tabKoshaListViewForm').attr('rel'));
	window.location.href = query;
	return false;
});

// 個社間取り画面：リストで表示 タブ(下)
$('#js-tabKoshaListView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj', $('#js-tabKoshaListViewForm').attr('rel'));
	window.location.href = query;
	return false;
});

// 間取り図・写真で表示 タブ(上)
$('#js-tabPhotoView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj|sd|nwd', $('#js-tabPhotoViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 間取り図・写真で表示 タブ(下)
$('#js-tabPhotoView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj|nj|sd|nwd', $('#js-tabPhotoViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 個社リスト画面：間取り図・写真で表示 タブ(上)
$('#js-tabKoshaPhotoView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj', $('#js-tabKoshaPhotoViewForm').attr('rel'));
	window.location.href = query;
	return false;
});

// 個社リスト画面：間取り図・写真で表示 タブ(下)
$('#js-tabKoshaPhotoView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po|pj', $('#js-tabKoshaPhotoViewForm').attr('rel'));
	window.location.href = query;
	return false;
});

// 会社別一覧 タブ(上)
$('#js-tabCompanyView1').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj|sd|nwd', $('#js-tabCompanyViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 会社別一覧 タブ(下)
$('#js-tabCompanyView2').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj|sd|nwd', $('#js-tabCompanyViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// リストで表示 タブ(上) （会社別一覧専用のタブ移動）
$('#js-tabListView3').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj', $('#js-tabListViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 間取り図・写真で表示 タブ(上) （会社別一覧専用のタブ移動）
$('#js-tabPhotoView3').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj|sd', $('#js-tabPhotoViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// リストで表示 タブ(下) （会社別一覧専用のタブ移動）
$('#js-tabListView4').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj', $('#js-tabListViewForm').attr('rel')).unEscapeHTML();
	location.href = query;
	return false;
});

// 間取り図・写真で表示 タブ(下) （会社別一覧専用のタブ移動）
$('#js-tabPhotoView4').click(function() {
	var query = suumo.frList.COMMON.removeQueryParams2('po1|po2|pc|page|po|pj|nj|sd', $('#js-tabPhotoViewForm').attr('rel').unEscapeHTML());
	location.href = query;
	return false;
});

// 外観リンク(上) （個社一覧用）
$('#js-imageGaikanChange1').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=1';
	return false;
});

// 外観リンク(下) （個社一覧用）
$('#js-imageGaikanChange2').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=1';
	return false;
});

// 内観リンク(上) （個社一覧用）
$('#js-imageNaikanChange1').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=2';
	return false;
});

// 内観リンク(下) （個社一覧用）
$('#js-imageNaikanChange2').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=2';
	return false;
});

// 間取り図リンク(上) （個社一覧用）
$('#js-imageMdoriChange1').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=3';
	return false;
});

// 間取り図リンク(下) （個社一覧用）
$('#js-imageMdoriChange2').click(function(){
	var query = suumo.frList.COMMON.removeQueryParams2('sngz', $('#js-imageChangeForm').attr('rel'));
	window.location.href = query + '&sngz=3';
	return false;
});

// 対象のチェックボックスにチェックを付ける
$('.js-checkall').each(function() {
	suumo.frList.checkAllCheckbox({
		'triggerID' : this,
		'targetClass' : '#js-' + $(this).attr('id') + '-panel .js-checkSingle'
	});
});

// 個社一覧用:沿線名、市区郡のチェックボックス
$('#js-conditionbox .js-checkall').click(function() {
	$('#js-' + $(this).attr('id') + '-panel .js-checkSingle:enabled').attr('checked', $(this).attr('checked'));
});

// 個社一覧用:この条件で検索するボタン、駅の追加・変更できる場合、既存の絞り込みボタンと同じ処理する
$('#js-searchPanel .js-btCondSearch-clearTemp').click(function() {
	$('#js-searchPanel .js-rnTemp').attr('disabled', 'disabled');
	$('#js-searchPanel .js-ekTemp').attr('disabled', 'disabled');
	suumo.frList.COMMON.doSubmitALL('js-searchPanel', this);
	return false;
});


// まとめてマイリストに登録するボタン(会社/個社)
$('.js-allAddMyListBtn').click(function() {
	suumo.frList.allAddMyList();
});

// まとめて問い合わせする ボタン(個社)
$('.js-allShiryoSeikyuBtn').click(function() {
	suumo.frList.allShiryoSeikyu();
	return false;
});

//まとめて問い合わせする ボタン(会社)
$('.js-allKaishaShiryoSeikyu').click(function() {
	suumo.frList.shiryoSanPostKaisha(0);
	return false;
});

// 詳細表示する ボタン(個社)
$('.js-allDispDetaileInfoBtn').click(function() {
	suumo.frList.allDispDetaileInfo(this.rel);
});

// 学校コードパターン検索パネールのクリアリンク
$('#js-searchPanel .js-schcdDousen-clearBtn').click(function() {
	suumo.frList.areaEnsenClear(this.name);
});

// IE7でメソッドチェインした場合に、changeが動作しないを解消するおまじない
$('body')
.delegate('.js-onChangeAjax', 'change', function() {
});

//FACE-5121 【2015/1/7反映：2014/11/7開発納品】賃貸一覧カセット改善
// プルダウンの値を変更時にパラメータを持ってページ遷移
$('#js-sortbox-sortPulldownSingle').change(function() {
	if(suumo.frList.constants.DSE_FLAG === '1') {
		suumo.frList.redirectPulldownChangeDse($(this), 'po1|page', location.href);
	} else {
		suumo.frList.redirectPulldownChange($(this), 'po1|page', $('#js-pcLink').attr('href'));
	}
});

// 相場情報modal.open
$('#js-graphModal')
.delegate('.js-graphModal-item', 'click', function() {
	suumo.frList.graphModalOpen('#' + $(this).attr('id') + '-body');
});

// 相場情報modal.close
$('body')
.delegate('.js-graphModal-close', 'click', function() {
	suumo.frList.graphModalClose();
});

// 箱の高さ揃え
var $autoheight = $('#js-graphVertical');
var autoheightSel = '.js-autoheight-row';
var num = 1;
while($autoheight.find(autoheightSel + num).length > 0){
	suumo.frList.adjustHeight($autoheight.find(autoheightSel + num));
	num++;
}

// グラフ描画
suumo.frList.setGraphDispVertical({
	targetID: '#js-graphVertical'
});

// 固定フッターがあったら処理を走らせる
suumo.frList.ifExists.dom($('#js-inquirypanel'), function() {
	var $this = $(this);
	var $countNum = $this.find('.js-checked_count');
	var $bukkenList = $('#js-bukkenList');
	var $target = $bukkenList.find('.js-single_checkbox');
	var setCountOptions = {
		$target: $target,
		$countNum: $countNum
	}
	var displayFooterOptions = {
		$target: $this,
		$countTarget: $target
	}

	// チェック数の表示制御
	suumo.frList.setCheckedCount(setCountOptions);
	// 固定フッターの表示制御
	suumo.frList.displayFixfooter(displayFooterOptions);
	// 注釈の表示制御
	suumo.frList.cautionDisplay($target);

		$bukkenList
		// 部屋一覧
		.delegate('.js-noCassetteLink', 'click', function(e) {
			if ( $(e.currentTarget).hasClass('js-single_checkbox') ) {
				// チェック数の表示制御
				suumo.frList.setCheckedCount(setCountOptions);
				// 固定フッターの表示制御
				suumo.frList.displayFixfooter(displayFooterOptions);
				// 注釈の表示制御
				suumo.frList.cautionDisplay($target);
			}
		})
		// 棟一覧
		.delegate('.js-cassetteitem_checkbox', 'click', function(e) {
			if ( $(e.target).hasClass('js-cassetteitem_checkbox') ) {
				var $checkbox = $(this).find('.js-single_checkbox');
				suumo.frList.cassetteCheck($checkbox);
			}
			// チェック数の表示制御
			suumo.frList.setCheckedCount(setCountOptions);
			// 固定フッターの表示制御
			suumo.frList.displayFixfooter(displayFooterOptions);
			// 注釈の表示制御
			suumo.frList.cautionDisplay($target);
		});
});


// ギャラリーモーダル
var $modalTarget = $('#js-bukkenList');

// カルーセル初期化
var modal = new suumo.frList.Modal({
	targetID: '#js-view_gallery'
});

// modal 表示/非表示 roupe
$modalTarget
.delegate('.js-cassette_link', 'click', function(e){
	if ( $(e.target).hasClass('js-view_gallery-modal') === true ) {
		var imgs = $(this).find('.js-view_gallery_images').attr('data-imgs');
		var href = $(this).find('.js-cassette_link_href').attr('href');
		if(imgs && href) {
			modal.toggleModal(imgs, href);
		}
	}
});

$modalTarget
.find('#js-view_gallery-overlay_close, #js-view_gallery-overlay').bind('click', function(){
	modal.toggleModal();
});

// modal view nextボタン
$modalTarget
.find('#js-view_gallery-modalview_next').bind('click', function(){
	modal.next();
});

// modal view prevボタン
$modalTarget
.find('#js-view_gallery-modalview_prev').bind('click', function(){
	modal.prev();
});