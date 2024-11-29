/**
 * JQMB-2495 コンソール採用メッセージを表示
 */
document.addEventListener('DOMContentLoaded', () => {
	// consoleオブジェクト不在時は非表示
	if (typeof window.console !== 'undefined') {
		// UserAgent取得
		const ua = navigator.userAgent;
		// 表示崩れブラウザ検出正規表現配列
		const unsupportedList = [/Edge/, /Trident/];

		let isEnablePict = true;

		for (let i = 0; i < unsupportedList.length; i++) {
			if (unsupportedList[i].test(ua)) {
				isEnablePict = false;
				break;
			}
		}

		if (isEnablePict) {
			console.log(
				'%c      %c  %c              %c  \n' +
				'%c    %c  %c                  %c  \n' +
				'%c  %c  %c  %c  %c  %c  %c        %c  %c  %c  %c  \n' +
				'%c  %c  %c  %c  %c  %c  %c      %c  %c  %c  %c  %c  \n' +
				'%c  %c  %c  %c  %c  %c          %c  %c  %c  %c  \n' +
				'%c  %c  %c                      %c  %c      \n' +
				'%c  %c  %c                      %c  %c  %c    \n' +
				'%c  %c    %c                  %c    \n' +
				'%c    %c  %c  %c              %c  %c  \n' +
				'%c      %c  %c              %c  \n' +
				'%c      %c  %c              %c  \n' +
				'%c    %c    %c              %c    ',
				'background:transparent', 'background:#a0d174', 'background:#69b723', 'background:#a0d174',
				'background:transparent', 'background:#a0d174', 'background:#69b723', 'background:#a0d174',
				'background:transparent', 'background:#b3db90', 'background:#5fb215', 'background:#69b723', 'background:#fafafa', 'background:#69b723', 'background:#6db92a', 'background:#fafafa', 'background:#69b723', 'background:#5fb215', 'background:#b3db90',
				'background:transparent', 'background:#5db111', 'background:#69b723', 'background:#fafafa', 'background:#000', 'background:#fafafa', 'background:#69b723', 'background:#fafafa', 'background:#000', 'background:#fafafa', 'background:#69b723', 'background:#89c652',
				'background:transparent', 'background:#60b412', 'background:#69b723', 'background:#6db92a', 'background:#fafafa', 'background:#69b723', 'background:#fafafa', 'background:#69b624', 'background:#69b723', 'background:#60b412',
				'background:transparent', 'background:#000', 'background:#69b723', 'background:#000', 'background:transparent',
				'background:#000', 'background:#60b412', 'background:#69b723', 'background:#60b412', 'background:#000', 'background:transparent',
				'background:transparent', 'background:#60b412', 'background:#69b723', 'background:#60b412',
				'background:transparent', 'background:#61a527', 'background:#60b412', 'background:#69b723', 'background:#60b412', 'background:#61a527',
				'background:transparent', 'background:#61a527', 'background:#60b412', 'background:#61a527',
				'background:transparent', 'background:#000', 'background:#61a527', 'background:#000',
				'background:transparent', 'background:#000', 'background:transparent', 'background:#000'
			);
		}
	}
});
