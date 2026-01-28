/* ========= INFORMATION ============================
	- document:  Sticky buttons Documentation
	- author:    Dmytro Lobov
	- url:       https://dayes.dev
	- email:     d@dayes.dev
==================================================== */

'use strict';

(function($) {

	$(document).on("click", "a", function() {
		let href = $(this).attr("href");
		if (href.substr(0, 1) == "#") {
			$("html, body").animate({
				scrollTop: $($(this).attr("href")).offset().top
			});
			return false;
		}
	});

	$(document).on("scroll", function(event) {
		let scrollPos = $(document).scrollTop();
		$('#nav a').each(function () {
			let currLink = $(this);
			let refElement = $(currLink.attr("href"));
			if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
				$('#nav ul li a').removeClass("current");
				currLink.addClass("current");
			}
			else{
				currLink.removeClass("current");
			}
		});
	});

})(jQuery);


