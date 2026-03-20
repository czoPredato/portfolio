/*
	Astral by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$main = $('#main'),
		$nav = $('#nav'), $nav_links = $nav.children('a');

	// Build work categories and panels from WORK_CATEGORIES config (work-config.js)
	if (typeof WORK_CATEGORIES !== 'undefined') {
		var $workPanel = $main.find('#work');
		var $workContainer = $workPanel.find('#work-categories');
		var $contactPanel = $main.find('#contact');

		// Build category cards for work landing
		var cardsHtml = '<div class="row">';
		for (var i = 0; i < WORK_CATEGORIES.length; i++) {
			var cat = WORK_CATEGORIES[i];
			var panelId = 'work-' + cat.slug;
			cardsHtml += '<div class="col-4 col-6-medium col-12-small">';
			cardsHtml += '<a href="#' + panelId + '" class="work-category-card">';
			cardsHtml += '<img src="images/icons/' + cat.slug + '.svg" alt="" class="category-icon">';
			cardsHtml += '<h3>' + cat.label + '</h3>';
			cardsHtml += '</a>';
			cardsHtml += '</div>';
		}
		cardsHtml += '</div>';
		$workContainer.html(cardsHtml);

		// Build category panels and insert before contact
		for (var j = 0; j < WORK_CATEGORIES.length; j++) {
			var c = WORK_CATEGORIES[j];
			var basePath = (c.path || ('images/' + c.folder + '/'));
			if (basePath && basePath.charAt(basePath.length - 1) !== '/') basePath += '/';

			var imagesHtml = '<div class="row">';
			var fitClass = (c.slug === 'posters') ? 'image fit poster' : 'image fit';
			for (var k = 0; k < c.images.length; k++) {
				var imgPath = basePath + c.images[k];
				imagesHtml += '<div class="col-4 col-6-medium col-12-small">';
				imagesHtml += '<div class="image-preview">';
				imagesHtml += '<a href="javascript:void(0)" class="' + fitClass + '"><img src="' + imgPath + '" alt=""></a>';
				imagesHtml += '<button type="button" class="image-expand-btn" aria-label="View details" data-src="' + imgPath + '"><span class="icon solid fa-expand"></span> View</button>';
				imagesHtml += '</div>';
				imagesHtml += '</div>';
			}
			imagesHtml += '</div>';

			var panelHtml = '<article id="work-' + c.slug + '" class="panel work-category-panel">';
			panelHtml += '<header><a href="#work" class="back-link">&larr; Back to Work</a><h2>' + c.label + '</h2></header>';
			panelHtml += '<section>' + imagesHtml + '</section>';
			panelHtml += '</article>';

			$contactPanel.before(panelHtml);
		}
	}

	var $panels = $main.children('.panel');

	// Breakpoints.
		breakpoints({
			xlarge:  [ '1281px',  '1680px' ],
			large:   [ '981px',   '1280px' ],
			medium:  [ '737px',   '980px'  ],
			small:   [ '361px',   '736px'  ],
			xsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Portfolio images: button opens enlarged view with image on left, text on right.
		$(document).on('click', '.image-expand-btn', function(event) {
			event.preventDefault();
			event.stopPropagation();
			var src = $(this).data('src');
			if (!src) return;
			$('#image-overlay').find('.image-overlay-media img').attr('src', src);
			$('#image-overlay').addClass('active');
			$body.addClass('overlay-open');
		});

		$('#image-overlay .image-overlay-close, #image-overlay').on('click', function(e) {
			if (e.target === this || $(e.target).hasClass('image-overlay-close')) {
				$('#image-overlay').removeClass('active');
				$body.removeClass('overlay-open');
			}
		});
		$('#image-overlay .image-overlay-content').on('click', function(e) { e.stopPropagation(); });
		$window.on('keydown.imageoverlay', function(e) {
			if (e.key === 'Escape' && $('#image-overlay').hasClass('active')) {
				$('#image-overlay').removeClass('active');
				$body.removeClass('overlay-open');
			}
		});

	// Work category cards & back link: use hash navigation.
		$(document).on('click', '.work-category-card, .work-category-panel .back-link', function(event) {
			var href = $(this).attr('href');
			if (href && href.charAt(0) === '#' && $panels.filter(href).length > 0) {
				event.preventDefault();
				if (window.location.hash !== href) window.location.hash = href;
			}
		});

	// Nav.
		$nav_links
			.on('click', function(event) {

				var href = $(this).attr('href');

				// External link? Bail.
					if (href.charAt(0) != '#')
						return;

				// Not a panel link? Bail.
					if ($panels.filter(href).length == 0)
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Change panels.
					if (window.location.hash != href)
						window.location.hash = href;

			});

	// Panels.

		// Helper: get nav link for a panel (Work sub-panels use Work link).
					function getLinkForPanel($p) {
						if (!$p || $p.length == 0) return $nav_links.first();
						var id = $p.attr('id');
						var $link = $nav_links.filter('[href="#' + id + '"]');
						if ($link.length === 0 && id && id.indexOf('work-') === 0)
							$link = $nav_links.filter('[href="#work"]');
						return $link.length ? $link : $nav_links.first();
					}

		// Initialize.
			(function() {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = getLinkForPanel($panel);

					}

				// No panel/link? Default to first.
					if (!$panel
					||	$panel.length == 0) {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels except this one.
					$panels.not($panel)
						.addClass('inactive')
						.hide();

				// Activate link.
					$link
						.addClass('active');

				// Reset scroll.
					$window.scrollTop(0);

			})();

		// Hashchange event.
			$window.on('hashchange', function(event) {

				var $panel, $link;

				// Get panel, link.
					if (window.location.hash) {

				 		$panel = $panels.filter(window.location.hash);
						$link = getLinkForPanel($panel);

						// No target panel? Bail.
							if ($panel.length == 0)
								return;

					}

				// No panel/link? Default to first.
					else {

						$panel = $panels.first();
						$link = $nav_links.first();

					}

				// Deactivate all panels.
					$panels.addClass('inactive');

				// Deactivate all links.
					$nav_links.removeClass('active');

				// Activate target link.
					$link.addClass('active');

				// Set max/min height.
					$main
						.css('max-height', $main.height() + 'px')
						.css('min-height', $main.height() + 'px');

				// Delay.
					setTimeout(function() {

						// Hide all panels.
							$panels.hide();

						// Show target panel.
							$panel.show();

						// Set new max/min height.
							$main
								.css('max-height', $panel.outerHeight() + 'px')
								.css('min-height', $panel.outerHeight() + 'px');

						// Reset scroll.
							$window.scrollTop(0);

						// Delay.
							window.setTimeout(function() {

								// Activate target panel.
									$panel.removeClass('inactive');

								// Clear max/min height.
									$main
										.css('max-height', '')
										.css('min-height', '');

								// IE: Refresh.
									$window.triggerHandler('--refresh');

								// Unlock.
									locked = false;

							}, (breakpoints.active('small') ? 0 : 500));

					}, 250);

			});

	// IE: Fixes.
		if (browser.name == 'ie') {

			// Fix min-height/flexbox.
				$window.on('--refresh', function() {

					$wrapper.css('height', 'auto');

					window.setTimeout(function() {

						var h = $wrapper.height(),
							wh = $window.height();

						if (h < wh)
							$wrapper.css('height', '100vh');

					}, 0);

				});

				$window.on('resize load', function() {
					$window.triggerHandler('--refresh');
				});

			// Fix intro pic.
				$('.panel.intro').each(function() {

					var $pic = $(this).children('.pic'),
						$img = $pic.children('img');

					$pic
						.css('background-image', 'url(' + $img.attr('src') + ')')
						.css('background-size', 'cover')
						.css('background-position', 'center');

					$img
						.css('visibility', 'hidden');

				});

		}

})(jQuery);