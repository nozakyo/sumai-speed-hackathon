(function() {
	// 繝悶Λ繧ｦ繧ｶ繝舌ャ繧ｯ蛻､螳�
	window.isBrowserBack = false;
	var browserBackElem = document.getElementById('browserBack');
	if (browserBackElem.value === '') {
		browserBackElem.value = '1';
	} else {
		window.isBrowserBack = true;
	}
})();