/**
 * 画像リサイズに関連する処理。
 */
var ResizeImage = (function() {

	/**
	 * 引数$imgElemの画像サイズを、imgBoxSizeにいっぱいになるよう変更する(トリム無し)
	 *
	 * @param Smart $imgElem 画像要素
	 * @param Object imgBoxSizes {width: 幅, height: 高さ}
	 */
	function resizeImageNoTrim($imgElem, imgBoxSizes) {
		// 画像サイズが指定されていない場合、画像の親要素からサイズを取得する
		if (!imgBoxSizes || imgBoxSizes.width === 0 || imgBoxSizes.height === 0) {
			var parentElem = $imgElem.parent()[0];
			imgBoxSizes.width = parentElem.clientWidth;
			imgBoxSizes.height = parentElem.clientHeight;
		}

		var imgSizes = {
			after: {},
			before: {}
		};
		imgSizes.after.width = imgBoxSizes.width;
		imgSizes.after.height = imgBoxSizes.height;
		imgSizes.before.width = $imgElem[0].naturalWidth;
		imgSizes.before.height = $imgElem[0].naturalHeight;

		var afterImgSize = computeAfterImgSizeNoTrim(imgSizes);

		$imgElem.attr('width', afterImgSize.width);
		$imgElem.attr('height', afterImgSize.height);

		$imgElem.css('left', ((imgSizes.after.width - afterImgSize.width) / 2) +
			'px');
		$imgElem.css('top',
			((imgSizes.after.height - afterImgSize.height) / 2) + 'px');
	}

	/**
	 * 変換後の画像の幅と高さを計算して返す。(トリム無し)
	 *
	 * @param Object imgSizes {before: {width: 変換前幅, height: 変換前高さ}, after: {width: 変換目標幅, height:変換目標高さ}}
	 * @return Object { width:変換後の画像の幅, height:変換後の画像の高さ}
	 */
	function computeAfterImgSizeNoTrim(imgSizes) {
		imgSizes.before.width = imgSizes.before.width > 0
			? imgSizes.before.width : 1;
		imgSizes.before.height = imgSizes.before.height > 0
			? imgSizes.before.height : 1;
		var afterWidthPower = imgSizes.after.width / imgSizes.before.width;
		var afterHeightPower = imgSizes.after.height / imgSizes.before.height;
		var power = afterWidthPower > afterHeightPower ? afterHeightPower
			: afterWidthPower;
		return {
			width: imgSizes.before.width * power,
			height: imgSizes.before.height * power
		};
	}

	/**
	 * 引数$imgElemの画像サイズを、imgBoxSizeにいっぱいになるよう変更する
	 *
	 * @param Smart $imgElem 画像要素
	 * @param Object imgBoxSizes {width: 幅, height: 高さ}
	 */
	function resizeImage($imgElem, imgBoxSizes) {
		// 画像サイズが指定されていない場合、画像の親要素からサイズを取得する
		if (!imgBoxSizes || imgBoxSizes.width === 0 || imgBoxSizes.height === 0) {
			var parentElem = $imgElem.parent()[0];
			imgBoxSizes.width = parentElem.clientWidth;
			imgBoxSizes.height = parentElem.clientHeight;
		}

		var imgSizes = {
			after: {},
			before: {}
		};
		imgSizes.after.width = imgBoxSizes.width;
		imgSizes.after.height = imgBoxSizes.height;
		imgSizes.before.width = $imgElem[0].naturalWidth;
		imgSizes.before.height = $imgElem[0].naturalHeight;

		var afterImgSize = computeAfterImgSize(imgSizes);

		$imgElem.attr('width', afterImgSize.width);
		$imgElem.attr('height', afterImgSize.height);

		$imgElem.css('left', ((imgSizes.after.width - afterImgSize.width) / 2) +
			'px');
		$imgElem.css('top',
			((imgSizes.after.height - afterImgSize.height) / 2) + 'px');
	}

	/**
	 * 引数$imgElemの画像サイズを、imgBoxSizeにいっぱいになるよう変更する ※resizeImageの配置は変えない版
	 *
	 * @param Smart $imgElem 画像要素
	 * @param Object imgBoxSizes {width: 幅, height: 高さ}
	 */
	function resizeImageNoReplacement($imgElem, imgBoxSizes) {
		// 画像サイズが指定されていない場合、画像の親要素からサイズを取得する
		if (!imgBoxSizes || imgBoxSizes.width === 0 || imgBoxSizes.height === 0) {
			var parentElem = $imgElem.parent()[0];
			imgBoxSizes.width = parentElem.clientWidth;
			imgBoxSizes.height = parentElem.clientHeight;
		}

		var imgSizes = {
			after: {},
			before: {}
		};
		imgSizes.after.width = imgBoxSizes.width;
		imgSizes.after.height = imgBoxSizes.height;
		imgSizes.before.width = $imgElem[0].naturalWidth;
		imgSizes.before.height = $imgElem[0].naturalHeight;

		var afterImgSize = computeAfterImgSize(imgSizes);

		$imgElem.attr('width', afterImgSize.width);
		$imgElem.attr('height', afterImgSize.height);
	}

	/**
	 * 変換後の画像の幅と高さを計算して返す。
	 *
	 * @param Object imgSizes {before: {width: 変換前幅, height: 変換前高さ}, after: {width: 変換目標幅, height:変換目標高さ}}
	 * @return Object { width:変換後の画像の幅, height:変換後の画像の高さ}
	 */
	function computeAfterImgSize(imgSizes) {
		imgSizes.before.width = imgSizes.before.width > 0
			? imgSizes.before.width : 1;
		imgSizes.before.height = imgSizes.before.height > 0
			? imgSizes.before.height : 1;
		var afterWidthPower = imgSizes.after.width / imgSizes.before.width;
		var afterHeightPower = imgSizes.after.height / imgSizes.before.height;
		var power = afterWidthPower < afterHeightPower ? afterHeightPower
			: afterWidthPower;
		return {
			width: imgSizes.before.width * power,
			height: imgSizes.before.height * power
		};
	}

	// exports
	function exports() {
		this.resizeImage = resizeImage;
		this.resizeImageNoTrim = resizeImageNoTrim;
		this.resizeImageNoReplacement = resizeImageNoReplacement;
	}
	return new exports();
})();
