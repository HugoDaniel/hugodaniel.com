import { Cliddy } from "./modules/cliddy.mjs";

customElements.define("cliddy-mascot", Cliddy);

addEventListener("DOMContentLoaded", () => {
	var cliddy = document.querySelector("cliddy-mascot");
	addEventListener("mousemove", e => {
		cliddy.lookAt = [e.pageX, e.pageY];
	});
	addEventListener("touchstart", e => {
		var { pageX, pageY } = e.targetTouches[0];
		cliddy.lookAt = [pageX, pageY];
	});
});
