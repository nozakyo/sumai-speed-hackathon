/* global WkWkTracker, _WkWkParams:true */

/**
 * [suumo すべての基幹となるsuumoオブジェクト]
 *
 * @type {[Object]}
 */
var suumo = suumo || {};

/**
 * [ビーコン送信用名前空間]
 *
 * @namespace
 */
suumo.sendBeacon = suumo.sendBeacon || {};

/**
 * [getParamsBase ビーコン用ベースパラメーター取得]
 * @param  {Object} options 設定オブジェクト.
 * @returns {Array} ベースになるパラメータ配列を返す.
 */
suumo.sendBeacon.getParamsBase = function(options) {
	'use strict';

	var $form = options.$form;
	var result = [];

	var paramsBaseKeys = Object.keys(options.paramsBase);
	for (var i = 0, len = paramsBaseKeys.length; i < len; i++) {
		var item = options.paramsBase[i];
		$form.find(item.className).each(function() {
			result.push([item.key, $(this).val()]);
		});
	}
	return result;
};

/**
 * [sendBeaconParamsScroll ビーコンTEログ送信]
 * @param  {Object} event ビーコン送信種類.
 * @param  {Object} $form 対象要素.
 * @param  {Object} $params ビーコン送信パラメータ.
 */
suumo.sendBeacon.sendBeaconParamsScroll = function(event, $form, params) {

	var _WkWkParamsBase = suumo.sendBeacon.getParamsBase({
		$form: $form,
		paramsBase: [
			{
				key: 'TEMPLATE_ID',
				className: '.js-logTemplateId'
			}, {
				key: 'PAGE_ID',
				className: '.js-logPageId'
			}
		]
	});

	if (typeof WkWkTracker !== "undefined") {
		_WkWkParams = [];
		_WkWkParams = [].slice.call(_WkWkParamsBase);
		WkWkTracker.trackEvent(event, params);
		return true;
	} else {
		return false;
	}
};

/**
 * [sendBeaconParamsPageView ビーコンPVログ送信]
 * @param  {Object} $form 対象要素.
 */
suumo.sendBeacon.sendBeaconParamsPageView = function($form) {

	var $paramItems = $form.find('.js-logParam');
	var _WkWkParamsBase = suumo.sendBeacon.getParamsBase({
		$form: $form,
		paramsBase: [
			{
				key: 'TEMPLATE_ID',
				className: '.js-logTemplateId'
			}, {
				key: 'PAGE_ID',
				className: '.js-logPageId'
			}
		]
	});

	$paramItems.each(function() {
		var $this = $(this);
		_WkWkParamsBase.push(['PARAMETER', $this.attr('name'), $this.val()]);
	});
	_WkWkParams = [];
	_WkWkParams = [].slice.call(_WkWkParamsBase);
	WkWkTracker.tracePageView();
};

/**
 * [sendBeaconParamsClick ビーコンTEログ送信]
 * @param  {Object} event ビーコン送信種類.
 * @param  {Object} $form 対象要素.
 * @param  {Object} $params ビーコン送信パラメータ.
 */
suumo.sendBeacon.sendBeaconParamsClick = function(event, $form, params) {

	var _WkWkParamsBase = suumo.sendBeacon.getParamsBase({
		$form: $form,
		paramsBase: [
			{
				key: 'TEMPLATE_ID',
				className: '.js-logTemplateId'
			}, {
				key: 'PAGE_ID',
				className: '.js-logPageId'
			}
		]
	});

	if (typeof WkWkTracker !== "undefined") {
		_WkWkParams = [];
		_WkWkParams = [].slice.call(_WkWkParamsBase);
		WkWkTracker.trackEvent(event, params);
		return true;
	} else {
		return false;
	}
};