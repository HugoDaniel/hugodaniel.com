/* Pin the post header's nav row to the top of the viewport while scrolling.
 *
 * The header is `position: sticky` with a negative `top`, so the title and the
 * lead scroll away and only the bottom strip (the date, the links and the
 * bottom border) stays pinned. That offset is a fixed -8rem in base.css, which
 * only fits a one line title. Taller headers stop short and leave the tail of
 * the lead plus a gap above the nav.
 *
 * Here we measure the header and set --sticky-header-top to the exact offset.
 * Without JS the CSS default applies and nothing breaks.
 *
 * Project pages on mobile are the other case: they hide the header nav and pin
 * the .project-menu bar instead, so there the header retracts completely.
 */
(function () {
  var header = document.querySelector("main article header");
  var nav = header && header.querySelector("nav");
  if (!header) return;

  function update() {
    var headerRect = header.getBoundingClientRect();
    var navRect = nav && nav.getBoundingClientRect();

    /* nothing is laid out yet: keep the CSS default */
    if (headerRect.height === 0) {
      header.style.removeProperty("--sticky-header-top");
      return;
    }

    /* No nav row to pin. Project pages on mobile hide it and use the
     * .project-menu bar instead, so retract the header all the way and let that
     * bar own the top of the viewport. */
    if (!navRect || navRect.height === 0) {
      header.style.setProperty(
        "--sticky-header-top",
        -Math.round(headerRect.height) + "px"
      );
      return;
    }

    /* The strip to keep visible runs from the top of the nav to the bottom
     * border of the header. Offset the header by everything above it, then add
     * back 0.5rem so the nav gets the same breathing room on top that the
     * header's padding gives it at the bottom. The 0.5rem stays in CSS so it
     * follows the root font size. */
    var strip = headerRect.bottom - navRect.top;
    header.style.setProperty(
      "--sticky-header-top",
      "calc(0.5rem + " + Math.round(strip - headerRect.height) + "px)"
    );
  }

  update();

  /* Recompute when the header reflows: window resizes, the title rewraps,
   * a web font finishes loading. */
  if (typeof ResizeObserver === "function") {
    new ResizeObserver(update).observe(header);
  } else {
    window.addEventListener("resize", update);
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(update);
  }
})();
