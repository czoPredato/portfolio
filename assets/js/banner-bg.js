/*
 * Tło z plakatów (images/posters/) — responsywne kafelki, jeden rozmiar, przerwy.
 */
(function($) {

	var scrollThreshold = 120;
	var scrollAccum = 0;
	var lastScrollY = 0;
	var shuffleLock = false;
	var posterPath = 'images/posters/';
	var posterAspect = 5 / 4; // wysokość / szerokość (format plakatu 4:5)

	function getPosterFiles() {
		if (typeof POSTER_BACKGROUNDS !== 'undefined' && POSTER_BACKGROUNDS.length > 0) {
			return POSTER_BACKGROUNDS;
		}
		return ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
	}

	function getLayout() {
		var w = window.innerWidth;
		var gap, cols;

		if (w >= 1200) {
			cols = 4;
			gap = 14;
		} else if (w >= 736) {
			cols = 3;
			gap = 12;
		} else if (w >= 480) {
			cols = 2;
			gap = 10;
		} else {
			cols = 2;
			gap = 8;
		}

		var gridWidth = w;
		var tileW = Math.floor((gridWidth - gap * (cols + 1)) / cols);
		var tileH = Math.round(tileW * posterAspect);

		return { cols: cols, gap: gap, tileW: tileW, tileH: tileH, gridWidth: gridWidth };
	}

	function buildBannerGrid() {
		var $grid = $('#banner-bg .banner-grid');
		if (!$grid.length) return;

		var layout = getLayout();
		var files = getPosterFiles();
		var vh = Math.max(window.innerHeight, document.documentElement.clientHeight);
		var docH = Math.max($(document).height(), vh * 3);
		var rowH = layout.tileH + layout.gap;
		var cellsNeeded = Math.ceil(docH / rowH) * layout.cols + layout.cols * 3;
		var html = '';
		var i = 0;

		for (var n = 0; n < cellsNeeded; n++) {
			var r = Math.floor(n / layout.cols);
			var c = n % layout.cols;
			var file = files[i % files.length];
			i++;
			html += '<div class="banner-tile" style="grid-column:' + (c + 1) + ';grid-row:' + (r + 1) + ';" data-index="' + n + '">';
			html += '<div class="banner-tile-inner"><img src="' + posterPath + file + '" alt="" loading="lazy" /></div>';
			html += '</div>';
		}

		$grid.html(html);
		$grid.css({
			'width': layout.gridWidth + 'px',
			'padding': layout.gap + 'px',
			'gap': layout.gap + 'px',
			'grid-template-columns': 'repeat(' + layout.cols + ', ' + layout.tileW + 'px)',
			'grid-auto-rows': layout.tileH + 'px'
		});

		var y = window.pageYOffset || document.documentElement.scrollTop;
		$grid.css('transform', 'translateX(-50%) translateY(' + (-y * 0.35) + 'px)');
	}

	function shuffleTiles() {
		if (shuffleLock) return;
		var $tiles = $('#banner-bg .banner-tile');
		if ($tiles.length < 2) return;

		shuffleLock = true;
		var positions = [];
		$tiles.each(function() {
			var $t = $(this);
			var col = $t[0].style.gridColumn || $t.css('grid-column-start');
			var row = $t[0].style.gridRow || $t.css('grid-row-start');
			positions.push({ col: col, row: row });
		});

		for (var i = positions.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = positions[i];
			positions[i] = positions[j];
			positions[j] = tmp;
		}

		$tiles.each(function(idx) {
			$(this).css({
				'grid-column-start': positions[idx].col,
				'grid-row-start': positions[idx].row
			});
		});

		window.setTimeout(function() { shuffleLock = false; }, 450);
	}

	function onScroll() {
		var y = window.pageYOffset || document.documentElement.scrollTop;
		scrollAccum += Math.abs(y - lastScrollY);
		lastScrollY = y;
		$('#banner-bg .banner-grid').css('transform', 'translateX(-50%) translateY(' + (-y * 0.35) + 'px)');
		if (scrollAccum >= scrollThreshold) {
			scrollAccum = 0;
			shuffleTiles();
		}
	}

	$(function() {
		buildBannerGrid();
		lastScrollY = window.pageYOffset || 0;
		var resizeTimer;
		$(window).on('resize', function() {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(buildBannerGrid, 150);
		});
		$(window).on('scroll', onScroll);
	});

})(jQuery);
