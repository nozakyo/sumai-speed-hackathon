/**
 * [画面ロードする際にTEログ送信処理を呼び出す]
 *
 * @constructor
 */
var $win = $(window);
$win.load(function() {
	var $target = $('#js-beaconSendParamsScroll');
	// ビーコン送信情報格納領域
	params = [];

	var $paramItems = $target.find('.js-logParam');
	$paramItems.each(function() {
		var $this = $(this);
		params.push([$this.attr('name'), $this.val()]);
	});
	// ビーコン初期表示処理
	suumo.sendBeacon.sendBeaconParamsScroll('load', $target, params);
})
