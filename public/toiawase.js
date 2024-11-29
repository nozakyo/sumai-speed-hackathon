(function() {
	/**
	 * 物件レコメンドの情報を生成し、POSTパラメータにつめて問い合わせ画面に遷移する
	 *
	 * @param string 問い合わせ画面のURL
	 */
	window.goToiawaseForMansion = function(toiawaseUrl) {

		// POSTで送るパラメータの初期化
		var sendParams = {};
		// レコメンド用パラメータ作成
		sendParams['bh'] = createMansionRecommendBukkenParams();

		formAction(toiawaseUrl, 'POST', sendParams, '_blank');
	}
})();