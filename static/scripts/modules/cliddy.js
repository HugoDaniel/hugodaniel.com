class CliddyEye {
    constructor(x1 = 0, y1 = 0, size = 1){
        const eyeRadius = 24;
        const eyeX = 24;
        const eyeY = 24;
        this.size = size;
        this.position = [
            x1,
            y1
        ];
        const svgNS = "http://www.w3.org/2000/svg";
        const eye = globalThis.document.createElementNS(svgNS, "svg");
        eye.setAttributeNS(null, "viewBox", `0 0 ${24 * 2} ${24 * 2}`);
        eye.setAttributeNS(null, "width", `${24 * 2}px`);
        eye.setAttributeNS(null, "height", `${24 * 2}px`);
        const eyeWhite = globalThis.document.createElementNS(svgNS, "circle");
        eyeWhite.setAttributeNS(null, "fill", "#FFFFFF");
        eyeWhite.setAttributeNS(null, "class", "eyeWhite");
        eyeWhite.setAttributeNS(null, "cx", String(24));
        eyeWhite.setAttributeNS(null, "cy", String(24));
        eyeWhite.setAttributeNS(null, "r", String(24));
        const eyeBlack = globalThis.document.createElementNS(svgNS, "circle");
        eyeBlack.setAttributeNS(null, "r", `${24 + 24 / 3}`);
        eyeBlack.setAttributeNS(null, "cy", String(24));
        eyeBlack.setAttributeNS(null, "cx", `${24 + (24 + 24 / 6)}`);
        eyeBlack.setAttributeNS(null, "class", "eyeBlack");
        eyeBlack.setAttributeNS(null, "clip-path", "url(#eyeMask)");
        const defs = globalThis.document.createElementNS(svgNS, "defs");
        const mask = globalThis.document.createElementNS(svgNS, "clipPath");
        mask.setAttributeNS(null, "id", "eyeMask");
        mask.appendChild(eyeWhite.cloneNode(true));
        defs.appendChild(mask);
        eye.appendChild(defs);
        eye.appendChild(eyeWhite);
        eye.appendChild(eyeBlack);
        eye.style.position = "absolute";
        eye.style.transform = `translate(${x1}px, ${y1}px) scale(${this.size})`;
        this.element = eye;
        this.irisElement = eyeBlack;
        this.circle = {
            r: 24,
            cx: 24 + x1,
            cy: 24 + y1
        };
    }
    lookAt(x, y, diffX, diffY) {
        const cx = diffX + this.circle.cx;
        const cy = diffY + this.circle.cy;
        const r = this.circle.r;
        const angle = Math.atan2(y - cy, x - cx);
        const ptX = cx + r * Math.cos(angle);
        const ptY = cy + r * Math.sin(angle);
        const eyePtX = ptX - cx + r;
        const eyePtY = ptY - cy + r;
        this.irisElement.setAttributeNS(null, "cx", String(eyePtX));
        this.irisElement.setAttributeNS(null, "cy", String(eyePtY));
    }
    scaleTo(s) {
        this.size = s;
        this.updateEyeTransform();
    }
    moveTo(x, y) {
        this.position[0] = x;
        this.position[1] = y;
        this.updateEyeTransform();
    }
    updateEyeTransform() {
        this.element.style.transform = `translate(${this.position[0]}px, ${this.position[1]}px) scale(${this.size})`;
    }
}
class Cliddy1 extends globalThis.HTMLElement {
    _lookAt = [
        0,
        0
    ];
    set lookAt(location) {
        if (!location || typeof location !== "object" || location.length !== 2) {
            throw new Error(`Trying to set an invalid Cliddy.lookAt array \
			 value: ${location}`);
        }
        if (location[0] < 0 || location[1] < 0) {
            throw new Error(`Trying to set Cliddy.lookAt with negative numbers \
			${location}`);
        }
        if (typeof location[0] !== "number" || typeof location[1] !== "number") {
            throw new Error(`Cliddy.lookAt only accepts positive numbers: \
			${location}`);
        }
        this.attributeChangedCallback("lookAt", this._lookAt, location);
        this._lookAt = location;
    }
    constructor(){
        super();
        this.attachShadow({
            mode: "open"
        });
        const bodyColor1 = this.getAttribute("data-body-color") || "#FFC805";
        const shadowColor1 = this.getAttribute("data-shadow-color") || "#EBB803";
        this._selectedFace = this.validFace(this.getAttribute("face") || ":)");
        this._touchedFace = this.validFace(this.getAttribute("touched-face") || ":D");
        const cliddy = globalThis.document.createElement("div");
        cliddy.setAttribute("class", "cliddy");
        cliddy.appendChild(this._constructBody(bodyColor1, shadowColor1));
        this._leftEye = new CliddyEye(71, 86);
        this._rightEye = new CliddyEye(141, 86);
        cliddy.appendChild(this._leftEye.element);
        cliddy.appendChild(this._rightEye.element);
        this._closedEyes = this._constructClosedEyes();
        cliddy.appendChild(this._closedEyes);
        this._glasses = this._constructGlasses();
        cliddy.appendChild(this._glasses);
        this._mouthSmile = this._constructMouthSmile();
        this._mouthBigSmile = this._constructMouthBigSmile();
        this._mouthPoker = this._constructMouthPoker();
        this._mouthNerdySmile = this._constructMouthNerdySmile();
        this._mouthNerdy = this._constructMouthNerdy();
        this._tongue = this._constructTongue();
        this._tongue.style.position = "absolute";
        this._tongue.style.opacity = "0";
        this._tongue.style.transform = "transform: translate(130px, 165px) rotate(-11deg) scale(1.2);";
        cliddy.appendChild(this._tongue);
        cliddy.appendChild(this._mouthSmile);
        cliddy.appendChild(this._mouthBigSmile);
        cliddy.appendChild(this._mouthPoker);
        cliddy.appendChild(this._mouthNerdySmile);
        cliddy.appendChild(this._mouthNerdy);
        const style = globalThis.document.createElement("style");
        style.textContent = `.cliddy {\n      width: 256px;\n      height: 256px;\n      perspective: 40px;\n      // box-shadow: 2px 2px 50px rgba(0, 0, 0, 0.2);\n      transform: rotateY(0deg);\n    }`;
        this.openEyes();
        this.blink();
        this.face(this._selectedFace);
        if (this.shadowRoot) {
            this.shadowRoot.append(style, cliddy);
        } else {
            throw new Error("No shadow root support");
        }
    }
    _constructMouthSmile() {
        const mouth = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mouth.setAttributeNS(null, "viewBox", "0 0 41 16");
        mouth.setAttributeNS(null, "width", "41px");
        mouth.setAttributeNS(null, "height", "16px");
        mouth.setAttributeNS(null, "fill", "none");
        const path = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttributeNS(null, "d", "M3 3C8 16 34 16 38 3");
        path.setAttributeNS(null, "stroke", "black");
        path.setAttributeNS(null, "stroke-width", "5");
        path.setAttributeNS(null, "stroke-linecap", "round");
        path.setAttributeNS(null, "stroke-linejoin", "round");
        mouth.appendChild(path);
        mouth.style.position = "absolute";
        mouth.style.transform = "translate(109px, 153px)";
        return mouth;
    }
    _constructMouthBigSmile() {
        var mouth = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mouth.setAttributeNS(null, "viewBox", "0 0 35 24");
        mouth.setAttributeNS(null, "width", "35px");
        mouth.setAttributeNS(null, "height", "24px");
        mouth.setAttributeNS(null, "fill", "none");
        mouth.innerHTML = `\n		<mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="35" height="24">\n			<path d="M34.6083 6.03784C34.6083 15.5947 26.861 23.342 17.3041 23.342C7.74733 23.342 0 15.5947 0 6.03784C0 -3.51897 7.74733 1.13106 17.3041 1.13106C26.861 1.13106 34.6083 -3.51897 34.6083 6.03784Z" fill="#020202"/>\n		</mask>\n		<g mask="url(#mask0)">\n			<path d="M34.6083 6.03784C34.6083 15.5947 26.861 23.342 17.3041 23.342C7.74733 23.342 0 15.5947 0 6.03784C0 -3.51897 7.74733 1.13106 17.3041 1.13106C26.861 1.13106 34.6083 -3.51897 34.6083 6.03784Z" fill="#020202"/>\n			<circle cx="27.8971" cy="28.8177" r="23.5336" fill="#FF6B8F"/>\n    </g>`;
        mouth.style.position = "absolute";
        mouth.style.transform = "translate(111px, 147px)";
        return mouth;
    }
    _constructMouthPoker() {
        const mouth = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mouth.setAttributeNS(null, "viewBox", "0 0 45 5");
        mouth.setAttributeNS(null, "width", "45px");
        mouth.setAttributeNS(null, "height", "5px");
        mouth.setAttributeNS(null, "fill", "none");
        mouth.innerHTML = `\n			<line\n				x1="2.5"\n				y1="2.5"\n				x2="42.5"\n				y2="2.5"\n				stroke="black"\n				stroke-width="5"\n				stroke-linecap="round"\n				stroke-linejoin="round"/>`;
        mouth.style.position = "absolute";
        mouth.style.transform = "translate(107px, 158px);";
        return mouth;
    }
    _constructMouthNerdySmile() {
        const mouth = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mouth.setAttributeNS(null, "viewBox", "0 0 35 24");
        mouth.setAttributeNS(null, "width", "35px");
        mouth.setAttributeNS(null, "height", "24px");
        mouth.setAttributeNS(null, "fill", "none");
        mouth.innerHTML = `\n  <mask\n    id="mask0"\n    mask-type="alpha"\n    maskUnits="userSpaceOnUse"\n    x="0"\n    y="0"\n    width="35"\n    height="24"\n  >\n    <path\n      d="M34.6083 6.03784C34.6083 15.5947 26.861 23.342 17.3041 23.342C7.74733 23.342 0 15.5947 0 6.03784C0 -3.51897 7.74733 1.13106 17.3041 1.13106C26.861 1.13106 34.6083 -3.51897 34.6083 6.03784Z"\n      fill="#020202"\n    />\n  </mask>\n  <g mask="url(#mask0)">\n    <path\n      d="M34.6083 6.03784C34.6083 15.5947 26.861 23.342 17.3041 23.342C7.74733 23.342 0 15.5947 0 6.03784C0 -3.51897 7.74733 1.13106 17.3041 1.13106C26.861 1.13106 34.6083 -3.51897 34.6083 6.03784Z"\n      fill="#020202"\n    />\n    <circle cx="17.8972" cy="37.8177" r="23.5336" fill="#FF6B8F" />\n    <rect\n      x="7.5"\n      y="-1.5"\n      width="9"\n      height="10"\n      rx="2.5"\n      fill="white"\n      stroke="black"\n      stroke-linecap="round"\n      stroke-linejoin="round"\n    />\n    <rect\n      x="18.5"\n      y="-1.5"\n      width="9"\n      height="10"\n      rx="2.5"\n      fill="white"\n      stroke="black"\n      stroke-linecap="round"\n      stroke-linejoin="round"\n    />\n  </g>`;
        mouth.style.position = "absolute";
        mouth.style.transform = "translate(111px, 154px)";
        return mouth;
    }
    _constructMouthNerdy() {
        const template = globalThis.document.createElement("template");
        const mouthNerdySvg = `\n    <svg\n  width="41"\n  height="21"\n  viewBox="0 0 41 21"\n  fill="none"\n  xmlns="http://www.w3.org/2000/svg"\n>\n  <rect\n    x="10.5"\n    y="10.5"\n    width="9"\n    height="10"\n    rx="2.5"\n    fill="white"\n  />\n  <rect\n    x="21.5"\n    y="10.5"\n    width="9"\n    height="10"\n    rx="2.5"\n    fill="white"\n  />\n  <path\n    d="M3 3C8 16 34 16 38 3"\n    stroke="black"\n    stroke-width="5"\n    stroke-linecap="round"\n    stroke-linejoin="round"\n  />\n</svg>\n    `;
        template.innerHTML = mouthNerdySvg;
        const svg = template.content.querySelector("svg");
        if (!svg) {
            throw new Error("Could not create Cliddy nerdy mouth");
        }
        svg.style.position = "absolute";
        svg.style.transform = "translate(110px, 154px)";
        return svg;
    }
    _constructGlasses() {
        const template = globalThis.document.createElement("template");
        const glassesSvg = `<svg\n  width="175"\n  height="84"\n  viewBox="0 0 175 84"\n  fill="none"\n  xmlns="http://www.w3.org/2000/svg"\n>\n  <rect\n    x="3.5"\n    y="3"\n    width="78"\n    height="78"\n    rx="39"\n    stroke="#001252"\n    stroke-width="6"\n    stroke-linecap="round"\n    stroke-linejoin="round"\n  />\n  <path\n    d="M72.5 15C84.6467 11.015 91.21 10.9851 102.5 15"\n    stroke="#001252"\n    stroke-width="6"\n  />\n  <rect\n    x="93.5"\n    y="3"\n    width="78"\n    height="78"\n    rx="39"\n    stroke="#001252"\n    stroke-width="6"\n    stroke-linecap="round"\n    stroke-linejoin="round"\n  />\n</svg>;`.trim();
        template.innerHTML = glassesSvg;
        const svg = template.content.querySelector("svg");
        if (!svg) {
            throw new Error("Could not create Cliddy glasses");
        }
        svg.style.position = "absolute";
        svg.style.transform = "translate(43px, 70px)";
        return svg;
    }
    _constructTongue() {
        const tongue = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tongue.setAttributeNS(null, "viewBox", "0 0 12 15");
        tongue.setAttributeNS(null, "width", "12px");
        tongue.setAttributeNS(null, "height", "15px");
        tongue.setAttributeNS(null, "fill", "none");
        tongue.innerHTML = `\n			<path d="M1 1L11 1L11 1.00219L11 1.01916L11 1.0361L11 1.05303L11 1.06994L11 1.08683L11 1.10369L11 1.12054L11 1.13737L11 1.15418L11 1.17097L11 1.18775L11 1.2045L11 1.22123L11 1.23795L11 1.25464L11 1.27132L11 1.28798L11 1.30462L11 1.32124L11 1.33784L11 1.35443L11 1.37099L11 1.38754L11 1.40407L11 1.42058L11 1.43707L11 1.45355L11 1.47001L11 1.48645L11 1.50287L11 1.51927L11 1.53566L11 1.55203L11 1.56838L11 1.58471L11 1.60103L11 1.61733L11 1.63361L11 1.64987L11 1.66612L11 1.68235L11 1.69856L11 1.71476L11 1.73094L11 1.7471L11 1.76325L11 1.77938L11 1.79549L11 1.81159L11 1.82767L11 1.84373L11 1.85978L11 1.87581L11 1.89183L11 1.90783L11 1.92381L11 1.93978L11 1.95573L11 1.97167L11 1.98759L11 2.0035L11 2.01939L11 2.03526L11 2.05112L11 2.06696L11 2.08279L11 2.09861L11 2.1144L11 2.13019L11 2.14596L11 2.16171L11 2.17745L11 2.19317L11 2.20888L11 2.22458L11 2.24026L11 2.25592L11 2.27157L11 2.28721L11 2.30283L11 2.31844L11 2.33404L11 2.34962L11 2.36519L11 2.38074L11 2.39628L11 2.4118L11 2.42731L11 2.44281L11 2.4583L11 2.47377L11 2.48923L11 2.50467L11 2.5201L11 2.53552L11 2.55093L11 2.56632L11 2.5817L11 2.59707L11 2.61242L11 2.62776L11 2.64309L11 2.6584L11 2.67371L11 2.689L11 2.70428L11 2.71954L11 2.7348L11 2.75004L11 2.76527L11 2.78049L11 2.79569L11 2.81089L11 2.82607L11 2.84124L11 2.8564L11 2.87155L11 2.88668L11 2.90181L11 2.91692L11 2.93202L11 2.94712L11 2.9622L11 2.97726L11 2.99232L11 3.00737L11 3.0224L11 3.03743L11 3.05244L11 3.06745L11 3.08244L11 3.09742L11 3.1124L11 3.12736L11 3.14231L11 3.15725L11 3.17218L11 3.18711L11 3.20202L11 3.21692L11 3.23181L11 3.24669L11 3.26156L11 3.27643L11 3.29128L11 3.30612L11 3.32096L11 3.33578L11 3.3506L11 3.36541L11 3.3802L11 3.39499L11 3.40977L11 3.42454L11 3.4393L11 3.45406L11 3.4688L11 3.48353L11 3.49826L11 3.51298L11 3.52769L11 3.54239L11 3.55709L11 3.57177L11 3.58645L11 3.60112L11 3.61578L11 3.63043L11 3.64508L11 3.65972L11 3.67435L11 3.68897L11 3.70358L11 3.71819L11 3.73279L11 3.74738L11 3.76197L11 3.77655L11 3.79112L11 3.80568L11 3.82024L11 3.83479L11 3.84933L11 3.86387L11 3.8784L11 3.89292L11 3.90744L11 3.92195L11 3.93646L11 3.95095L11 3.96544L11 3.97993L11 3.99441L11 4.00888L11 4.02335L11 4.03781L11 4.05227L11 4.06672L11 4.08116L11 4.0956L11 4.11003L11 4.12446L11 4.13888L11 4.1533L11 4.16771L11 4.18212L11 4.19652L11 4.21091L11 4.22531L11 4.23969L11 4.25407L11 4.26845L11 4.28282L11 4.29719L11 4.31155L11 4.32591L11 4.34027L11 4.35462L11 4.36896L11 4.3833L11 4.39764L11 4.41197L11 4.4263L11 4.44063L11 4.45495L11 4.46927L11 4.48358L11 4.49789L11 4.5122L11 4.52651L11 4.54081L11 4.5551L11 4.5694L11 4.58369L11 4.59798L11 4.61226L11 4.62654L11 4.64082L11 4.6551L11 4.66937L11 4.68364L11 4.69791L11 4.71217L11 4.72644L11 4.7407L11 4.75496L11 4.76921L11 4.78347L11 4.79772L11 4.81197L11 4.82622L11 4.84046L11 4.85471L11 4.86895L11 4.88319L11 4.89743L11 4.91167L11 4.92591L11 4.94014L11 4.95437L11 4.96861L11 4.98284L11 4.99707L11 5.0113L11 5.02553L11 5.03975L11 5.05398L11 5.06821L11 5.08243L11 5.09666L11 5.11088L11 5.12511L11 5.13933L11 5.15355L11 5.16778L11 5.182L11 5.19622L11 5.21044L11 5.22467L11 5.23889L11 5.25311L11 5.26734L11 5.28156L11 5.29578L11 5.31001L11 5.32423L11 5.33846L11 5.35269L11 5.36691L11 5.38114L11 5.39537L11 5.4096L11 5.42383L11 5.43807L11 5.4523L11 5.46653L11 5.48077L11 5.49501L11 5.50925L11 5.52349L11 5.53773L11 5.55198L11 5.56622L11 5.58047L11 5.59472L11 5.60897L11 5.62323L11 5.63748L11 5.65174L11 5.666L11 5.68026L11 5.69453L11 5.7088L11 5.72307L11 5.73734L11 5.75162L11 5.76589L11 5.78018L11 5.79446L11 5.80875L11 5.82304L11 5.83733L11 5.85163L11 5.86593L11 5.88023L11 5.89454L11 5.90885L11 5.92316L11 5.93748L11 5.9518L11 5.96613L11 5.98046L11 5.99479L11 6.00913L11 6.02347L11 6.03781L11 6.05216L11 6.06652L11 6.08088L11 6.09524L11 6.10961L11 6.12398L11 6.13835L11 6.15274L11 6.16712L11 6.18151L11 6.19591L11 6.21031L11 6.22472L11 6.23913L11 6.25354L11 6.26796L11 6.28239L11 6.29682L11 6.31126L11 6.32571L11 6.34016L11 6.35461L11 6.36907L11 6.38354L11 6.39801L11 6.41249L11 6.42697L11 6.44146L11 6.45596L11 6.47047L11 6.48498L11 6.49949L11 6.51401L11 6.52854L11 6.54308L11 6.55762L11 6.57217L11 6.58673L11 6.60129L11 6.61586L11 6.63044L11 6.64503L11 6.65962L11 6.67422L11 6.68882L11 6.70344L11 6.71806L11 6.73269L11 6.74733L11 6.76197L11 6.77662L11 6.79129L11 6.80595L11 6.82063L11 6.83531L11 6.85001L11 6.86471L11 6.87942L11 6.89414L11 6.90886L11 6.9236L11 6.93834L11 6.95309L11 6.96785L11 6.98262L11 6.9974L11 7.01219L11 7.02699L11 7.04179L11 7.05661L11 7.07143L11 7.08626L11 7.10111L11 7.11596L11 7.13082L11 7.14569L11 7.16057L11 7.17546L11 7.19036L11 7.20528L11 7.2202L11 7.23513L11 7.25007L11 7.26502L11 7.27998L11 7.29495L11 7.30993L11 7.32492L11 7.33993L11 7.35494L11 7.36997L11 7.385L11 7.40005L11 7.4151L11 7.43017L11 7.44525L11 7.46034L11 7.47544L11 7.49055L11 7.50568L11 7.52081L11 7.53596L11 7.55112L11 7.56629L11 7.58147L11 7.59666L11 7.61187L11 7.62708L11 7.64231L11 7.65755L11 7.67281L11 7.68807L11 7.70335L11 7.71864L11 7.73394L11 7.74926L11 7.76458L11 7.77992L11 7.79528C11 8.33793 10.7866 8.94087 10.4654 9.84847C10.4517 9.8871 10.4378 9.92628 10.4238 9.96603C9.54394 11.4307 8.78121 12.4641 8.08972 13.126C7.39041 13.7954 6.85465 14 6.41663 14C5.96504 14 5.37841 13.7833 4.58218 13.0929C3.79469 12.4101 2.89978 11.3482 1.84397 9.85525C1.44301 9.15385 1.25227 8.68947 1 7.67418L1 5.19685L1 1Z"\n			fill="#B93434" stroke="black" stroke-width="2"/>\n			<line x1="6.09998" y1="1.5" x2="6.09998" y2="5.5" stroke="black"\n			stroke-linecap="round" stroke-linejoin="round"/>`;
        return tongue;
    }
    _constructBody(bodyColor = "#FFC805", shadowColor = "#EBB803") {
        const svgNS1 = "http://www.w3.org/2000/svg";
        const body = globalThis.document.createElementNS(svgNS1, "svg");
        body.setAttributeNS(null, "viewBox", "0 0 256 256");
        body.setAttributeNS(null, "width", "256px");
        body.setAttributeNS(null, "height", "256px");
        body.setAttributeNS(null, "fill", "none");
        body.style.position = "absolute";
        const rect = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttributeNS(null, "width", "256");
        rect.setAttributeNS(null, "height", "256");
        rect.setAttributeNS(null, "rx", "32");
        rect.setAttributeNS(null, "x", "0");
        rect.setAttributeNS(null, "y", "0");
        rect.setAttributeNS(null, "fill", bodyColor);
        var leftShadow = globalThis.document.createElementNS(svgNS1, "path");
        leftShadow.setAttributeNS(null, "d", "M-0.5 -5C271.5 32.5 -1.5 248 244 255.5H-0.5V-5Z");
        leftShadow.setAttributeNS(null, "fill", shadowColor);
        leftShadow.setAttributeNS(null, "clip-path", "url(#cliddyBodyMask)");
        const defs1 = globalThis.document.createElementNS(svgNS1, "defs");
        const mask1 = globalThis.document.createElementNS(svgNS1, "clipPath");
        mask1.setAttributeNS(null, "id", "cliddyBodyMask");
        const maskBody = rect.cloneNode(true);
        maskBody.setAttributeNS(null, "fill", "#FFFFFF");
        mask1.appendChild(maskBody);
        defs1.appendChild(mask1);
        body.appendChild(defs1);
        rect.setAttributeNS(null, "clip-path", "url(#cliddyBodyMask)");
        body.appendChild(rect);
        body.appendChild(leftShadow);
        return body;
    }
    _constructClosedEyes() {
        const svgNS1 = "http://www.w3.org/2000/svg";
        const closedEyes = globalThis.document.createElementNS(svgNS1, "svg");
        closedEyes.classList.add("closedEyes");
        closedEyes.setAttributeNS(null, "viewBox", "0 0 127 29");
        closedEyes.setAttributeNS(null, "width", "127px");
        closedEyes.setAttributeNS(null, "height", "29px");
        closedEyes.setAttributeNS(null, "fill", "none");
        closedEyes.style.position = "absolute";
        closedEyes.style.transform = "translate(68px, 110px)";
        closedEyes.innerHTML = `\n			<line x1="122.765" y1="7.8233" x2="124.823" y2="8.23495" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<line x1="120.95" y1="12.1644" x2="123.164" y2="13.0502" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<line x1="119.108" y1="15.7657" x2="121.766" y2="17.8917" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<path d="M75.9524 2.06614C75.7128 0.987873 74.6444 0.308011 73.5661 0.547626C72.4879 0.787241 71.808 1.85559 72.0476 2.93386L75.9524 2.06614ZM124 2.5C124 1.39543 123.105 0.5 122 0.5C120.895 0.5 120 1.39543 120 2.5L124 2.5ZM72.0476 2.93386C74.1292 12.3008 78.3397 18.9294 83.6461 23.0623C88.9505 27.1936 95.2203 28.7265 101.203 28.1146C113.132 26.8947 124 17.1158 124 2.5L120 2.5C120 14.8842 110.868 23.1053 100.797 24.1354C95.7797 24.6485 90.5495 23.3689 86.1039 19.9065C81.6603 16.4456 77.8708 10.6992 75.9524 2.06614L72.0476 2.93386Z" fill="black"/>\n			<line x1="1.5" y1="-1.5" x2="3.59902" y2="-1.5" transform="matrix(-0.980581 0.196116 0.196116 0.980581 6 9)" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<line x1="1.5" y1="-1.5" x2="3.88516" y2="-1.5" transform="matrix(-0.928477 0.371391 0.371391 0.928477 8 13)" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<line x1="1.5" y1="-1.5" x2="4.90312" y2="-1.5" transform="matrix(-0.780869 0.624695 0.624695 0.780869 10 16)" stroke="black" stroke-width="3" stroke-linecap="round"/>\n			<path d="M51.0476 2.06614C51.2872 0.987873 52.3556 0.308011 53.4339 0.547626C54.5121 0.787241 55.192 1.85559 54.9524 2.93386L51.0476 2.06614ZM3 2.5C3 1.39543 3.89543 0.5 5 0.5C6.10457 0.5 7 1.39543 7 2.5L3 2.5ZM54.9524 2.93386C52.8708 12.3008 48.6603 18.9294 43.3539 23.0623C38.0495 27.1936 31.7797 28.7265 25.7965 28.1146C13.8682 26.8947 3 17.1158 3 2.5L7 2.5C7 14.8842 16.1318 23.1053 26.2035 24.1354C31.2203 24.6485 36.4505 23.3689 40.8961 19.9065C45.3397 16.4456 49.1292 10.6992 51.0476 2.06614L54.9524 2.93386Z" fill="black"/>`;
        return closedEyes;
    }
    validFace(face) {
        switch(face){
            case ":D":
            case ":|":
            case ":P":
            case "8D":
            case "8)":
                return face;
            default:
                return ":)";
        }
    }
    face(type) {
        this._mouthPoker.style.opacity = "0";
        this._mouthSmile.style.opacity = "0";
        this._mouthBigSmile.style.opacity = "0";
        this._mouthNerdySmile.style.opacity = "0";
        this._mouthNerdy.style.opacity = "0";
        this._tongue.style.opacity = "0";
        this._glasses.style.opacity = "0";
        this._leftEye.moveTo(71, 86);
        this._rightEye.moveTo(141, 86);
        this._leftEye.scaleTo(1);
        this._rightEye.scaleTo(1);
        switch(type){
            case ":D":
                this._mouthBigSmile.style.opacity = "1";
                break;
            case ":|":
                this._mouthPoker.style.opacity = "1";
                break;
            case ":P":
                this._mouthSmile.style.opacity = "1";
                this._tongue.style.opacity = "1";
                break;
            case "8D":
                this._glasses.style.opacity = "1";
                this._mouthNerdySmile.style.opacity = "1";
                break;
            case "8)":
                this._glasses.style.opacity = "1";
                this._mouthNerdy.style.opacity = "1";
                break;
            default:
                this._mouthSmile.style.opacity = "1";
        }
    }
    closeEyes() {
        this._leftEye.element.style.opacity = "0";
        this._rightEye.element.style.opacity = "0";
        this._closedEyes.style.opacity = "1";
    }
    openEyes() {
        if (this._leftEye && this._leftEye.element && this._leftEye.element.style) {
            this._leftEye.element.style.opacity = "1";
            this._leftEye.irisElement.style.opacity = "1";
        }
        if (this._rightEye && this._rightEye.element && this._rightEye.element.style) {
            this._rightEye.element.style.opacity = "1";
            this._rightEye.irisElement.style.opacity = "1";
        }
        this._closedEyes.style.opacity = "0";
    }
    blink() {
        var blinkTime = Math.max(1500, Math.random() * 6000);
        setTimeout(()=>{
            this.closeEyes();
            setTimeout(()=>this.openEyes()
            , 300);
            this.blink();
        }, blinkTime);
    }
    connectedCallback() {
        if (!this._clientRect) {
            this._clientRect = this.getBoundingClientRect();
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        var [x2, y2] = newValue;
        if (this._clientRect) {
            this._leftEye.lookAt(x2, y2, this._clientRect.x, this._clientRect.y);
            this._rightEye.lookAt(x2, y2, this._clientRect.x, this._clientRect.y);
        }
        if (this.isInside(x2, y2)) {
            this.face(this._touchedFace);
        } else {
            this.face(this._selectedFace);
        }
    }
    isInside(x, y) {
        return this._clientRect && x > this._clientRect.x && x < this._clientRect.x + this._clientRect.width && y > this._clientRect.y && y < this._clientRect.y + this._clientRect.height;
    }
}
export { Cliddy1 as Cliddy };
