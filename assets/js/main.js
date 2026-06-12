/*
	Home: bio + categories. Gallery / contact tylko z ikon nav.
*/

(function($) {

	var $window = $(window),
		$body = $('body'),
		$nav = $('#nav'),
		$nav_home = $('#nav-home'),
		$nav_contact = $('#nav-contact'),
		$home = $('#home'),
		$gallery = $('#work-gallery'),
		$contact = $('#contact'),
		$sections = $('#work-sections');

	function setNavActive(view) {
		$nav.find('a').removeClass('active');
		if (view === 'home') $nav_home.addClass('active');
		if (view === 'contact') $nav_contact.addClass('active');
		if (view === 'gallery') $nav_home.addClass('active');
	}

	function hidePanel($el) {
		$el.addClass('is-hidden').attr('hidden', 'hidden');
	}

	function showPanel($el) {
		$el.removeClass('is-hidden').removeAttr('hidden');
	}

	function scrollToPanel($el) {
		var top = $el.offset().top - 60;
		$('html, body').animate({ scrollTop: Math.max(0, top) }, 300);
	}

	function showHome() {
		$body.removeClass('view-gallery view-contact');
		hidePanel($gallery);
		hidePanel($contact);
		showPanel($home);
		$sections.find('.work-section').hide();
		setNavActive('home');
		scrollToPanel($home);
	}

	function showContact() {
		$body.removeClass('view-gallery').addClass('view-contact');
		hidePanel($home);
		hidePanel($gallery);
		showPanel($contact);
		$sections.find('.work-section').hide();
		setNavActive('contact');
		scrollToPanel($contact);
		if (history.pushState) {
			history.pushState(null, null, '#contact');
		}
	}

	function showCategory(slug) {
		var $section = $('#work-' + slug);
		if ($section.length === 0) return;
		$body.removeClass('view-contact').addClass('view-gallery');
		hidePanel($home);
		hidePanel($contact);
		showPanel($gallery);
		$sections.find('.work-section').hide();
		$section.show();
		setNavActive('gallery');
		scrollToPanel($gallery);
		if (history.pushState) {
			history.pushState(null, null, '#work-' + slug);
		}
	}

	function categoryColClass(total) {
		var widths = { 1: 12, 2: 6, 3: 4, 4: 3 };
		var width = widths[total] || 3;
		return 'col-' + width + ' col-6-medium col-12-small';
	}

	if (typeof WORK_CATEGORIES !== 'undefined') {
		var $navWrap = $('#work-categories-nav');
		var categoryCol = categoryColClass(WORK_CATEGORIES.length);
		var navHtml = '<div class="row aln-center work-categories-active">';
		var sectionsHtml = '';

		for (var i = 0; i < WORK_CATEGORIES.length; i++) {
			var cat = WORK_CATEGORIES[i];
			var sectionId = 'work-' + cat.slug;
			var basePath = (cat.path || ('images/' + cat.folder + '/'));
			if (basePath.charAt(basePath.length - 1) !== '/') basePath += '/';

			navHtml += '<div class="' + categoryCol + '">';
			navHtml += '<a href="#' + sectionId + '" class="work-category-card work-category-card--active" data-category="' + cat.slug + '">';
			navHtml += '<img src="images/icons/' + cat.slug + '.svg" alt="" class="category-icon" onerror="this.style.display=\'none\'">';
			navHtml += '<h3>' + cat.label + '</h3></a></div>';

			var fitClass = (cat.slug === 'posters') ? 'image fit poster' : 'image fit';
			var imagesHtml = '<div class="row">';
			for (var k = 0; k < cat.images.length; k++) {
				var imgPath = basePath + cat.images[k];
				imagesHtml += '<div class="col-4 col-6-medium col-12-small">';
				imagesHtml += '<div class="image-preview">';
				imagesHtml += '<a href="javascript:void(0)" class="' + fitClass + '"><img src="' + imgPath + '" alt=""></a>';
				imagesHtml += '<button type="button" class="image-expand-btn" aria-label="View details" data-src="' + imgPath + '"><span class="icon solid fa-expand"></span> View</button>';
				imagesHtml += '</div></div>';
			}
			imagesHtml += '</div>';

			sectionsHtml += '<article id="' + sectionId + '" class="work-section" style="display:none">';
			sectionsHtml += '<h2 class="work-section-title">' + cat.label + '</h2>';
			sectionsHtml += '<section>' + imagesHtml + '</section>';
			sectionsHtml += '</article>';
		}
		navHtml += '</div>';
		$navWrap.html(navHtml);
		$sections.html(sectionsHtml);

	}

	hidePanel($gallery);
	hidePanel($contact);

	function initFromHash() {
		var hash = window.location.hash;
		if (hash === '#contact') {
			showContact();
			return;
		}
		if (hash && hash.indexOf('#work-') === 0) {
			var slug = hash.replace('#work-', '');
			if ($('#work-' + slug).length) {
				showCategory(slug);
				return;
			}
		}
		showHome();
		if (history.replaceState) {
			history.replaceState(null, null, '#home');
		}
	}

	initFromHash();

	$window.on('hashchange', function() {
		var hash = window.location.hash;
		if (hash === '#contact') {
			showContact();
			return;
		}
		if (hash && hash.indexOf('#work-') === 0) {
			showCategory(hash.replace('#work-', ''));
			return;
		}
		showHome();
	});

	var $scrollTop = $('#scroll-top');
	var scrollTopThreshold = 300;

	function updateScrollTopButton() {
		if ($body.hasClass('overlay-open')) {
			$scrollTop.removeClass('is-visible').attr('hidden', 'hidden');
			return;
		}

		if ($window.scrollTop() > scrollTopThreshold) {
			$scrollTop.addClass('is-visible').removeAttr('hidden');
		} else {
			$scrollTop.removeClass('is-visible').attr('hidden', 'hidden');
		}
	}

	$scrollTop.on('click', function() {
		$('html, body').animate({ scrollTop: 0 }, 300);
	});

	$window.on('scroll', updateScrollTopButton);

	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
		}, 100);
		updateScrollTopButton();
	});

	$nav_home.on('click', function(event) {
		event.preventDefault();
		showHome();
		if (history.pushState) history.pushState(null, null, '#home');
	});

	$nav_contact.on('click', function(event) {
		event.preventDefault();
		showContact();
	});

	$(document).on('click', '.work-category-card--active', function(event) {
		event.preventDefault();
		var slug = $(this).data('category');
		if (slug) showCategory(slug);
	});

	$(document).on('click', '.image-expand-btn', function(event) {
		event.preventDefault();
		event.stopPropagation();
		var src = $(this).data('src');
		if (!src) return;
		$('#image-overlay').find('.image-overlay-media img').attr('src', src);
		$('#image-overlay').addClass('active');
		$body.addClass('overlay-open');
		updateScrollTopButton();
	});

	$('#image-overlay .image-overlay-close, #image-overlay').on('click', function(e) {
		if (e.target === this || $(e.target).hasClass('image-overlay-close')) {
			$('#image-overlay').removeClass('active');
			$body.removeClass('overlay-open');
			updateScrollTopButton();
		}
	});
	$('#image-overlay .image-overlay-content').on('click', function(e) { e.stopPropagation(); });

	$window.on('keydown', function(e) {
		if (e.key !== 'Escape') return;
		if ($('#image-overlay').hasClass('active')) {
			$('#image-overlay').removeClass('active');
			$body.removeClass('overlay-open');
		} else if ($body.hasClass('view-gallery') || $body.hasClass('view-contact')) {
			showHome();
			if (history.pushState) history.pushState(null, null, '#home');
		}
	});

})(jQuery);
