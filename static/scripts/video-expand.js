// Click a video in a post to blow it up to fill the viewport. Click it again,
// click outside it, or press Escape to send it back where it came from.
//
// The video element never leaves the document: moving it into a <dialog> would
// pause it and restart the autoplaying loops. Instead it is pinned with
// position: fixed above a backdrop, while a placeholder holds its slot in the
// text so the article underneath doesn't reflow. The zoom is a FLIP — the video
// is placed at its final geometry, transformed back onto its original box, then
// transitioned to identity.
//
// This also replaces the old mobile tap-to-pause: a tap now expands, and on
// mobile the expanded video gets native controls so it can still be paused.
(function () {
	const SELECTOR = "main article video";
	// Share of the viewport the expanded video is allowed to take.
	const FILL = 0.94;
	// Height of the native control bar, kept clickable while expanded.
	const CONTROL_BAR = 56;
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	// Matches the breakpoint in desktop.css.
	const isMobile = window.matchMedia("(max-width: 40em)");

	let open = null;

	// Native controls live in a bar at the bottom of the element, and clicks on
	// them are retargeted to the <video> itself. Those belong to the browser
	// (play, seek, volume), not to us.
	function onControls(video, event) {
		if (!video.controls) return false;
		const rect = video.getBoundingClientRect();
		return event.clientY > rect.bottom - Math.min(CONTROL_BAR, rect.height * 0.25);
	}

	// A click on a video with controls makes the browser toggle play/pause, and
	// that default action lands after this script has seen the event. Expanding
	// is not a playback command — it shouldn't stop an autoplaying loop or start
	// a clip the reader left paused — so undo the toggle. The timing of the
	// default action isn't ours to predict, hence a short window rather than a
	// guess at how many ticks later it arrives.
	function keepPlayback(video) {
		const paused = video.paused;
		const revert = () => {
			if (video.paused === paused) return;
			if (paused) video.pause();
			else video.play().catch(() => {});
		};
		video.addEventListener("play", revert);
		video.addEventListener("pause", revert);
		setTimeout(() => {
			video.removeEventListener("play", revert);
			video.removeEventListener("pause", revert);
		}, 350);
	}

	// Largest centered box with the video's aspect ratio that fits the viewport.
	function fitToViewport(video) {
		const box = video.getBoundingClientRect();
		const ratio = video.videoWidth && video.videoHeight
			? video.videoWidth / video.videoHeight
			: (box.width / box.height) || 16 / 9;
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let width = vw * FILL;
		let height = width / ratio;
		if (height > vh * FILL) {
			height = vh * FILL;
			width = height * ratio;
		}
		return { width, height, left: (vw - width) / 2, top: (vh - height) / 2 };
	}

	function place(video, rect) {
		Object.assign(video.style, {
			position: "fixed",
			top: rect.top + "px",
			left: rect.left + "px",
			width: rect.width + "px",
			height: rect.height + "px",
			maxWidth: "none",
			maxHeight: "none",
			margin: "0",
		});
	}

	// A plain box of the same pixel size is not a faithful stand-in: these videos
	// are inline replaced elements, so they sit on a text baseline and their line
	// box is a few pixels taller than the picture. Putting the video back in
	// place of such a box drops everything below it by those few pixels. A
	// stripped copy of the video keeps the same box and the same CSS rules.
	function ghostOf(video, rect) {
		const ghost = video.cloneNode(false);
		for (const name of Object.keys(ghost.dataset)) delete ghost.dataset[name];
		["id", "src", "poster", "autoplay", "controls"].forEach((a) =>
			ghost.removeAttribute(a),
		);
		ghost.setAttribute("aria-hidden", "true");
		ghost.classList.add("video-expand-placeholder");
		ghost.style.width = rect.width + "px";
		ghost.style.height = rect.height + "px";
		ghost.style.visibility = "hidden";
		return ghost;
	}

	// Cover the expanded video, minus the control bar when one is showing.
	function placeCatcher({ catcher, rect, controlsShown }) {
		const bar = controlsShown ? Math.min(CONTROL_BAR, rect.height * 0.25) : 0;
		Object.assign(catcher.style, {
			top: rect.top + "px",
			left: rect.left + "px",
			width: rect.width + "px",
			height: Math.max(0, rect.height - bar) + "px",
		});
	}

	// Animate the video from the box it currently occupies onto `rect`, which it
	// is already laid out at. `onDone` runs once, animation or not.
	function flip(video, from, rect, onDone) {
		const done = () => {
			if (!onDone) return;
			const run = onDone;
			onDone = null;
			run();
		};
		if (reduceMotion.matches) {
			video.style.transform = "";
			done();
			return;
		}
		video.style.transition = "none";
		video.style.transformOrigin = "top left";
		video.style.transform =
			`translate(${from.left - rect.left}px, ${from.top - rect.top}px)` +
			` scale(${from.width / rect.width}, ${from.height / rect.height})`;
		video.getBoundingClientRect(); // flush, so the browser has a start state
		video.style.transition = "transform 240ms cubic-bezier(.2,.7,.3,1)";
		video.style.transform = "none";
		video.addEventListener("transitionend", done, { once: true });
		// transitionend doesn't fire if the transition never starts (a hidden
		// tab, an interrupted frame); don't strand the page in a half state.
		setTimeout(done, 400);
	}

	function lockScroll() {
		// Compensate for the scrollbar we are about to hide, so the article
		// behind the backdrop doesn't jump sideways.
		const gap = window.innerWidth - document.documentElement.clientWidth;
		if (gap > 0) document.body.style.paddingRight = gap + "px";
		document.documentElement.classList.add("video-expand-lock");
	}

	function unlockScroll() {
		document.documentElement.classList.remove("video-expand-lock");
		document.body.style.paddingRight = "";
	}

	function expand(video) {
		const from = video.getBoundingClientRect();

		const placeholder = ghostOf(video, from);
		video.parentNode.insertBefore(placeholder, video);

		const backdrop = document.createElement("div");
		backdrop.className = "video-expand-backdrop";
		document.body.appendChild(backdrop);

		// A click on the picture must close, but the browser's own controls are in
		// the way: they sit in the video's shadow tree, swallow the click and turn
		// it into a play/pause instead. So cover the picture with our own
		// transparent layer and let it take those clicks. Only the strip left over
		// at the bottom — the control bar — still reaches the video.
		const catcher = document.createElement("div");
		catcher.className = "video-expand-catcher";
		document.body.appendChild(catcher);
		lockScroll();

		open = {
			video,
			placeholder,
			backdrop,
			catcher,
			style: video.getAttribute("style"),
			controls: video.controls,
			rect: fitToViewport(video),
			// Mobile has no hover, and the decorative loops carry no controls: with
			// none there'd be no way to pause once expanded (what the old
			// tap-to-pause script was for). On desktop, leave the markup alone.
			controlsShown: video.controls || isMobile.matches,
		};

		video.controls = open.controlsShown;
		video.classList.add("video-expanded");
		place(video, open.rect);
		placeCatcher(open);
		flip(video, from, open.rect);
		requestAnimationFrame(() => backdrop.classList.add("is-visible"));
		video.focus({ preventScroll: true });
		keepPlayback(video);
	}

	function collapse() {
		if (!open) return;
		const { video, placeholder, backdrop, catcher, style, controls, rect } = open;
		open = null;

		backdrop.classList.remove("is-visible");
		catcher.remove();
		const to = placeholder.getBoundingClientRect();
		// Lay the video back out over the placeholder, then animate the gap shut.
		place(video, to);
		flip(video, rect, to, () => {
			video.classList.remove("video-expanded");
			video.controls = controls;
			if (style === null) video.removeAttribute("style");
			else video.setAttribute("style", style);
			placeholder.remove();
			backdrop.remove();
			unlockScroll();
		});
	}

	document.addEventListener("click", (event) => {
		if (open) {
			// The catcher and the backdrop cover everything except the control bar,
			// so any click that isn't on the video itself is a click to close.
			if (event.target !== open.video) collapse();
			return;
		}
		const video = event.target.closest && event.target.closest(SELECTOR);
		if (!video || onControls(video, event)) return;
		expand(video);
	});

	document.addEventListener("keydown", (event) => {
		if (open) {
			if (event.key === "Escape") collapse();
			return;
		}
		// Space is the native play/pause on a focused video, so expanding is on
		// Enter only.
		if (event.key !== "Enter") return;
		const video = document.activeElement;
		if (video && video.matches && video.matches(SELECTOR)) {
			event.preventDefault();
			expand(video);
		}
	});

	// Keep the expanded video fitted when the viewport changes under it (a phone
	// rotating, a desktop window resize). No animation: it should just track.
	window.addEventListener("resize", () => {
		if (!open) return;
		open.rect = fitToViewport(open.video);
		place(open.video, open.rect);
		placeCatcher(open);
	});

	// Videos without controls aren't focusable, so give keyboard users a way in.
	function makeFocusable() {
		document.querySelectorAll(SELECTOR).forEach((video) => {
			if (!video.controls && !video.hasAttribute("tabindex")) {
				video.setAttribute("tabindex", "0");
			}
		});
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", makeFocusable);
	} else {
		makeFocusable();
	}
})();
