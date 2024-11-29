(function() {
	// ブラウザバック判定
	window.isBrowserBack = false;
	var browserBackElem = document.getElementById('browserBack');
	if (browserBackElem.value === '') {
		browserBackElem.value = '1';
	} else {
		window.isBrowserBack = true;
	}
})();