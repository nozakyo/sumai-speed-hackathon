/**
 * VWO情報
 */
var _vis_opt_queue = window._vis_opt_queue || [], _vis_counter_catalyst = 0;

/**
 * VWO情報サイカタを送信する
 */
(function() {
	_vis_opt_queue.push(function() {
		if (!_vis_counter_catalyst) {
			var _vis_data = '';
			if (typeof window._vwo_exp !== 'undefined') {
				for (id in window._vwo_exp) {
					if (typeof window._vwo_exp[id].combination_chosen !== 'undefined' && typeof window._vwo_exp[id].comb_n[window._vwo_exp[id].combination_chosen] !== 'undefined') {
						if (_vis_data !== '') {
							_vis_data += ':';
						}
						_vis_data += 'VWO-' + id + '_' + window._vwo_exp[id].comb_n[window._vwo_exp[id].combination_chosen];
						_vis_counter_catalyst += 1;
					}
				}
			}
			if (_vis_counter_catalyst) {
				// VWOの情報を取得できるのが画面読み込み後になるのでサイカタはイベントで送信する
				sendEventForVwoCatalyst(_vis_data);
			}
		}
	});
})();