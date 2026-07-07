// On mobile, autoplaying loop videos can't be paused without controls.
// Let a tap toggle play/pause. Desktop is left untouched (it has hover and
// the videos are decorative there). The 40em breakpoint matches desktop.css.
(function () {
	const isMobile = window.matchMedia("(max-width: 40em)");

	function enable(video) {
		if (video.dataset.tapToggle) return;
		video.dataset.tapToggle = "1";
		video.style.cursor = "pointer";
		video.addEventListener("click", () => {
			if (video.paused) {
				video.play();
			} else {
				video.pause();
			}
		});
	}

	function setup() {
		if (!isMobile.matches) return;
		document.querySelectorAll("main article video").forEach(enable);
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", setup);
	} else {
		setup();
	}
	// Cover the case where the viewport crosses the breakpoint after load.
	isMobile.addEventListener("change", setup);
})();
