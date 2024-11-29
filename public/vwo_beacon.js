/**
 * VWO情報
 */
var _vis_opt_queue = window._vis_opt_queue || [], _vis_counter = 0;

/**
 * VWO情報ビーコンを送信する
 */
(function() {
	_vis_opt_queue.push(function() {
		if (!_vis_counter) {
			var vwoParams = '';
			if (typeof window._vwo_exp !== 'undefined') {
				for (id in window._vwo_exp) {
					if (typeof window._vwo_exp[id].combination_chosen !== 'undefined' && typeof window._vwo_exp[id].comb_n[window._vwo_exp[id].combination_chosen] !== 'undefined') {
						if (vwoParams !== '') {
							vwoParams += ':';
						}
						vwoParams += 'vwo' + id + '_' + window._vwo_exp[id].comb_n[window._vwo_exp[id].combination_chosen];
						_vis_counter += 1;
					}
				}
			}
			if (vwoParams) {
				vwoParams = encodeURI(vwoParams);
				sendEventForBeacon([['eventName', 'vwo_abtest'],['vwoInfo', vwoParams]]);
			}
		}
	});
})();
