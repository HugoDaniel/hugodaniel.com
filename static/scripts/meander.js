/**
 ** Copyright (c) 2018 Hugo Daniel Gomes <mail@hugodaniel.pt>.
 ** Licensed under the EUPL
 **************************************************************************
 ** Functions that perform the functionality provided by meander: a simple
 ** template engine.
 **
 ** This file is responsible for the initialization of a template engine
 ** after the DOM is loaded. It places JS events on anchor elements to help
 ** reload the current section with JS.
 **/

/**
 ** Loads the contents of a template and replaces the current '<main>' element
 ** on the <body> with it.
 **
 ** This routine preserves the location of the new `<main>` section to avoid
 ** breaking CSS rules
 */
function loadTemplateWithName(name) {
	// Get the current section
	let section = document.querySelector("main");
	// If it exists then remove it
	if (section) {
		document.body.removeChild(section);
	}
	// Clone the clicked section template
	section = document.getElementById(name);
	// If no template was found, then this anchor does not point
	// to a valid meander section (maybe this is a link to navigate elsewhere)
	if (section) {
		// Append the cloned section template content into the <body>
		// before the main menu footer element
		document.body.insertBefore(
			section.content.cloneNode(true), // clone the children (deep clone)
			document.querySelector("footer.main-menu")
		);
		// Hook this event handler to the new anchor tags on the appended
		// section
		loadTemplateAtLinksIn("main");
	}
}

/**
 ** The event handler for the <a> element click
 **
 ** This routine does three things:
 ** 1. Reads the href from the <a> element and uses it to load the
 ** contents of referenced element from a <template> instead of doing the
 ** default of going to the network.
 ** 2. Updates the 'selected' <a> element if there is a sibling with
 ** a 'selected' class name.
 ** 3. Updates the browser history with the <a> href location
 */
function onAnchorClick(event) {
	event.preventDefault();
	let newSectionName =
		// the <a href=""> link filename location is used as the selector
		// for the template
		event.target
			.getAttribute("href") // get the event link location
			.split(".")[0]; // obtain the filename without the extension
	// Replace the body with the new section from its template
	loadTemplateWithName(newSectionName);
	// Update the selected state (useful for menu anchors)
	// Start by getting the current selected sibbling element
	let selected = event.target.parentElement.querySelector(".selected");
	// if there is a selected node
	if (selected) {
		// make sure it is no longer selected
		selected.classList.remove("selected");
		// and set the current element as the newly selected one
		event.target.classList.add("selected");
	}
	// Update browser history
	history.pushState({}, document.title, `${newSectionName}.html`);
}

/**
 ** The event handler for the browser back button press
 **
 ** This routine reads the new location from the url bar and
 ** loads the contents of it from a <template>
 */
function onPopState() {
	loadTemplateWithName(
		// the url path name is used as the selector
		// for the template
		window.location.pathname
			.split("/") // Split the path name parts into an array
			.splice(-1)[0] // get the filename from the array last part
			.split(".")[0] // split the filename extension to remove it
	);
}

/**
 ** Searches for all anchor `<a>` child elements of a given class name selector
 ** and listens for the "click" event on them. It calls `onAnchorClick` when a
 ** "click" happens
 */
function loadTemplateAtLinksIn(baseSelector) {
	// Get all links (<a> tags) under the specified baseSelector
	document
		.querySelectorAll(`${baseSelector} a`)
		// When a link is clicked, use JS to change the current section to
		// the one on the corresponding <template> tag
		.forEach((elem) => elem.addEventListener("click", onAnchorClick));
}

/**
 ** Main entry point.
 ** This routine setups the main menu anchor links by listening on their "click"
 ** event; upon which it loads the contents of the link through a <template>
 ** element.
 ** It also listens to the popstate (for the browser back button press), and
 ** updates the contents with the previous entry on the browser history
 */
function initFeatures() {
	loadTemplateAtLinksIn(".MainMenu"); // Looks for <a> links under ".MainMenu"
	window.onpopstate = onPopState;
}

// Call `initFeatures` when the initial HTML document has been completely
// loaded and parsed, without waiting for stylesheets, images, and subframes
// to finish loading
document.addEventListener("DOMContentLoaded", initFeatures);
