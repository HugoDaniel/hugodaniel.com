(function() {
    // NOTE: Should match syntheticDefaultExportPolyfill in LoaderAPI.ts
    function syntheticDefaultExportPolyfill(input) {
        if( input === null ||
            ['function', 'object', 'array'].indexOf(typeof input) === -1 ||
            input.hasOwnProperty("default") // use hasOwnProperty to avoid triggering usage warnings from libraries like mobx
        ) {
            return
        }
        // to get around frozen input
        if (Object.isFrozen(input) ) {
            input.default = input;
            return;
        }
        // free to define properties
        Object.defineProperty(input, "default", {
            value: input,
            writable: true,
            enumerable: false
        });
    }
    if (window.$fsx) {
        return;
    };
    var $fsx = window.$fsx = {}
    $fsx.f = {}
    // cached modules
    $fsx.m = {};
    $fsx.r = function(id) {
        var cached = $fsx.m[id];
        // resolve if in cache
        if (cached) {
            return cached.m.exports;
        }
        var file = $fsx.f[id];
        if (!file)
            return;
        cached = $fsx.m[id] = {};
        cached.exports = {};
        cached.m = { exports: cached.exports };
        file.call(cached.exports, cached.m, cached.exports);
        syntheticDefaultExportPolyfill(cached.m.exports);
        return cached.m.exports;
    };
})();
(function($fsx){
// default/main.jsx
$fsx.f[0] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const dom_1 = $fsx.r(72);
const engine_1 = $fsx.r(75);
$fsx.r(227);
$fsx.r(228);
let resizeFunc;
(function () {
    const throttle = function (type, name, timeout = 333, obj = window) {
        let timeoutId;
        if (resizeFunc) {
            obj.removeEventListener(type, resizeFunc);
        }
        resizeFunc = function () {
            if (!timeoutId) {
                timeoutId = setTimeout(function () {
                    obj.dispatchEvent(new CustomEvent(name));
                    timeoutId = null;
                }, timeout);
            }
        };
        obj.addEventListener(type, resizeFunc);
    };
    throttle('resize', 'optimizedResize');
}());
class Main {
    constructor() {
        this.cart = new data_1.Cart();
        this.onboarding = new data_1.Onboarding();
        this.projects = new data_1.ProjectMap();
        this.state = this.projects.current.fatState;
        this.net = new engine_1.Net();
        this.meander = new data_1.Meander();
        this.player = null;
        this.init();
        const _element = document.getElementById('app');
        if (_element) {
            this.container = _element;
        } else {
            throw new Error('Container #app not found');
        }
        window.addEventListener('optimizedResize', this.resizeDOM.bind(this));
    }
    init() {
        this.runtime = new engine_1.Runtime(this.state.current);
        this.runtime.setInitialState(this.projects.current.initialState);
        const refresher = new dom_1.Refresher(this.setRuntime.bind(this), this.setState.bind(this), this.setStateAndDOM.bind(this), this.updateDOM.bind(this), this.setMeander.bind(this), this.setCart.bind(this), this.setProjects.bind(this), this.setOnboarding.bind(this), this.setPlayer.bind(this), this.setPlayerAndDOM.bind(this), this.setInitialPlayerState.bind(this), this.newProject.bind(this));
        this.events = new dom_1.Events(this.runtime, this.state, this.meander, this.cart, this.net, this.projects, this.onboarding, this.player, refresher);
        this.debug = new dom_1.Debug('production' === 'development', this.runtime, this.events, this.state);
    }
    setMeander(m) {
        this.meander = m;
        this.events.updateMeander(this.meander);
    }
    setCart(c) {
        this.cart = c;
        this.events.updateCart(this.cart);
    }
    setOnboarding(o) {
        this.onboarding = o;
        this.events.updateOnboarding(this.onboarding);
    }
    setRuntime(rt) {
        this.runtime = rt;
        if (this.events) {
            this.events.updateRuntime(this.runtime);
        }
        if (this.debug) {
            this.debug.runtime = rt;
            this.debug.events = this.events;
        }
    }
    setState(s) {
        this.state = s;
        this.events.updateState(this.state);
        this.debug.fat = s;
        this.debug.events = this.events;
    }
    setStateAndDOM(s, action) {
        this.setState(s);
        this.debug.fat = s;
        this.debug.events = this.events;
        this.updateDOM(action || dom_1.UpdateAction.All);
    }
    setProjects(p) {
        this.events.updateProjects(p);
        this.projects = p;
    }
    setPlayer(p) {
        this.events.updatePlayer(p);
        this.player = p;
    }
    setPlayerAndDOM(p, action) {
        this.setPlayer(p);
        this.updateDOM(action || dom_1.UpdateAction.All);
    }
    setInitialPlayerState(p, initialState) {
        this.setPlayer(p);
        this.events.initialPlayerState(initialState);
    }
    newProject(p) {
        this.events.meanderEvents.startLoading();
        this.projects.current = p;
        this.state = p.fatState;
        engine_1.Runtime.newProject(this.runtime, this.state.current).then(rt => {
            this.setProjects(this.projects);
            this.setRuntime(rt);
            this.runtime.setInitialState(p.initialState);
            this.events.sceneEvents.reset();
            this.setStateAndDOM(this.state);
            setTimeout(this.events.meanderEvents.stopLoading, 600);
        });
    }
    resizeDOM() {
        const curDPR = Math.round(window.devicePixelRatio * 100);
        if (curDPR !== this.runtime.device.dpr) {
            return;
        }
        inferno_1.render(createVNode(1, 'p', 'tc w-100 h-100 center flex flex-column items-center justify-center bg-white sans-serif fixed ttu f5 transition-o o-90', createTextVNode('Resizing'), 2), this.container);
        this.init();
        this.updateDOM(dom_1.UpdateAction.All);
    }
    updateDOM(action) {
        this.debug.render();
        inferno_1.render(createComponentVNode(2, dom_1.GridGeneratorDOM, {
            'state': this.state.current,
            'cart': this.cart,
            'onboarding': this.onboarding,
            'projects': this.projects,
            'runtime': this.runtime,
            'events': this.events,
            'meander': this.meander,
            'player': this.player,
            'action': action
        }), this.container);
    }
}
go(() => {
    const main = new Main();
    main.updateDOM(dom_1.UpdateAction.All);
});
}
// default/data.js
$fsx.f[1] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var vector_1 = $fsx.r(4);
exports.Vector2D = vector_1.Vector2D;
var set_1 = $fsx.r(5);
exports.VectorMap = set_1.VectorMap;
var random_1 = $fsx.r(7);
exports.RandomArray = random_1.RandomArray;
var wheel_1 = $fsx.r(8);
exports.WheelMode = wheel_1.WheelMode;
var rgb_1 = $fsx.r(9);
exports.RGBColor = rgb_1.RGBColor;
var ui_1 = $fsx.r(20);
exports.UIState = ui_1.UIState;
var shape_editor_1 = $fsx.r(44);
exports.UIShapeEditorMode = shape_editor_1.UIShapeEditorMode;
var fill_editor_1 = $fsx.r(41);
exports.UIFillEditorMode = fill_editor_1.UIFillEditorMode;
var export_1 = $fsx.r(40);
exports.ExportAt = export_1.ExportAt;
exports.ExportEditorFormat = export_1.ExportEditorFormat;
exports.ExportSize = export_1.ExportSize;
var publish_1 = $fsx.r(43);
exports.PublishState = publish_1.PublishState;
exports.PublishAt = publish_1.PublishAt;
var defaults_1 = $fsx.r(29);
exports.MainMenuId = defaults_1.MainMenuId;
exports.ToolsMenuId = defaults_1.ToolsMenuId;
var state_1 = $fsx.r(52);
exports.State = state_1.State;
var fat_1 = $fsx.r(53);
exports.FatState = fat_1.FatState;
var action_sets_1 = $fsx.r(56);
exports.FatActionSets = action_sets_1.FatActionSets;
var meander_1 = $fsx.r(57);
exports.Meander = meander_1.Meander;
exports.MeanderCourse = meander_1.MeanderCourse;
var verify_1 = $fsx.r(63);
exports.VerifyingState = verify_1.VerifyingState;
var recover_1 = $fsx.r(62);
exports.RecoverState = recover_1.RecoverState;
var about_1 = $fsx.r(58);
exports.AboutMenuId = about_1.AboutMenuId;
var login_1 = $fsx.r(60);
exports.MeanderLogin = login_1.MeanderLogin;
var profile_1 = $fsx.r(61);
exports.ProfileMenuId = profile_1.ProfileMenuId;
exports.ProfileStatus = profile_1.ProfileStatus;
var view_1 = $fsx.r(64);
exports.MeanderView = view_1.MeanderView;
var project_1 = $fsx.r(65);
exports.Project = project_1.Project;
exports.ProjectAction = project_1.ProjectAction;
exports.ProjectMap = project_1.ProjectMap;
exports.canRemix = project_1.canRemix;
var player_1 = $fsx.r(66);
exports.PlayerState = player_1.PlayerState;
var cart_1 = $fsx.r(67);
exports.Cart = cart_1.Cart;
exports.CartAt = cart_1.CartAt;
var product_1 = $fsx.r(69);
exports.PosterType = product_1.PosterType;
exports.ProductAt = product_1.ProductAt;
exports.PosterSizes = product_1.PosterSizes;
exports.TShirtType = product_1.TShirtType;
exports.TShirtSize = product_1.TShirtSize;
exports.TShirtColor = product_1.TShirtColor;
var country_1 = $fsx.r(70);
exports.getCountry = country_1.getCountry;
var onboarding_1 = $fsx.r(71);
exports.Onboarding = onboarding_1.Onboarding;
}
// default/data/state/math/vector.js
$fsx.f[4] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    toJSON() {
        return {
            x: this.x,
            y: this.y
        };
    }
    static revive(v) {
        return new Vector2D(v.x, v.y);
    }
    get fst() {
        return this.x;
    }
    get snd() {
        return this.y;
    }
    toString() {
        return `(${ this.x }, ${ this.y })`;
    }
    isEqual(v) {
        return this.x === v.x && this.y === v.y;
    }
    static isEqual(v1, v2) {
        return v1.x === v2.x && v1.y === v2.y;
    }
    static fromObj(obj) {
        return new Vector2D(obj.x, obj.y);
    }
    static zero() {
        return new Vector2D();
    }
    static pow7() {
        return new Vector2D(127, 127);
    }
    static isBetween(a, b, c) {
        const epsilon = 0.1;
        const crossProduct = (c.y - a.y) * (b.x - a.x) - (c.x - a.x) * (b.y - a.y);
        if (Math.abs(crossProduct) > epsilon) {
            return false;
        }
        const dotProduct = (c.x - a.x) * (b.x - a.x) + (c.y - a.y) * (b.y - a.y);
        if (dotProduct < 0) {
            return false;
        }
        const squaredLengthBA = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
        if (dotProduct > squaredLengthBA) {
            return false;
        }
        return true;
    }
    static getNearSet(pt, _epsilon = 1) {
        const result = new Array();
        let epsilon = Math.abs(Math.round(_epsilon));
        const x = pt.x;
        const y = pt.y;
        while (epsilon > 0) {
            const xA = x - epsilon;
            const xB = x + epsilon;
            const yA = y - epsilon;
            const yB = y + epsilon;
            result.push(new Vector2D(xA, yA));
            result.push(new Vector2D(x, yA));
            result.push(new Vector2D(xB, yA));
            result.push(new Vector2D(xA, y));
            result.push(new Vector2D(xB, y));
            result.push(new Vector2D(xA, yB));
            result.push(new Vector2D(x, yB));
            result.push(new Vector2D(xB, yB));
            epsilon = epsilon - 1;
        }
        return result;
    }
    static abs(p) {
        return new Vector2D(Math.abs(p.x), Math.abs(p.y));
    }
    static createRounded(res, x, y) {
        const halfRes = res / 2;
        let result;
        if (x >= halfRes && y < halfRes) {
            result = new Vector2D(Math.floor(x), Math.ceil(y));
        } else if (x < halfRes && y < halfRes) {
            result = new Vector2D(Math.ceil(x), Math.ceil(y));
        } else if (x < halfRes && y >= halfRes) {
            result = new Vector2D(Math.ceil(x), Math.floor(y));
        } else {
            result = new Vector2D(Math.floor(x), Math.floor(y));
        }
        return result;
    }
    static insideTriangle(x, y, p0, p1, p2) {
        const area = 0.5 * (-p1.y * p2.x + p0.y * (-p1.x + p2.x) + p0.x * (p1.y - p2.y) + p1.x * p2.y);
        const s = 1 / (2 * area) * (p0.y * p2.x - p0.x * p2.y + (p2.y - p0.y) * x + (p0.x - p2.x) * y);
        const t = 1 / (2 * area) * (p0.x * p1.y - p0.y * p1.x + (p0.y - p1.y) * x + (p1.x - p0.x) * y);
        return s >= -0.1 && t >= -0.1 && 1 - s - t >= 0;
    }
}
exports.Vector2D = Vector2D;
}
// default/data/state/math/set.js
$fsx.f[5] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const vector_1 = $fsx.r(4);
class VectorMap {
    constructor(vectors, elements) {
        this.tree = new Map();
        if (vectors && vectors.length > 0 && elements) {
            this._size = vectors.length;
            for (let i = 0; i < vectors.length; i++) {
                const v = vectors[i];
                const ys = this.tree.get(v.x) || new Map();
                ys.set(v.y, elements[i]);
                this.tree.set(v.x, ys);
            }
        } else {
            this._size = 0;
        }
    }
    toJSON(elemToJSON) {
        const result = [];
        this.map((elem, x, y) => {
            if (x !== undefined && y !== undefined) {
                result.push([
                    x,
                    y,
                    elemToJSON(elem)
                ]);
            }
        });
        return result;
    }
    static revive(a, reviveElem) {
        const result = new VectorMap();
        a.map(v => result.addXY(v[0], v[1], reviveElem(v[2])));
        return result;
    }
    clear() {
        this.tree.clear();
        this._size = 0;
    }
    get size() {
        return this._size;
    }
    firstValue() {
        if (this.size === 0) {
            throw new Error('No values in VectorMap');
        }
        return this.tree.values().next().value.values().next().value;
    }
    firstKey() {
        if (this.size === 0) {
            throw new Error('Trying to get the firstKey() but there are no keys in VectorMap/Set');
        }
        const [x, ys] = this.tree.entries().next().value;
        return new vector_1.Vector2D(x, ys.keys().next().value);
    }
    filter(f) {
        const result = new VectorMap();
        for (const [x, yMap] of this.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                if (f(val, x, y)) {
                    result.addXY(x, y, val);
                }
            }
        }
        return result;
    }
    map(f) {
        const result = new VectorMap();
        for (const [x, yMap] of this.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                result.addXY(x, y, f(val, x, y));
            }
        }
        return result;
    }
    *entries() {
        for (const [x, yMap] of this.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                yield [
                    val,
                    [
                        x,
                        y
                    ]
                ];
            }
        }
    }
    addXY(x, y, value) {
        const ys = this.tree.get(x) || new Map();
        if (ys.size === 0 || !ys.has(y)) {
            this._size += 1;
        }
        ys.set(y, value);
        this.tree.set(x, ys);
        return this;
    }
    addValue(v, value) {
        return this.addXY(v.x, v.y, value);
    }
    deleteXY(x, y) {
        const ys = this.tree.get(x) || new Map();
        if (ys.size <= 1) {
            this.tree.delete(x);
        } else {
            ys.delete(y);
        }
        this._size -= 1;
        return this;
    }
    delete(v) {
        return this.deleteXY(v.x, v.y);
    }
    hasXY(x, y) {
        const map = this.tree.get(x);
        if (map) {
            return map.has(y);
        }
        return false;
    }
    has(v) {
        return this.hasXY(v.x, v.y);
    }
    get(v) {
        return this.getXY(v.x, v.y);
    }
    getXY(x, y) {
        const yMap = this.tree.get(x);
        if (!yMap) {
            return undefined;
        }
        return yMap.get(y);
    }
    equals(set2) {
        const set1 = this;
        if (set1.size !== set2.size) {
            return false;
        }
        for (const [x, yMap] of set1.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                const value = set2.getXY(x, y);
                if (!value || value !== val) {
                    return false;
                }
            }
        }
        return true;
    }
}
exports.VectorMap = VectorMap;
class VectorSet extends VectorMap {
    constructor(vectors) {
        if (vectors) {
            super(vectors, vectors);
        } else {
            super();
        }
    }
    toJSON() {
        const result = this.toArray().map(v => [
            v.x,
            v.y,
            0
        ]);
        return result;
    }
    static revive(a, reviveElem) {
        const result = new VectorSet();
        a.map(v => result.add(new vector_1.Vector2D(v[0], v[1])));
        return result;
    }
    add(v) {
        return this.addValue(v, v);
    }
    delete(v) {
        return super.delete(v);
    }
    dup() {
        const result = new VectorSet();
        return result.append(this);
    }
    append(set) {
        for (const [x, yMap] of set.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                this.addXY(x, y, val);
            }
        }
        return this;
    }
    *values() {
        for (const yMap of this.tree.values()) {
            for (const v of yMap.values()) {
                yield v;
            }
        }
    }
    toArray() {
        const result = [];
        for (const yMap of this.tree.values()) {
            for (const v of yMap.values()) {
                result.push(v);
            }
        }
        return result;
    }
    first() {
        return super.firstKey();
    }
    equals(set2) {
        const set1 = this;
        if (set1.size !== set2.size) {
            return false;
        }
        for (const yMap of set1.tree.values()) {
            for (const v of yMap.values()) {
                if (!set2.has(v)) {
                    return false;
                }
            }
        }
        return true;
    }
    filter(f) {
        const result = new VectorSet();
        for (const [x, yMap] of this.tree.entries()) {
            for (const [y, val] of yMap.entries()) {
                if (f(val, x, y)) {
                    result.add(val);
                }
            }
        }
        return result;
    }
    map(f) {
        return super.map(f);
    }
}
exports.VectorSet = VectorSet;
}
// default/data/state/math/random.js
$fsx.f[7] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class RandomArray {
    constructor(len = 4096, values, at) {
        this.size = len;
        this.values = values || crypto.getRandomValues(new Uint32Array(len));
        this.at = at || 0;
    }
    pop() {
        if (this.at < this.size - 1) {
            this.at += 1;
            return this.values[this.at];
        }
        this.values = window.crypto.getRandomValues(this.values);
        this.at = 1;
        return this.values[0];
    }
    first() {
        return this.values[this.at];
    }
    static update(rnd) {
        if (rnd.at < rnd.size - 1) {
            rnd.at = rnd.at + 1;
            return rnd;
        } else {
            rnd.values = window.crypto.getRandomValues(rnd.values);
            rnd.at = 0;
            return rnd;
        }
    }
}
exports.RandomArray = RandomArray;
}
// default/data/state/color/wheel.js
$fsx.f[8] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const rgb_1 = $fsx.r(9);
var WheelMode;
(function (WheelMode) {
    WheelMode[WheelMode['WHEEL_SATURATION_MODE'] = 2] = 'WHEEL_SATURATION_MODE';
    WheelMode[WheelMode['WHEEL_HERING_MODE'] = 1] = 'WHEEL_HERING_MODE';
    WheelMode[WheelMode['WHEEL_BRIGHTNESS_MODE'] = 0] = 'WHEEL_BRIGHTNESS_MODE';
}(WheelMode = exports.WheelMode || (exports.WheelMode = {})));
class Wheel {
    constructor(angle = 0, light = 0.7, sat = 0.7) {
        this._slices = 16;
        this._selectedSlice = 0;
        this._brightness = 1;
        this._saturation = 1;
        this._hering = 0;
        this._colors = [];
        this._heringColors = [];
        this.heringSlice = 0;
        this._brightnessColors = [];
        this._brightnessOffset = 0;
        this._saturationColors = [];
        this._saturationOffset = 0;
        this._mode = WheelMode.WHEEL_HERING_MODE;
        this.ringRatio1 = 1 / 2.2;
        this.ringRatio2 = 1 / 3.45;
        this.sliceCircleRatio1 = 1 / 4;
        this.sliceCircleRatio2 = 2.25 / 4;
        this.updateHering(angle, light, sat);
    }
    toJSON() {
        return {
            slices: this._slices,
            selectedSlice: this._selectedSlice,
            brightness: this._brightness,
            saturation: this._saturation,
            hering: this._hering,
            colors: this._colors.slice(0),
            heringColors: this._heringColors.slice(0),
            heringSlice: this.heringSlice,
            brightnessColors: this._brightnessColors.slice(0),
            brightnessOffset: this._brightnessOffset,
            saturationColors: this._saturationColors.slice(0),
            saturationOffset: this._saturationOffset,
            mode: this._mode
        };
    }
    revive(obj) {
        this._slices = obj.slices;
        this._selectedSlice = obj.selectedSlice;
        this._brightness = obj.brightness;
        this._saturation = obj.saturation;
        this._hering = obj.hering;
        this._colors = obj.colors;
        this._heringColors = obj.heringColors;
        this.heringSlice = obj.heringSlice;
        this._brightnessColors = obj.brightnessColors;
        this._brightnessOffset = obj.brightnessOffset;
        this._saturationColors = obj.saturationColors;
        this._saturationOffset = obj.saturationOffset;
        this._mode = obj.mode;
        return this;
    }
    getSelectedColor() {
        return this._colors[this._selectedSlice];
    }
    get slices() {
        return this._slices;
    }
    get selectedSlice() {
        return this._selectedSlice;
    }
    get brightness() {
        return this._brightness;
    }
    get saturation() {
        return this._saturation;
    }
    get hering() {
        return this._hering;
    }
    get colors() {
        return this._colors;
    }
    get mode() {
        return this._mode;
    }
    get heringColors() {
        return this._heringColors;
    }
    get brightnessColors() {
        return this._brightnessColors;
    }
    get brightnessOffset() {
        return this._brightnessOffset;
    }
    get saturationColors() {
        return this._saturationColors;
    }
    get saturationOffset() {
        return this._saturationOffset;
    }
    _selectUnitValue(slice, value) {
        const sliceAngleDiff = (slice - this._selectedSlice) / this._slices;
        let newValue = value + sliceAngleDiff;
        if (newValue > 1) {
            newValue = newValue - 1;
        } else if (newValue < 0) {
            newValue = newValue + 1;
        }
        return newValue;
    }
    _adjustAngle(_angle) {
        let angle = _angle;
        if (_angle < 0) {
            angle = 2 * Math.PI + _angle;
        } else if (_angle > 2 * Math.PI) {
            angle = _angle - 2 * Math.PI;
        }
        return angle;
    }
    updateBrightness(_angle, light, sat) {
        const selected = this._selectedSlice;
        const selectedColor = this.heringSlice;
        const slice = 1 / this._slices;
        const curAngle = Math.PI * 2 - _angle;
        const sliceAngle = this._adjustAngle(selectedColor * slice * Math.PI * 2);
        const colorAngle = this._adjustAngle(sliceAngle + curAngle);
        const offset = light * 360;
        const ammountUp = Math.ceil((1 - light) / slice);
        const ammountDown = Math.floor(light / slice);
        const colors = new Array(this._slices);
        for (let i = 0; i < ammountUp; i++) {
            let index = selected + i + 1;
            if (index >= this._slices) {
                index = index % this._slices;
            }
            const curLight = Math.min(light + (i + 1) * slice, 1);
            colors[index] = rgb_1.RGBColor.fromHering(colorAngle, curLight, sat);
        }
        for (let i = 0; i <= ammountDown; i++) {
            let index = selected - i;
            if (index < 0) {
                index = this._slices + index;
            }
            const curLight = light - i * slice;
            colors[index] = rgb_1.RGBColor.fromHering(colorAngle, curLight, sat);
        }
        colors[selected] = rgb_1.RGBColor.fromHering(colorAngle, light, sat);
        this._brightness = light;
        this._saturation = sat;
        this._brightnessOffset = Math.round(offset);
        this._colors = colors;
        this._mode = WheelMode.WHEEL_BRIGHTNESS_MODE;
        return this;
    }
    updateSaturation(_angle, light, sat) {
        const selected = this._selectedSlice;
        const selectedColor = this.heringSlice;
        const slice = 1 / this._slices;
        const curAngle = Math.PI * 2 - _angle;
        const sliceAngle = this._adjustAngle(selectedColor * slice * Math.PI * 2);
        const colorAngle = this._adjustAngle(sliceAngle + curAngle);
        const offset = sat * 360;
        const ammountUp = Math.ceil((1 - sat) / slice);
        const ammountDown = Math.floor(sat / slice);
        const colors = new Array(this._slices);
        for (let i = 0; i < ammountUp; i++) {
            let index = selected + i + 1;
            if (index >= this._slices) {
                index = index % this._slices;
            }
            const curSat = Math.min(sat + (i + 1) * slice, 1);
            colors[index] = rgb_1.RGBColor.fromHering(colorAngle, light, curSat);
        }
        for (let i = 0; i <= ammountDown; i++) {
            let index = selected - i;
            if (index < 0) {
                index = this._slices + index;
            }
            const curSat = sat - i * slice;
            colors[index] = rgb_1.RGBColor.fromHering(colorAngle, light, curSat);
        }
        colors[selected] = rgb_1.RGBColor.fromHering(colorAngle, light, sat);
        this._brightness = light;
        this._saturation = sat;
        this._saturationOffset = Math.round(offset);
        this._colors = colors;
        this._mode = WheelMode.WHEEL_SATURATION_MODE;
        return this;
    }
    selectSlice(slice) {
        if (this._mode === WheelMode.WHEEL_HERING_MODE) {
            this._selectedSlice = slice;
            this.heringSlice = slice;
            return this;
        } else if (this._mode === WheelMode.WHEEL_BRIGHTNESS_MODE) {
            const brightness = this._selectUnitValue(slice, this._brightness);
            this._selectedSlice = slice;
            return this.updateBrightness(this._hering, brightness, this._saturation);
        } else if (this._mode === WheelMode.WHEEL_SATURATION_MODE) {
            const sat = this._selectUnitValue(slice, this._saturation);
            this._selectedSlice = slice;
            return this.updateSaturation(this._hering, this._brightness, sat);
        }
        return this;
    }
    static _heringColors(sat, light) {
        return [
            rgb_1.RGBColor.fromHering(0, light, sat),
            rgb_1.RGBColor.fromHering(Math.PI / 2, light, sat),
            rgb_1.RGBColor.fromHering(Math.PI, light, sat),
            rgb_1.RGBColor.fromHering(3 * Math.PI / 2, light, sat)
        ];
    }
    updateHering(_angle, light, sat) {
        const angle = this._adjustAngle(_angle);
        const angles = [...Array(this._slices).keys()].map(a => {
            let _calcAngle = a * 2 * Math.PI / this._slices - angle;
            if (_calcAngle < 0) {
                _calcAngle = 2 * Math.PI + _calcAngle;
            }
            if (_calcAngle >= Math.PI * 2) {
                return _calcAngle / Math.PI * 2;
            }
            return _calcAngle;
        });
        this._hering = angle;
        this._brightness = light;
        this._saturation = sat;
        this._colors = angles.map(a => rgb_1.RGBColor.fromHering(a, light, sat));
        this._heringColors = Wheel._heringColors(sat, light);
        this._mode = WheelMode.WHEEL_HERING_MODE;
        this.heringSlice = this._selectedSlice;
        return this;
    }
    moveWheel(ammount) {
        if (this._mode === WheelMode.WHEEL_HERING_MODE) {
            return this.updateHering(ammount, this._brightness, this._saturation);
        } else if (this._mode === WheelMode.WHEEL_BRIGHTNESS_MODE) {
            return this.updateBrightness(this._hering, ammount, this._saturation);
        } else if (this._mode === WheelMode.WHEEL_SATURATION_MODE) {
            return this.updateSaturation(this._hering, this._brightness, ammount);
        }
        return this;
    }
    static _getHSL(r, g, b) {
        const [h, s, l] = rgb_1.RGBColor.rgbToHsl(r, g, b);
        return {
            light: l,
            hering: rgb_1.RGBColor.heringFromHue(h),
            sat: s
        };
    }
    static _getColorHSLFromHex(hex) {
        const [r, g, b] = rgb_1.RGBColor.hexToRgb(hex);
        return Wheel._getHSL(r, g, b);
    }
    _getSelectedHSL() {
        const c = this._colors[this._selectedSlice];
        return Wheel._getColorHSLFromHex(c);
    }
    _getAngleFor(hering) {
        let angle = this._adjustAngle(hering);
        const sliceAngle = 2 * Math.PI / this._slices;
        const diff = sliceAngle * this._selectedSlice - angle;
        const isEqual = Math.abs(diff) < 0.005;
        if (isEqual) {
            angle = this._hering;
        } else {
            angle = diff;
        }
        return angle;
    }
    _renderBrightnessWheel() {
        const _angle = this._hering;
        const total = 360;
        const deg = 1 / total;
        const selectedColor = this.heringSlice;
        const slice = 1 / this._slices;
        const curAngle = Math.PI * 2 - _angle;
        const sliceAngle = this._adjustAngle(selectedColor * slice * Math.PI * 2);
        const colorAngle = this._adjustAngle(sliceAngle + curAngle);
        const bcolors = [];
        for (let i = 0; i < total; i++) {
            bcolors.push(rgb_1.RGBColor.fromHering(colorAngle, i * deg, this._saturation));
        }
        return bcolors;
    }
    _renderSaturationWheel() {
        const _angle = this._hering;
        const total = 360;
        const deg = 1 / total;
        const selectedColor = this.heringSlice;
        const slice = 1 / this._slices;
        const curAngle = Math.PI * 2 - _angle;
        const sliceAngle = this._adjustAngle(selectedColor * slice * Math.PI * 2);
        const colorAngle = this._adjustAngle(sliceAngle + curAngle);
        const scolors = [];
        for (let i = 0; i < total; i++) {
            scolors.push(rgb_1.RGBColor.fromHering(colorAngle, this._brightness, i * deg));
        }
        return scolors;
    }
    changeMode(mode) {
        const w = this;
        let brightness = w._brightness;
        let saturation = w._saturation;
        let angle = w._hering;
        if (mode === WheelMode.WHEEL_HERING_MODE) {
            if (w._mode === WheelMode.WHEEL_BRIGHTNESS_MODE || w._mode === WheelMode.WHEEL_SATURATION_MODE) {
                const hsl = this._getSelectedHSL();
                brightness = hsl.light;
                saturation = hsl.sat;
                angle = this._getAngleFor(hsl.hering);
            }
            return this.updateHering(angle, brightness, saturation);
        } else if (mode === WheelMode.WHEEL_BRIGHTNESS_MODE) {
            this._brightnessColors = this._renderBrightnessWheel();
            return this.updateBrightness(this._hering, this._brightness, this._saturation);
        } else if (mode === WheelMode.WHEEL_SATURATION_MODE) {
            this._saturationColors = this._renderSaturationWheel();
            return this.updateSaturation(w._hering, w._brightness, w._saturation);
        }
        return this;
    }
    fromHex(hex) {
        const {light, hering, sat} = Wheel._getColorHSLFromHex(hex);
        const angle = this._getAngleFor(hering);
        return this.updateHering(angle, light, sat);
    }
    fromColor(c) {
        const {light, hering, sat} = Wheel._getHSL(c.r, c.g, c.b);
        const angle = this._getAngleFor(hering);
        return this.updateHering(angle, light, sat);
    }
    toColor() {
        return rgb_1.RGBColor.fromHex(this._colors[this._selectedSlice]);
    }
}
exports.Wheel = Wheel;
}
// default/data/state/color/rgb.js
$fsx.f[9] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class RGBColor {
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toJSON() {
        return {
            r: this.r,
            g: this.g,
            b: this.b,
            a: this.a
        };
    }
    static revive(obj) {
        return new RGBColor(obj.r, obj.g, obj.b, obj.a);
    }
    toGL() {
        return [
            this.r / 255,
            this.g / 255,
            this.b / 255,
            this.a
        ];
    }
    static randomHering(sat, light, rndNum = 0.5) {
        const angle = rndNum * (Math.PI * 2);
        return RGBColor.fromHsl(RGBColor.heringHue(angle), sat, light);
    }
    toString() {
        return `rgba(${ this.r },${ this.g },${ this.b },${ this.a })`;
    }
    static toHex(c) {
        return '#' + ((1 << 24) + (c.r << 16) + (c.g << 8) + c.b).toString(16).slice(1);
    }
    static hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return [
            r,
            g,
            b
        ];
    }
    static fromHex(hex) {
        return new RGBColor(parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16));
    }
    static fromHering(angle, l, s) {
        return RGBColor.toHex(RGBColor.fromHsl(RGBColor.heringHue(angle), s, l));
    }
    static heringHue(angle) {
        const v = Math.abs(Math.sin(angle));
        const red = 0;
        const yellow = 60;
        const green = 120;
        const blue = 240;
        const rightRed = 360;
        let hue1;
        let hue2;
        if (angle >= 0 && angle < Math.PI / 2) {
            hue1 = yellow;
            hue2 = red;
        } else if (angle >= Math.PI / 2 && angle < Math.PI) {
            hue1 = yellow;
            hue2 = green;
        } else if (angle >= Math.PI && angle < 3 * Math.PI / 2) {
            hue1 = blue;
            hue2 = green;
        } else {
            hue1 = blue;
            hue2 = rightRed;
        }
        const result = hue1 * v + hue2 * (1 - v);
        return result;
    }
    static heringFromHue(_hue) {
        let hue1;
        let hue2;
        let angleF = a => a;
        const hue = 360 * _hue;
        const red = 0;
        const yellow = 60;
        const green = 120;
        const blue = 240;
        const rightRed = 360;
        if (hue >= red && hue < yellow) {
            hue1 = yellow;
            hue2 = red;
        } else if (hue >= yellow && hue < green) {
            hue1 = yellow;
            hue2 = green;
            angleF = a => Math.PI / 2 + Math.PI / 2 - a;
        } else if (hue >= green && hue < blue) {
            hue1 = blue;
            hue2 = green;
            angleF = a => Math.PI + a;
        } else if (hue >= blue && hue < rightRed) {
            hue1 = blue;
            hue2 = rightRed;
            angleF = a => 3 * Math.PI / 2 + (Math.PI / 2 - a);
        }
        const v = (hue - hue2) / (hue1 - hue2);
        const angle = angleF(Math.asin(v));
        return angle;
    }
    static rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const l = (max + min) / 2;
        let h = l;
        let s = l;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            }
            h /= 6;
        }
        return [
            h,
            s,
            l
        ];
    }
    static hslToRgb(h, s, l) {
        let r;
        let g;
        let b;
        if (s === 0) {
            r = l;
            g = l;
            b = l;
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            }
            const _q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const _p = 2 * l - _q;
            r = hue2rgb(_p, _q, h + 1 / 3);
            g = hue2rgb(_p, _q, h);
            b = hue2rgb(_p, _q, h - 1 / 3);
        }
        const result = new RGBColor(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
        return result;
    }
    static fromHsl(h, s, l) {
        return RGBColor.hslToRgb(h / 360, s, l);
    }
}
exports.RGBColor = RGBColor;
}
// default/data/state/math/quadratic.js
$fsx.f[10] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
function solveQuadraticEquation(a, b, c) {
    const d = b * b - 4 * a * c;
    let ds;
    let mbmds;
    let mbpds;
    if (a === 0) {
        if (b === 0) {
            if (c === 0) {
                return [
                    undefined,
                    undefined,
                    undefined
                ];
            } else {
                return [];
            }
        } else {
            return [-c / b];
        }
    }
    if (d < 0) {
        return [];
    } else if (d === 0) {
        return [-b / (2 * a)];
    }
    ds = Math.sqrt(d);
    if (b >= 0) {
        mbmds = -b - ds;
        return [
            mbmds / (2 * a),
            2 * c / mbmds
        ];
    } else {
        mbpds = -b + ds;
        return [
            2 * c / mbpds,
            mbpds / (2 * a)
        ];
    }
}
exports.solveQuadraticEquation = solveQuadraticEquation;
}
// default/data/state/shape/path.js
$fsx.f[11] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const set_1 = $fsx.r(5);
const vector_1 = $fsx.r(4);
const template_1 = $fsx.r(12);
var ActionType;
(function (ActionType) {
    ActionType[ActionType['Move'] = 1] = 'Move';
    ActionType[ActionType['Line'] = 2] = 'Line';
    ActionType[ActionType['HLine'] = 3] = 'HLine';
    ActionType[ActionType['VLine'] = 4] = 'VLine';
    ActionType[ActionType['Arc'] = 5] = 'Arc';
    ActionType[ActionType['Close'] = 6] = 'Close';
}(ActionType || (ActionType = {})));
class PathAction {
    constructor(actionType, args, element) {
        this.actionType = actionType;
        this.args = args;
        this.element = element;
    }
    toJSON() {
        return {
            at: this.actionType,
            a: this.args.slice(0),
            e: this.element !== null ? this.element.toJSON() : null
        };
    }
    static revive(o) {
        return new PathAction(o.at, o.a, o.e !== null ? template_1.TemplateElement.revive(o.e) : null);
    }
    isEqual(a) {
        if (this.actionType === a.actionType) {
            let testArgsNeeded = false;
            if (this.element && a.element) {
                testArgsNeeded = this.element.isEqual(a.element);
            } else if (!this.element && !a.element) {
                testArgsNeeded = true;
            }
            if (testArgsNeeded) {
                for (let i = 0; i < this.args.length; i++) {
                    if (this.args[i] !== a.args[i]) {
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    }
    isClosed() {
        return this.actionType === ActionType.Close;
    }
    static Reverse(pt, prevPt, a) {
        if (!a.element) {
            throw new Error(`Trying to Reverse() PathAction, but no element is present in the provided PathAction ${ a }`);
        }
        switch (a.actionType) {
        case ActionType.Line:
            return PathAction.Line(pt.x, pt.y, a.element);
        case ActionType.HLine:
            return PathAction.HLine(pt.x, a.element);
        case ActionType.VLine:
            return PathAction.VLine(pt.y, a.element);
        case ActionType.Arc:
            const [arc1, arc2] = PathAction.Arc(a.element, prevPt, pt);
            if (arc1.args[3] === a.args[3]) {
                return arc1;
            } else {
                return arc2;
            }
        }
    }
    static Close() {
        return new PathAction(ActionType.Close, [], null);
    }
    static Move(x, y) {
        return new PathAction(ActionType.Move, [
            x,
            y
        ], null);
    }
    static Line(x, y, elem) {
        return new PathAction(ActionType.Line, [
            x,
            y
        ], elem);
    }
    static HLine(x, elem) {
        return new PathAction(ActionType.HLine, [x], elem);
    }
    static VLine(y, elem) {
        return new PathAction(ActionType.VLine, [y], elem);
    }
    static Arc(ellipse, origin, dest) {
        const [cx, cy, _rx, _ry, alpha] = ellipse.args;
        const rx = _rx - 0.5;
        const ry = _ry - 0.5;
        const x = dest.x;
        const y = dest.y;
        const s = ellipse.ellipseSweep(origin, dest);
        const defaultArc = [
            rx,
            ry,
            alpha,
            false,
            s,
            x,
            y
        ];
        const oppositeArc = defaultArc.slice(0);
        oppositeArc[3] = true;
        oppositeArc[4] = !s;
        return [
            new PathAction(ActionType.Arc, defaultArc, ellipse),
            new PathAction(ActionType.Arc, oppositeArc, ellipse)
        ];
    }
    static elementsFromOriginToDest(t, origin, dest) {
        const oElems = t.getElements(origin);
        const dElems = t.getElements(dest);
        const intersection = new Set();
        for (const e of oElems) {
            if (dElems.has(e)) {
                intersection.add(e);
            }
        }
        return intersection;
    }
    static Select(t, origin, dest) {
        const routes = PathAction.elementsFromOriginToDest(t, origin, dest);
        const result = [];
        for (const r of routes) {
            switch (r.type) {
            case template_1.ElementType.VLine:
                result.push(PathAction.VLine(dest.y, r));
                break;
            case template_1.ElementType.HLine:
                result.push(PathAction.HLine(dest.x, r));
                break;
            case template_1.ElementType.Line:
                result.push(PathAction.Line(dest.x, dest.y, r));
                break;
            case template_1.ElementType.Ellipse:
                const [a1, a2] = PathAction.Arc(r, origin, dest);
                result.push(a1);
                result.push(a2);
                break;
            }
        }
        return result;
    }
    arcArgsToStr() {
        const newArgs = this.args.slice();
        newArgs[3] = newArgs[3] ? 1 : 0;
        newArgs[4] = newArgs[4] ? 1 : 0;
        return newArgs.join(' ');
    }
    toString() {
        switch (this.actionType) {
        case ActionType.Line:
            return `L ${ this.args[0] } ${ this.args[1] } `;
        case ActionType.HLine:
            return `H ${ this.args[0] } `;
        case ActionType.VLine:
            return `V ${ this.args[0] } `;
        case ActionType.Move:
            return `M ${ this.args[0] } ${ this.args[1] } `;
        case ActionType.Arc:
            return `A ${ this.arcArgsToStr() } `;
        case ActionType.Close:
            return 'Z';
        }
    }
}
class PathShape {
    constructor(t) {
        this.timeline = [PathShapeInstance.empty(t)];
        this.at = 0;
        this.template = t;
    }
    toJSON() {
        return {
            t: this.timeline.map(psi => psi.toJSON()),
            at: this.at
        };
    }
    static revive(o, t) {
        const result = new PathShape(t);
        const timeline = [];
        for (let i = 0; i < o.t.length; i++) {
            const psi = PathShapeInstance.revive(o.t[i], t);
            if (psi) {
                timeline.push(psi);
            }
        }
        result.timeline = timeline;
        result.at = o.at;
        return result;
    }
    reverseTimelineBy(num) {
        if (num > this.timeline.length) {
            throw new Error('Reversing shape timeline to a position out of bounds');
        }
        this.at = num;
    }
    advanceTimelineWith(shape) {
        if (this.at !== this.timeline.length - 1) {
            this.timeline.splice(this.at + 1, this.timeline.length - this.at);
        }
        this.at++;
        this.timeline.push(shape);
    }
    modShape(t, a, reaches, curEdge, otherEdge, pts) {
        return this.advanceTimelineWith(new PathShapeInstance(t, a, reaches, curEdge, otherEdge, pts));
    }
    cloneForward() {
        const shape = this.timeline[this.at];
        this.modShape(shape.template, shape.actions.slice(), shape.reachable.dup(), shape.currentEdge, shape.otherEdge, shape.selectedPoints.slice());
    }
    forceClose() {
        this.cloneForward();
        this.timeline[this.at].forceClose();
    }
    get currentEdge() {
        return this.timeline[this.at].currentEdge;
    }
    get otherEdge() {
        return this.timeline[this.at].otherEdge;
    }
    get reachable() {
        return this.timeline[this.at].reachable;
    }
    get activePoints() {
        return this.timeline[this.at].activePoints;
    }
    toString() {
        return this.timeline[this.at].toString();
    }
    isClosed() {
        return this.timeline[this.at].isClosed();
    }
    selectPt(pt) {
        const shape = this.timeline[this.at];
        const possibleShapes = shape.selectPt(pt);
        const lastPt = shape.lastPt();
        if (possibleShapes[0].isEqual(shape) || lastPt && pt.isEqual(lastPt)) {
            return [];
        }
        return possibleShapes;
    }
    static templateString(t) {
        const template = new template_1.Template(t.base, t.elements.slice(0, t.base), t.resolution);
        let shape = new PathShapeInstance(template, [], new set_1.VectorSet(), null, null, []);
        const basePts = t.basePoints.toArray();
        shape = shape.selectPt(basePts[0])[0];
        do {
            shape = shape.selectPt(shape.reachable.first())[0];
        } while (shape.reachable.size > 0);
        shape.actions.push(PathAction.Close());
        return shape.toString();
    }
}
class PathShapeInstance {
    constructor(t, a, reaches, curEdge, otherEdge, pts) {
        this.template = t;
        this.actions = a;
        this.reachable = reaches;
        this.currentEdge = curEdge;
        this.otherEdge = otherEdge;
        this.selectedPoints = pts;
        if (curEdge && otherEdge) {
            this.activePoints = this.calcActivePts().delete(curEdge).delete(otherEdge);
        } else {
            this.activePoints = new set_1.VectorSet();
        }
    }
    toJSON() {
        return {
            a: this.actions.map(a => a.toJSON()),
            r: this.reachable.toJSON(),
            ce: this.currentEdge ? this.currentEdge.toJSON() : null,
            oe: this.otherEdge ? this.otherEdge.toJSON() : null,
            pts: this.selectedPoints.slice(0).map(v => v.toJSON())
        };
    }
    static revive(o, t) {
        const ce = o.ce ? vector_1.Vector2D.revive(o.ce) : null;
        const oe = o.oe ? vector_1.Vector2D.revive(o.oe) : null;
        const actions = o.a.map(PathAction.revive).filter(a => a.element !== null);
        try {
            const result = new PathShapeInstance(t, actions, set_1.VectorSet.revive(o.r, () => null), ce, oe, o.pts.map(vector_1.Vector2D.revive));
            return result;
        } catch (e) {
            console.error('Error trying to revive PathShapeInstace with Object:', o, 'AND TEMPLATE', t);
            return null;
        }
    }
    static empty(t) {
        return new PathShapeInstance(t, [], t.points, null, null, []);
    }
    isEqual(ps) {
        if (this.actions.length !== ps.actions.length) {
            return false;
        }
        for (let i = 0; i < this.actions.length; i++) {
            if (!this.actions[i].isEqual(ps.actions[i])) {
                return false;
            }
        }
        return true;
    }
    forceClose() {
        this.actions.push(PathAction.Close());
    }
    isClosed() {
        const totalPts = this.selectedPoints.length;
        if (this.actions.length === 0 || totalPts < 3) {
            return false;
        }
        const lastAction = this.actions[this.actions.length - 1];
        const lastPt = this.selectedPoints[totalPts - 1];
        return this.selectedPoints[0].isEqual(lastPt) || lastAction.isClosed();
    }
    invertActions() {
        const result = [];
        let prevPt = this.selectedPoints[this.selectedPoints.length - 1];
        for (let i = this.selectedPoints.length - 1; i > 0; i--) {
            const pt = this.selectedPoints[i - 1];
            const reversed = PathAction.Reverse(pt, prevPt, this.actions[i]);
            if (reversed) {
                result.push(reversed);
                prevPt = pt;
            }
        }
        if (!this.currentEdge) {
            throw new Error(`Trying to invert actions but the Shape has no currentEdge yet defined`);
        }
        result.unshift(PathAction.Move(this.currentEdge.x, this.currentEdge.y));
        return result;
    }
    selectPt(pt) {
        let a = [];
        let reaches;
        let cur = this.currentEdge;
        let other = this.otherEdge;
        const points = this.selectedPoints.slice();
        let actions = this.actions;
        if (this.currentEdge === null) {
            a.push(PathAction.Move(pt.x, pt.y));
            reaches = this.template.getReachable(pt);
        } else {
            cur = this.currentEdge;
            const isReachableByCurEdge = this.template.getReachable(cur).has(pt);
            if (other === null) {
                other = this.currentEdge;
            } else if (!isReachableByCurEdge) {
                const isReachableByOtherEdge = this.template.getReachable(other).has(pt);
                if (!isReachableByOtherEdge) {
                    return [this];
                }
                points.reverse();
                actions = this.invertActions();
                cur = other;
                other = this.currentEdge;
            }
            a = PathAction.Select(this.template, cur, pt);
            reaches = this.template.getReachableFrom(pt, other, points);
        }
        points.push(pt);
        const activePts = this.activePoints.dup();
        return a.map(action => {
            const acts = actions.slice();
            acts.push(action);
            const newShape = new PathShapeInstance(this.template, acts, reaches, pt, other, points);
            newShape.activePoints = newShape.activePoints.append(activePts);
            return newShape;
        });
    }
    lastPt() {
        if (this.selectedPoints.length === 0) {
            return null;
        }
        return this.selectedPoints[this.selectedPoints.length - 1];
    }
    toString() {
        let result = '';
        for (let i = 0; i < this.actions.length; i++) {
            result += this.actions[i].toString();
        }
        return result;
    }
    calcActivePts() {
        const lastAction = this.actions[this.actions.length - 1];
        if (!lastAction) {
            return new set_1.VectorSet();
        }
        if (lastAction.actionType === ActionType.Move) {
            const [x, y] = lastAction.args;
            if (typeof x === 'number' && typeof y === 'number') {
                return new set_1.VectorSet([new vector_1.Vector2D(x, y)]);
            } else {
                throw new Error('Cannot calc the active points for the last action performed: Move position not found');
            }
        }
        if (!lastAction.element) {
            throw new Error('Cannot calc the active points for the last action performed: no element found');
        }
        const pts = this.template.elementPoints(lastAction.element);
        if (lastAction.actionType === ActionType.Arc) {
            const pt1 = this.selectedPoints[this.selectedPoints.length - 2];
            const pt2 = this.selectedPoints[this.selectedPoints.length - 1];
            const ellipse = lastAction.element;
            const longArc = lastAction.args[3];
            const sweep = lastAction.args[4];
            const angle1 = ellipse.arcEllipse(pt1);
            const angle2 = ellipse.arcEllipse(pt2);
            const PI2 = Math.PI * 2;
            const diff = PI2 - angle1 - (PI2 - angle2);
            const absDiff = Math.abs(diff);
            const isSmallerPi = absDiff < Math.PI;
            let longPoints = longArc;
            if (absDiff === Math.PI) {
                if (diff < 0) {
                    longPoints = !longPoints;
                }
            } else if (diff > 0 && !isSmallerPi && sweep) {
                longPoints = true;
            }
            if (longPoints) {
                return pts.filter(pt => !ellipse.ellipseIsBetween(pt1, pt2, pt));
            } else {
                return pts.filter(pt => ellipse.ellipseIsBetween(pt1, pt2, pt));
            }
        } else {
            const pt1 = this.selectedPoints[this.selectedPoints.length - 1];
            const pt2 = this.selectedPoints[this.selectedPoints.length - 2];
            const result = pts.filter(pt => vector_1.Vector2D.isBetween(pt1, pt2, pt));
            return result;
        }
    }
}
class Path {
    constructor(t) {
        this.template = t;
        this.selectedShape = 0;
        this.shapes = [];
        this.svgs = [];
        this.fills = [];
        this.hidden = new Set();
        this.ambiguities = [];
        this.templateSvg = PathShape.templateString(t);
        this.addShape(new PathShape(t));
    }
    toJSON() {
        return {
            ss: this.selectedShape,
            shapes: this.shapes.map(s => s.toJSON()),
            svgs: this.svgs.slice(0),
            f: this.fills.slice(0),
            h: [...this.hidden.values()],
            a: this.ambiguities.slice(0)
        };
    }
    static revive(o, t) {
        const result = new Path(t);
        result.selectedShape = o.ss;
        result.shapes = o.shapes.map(s => PathShape.revive(s, t));
        result.svgs = o.svgs;
        result.fills = o.f;
        result.hidden = new Set(o.h);
        result.ambiguities = o.a;
        return result;
    }
    static FullSquare(fillId, t) {
        const p = new Path(t);
        p.svgs = [
            p.templateSvg,
            ''
        ];
        p.selectedShape = 1;
        p.fills = [fillId];
        return p;
    }
    get fillIds() {
        return this.fills;
    }
    get numVisibleShapes() {
        return this.svgs.length - this.hidden.size - 1;
    }
    toggleVisibility(shapeIndex) {
        const isHidden = this.hidden.has(shapeIndex);
        if (isHidden) {
            this.hidden.delete(shapeIndex);
        } else {
            this.hidden.add(shapeIndex);
        }
        return !isHidden;
    }
    nearestActivePt(x, y) {
        const maxR = this.template.resolution / 2;
        const pts = this.getSelectedShape().reachable.toArray();
        if (this.currentEdge) {
            pts.push(this.currentEdge);
        }
        if (this.otherEdge) {
            pts.push(this.otherEdge);
        }
        for (let r = 1; r < maxR; r++) {
            const radius = r * r;
            for (let i = 0; i < pts.length; i++) {
                const pt = pts[i];
                const circle = Math.pow(pt.x - x, 2) + Math.pow(pt.y - y, 2);
                if (circle <= radius) {
                    return pt;
                }
            }
        }
        return undefined;
    }
    get currentEdge() {
        return this.getSelectedShape().currentEdge;
    }
    get otherEdge() {
        return this.getSelectedShape().otherEdge;
    }
    addShape(s) {
        this.shapes.push(s);
        this.svgs.push('');
        this.selectedShape = this.shapes.length - 1;
        this.ambiguities = [];
        return this.shapes.length - 1;
    }
    changeShape(shapeIndex) {
        this.selectedShape = shapeIndex;
        const shape = this.getSelectedShape();
        shape.reverseTimelineBy(shape.at - 1);
        this.svgs[this.selectedShape] = shape.toString();
    }
    removeShape(shapeIndex) {
        if (shapeIndex === -1) {
            this.discardCurrent();
        } else {
            this.hidden.delete(shapeIndex);
            this.fills.splice(shapeIndex, 1);
            this.svgs.splice(shapeIndex, 1);
            this.shapes.splice(shapeIndex, 1);
            this.selectedShape = this.selectedShape - 1;
        }
    }
    curShapeIndex() {
        return this.selectedShape;
    }
    getSelectedShape() {
        return this.shapes[this.selectedShape];
    }
    getReachable() {
        return this.getSelectedShape().reachable;
    }
    getSelectedPts() {
        return this.shapes[this.selectedShape].activePoints;
    }
    reverseTo(i) {
        const shape = this.getSelectedShape();
        shape.reverseTimelineBy(i);
        this.svgs[this.selectedShape] = shape.toString();
    }
    discardCurrent() {
        this.svgs[this.shapes.length - 1] = '';
        this.shapes[this.shapes.length - 1] = new PathShape(this.shapes[this.shapes.length - 1].template);
        this.ambiguities = [];
    }
    selectPoint(pt, index) {
        const shape = this.getSelectedShape();
        const possibleShapes = shape.selectPt(pt);
        if (!possibleShapes || possibleShapes.length === 0) {
            return false;
        }
        if (possibleShapes.length > 1) {
            this.ambiguities = possibleShapes.map(s => s.toString());
        } else if (this.ambiguities.length > 0) {
            this.ambiguities.splice(0);
        }
        if (index) {
            return this.updateShape(possibleShapes[index]);
        }
        return this.updateShape(possibleShapes[0]);
    }
    updateShape(s) {
        let changed = false;
        const newStr = s.toString();
        if (newStr !== this.svgs[this.selectedShape]) {
            this.shapes[this.selectedShape].advanceTimelineWith(s);
            this.svgs[this.selectedShape] = newStr;
            changed = true;
        }
        if (s.isClosed()) {
            if (this.selectedShape !== this.shapes.length - 1) {
                this.selectedShape = this.shapes.length - 1;
                return true;
            }
            this.addShape(new PathShape(this.template));
            changed = true;
        }
        return changed;
    }
    closeWithPt(pt, fillId) {
        const isChanged = this.selectPoint(pt);
        if (!isChanged) {
            this.closeAsIs();
            this.svgs[this.selectedShape] = this.shapes[this.selectedShape].toString();
            if (this.selectedShape !== this.shapes.length - 1) {
                this.selectedShape = this.shapes.length - 1;
                return this;
            }
            this.addShape(new PathShape(this.template));
        }
        this.fills.push(fillId);
        return this;
    }
    closeAsIs() {
        this.getSelectedShape().forceClose();
    }
    solveAmbiguity(num) {
        if (num >= this.ambiguities.length) {
            throw new Error('Ambiguity chosen is out of range');
        }
        const shape = this.getSelectedShape();
        const pt = shape.timeline[shape.at].lastPt();
        if (pt) {
            shape.reverseTimelineBy(shape.at - 1);
            this.selectPoint(pt, num);
        }
    }
    getVisibleShapes() {
        const result = [];
        for (let i = 0; i < this.svgs.length; i++) {
            if (!this.hidden.has(i)) {
                result.push(this.svgs[i]);
            }
        }
        return result;
    }
    getSvgShapes() {
        const result = [];
        for (let i = 0; i < this.svgs.length; i++) {
            if (!this.hidden.has(i) && this.svgs[i].length > 0) {
                result.push(this.svgs[i]);
            }
        }
        return result;
    }
    changeFills(fills) {
        this.fills = new Array(this.fills.length - fills.length).fill(fills[0]).concat(fills);
        return this.getFillMap();
    }
    getFillMap() {
        const mapped = [];
        const emptyStr = '';
        let d;
        for (let i = 0; i < this.svgs.length; i++) {
            d = this.svgs[i];
            if (!this.hidden.has(i) && d !== emptyStr && this.selectedShape !== i) {
                mapped.push([
                    d,
                    this.fills[i]
                ]);
            }
        }
        return new Map(mapped);
    }
    updateWithFill(fillMap) {
        for (let i = 0; i < this.svgs.length; i++) {
            const fill = fillMap.get(this.svgs[i]);
            if (fill) {
                this.fills[i] = fill;
            }
        }
        return this;
    }
    canBeUsedWith(t) {
        return this.template.isBaseEqual(t);
    }
    getShapeInstances() {
        const result = [];
        const shapes = this.getSelectedShape().timeline;
        for (let i = 0; i < shapes.length; i++) {
            result.push(shapes[i].toString());
        }
        return result;
    }
    getSelectedInstance() {
        return this.getSelectedShape().at;
    }
    getSelectedFills() {
        const result = new Map();
        for (let i = 0; i < this.fills.length; i++) {
            result.set(this.svgs[i], this.fillIds[i]);
        }
        return result;
    }
    svgForFillId(fillId) {
        const index = this.fills.indexOf(fillId);
        if (index >= 0) {
            return this.svgs[index];
        } else {
            return null;
        }
    }
    *figures() {
        for (let i = 0; i < this.fills.length; i++) {
            yield {
                d: this.svgs[i],
                fillId: this.fills[i],
                isHidden: this.hidden.has(i)
            };
        }
    }
}
exports.Path = Path;
}
// default/data/state/shape/template.js
$fsx.f[12] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const ellipse_1 = $fsx.r(13);
const line_1 = $fsx.r(14);
const quadratic_1 = $fsx.r(10);
const set_1 = $fsx.r(5);
const vector_1 = $fsx.r(4);
var ElementType;
(function (ElementType) {
    ElementType[ElementType['Line'] = 0] = 'Line';
    ElementType[ElementType['HLine'] = 1] = 'HLine';
    ElementType[ElementType['VLine'] = 2] = 'VLine';
    ElementType[ElementType['Ellipse'] = 3] = 'Ellipse';
}(ElementType = exports.ElementType || (exports.ElementType = {})));
function elemTypeFromNum(n) {
    switch (n) {
    case 1:
        return ElementType.HLine;
    case 2:
        return ElementType.VLine;
    case 3:
        return ElementType.Ellipse;
    default:
        return ElementType.Line;
    }
}
class TemplateElement {
    constructor(args, type) {
        this.args = args;
        this.type = type;
    }
    toJSON() {
        return {
            args: this.args.slice(0),
            type: this.type
        };
    }
    static revive(obj) {
        return new TemplateElement(obj.args, elemTypeFromNum(obj.type));
    }
    isEqual(e) {
        if (this.type === e.type) {
            for (let i = 0; i < this.args.length; i++) {
                if (this.args[i] !== e.args[i]) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    arcEllipse(pt) {
        const [cx, cy, h, v, a] = this.args;
        return ellipse_1.arcEllipse(cx, cy, h, v, a, pt);
    }
    ellipseIsBetween(pt1, pt2, testPt) {
        const angle1 = this.arcEllipse(pt1);
        const angle2 = this.arcEllipse(pt2);
        const tangle = this.arcEllipse(testPt);
        return ellipse_1.isBetweenEllipseAngles(angle1, angle2, tangle);
    }
    ellipseSweep(pt1, pt2) {
        const [cx, cy, rx, ry, a] = this.args;
        const x1 = pt1.x - cx;
        const y1 = pt1.y - cy;
        const x2 = pt2.x - cx;
        const y2 = pt2.y - cy;
        const crossProduct = x1 * y2 - x2 * y1;
        return crossProduct > 0;
    }
    lineEquation(lineArgs) {
        const [x0, y0, x1, y1] = lineArgs;
        return line_1.Line.equation(x0, y0, x1, y1);
    }
    intersectLines(l1, l2) {
        const [x1, y1, x2, y2] = l1;
        const [x3, y3, x4, y4] = l2;
        const v = line_1.Line.intersect(x1, y1, x2, y2, x3, y3, x4, y4);
        if (v) {
            return [vector_1.Vector2D.createRounded(512, v.x, v.y)];
        }
        return [];
    }
    intersectLineEllipse(l, e) {
        const [cx, cy, h, v, a] = e;
        const lineEq = this.lineEquation(l);
        const m = lineEq.m;
        const b = lineEq.b + lineEq.m * cx - cy;
        const cosa = Math.cos(a);
        const sina = Math.sin(a);
        const qa = v * v * cosa * cosa + 2 * (v * v) * m * cosa * sina + v * v * m * m * sina * sina + h * h * m * m * cosa * cosa - 2 * h * h * m * cosa * sina + h * h * sina * sina;
        const qb = 2 * v * v * b * cosa * sina + 2 * v * v * m * b * sina * sina + 2 * h * h * m * b * cosa * cosa - 2 * h * h * b * cosa * sina;
        const qc = v * v * b * b * sina * sina + h * h * b * b * cosa * cosa - h * h * v * v;
        const roots = quadratic_1.solveQuadraticEquation(qa, qb, qc).filter(num => num && !isNaN(num));
        const intersections = roots.map(_cr => {
            const cr = Math.floor(_cr * 100) * 0.01;
            const r = cr + cx;
            const lineY = r * m + lineEq.b;
            return vector_1.Vector2D.createRounded(512, r, lineY);
        });
        return intersections;
    }
    intersectVLineEllipse(l, e) {
        const [cx, cy, h, v, a] = e;
        const lx = l[0];
        const x = lx - cx;
        const cosa = Math.cos(a);
        const sina = Math.sin(a);
        const qa = v * v * sina * sina + h * h * cosa * cosa;
        const qb = 2 * x * cosa * sina * (v * v - h * h);
        const qc = x * x * (v * v * cosa * cosa + h * h * sina * sina) - h * h * v * v;
        const roots = quadratic_1.solveQuadraticEquation(qa, qb, qc).filter(num => num && !isNaN(num));
        const intersections = roots.map(_cr => {
            const cr = Math.floor(_cr * 100) * 0.01;
            const r = cr + cy;
            return vector_1.Vector2D.createRounded(512, lx, r);
        });
        return intersections;
    }
    intersectEllipses(e1, e2) {
        return [];
    }
    intersectLineWith(args, e) {
        switch (e.type) {
        case ElementType.VLine:
        case ElementType.HLine:
        case ElementType.Line:
            return this.intersectLines(args, e.args);
        case ElementType.Ellipse:
            return this.intersectLineEllipse(args, e.args);
        }
    }
    intersectEllipseWith(args, e) {
        switch (e.type) {
        case ElementType.VLine:
            return this.intersectVLineEllipse(e.args, args);
        case ElementType.HLine:
        case ElementType.Line:
            return this.intersectLineEllipse(e.args, args);
        case ElementType.Ellipse:
            return this.intersectEllipses(args, e.args);
        }
    }
    intersectVLineWith(args, e) {
        switch (e.type) {
        case ElementType.HLine:
        case ElementType.Line:
            return this.intersectLines(e.args, args);
        case ElementType.Ellipse:
            return this.intersectVLineEllipse(args, e.args);
        case ElementType.VLine:
            return [];
        }
    }
    intersect(e) {
        switch (this.type) {
        case ElementType.VLine:
            return this.intersectVLineWith(this.args, e);
        case ElementType.HLine:
        case ElementType.Line:
            return this.intersectLineWith(this.args, e);
        case ElementType.Ellipse:
            return this.intersectEllipseWith(this.args, e);
        default:
            throw new Error('Intersection of unknown element types');
        }
    }
    static line(x1, y1, x2, y2) {
        let type = ElementType.Line;
        if (y1 === y2) {
            type = ElementType.HLine;
        } else if (x1 === x2) {
            type = ElementType.VLine;
        }
        return new TemplateElement([
            x1,
            y1,
            x2,
            y2
        ], type);
    }
    static ellipse(cx, cy, rx, ry, alpha) {
        return new TemplateElement([
            cx,
            cy,
            rx,
            ry,
            alpha
        ], ElementType.Ellipse);
    }
}
exports.TemplateElement = TemplateElement;
class Intersection {
    constructor(pt, elemA, elemB) {
        this.point = pt;
        this.elementA = elemA;
        this.elementB = elemB;
    }
    toJSON() {
        return {
            pt: this.point.toJSON(),
            a: this.elementA,
            b: this.elementB
        };
    }
    static revive(o) {
        return new Intersection(vector_1.Vector2D.revive(o.pt), o.a, o.b);
    }
    equals(i) {
        return this.point.isEqual(i.point) && (this.elementA === i.elementA || this.elementA === i.elementB) && (this.elementB === i.elementB || this.elementB === i.elementA);
    }
    hasElement(elemId) {
        return this.elementA === elemId || this.elementB === elemId;
    }
}
class Template {
    toJSON() {
        return {
            base: this.base,
            elements: this.elements.map(e => e.toJSON()),
            res: this.resolution,
            rot: this.rotation
        };
    }
    static revive(o) {
        return new Template(o.base, o.elements.map(TemplateElement.revive), o.res, o.rot);
    }
    toSvgPath(num) {
        let result = '';
        for (let i = 0; i < num; i++) {
            const elem = this.elements[i];
            const a = elem.args;
            switch (elem.type) {
            case ElementType.Line:
                result += `M${ a[0] } ${ a[1] } L${ a[2] } ${ a[3] } `;
                continue;
            case ElementType.HLine:
                result += `M${ a[0] } ${ a[1] } H${ a[2] } `;
                continue;
            case ElementType.VLine:
                result += `M${ a[0] } ${ a[1] } V${ a[3] } `;
                continue;
            case ElementType.Ellipse:
                const [cx, cy, rx, ry, alpha] = a;
                result += `M${ cx - rx } ${ cy } a${ rx } ${ ry } 0 1 0 ${ rx * 2 } 0 a${ rx } ${ ry } 0 1 0 -${ rx * 2 } 0`;
            }
        }
        return result;
    }
    constructor(baseUntil, elements, resolution = 512, rotation = 0) {
        this.rotation = rotation;
        this.resolution = resolution;
        this.base = baseUntil;
        this.points = new set_1.VectorSet([]);
        this.basePoints = new set_1.VectorSet();
        this.elements = elements;
        this.intersections = new Set();
        this.baseIntersections = new Set();
        for (let i = 0; i < elements.length; i++) {
            const e1 = elements[i];
            for (let j = 0; j < elements.length; j++) {
                if (j === i) {
                    continue;
                }
                const ipts = e1.intersect(elements[j]);
                for (let p = 0; p < ipts.length; p++) {
                    let pt = ipts[p];
                    pt = this.addPoint(pt);
                    const intersection = new Intersection(pt, i, j);
                    this.intersections.add(intersection);
                    if (i < baseUntil && j < baseUntil) {
                        this.baseIntersections.add(intersection);
                        this.basePoints.add(pt);
                    }
                }
            }
        }
        const clipped = this.clip(this.points, this.intersections);
        this.points = clipped.points;
        this.intersections = clipped.intersections;
        this.pathString = this.toSvgPath(this.elements.length);
        this.baseString = this.toSvgPath(this.base);
    }
    elementPoints(te) {
        const result = new set_1.VectorSet();
        for (let i = 0; i < this.elements.length; i++) {
            if (this.elements[i].isEqual(te)) {
                for (const intersection of this.intersections) {
                    if (intersection.hasElement(i)) {
                        result.add(intersection.point);
                    }
                }
                return result;
            }
        }
        return result;
    }
    addPoint(pt) {
        const epsilon = 1;
        const nearSet = vector_1.Vector2D.getNearSet(pt, epsilon);
        const nearPoint = nearSet.find(v => this.points.has(v));
        if (!nearPoint) {
            this.points.add(pt);
            return pt;
        } else {
            return nearPoint;
        }
    }
    getIntersections(pt) {
        const filtered = new Set();
        for (const i of this.intersections) {
            if (i.point.isEqual(pt)) {
                filtered.add(i);
            }
        }
        return filtered;
    }
    getElements(pt) {
        const result = new Set();
        for (const i of this.getIntersections(pt)) {
            result.add(this.elements[i.elementA]);
            result.add(this.elements[i.elementB]);
        }
        return result;
    }
    getReachable(pt) {
        const result = new set_1.VectorSet();
        const elementsIndices = new Set();
        for (const i of this.getIntersections(pt)) {
            elementsIndices.add(i.elementA);
            elementsIndices.add(i.elementB);
        }
        for (const i of this.intersections) {
            if (!pt.isEqual(i.point) && (elementsIndices.has(i.elementA) || elementsIndices.has(i.elementB))) {
                result.add(i.point);
            }
        }
        return result;
    }
    getReachableFrom(edge1, edge2, without) {
        const result = new set_1.VectorSet();
        const elementsIndices = new Set();
        const withoutPts = new set_1.VectorSet(without);
        for (const i of this.intersectBoth(edge1, edge2)) {
            elementsIndices.add(i.elementA);
            elementsIndices.add(i.elementB);
        }
        for (const i of this.intersections) {
            if (!withoutPts.has(i.point) && !edge1.isEqual(i.point) && !edge2.isEqual(i.point) && (elementsIndices.has(i.elementA) || elementsIndices.has(i.elementB))) {
                result.add(i.point);
            }
        }
        return result;
    }
    intersectBoth(pt1, pt2) {
        const filtered = new Set();
        for (const i of this.intersections) {
            if (i.point.isEqual(pt1) || i.point.isEqual(pt2)) {
                filtered.add(i);
            }
        }
        return filtered;
    }
    isBaseEqual(t) {
        return this.base === t.base && this.baseIntersections.size === t.baseIntersections.size && this.basePoints.equals(t.basePoints);
    }
    clip(points, intersections) {
        let resultPoints;
        let resultIntersections = new Set();
        if (this.base === 3) {
            const [pt1, pt2, pt3] = this.basePoints.toArray();
            resultPoints = points.filter((e, x, y) => {
                if (!x || !y) {
                    return false;
                }
                return vector_1.Vector2D.insideTriangle(x, y, pt1, pt2, pt3);
            });
            for (const i of intersections) {
                if (vector_1.Vector2D.insideTriangle(i.point.x, i.point.y, pt1, pt2, pt3)) {
                    resultIntersections.add(i);
                }
            }
        } else {
            resultPoints = points;
            resultIntersections = intersections;
        }
        return {
            points: resultPoints,
            intersections: resultIntersections
        };
    }
}
exports.Template = Template;
exports.squareRoundTrisTemplate = () => new Template(4, [
    TemplateElement.line(0, 0, 512, 0),
    TemplateElement.line(512, 0, 512, 512),
    TemplateElement.line(512, 512, 0, 512),
    TemplateElement.line(0, 512, 0, 0),
    TemplateElement.line(256, 0, 256, 512),
    TemplateElement.line(0, 256, 512, 256),
    TemplateElement.line(0, 512, 128, 0),
    TemplateElement.line(128, 0, 256, 512),
    TemplateElement.line(256, 512, 384, 0),
    TemplateElement.line(384, 0, 512, 512),
    TemplateElement.line(256, 0, 384, 512),
    TemplateElement.line(384, 512, 512, 0),
    TemplateElement.line(0, 0, 128, 512),
    TemplateElement.line(128, 512, 256, 0),
    TemplateElement.ellipse(128, 128, 93.08, 94, 0),
    TemplateElement.ellipse(384, 128, 93.08, 94, 0),
    TemplateElement.ellipse(384, 384, 93.08, 94, 0),
    TemplateElement.ellipse(128, 384, 93.08, 94, 0)
]);
exports.squareDiagTemplate = () => new Template(4, [
    TemplateElement.line(0, 0, 512, 0),
    TemplateElement.line(512, 0, 512, 512),
    TemplateElement.line(512, 512, 0, 512),
    TemplateElement.line(0, 512, 0, 0),
    TemplateElement.line(256, 0, 256, 512),
    TemplateElement.line(0, 256, 512, 256),
    TemplateElement.line(128, 0, 128, 512),
    TemplateElement.line(384, 0, 384, 512),
    TemplateElement.line(0, 128, 512, 128),
    TemplateElement.line(0, 384, 512, 384),
    TemplateElement.line(64, 0, 64, 512),
    TemplateElement.line(192, 0, 192, 512),
    TemplateElement.line(320, 0, 320, 512),
    TemplateElement.line(448, 0, 448, 512),
    TemplateElement.line(0, 64, 512, 64),
    TemplateElement.line(0, 192, 512, 192),
    TemplateElement.line(0, 320, 512, 320),
    TemplateElement.line(0, 448, 512, 448),
    TemplateElement.line(64, 0, 0, 64),
    TemplateElement.line(128, 0, 0, 128),
    TemplateElement.line(192, 0, 0, 192),
    TemplateElement.line(256, 0, 0, 256),
    TemplateElement.line(320, 0, 0, 320),
    TemplateElement.line(384, 0, 0, 384),
    TemplateElement.line(448, 0, 0, 448),
    TemplateElement.line(512, 0, 0, 512),
    TemplateElement.line(512, 64, 64, 512),
    TemplateElement.line(512, 128, 128, 512),
    TemplateElement.line(512, 192, 192, 512),
    TemplateElement.line(512, 256, 256, 512),
    TemplateElement.line(512, 320, 320, 512),
    TemplateElement.line(512, 384, 384, 512),
    TemplateElement.line(512, 448, 448, 512),
    TemplateElement.line(448, 0, 512, 64),
    TemplateElement.line(384, 0, 512, 128),
    TemplateElement.line(320, 0, 512, 192),
    TemplateElement.line(256, 0, 512, 256),
    TemplateElement.line(192, 0, 512, 320),
    TemplateElement.line(128, 0, 512, 384),
    TemplateElement.line(64, 0, 512, 448),
    TemplateElement.line(0, 0, 512, 512),
    TemplateElement.line(0, 64, 448, 512),
    TemplateElement.line(0, 128, 384, 512),
    TemplateElement.line(0, 192, 320, 512),
    TemplateElement.line(0, 256, 256, 512),
    TemplateElement.line(0, 320, 192, 512),
    TemplateElement.line(0, 384, 128, 512),
    TemplateElement.line(0, 448, 64, 512)
]);
exports.squareBasicTemplate = () => new Template(4, [
    TemplateElement.line(0, 0, 512, 0),
    TemplateElement.line(512, 0, 512, 512),
    TemplateElement.line(512, 512, 0, 512),
    TemplateElement.line(0, 512, 0, 0),
    TemplateElement.line(256, 0, 256, 512),
    TemplateElement.line(0, 256, 512, 256),
    TemplateElement.line(0, 0, 512, 512),
    TemplateElement.line(0, 512, 512, 0),
    TemplateElement.ellipse(256, 256, 90, 90, 0),
    TemplateElement.ellipse(256, 256, 90 + 38, 90 + 38, 0),
    TemplateElement.ellipse(256, 256, 90 + 90 + 38, 90 + 90 + 38, 0),
    TemplateElement.ellipse(256, 256, 90 + 90 + 38 + 38, 90 + 90 + 38 + 38, 0),
    TemplateElement.line(0, 410, 512, 410),
    TemplateElement.line(0, 384, 512, 384),
    TemplateElement.line(0, 346, 512, 346),
    TemplateElement.line(0, 166, 512, 166),
    TemplateElement.line(0, 128, 512, 128),
    TemplateElement.line(0, 102, 512, 102),
    TemplateElement.line(102, 0, 102, 512),
    TemplateElement.line(128, 0, 128, 512),
    TemplateElement.line(166, 0, 166, 512),
    TemplateElement.line(346, 0, 346, 512),
    TemplateElement.line(384, 0, 384, 512),
    TemplateElement.line(410, 0, 410, 512)
]);
exports.triVDefaultTemplate = () => new Template(3, [
    TemplateElement.line(418, 390, 209, 26),
    TemplateElement.line(0, 390, 209, 26),
    TemplateElement.line(0, 390, 418, 390),
    TemplateElement.line(209, 26, 209, 390),
    TemplateElement.line(128, 0, 128, 512),
    TemplateElement.line(384, 0, 384, 512),
    TemplateElement.line(0, 128, 512, 128),
    TemplateElement.line(0, 384, 512, 384),
    TemplateElement.ellipse(209, 269, 121, 121, 0),
    TemplateElement.ellipse(209, 269, 70, 70, 0),
    TemplateElement.ellipse(104, 209, 418, 390, 0),
    TemplateElement.ellipse(313, 209, 0, 390, 0),
    TemplateElement.line(281, 390, 348, 269),
    TemplateElement.line(138, 390, 70, 270),
    TemplateElement.line(279, 148, 139, 148),
    TemplateElement.line(138, 148, 281, 390),
    TemplateElement.line(279, 148, 138, 390),
    TemplateElement.line(347, 269, 70, 269)
], 418, 0);
}
// default/data/state/math/ellipse.js
$fsx.f[13] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const vector_1 = $fsx.r(4);
function arcEllipse(cx, cy, h, v, a, pt) {
    const _x = (pt.x - cx) * Math.cos(a) + (pt.y - cy) * Math.sin(a) + cx;
    const _y = (pt.y - cy) * Math.cos(a) + (pt.x - cx) * Math.sin(a) + cy;
    const x = (_x - cx) / h;
    const y = (_y - cy) / v;
    let arctan = 2 * Math.PI;
    if (x > 0 && y >= 0) {
        arctan = Math.atan(y / x);
    } else if (x < 0 && y >= 0) {
        arctan = Math.PI - Math.atan(y / -x);
    } else if (x < 0 && y < 0) {
        arctan = Math.PI + Math.atan(y / x);
    } else if (x > 0 && y < 0) {
        arctan = 2 * Math.PI - Math.atan(-y / x);
    } else if (x === 0 && y >= 0) {
        arctan = Math.PI / 2;
    } else if (x === 0 && y < 0) {
        arctan = 3 * Math.PI / 2;
    }
    return arctan;
}
exports.arcEllipse = arcEllipse;
function tanEllipse(cx, cy, h, v, a, pt) {
    const _xm = (pt.x - cx) * Math.cos(a) + (pt.y - cy) * Math.sin(a);
    const _ym = (pt.y - cy) * Math.cos(a) + (pt.x - cx) * Math.sin(a);
    const _x = _xm + cx;
    const _y = _ym + cy;
    const m1 = -(_xm / _ym) * (v * v) / (h * h);
    let m2;
    if (isFinite(m1)) {
        m2 = (m1 * Math.cos(a) + Math.sin(a)) / (Math.cos(a) - m1 * Math.sin(a));
    } else {
        m2 = Math.cos(a) / -Math.sin(a);
    }
    const y2 = (_y - cy) * Math.cos(a) + (_x - cx) * Math.sin(a) + cy;
    const x2 = (_x - cx) * Math.cos(a) - (y2 - cy) * Math.sin(a) + cx;
    return {
        m: m2,
        x: x2,
        y: y2
    };
}
function plotEllipse(cx, cy, h, v, a, b) {
    const x = h * Math.cos(b) * Math.cos(a) - v * Math.sin(b) * Math.sin(a);
    const y = v * Math.sin(b) * Math.cos(a) + h * Math.cos(b) * Math.sin(a);
    return new vector_1.Vector2D(x + cx, y + cy);
}
function isBetweenEllipseAngles(angle1, angle2, tangle) {
    const diff = Math.abs(angle2 - angle1);
    if (diff >= Math.PI) {
        if (angle1 > angle2) {
            return !(tangle < angle1 && tangle > angle2);
        } else {
            return !(tangle < angle2 && tangle > angle1);
        }
    } else {
        if (angle1 > angle2) {
            return tangle < angle1 && tangle > angle2;
        } else {
            return tangle > angle1 && tangle < angle2;
        }
    }
}
exports.isBetweenEllipseAngles = isBetweenEllipseAngles;
function intersectLinesSlope(m1, x1, b1, m2, x2, b2) {
    const b = b1 - b2;
    const x = -(b - m1 * x1 + m2 * x2) / (m1 - m2);
    const y = m1 * (x - x1) + b1;
    return new vector_1.Vector2D(x, y);
}
}
// default/data/state/math/line.js
$fsx.f[14] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const vector_1 = $fsx.r(4);
class Line {
    static equation(x0, y0, x1, y1) {
        return {
            m: (y1 - y0) / (x1 - x0),
            b: (x1 * y0 - x0 * y1) / (x1 - x0)
        };
    }
    static intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        const x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (Number.isNaN(x) || !Number.isFinite(x)) {
            return null;
        }
        const y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
        if (Number.isNaN(y) || !Number.isFinite(y)) {
            return null;
        }
        return new vector_1.Vector2D(x, y);
    }
}
exports.Line = Line;
}
// default/data/state/shape/shape.js
$fsx.f[15] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const grid_1 = $fsx.r(16);
const path_1 = $fsx.r(11);
const template_1 = $fsx.r(12);
class Shape {
    constructor(type, editor, shapeFillSetId) {
        this._editor = editor;
        this.created = shapeFillSetId;
        this.selected = shapeFillSetId;
        this.previousSelected = null;
        const fillMap = editor.getFillMap();
        this.pathFills = new Map([[
                shapeFillSetId,
                fillMap
            ]]);
        this.type = type;
        this._selectedPath = fillMap.keys().next().value;
        this.template = editor.template;
    }
    toJSON() {
        const pathFills = [...this.pathFills.entries()].map(([k, v]) => [
            k,
            [...v.entries()]
        ]);
        return {
            e: this._editor.toJSON(),
            pf: pathFills,
            s: this.selected,
            ps: this.previousSelected,
            sp: this._selectedPath,
            c: this.created,
            ty: this.type,
            t: this.template.toJSON()
        };
    }
    static revive(o) {
        const t = template_1.Template.revive(o.t);
        const path = path_1.Path.revive(o.e, t);
        const fills = new Map(o.pf.map(f => [
            f[0],
            new Map(f[1])
        ]));
        const result = new Shape(o.ty, path, 0);
        result.pathFills = fills;
        result.selected = o.s;
        result.previousSelected = o.ps;
        result._selectedPath = o.sp;
        result.created = o.c;
        result.type = o.ty;
        result.template = template_1.Template.revive(o.t);
        return result;
    }
    static FullSquare(fillIds, t) {
        const fillSetId = 1;
        const s = new Shape(grid_1.GridType.Square, path_1.Path.FullSquare(fillIds[0], t), fillSetId);
        for (let i = 0; i < fillIds.length; i++) {
            s.addNewFills([fillIds[i]], i + 1);
        }
        return s;
    }
    rndShapeFillSetId(rnd) {
        let fillId = rnd.pop();
        while (this.pathFills.has(fillId)) {
            fillId = rnd.pop();
        }
        return fillId;
    }
    get selectedPath() {
        return this._selectedPath;
    }
    get selectedPathFillId() {
        const pathFillIds = this.pathFills.get(this.selected);
        if (!pathFillIds) {
            throw new Error(`Unknown selected shape fill set id ${ this.selected }`);
        }
        const fillId = pathFillIds.get(this._selectedPath);
        if (!fillId) {
            throw new Error(`FillId not found for the selected path ${ this._selectedPath }`);
        }
        return fillId;
    }
    set selectedFillId(fid) {
        const pathFillIds = this.pathFills.get(this.selected);
        if (!pathFillIds) {
            throw new Error(`Unknown selected shape fill set id ${ this.selected }`);
        }
        for (const [pathd, pathfid] of pathFillIds.entries()) {
            if (pathfid === fid) {
                this._selectedPath = pathd;
                return;
            }
        }
        throw new Error(`Cannot set shape fillID ${ fid }`);
    }
    get resolution() {
        return this._editor.template.resolution;
    }
    get pathFillsSize() {
        return this.pathFills.size;
    }
    get fillSetSize() {
        return this.pathFills.values().next().value.size;
    }
    maxFillIds() {
        return this.pathFills.size * Math.max(this._editor.fillIds.length, this.getSelectedFills().size);
    }
    needsNewFillIds(cmds) {
        const result = {
            fillIds: [],
            size: this.pathFills.size
        };
        const ammount = cmds.created.length;
        if (ammount > 0) {
            for (let i = 0; i < cmds.created.length; i++) {
                result.fillIds.push(cmds.created[i][1]);
            }
        }
        return result;
    }
    analyzeUpdatedShape(p) {
        const result = {
            deleted: new Map(),
            changed: new Map(),
            created: [],
            unchanged: new Map()
        };
        const selected = this.pathFills.get(this.selected);
        if (!selected) {
            throw new Error(`No fill set id is selected`);
        }
        const tmpSet = new Set();
        const pfills = p.fillIds;
        const pathFillIds = new Set(pfills);
        for (const [d, fillId] of selected.entries()) {
            if (!pathFillIds.has(fillId)) {
                result.deleted.set(d, fillId);
            } else {
                const newD = p.svgForFillId(fillId);
                const oldD = d;
                if (!newD) {
                    console.warn('Should not happen, new d string not found for fillId', fillId);
                    result.deleted.set(d, fillId);
                } else if (newD !== oldD) {
                    result.changed.set(oldD, newD);
                } else {
                    result.unchanged.set(d, fillId);
                }
            }
            tmpSet.add(fillId);
        }
        for (const fig of p.figures()) {
            if (!fig.isHidden) {
                if (!tmpSet.has(fig.fillId)) {
                    result.created.push([
                        fig.d,
                        fig.fillId
                    ]);
                }
            }
        }
        return result;
    }
    updateShape(p, duplicateIds, cmds) {
        const result = new Map();
        let at = 0;
        for (const entry of this.pathFills.entries()) {
            const dupMap = new Map();
            for (const dup of duplicateIds.entries()) {
                dupMap.set(dup[0], dup[1][at]);
            }
            result.set(entry[0], this.applyCmds(entry[1], cmds, dupMap));
            at++;
        }
        this.pathFills = result;
    }
    applyCmds(m, cmds, dups) {
        const deleteFids = [];
        const result = [];
        for (const entry of m.entries()) {
            const d = entry[0];
            const fid = entry[1];
            const changed = cmds.changed.get(d);
            if (changed) {
                entry[0] = changed;
                result.push(entry);
            } else if (cmds.deleted.has(d)) {
                deleteFids.push(fid);
            } else {
                result.push(entry);
            }
        }
        for (let i = 0; i < cmds.created.length; i++) {
            let fid = deleteFids.pop();
            if (!fid) {
                fid = dups.get(cmds.created[i][1]);
            }
            if (fid) {
                result.push([
                    cmds.created[i][0],
                    fid
                ]);
            }
        }
        return new Map(result);
    }
    updateEditorFills() {
        const fills = this.pathFills.get(this.selected);
        if (!fills) {
            throw new Error(`Cannot discard new Shape fills: No selected fill found in shape ${ this.selected }`);
        }
        this._editor.updateWithFill(fills);
        return this._editor;
    }
    entries() {
        return this.pathFills.entries();
    }
    get selectedFillSet() {
        return this.selected;
    }
    get fillSetIds() {
        return this.pathFills.keys();
    }
    svgPathStrings() {
        return this._editor.getSvgShapes();
    }
    get editor() {
        return this._editor;
    }
    getSelectedFills() {
        const fills = this.pathFills.get(this.selected);
        if (!fills) {
            throw new Error(`Cannot get fills: no fills found in this shape`);
        }
        return fills;
    }
    addNewFills(fillIds, shapeFillSetId) {
        this.pathFills.set(shapeFillSetId, this._editor.changeFills(fillIds));
        this.previousSelected = this.selected;
        this.selected = shapeFillSetId;
        this.created = shapeFillSetId;
        return this;
    }
    selectFill(fid) {
        if (this.pathFills.has(fid)) {
            this.selected = fid;
            return this;
        } else {
            throw new Error(`Cannot select fill because fillId '${ fid }' is not present in this brush path fills`);
        }
    }
    removeSelectedFill() {
        if (this.pathFills.size === 1) {
            return this;
        } else if (!this.pathFills.has(this.selected)) {
            throw new Error(`Cannot delete because there is no selected fill '${ this.selected }' `);
        }
        this.pathFills.delete(this.selected);
        this.selected = this.previousSelected || this.pathFills.keys().next().value;
        return this;
    }
    discardNewFill() {
        this.pathFills.delete(this.created);
        this.selected = this.previousSelected || this.pathFills.keys().next().value;
        const fills = this.pathFills.get(this.selected);
        if (!fills) {
            throw new Error(`Cannot discard new Shape fills: No selected fill found in shape ${ this.selected }`);
        }
        this._editor.updateWithFill(fills);
        return this;
    }
    canBeUsed(t) {
        return this._editor.canBeUsedWith(t);
    }
}
exports.Shape = Shape;
}
// default/data/state/layer/grid.js
$fsx.f[16] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const defaults_1 = $fsx.r(17);
const rgb_1 = $fsx.r(9);
const set_1 = $fsx.r(5);
const vector_1 = $fsx.r(4);
const grid_element_1 = $fsx.r(18);
const tile_pattern_1 = $fsx.r(19);
var GridType;
(function (GridType) {
    GridType[GridType['Square'] = 1] = 'Square';
    GridType[GridType['TriangleH'] = 2] = 'TriangleH';
    GridType[GridType['TriangleV'] = 3] = 'TriangleV';
}(GridType = exports.GridType || (exports.GridType = {})));
class Grid {
    constructor(type, shapes, selectedShape, selectedShapeFillId, canvas = new set_1.VectorMap()) {
        this._curElement = new grid_element_1.GridElement(selectedShape, selectedShapeFillId, 0);
        this._type = type;
        this._shapes = this._buildShapes(shapes);
        this._selectedShape = selectedShape;
        this._canvas = canvas;
        this._possibleShapeRotations = [
            0,
            1 / 4,
            2 / 4,
            3 / 4
        ];
        this._gridColor = rgb_1.RGBColor.fromHex('#bebece');
        this.cursorAt = [
            0,
            0
        ];
        this.cursorColor = defaults_1.ColorDefaults.CURSOR;
        this.pattern = null;
    }
    toJSON() {
        return {
            ce: this._curElement.toJSON(),
            t: this._type,
            s: [...this._shapes.entries()],
            ss: this._selectedShape,
            c: this._canvas.toJSON(e => e.toJSON()),
            r: this._possibleShapeRotations.slice(0),
            bg: this.background,
            gc: this._gridColor.toJSON(),
            cc: this.cursorColor,
            ca: this.cursorAt.slice(0),
            p: this.pattern ? this.pattern.toJSON() : null
        };
    }
    static revive(o) {
        const shapes = o.s.map(s => s[0]);
        const canvas = set_1.VectorMap.revive(o.c, grid_element_1.GridElement.revive);
        const result = new Grid(o.t, shapes, o.ss, o.ce.fsi, canvas);
        result._shapes = new Map(o.s);
        result._possibleShapeRotations = o.r;
        result._gridColor = rgb_1.RGBColor.revive(o.gc);
        result.cursorAt = o.ca;
        result.cursorColor = o.cc;
        result.background = o.bg;
        result.pattern = o.p ? tile_pattern_1.TilePattern.revive(o.p) : null;
        return result;
    }
    gridXYView(elem, view) {
        const u = view.unitSize;
        const x = elem.x;
        const y = elem.y;
        const initX = view.squareLayerX();
        const initY = view.squareLayerY();
        const offX = initX + x * view.unitSize + (u - view.x % u);
        const offY = initY + y * view.unitSize + (u - view.y % u);
        return new vector_1.Vector2D(offX, offY);
    }
    gridX(screenX, view) {
        const initX = view.squareLayerX();
        return initX + view.squareX(screenX);
    }
    gridY(screenY, view) {
        const initY = view.squareLayerY();
        return initY + view.squareY(screenY);
    }
    renderSVGUse(dims, res, useRes = true) {
        const result = [];
        const dx = Math.abs(dims.minX);
        const dy = Math.abs(dims.minY);
        for (const [gridElem, [x, y]] of this._canvas.entries()) {
            let posx = res * (x - dx);
            let posy = res * (y - dy);
            if (dims.minX < 0) {
                posx = res * (x + dx);
            }
            if (dims.minY < 0) {
                posy = res * (y + dy);
            }
            result.push(`
			<use xlink:href="#${ gridElem.shapeId }-${ gridElem.fillSetId }" x="${ posx }" y="${ posy }" ${ useRes ? `width="${ res + 2 }" height="${ res + 2 }"` : '' } transform="scale(${ 1 }) rotate(${ gridElem.rotation * 360 }, ${ posx + res / 2 }, ${ posy + res / 2 })" />
			`);
        }
        return result;
    }
    dimensions(usePattern = false) {
        const result = {
            width: undefined,
            height: undefined,
            maxX: undefined,
            maxY: undefined,
            minX: undefined,
            minY: undefined
        };
        if (usePattern && this.pattern) {
            return {
                minX: this.pattern.startX,
                maxX: this.pattern.endX,
                minY: this.pattern.startY,
                maxY: this.pattern.endY,
                width: this.pattern.width,
                height: this.pattern.height
            };
        } else {
            for (const [_, [x, y]] of this._canvas.entries()) {
                if (x === undefined || y === undefined) {
                    continue;
                }
                if (result.maxX === undefined || x > result.maxX) {
                    result.maxX = x;
                }
                if (result.maxY === undefined || y > result.maxY) {
                    result.maxY = y;
                }
                if (result.minX === undefined || x < result.minX) {
                    result.minX = x;
                }
                if (result.minY === undefined || y < result.minY) {
                    result.minY = y;
                }
            }
            if (result.maxX === undefined || result.maxY === undefined || result.minY === undefined || result.minX === undefined) {
                return {
                    width: 0,
                    height: 0,
                    maxX: 0,
                    maxY: 0,
                    minX: 0,
                    minY: 0
                };
            } else {
                let w = 1;
                if (result.maxX !== result.minX) {
                    w = Math.abs(result.maxX - result.minX) + 1;
                }
                let h = 1;
                if (result.maxY !== result.minY) {
                    h = Math.abs(result.maxY - result.minY) + 1;
                }
                result.width = w;
                result.height = h;
                return {
                    maxX: result.maxX,
                    minX: result.minX,
                    maxY: result.maxY,
                    minY: result.minY,
                    width: w,
                    height: h
                };
            }
        }
    }
    coordsElemAt(absX, absY, view) {
        return new vector_1.Vector2D(this.gridX(absX, view), this.gridY(absY, view));
    }
    isCursorUpdateNeeded(screenX, screenY, view) {
        const x = this.gridX(screenX, view);
        const y = this.gridY(screenY, view);
        if (this.cursor[0] !== x || this.cursor[1] !== y) {
            view.screenY(y);
        }
        return this.cursor[0] !== x || this.cursor[1] !== y;
    }
    updateCursor(absX, absY, view) {
        const unitSize = view.unitSize;
        this.cursor[0] = this.gridX(absX, view);
        this.cursor[1] = this.gridY(absY, view);
    }
    get cursor() {
        return this.cursorAt;
    }
    _buildShapes(shapes) {
        const result = new Map();
        for (let i = 0; i < shapes.length; i++) {
            result.set(shapes[i], 0);
        }
        return result;
    }
    get gridLineColor() {
        return this._gridColor.toGL();
    }
    get type() {
        return this._type;
    }
    get shapes() {
        return this._shapes;
    }
    get selectedShape() {
        return this._selectedShape;
    }
    get selectedRot() {
        return this.getShapeRotation(this._selectedShape);
    }
    paintElementAt(x, y) {
        this._canvas.addXY(x, y, this._curElement);
    }
    deleteElementAt(x, y) {
        this._canvas.deleteXY(x, y);
    }
    getElementAt(x, y) {
        return this._canvas.getXY(x, y);
    }
    getShapeRotation(shapeId) {
        return this._possibleShapeRotations[this._shapes.get(shapeId) || 0];
    }
    rotateSelected() {
        let rotIndex = this._shapes.get(this._selectedShape);
        if (rotIndex === undefined) {
            throw new Error(`Cannot rotate the shape: selected shape not found ${ this._selectedShape }`);
        }
        rotIndex = (rotIndex + 1) % this._possibleShapeRotations.length;
        this._shapes.set(this._selectedShape, rotIndex);
        const rot = this._possibleShapeRotations[rotIndex];
        const newElem = new grid_element_1.GridElement(this._curElement.shapeId, this._curElement.fillSetId, rot);
        this._curElement = newElem;
        return rot;
    }
    addNewShape(sid, shapeFillId) {
        this._shapes.set(sid, 0);
        this.selectShape(sid, shapeFillId);
        return this;
    }
    selectShape(sid, shapeFillId) {
        this._selectedShape = sid;
        const rot = this._possibleShapeRotations[this._shapes.get(sid) || 0];
        this._curElement = new grid_element_1.GridElement(sid, shapeFillId, rot);
        return this;
    }
    selectFill(fid) {
        const newElem = new grid_element_1.GridElement(this._curElement.shapeId, fid, this._curElement.rotation);
        this._curElement = newElem;
        return this;
    }
    clear() {
        this._canvas.clear();
        return this;
    }
}
exports.Grid = Grid;
}
// default/data/state/color/defaults.js
$fsx.f[17] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var ColorDefaults;
(function (ColorDefaults) {
    ColorDefaults[ColorDefaults['BLACK'] = 0] = 'BLACK';
    ColorDefaults[ColorDefaults['WHITE'] = 1] = 'WHITE';
    ColorDefaults[ColorDefaults['NEAR_BLACK'] = 2] = 'NEAR_BLACK';
    ColorDefaults[ColorDefaults['DARK_GRAY'] = 3] = 'DARK_GRAY';
    ColorDefaults[ColorDefaults['LIGHT_GRAY'] = 4] = 'LIGHT_GRAY';
    ColorDefaults[ColorDefaults['GRID'] = 5] = 'GRID';
    ColorDefaults[ColorDefaults['NEAR_WHITE'] = 6] = 'NEAR_WHITE';
    ColorDefaults[ColorDefaults['ORANGE'] = 7] = 'ORANGE';
    ColorDefaults[ColorDefaults['GREEN'] = 8] = 'GREEN';
    ColorDefaults[ColorDefaults['PURPLE'] = 9] = 'PURPLE';
    ColorDefaults[ColorDefaults['LIGHT_RED'] = 10] = 'LIGHT_RED';
    ColorDefaults[ColorDefaults['GOLD'] = 11] = 'GOLD';
    ColorDefaults[ColorDefaults['YELLOW'] = 12] = 'YELLOW';
    ColorDefaults[ColorDefaults['DARK_BLUE'] = 13] = 'DARK_BLUE';
    ColorDefaults[ColorDefaults['BLUE'] = 14] = 'BLUE';
    ColorDefaults[ColorDefaults['LIGHT_BLUE'] = 15] = 'LIGHT_BLUE';
    ColorDefaults[ColorDefaults['CURSOR'] = 16] = 'CURSOR';
}(ColorDefaults = exports.ColorDefaults || (exports.ColorDefaults = {})));
}
// default/data/state/layer/grid_element.js
$fsx.f[18] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class GridElement {
    constructor(shapeId, fillSetId, rotation) {
        this.shapeId = shapeId;
        this.fillSetId = fillSetId;
        this.rotation = rotation;
    }
    toJSON() {
        return {
            s: this.shapeId,
            fsi: this.fillSetId,
            r: this.rotation
        };
    }
    static revive(o) {
        return new GridElement(o.s, o.fsi, o.r);
    }
}
exports.GridElement = GridElement;
}
// default/data/state/layer/tile_pattern.js
$fsx.f[19] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class TilePattern {
    constructor(sx, sy, ex, ey) {
        this.startX = sx;
        this.startY = sy;
        this.endX = ex;
        this.endY = ey;
    }
    get width() {
        return Math.abs(this.endX - this.startX);
    }
    get height() {
        return Math.abs(this.endY - this.startY);
    }
    toJSON() {
        return {
            sx: this.startX,
            sy: this.startY,
            ey: this.endY,
            ex: this.endX
        };
    }
    static revive(o) {
        return new TilePattern(o.sx, o.sy, o.ex, o.ey);
    }
    getX(layerX) {
        const w = this.endX - this.startX;
        if (layerX < this.startX) {
            const dx = this.startX - layerX;
            return this.startX + (w - dx % w) % w;
        } else if (layerX >= this.endX) {
            const dx = layerX - this.endX;
            return this.startX + dx % w;
        } else {
            return layerX;
        }
    }
    getY(layerY) {
        const h = this.endY - this.startY;
        if (layerY < this.startY) {
            const dy = this.startY - layerY;
            return this.startY + (h - dy % h) % h;
        } else if (layerY >= this.endY) {
            return this.startY + (layerY - this.endY) % h;
        } else {
            return layerY;
        }
    }
}
exports.TilePattern = TilePattern;
}
// default/data/state/ui.js
$fsx.f[20] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const tile_pattern_1 = $fsx.r(19);
const clip_pattern_1 = $fsx.r(21);
const cursor_1 = $fsx.r(22);
const defaults_1 = $fsx.r(29);
const export_1 = $fsx.r(40);
const fill_editor_1 = $fsx.r(41);
const menu_1 = $fsx.r(39);
const publish_1 = $fsx.r(43);
const shape_editor_1 = $fsx.r(44);
const tools_submenus_1 = $fsx.r(45);
var UIState;
(function (UIState) {
    UIState['Project'] = 'Project';
    UIState['ShapeEditor'] = 'ShapeEditor';
    UIState['FillEditor'] = 'FillEditor';
    UIState['Export'] = 'Export';
    UIState['Publish'] = 'Publish';
    UIState['PublishPreview'] = 'PublishPreview';
    UIState['PatternAdjustStart'] = 'PatternAdjustStart';
    UIState['PatternAdjustEnd'] = 'PatternAdjustEnd';
    UIState['Product'] = 'Product';
}(UIState = exports.UIState || (exports.UIState = {})));
class UI {
    constructor(grid, shapesMap, fills) {
        if (!grid || !shapesMap || !fills) {
            return;
        }
        this.title = 'Grid Generator';
        this.at = UIState.Project;
        this.mainMenu = new menu_1.Menu(defaults_1.DefaultMainMenu);
        this.featuresMenu = new menu_1.Menu(defaults_1.DefaultFeaturesMenu);
        this.toolsMenu = new menu_1.Menu(defaults_1.DefaultToolsMenu);
        this.toolsMenu.selected = defaults_1.ToolsMenuId.Paint;
        const shape = shapesMap.getShapeById(grid.selectedShape);
        if (!shape) {
            throw new Error('Trying to create a UI() class without a selected shape');
        }
        this.refreshMenus(grid, shapesMap, fills.buildShapeSVG(shape));
        this.isEditorOnTop = false;
        this.isEnteringEditor = false;
        this.isExitingEditor = false;
        this.isZooming = false;
        this.fillEditor = new fill_editor_1.UIFillEditor(shape, fills);
        this.shapeEditor = new shape_editor_1.UIShapeEditor();
        this.exportEditor = new export_1.UIExportEditor(null);
        this.publishEditor = new publish_1.UIPublishEditor();
        this.toolsSubmenus = new tools_submenus_1.ToolsSubmenus();
        this.patterns = new Map();
        this.cursorHandler = new cursor_1.UICursorHandler();
    }
    toJSON() {
        return {
            a: this.at,
            t: this.title,
            sm: this.shapesMenu.toJSON(),
            fm: this.fillsMenu.toJSON(),
            tm: this.toolsMenu.toJSON(),
            et: this.isEditorOnTop,
            ent: this.isEnteringEditor,
            ext: this.isExitingEditor,
            z: this.isZooming,
            f: this.fillEditor.toJSON(),
            s: this.shapeEditor.toJSON(),
            tsm: this.toolsSubmenus.toJSON(),
            p: [...this.patterns].map(([lid, cpat]) => [
                lid,
                cpat.gridPattern.toJSON()
            ])
        };
    }
    static revive(o) {
        function uistateFromStr(s) {
            switch (s) {
            case 'ShapeEditor':
                return UIState.ShapeEditor;
            case 'FillEditor':
                return UIState.FillEditor;
            case 'Export':
                return UIState.Export;
            case 'Publish':
                return UIState.Publish;
            case 'PublishPreview':
                return UIState.PublishPreview;
            default:
                return UIState.Project;
            }
        }
        const result = new UI();
        result.mainMenu = new menu_1.Menu(defaults_1.DefaultMainMenu);
        result.featuresMenu = new menu_1.Menu(defaults_1.DefaultFeaturesMenu);
        result.at = uistateFromStr(o.a);
        result.title = o.t;
        result.shapesMenu = menu_1.Menu.revive(o.sm);
        result.fillsMenu = menu_1.Menu.revive(o.fm);
        result.toolsMenu = menu_1.Menu.revive(o.tm);
        result.isEditorOnTop = o.et;
        result.isEnteringEditor = o.ent;
        result.isExitingEditor = o.ext;
        result.isZooming = o.z;
        result.fillEditor = fill_editor_1.UIFillEditor.revive(o.f);
        result.shapeEditor = shape_editor_1.UIShapeEditor.revive(o.s);
        if (o.tsm) {
            result.toolsSubmenus = tools_submenus_1.ToolsSubmenus.revive(o.tsm);
        } else {
            result.toolsSubmenus = new tools_submenus_1.ToolsSubmenus();
        }
        if (o.p) {
            result.patterns = new Map(o.p.map(([lid, pat]) => [
                lid,
                new clip_pattern_1.ClipPattern(tile_pattern_1.TilePattern.revive(pat))
            ]));
        }
        result.cursorHandler = new cursor_1.UICursorHandler();
        return result;
    }
    get currentTool() {
        return this.toolsMenu.selected;
    }
    selectTool(id) {
        if (id === defaults_1.ToolsMenuId.Zoom) {
            this.isZooming = false;
        }
        this.toolsMenu.selected = id;
        this.cursorFromTool();
        return this;
    }
    currentToolMouseIcon() {
        return cursor_1.UICursorHandler.toolIcon(this.toolsMenu.selected);
    }
    cursorFromTool() {
        switch (this.toolsMenu.selected) {
        case defaults_1.ToolsMenuId.Delete:
            this.cursorHandler.cursor = cursor_1.UICursor.Delete;
            break;
        case defaults_1.ToolsMenuId.Move:
            this.cursorHandler.cursor = cursor_1.UICursor.Move;
            break;
        case defaults_1.ToolsMenuId.Zoom:
            this.cursorHandler.cursor = cursor_1.UICursor.Zoom;
            break;
        default:
            this.cursorHandler.cursor = cursor_1.UICursor.Paint;
        }
    }
    refreshMenus(_grid, _shapesMap, svgs) {
        const shapeIds = [..._grid.shapes.keys()];
        const pathDs = _shapesMap.svgShapeStrings(shapeIds);
        this.refreshShapesMenu(_grid, shapeIds, pathDs);
        const selectedShape = _shapesMap.getShapeById(_grid.selectedShape);
        if (selectedShape) {
            this.refreshFillsMenu(selectedShape, _grid.selectedRot, svgs);
        } else {
            throw new Error('Cannot find the layer selected shape in the shape map');
        }
    }
    refreshShapesMenu(_grid, shapes, shapeStrings) {
        if (!this.shapesMenu) {
            this.shapesMenu = new menu_1.Menu(new Map());
        } else {
            this.shapesMenu.entries.clear();
        }
        for (let i = 0; i < shapes.length; i++) {
            this.shapesMenu.entries.set(shapes[i], new menu_1.MenuEntry(`shape-${ shapes[i] }`, null, null, shapeStrings[i], undefined, _grid.getShapeRotation(shapes[i])));
        }
        this.shapesMenu.selected = _grid.selectedShape;
        return this;
    }
    refreshFillsMenu(shape, rot, svgs) {
        if (!this.fillsMenu) {
            this.fillsMenu = new menu_1.Menu(new Map());
        } else {
            this.fillsMenu.entries.clear();
        }
        const empty = [];
        for (const [fillSetId, svg] of svgs.entries()) {
            this.fillsMenu.entries.set(fillSetId, new menu_1.MenuEntry(`fill-${ fillSetId }`, null, null, empty, svg, rot));
        }
        this.fillsMenu.selected = shape.selectedFillSet;
    }
    updateSelectedFill(svg, fillString) {
        const menuEntry = this.fillsMenu.entries.get(this.fillsMenu.selected);
        if (menuEntry) {
            menuEntry.svg = svg;
            this.fillEditor.updateSelected(fillString);
        }
        return this;
    }
    stateFromFeature(feature) {
        switch (feature) {
        case defaults_1.FeaturesMenuId.Export:
            return UIState.Export;
        case defaults_1.FeaturesMenuId.Publish:
            return UIState.Publish;
        case defaults_1.FeaturesMenuId.Product:
            return UIState.Product;
        default:
            return UIState.Project;
        }
    }
    initExport(dim) {
        this.exportEditor = new export_1.UIExportEditor(dim);
        return this;
    }
    initPublish() {
        this.publishEditor = new publish_1.UIPublishEditor();
        return this;
    }
    enterLicense(title, desc) {
        this.publishEditor.at = publish_1.PublishAt.License;
        this.publishEditor.title = title;
        this.publishEditor.desc = desc;
        return this;
    }
    setLicense(license) {
        this.publishEditor.license = license;
        return this;
    }
    exitLicense() {
        this.publishEditor.at = publish_1.PublishAt.Metadata;
        return this;
    }
    initFeature(feature, dim, shapeOutline, shapeRes) {
        switch (feature) {
        case defaults_1.FeaturesMenuId.Export:
            return this.initExport(dim);
        case defaults_1.FeaturesMenuId.Publish:
            return this.initPublish();
        default:
            return this;
        }
    }
    enterFeature(feature, grid, shapeOutline, shapeRes) {
        this.at = this.stateFromFeature(feature);
        const dim = grid.dimensions();
        this.cursorHandler.cursor = cursor_1.UICursor.None;
        this.initFeature(feature, dim, shapeOutline, shapeRes);
        return this;
    }
    editShape(p, fills = [], isExistingShape = false) {
        this.at = UIState.ShapeEditor;
        this.shapeEditor.fromPath(p, fills, isExistingShape);
        return this;
    }
    closeNewShape() {
        this.at = UIState.Project;
        return this;
    }
    enterTemplateSelector() {
        this.shapeEditor.editorMode = shape_editor_1.UIShapeEditorMode.TemplateSelector;
        return this;
    }
    exitTemplateSelector() {
        this.shapeEditor.editorMode = shape_editor_1.UIShapeEditorMode.Shape;
        return this;
    }
    newFill(shape, svgs, fills) {
        this.at = UIState.FillEditor;
        this.refreshFillsMenu(shape, 0, svgs);
        this.fillEditor = new fill_editor_1.UIFillEditor(shape, fills);
        return this;
    }
    closeNewFill(shape, rot, svgs) {
        this.at = UIState.Project;
        this.refreshFillsMenu(shape, rot, svgs);
        return this;
    }
    closeFeatures() {
        this.at = UIState.Project;
        this.cursorFromTool();
        return this;
    }
    enteringEditor() {
        this.isEnteringEditor = true;
        this.isExitingEditor = false;
        this.cursorHandler.cursor = cursor_1.UICursor.Paint;
        return this;
    }
    exitingEditor() {
        this.isExitingEditor = true;
        this.isEnteringEditor = false;
        this.cursorFromTool();
        return this;
    }
    editorStopAnim() {
        this.isExitingEditor = false;
        this.isEnteringEditor = false;
        return this;
    }
    editorOnTop() {
        this.isEditorOnTop = true;
        return this;
    }
    editorOnBottom() {
        this.isEditorOnTop = false;
        return this;
    }
    fillEditorFromShapeEditor(fillIds, fillObj) {
        this.fillEditor.colorCode = fillObj;
        this.fillEditor.templatePath = this.shapeEditor.templateBase;
        this.fillEditor.templateRes = this.shapeEditor.templateRes;
        this.fillEditor.primaryActionTitle = 'Done';
        this.fillEditor.buildPaths(this.shapeEditor.shapesD, fillIds, this.shapeEditor.fills);
        this.fillEditor.selected = fillIds[this.shapeEditor.selectedShape];
        this.shapeEditor.editorMode = shape_editor_1.UIShapeEditorMode.Fill;
        return this;
    }
    shapeFillDone() {
        this.shapeEditor.editorMode = shape_editor_1.UIShapeEditorMode.Shape;
        return this;
    }
}
exports.UI = UI;
}
// default/data/state/ui/clip_pattern.js
$fsx.f[21] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var PatternHit;
(function (PatternHit) {
    PatternHit['Inside'] = 'Inside';
    PatternHit['Outside'] = 'Outside';
    PatternHit['StartCircle'] = 'StartCircle';
    PatternHit['EndCircle'] = 'EndCircle';
}(PatternHit = exports.PatternHit || (exports.PatternHit = {})));
class ClipPattern {
    constructor(tp) {
        this.updateFromViewport = v => {
            this.screenStartX = v.screenX(this.gridPattern.startX);
            this.screenStartY = v.screenY(this.gridPattern.startY);
            this.screenEndX = v.screenX(this.gridPattern.endX);
            this.screenEndY = v.screenY(this.gridPattern.endY);
            this.circleRadius = v.unitSize / 8;
            return this;
        };
        this.isInside = (screenX, screenY) => {
            return screenX <= this.screenEndX && screenX >= this.screenStartX && screenY <= this.screenEndY && screenY >= this.screenStartY;
        };
        this.isInStartCircle = (screenX, screenY) => {
            return Math.hypot(this.screenStartX - screenX, this.screenStartY - screenY) <= 2 * this.circleRadius;
        };
        this.isInEndCircle = (screenX, screenY) => {
            return Math.hypot(this.screenEndX - screenX, this.screenEndY - screenY) <= 2 * this.circleRadius;
        };
        this.gridPattern = tp;
        this.screenStartX = -1;
        this.screenStartY = -1;
        this.screenEndX = -1;
        this.screenEndY = -1;
        this.circleRadius = 8;
    }
    hit(x, y) {
        if (this.isInEndCircle(x, y)) {
            return PatternHit.EndCircle;
        } else if (this.isInStartCircle(x, y)) {
            return PatternHit.StartCircle;
        } else if (!this.isInside(x, y)) {
            return PatternHit.Outside;
        }
        return PatternHit.Inside;
    }
}
exports.ClipPattern = ClipPattern;
}
// default/data/state/ui/cursor.js
$fsx.f[22] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const cursor_eraser_svg_1 = $fsx.r(23);
const cursor_move_svg_1 = $fsx.r(24);
const cursor_pencil_svg_1 = $fsx.r(25);
const cursor_rotate_svg_1 = $fsx.r(26);
const cursor_select_svg_1 = $fsx.r(27);
const cursor_zoom_svg_1 = $fsx.r(28);
const defaults_1 = $fsx.r(29);
var UICursor;
(function (UICursor) {
    UICursor['None'] = 'None';
    UICursor['Paint'] = 'Paint';
    UICursor['Delete'] = 'Delete';
    UICursor['Zoom'] = 'Zoom';
    UICursor['Move'] = 'Move';
    UICursor['Rotate'] = 'Rotate';
    UICursor['Select'] = 'Select';
}(UICursor = exports.UICursor || (exports.UICursor = {})));
class UICursorHandler {
    constructor() {
        this.cursor = UICursor.Paint;
    }
    iconURL() {
        switch (this.cursor) {
        case UICursor.Paint:
            return `url(${ cursor_pencil_svg_1.default }), auto`;
        case UICursor.Delete:
            return `url(${ cursor_eraser_svg_1.default }), auto`;
        case UICursor.Move:
            return `url(${ cursor_move_svg_1.default }), auto`;
        case UICursor.Zoom:
            return `url(${ cursor_zoom_svg_1.default }), auto`;
        case UICursor.Rotate:
            return `url(${ cursor_rotate_svg_1.default }), auto`;
        case UICursor.Select:
            return `url(${ cursor_select_svg_1.default }), auto`;
        default:
            return 'auto';
        }
    }
    static toolIcon(t) {
        switch (t) {
        case defaults_1.ToolsMenuId.Grid:
        case defaults_1.ToolsMenuId.Paint:
            return UICursor.Paint;
        case defaults_1.ToolsMenuId.Delete:
            return UICursor.Delete;
        case defaults_1.ToolsMenuId.Move:
            return UICursor.Move;
        case defaults_1.ToolsMenuId.Zoom:
            return UICursor.Zoom;
        default:
            return UICursor.None;
        }
    }
}
exports.UICursorHandler = UICursorHandler;
}
// default/assets/icons/cursor-eraser.svg
$fsx.f[23] = function(module,exports){
module.exports.default = '/assets/df29d7ac-cursor-eraser.svg';
}
// default/assets/icons/cursor-move.svg
$fsx.f[24] = function(module,exports){
module.exports.default = '/assets/467fa4b-cursor-move.svg';
}
// default/assets/icons/cursor-pencil.svg
$fsx.f[25] = function(module,exports){
module.exports.default = '/assets/c42b83ce-cursor-pencil.svg';
}
// default/assets/icons/cursor-rotate.svg
$fsx.f[26] = function(module,exports){
module.exports.default = '/assets/f5d6c17e-cursor-rotate.svg';
}
// default/assets/icons/cursor-select.svg
$fsx.f[27] = function(module,exports){
module.exports.default = '/assets/7c414d13-cursor-select.svg';
}
// default/assets/icons/cursor-zoom.svg
$fsx.f[28] = function(module,exports){
module.exports.default = '/assets/cb44f109-cursor-zoom.svg';
}
// default/data/state/ui/defaults.js
$fsx.f[29] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const picker_hering_svg_1 = $fsx.r(30);
const picker_lightness_svg_1 = $fsx.r(31);
const picker_saturation_svg_1 = $fsx.r(32);
const tools_eraser_svg_1 = $fsx.r(33);
const tools_grid_svg_1 = $fsx.r(34);
const tools_move_svg_1 = $fsx.r(35);
const tools_pencil_svg_1 = $fsx.r(36);
const tools_undo_svg_1 = $fsx.r(37);
const tools_zoom_svg_1 = $fsx.r(38);
const menu_1 = $fsx.r(39);
var FeaturesMenuId;
(function (FeaturesMenuId) {
    FeaturesMenuId['Export'] = 'export';
    FeaturesMenuId['Publish'] = 'publish';
    FeaturesMenuId['Product'] = 'product';
}(FeaturesMenuId = exports.FeaturesMenuId || (exports.FeaturesMenuId = {})));
exports.DefaultFeaturesMenu = new Map([
    [
        FeaturesMenuId.Export,
        new menu_1.MenuEntry('Export')
    ],
    [
        FeaturesMenuId.Publish,
        new menu_1.MenuEntry('Publish')
    ]
]);
var MainMenuId;
(function (MainMenuId) {
    MainMenuId['Profile'] = 'profile';
    MainMenuId['About'] = 'about';
    MainMenuId['Collective'] = 'collective';
    MainMenuId['Pricing'] = 'pricing';
}(MainMenuId = exports.MainMenuId || (exports.MainMenuId = {})));
exports.DefaultMainMenu = new Map([
    [
        MainMenuId.Collective,
        new menu_1.MenuEntry('Examples')
    ],
    [
        MainMenuId.Pricing,
        new menu_1.MenuEntry('Pricing')
    ],
    [
        MainMenuId.About,
        new menu_1.MenuEntry('About')
    ],
    [
        MainMenuId.Profile,
        new menu_1.MenuEntry('Projects')
    ]
]);
var ToolsMenuId;
(function (ToolsMenuId) {
    ToolsMenuId[ToolsMenuId['Artists'] = 100] = 'Artists';
    ToolsMenuId[ToolsMenuId['Undo'] = 101] = 'Undo';
    ToolsMenuId[ToolsMenuId['Zoom'] = 102] = 'Zoom';
    ToolsMenuId[ToolsMenuId['Move'] = 103] = 'Move';
    ToolsMenuId[ToolsMenuId['Delete'] = 104] = 'Delete';
    ToolsMenuId[ToolsMenuId['Paint'] = 105] = 'Paint';
    ToolsMenuId[ToolsMenuId['Grid'] = 106] = 'Grid';
}(ToolsMenuId = exports.ToolsMenuId || (exports.ToolsMenuId = {})));
exports.DefaultToolsMenu = new Map([
    [
        ToolsMenuId.Undo,
        new menu_1.MenuEntry('Undo', tools_undo_svg_1.default, 'Undo')
    ],
    [
        ToolsMenuId.Zoom,
        new menu_1.MenuEntry('Zoom', tools_zoom_svg_1.default, 'Zoom')
    ],
    [
        ToolsMenuId.Move,
        new menu_1.MenuEntry('Move', tools_move_svg_1.default, 'Pan/Move Grid')
    ],
    [
        ToolsMenuId.Grid,
        new menu_1.MenuEntry('Grid', tools_grid_svg_1.default, 'Pattern')
    ],
    [
        ToolsMenuId.Delete,
        new menu_1.MenuEntry('Delete', tools_eraser_svg_1.default, 'Eraser')
    ],
    [
        ToolsMenuId.Paint,
        new menu_1.MenuEntry('Paint', tools_pencil_svg_1.default, 'Draw')
    ]
]);
var UIFillEditorColorMode;
(function (UIFillEditorColorMode) {
    UIFillEditorColorMode[UIFillEditorColorMode['Saturation'] = 1] = 'Saturation';
    UIFillEditorColorMode[UIFillEditorColorMode['Hering'] = 2] = 'Hering';
    UIFillEditorColorMode[UIFillEditorColorMode['Lightness'] = 3] = 'Lightness';
    UIFillEditorColorMode[UIFillEditorColorMode['Code'] = 4] = 'Code';
}(UIFillEditorColorMode = exports.UIFillEditorColorMode || (exports.UIFillEditorColorMode = {})));
exports.DefaultColorMenu = new Map([
    [
        UIFillEditorColorMode.Saturation,
        new menu_1.MenuEntry('Saturation', picker_saturation_svg_1.default)
    ],
    [
        UIFillEditorColorMode.Hering,
        new menu_1.MenuEntry('Color', picker_hering_svg_1.default)
    ],
    [
        UIFillEditorColorMode.Lightness,
        new menu_1.MenuEntry('Light', picker_lightness_svg_1.default)
    ]
]);
}
// default/assets/icons/picker-hering.svg
$fsx.f[30] = function(module,exports){
module.exports.default = '/assets/e25c3366-picker-hering.svg';
}
// default/assets/icons/picker-lightness.svg
$fsx.f[31] = function(module,exports){
module.exports.default = '/assets/e78de8cd-picker-lightness.svg';
}
// default/assets/icons/picker-saturation.svg
$fsx.f[32] = function(module,exports){
module.exports.default = '/assets/b8223c50-picker-saturation.svg';
}
// default/assets/icons/tools-eraser.svg
$fsx.f[33] = function(module,exports){
module.exports.default = '/assets/eaa1d676-tools-eraser.svg';
}
// default/assets/icons/tools-grid.svg
$fsx.f[34] = function(module,exports){
module.exports.default = '/assets/aa6689dc-tools-grid.svg';
}
// default/assets/icons/tools-move.svg
$fsx.f[35] = function(module,exports){
module.exports.default = '/assets/de7ba4cb-tools-move.svg';
}
// default/assets/icons/tools-pencil.svg
$fsx.f[36] = function(module,exports){
module.exports.default = '/assets/6753d6e2-tools-pencil.svg';
}
// default/assets/icons/tools-undo.svg
$fsx.f[37] = function(module,exports){
module.exports.default = '/assets/611e92b0-tools-undo.svg';
}
// default/assets/icons/tools-zoom.svg
$fsx.f[38] = function(module,exports){
module.exports.default = '/assets/7b104df4-tools-zoom.svg';
}
// default/data/state/ui/menu.js
$fsx.f[39] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class MenuEntry {
    constructor(label, iconUrl = null, tooltip = null, svgPaths = [], svg = '', rotation = 0) {
        this.label = label;
        this.iconUrl = iconUrl || '';
        this.tooltip = tooltip;
        this.svgPaths = svgPaths;
        this.svg = svg;
        this.rotation = rotation;
    }
    toJSON() {
        return {
            l: this.label,
            i: this.iconUrl,
            t: this.tooltip,
            sp: this.svgPaths.slice(0),
            s: this.svg,
            r: this.rotation
        };
    }
    static revive(o) {
        return new MenuEntry(o.l, o.i, o.t, o.sp, o.s, o.r);
    }
}
exports.MenuEntry = MenuEntry;
class Menu {
    constructor(entries) {
        this.entries = entries;
        this.toggled = [];
    }
    toJSON() {
        return {
            e: [...this.entries.entries()].map(e => [
                e[0],
                e[1].toJSON()
            ]),
            s: this.selected,
            t: this.toggled
        };
    }
    static revive(o) {
        const result = new Menu(new Map(o.e.map(e => [
            e[0],
            MenuEntry.revive(e[1])
        ])));
        result.selected = o.s;
        result.toggled = o.t;
        return result;
    }
    iter() {
        return this.entries.entries();
    }
    map(f, filter) {
        const result = [];
        if (filter) {
            for (const [k, e] of this.entries.entries()) {
                if (filter(k, e, k === this.selected)) {
                    result.push(f(k, e, k === this.selected));
                }
            }
        } else {
            for (const [k, e] of this.entries.entries()) {
                result.push(f(k, e, k === this.selected, this.toggled.indexOf(k) > -1));
            }
        }
        return result;
    }
}
exports.Menu = Menu;
}
// default/data/state/ui/export.js
$fsx.f[40] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var ExportAt;
(function (ExportAt) {
    ExportAt[ExportAt['Image'] = 1] = 'Image';
    ExportAt[ExportAt['Video'] = 2] = 'Video';
    ExportAt[ExportAt['Preparing'] = 3] = 'Preparing';
    ExportAt[ExportAt['Done'] = 4] = 'Done';
    ExportAt[ExportAt['Error'] = 5] = 'Error';
}(ExportAt = exports.ExportAt || (exports.ExportAt = {})));
var ExportEditorFormat;
(function (ExportEditorFormat) {
    ExportEditorFormat[ExportEditorFormat['SVG'] = 1] = 'SVG';
    ExportEditorFormat[ExportEditorFormat['PNG'] = 2] = 'PNG';
    ExportEditorFormat[ExportEditorFormat['GIF'] = 3] = 'GIF';
    ExportEditorFormat[ExportEditorFormat['MP4'] = 4] = 'MP4';
}(ExportEditorFormat = exports.ExportEditorFormat || (exports.ExportEditorFormat = {})));
var ExportEditorMode;
(function (ExportEditorMode) {
    ExportEditorMode[ExportEditorMode['All'] = 1] = 'All';
    ExportEditorMode[ExportEditorMode['Shapes'] = 2] = 'Shapes';
}(ExportEditorMode = exports.ExportEditorMode || (exports.ExportEditorMode = {})));
var ExportSize;
(function (ExportSize) {
    ExportSize[ExportSize['FullHD'] = 1080] = 'FullHD';
    ExportSize[ExportSize['HDReady'] = 720] = 'HDReady';
    ExportSize[ExportSize['UHD'] = 3840] = 'UHD';
}(ExportSize = exports.ExportSize || (exports.ExportSize = {})));
class UIExportEditor {
    constructor(dim) {
        this.at = ExportAt.Image;
        this.primaryActionTitle = 'Export';
        this.size = ExportSize.FullHD;
        this.format = ExportEditorFormat.SVG;
        this.mode = ExportEditorMode.All;
        this.dim = dim;
        this.needsPayment = true;
        this.isLoading = true;
        this.patternSize = 1;
        this.fname = null;
    }
    setPreview(art) {
        this.imgPreview = art.svg;
        this.imgViewbox = art.viewbox;
    }
    calcres() {
        let idealW;
        let idealH;
        switch (this.size) {
        case ExportSize.FullHD:
            idealW = 1920;
            idealH = 1080;
            break;
        case ExportSize.HDReady:
            idealW = 1280;
            idealH = 720;
            break;
        case ExportSize.UHD:
            idealW = 3840;
            idealH = 2160;
            break;
        }
        if (!this.dim) {
            return {
                width: idealW,
                height: idealH,
                offsetX: 0,
                offsetY: 0
            };
        } else {
            const w = idealW;
            const h = this.dim.height * w / this.dim.width;
            return {
                width: w,
                height: h,
                offsetX: 0,
                offsetY: 0
            };
        }
    }
}
exports.UIExportEditor = UIExportEditor;
}
// default/data/state/ui/fill_editor.js
$fsx.f[41] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const rgb_1 = $fsx.r(9);
const wheel_1 = $fsx.r(8);
const defaults_1 = $fsx.r(29);
const fill_path_1 = $fsx.r(42);
const menu_1 = $fsx.r(39);
var UIFillEditorMode;
(function (UIFillEditorMode) {
    UIFillEditorMode[UIFillEditorMode['Color'] = 1] = 'Color';
    UIFillEditorMode[UIFillEditorMode['Code'] = 2] = 'Code';
}(UIFillEditorMode = exports.UIFillEditorMode || (exports.UIFillEditorMode = {})));
class UIFillEditor {
    constructor(shape, fills) {
        if (!shape || !fills) {
            return;
        }
        this.paths = new Map();
        for (const [d, fillId] of shape.getSelectedFills()) {
            this.paths.set(fillId, new fill_path_1.UIFillPath(d, fills.getFill(fillId)));
        }
        this.selected = this.paths.keys().next().value;
        this.editorMode = UIFillEditorMode.Color;
        this.primaryActionTitle = 'Create Color';
        this.colorMenu = new menu_1.Menu(defaults_1.DefaultColorMenu);
        this.colorMenu.selected = defaults_1.UIFillEditorColorMode.Hering;
        this.templatePath = shape.editor.template.baseString;
        this.templateRes = shape.resolution;
        this.mruColors = fills.colors.mruColors(8).slice(1);
        const c = fills.getFillObj(this.selected);
        console.log('FILL EDITOR, GOT FILL OBJ', this.selected, c);
        if (!c) {
            this.colorCode = new rgb_1.RGBColor(128, 128, 128, 1);
        } else {
            this.colorCode = c;
        }
    }
    get fillPaths() {
        const result = new Array(3);
        const fills = [];
        const paths = [];
        for (const [fid, fp] of this.paths.entries()) {
            if (fid === this.selected) {
                result[2] = paths.length;
            }
            fills.push(fp.fill);
            paths.push(fp.d);
        }
        result[0] = fills;
        result[1] = paths;
        return result;
    }
    fidByPos(pos) {
        let i = 0;
        for (const fid of this.paths.keys()) {
            if (pos === i) {
                return fid;
            }
            i++;
        }
        return null;
    }
    toJSON() {
        return {
            m: this.editorMode,
            pt: this.primaryActionTitle,
            st: this.secundaryActionTitle,
            menu: this.colorMenu.toJSON(),
            tp: this.templatePath,
            tres: this.templateRes,
            s: this.selected,
            mru: this.mruColors.slice(0),
            p: [...this.paths.entries()].map(e => [
                e[0],
                e[1].toJSON()
            ])
        };
    }
    static revive(o) {
        const result = new UIFillEditor();
        result.editorMode = o.m;
        result.primaryActionTitle = o.pt;
        result.secundaryActionTitle = o.st;
        result.colorMenu = menu_1.Menu.revive(o.menu);
        result.templatePath = o.tp;
        result.templateRes = o.tres;
        result.selected = o.s;
        result.mruColors = o.mru;
        result.paths = new Map(o.p.map(e => [
            e[0],
            fill_path_1.UIFillPath.revive(e[1])
        ]));
        return result;
    }
    buildPaths(paths, fillIds, fills) {
        this.paths = new Map();
        for (let i = 0; i < paths.length; i++) {
            this.paths.set(fillIds[i], new fill_path_1.UIFillPath(paths[i], fills[i]));
        }
    }
    selectedFillString() {
        const uifill = this.paths.get(this.selected);
        if (!uifill) {
            throw new Error(`selectedFillString(): selected fill id ${ this.selected } not found`);
        }
        return uifill.fill;
    }
    updateSelected(fillValue) {
        const uifill = this.paths.get(this.selected);
        if (!uifill) {
            throw new Error(`updateSelected(${ fillValue }): selected fill id ${ this.selected } not found`);
        }
        uifill.fill = fillValue;
        return this;
    }
    colorMenuMode(mode) {
        this.colorMenu.selected = mode;
        return this;
    }
    static toColorEditorMode(mode) {
        switch (mode) {
        case defaults_1.UIFillEditorColorMode.Hering:
            return wheel_1.WheelMode.WHEEL_HERING_MODE;
        case defaults_1.UIFillEditorColorMode.Lightness:
            return wheel_1.WheelMode.WHEEL_BRIGHTNESS_MODE;
        case defaults_1.UIFillEditorColorMode.Saturation:
            return wheel_1.WheelMode.WHEEL_SATURATION_MODE;
        }
        throw new Error(`Unknown Editor Color Mode ${ mode }`);
    }
}
exports.UIFillEditor = UIFillEditor;
}
// default/data/state/ui/fill_path.js
$fsx.f[42] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class UIFillPath {
    constructor(d, fill) {
        this.d = d;
        this.fill = fill;
    }
    toJSON() {
        return {
            d: this.d,
            f: this.fill
        };
    }
    static revive(o) {
        return new UIFillPath(o.d, o.f);
    }
}
exports.UIFillPath = UIFillPath;
}
// default/data/state/ui/publish.js
$fsx.f[43] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var PublishState;
(function (PublishState) {
    PublishState[PublishState['Success'] = 1] = 'Success';
    PublishState[PublishState['Loading'] = 2] = 'Loading';
    PublishState[PublishState['Error'] = 3] = 'Error';
    PublishState[PublishState['Normal'] = 4] = 'Normal';
}(PublishState = exports.PublishState || (exports.PublishState = {})));
var PublishAt;
(function (PublishAt) {
    PublishAt[PublishAt['Metadata'] = 1] = 'Metadata';
    PublishAt[PublishAt['License'] = 2] = 'License';
}(PublishAt = exports.PublishAt || (exports.PublishAt = {})));
class UIPublishEditor {
    constructor() {
        this.license = 'CC0';
        this.at = PublishAt.Metadata;
        this.primaryActionTitle = 'Publish';
        this.title = null;
        this.desc = null;
        this.errorMsg = '';
        this.state = PublishState.Normal;
    }
}
exports.UIPublishEditor = UIPublishEditor;
}
// default/data/state/ui/shape_editor.js
$fsx.f[44] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const set_1 = $fsx.r(5);
const vector_1 = $fsx.r(4);
var UIShapeEditorMode;
(function (UIShapeEditorMode) {
    UIShapeEditorMode[UIShapeEditorMode['Shape'] = 1] = 'Shape';
    UIShapeEditorMode[UIShapeEditorMode['Fill'] = 2] = 'Fill';
    UIShapeEditorMode[UIShapeEditorMode['TemplateSelector'] = 3] = 'TemplateSelector';
}(UIShapeEditorMode = exports.UIShapeEditorMode || (exports.UIShapeEditorMode = {})));
class UIShapeEditor {
    constructor() {
        this.editorMode = UIShapeEditorMode.Shape;
        this.primaryActionTitle = 'Create Shape';
        this.clickablePts = new set_1.VectorSet();
        this.selectedPts = new set_1.VectorSet();
        this.allPts = [];
        this.templatePath = '';
        this.templateBase = '';
        this.currentShape = '';
        this.currentEdge = null;
        this.otherEdge = null;
        this.fills = [];
        this.shapesD = [];
        this.selectedShape = -1;
        this.currentShapeActions = [];
        this.selectedAction = 0;
        this.ambiguities = [];
    }
    toJSON() {
        return {
            m: this.editorMode,
            act: this.primaryActionTitle,
            cpts: this.clickablePts.toJSON(),
            spts: this.selectedPts.toJSON(),
            apts: this.allPts.map(e => e.toJSON()),
            ce: this.currentEdge ? this.currentEdge.toJSON() : null,
            oe: this.otherEdge ? this.otherEdge.toJSON() : null,
            tp: this.templatePath,
            tb: this.templateBase,
            tr: this.templateRes,
            trot: this.templateRot,
            tcs: this.currentShape,
            ts: this.shapesD.slice(0),
            f: this.fills.slice(0),
            ss: this.selectedShape,
            csa: this.currentShapeActions.slice(0),
            sa: this.selectedAction,
            a: this.ambiguities.slice(0)
        };
    }
    static revive(o) {
        const result = new UIShapeEditor();
        result.editorMode = o.m;
        result.primaryActionTitle = o.act;
        result.clickablePts = set_1.VectorSet.revive(o.cpts, () => null);
        result.selectedPts = set_1.VectorSet.revive(o.spts, () => null);
        result.allPts = o.apts.map(vector_1.Vector2D.revive);
        result.currentEdge = o.ce ? vector_1.Vector2D.revive(o.ce) : null;
        result.otherEdge = o.oe ? vector_1.Vector2D.revive(o.oe) : null;
        result.templatePath = o.tp;
        result.templateBase = o.tb;
        result.templateRes = o.tr;
        result.templateRot = o.trot;
        result.currentShape = o.tcs;
        result.shapesD = o.ts;
        result.fills = o.f;
        result.selectedShape = o.ss;
        result.currentShapeActions = o.csa;
        result.selectedAction = o.sa;
        result.ambiguities = o.a;
        return result;
    }
    fromPath(p, fills, isExistingShape = false) {
        this.editorMode = UIShapeEditorMode.Shape;
        this.templatePath = p.template.pathString;
        this.templateBase = p.template.baseString;
        this.templateRes = p.template.resolution;
        this.templateRot = p.template.rotation;
        this.clickablePts = p.getReachable();
        this.selectedPts = p.getSelectedPts();
        this.allPts = p.template.points.toArray();
        const shapes = p.getVisibleShapes();
        const shapeIndex = p.curShapeIndex();
        this.currentShape = shapes[shapeIndex];
        this.currentEdge = p.currentEdge;
        this.otherEdge = p.otherEdge;
        this.shapesD = shapes.slice(0, shapes.length - 1);
        this.fills = fills || [];
        this.currentShapeActions = p.getShapeInstances();
        this.selectedAction = p.getSelectedInstance();
        this.selectedShape = -1;
        this.ambiguities = p.ambiguities;
        this.isExistingShape = isExistingShape;
        if (this.isExistingShape) {
            this.primaryActionTitle = 'Change Shape';
        } else {
            this.primaryActionTitle = 'Create Shape';
        }
    }
    unselectShape() {
        this.selectedShape = -1;
    }
    selectMostRecentShape() {
        this.selectedShape = this.shapesD.length - 1;
    }
    selectShape(shape) {
        this.selectedShape = this.shapesD.indexOf(shape);
    }
    updateFill(fill) {
        this.fills[this.selectedShape] = fill;
    }
}
exports.UIShapeEditor = UIShapeEditor;
}
// default/data/state/ui/tools_submenus.js
$fsx.f[45] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class ToolsSubmenus {
    constructor() {
        this.isGridPatternOn = false;
        this.isGridVisible = true;
    }
    toJSON() {
        return {
            p: this.isGridPatternOn,
            v: this.isGridVisible
        };
    }
    static revive(o) {
        const result = new ToolsSubmenus();
        result.isGridPatternOn = o.p;
        result.isGridVisible = o.v;
        return result;
    }
}
exports.ToolsSubmenus = ToolsSubmenus;
}
// default/data/state/shape_map.js
$fsx.f[46] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const defaults_1 = $fsx.r(17);
const grid_1 = $fsx.r(16);
const path_1 = $fsx.r(11);
const shape_1 = $fsx.r(15);
const template_1 = $fsx.r(12);
class ShapeMap {
    constructor(type = grid_1.GridType.Square, shapeId = 1, fillsForDefaultShape = [
        defaults_1.ColorDefaults.YELLOW,
        defaults_1.ColorDefaults.BLUE,
        defaults_1.ColorDefaults.GREEN
    ]) {
        this.templates = new Map();
        this.templates.set(grid_1.GridType.Square, [
            template_1.squareBasicTemplate(),
            template_1.squareDiagTemplate(),
            template_1.squareRoundTrisTemplate()
        ]);
        const t = this.templates.get(type);
        if (!t || t.length === 0) {
            throw new Error(`Cannot create ShapeMap(), unknown grid type ${ type }`);
        }
        const defaultTemplate = t[0];
        this._editor = new path_1.Path(defaultTemplate);
        this._editorType = type;
        this._editorTemplate = defaultTemplate;
        this.shapes = new Map();
        this.shapes.set(shapeId, shape_1.Shape.FullSquare(fillsForDefaultShape, defaultTemplate));
        this.created = shapeId;
    }
    toJSON() {
        return {
            s: [...this.shapes.entries()].map(sm => [
                sm[0],
                sm[1].toJSON()
            ]),
            c: this.created,
            t: [...this.templates.entries()].map(ts => [
                ts[0],
                ts[1].map(temp => temp.toJSON())
            ]),
            e: this._editor.toJSON(),
            ety: this._editorType,
            et: this._editorTemplate.toJSON()
        };
    }
    static revive(o) {
        const templates = new Map(o.t.map(smt => [
            smt[0],
            smt[1].map(template_1.Template.revive)
        ]));
        const shapes = new Map(o.s.map(sms => [
            sms[0],
            shape_1.Shape.revive(sms[1])
        ]));
        const result = new ShapeMap();
        result.shapes = shapes;
        result.created = o.c;
        result.templates = templates;
        result._editorType = o.ety;
        result._editorTemplate = template_1.Template.revive(o.et);
        result._editor = path_1.Path.revive(o.e, result._editorTemplate);
        return result;
    }
    availableTemplates() {
        const type = this._editorType;
        const templates = this.templates.get(type);
        if (!templates || templates.length === 0) {
            throw new Error('No templates available for the selected shape type');
        }
        return templates;
    }
    getRndShapeId(rndGen) {
        let shapeId = rndGen.pop();
        while (this.shapes.has(shapeId)) {
            shapeId = rndGen.pop();
        }
        return shapeId;
    }
    getAllShapeIds() {
        const result = [];
        for (const k of this.shapes.keys()) {
            result.push(k);
        }
        return result;
    }
    svgShapeStrings(shapeIds) {
        const result = [];
        for (let i = 0; i < shapeIds.length; i++) {
            const shape = this.shapes.get(shapeIds[i]);
            if (shape) {
                result.push(shape.svgPathStrings());
            }
        }
        return result;
    }
    getShapeById(shapeId) {
        return this.shapes.get(shapeId);
    }
    editShape(shapeId) {
        const shape = this.getShapeById(shapeId);
        if (shape) {
            this._editor = shape.updateEditorFills();
            this._editorTemplate = shape.editor.template;
        }
        return this.editor;
    }
    get editor() {
        return this._editor;
    }
    getShapeChanges(shapeId) {
        const s = this.getShapeById(shapeId);
        if (s) {
            return s.analyzeUpdatedShape(this._editor);
        } else {
            throw new Error(`ShapeId ${ shapeId } not found to analyze the updates needed`);
        }
    }
    getMaxNeededDups(shapeId) {
        const s = this.getShapeById(shapeId);
        if (s) {
            return s.maxFillIds();
        } else {
            throw new Error(`ShapeId ${ shapeId } not found to get the max fill ids that are needed`);
        }
    }
    getNeededDups(shapeId, cmds) {
        const s = this.getShapeById(shapeId);
        if (s) {
            return s.needsNewFillIds(cmds);
        } else {
            throw new Error(`ShapeId ${ shapeId } not found to get the duplicate fill ids that are needed`);
        }
    }
    saveUpdatedShape(type, shapeId, shapeFillId, dups, changes) {
        const shape = this.shapes.get(shapeId);
        if (!shape) {
            throw new Error(`Existing shape with id ${ shapeId } not found`);
        }
        shape.updateShape(this._editor, dups, changes);
        this._editor = new path_1.Path(this._editor.template);
        return shape;
    }
    saveNewShape(type, shapeId, shapeFillId) {
        this.created = shapeId;
        const result = new shape_1.Shape(type, this._editor, shapeFillId);
        this.shapes.set(shapeId, result);
        this._editor = new path_1.Path(this._editor.template);
        return result;
    }
    newShape(type) {
        const t = this.templates.get(type);
        if (!t || t.length === 0) {
            throw new Error(`Cannot find the default template for grid type ${ type }`);
        }
        const defaultTemplate = t[0];
        this._editor = new path_1.Path(defaultTemplate);
        return this._editor;
    }
    editorNewTemplate(tid) {
        const type = this._editorType;
        const t = this.templates.get(type);
        if (!t || t.length <= tid) {
            throw new Error(`Cannot find the desired template for grid type ${ type }`);
        }
        const template = t[tid];
        this._editor = new path_1.Path(template);
        this._editorTemplate = template;
        return this._editor;
    }
    editorCloseShape(pt, fillId) {
        this._editor.closeWithPt(pt, fillId);
        return this;
    }
    editorSelectPt(pt) {
        this._editor.selectPoint(pt);
        return this;
    }
    editorReverseTo(i) {
        this._editor.reverseTo(i);
        return this;
    }
    editorSolveAmbiguity(i) {
        this._editor.solveAmbiguity(i);
        return this;
    }
    editorDiscardCurrent() {
        this._editor.discardCurrent();
        return this;
    }
    editorDeleteShape(i) {
        this._editor.removeShape(i);
        return this;
    }
    editorChangeShape(i) {
        this._editor.changeShape(i);
        return this;
    }
    entries() {
        return this.shapes.entries();
    }
    setShapeFillId(shapeId, fillId) {
        const shape = this.shapes.get(shapeId);
        if (!shape) {
            throw new Error('Cannot find the shape');
        }
        shape.selectedFillId = fillId;
    }
    getShapeFillId(shapeId) {
        const shape = this.shapes.get(shapeId);
        if (!shape) {
            throw new Error('Cannot find the shape');
        }
        return shape.selectedFillId;
    }
}
exports.ShapeMap = ShapeMap;
}
// default/data/state/fill_map.js
$fsx.f[47] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const rgb_1 = $fsx.r(9);
const color_map_1 = $fsx.r(48);
var FillType;
(function (FillType) {
    FillType[FillType['Color'] = 1] = 'Color';
}(FillType = exports.FillType || (exports.FillType = {})));
class FillMap {
    constructor() {
        this.colors = new color_map_1.ColorMap();
        this.fills = new Map();
        this.fromColorMap(this.colors);
        this.created = null;
    }
    toJSON() {
        return {
            colors: this.colors.toJSON(),
            fills: [...this.fills.entries()],
            created: this.created
        };
    }
    static revive(r) {
        const result = new FillMap();
        result.colors = color_map_1.ColorMap.revive(r.colors);
        result.fills = new Map(r.fills);
        result.created = r.created;
        return result;
    }
    updateFromEditor(fillId) {
        switch (this.fills.get(fillId)) {
        case FillType.Color:
            this.colors.updateFromEditor(fillId);
            return this.colors.getString(fillId);
        default:
            throw new Error(`updateFromEditor(${ fillId }), Fill id not present or has an unknown type`);
        }
    }
    updateEditorWith(fillId) {
        switch (this.fills.get(fillId)) {
        case FillType.Color:
            this.colors.updateEditorWith(fillId);
            break;
        default:
            throw new Error(`updateEditorWith(${ fillId }), Fill id not present or has an unknown type`);
        }
        return this;
    }
    fromColorMap(colors) {
        for (const colorId of colors.keys()) {
            this.fills.set(colorId, FillType.Color);
        }
    }
    selectFillId(fillId) {
        const fillType = this.fills.get(fillId);
        if (fillType === undefined) {
            throw Error(`Fill id ${ fillId } not found when selecting`);
        }
        this.colors.editorSelectColorId(fillId);
    }
    getFill(fillId, useHex = false) {
        const obj = this.getFillObj(fillId);
        if (obj === undefined) {
            return color_map_1.ColorMap.NoColor;
        }
        if (useHex) {
            return rgb_1.RGBColor.toHex(obj);
        } else {
            return obj.toString();
        }
    }
    getShapeFills(fills) {
        const result = new Map();
        for (const [d, fid] of fills.entries()) {
            result.set(d, this.getFill(fid));
        }
        return result;
    }
    getFillObj(fillId) {
        return this.colors.get(fillId);
    }
    buildSVG(resolution, pathFills, width, height) {
        let dimensions = '';
        if (width && height) {
            dimensions = `width="${ width }" height="${ height }"`;
        }
        let paths = '';
        for (const [d, fillId] of pathFills) {
            paths += `<path d="${ d }" fill="${ this.getFill(fillId) }" />`;
        }
        return `<svg ${ dimensions } xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="basic" viewBox="0 0 ${ resolution } ${ resolution }">
				${ paths }
			</svg>`;
    }
    buildShapeSVG(shape) {
        const result = new Map();
        for (const [fillSetId, pathFills] of shape.entries()) {
            result.set(fillSetId, this.buildSVG(shape.resolution, pathFills));
        }
        return result;
    }
    buildSVGSymbol(res, shapeId, shapeFillSetId, pathFills) {
        let paths = '';
        for (const [d, fillId] of pathFills) {
            paths += `\t<path d="${ d }" fill="${ this.getFill(fillId, true) }" />\n`;
        }
        return `
			<symbol id="${ shapeId }-${ shapeFillSetId }" viewbox="0 0 ${ res } ${ res }">
			${ paths }
			</symbol>
			`;
    }
    buildShapeSymbol(shape, shapeId) {
        const result = [];
        for (const [fillSetId, pathFills] of shape.entries()) {
            result.push(this.buildSVGSymbol(shape.resolution, shapeId, fillSetId, pathFills));
        }
        return result;
    }
    rndFillIds(rnd, n) {
        const result = [];
        for (let i = 0; i < n; i++) {
            result.push(this.rndFillId(rnd));
        }
        return result;
    }
    rndFillId(rnd) {
        let fillId = rnd.pop();
        while (this.fills.has(fillId)) {
            fillId = rnd.pop();
        }
        return fillId;
    }
    duplicateMany(original, pool, ammount) {
        const result = new Map();
        let poolAt = 0;
        for (let i = 0; i < original.length; i++) {
            const fid = original[i];
            const dups = pool.slice(poolAt, ammount);
            this.duplicateSingle(fid, ammount, pool.slice(poolAt, ammount));
            result.set(fid, dups);
            poolAt += ammount;
        }
        return result;
    }
    duplicateSingle(fillId, n, pool) {
        const t = this.fills.get(fillId);
        if (!t) {
            throw new Error(`Cannot duplicate FillId ${ fillId }. Not Found.`);
        }
        let c;
        switch (t) {
        case FillType.Color:
            c = this.colors.get(fillId);
            break;
        default:
            return;
        }
        if (!c) {
            throw new Error(`Cannot find the FillId ${ fillId } content to duplicate.`);
        }
        for (let i = 0; i < n || i < pool.length; i++) {
            switch (t) {
            case FillType.Color:
                this.colors.registerColor(new rgb_1.RGBColor(c.r, c.g, c.b, c.a), pool[i]);
                break;
            default:
                continue;
            }
            this.fills.set(pool[i], t);
        }
    }
    newFills(fillIds, colors) {
        if (fillIds.length !== colors.length) {
            console.warn('FillMap.newFills(): Different length in fillIds and colors');
        }
        for (let f = 0; f < fillIds.length; f++) {
            const fillId = fillIds[f];
            this.fills.set(fillId, FillType.Color);
            this.colors.registerColor(colors[f], fillId);
        }
        this.created = fillIds;
        return this;
    }
    deleteFill(fillId) {
        const fillType = this.fills.get(fillId);
        if (!fillType) {
            throw new Error(`No fill type present when discarding fillId ${ fillId }`);
        }
        this.fills.delete(fillId);
        this.colors.colors.delete(fillId);
        return this;
    }
    discardNewFills() {
        if (this.created) {
            if (typeof this.created !== 'number') {
                for (let f = 0; f < this.created.length; f++) {
                    this.deleteFill(this.created[f]);
                }
            } else {
                this.deleteFill(this.created);
            }
        }
        return this;
    }
}
exports.FillMap = FillMap;
}
// default/data/state/color_map.js
$fsx.f[48] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const defaults_1 = $fsx.r(17);
const rgb_1 = $fsx.r(9);
const wheel_1 = $fsx.r(8);
class ColorMap {
    constructor() {
        this.colors = new Map(ColorMap.DefaultColors());
        this.editor = new wheel_1.Wheel();
        this.editorSelectedColorId = null;
        this.editorColorIds = [];
        this.editorOriginalColors = [];
        this.created = null;
    }
    toJSON() {
        return {
            created: this.created,
            editor: this.editor.toJSON(),
            editorSelectedColorId: this.editorSelectedColorId,
            editorColorIds: this.editorColorIds.slice(0),
            editorOriginalColors: this.editorOriginalColors.slice(0),
            colors: [...this.colors.entries()].map(([cid, c]) => [
                cid,
                c.toJSON()
            ])
        };
    }
    static revive(r) {
        const revived = new ColorMap();
        const colorsMap = r.colors.map(([id, c]) => [
            id,
            rgb_1.RGBColor.revive(c)
        ]);
        revived.colors = new Map(colorsMap);
        revived.created = r.created;
        const wheel = new wheel_1.Wheel();
        revived.editor = wheel.revive(r.editor);
        revived.editorSelectedColorId = r.editorSelectedColorId;
        revived.editorColorIds = r.editorColorIds;
        revived.editorOriginalColors = r.editorOriginalColors.map(rgb_1.RGBColor.revive);
        return revived;
    }
    get(colorId) {
        return this.colors.get(colorId);
    }
    getString(colorId) {
        const rgb = this.colors.get(colorId);
        if (rgb === undefined) {
            return ColorMap.NoColor;
        } else {
            return rgb_1.RGBColor.toHex(rgb);
        }
    }
    duplicateColor(colorId, newId) {
        const color = this.colors.get(colorId);
        if (!color) {
            throw new Error(`Cannot duplicate colorId ${ colorId }, not found`);
        }
        this.colors.set(newId, new rgb_1.RGBColor(color.r, color.g, color.b, color.a));
    }
    iter() {
        return this.colors.entries();
    }
    keys() {
        return this.colors.keys();
    }
    static DefaultColors() {
        return [
            [
                defaults_1.ColorDefaults.CURSOR,
                rgb_1.RGBColor.fromHex('#5e2ca5')
            ],
            [
                defaults_1.ColorDefaults.GRID,
                rgb_1.RGBColor.fromHex('#bebece')
            ],
            [
                defaults_1.ColorDefaults.YELLOW,
                new rgb_1.RGBColor(255, 215, 0)
            ],
            [
                defaults_1.ColorDefaults.BLUE,
                new rgb_1.RGBColor(53, 126, 221)
            ],
            [
                defaults_1.ColorDefaults.GREEN,
                rgb_1.RGBColor.fromHex('#19a974')
            ]
        ];
    }
    updateFromEditor(colorId) {
        this.colors.set(colorId, this.editor.toColor());
        return this;
    }
    updateEditorWith(colorId) {
        const color = this.colors.get(colorId);
        if (!color) {
            throw new Error(`Color id ${ colorId } not found in color map`);
        }
        this.editor.fromColor(color);
        return this;
    }
    getRndColorId(rndGen) {
        let colorId = rndGen.pop();
        while (this.colors.has(colorId)) {
            colorId = rndGen.pop();
        }
        return colorId;
    }
    registerColor(color, colorId) {
        this.colors.set(colorId, color);
        this.created = colorId;
        return this;
    }
    colorEditorExit() {
        this.editorColorIds = [];
        this.editorOriginalColors = [];
        return this;
    }
    deleteColors(colors) {
        for (let i = 0; i < colors.length; i++) {
            this.colors.delete(colors[i]);
        }
        this.created = null;
        return this;
    }
    _updateWheel() {
        if (!this.editorSelectedColorId) {
            return this;
        }
        this.colors.set(this.editorSelectedColorId, rgb_1.RGBColor.fromHex(this.editor.getSelectedColor()));
        return this;
    }
    moveWheel(ammount) {
        this.editor.moveWheel(ammount);
        return this._updateWheel();
    }
    editorColorPick(hex) {
        this.editor.fromHex(hex);
        return this._updateWheel();
    }
    editorSelectColorId(colorId) {
        this.editorSelectedColorId = colorId;
        const rgb = this.colors.get(colorId);
        if (!rgb) {
            throw new Error(`Cannot select color with id ${ colorId }`);
        }
        this.editor.fromColor(rgb);
        return this;
    }
    editorSelectColor(slice) {
        this.editor.selectSlice(slice);
        return this._updateWheel();
    }
    modeChange(mode) {
        this.editor.changeMode(mode);
        return this;
    }
    mruColors(limit) {
        return [...this.colors.values()].splice(-limit).map(rgb_1.RGBColor.toHex).reverse();
    }
}
ColorMap.NoColor = 'transparent';
exports.ColorMap = ColorMap;
}
// default/data/state/layer_map.js
$fsx.f[49] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const grid_1 = $fsx.r(16);
const layer_1 = $fsx.r(50);
const set_1 = $fsx.r(5);
class LayerMap {
    constructor(type, shapes, selectedShape, selectedShapeFill) {
        const rootId = 0;
        const rootGrid = new grid_1.Grid(type, shapes, selectedShape, selectedShapeFill, new set_1.VectorMap());
        this._layers = new Map([[
                rootId,
                new layer_1.Layer(0, 'Base', rootGrid)
            ]]);
        this.selected = rootId;
        this.list = [rootId];
    }
    toJSON() {
        return {
            l: [...this._layers.entries()].map(e => [
                e[0],
                e[1].toJSON(g => g.toJSON())
            ]),
            lst: this.list.slice(0),
            s: this.selected
        };
    }
    static revive(o) {
        const result = new LayerMap(1, [], 0, 0);
        result._layers = new Map(o.l.map(e => [
            e[0],
            layer_1.Layer.revive(e[1], grid_1.Grid.revive)
        ]));
        result.list = o.lst;
        result.selected = o.s;
        return result;
    }
    getSelected() {
        const l = this._layers.get(this.selected);
        if (!l) {
            throw new Error(`layer_map: Cannot get the selected layer ${ this.selected }: Not found`);
        }
        return l.data;
    }
    get selectedLayerId() {
        return this.selected;
    }
    selectShape(sid, sfid) {
        this.getSelected().selectShape(sid, sfid);
        return this;
    }
    get layers() {
        return this._layers;
    }
}
exports.LayerMap = LayerMap;
}
// default/data/state/layer/layer.js
$fsx.f[50] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var LayerType;
(function (LayerType) {
    LayerType[LayerType['Grid'] = 1] = 'Grid';
}(LayerType = exports.LayerType || (exports.LayerType = {})));
class Layer {
    constructor(id, name, data, type = LayerType.Grid) {
        this._id = id;
        this.name = name;
        this._data = data;
        this._type = type;
    }
    toJSON(dataToJSON) {
        return {
            id: this.id,
            name: this.name,
            t: this.type,
            d: dataToJSON(this.data)
        };
    }
    static revive(o, dataReviver) {
        return new Layer(o.id, o.name, dataReviver(o.d), o.t);
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
    get data() {
        return this._data;
    }
    static getData(l) {
        return l.data;
    }
}
exports.Layer = Layer;
}
// default/data/state/viewport.js
$fsx.f[51] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Viewport {
    constructor(unitSize = 64.3, x = 0, y = 0, maxSize = 256) {
        this._unitSize = unitSize;
        this._x = x;
        this._y = y;
        this.lastSize = unitSize;
        this.maxSize = maxSize;
        this.minSize = 16;
    }
    toJSON() {
        return {
            l: this.lastSize,
            u: this.unitSize,
            x: this._x,
            y: this._y
        };
    }
    static revive(o) {
        const result = new Viewport(o.u, o.x, o.y);
        result.lastSize = o.l;
        return result;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get unitSize() {
        return this._unitSize;
    }
    get zoomMiddle() {
        return (this.lastSize - this.minSize) / (this.maxSize - this.minSize);
    }
    get zoom() {
        return (this._unitSize - this.minSize) / (this.maxSize - this.minSize);
    }
    setLastSize() {
        this.lastSize = this._unitSize;
    }
    changeZoom(px, py, ammount, cx, cy, ovx, ovy) {
        const z = this._unitSize + ammount;
        const su = this.minSize + this.zoomMiddle * (this.maxSize - this.minSize);
        const npx = px / su * z;
        const npy = py / su * z;
        this._x = ovx + npx - px;
        this._y = ovy + npy - py;
        this._unitSize = Math.round(Math.min(Math.max(this.minSize, z), this.maxSize));
    }
    move(deltaX, deltaY) {
        this._x -= deltaX;
        this._y -= deltaY;
    }
    squareLayerX() {
        const u = this.unitSize;
        const viewx = this._x;
        return Math.floor(viewx / u);
    }
    squareLayerY() {
        const u = this.unitSize;
        const viewy = this._y;
        return Math.floor(viewy / u);
    }
    squareX(screenX) {
        const u = this.unitSize;
        const viewx = this._x;
        const uvx = Math.abs(viewx / u);
        const deltaX = Math.sign(viewx) >= 0 ? (1 - (uvx - Math.floor(uvx))) * u : (uvx + Math.sign(viewx) * Math.floor(uvx)) * u;
        const screenSq = Math.ceil((screenX - deltaX) / u);
        let rounding = 0;
        if (deltaX === 0 && Math.sign(viewx) < 0) {
            rounding = -1;
        }
        return screenSq + rounding;
    }
    squareY(screenY) {
        const u = this.unitSize;
        const viewy = this._y;
        const uvy = Math.abs(viewy / u);
        const deltaY = Math.sign(viewy) >= 0 ? (1 - (uvy - Math.floor(uvy))) * u : (uvy + Math.sign(viewy) * Math.floor(uvy)) * u;
        const screenSq = Math.ceil((screenY - deltaY) / u);
        let rounding = 0;
        if (deltaY === 0 && Math.sign(viewy) < 0) {
            rounding = -1;
        }
        return screenSq + rounding;
    }
    screenX(squareX) {
        const u = this.unitSize;
        const viewx = this._x;
        const initX = this.squareLayerX();
        if (squareX < initX) {
            return -1;
        }
        const uvx = Math.abs(viewx / u);
        const deltaX = Math.sign(viewx) >= 0 ? (1 - (uvx - Math.floor(uvx))) * u : (uvx + Math.sign(viewx) * Math.floor(uvx)) * u;
        const squareXInScreen = squareX - initX;
        const result = Math.max(0, Math.round((squareXInScreen - 1) * u + deltaX));
        return result;
    }
    screenY(squareY) {
        const u = this.unitSize;
        const viewy = this._y;
        const initY = this.squareLayerY();
        if (squareY < initY) {
            return -1;
        }
        const uvy = Math.abs(viewy / u);
        const deltaY = Math.sign(viewy) >= 0 ? (1 - (uvy - Math.floor(uvy))) * u : (uvy + Math.sign(viewy) * Math.floor(uvy)) * u;
        const squareYInScreen = squareY - initY;
        const result = Math.max(0, Math.round((squareYInScreen - 1) * u + deltaY));
        return result;
    }
}
exports.Viewport = Viewport;
}
// default/data/state.js
$fsx.f[52] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const fill_map_1 = $fsx.r(47);
const grid_1 = $fsx.r(16);
const layer_map_1 = $fsx.r(49);
const shape_map_1 = $fsx.r(46);
const ui_1 = $fsx.r(20);
const clip_pattern_1 = $fsx.r(21);
const viewport_1 = $fsx.r(51);
class State {
    constructor(maxSize = 256) {
        this.version = 0;
        this._fills = new fill_map_1.FillMap();
        this._shapes = new shape_map_1.ShapeMap();
        this._viewport = new viewport_1.Viewport(undefined, undefined, undefined, maxSize);
        const shapeIds = this._shapes.getAllShapeIds();
        const shape = this._shapes.getShapeById(shapeIds[0]);
        if (!shape) {
            throw new Error(`Cannot initialize State, no shape can be selected`);
        }
        this._layers = new layer_map_1.LayerMap(grid_1.GridType.Square, shapeIds, shapeIds[0], shape.selectedFillSet);
        this._ui = new ui_1.UI(this._layers.getSelected(), this._shapes, this._fills);
    }
    toJSON() {
        return {
            version: this.version,
            fills: this._fills.toJSON(),
            shapes: this._shapes.toJSON(),
            viewport: this._viewport.toJSON(),
            layers: this._layers.toJSON(),
            ui: this._ui.toJSON()
        };
    }
    static revive(r) {
        const result = new State();
        result._fills = fill_map_1.FillMap.revive(r.fills);
        result._shapes = shape_map_1.ShapeMap.revive(r.shapes);
        result._viewport = viewport_1.Viewport.revive(r.viewport);
        result._layers = layer_map_1.LayerMap.revive(r.layers);
        result._ui = ui_1.UI.revive(r.ui);
        return result;
    }
    get isEmpty() {
        const numLayers = this._layers.layers.size;
        const dims = this.currentLayer.dimensions();
        return numLayers === 1 && dims.height === 0 && dims.width === 0;
    }
    get viewport() {
        return this._viewport;
    }
    get fills() {
        return this._fills;
    }
    get shapes() {
        return this._shapes;
    }
    get ui() {
        return this._ui;
    }
    get layers() {
        return this._layers;
    }
    get currentLayer() {
        return this._layers.getSelected();
    }
    get pattern() {
        if (!this.currentLayer.pattern) {
            return null;
        }
        const lid = this._layers.selectedLayerId;
        const clipPattern = this._ui.patterns.get(lid);
        if (!clipPattern) {
            return null;
        } else {
            return clipPattern;
        }
    }
    get isPatternOn() {
        return this.ui.toolsSubmenus.isGridPatternOn;
    }
    updatePatternsPos() {
        for (const clip of this.ui.patterns.values()) {
            if (clip) {
                clip.updateFromViewport(this.viewport);
            }
        }
        return this;
    }
    patternHit(x, y) {
        const pattern = this.pattern;
        if (pattern) {
            return pattern.hit(x, y);
        }
        return clip_pattern_1.PatternHit.Inside;
    }
    get currentLayerType() {
        return this._layers.getSelected().type;
    }
    get layerShapeOutline() {
        return this._shapes.editor.template.baseString;
    }
    get layerShapeRes() {
        return this._shapes.editor.template.resolution;
    }
    get selectedShape() {
        const shape = this._shapes.getShapeById(this._layers.getSelected().selectedShape);
        if (!shape) {
            throw new Error('state.selectedShape -> No shape is selected in the current layer');
        }
        return shape;
    }
    get selectedShapeId() {
        return this._layers.getSelected().selectedShape;
    }
    get selectedShapeNumFills() {
        return this.selectedShape.editor.numVisibleShapes;
    }
    newShapeFillSetId(rnd) {
        return this.selectedShape.rndShapeFillSetId(rnd);
    }
    newShapeId(rnd) {
        return this._shapes.getRndShapeId(rnd);
    }
    nearestActivePt(x, y) {
        return this._shapes.editor.nearestActivePt(x, y);
    }
    isCurrentEdge(x, y) {
        const edge = this._shapes.editor.currentEdge;
        if (!edge) {
            return false;
        }
        return edge.x === x && edge.y === y;
    }
    isOtherEdge(x, y) {
        const edge = this._shapes.editor.otherEdge;
        if (!edge) {
            return false;
        }
        return edge.x === x && edge.y === y;
    }
    newFillIds(rnd, ammount) {
        const unique = new Set();
        const result = [];
        while (unique.size < ammount) {
            const fillId = this._fills.rndFillId(rnd);
            if (unique.has(fillId)) {
                continue;
            }
            unique.add(fillId);
            result.push(fillId);
        }
        return result;
    }
    renderSVGDefs() {
        const result = [];
        for (const [shapeId, shape] of this._shapes.entries()) {
            result.push(this._fills.buildShapeSymbol(shape, shapeId).join('\n'));
        }
        return result;
    }
    renderSVGLayer(dim) {
        const res = this.layerShapeRes;
        return this.currentLayer.renderSVGUse(dim, res);
    }
    renderSVG(dim, w, h) {
        const res = this.layerShapeRes;
        return `
		<svg ${ w && h ? `width="${ w }px" height="${ h }px"` : '' } viewBox="0 0 ${ dim.width * res } ${ dim.height * res }" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<!-- Rendered by GRID GENERATOR at https://gridgenerator.com -->
			<defs>
				${ this.renderSVGDefs().join('\n') }
			</defs>
			<g>
			${ this.renderSVGLayer(dim).join('\n') }
			</g>
		</svg>
		`;
    }
    createSVGParts(dim) {
        const res = this.layerShapeRes;
        return {
            viewbox: [
                0,
                0,
                dim.width * res,
                dim.height * res
            ],
            defs: this.renderSVGDefs(),
            layerUse: this.renderSVGLayer(dim)
        };
    }
    createSingleSVG() {
        const parts = this.createSVGParts(this.currentLayer.dimensions(true));
        return {
            viewbox: parts.viewbox,
            svg: `
		<defs>
		${ parts.defs.join('\n') }
		</defs>
		<g>
		${ parts.layerUse.join('\n') }
		</g>`
        };
    }
    createSVG(hreps = 1, vreps = 1) {
        const parts = this.createSVGParts(this.currentLayer.dimensions(true));
        const view = parts.viewbox;
        const width = view[2];
        const height = view[3];
        let uses = '';
        for (let v = 0; v < vreps; v++) {
            for (let h = 0; h < hreps; h++) {
                uses += `<g transform="translate(${ h * width } ${ v * height })">
				${ parts.layerUse.join('\n') }
				</g>
				`;
            }
        }
        return {
            viewbox: [
                0,
                0,
                hreps * width,
                vreps * height
            ],
            svg: `
			<defs>
				${ parts.defs.join('\n') }
			</defs>
			${ uses }
			`
        };
    }
    resetUI() {
        this._ui = new ui_1.UI(this.currentLayer, this._shapes, this._fills);
    }
}
exports.State = State;
}
// default/data/fat.js
$fsx.f[53] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const checkpoint_1 = $fsx.r(54);
const modification_1 = $fsx.r(55);
const state_1 = $fsx.r(52);
const rgb_1 = $fsx.r(9);
const tile_pattern_1 = $fsx.r(19);
const vector_1 = $fsx.r(4);
const ui_1 = $fsx.r(20);
const clip_pattern_1 = $fsx.r(21);
const cursor_1 = $fsx.r(22);
const defaults_1 = $fsx.r(29);
const export_1 = $fsx.r(40);
const fill_editor_1 = $fsx.r(41);
class FatState {
    constructor(initialState) {
        this._version = 0;
        this._state = initialState || new state_1.State();
        this._mods = [];
        this._prevTime = Date.now();
        this._maxDeltaT = 500;
        this._minDeltaT = 60;
        this._checkpoint = null;
        this._relativeVersion = null;
        this._restoring = false;
    }
    toJSON() {
        return {
            m: this._mods.map(m => m.toJSON()),
            v: this.maxVersion
        };
    }
    static revive(o, state) {
        const result = new FatState();
        result._mods = o.m.map(m => modification_1.Modification.revive(m, FatState.reviveArgs));
        result._version = o.v;
        result._state = state;
        return result;
    }
    set initialState(s) {
        this._version = 0;
        this._checkpoint = null;
        this._state = s;
    }
    get version() {
        if (this._relativeVersion) {
            return this._relativeVersion;
        }
        return this._version;
    }
    get current() {
        return this._state;
    }
    get maxVersion() {
        if (!this._checkpoint) {
            return this._version;
        }
        return Math.max(this._version, this._checkpoint.version);
    }
    static reviveArgs(name, args) {
        if (!args) {
            return null;
        }
        switch (name) {
        case 'hudEnterNewFill':
            return [
                args[0],
                args[1],
                args[2].map(c => new rgb_1.RGBColor(c.r, c.g, c.b, c.a))
            ];
        case 'shapeClose':
            return [
                new vector_1.Vector2D(args[0].x, args[0].y),
                args[1].map(c => new rgb_1.RGBColor(c.r, c.g, c.b, c.a)),
                args[2]
            ];
        case 'shapePointAction':
            return [new vector_1.Vector2D(args[0].x, args[0].y)];
        default:
            return args;
        }
    }
    mod(name, args) {
        const now = Date.now();
        const deltaT = now - this._prevTime;
        this._prevTime = now;
        if (deltaT < this._minDeltaT) {
            const lastMod = this._mods[this._mods.length - 1];
            if (!lastMod) {
                return;
            }
            const lastModName = lastMod.actionName;
            if (lastModName === name) {
                this._mods[this._mods.length - 1] = new modification_1.Modification(lastMod.version, lastMod.deltaT + deltaT, name, args);
                return;
            }
        }
        this._version++;
        this._mods.push(new modification_1.Modification(this.version, Math.min(deltaT, this._maxDeltaT), name, args));
        this.removeCheckpoint();
    }
    modsNeeded(version) {
        if (!this._checkpoint) {
            throw new Error('No checkpoint was done yet. Cannot go to version ' + version);
        }
        if (this._checkpoint.version < version) {
            throw new Error('No checkpoint found for version ' + version);
        }
        return this._checkpoint.mods;
    }
    doCheckpoint(newVersion) {
        if (!this._checkpoint || this._checkpoint.version < this._version) {
            this._checkpoint = new checkpoint_1.Checkpoint(this._state, this._mods, this._version);
        }
        this._relativeVersion = newVersion;
    }
    removeCheckpoint() {
        if (!this._restoring) {
            this._checkpoint = null;
            this._relativeVersion = null;
        }
    }
    restoreTo(version, initialState) {
        let mods = this._mods;
        if (version > this.maxVersion || this._relativeVersion !== null) {
            mods = this.modsNeeded(version);
        } else if (version === this._version) {
            return;
        }
        this.doCheckpoint(version);
        this._version = 0;
        this._state = initialState || new state_1.State();
        this._mods = [];
        this._restoring = true;
        for (let v = 0; v < version; v++) {
            const mod = mods[v];
            if (!mod.args) {
                this[mod.actionName]();
            } else {
                this[mod.actionName](...mod.args);
            }
        }
        this._restoring = false;
    }
    fastRestoreFwd(set) {
        let mods = this._mods;
        let version = this._version;
        if (this._checkpoint) {
            mods = this._checkpoint.mods;
            version = this._checkpoint.version;
        }
        let curVersion = this.version;
        this._restoring = true;
        do {
            const mod = mods[curVersion];
            if (!mod) {
                this._restoring = false;
                return;
            }
            if (!mod.args) {
                this[mod.actionName]();
            } else {
                this[mod.actionName](...mod.args);
            }
            if (set.has(mod.actionName)) {
                break;
            }
            curVersion++;
        } while (curVersion < this.maxVersion);
        this._restoring = false;
        this._relativeVersion = Math.min(curVersion + 1, this.maxVersion);
    }
    prev(init, s, adjust = 0) {
        let mods = this._mods;
        const version = this.version;
        if (this._checkpoint) {
            mods = this._checkpoint.mods;
        }
        let prev = 0;
        for (let v = 0; v < version; v++) {
            if (s.has(mods[v].actionName)) {
                prev = v;
            }
        }
        this.restoreTo(prev - adjust, init);
    }
    next(init, s) {
        let mods = this._mods;
        let version = this._version;
        if (this._checkpoint) {
            mods = this._checkpoint.mods;
            version = this._checkpoint.version;
        }
        let next = this.version + 1;
        let found = false;
        for (let v = next; v < version; v++) {
            if (s.has(mods[v].actionName)) {
                found = true;
                next = v;
                break;
            }
        }
        if (!found) {
            next = version;
        }
        this._relativeVersion = next;
        this.restoreTo(next, init);
    }
    updateSelectedColor() {
        if (this._state.ui.at === ui_1.UIState.ShapeEditor) {
            const shapeIndex = this._state.ui.shapeEditor.selectedShape;
            const fillId = this._state.shapes.editor.fillIds[shapeIndex];
            const fillIdString = this._state.fills.updateFromEditor(fillId);
            this._state.ui.fillEditor.updateSelected(fillIdString);
            this._state.ui.shapeEditor.updateFill(fillIdString);
            return this;
        } else {
            const shape = this._state.selectedShape;
            const fillIdString = this._state.fills.updateFromEditor(shape.selectedPathFillId);
            console.log('UPDATED TO', fillIdString);
            this._state.ui.updateSelectedFill(this._state.fills.buildSVG(shape.resolution, shape.getSelectedFills()), fillIdString);
            return this;
        }
    }
    colorPickerSelectColor(slice) {
        this._state.fills.colors.editorSelectColor(slice);
        this.updateSelectedColor();
        this.mod('colorPickerSelectColor', [slice]);
        return this;
    }
    colorPickerMoveWheel(angle) {
        this._state.fills.colors.moveWheel(angle);
        this.updateSelectedColor();
        this.mod('colorPickerMoveWheel', [angle]);
        return this;
    }
    colorPickerModeChange(mode) {
        this._state.fills.colors.modeChange(fill_editor_1.UIFillEditor.toColorEditorMode(mode));
        this._state.ui.fillEditor.colorMenuMode(mode);
        this.mod('colorPickerModeChange', [mode]);
        return this;
    }
    colorPickerSystem(hex) {
        this._state.fills.colors.editorColorPick(hex);
        this.updateSelectedColor();
        this.mod('colorPickerSystem', [hex]);
        return this;
    }
    colorPickerSelectFillId(fillId) {
        if (this._state.ui.at === ui_1.UIState.ShapeEditor) {
            const index = this._state.shapes.editor.fillIds.indexOf(fillId);
            this._state.ui.shapeEditor.selectedShape = index;
        } else {
            this._state.shapes.setShapeFillId(this._state.selectedShapeId, fillId);
        }
        this._state.ui.fillEditor.selected = fillId;
        this._state.fills.selectFillId(fillId);
        this.updateSelectedColor();
        this.mod('colorPickerSelectFillId', [fillId]);
        return this;
    }
    colorPickerEnterCode() {
        this._state.ui.fillEditor.editorMode = fill_editor_1.UIFillEditorMode.Code;
        const fid = this._state.ui.fillEditor.selected;
        const color = this._state.fills.getFillObj(fid);
        if (!color) {
            console.warn('Could not get the fill obj(color) for the selected fill id when entering Color Code');
            return this;
        }
        this._state.ui.fillEditor.colorCode = color;
        this.mod('colorPickerEnterCode', null);
        return this;
    }
    colorPickerExitCode() {
        this._state.ui.fillEditor.editorMode = fill_editor_1.UIFillEditorMode.Color;
        this.mod('colorPickerExitCode', null);
        return this;
    }
    colorPickerSaveCode(hex) {
        this._state.ui.fillEditor.editorMode = fill_editor_1.UIFillEditorMode.Color;
        this._state.fills.colors.editorColorPick(hex);
        this.updateSelectedColor();
        this.mod('colorPickerSaveCode', [hex]);
        return this;
    }
    hudEnterFeature(feature) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            this._state.ui.enterFeature(feature, this._state.currentLayer, this._state.layerShapeOutline, this._state.layerShapeRes);
            this._state.ui.enteringEditor();
            this.mod('hudEnterFeature', [feature]);
        });
    }
    hudEnterEditShape() {
        const p = this._state.shapes.editShape(this._state.ui.shapesMenu.selected);
        this._state.ui.editShape(p, this._editorFills(), true);
        this._state.ui.enteringEditor();
        this.mod('hudEnterEditShape', null);
    }
    hudEnterNewShape() {
        const p = this._state.shapes.newShape(this._state.currentLayerType);
        this._state.ui.editShape(p);
        this._state.ui.enteringEditor();
        this.mod('hudEnterNewShape', null);
    }
    hudDiscardNewShape() {
        for (let i = 0; i < this._state.shapes.editor.fillIds.length; i++) {
            this._state.fills.deleteFill(this._state.shapes.editor.fillIds[i]);
        }
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('hudDiscardNewShape', null);
    }
    hudDiscardEditedShape() {
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('hudDiscardEditedShape', null);
    }
    hudEnterNewFill(shapeFillSetId, newFillIds, colors) {
        this._state.fills.newFills(newFillIds, colors);
        const shape = this._state.selectedShape;
        shape.addNewFills(newFillIds, shapeFillSetId);
        this._state.fills.updateEditorWith(shape.selectedPathFillId);
        this._state.ui.newFill(this._state.selectedShape, this._state.fills.buildShapeSVG(this._state.selectedShape), this._state.fills);
        this._state.ui.enteringEditor();
        this.mod('hudEnterNewFill', [
            shapeFillSetId,
            newFillIds,
            colors
        ]);
        return this;
    }
    hudUIExitingEditor() {
        this._state.ui.exitingEditor();
        this.mod('hudExitingEditor', null);
        return this;
    }
    hudUIEnteringEditor() {
        this._state.ui.enteringEditor();
        this.mod('hudEnteringEditor', null);
        return this;
    }
    hudUIEditorOnTop() {
        this._state.ui.editorOnTop();
        this._state.ui.editorStopAnim();
        this.mod('hudUIEditorOnTop', null);
        return this;
    }
    hudUIEditorOnBottom() {
        this._state.ui.editorOnBottom();
        this.mod('hudUIEditorOnBottom', null);
        return this;
    }
    hudUICloseNewFill() {
        const shape = this._state.selectedShape;
        const rot = this._state.layers.getSelected().selectedRot;
        this._state.ui.closeNewFill(shape, rot, this._state.fills.buildShapeSVG(shape));
        this._state.ui.editorStopAnim();
        this.mod('hudUICloseNewFill', null);
        return this;
    }
    hudUICloseNewShape() {
        this._state.ui.closeNewShape();
        this._state.ui.editorStopAnim();
        this.mod('hudUICloseNewShape', null);
        return this;
    }
    hudDiscardNewFills() {
        this._state.fills.discardNewFills();
        this._state.selectedShape.discardNewFill();
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('hudDiscardNewFills', null);
        return this;
    }
    hudSaveNewFills() {
        const grid = this._state.layers.getSelected();
        const shape = this._state.shapes.getShapeById(grid.selectedShape);
        if (!shape) {
            throw new Error(`HUD: Cannot save fills for shapeId ${ grid.selectedShape }`);
        }
        const fillId = shape.selectedFillSet;
        grid.selectFill(fillId);
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('hudSaveNewFills', null);
        return this;
    }
    hudSaveShape(type, shapeId, shapeFillId, newFillIds) {
        const grid = this._state.layers.getSelected();
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        let shape;
        if (isExisting) {
            const changes = this._state.shapes.getShapeChanges(shapeId);
            const dupsNeeded = this._state.shapes.getNeededDups(shapeId, changes);
            const dups = this._state.fills.duplicateMany(dupsNeeded.fillIds, newFillIds, dupsNeeded.size);
            shape = this._state.shapes.saveUpdatedShape(type, shapeId, shapeFillId, dups, changes);
        } else {
            shape = this._state.shapes.saveNewShape(type, shapeId, shapeFillId);
            grid.addNewShape(shapeId, shapeFillId);
        }
        this._state.ui.refreshMenus(grid, this._state.shapes, this._state.fills.buildShapeSVG(shape));
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('hudSaveShape', [
            type,
            shapeId,
            shapeFillId,
            newFillIds
        ]);
        return this;
    }
    hudSelectShape(shapeId) {
        const shape = this._state.shapes.getShapeById(shapeId);
        if (!shape) {
            throw new Error(`HUD: Cannot select shape with shapeId ${ shapeId }`);
        }
        const grid = this._state.layers.getSelected().selectShape(shapeId, shape.selectedFillSet);
        this._state.ui.selectTool(defaults_1.ToolsMenuId.Paint);
        this._state.ui.refreshMenus(grid, this._state.shapes, this._state.fills.buildShapeSVG(shape));
        this.mod('hudSelectShape', [shapeId]);
        return this;
    }
    hudRotateShape() {
        const layer = this._state.layers.getSelected();
        const shapeId = layer.selectedShape;
        const shape = this._state.shapes.getShapeById(shapeId);
        if (!shape) {
            throw new Error(`HUD: Cannot rotate shape with shapeId ${ shapeId }`);
        }
        const rotation = layer.rotateSelected();
        this._state.ui.refreshMenus(layer, this._state.shapes, this._state.fills.buildShapeSVG(shape));
        this.mod('hudRotateShape', null);
        return this;
    }
    hudSelectFill(fillId) {
        const grid = this._state.layers.getSelected();
        const shape = this._state.shapes.getShapeById(grid.selectedShape);
        if (!shape) {
            throw new Error(`HUD: Cannot select shape fill. Selected shape could not be found: ${ grid.selectedShape }`);
        }
        shape.selectFill(fillId);
        grid.selectFill(fillId);
        this._state.ui.refreshMenus(grid, this._state.shapes, this._state.fills.buildShapeSVG(shape));
        this.mod('hudSelectFill', [fillId]);
        return this;
    }
    hudSelectTool(toolId) {
        this._state.ui.selectTool(toolId);
        this.mod('hudSelectTool', [toolId]);
        return this;
    }
    hudClearAll() {
        this._state.layers.getSelected().clear();
        this.mod('hudClearAll', null);
        return this;
    }
    hudTogglePattern() {
        this._state.ui.toolsSubmenus.isGridPatternOn = !this._state.ui.toolsSubmenus.isGridPatternOn;
        if (!this._state.ui.toolsSubmenus.isGridPatternOn) {
            this._state.layers.getSelected().pattern = null;
        }
        this.mod('hudTogglePattern', null);
        return this;
    }
    hudNewPattern(cx, cy) {
        const grid = this._state.layers.getSelected();
        grid.pattern = new tile_pattern_1.TilePattern(cx - 1, cy - 1, cx + 1, cy + 1);
        const lid = this._state.layers.selectedLayerId;
        const clip = new clip_pattern_1.ClipPattern(grid.pattern);
        this._state.ui.patterns.set(lid, clip);
        this.mod('hudNewPattern', [
            cx,
            cy
        ]);
        return this;
    }
    hudUpdatePatternPos() {
        this._state.updatePatternsPos();
        this.mod('hudUpdatePatternPos', null);
        return this;
    }
    hudStartPatternAdjust(startPos) {
        if (startPos) {
            this._state.ui.at = ui_1.UIState.PatternAdjustStart;
        } else {
            this._state.ui.at = ui_1.UIState.PatternAdjustEnd;
        }
        this.mod('hudStartPatternAdjust', [startPos]);
        return this;
    }
    hudPatternAdjust(layerX, layerY) {
        const grid = this._state.currentLayer;
        if (this._state.ui.at === ui_1.UIState.PatternAdjustEnd) {
            if (grid.pattern) {
                if (grid.pattern.startX < layerX) {
                    grid.pattern.endX = layerX;
                }
                if (grid.pattern.startY < layerY) {
                    grid.pattern.endY = layerY;
                }
            }
        } else {
            if (grid.pattern) {
                if (grid.pattern.endX > layerX) {
                    grid.pattern.startX = layerX;
                }
                if (grid.pattern.endY > layerY) {
                    grid.pattern.startY = layerY;
                }
            }
        }
        const lid = this._state.layers.selectedLayerId;
        const clip = this._state.ui.patterns.get(lid);
        if (clip && grid.pattern) {
            clip.gridPattern = grid.pattern;
            this._state.ui.patterns.set(lid, clip);
        }
        this.mod('hudPatternAdjust', [
            layerX,
            layerY
        ]);
        return this;
    }
    hudStopPatternAdjust() {
        this._state.ui.at = ui_1.UIState.Project;
        this.mod('hudStopPatternAdjust', null);
        return this;
    }
    hudMouseCursorRotate() {
        this._state.ui.cursorHandler.cursor = cursor_1.UICursor.Rotate;
        this.mod('hudMouseCursorRotate', null);
        return this;
    }
    hudMouseCursorFromTool() {
        this._state.ui.cursorHandler.cursor = this._state.ui.currentToolMouseIcon();
        this.mod('hudMouseCursorFromTool', null);
        return this;
    }
    _editorFills() {
        return this._state.shapes.editor.fillIds.map(fid => this._state.fills.getFill(fid));
    }
    shapeClose(pt, colors, fillId) {
        this._state.fills.newFills(fillId, colors);
        this._state.shapes.editorCloseShape(pt, fillId[0]);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this._state.ui.shapeEditor.selectMostRecentShape();
        this.mod('shapeClose', [
            pt,
            colors,
            fillId
        ]);
        return this;
    }
    shapePointAction(pt) {
        this._state.shapes.editorSelectPt(pt);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this._state.ui.shapeEditor.unselectShape();
        this.mod('shapePointAction', [pt]);
        return this;
    }
    shapeReverseTo(i) {
        this._state.shapes.editorReverseTo(i);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this.mod('shapeReverseTo', [i]);
        return this;
    }
    shapeSolveAmbiguity(i) {
        this._state.shapes.editorSolveAmbiguity(i);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this.mod('shapeSolveAmbiguity', [i]);
        return this;
    }
    shapeSelectFigure(d) {
        this._state.shapes.editorDiscardCurrent();
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this._state.ui.shapeEditor.selectShape(d);
        this.mod('shapeSelectFigure', [d]);
        return this;
    }
    shapeDeleteFigure() {
        this._state.shapes.editorDeleteShape(this._state.ui.shapeEditor.selectedShape);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this.mod('shapeDeleteFigure', null);
        return this;
    }
    shapeEditFigure() {
        this._state.shapes.editorChangeShape(this._state.ui.shapeEditor.selectedShape);
        const isExisting = this._state.ui.shapeEditor.isExistingShape;
        this._state.ui.shapeEditor.fromPath(this._state.shapes.editor, this._editorFills(), isExisting);
        this.mod('shapeEditFigure', null);
        return this;
    }
    shapeFillFigure() {
        const fillIds = this._state.shapes.editor.fillIds;
        const selectedFillId = fillIds[this._state.ui.shapeEditor.selectedShape];
        const fillObj = this._state.fills.getFillObj(selectedFillId);
        if (!fillObj) {
            console.warn('No fill obj found for the selected fill id in shape editor');
            return this;
        }
        this._state.fills.updateEditorWith(selectedFillId);
        this._state.ui.fillEditorFromShapeEditor(fillIds, fillObj);
        this.mod('shapeFillFigure', null);
        return this;
    }
    shapeFillDone() {
        this._state.ui.shapeFillDone();
        this.mod('shapeFillDone', null);
        return this;
    }
    shapeEnterTemplateSelector() {
        this._state.ui.enterTemplateSelector();
        this.mod('shapeEnterTemplateSelector', null);
        return this;
    }
    shapeSelectTemplate(tid) {
        const p = this._state.shapes.editorNewTemplate(tid);
        this._state.ui.editShape(p);
        this.mod('shapeSelectTemplate', [tid]);
        return this;
    }
    shapeExitTemplateSelector() {
        this._state.ui.exitTemplateSelector();
        this.mod('shapeExitTemplateSelector', null);
        return this;
    }
    sceneCursor(absX, absY) {
        this._state.currentLayer.updateCursor(absX, absY, this._state.viewport);
        this.mod('sceneCursor', [
            absX,
            absY
        ]);
        return this;
    }
    scenePaint(x, y) {
        this._state.currentLayer.paintElementAt(x, y);
        this.mod('scenePaint', [
            x,
            y
        ]);
        return this;
    }
    sceneDelete(x, y) {
        this._state.currentLayer.deleteElementAt(x, y);
        this.mod('sceneDelete', [
            x,
            y
        ]);
        return this;
    }
    sceneMove(deltaX, deltaY) {
        this._state.viewport.move(deltaX, deltaY);
        this._state.updatePatternsPos();
        this.mod('sceneMove', [
            deltaX,
            deltaY
        ]);
        return this;
    }
    sceneZoom(px, py, ammount, cx, cy, vx, vy) {
        this._state.viewport.changeZoom(px, py, ammount, cx, cy, vx, vy);
        this._state.updatePatternsPos();
        this.mod('sceneZoom', [
            px,
            py,
            ammount
        ]);
        return this;
    }
    sceneStopZoom() {
        this._state.viewport.setLastSize();
        this.mod('sceneZoom', null);
        return this;
    }
    sceneToggleGrid() {
        this._state.ui.toolsSubmenus.isGridVisible = !this._state.ui.toolsSubmenus.isGridVisible;
        this.mod('sceneToggleGrid', null);
        return this;
    }
    sceneStartZoom() {
        this._state.ui.isZooming = true;
        this.mod('sceneStartZoom', null);
        return this;
    }
    exportPrepare() {
        this._state.ui.exportEditor.at = export_1.ExportAt.Preparing;
        this.mod('exportPrepare', null);
        return this;
    }
    exportDone(fname) {
        this._state.ui.exportEditor.at = export_1.ExportAt.Done;
        this._state.ui.exportEditor.fname = fname;
        this.mod('exportDone', [fname]);
        return this;
    }
    exportError(error) {
        this._state.ui.exportEditor.at = export_1.ExportAt.Error;
        this._state.ui.exportEditor.error = error;
        this.mod('exportError', [error]);
        return this;
    }
    exportImagePreview(canExport) {
        const repetitions = this._state.ui.exportEditor.patternSize;
        this._state.ui.exportEditor.setPreview(this._state.createSVG(repetitions, repetitions));
        this._state.ui.exportEditor.isLoading = false;
        this._state.ui.exportEditor.needsPayment = !canExport;
        this._state.ui.exportEditor.at = export_1.ExportAt.Image;
        this.mod('exportImagePreview', [canExport]);
        return this;
    }
    exportChangeTo(exportAt) {
        this._state.ui.exportEditor.at = exportAt;
        if (exportAt === export_1.ExportAt.Video) {
            this._state.ui.exportEditor.format = export_1.ExportEditorFormat.MP4;
            this._state.ui.exportEditor.size = export_1.ExportSize.FullHD;
        } else {
            this._state.ui.exportEditor.format = export_1.ExportEditorFormat.SVG;
        }
        this.mod('exportChangeTo', [exportAt]);
        return this;
    }
    exportFormatChange(fmt) {
        this._state.ui.exportEditor.format = fmt;
        this.mod('exportFormatChange', [fmt]);
        return this;
    }
    exportSizeChange(size) {
        this._state.ui.exportEditor.size = size;
        this.mod('exportSizeChange', [size]);
        return this;
    }
    exportPatternChange(patternSize) {
        this._state.ui.exportEditor.setPreview(this._state.createSVG(patternSize, patternSize));
        this._state.ui.exportEditor.patternSize = patternSize;
        this.mod('exportPatternChange', [patternSize]);
        return this;
    }
    publishEnterLicense(title, desc) {
        this._state.ui.enterLicense(title, desc);
        if (title || desc) {
            this.mod('publishEnterLicense', [
                title,
                desc
            ]);
        } else {
            this.mod('publishEnterLicense', null);
        }
        return this;
    }
    publishSetLicense(license) {
        this._state.ui.setLicense(license);
        this.mod('publishSetLicense', [license]);
        return this;
    }
    publishExitLicense() {
        this._state.ui.exitLicense();
        this.mod('publishExitLicense', null);
        return this;
    }
    publishStartLoading() {
        this._state.ui.publishEditor.state = data_1.PublishState.Loading;
        this.mod('publishStartLoading', null);
        return this;
    }
    publishError(msg) {
        this._state.ui.publishEditor.state = data_1.PublishState.Error;
        this._state.ui.publishEditor.errorMsg = msg;
        this.mod('publishError', [msg]);
        return this;
    }
    publishSuccess() {
        this._state.ui.at = ui_1.UIState.PublishPreview;
        this._state.ui.publishEditor.state = data_1.PublishState.Success;
        this._state.ui.publishEditor.errorMsg = '';
        this.mod('publishSuccess', null);
        return this;
    }
    featuresExit() {
        this._state.ui.exitingEditor();
        this._state.ui.editorOnBottom();
        this.mod('featuresExit', null);
        return this;
    }
    featuresClose() {
        this._state.ui.closeFeatures();
        this._state.ui.editorStopAnim();
        this.mod('featuresClose', null);
        return this;
    }
}
exports.FatState = FatState;
}
// default/data/fat/checkpoint.js
$fsx.f[54] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Checkpoint {
    constructor(state, mods, version) {
        this.state = state;
        this.mods = mods;
        this.version = version;
    }
}
exports.Checkpoint = Checkpoint;
}
// default/data/fat/modification.js
$fsx.f[55] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Modification {
    constructor(version, deltaT, actionName, args) {
        this.version = version;
        this.deltaT = deltaT;
        this.actionName = actionName;
        this.args = args;
    }
    toJSON() {
        return {
            v: this.version,
            d: this.deltaT,
            n: this.actionName,
            a: this.args ? this.args.slice(0) : null
        };
    }
    static revive(o, argsReviver) {
        return new Modification(o.v, o.d, o.n, argsReviver(o.n, o.a));
    }
}
exports.Modification = Modification;
}
// default/data/fat/action_sets.js
$fsx.f[56] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class FatActionSets {
    constructor() {
        this.sitePlayerActions = new Set([
            'scenePaint',
            'sceneDelete'
        ]);
        this.undoActions = new Set([
            'hudEnterNewShape',
            'hudEnterNewFill',
            'hudClearAll',
            'scenePaint',
            'sceneDelete'
        ]);
    }
}
exports.FatActionSets = FatActionSets;
}
// default/data/meander.js
$fsx.f[57] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const about_1 = $fsx.r(58);
const collective_1 = $fsx.r(59);
const login_1 = $fsx.r(60);
const profile_1 = $fsx.r(61);
const recover_1 = $fsx.r(62);
const verify_1 = $fsx.r(63);
const view_1 = $fsx.r(64);
var MeanderCourse;
(function (MeanderCourse) {
    MeanderCourse[MeanderCourse['Project'] = 100] = 'Project';
    MeanderCourse[MeanderCourse['Login'] = 101] = 'Login';
    MeanderCourse[MeanderCourse['About'] = 102] = 'About';
    MeanderCourse[MeanderCourse['Collective'] = 103] = 'Collective';
    MeanderCourse[MeanderCourse['Pricing'] = 104] = 'Pricing';
    MeanderCourse[MeanderCourse['Profile'] = 105] = 'Profile';
    MeanderCourse[MeanderCourse['Verify'] = 106] = 'Verify';
    MeanderCourse[MeanderCourse['Recover'] = 107] = 'Recover';
    MeanderCourse[MeanderCourse['None'] = 108] = 'None';
    MeanderCourse[MeanderCourse['ViewProject'] = 109] = 'ViewProject';
}(MeanderCourse = exports.MeanderCourse || (exports.MeanderCourse = {})));
class Meander {
    constructor() {
        this.about = new about_1.MeanderAbout();
        this.login = new login_1.MeanderLogin();
        this.profile = new profile_1.MeanderProfile();
        this.verify = new verify_1.MeanderVerify();
        this.recover = new recover_1.MeanderRecover();
        this.view = new view_1.MeanderView();
        this.collective = new collective_1.Collective();
        this._course = MeanderCourse.None;
        this.updateTitle();
    }
    resetMeanders(c) {
        if (c !== MeanderCourse.Login) {
            this.login = new login_1.MeanderLogin();
        }
        if (c !== MeanderCourse.Verify) {
            this.verify = new verify_1.MeanderVerify();
        }
        if (c !== MeanderCourse.Recover) {
            this.recover = new recover_1.MeanderRecover();
        }
        if (c !== MeanderCourse.ViewProject) {
            this.view = new view_1.MeanderView();
        }
    }
    get course() {
        return this._course;
    }
    set course(c) {
        this.resetMeanders(c);
        this._course = c;
        this.updateTitle();
    }
    get isPaidAccount() {
        return true;
    }
    get title() {
        return this._title;
    }
    hasProfile() {
        return this.profile.id !== null;
    }
    updateTitle() {
        switch (this._course) {
        case MeanderCourse.Login:
            this._title = 'Login';
            break;
        case MeanderCourse.About:
            this._title = 'About';
            break;
        case MeanderCourse.Collective:
            this._title = 'Collective';
            break;
        case MeanderCourse.Pricing:
            this._title = 'Pricing';
            break;
        case MeanderCourse.Profile:
            this._title = 'Profile';
            break;
        case MeanderCourse.Project:
        case MeanderCourse.None:
        default:
            this._title = '';
        }
    }
}
exports.Meander = Meander;
}
// default/data/meander/about.js
$fsx.f[58] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const menu_1 = $fsx.r(39);
var AboutMenuId;
(function (AboutMenuId) {
    AboutMenuId['GridGenerator'] = 'gridgenerator';
    AboutMenuId['Contact'] = 'contact';
}(AboutMenuId = exports.AboutMenuId || (exports.AboutMenuId = {})));
const DefaultAboutMenu = new Map([
    [
        AboutMenuId.GridGenerator,
        new menu_1.MenuEntry('Grid Generator', 'lightest-blue')
    ],
    [
        AboutMenuId.Contact,
        new menu_1.MenuEntry('Contact', 'light-green')
    ]
]);
class MeanderAbout {
    constructor() {
        this.menu = new menu_1.Menu(DefaultAboutMenu);
        this.menu.selected = AboutMenuId.GridGenerator;
    }
}
exports.MeanderAbout = MeanderAbout;
}
// default/data/meander/collective.js
$fsx.f[59] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Collective {
    constructor() {
        this.isLoading = false;
        this.error = null;
        this.success = null;
        this.successEmail = null;
    }
}
exports.Collective = Collective;
}
// default/data/meander/login.js
$fsx.f[60] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class MeanderLogin {
    constructor() {
        this.isLoading = false;
        this.error = null;
        this.success = null;
        this.successEmail = null;
        this.showRecover = false;
    }
}
exports.MeanderLogin = MeanderLogin;
}
// default/data/meander/profile.js
$fsx.f[61] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const menu_1 = $fsx.r(39);
var ProfileMenuId;
(function (ProfileMenuId) {
    ProfileMenuId['Profile'] = 'profile';
    ProfileMenuId['Projects'] = 'projects';
    ProfileMenuId['Billing'] = 'billing';
}(ProfileMenuId = exports.ProfileMenuId || (exports.ProfileMenuId = {})));
var ProfileStatus;
(function (ProfileStatus) {
    ProfileStatus[ProfileStatus['Error'] = 100] = 'Error';
    ProfileStatus[ProfileStatus['Loading'] = 101] = 'Loading';
    ProfileStatus[ProfileStatus['Success'] = 102] = 'Success';
    ProfileStatus[ProfileStatus['Nothing'] = 103] = 'Nothing';
}(ProfileStatus = exports.ProfileStatus || (exports.ProfileStatus = {})));
const DefaultProfileMenu = new Map([
    [
        ProfileMenuId.Projects,
        new menu_1.MenuEntry('My Projects', 'light-green')
    ],
    [
        ProfileMenuId.Profile,
        new menu_1.MenuEntry('About me', 'lightest-blue')
    ]
]);
class MeanderProfile {
    constructor() {
        this.menu = new menu_1.Menu(DefaultProfileMenu);
        this.menu.selected = ProfileMenuId.Projects;
        this.badges = [];
        this.clear();
    }
    isPayedAccount() {
        return true;
    }
    clear() {
        this.id = null;
        this.form = null;
        this.id = null;
        this.name = null;
        this.about = null;
        this.created = null;
        this.loadingStatus = ProfileStatus.Nothing;
    }
    get filledName() {
        if (this.form && this.form.name) {
            return this.form.name;
        }
        return this.name;
    }
    get filledAbout() {
        if (this.form && this.form.about) {
            return this.form.about;
        }
        return this.about;
    }
    startLoading() {
        this.loadingStatus = ProfileStatus.Loading;
        this.loadingStatusMsg = null;
    }
    stopLoading(successMsg) {
        this.loadingStatus = ProfileStatus.Success;
        this.loadingStatusMsg = successMsg;
    }
    errorLoading(errorMsg) {
        this.loadingStatus = ProfileStatus.Error;
        this.loadingStatusMsg = errorMsg;
    }
    buildProfile(id, name, about, created, badges) {
        this.id = id;
        this.name = name;
        this.about = about;
        this.created = created;
        this.badges = badges;
    }
    clearProfile() {
        this.id = null;
        this.name = null;
        this.about = null;
        this.created = null;
    }
}
exports.MeanderProfile = MeanderProfile;
}
// default/data/meander/recover.js
$fsx.f[62] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var RecoverState;
(function (RecoverState) {
    RecoverState[RecoverState['Idle'] = 100] = 'Idle';
    RecoverState[RecoverState['Recovering'] = 101] = 'Recovering';
    RecoverState[RecoverState['Success'] = 102] = 'Success';
    RecoverState[RecoverState['Failed'] = 103] = 'Failed';
}(RecoverState = exports.RecoverState || (exports.RecoverState = {})));
class MeanderRecover {
    constructor() {
        this.state = RecoverState.Idle;
        this.message = null;
        this.error = null;
    }
    get isLoading() {
        return this.state === RecoverState.Recovering;
    }
}
exports.MeanderRecover = MeanderRecover;
}
// default/data/meander/verify.js
$fsx.f[63] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var VerifyingState;
(function (VerifyingState) {
    VerifyingState[VerifyingState['Verifying'] = 100] = 'Verifying';
    VerifyingState[VerifyingState['Success'] = 101] = 'Success';
    VerifyingState[VerifyingState['AlreadyVerified'] = 102] = 'AlreadyVerified';
    VerifyingState[VerifyingState['Failed'] = 103] = 'Failed';
}(VerifyingState = exports.VerifyingState || (exports.VerifyingState = {})));
class MeanderVerify {
    constructor() {
        this.state = VerifyingState.Verifying;
        this.user = null;
    }
}
exports.MeanderVerify = MeanderVerify;
}
// default/data/meander/view.js
$fsx.f[64] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var ViewStatus;
(function (ViewStatus) {
    ViewStatus[ViewStatus['Simple'] = 100] = 'Simple';
    ViewStatus[ViewStatus['Loading'] = 101] = 'Loading';
    ViewStatus[ViewStatus['Error'] = 102] = 'Error';
}(ViewStatus = exports.ViewStatus || (exports.ViewStatus = {})));
class MeanderView {
    constructor() {
        this.status = ViewStatus.Simple;
    }
}
exports.MeanderView = MeanderView;
}
// default/data/project.js
$fsx.f[65] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const xxhashjs_1 = $fsx.r(241);
const fat_1 = $fsx.r(53);
const state_1 = $fsx.r(52);
var ProjectLicense;
(function (ProjectLicense) {
    ProjectLicense['CC0'] = 'CC0';
    ProjectLicense['BY'] = 'BY';
    ProjectLicense['BYSA'] = 'BY_SA';
    ProjectLicense['BYNC'] = 'BY_NC';
    ProjectLicense['BYND'] = 'BY_ND';
    ProjectLicense['BYNCSA'] = 'BY_NC_SA';
    ProjectLicense['BYNCND'] = 'BY_NC_ND';
}(ProjectLicense = exports.ProjectLicense || (exports.ProjectLicense = {})));
function canRemix(l) {
    return l !== ProjectLicense.BYND && l !== ProjectLicense.BYNCND;
}
exports.canRemix = canRemix;
function canDownload(l) {
    return l !== ProjectLicense.BYNCND;
}
exports.canDownload = canDownload;
function canChangeLicense(l) {
    return l !== ProjectLicense.BYSA && l !== ProjectLicense.BYNCSA;
}
var ProjectAction;
(function (ProjectAction) {
    ProjectAction['Original'] = 'ORIGINAL';
    ProjectAction['Fork'] = 'FORK';
    ProjectAction['Update'] = 'UPDATE';
}(ProjectAction = exports.ProjectAction || (exports.ProjectAction = {})));
class Project {
    constructor(initialState, action, license, fat) {
        this.legal = license || ProjectLicense.CC0;
        this.action = action || ProjectAction.Original;
        this.initialState = initialState;
        this.fatState = fat || new fat_1.FatState(this.initialStateCopy);
        this.isPublished = false;
        this.canChangeLicense = canChangeLicense(this.legal);
    }
    toStored() {
        if (!this.id || !this.title || !this.legal || !this.action || !this.svg || !this.svgViewBox || !this.publishedAt || !this.createdAt || !this.parentPath) {
            return null;
        }
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            legal: this.legal,
            initialState: '',
            finalState: '',
            fatState: '',
            isPublished: this.isPublished,
            action: this.action,
            svg: this.svg,
            svgViewBox: [
                this.svgViewBox[0],
                this.svgViewBox[1]
            ],
            publishedAt: this.publishedAt,
            updatedAt: this.updatedAt,
            createdAt: this.createdAt,
            parentId: this.parentId,
            parentPath: this.parentPath
        };
    }
    get initialStateCopy() {
        return state_1.State.revive(this.initialState.toJSON());
    }
    get fatStateCopy() {
        if (this.fatState) {
            return fat_1.FatState.revive(this.fatState.toJSON(), this.initialStateCopy);
        }
        return new fat_1.FatState(this.initialStateCopy);
    }
    set license(s) {
        switch (s) {
        case 'CC0':
            this.legal = ProjectLicense.CC0;
            break;
        case 'BY':
            this.legal = ProjectLicense.BY;
            break;
        case 'BY_SA':
            this.legal = ProjectLicense.BYSA;
            break;
        case 'BY_NC':
            this.legal = ProjectLicense.BYNC;
            break;
        case 'BY_ND':
            this.legal = ProjectLicense.BYND;
            break;
        case 'BY_NC_SA':
            this.legal = ProjectLicense.BYNCSA;
            break;
        case 'BY_NC_ND':
            this.legal = ProjectLicense.BYNCND;
            break;
        default:
            this.legal = ProjectLicense.CC0;
        }
    }
    createSVG() {
        if (!this.finalState) {
            return;
        }
        const {svg, viewbox} = this.finalState.createSVG();
        this.svgViewBox = viewbox;
        this.svg = svg;
    }
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            legal: this.legal,
            initialState: this.initialState.toJSON(),
            finalState: this.finalState ? this.finalState.toJSON() : null,
            fatState: this.fatState ? this.fatState.toJSON() : null,
            isPublished: this.isPublished,
            action: this.action,
            svg: this.svg,
            svgViewBox: this.svgViewBox,
            publishedAt: this.publishedAt,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            parentId: this.parentId,
            parentPath: this.parentPath
        };
    }
    static netRevive(o) {
        o.finalState = JSON.parse(o.finalState);
        o.initialState = JSON.parse(o.initialState);
        o.fatState = JSON.parse(o.fatState);
        return this.revive(o);
    }
    static revive(o) {
        const result = new Project(state_1.State.revive(o.initialState), o.action, o.legal);
        result.id = o.id;
        result.title = o.title;
        result.description = o.description;
        result.finalState = o.finalState ? state_1.State.revive(o.finalState) : null;
        result.fatState = fat_1.FatState.revive(o.fatState, result.finalState || result.initialState);
        result.isPublished = o.isPublished;
        result.svg = o.svg;
        result.svgViewBox = o.svgViewBox;
        result.publishedAt = o.publishedAt;
        result.createdAt = o.createdAt;
        result.updatedAt = o.updatedAt;
        result.parentId = o.parentId;
        result.parentPath = o.parentPath;
        return result;
    }
}
exports.Project = Project;
class ProjectMap {
    constructor() {
        this.projects = new Map();
        this.current = new Project(new state_1.State());
    }
    get(id) {
        return this.projects.get(id);
    }
    refreshProjects(projs) {
        for (let i = 0; i < projs.length; i++) {
            const p = projs[i];
            if (p.id) {
                this.projects.set(p.id, p);
            }
        }
        return this;
    }
    closeCurrent() {
        const parentId = this.current.id;
        this.current.publishedAt = null;
        this.current.action = ProjectAction.Update;
        this.current.id = null;
        this.current.title = this.current.title += ' Update';
        this.current.isPublished = false;
    }
    prepareToPlay(state, fat) {
        return new Promise((resolve, reject) => {
            if (this.current) {
                const dup = new Project(state_1.State.revive(this.current.initialState.toJSON()));
                dup.finalState = state_1.State.revive(state.toJSON());
                dup.fatState = fat_1.FatState.revive(fat.toJSON(), dup.finalState);
                dup.createSVG();
                resolve(dup);
            } else {
                reject('No current project');
            }
        });
    }
    prepareToPublish(state, fat, title, desc, license) {
        return new Promise((resolve, reject) => {
            const proj = this.current;
            proj.finalState = state;
            proj.fatState = fat_1.FatState.revive(fat.toJSON(), proj.finalState);
            proj.title = title;
            proj.description = desc;
            proj.license = license;
            proj.createSVG();
            resolve(proj);
        });
    }
    getHash() {
        return new Promise((resolve, reject) => {
            const c = this.current;
            const {svg} = c.fatState.current.createSVG();
            let h;
            const str = xxhashjs_1.default.h32(svg, 48879).toString(10);
            h = Math.floor(parseInt(str, 10) / 2);
            console.log('GOT H', str, h);
            resolve(h);
        });
    }
    exportCurrent() {
        return new Promise((resolve, reject) => {
            const c = this.current;
            const {svg, viewbox} = c.fatState.current.createSVG();
            this.getHash().then(hash => {
                const exported = {
                    id: c.id,
                    initialState: JSON.stringify(c.initialState.toJSON()),
                    fatState: JSON.stringify(c.fatState.toJSON()),
                    svg,
                    svgViewBox: viewbox,
                    hash
                };
                resolve(exported);
            });
        });
    }
    publishCurrent(p) {
        this.current.id = p.id;
        this.current.publishedAt = p.publishedAt;
        return this;
    }
    get size() {
        return this.projects.size;
    }
    list() {
        return [...this.projects.values()].reverse();
    }
}
exports.ProjectMap = ProjectMap;
}
// default/data/player.js
$fsx.f[66] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class PlayerState {
    constructor(proj) {
        if (!proj.svg || !proj.svgViewBox) {
            console.log('NO PLAYER STATE');
            throw new Error('Cannot create player state');
        }
        console.log('PLAYER STATE');
        this.state = proj.fatState;
        this.thumbnailSvg = proj.svg;
        this.isPlaying = false;
        this.isAtStart = false;
        this.isAtEnd = true;
        this.thumbnailSvgViewBox = proj.svgViewBox;
        this.finalVersion = this.state.maxVersion;
        this.currentViewBox = proj.svgViewBox;
        this.title = proj.title || 'Untitled';
        this.proj = proj;
    }
}
exports.PlayerState = PlayerState;
}
// default/data/cart.js
$fsx.f[67] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const address_1 = $fsx.r(68);
const product_1 = $fsx.r(69);
var CartAt;
(function (CartAt) {
    CartAt[CartAt['Product'] = 100] = 'Product';
    CartAt[CartAt['InCart'] = 101] = 'InCart';
    CartAt[CartAt['ShippingAddress'] = 102] = 'ShippingAddress';
    CartAt[CartAt['Confirmation'] = 103] = 'Confirmation';
}(CartAt = exports.CartAt || (exports.CartAt = {})));
class Cart {
    constructor() {
        this.at = CartAt.Product;
        this.product = new product_1.CartProduct();
        this.inside = [];
        this.prices = {
            tshirtMan: 30,
            tshirtWoman: 30,
            tshirtUnisex: 35,
            posterA1: 15,
            posterA2: 10,
            posterA3: 8
        };
        this.address = new address_1.CartAddress();
    }
    addToCart() {
        this.inside.push(this.product);
        this.product = new product_1.CartProduct();
        this.at = CartAt.InCart;
    }
    incQty(index) {
        this.inside[index].quantity++;
    }
    decQty(index) {
        this.inside[index].quantity--;
    }
}
exports.Cart = Cart;
}
// default/data/cart/address.js
$fsx.f[68] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class CartAddress {
    constructor() {
        this.name = null;
        this.country = 'PT';
        this.address = null;
        this.postalCode = null;
        this.city = null;
        this.state = null;
        this.countries = [];
        this.states = null;
    }
    toJSON() {
        return {
            name: this.name,
            country: this.country,
            address: this.address,
            postalCode: this.postalCode,
            city: this.city,
            state: this.state
        };
    }
    static revive(r) {
        const revived = new CartAddress();
        revived.name = r.name;
        revived.country = r.country;
        revived.address = r.address;
        revived.postalCode = r.postalCode;
        revived.city = r.city;
        revived.state = r.state;
        return revived;
    }
}
exports.CartAddress = CartAddress;
}
// default/data/cart/product.js
$fsx.f[69] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var ProductAt;
(function (ProductAt) {
    ProductAt[ProductAt['TShirt'] = 100] = 'TShirt';
    ProductAt[ProductAt['Poster'] = 101] = 'Poster';
}(ProductAt = exports.ProductAt || (exports.ProductAt = {})));
var PosterType;
(function (PosterType) {
    PosterType['A1'] = 'A1';
    PosterType['A2'] = 'A2';
    PosterType['A3'] = 'A3';
}(PosterType = exports.PosterType || (exports.PosterType = {})));
exports.PosterSizes = {
    A1: [
        59.4,
        84.1
    ],
    A2: [
        42,
        59.4
    ],
    A3: [
        29.7,
        42
    ]
};
var TShirtType;
(function (TShirtType) {
    TShirtType['Man'] = 'Man';
    TShirtType['Woman'] = 'Woman';
    TShirtType['Unisex'] = 'Unisex';
}(TShirtType = exports.TShirtType || (exports.TShirtType = {})));
var TShirtSize;
(function (TShirtSize) {
    TShirtSize['S'] = 'S';
    TShirtSize['M'] = 'M';
    TShirtSize['L'] = 'L';
    TShirtSize['XL'] = 'XL';
}(TShirtSize = exports.TShirtSize || (exports.TShirtSize = {})));
var TShirtColor;
(function (TShirtColor) {
    TShirtColor['Black'] = '#25282B';
    TShirtColor['White'] = '#FFFFFF';
    TShirtColor['HeatherGray'] = '#ADBDBF';
}(TShirtColor = exports.TShirtColor || (exports.TShirtColor = {})));
class CartProduct {
    constructor() {
        this.at = ProductAt.TShirt;
        this.tshirtType = TShirtType.Unisex;
        this.tshirtSize = TShirtSize.M;
        this.tshirtColor = TShirtColor.White;
        this.tshirtDeltaX = 0;
        this.tshirtDeltaY = 0;
        this.tshirtPreviewH = 352;
        this.tshirtPreviewW = 264;
        this.artSize = 1;
        this.posterType = PosterType.A3;
        this.posterPreviewH = 500;
        this.posterPreviewW = 354;
        this.posterDeltaX = 0;
        this.posterDeltaY = 0;
        this.price = 0;
        this.quantity = 1;
    }
    withArt(art) {
        this.artSVG = art.svg;
        this.artViewbox = art.viewbox;
        this.originalViewbox = art.viewbox.slice(0);
    }
    zoom(z) {
        if (this.originalViewbox && this.artViewbox) {
            const r = this.originalViewbox[3] / this.originalViewbox[4];
            const iz = 1 - z;
            const maxW = this.originalViewbox[2];
            const maxH = this.originalViewbox[3];
            const dw = iz * maxW * 2;
            const dh = iz * maxH * 2;
            const newvb = [
                -dw / 2,
                -dh / 2,
                maxW + dw,
                maxH + dh
            ];
            this.artViewbox = newvb;
            this.center();
        }
    }
    center() {
        this.centerTShirt();
        this.centerPoster();
    }
    centerRect(w, h) {
        if (!this.artViewbox || !this.artSVG) {
            this.tshirtDeltaX = 0;
            this.tshirtDeltaY = 0;
            return {
                w,
                h,
                x: 0,
                y: 0
            };
        }
        const wt = w;
        const ht = h;
        const rt = w / h;
        const wi = this.artViewbox[2] + -1 * this.artViewbox[0];
        const hi = this.artViewbox[3] + -1 * this.artViewbox[1];
        const ri = wi / hi;
        let rectW = wt;
        let rectH = hi * wt / wi;
        if (rt > ri) {
            rectW = wi * ht / hi;
            rectH = ht;
        }
        return {
            y: (ht - rectH) / 2,
            x: (wt - rectW) / 2,
            w: rectW,
            h: rectH
        };
    }
    productType() {
        switch (this.at) {
        case ProductAt.Poster:
            return 'Poster';
        case ProductAt.TShirt:
            return 'T-Shirt';
        }
    }
    centerPoster() {
        const {w, h, x, y} = this.centerRect(354, 500);
        this.posterDeltaY = y;
        this.posterDeltaX = x;
        this.posterPreviewW = w;
        this.posterPreviewH = h;
    }
    centerTShirt() {
        const {w, h, x, y} = this.centerRect(264, 352);
        this.tshirtDeltaY = y;
        this.tshirtDeltaX = x;
        this.tshirtPreviewW = w;
        this.tshirtPreviewH = h;
    }
    setPrice(p) {
        let price = 0;
        if (this.at === ProductAt.TShirt) {
            switch (this.tshirtType) {
            case TShirtType.Man:
                price = p.tshirtMan;
                break;
            case TShirtType.Woman:
                price = p.tshirtWoman;
                break;
            case TShirtType.Unisex:
                price = p.tshirtUnisex;
                break;
            }
        } else {
            switch (this.posterType) {
            case PosterType.A1:
                price = p.posterA1;
                break;
            case PosterType.A2:
                price = p.posterA2;
                break;
            case PosterType.A3:
                price = p.posterA3;
                break;
            }
        }
        this.price = price;
    }
    init() {
        this.center();
        this.artSize = 1;
    }
}
exports.CartProduct = CartProduct;
}
// default/data/meander/country.js
$fsx.f[70] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Country {
    constructor(name, alpha2, alpha3, code) {
        this.name = name;
        this.alpha2 = alpha2;
        this.alpha3 = alpha3;
        this.code = code;
    }
}
exports.Country = Country;
exports.Countries = [
    new Country('Select Country', '-1', 'NIL', -1),
    new Country('Afghanistan', 'AF', 'AFG', 4),
    new Country('Åland', 'AX', 'ALA', 248),
    new Country('Albania', 'AL', 'ALB', 8),
    new Country('Algeria', 'DZ', 'DZA', 12),
    new Country('American Samoa', 'AS', 'ASM', 16),
    new Country('Andorra', 'AD', 'AND', 20),
    new Country('Angola', 'AO', 'AGO', 24),
    new Country('Anguilla', 'AI', 'AIA', 660),
    new Country('Antarctica', 'AQ', 'ATA', 10),
    new Country('Antigua and Barbuda', 'AG', 'ATG', 28),
    new Country('Argentina', 'AR', 'ARG', 32),
    new Country('Armenia', 'AM', 'ARM', 51),
    new Country('Aruba', 'AW', 'ABW', 533),
    new Country('Australia', 'AU', 'AUS', 36),
    new Country('Austria', 'AT', 'AUT', 40),
    new Country('Azerbaijan', 'AZ', 'AZE', 31),
    new Country('Bahamas', 'BS', 'BHS', 44),
    new Country('Bahrain', 'BH', 'BHR', 48),
    new Country('Bangladesh', 'BD', 'BGD', 50),
    new Country('Barbados', 'BB', 'BRB', 52),
    new Country('Belarus', 'BY', 'BLR', 112),
    new Country('Belgium', 'BE', 'BEL', 56),
    new Country('Belize', 'BZ', 'BLZ', 84),
    new Country('Benin', 'BJ', 'BEN', 204),
    new Country('Bermuda', 'BM', 'BMU', 60),
    new Country('Bhutan', 'BT', 'BTN', 64),
    new Country('Bolivia', 'BO', 'BOL', 68),
    new Country('Bonaire, Sint Eustatius and Saba', 'BQ', 'BES', 535),
    new Country('Bosnia and Herzegovina', 'BA', 'BIH', 70),
    new Country('Botswana', 'BW', 'BWA', 72),
    new Country('Bouvet Island', 'BV', 'BVT', 74),
    new Country('Brazil', 'BR', 'BRA', 76),
    new Country('British Indian Ocean Territory', 'IO', 'IOT', 86),
    new Country('Brunei Darussalam', 'BN', 'BRN', 96),
    new Country('Bulgaria', 'BG', 'BGR', 100),
    new Country('Burkina Faso', 'BF', 'BFA', 854),
    new Country('Burundi', 'BI', 'BDI', 108),
    new Country('Cambodia', 'KH', 'KHM', 116),
    new Country('Cameroon', 'CM', 'CMR', 120),
    new Country('Canada', 'CA', 'CAN', 124),
    new Country('Cape Verde', 'CV', 'CPV', 132),
    new Country('Cayman Islands', 'KY', 'CYM', 136),
    new Country('Central African Republic', 'CF', 'CAF', 140),
    new Country('Chad', 'TD', 'TCD', 148),
    new Country('Chile', 'CL', 'CHL', 152),
    new Country('China', 'CN', 'CHN', 156),
    new Country('Christmas Island', 'CX', 'CXR', 162),
    new Country('Cocos (Keeling) Islands', 'CC', 'CCK', 166),
    new Country('Colombia', 'CO', 'COL', 170),
    new Country('Comoros', 'KM', 'COM', 174),
    new Country('Congo (Brazzaville)', 'CG', 'COG', 178),
    new Country('Congo (Kinshasa)', 'CD', 'COD', 180),
    new Country('Cook Islands', 'CK', 'COK', 184),
    new Country('Costa Rica', 'CR', 'CRI', 188),
    new Country('Côte d\'Ivoire', 'CI', 'CIV', 384),
    new Country('Croatia', 'HR', 'HRV', 191),
    new Country('Cuba', 'CU', 'CUB', 192),
    new Country('Curaçao', 'CW', 'CUW', 531),
    new Country('Cyprus', 'CY', 'CYP', 196),
    new Country('Czech Republic', 'CZ', 'CZE', 203),
    new Country('Denmark', 'DK', 'DNK', 208),
    new Country('Djibouti', 'DJ', 'DJI', 262),
    new Country('Dominica', 'DM', 'DMA', 212),
    new Country('Dominican Republic', 'DO', 'DOM', 214),
    new Country('Ecuador', 'EC', 'ECU', 218),
    new Country('Egypt', 'EG', 'EGY', 818),
    new Country('El Salvador', 'SV', 'SLV', 222),
    new Country('Equatorial Guinea', 'GQ', 'GNQ', 226),
    new Country('Eritrea', 'ER', 'ERI', 232),
    new Country('Estonia', 'EE', 'EST', 233),
    new Country('Ethiopia', 'ET', 'ETH', 231),
    new Country('Falkland Islands', 'FK', 'FLK', 238),
    new Country('Faroe Islands', 'FO', 'FRO', 234),
    new Country('Fiji', 'FJ', 'FJI', 242),
    new Country('Finland', 'FI', 'FIN', 246),
    new Country('France', 'FR', 'FRA', 250),
    new Country('French Guiana', 'GF', 'GUF', 254),
    new Country('French Polynesia', 'PF', 'PYF', 258),
    new Country('French Southern Lands', 'TF', 'ATF', 260),
    new Country('Gabon', 'GA', 'GAB', 266),
    new Country('Gambia', 'GM', 'GMB', 270),
    new Country('Georgia', 'GE', 'GEO', 268),
    new Country('Germany', 'DE', 'DEU', 276),
    new Country('Ghana', 'GH', 'GHA', 288),
    new Country('Gibraltar', 'GI', 'GIB', 292),
    new Country('Greece', 'GR', 'GRC', 300),
    new Country('Greenland', 'GL', 'GRL', 304),
    new Country('Grenada', 'GD', 'GRD', 308),
    new Country('Guadeloupe', 'GP', 'GLP', 312),
    new Country('Guam', 'GU', 'GUM', 316),
    new Country('Guatemala', 'GT', 'GTM', 320),
    new Country('Guernsey', 'GG', 'GGY', 831),
    new Country('Guinea', 'GN', 'GIN', 324),
    new Country('Guinea-Bissau', 'GW', 'GNB', 624),
    new Country('Guyana', 'GY', 'GUY', 328),
    new Country('Haiti', 'HT', 'HTI', 332),
    new Country('Heard and McDonald Islands', 'HM', 'HMD', 334),
    new Country('Honduras', 'HN', 'HND', 340),
    new Country('Hong Kong', 'HK', 'HKG', 344),
    new Country('Hungary', 'HU', 'HUN', 348),
    new Country('Iceland', 'IS', 'ISL', 352),
    new Country('India', 'IN', 'IND', 356),
    new Country('Indonesia', 'ID', 'IDN', 360),
    new Country('Iran', 'IR', 'IRN', 364),
    new Country('Iraq', 'IQ', 'IRQ', 368),
    new Country('Ireland', 'IE', 'IRL', 372),
    new Country('Isle of Man', 'IM', 'IMN', 833),
    new Country('Israel', 'IL', 'ISR', 376),
    new Country('Italy', 'IT', 'ITA', 380),
    new Country('Jamaica', 'JM', 'JAM', 388),
    new Country('Japan', 'JP', 'JPN', 392),
    new Country('Jersey', 'JE', 'JEY', 832),
    new Country('Jordan', 'JO', 'JOR', 400),
    new Country('Kazakhstan', 'KZ', 'KAZ', 398),
    new Country('Kenya', 'KE', 'KEN', 404),
    new Country('Kiribati', 'KI', 'KIR', 296),
    new Country('Korea, North', 'KP', 'PRK', 408),
    new Country('Korea, South', 'KR', 'KOR', 410),
    new Country('Kuwait', 'KW', 'KWT', 414),
    new Country('Kyrgyzstan', 'KG', 'KGZ', 417),
    new Country('Laos', 'LA', 'LAO', 418),
    new Country('Latvia', 'LV', 'LVA', 428),
    new Country('Lebanon', 'LB', 'LBN', 422),
    new Country('Lesotho', 'LS', 'LSO', 426),
    new Country('Liberia', 'LR', 'LBR', 430),
    new Country('Libya', 'LY', 'LBY', 434),
    new Country('Liechtenstein', 'LI', 'LIE', 438),
    new Country('Lithuania', 'LT', 'LTU', 440),
    new Country('Luxembourg', 'LU', 'LUX', 442),
    new Country('Macau', 'MO', 'MAC', 446),
    new Country('Macedonia', 'MK', 'MKD', 807),
    new Country('Madagascar', 'MG', 'MDG', 450),
    new Country('Malawi', 'MW', 'MWI', 454),
    new Country('Malaysia', 'MY', 'MYS', 458),
    new Country('Maldives', 'MV', 'MDV', 462),
    new Country('Mali', 'ML', 'MLI', 466),
    new Country('Malta', 'MT', 'MLT', 470),
    new Country('Marshall Islands', 'MH', 'MHL', 584),
    new Country('Martinique', 'MQ', 'MTQ', 474),
    new Country('Mauritania', 'MR', 'MRT', 478),
    new Country('Mauritius', 'MU', 'MUS', 480),
    new Country('Mayotte', 'YT', 'MYT', 175),
    new Country('Mexico', 'MX', 'MEX', 484),
    new Country('Micronesia', 'FM', 'FSM', 583),
    new Country('Moldova', 'MD', 'MDA', 498),
    new Country('Monaco', 'MC', 'MCO', 492),
    new Country('Mongolia', 'MN', 'MNG', 496),
    new Country('Montenegro', 'ME', 'MNE', 499),
    new Country('Montserrat', 'MS', 'MSR', 500),
    new Country('Morocco', 'MA', 'MAR', 504),
    new Country('Mozambique', 'MZ', 'MOZ', 508),
    new Country('Myanmar', 'MM', 'MMR', 104),
    new Country('Namibia', 'NA', 'NAM', 516),
    new Country('Nauru', 'NR', 'NRU', 520),
    new Country('Nepal', 'NP', 'NPL', 524),
    new Country('Netherlands', 'NL', 'NLD', 528),
    new Country('New Caledonia', 'NC', 'NCL', 540),
    new Country('New Zealand', 'NZ', 'NZL', 554),
    new Country('Nicaragua', 'NI', 'NIC', 558),
    new Country('Niger', 'NE', 'NER', 562),
    new Country('Nigeria', 'NG', 'NGA', 566),
    new Country('Niue', 'NU', 'NIU', 570),
    new Country('Norfolk Island', 'NF', 'NFK', 574),
    new Country('Northern Mariana Islands', 'MP', 'MNP', 580),
    new Country('Norway', 'NO', 'NOR', 578),
    new Country('Oman', 'OM', 'OMN', 512),
    new Country('Pakistan', 'PK', 'PAK', 586),
    new Country('Palau', 'PW', 'PLW', 585),
    new Country('Palestine', 'PS', 'PSE', 275),
    new Country('Panama', 'PA', 'PAN', 591),
    new Country('Papua New Guinea', 'PG', 'PNG', 598),
    new Country('Paraguay', 'PY', 'PRY', 600),
    new Country('Peru', 'PE', 'PER', 604),
    new Country('Philippines', 'PH', 'PHL', 608),
    new Country('Pitcairn', 'PN', 'PCN', 612),
    new Country('Poland', 'PL', 'POL', 616),
    new Country('Portugal', 'PT', 'PRT', 620),
    new Country('Puerto Rico', 'PR', 'PRI', 630),
    new Country('Qatar', 'QA', 'QAT', 634),
    new Country('Reunion', 'RE', 'REU', 638),
    new Country('Romania', 'RO', 'ROU', 642),
    new Country('Russian Federation', 'RU', 'RUS', 643),
    new Country('Rwanda', 'RW', 'RWA', 646),
    new Country('Saint Barthélemy', 'BL', 'BLM', 652),
    new Country('Saint Helena', 'SH', 'SHN', 654),
    new Country('Saint Kitts and Nevis', 'KN', 'KNA', 659),
    new Country('Saint Lucia', 'LC', 'LCA', 662),
    new Country('Saint Martin (French part)', 'MF', 'MAF', 663),
    new Country('Saint Pierre and Miquelon', 'PM', 'SPM', 666),
    new Country('Saint Vincent and the Grenadines', 'VC', 'VCT', 670),
    new Country('Samoa', 'WS', 'WSM', 882),
    new Country('San Marino', 'SM', 'SMR', 674),
    new Country('Sao Tome and Principe', 'ST', 'STP', 678),
    new Country('Saudi Arabia', 'SA', 'SAU', 682),
    new Country('Senegal', 'SN', 'SEN', 686),
    new Country('Serbia', 'RS', 'SRB', 688),
    new Country('Seychelles', 'SC', 'SYC', 690),
    new Country('Sierra Leone', 'SL', 'SLE', 694),
    new Country('Singapore', 'SG', 'SGP', 702),
    new Country('Sint Maarten (Dutch part)', 'SX', 'SXM', 534),
    new Country('Slovakia', 'SK', 'SVK', 703),
    new Country('Slovenia', 'SI', 'SVN', 705),
    new Country('Solomon Islands', 'SB', 'SLB', 90),
    new Country('Somalia', 'SO', 'SOM', 706),
    new Country('South Africa', 'ZA', 'ZAF', 710),
    new Country('South Georgia and South Sandwich Islands', 'GS', 'SGS', 239),
    new Country('South Sudan', 'SS', 'SSD', 728),
    new Country('Spain', 'ES', 'ESP', 724),
    new Country('Sri Lanka', 'LK', 'LKA', 144),
    new Country('Sudan', 'SD', 'SDN', 736),
    new Country('Suriname', 'SR', 'SUR', 740),
    new Country('Svalbard and Jan Mayen Islands', 'SJ', 'SJM', 744),
    new Country('Swaziland', 'SZ', 'SWZ', 748),
    new Country('Sweden', 'SE', 'SWE', 752),
    new Country('Switzerland', 'CH', 'CHE', 756),
    new Country('Syria', 'SY', 'SYR', 760),
    new Country('Taiwan', 'TW', 'TWN', 158),
    new Country('Tajikistan', 'TJ', 'TJK', 762),
    new Country('Tanzania', 'TZ', 'TZA', 834),
    new Country('Thailand', 'TH', 'THA', 764),
    new Country('Timor-Leste', 'TL', 'TLS', 626),
    new Country('Togo', 'TG', 'TGO', 768),
    new Country('Tokelau', 'TK', 'TKL', 772),
    new Country('Tonga', 'TO', 'TON', 776),
    new Country('Trinidad and Tobago', 'TT', 'TTO', 780),
    new Country('Tunisia', 'TN', 'TUN', 788),
    new Country('Turkey', 'TR', 'TUR', 792),
    new Country('Turkmenistan', 'TM', 'TKM', 795),
    new Country('Turks and Caicos Islands', 'TC', 'TCA', 796),
    new Country('Tuvalu', 'TV', 'TUV', 798),
    new Country('Uganda', 'UG', 'UGA', 800),
    new Country('Ukraine', 'UA', 'UKR', 804),
    new Country('United Arab Emirates', 'AE', 'ARE', 784),
    new Country('United Kingdom', 'GB', 'GBR', 826),
    new Country('United States Minor Outlying Islands', 'UM', 'UMI', 581),
    new Country('United States of America', 'US', 'USA', 840),
    new Country('Uruguay', 'UY', 'URY', 858),
    new Country('Uzbekistan', 'UZ', 'UZB', 860),
    new Country('Vanuatu', 'VU', 'VUT', 548),
    new Country('Vatican City', 'VA', 'VAT', 336),
    new Country('Venezuela', 'VE', 'VEN', 862),
    new Country('Vietnam', 'VN', 'VNM', 704),
    new Country('Virgin Islands, British', 'VG', 'VGB', 92),
    new Country('Virgin Islands, U.S.', 'VI', 'VIR', 850),
    new Country('Wallis and Futuna Islands', 'WF', 'WLF', 876),
    new Country('Western Sahara', 'EH', 'ESH', 732),
    new Country('Yemen', 'YE', 'YEM', 887),
    new Country('Zambia', 'ZM', 'ZMB', 894),
    new Country('Zimbabwe', 'ZW', 'ZWE', 716)
];
function getCountry(code) {
    for (let i = 0; i < exports.Countries.length; i++) {
        const c = exports.Countries[i];
        if (c.code === code) {
            return c;
        }
    }
    return exports.Countries[0];
}
exports.getCountry = getCountry;
}
// default/data/onboarding.js
$fsx.f[71] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var OnboardingAt;
(function (OnboardingAt) {
    OnboardingAt[OnboardingAt['Start'] = 100] = 'Start';
    OnboardingAt[OnboardingAt['AddShape'] = 101] = 'AddShape';
    OnboardingAt[OnboardingAt['AddFills'] = 102] = 'AddFills';
    OnboardingAt[OnboardingAt['ChangeShape'] = 103] = 'ChangeShape';
    OnboardingAt[OnboardingAt['End'] = 104] = 'End';
}(OnboardingAt = exports.OnboardingAt || (exports.OnboardingAt = {})));
class Onboarding {
    constructor() {
        this.at = OnboardingAt.Start;
    }
    next() {
        if (this.at !== OnboardingAt.End) {
            this.at = this.at++;
        }
    }
    finish() {
        this.at = OnboardingAt.End;
    }
}
exports.Onboarding = Onboarding;
}
// default/dom.jsx
$fsx.f[72] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const common_1 = $fsx.r(73);
const editor_1 = $fsx.r(74);
const hud_1 = $fsx.r(164);
const scene_1 = $fsx.r(177);
var events_1 = $fsx.r(178);
exports.Events = events_1.Events;
var debug_1 = $fsx.r(191);
exports.Debug = debug_1.Debug;
const meander_1 = $fsx.r(192);
const engine_1 = $fsx.r(75);
var refresher_1 = $fsx.r(225);
exports.Refresher = refresher_1.Refresher;
var common_2 = $fsx.r(73);
exports.UpdateAction = common_2.UpdateAction;
const pattern_1 = $fsx.r(226);
function configEditorBtn(props, editorProps) {
    switch (props.state.ui.at) {
    case data_1.UIState.FillEditor:
        editorProps.actionLabel = props.state.ui.fillEditor.primaryActionTitle;
        editorProps.onAction = props.events.hudEvents.onSaveFill;
        break;
    case data_1.UIState.ShapeEditor:
        if (props.state.ui.shapeEditor.shapesD.length === 0) {
            editorProps.actionDisabled = true;
            editorProps.actionLabel = props.state.ui.shapeEditor.primaryActionTitle;
        } else if (props.state.ui.shapeEditor.editorMode === data_1.UIShapeEditorMode.Fill) {
            editorProps.actionLabel = props.state.ui.fillEditor.primaryActionTitle;
            editorProps.onAction = props.events.shapeEditorEvents.onFigureFillDone;
        } else {
            editorProps.actionLabel = props.state.ui.shapeEditor.primaryActionTitle;
            editorProps.onAction = props.events.hudEvents.onSaveShape;
        }
        break;
    case data_1.UIState.Export:
        editorProps.actionLabel = props.state.ui.exportEditor.primaryActionTitle;
        break;
    case data_1.UIState.Publish:
        editorProps.actionLabel = props.state.ui.publishEditor.primaryActionTitle;
        break;
    }
    return editorProps;
}
class GridGeneratorDOM extends inferno_1.Component {
    constructor(props, context) {
        super(props, context);
    }
    componentDidMount() {
        const domElem = document.getElementsByTagName('body')[0];
        common_1.addMouse(domElem, this.props.events);
        common_1.addTouch(domElem, this.props.events);
    }
    componentWillUnmount() {
        const domElem = document.getElementsByTagName('body')[0];
        common_1.removeMouse(domElem, this.props.events);
        common_1.removeTouch(domElem, this.props.events);
    }
    selectCursor(props, inProj) {
        return props.state.ui.cursorHandler.iconURL();
    }
    render() {
        const state = this.props.state;
        const project = this.props.projects.current;
        const events = this.props.events;
        const runtime = this.props.runtime;
        const cart = this.props.cart;
        const onboarding = this.props.onboarding;
        let editorZ = 'z-0';
        let sceneZ = 'z-1';
        let hudZ = 'z-2';
        if (this.props.state.ui.isEditorOnTop) {
            sceneZ = 'z-0';
            editorZ = 'z-2';
            hudZ = 'z-1';
        }
        const canCloseEditor = state.ui.isEditorOnTop || state.ui.isEnteringEditor;
        const hudProps = {
            title: state.ui.title,
            action: this.props.action,
            className: `absolute top-0 left-0 w-100 h-100 ${ hudZ }`,
            isLoggedIn: !(runtime.token === undefined || runtime.token === null),
            gotoLogin: events.meanderEvents.gotoLogin,
            ui: state.ui,
            editorShapes: state.ui.shapeEditor.shapesD,
            mediaSize: runtime.device.mediaSize,
            isShort: runtime.device.isShort,
            zoom: state.viewport.zoom,
            zoomMiddleAt: state.viewport.zoomMiddle,
            onSelectTool: events.hudEvents.onSelectTool,
            onClearAll: events.hudEvents.onClearAll,
            onNewFill: events.hudEvents.onNewFill,
            onNewShape: events.hudEvents.onNewShape,
            onFeaturesMenu: events.hudEvents.onFeaturesMenu,
            onSelectShape: events.hudEvents.onSelectShape,
            onSelectFill: events.hudEvents.onSelectFill,
            onSaveFill: events.hudEvents.onSaveFill,
            onSaveShape: events.hudEvents.onSaveShape,
            onFillDone: events.shapeEditorEvents.onFigureFillDone,
            onToggleGrid: events.sceneEvents.onGridToggle,
            onTogglePattern: events.hudEvents.onGridPattern,
            onExitGrid: events.hudEvents.onGridExit,
            onSceneMouseMove: events.sceneEvents.onMouseMove,
            onSceneMouseDown: events.sceneEvents.onMouseDown,
            onSceneMouseUp: events.sceneEvents.onMouseUp,
            onSceneTouchMove: events.sceneEvents.onTouchMove,
            onSceneTouchStart: events.sceneEvents.onTouchStart,
            onSceneTouchEnd: events.sceneEvents.onTouchEnd,
            onSceneTouchCancel: events.sceneEvents.onTouchCancel,
            onSceneZoomIn: events.sceneEvents.onZoomIn,
            onSceneZoomOut: events.sceneEvents.onZoomOut,
            btnVisible: false
        };
        if (canCloseEditor) {
            hudProps.onNewFill = events.hudEvents.onDiscardFill;
            hudProps.onNewShape = events.hudEvents.onDiscardShape;
        }
        const hres = runtime.device.mediaSize === engine_1.RuntimeMediaSize.Normal ? state.ui.shapeEditor.templateRes : Math.min(runtime.height - 200, state.ui.shapeEditor.templateRes);
        const editorSize = Math.min(Math.min(runtime.height, hres), Math.min(runtime.width, state.ui.shapeEditor.templateRes));
        let editorProps = {
            action: this.props.action,
            className: `absolute bottom-0 w-100 h-100 ${ editorZ }`,
            isPaidAccount: this.props.meander.isPaidAccount,
            onFeaturesMenu: events.hudEvents.onFeaturesMenu,
            project,
            fillEditor: state.ui.fillEditor,
            shapeEditor: state.ui.shapeEditor,
            exportEditor: state.ui.exportEditor,
            exportEditorEvents: events.exportEvents,
            publishEditor: state.ui.publishEditor,
            publishEditorEvents: events.publishEvents,
            productEditor: cart,
            productEvents: events.productEvents,
            playerData: this.props.player,
            playerEvents: this.props.events.playerEvents,
            shapeSize: editorSize,
            colorPickerEvents: events.colorPickerEvents,
            runtime,
            hudEvents: events.hudEvents,
            shapeEditorEvents: events.shapeEditorEvents,
            at: state.ui.at,
            actionLabel: 'Please wait',
            height: runtime.device.height,
            onAction: null,
            actionDisabled: false,
            templates: state.shapes.availableTemplates(),
            isEditorOnTop: state.ui.isEditorOnTop,
            isExitingEditor: state.ui.isExitingEditor,
            isEnteringEditor: state.ui.isEnteringEditor,
            onPublishSuccess: () => events.hudEvents.onExitFeatures(events.meanderEvents.gotoProjects),
            onExitFeatures: events.hudEvents.onExitFeatures,
            onExitShape: events.hudEvents.onDiscardShape,
            onExitFill: events.hudEvents.onDiscardFill,
            onPricing: e => {
                if (e) {
                    e.preventDefault();
                }
                events.hudEvents.onExitFeatures(events.meanderEvents.gotoPricing);
            }
        };
        editorProps = configEditorBtn(this.props, editorProps);
        const sceneProps = {
            className: `absolute top-0 left-0 ${ sceneZ }`,
            onContext: events.onWebGLInit,
            height: runtime.height,
            width: runtime.width,
            action: this.props.action
        };
        const inProj = this.props.meander.course === data_1.MeanderCourse.Project || this.props.meander.course === data_1.MeanderCourse.None;
        const meanderProps = {
            action: this.props.action,
            className: `${ inProj ? 'h3 children-o-0' : 'h-100 bg-meander children-o-100' } w-100 f1 ttu fixed z-4 bottom-0 children-opacity`,
            meander: this.props.meander,
            events: this.props.events.meanderEvents,
            isMenuHidden: state.ui.at !== data_1.UIState.Project,
            menu: state.ui.mainMenu,
            userId: runtime.token ? runtime.token.id : null,
            height: runtime.height,
            projects: this.props.projects.list(),
            currentProject: this.props.projects.current,
            playerState: this.props.player,
            playerEvents: this.props.events.playerEvents
        };
        const cursor = this.selectCursor(this.props, inProj);
        const isLoggedIn = this.props.projects.size > 0 && this.props.meander.profile.created && this.props.runtime.token;
        const pattern = state.pattern;
        return createVNode(1, 'div', null, [
            normalizeProps(createComponentVNode(2, scene_1.Scene, Object.assign({}, sceneProps), null, { 'onComponentShouldUpdate': this.props.events.shouldUpdateScene })),
            pattern && !canCloseEditor ? createComponentVNode(2, pattern_1.Pattern, {
                'action': this.props.action,
                'className': 'absolute absolute top-0 left-0 z-1',
                'w': runtime.width,
                'h': runtime.height,
                'startPosX': pattern.screenStartX,
                'startPosY': pattern.screenStartY,
                'endPosX': pattern.screenEndX,
                'endPosY': pattern.screenEndY,
                'unitSize': state.viewport.unitSize
            }, null, { 'onComponentShouldUpdate': this.props.events.shouldUpdatePattern }) : createVNode(1, 'div'),
            normalizeProps(createComponentVNode(2, hud_1.HUD, Object.assign({}, hudProps), null, { 'onComponentShouldUpdate': this.props.events.shouldUpdateHUD })),
            normalizeProps(createComponentVNode(2, editor_1.Editor, Object.assign({}, editorProps), null, { 'onComponentShouldUpdate': this.props.events.shouldUpdateEditor })),
            normalizeProps(createComponentVNode(2, meander_1.MeanderFull, Object.assign({}, meanderProps), null, { 'onComponentShouldUpdate': this.props.events.shouldUpdateMeander }))
        ], 0, { 'style': { cursor } });
    }
}
exports.GridGeneratorDOM = GridGeneratorDOM;
}
// default/dom/common.js
$fsx.f[73] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
function getEventX(e) {
    if (e.touches) {
        const i = e.touches.item(0);
        if (i) {
            return i.clientX;
        } else {
            return -1;
        }
    }
    return e.clientX || e.layerX;
}
exports.getEventX = getEventX;
function getEventY(e) {
    if (e.touches) {
        const i = e.touches.item(0);
        if (i) {
            return i.clientY;
        } else {
            return -1;
        }
    }
    return e.clientY || e.layerY;
}
exports.getEventY = getEventY;
function downloadFile(fileContents, filename) {
    const filetype = 'text/plain';
    const a = document.createElement('a');
    const dataURI = 'data:' + filetype + ';base64,' + btoa(fileContents);
    a.href = dataURI;
    a.download = filename;
    const e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, document.defaultView, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
}
exports.downloadFile = downloadFile;
function svgInit(className, size, zoom, margin = 10) {
    const m = margin;
    const dimension = zoom !== 0 ? `${ size * zoom }px` : `${ size }px`;
    return {
        baseProfile: 'basic',
        className,
        height: dimension,
        version: '1.1',
        viewBox: `${ -m / 2 } ${ -m / 2 } ${ size + m } ${ size + m }`,
        width: dimension,
        xmlns: 'http://www.w3.org/2000/svg'
    };
}
function loadScript(src, id) {
    const tag = document.createElement('script');
    if (id) {
        const elem = document.getElementById(id);
        if (elem) {
            return Promise.resolve({});
        }
        tag.id = id;
    }
    tag.async = false;
    tag.src = src;
    const p = new Promise((resolve, reject) => {
        tag.onload = () => {
            setTimeout(1750, resolve);
        };
        tag.onerror = reject;
    });
    document.getElementsByTagName('body')[0].appendChild(tag);
    return p;
}
exports.loadScript = loadScript;
exports.doNothing = e => e.stopPropagation();
exports.justClick = {
    onmousemove: exports.doNothing,
    onmousedown: exports.doNothing,
    onmouseup: exports.doNothing,
    ontouchstart: exports.doNothing,
    ontouchmove: exports.doNothing,
    ontouchend: exports.doNothing,
    ontouchcancel: exports.doNothing
};
function addMouse(elem, obj, addDown = true) {
    elem.addEventListener('mousemove', obj.onMouseMove);
    elem.addEventListener('mouseup', obj.onMouseUp);
    if (addDown) {
        elem.addEventListener('mousedown', obj.onMouseDown);
    }
}
exports.addMouse = addMouse;
function removeMouse(elem, obj, removeDown = true) {
    elem.removeEventListener('mousemove', obj.onMouseMove);
    elem.removeEventListener('mouseup', obj.onMouseUp);
    if (removeDown) {
        elem.removeEventListener('mousedown', obj.onMouseDown);
    }
}
exports.removeMouse = removeMouse;
function addTouch(elem, obj, addStart = true) {
    if (addStart) {
        elem.addEventListener('touchstart', obj.onTouchStart);
    }
    elem.addEventListener('touchmove', obj.onTouchMove);
    elem.addEventListener('touchend', obj.onTouchEnd);
    elem.addEventListener('touchcancel', obj.onTouchCancel);
}
exports.addTouch = addTouch;
function removeTouch(elem, obj, removeStart = true) {
    if (removeStart) {
        elem.removeEventListener('touchstart', obj.onTouchStart);
    }
    elem.removeEventListener('touchmove', obj.onTouchMove);
    elem.removeEventListener('touchend', obj.onTouchEnd);
    elem.removeEventListener('touchcancel', obj.onTouchCancel);
}
exports.removeTouch = removeTouch;
var UpdateAction;
(function (UpdateAction) {
    UpdateAction['All'] = 'All';
    UpdateAction['Pan'] = 'Pan';
}(UpdateAction = exports.UpdateAction || (exports.UpdateAction = {})));
}
// default/dom/components/editor.jsx
$fsx.f[74] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const buttons_1 = $fsx.r(106);
const new_close_1 = $fsx.r(107);
const color_picker_1 = $fsx.r(108);
const export_1 = $fsx.r(116);
const product_1 = $fsx.r(126);
const publish_1 = $fsx.r(135);
const preview_1 = $fsx.r(151);
const shape_editor_1 = $fsx.r(154);
const template_picker_1 = $fsx.r(162);
function selectEditor(props, colorPickerProps, shapeEditorProps, templateProps, exportProps, publishProps, productProps) {
    switch (props.at) {
    case data_1.UIState.ShapeEditor:
        switch (props.shapeEditor.editorMode) {
        case data_1.UIShapeEditorMode.Fill:
            return normalizeProps(createComponentVNode(2, color_picker_1.ColorPicker, Object.assign({}, colorPickerProps)));
        case data_1.UIShapeEditorMode.TemplateSelector:
            return normalizeProps(createComponentVNode(2, template_picker_1.TemplatePicker, Object.assign({}, templateProps)));
        default:
            return normalizeProps(createComponentVNode(2, shape_editor_1.ShapeEditor, Object.assign({}, shapeEditorProps)));
        }
    case data_1.UIState.FillEditor:
        return normalizeProps(createComponentVNode(2, color_picker_1.ColorPicker, Object.assign({}, colorPickerProps)));
    case data_1.UIState.Export:
        return normalizeProps(createComponentVNode(2, export_1.Export, Object.assign({}, exportProps, { 'height': props.height }), null, { 'onComponentDidMount': exportProps.events.onExportInit }));
    case data_1.UIState.Publish:
        return normalizeProps(createComponentVNode(2, publish_1.Publish, Object.assign({}, publishProps, { 'height': props.height })));
    case data_1.UIState.PublishPreview:
        return createComponentVNode(2, preview_1.PublishPreview, {
            'project': props.project,
            'onExit': props.onPublishSuccess,
            'height': props.height
        });
    case data_1.UIState.Product:
        return normalizeProps(createComponentVNode(2, product_1.Product, Object.assign({}, productProps), null, { 'onComponentDidMount': productProps.events.onProductInit }));
    default:
        return createVNode(1, 'div');
    }
}
exports.Editor = props => {
    const isNotSmall = props.runtime.device.mediaSize !== engine_1.RuntimeMediaSize.Normal;
    const colorPickerProps = {
        className: '',
        fillEditor: props.fillEditor,
        colorPickerEvents: props.colorPickerEvents,
        runtime: props.runtime,
        onPrimary: props.hudEvents.onSaveFill,
        onShapePathSelect: props.colorPickerEvents.onChangeFillId
    };
    const shapeEditorProps = {
        className: '',
        shapeEditor: props.shapeEditor,
        size: props.shapeSize,
        isNotSmall,
        onPointAction: props.shapeEditorEvents.onPointAction,
        onShapeMount: props.shapeEditorEvents.onShapeMount,
        onReverseAction: props.shapeEditorEvents.onReverseTo,
        onSolveAmbiguity: props.shapeEditorEvents.onSolveAmbiguity,
        onFigureSelect: props.shapeEditorEvents.onFigureSelect,
        onFigureDelete: props.shapeEditorEvents.onFigureDelete,
        onFigureEdit: props.shapeEditorEvents.onFigureEdit,
        onFigureFill: props.shapeEditorEvents.onFigureFill,
        onEnterTemplateSelector: props.shapeEditorEvents.onEnterTemplateSelector
    };
    const templatePickerProps = {
        className: '',
        templates: props.templates,
        onCancel: props.shapeEditorEvents.onExitTemplateSelector,
        onTemplateSelect: props.shapeEditorEvents.onTemplateSelect
    };
    const exportProps = {
        className: '',
        data: props.exportEditor,
        events: props.exportEditorEvents,
        playerData: props.playerData,
        playerEvents: props.playerEvents,
        onExit: props.onExitFeatures
    };
    const publishProps = {
        className: '',
        data: props.publishEditor,
        events: props.publishEditorEvents,
        onExit: props.onExitFeatures,
        isPaidAccount: props.isPaidAccount
    };
    const productProps = {
        className: '',
        data: props.productEditor,
        events: props.productEvents,
        height: props.height,
        onExit: props.onExitFeatures
    };
    const isFillEditor = props.at === data_1.UIState.FillEditor;
    return createVNode(1, 'div', `Editor ${ props.className || '' }`, [
        selectEditor(props, colorPickerProps, shapeEditorProps, templatePickerProps, exportProps, publishProps, productProps),
        props.at === data_1.UIState.FillEditor || props.at === data_1.UIState.ShapeEditor ? createVNode(1, 'div', `w-100 flex items-center justify-center editormw-ns fixed bottom-1`, [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'center',
                'label': props.actionLabel,
                'onAction': props.actionDisabled ? null : props.onAction,
                'disabled': props.actionDisabled
            }, `btn-at-${ props.at }`),
            createComponentVNode(2, new_close_1.NewCloseBtn, {
                'className': `w2 h2 fixed mb4 bottom-2 ${ isFillEditor ? 'right-1' : 'left-1' }`,
                'big': false,
                'rotated': props.isEditorOnTop || props.isEnteringEditor,
                'onAction': isFillEditor ? props.onExitFill : props.onExitShape
            }, `btn-at-${ props.at }-close`)
        ], 4) : createVNode(1, 'div')
    ], 0);
};
}
// default/engine.js
$fsx.f[75] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var runtime_1 = $fsx.r(76);
exports.Runtime = runtime_1.Runtime;
exports.RuntimeMediaSize = runtime_1.RuntimeMediaSize;
var movement_1 = $fsx.r(87);
exports.Movement = movement_1.Movement;
var context_1 = $fsx.r(85);
exports.toCanvasCtx = context_1.toCanvasCtx;
exports.toWebGLCtx = context_1.toWebGLCtx;
exports.toColorPickerCanvasCtx = context_1.toColorPickerCanvasCtx;
var color_canvas_painter_1 = $fsx.r(89);
exports.ColorCanvasPainter = color_canvas_painter_1.ColorCanvasPainter;
var player_canvas_painter_1 = $fsx.r(90);
exports.PlayerCanvasPainter = player_canvas_painter_1.PlayerCanvasPainter;
var scene_painter_1 = $fsx.r(91);
exports.ScenePainter = scene_painter_1.ScenePainter;
var clipspace_1 = $fsx.r(77);
exports.ClipSpace = clipspace_1.ClipSpace;
var net_1 = $fsx.r(97);
exports.Net = net_1.Net;
var token_1 = $fsx.r(105);
exports.Token = token_1.Token;
}
// default/engine/runtime.js
$fsx.f[76] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const clipspace_1 = $fsx.r(77);
const device_1 = $fsx.r(78);
const dom_rects_1 = $fsx.r(79);
const initialStateWorker_1 = $fsx.r(80);
const loading_1 = $fsx.r(81);
const texture_manager_1 = $fsx.r(82);
var device_2 = $fsx.r(78);
exports.RuntimeMediaSize = device_2.RuntimeMediaSize;
class Runtime {
    constructor(state) {
        this.loading = new loading_1.Loading();
        this.colorPickerCtx = null;
        this.webglCtx = null;
        this.playerCtx = null;
        this.rnd = new data_1.RandomArray();
        this.device = new device_1.Device();
        this.rects = new dom_rects_1.DOMRects();
        this.movement = null;
        this.initialStateWorker = new initialStateWorker_1.InitialStateWorker();
        this.textures = null;
        this.clipSpace = new clipspace_1.ClipSpace(this.device.width, this.device.height, state.viewport.minSize);
    }
    get width() {
        return this.device.width;
    }
    get height() {
        return this.device.height;
    }
    setInitialState(s) {
        this.initialStateWorker.setInitialState(s);
    }
    getInitialState() {
        return this.initialStateWorker.getInitialState();
    }
    static newProject(rt, state) {
        if (rt.webglCtx) {
            return Runtime.resetClipSpace(rt, state);
        }
        return Promise.resolve(rt);
    }
    static setColorPickerCtx(rt, context) {
        rt.colorPickerCtx = context;
        return rt;
    }
    static unsetColorPickerCtx(rt) {
        rt.colorPickerCtx = null;
        return rt;
    }
    static setPlayerCtx(rt, context) {
        rt.playerCtx = context;
        return rt;
    }
    static unsetPlayerCtx(rt) {
        rt.playerCtx = null;
        return rt;
    }
    static setWebGLCtx(rt, ctx, maxSize) {
        if (!rt.textureCanvas) {
            const size = ctx.ratio * maxSize;
            rt.textureImg = new Image(size, size);
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            rt.textureCanvas = canvas.getContext('2d');
        }
        rt.webglCtx = ctx;
        return rt;
    }
    static resetClipSpace(rt, state, dontTexturize) {
        const error = 'Cannot reset clip space because runtime has no TextureManager defined';
        const r = new Promise((resolve, reject) => {
            if (!dontTexturize) {
                rt.updateAllTextures(state).then(ta => {
                    if (rt.textures) {
                        rt.clipSpace.fromGrid(state.viewport, state.currentLayer, rt.textures);
                        resolve(rt);
                    } else {
                        reject(error);
                    }
                });
            } else {
                if (!rt.textures) {
                    reject(error);
                } else {
                    rt.clipSpace.fromGrid(state.viewport, state.currentLayer, rt.textures);
                    resolve(rt);
                }
            }
        });
        return r;
    }
    static texturize(rt, shapeId, shapeFillId, svg, isUpdate = false) {
        if (!rt.webglCtx) {
            console.trace();
            throw new Error(`Cannot texturize: No WebGL context available in the runtime`);
        } else if (!rt.textureCanvas) {
            console.trace();
            throw new Error(`Cannot texturize: No texture canvas context available in the runtime`);
        } else if (!rt.textureImg) {
            console.trace();
            throw new Error(`Cannot texturize: No texture image available in the runtime`);
        }
        const canvas = rt.textureCanvas;
        const img = rt.textureImg;
        const gl = rt.webglCtx.ctx;
        if (!rt.textures) {
            throw new Error('Trying to texturize without a valid TextureManager');
        }
        if (isUpdate) {
            return rt.textures.updateTexture(img, canvas, shapeId, shapeFillId, svg);
        } else {
            return rt.textures.texturize(img, canvas, shapeId, shapeFillId, svg);
        }
    }
    getTextureSize(v) {
        return v.maxSize;
    }
    updateAllTextures(state) {
        if (!this.webglCtx) {
            console.trace();
            throw new Error('Cannot updateAllTextures without a WebGL context');
        }
        const result = [];
        const ids = new Array();
        const size = this.getTextureSize(state.viewport);
        if (this.textures) {
            this.textures.resetUnits();
        } else {
            this.textures = new texture_manager_1.TextureManager(this.device.dpr / 100, size, this.webglCtx.maxNumTextures, this.webglCtx.maxTextureSize / 4);
        }
        for (const [shapeId, shape] of state.shapes.entries()) {
            for (const [shapeFillSetId, fillMap] of shape.entries()) {
                ids.push([
                    shapeId,
                    shapeFillSetId,
                    state.fills.buildSVG(shape.resolution, fillMap, size, size)
                ]);
            }
        }
        const r = new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const [shapeId, shapeFillId, svg] of ids) {
                yield Runtime.texturize(this, shapeId, shapeFillId, svg);
            }
            if (!this.textures || !this.webglCtx) {
                reject('TextureManager is not present');
            } else {
                this.textures.uploadToVRAM(this.webglCtx.ctx).then(resolve);
            }
        }));
        return r;
    }
    addTexture(shapeId, shapeFillId, svg) {
        return Runtime.texturize(this, shapeId, shapeFillId, svg).then(() => {
            if (!this.textures || !this.webglCtx) {
                return Promise.resolve([]);
            }
            return this.textures.uploadToVRAM(this.webglCtx.ctx);
        });
    }
    updateTexture(shapeId, shapeFillId, svg) {
        return Runtime.texturize(this, shapeId, shapeFillId, svg, true).then(() => {
            if (!this.textures || !this.webglCtx) {
                return Promise.resolve([]);
            }
            return this.textures.uploadToVRAM(this.webglCtx.ctx);
        }, error => console.log('GOT error updating texture', error));
    }
}
exports.Runtime = Runtime;
}
// default/engine/runtime/clipspace.js
$fsx.f[77] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class ClipSpace {
    constructor(width, height, minItemSize) {
        const totalSquaresH = Math.ceil(width / minItemSize) + 2;
        const totalSquaresV = Math.ceil(height / minItemSize) + 1;
        const length = totalSquaresH * totalSquaresV;
        this.length = length;
        this.rotation = new Array(length);
        this.textures = new Array(length);
        this.uv = [new Array(length)];
        for (let i = 0; i < length; i++) {
            this.textures[i] = new Array(0, 0);
        }
        this.w = width;
        this.h = height;
    }
    static gridUnitIndex(x, y, width, v) {
        const u = v.unitSize;
        const numLineUnits = Math.ceil(width / u) + 2;
        return x + y * numLineUnits + 1;
    }
    static gridIndex(absX, absY, view, width) {
        const x = view.squareX(absX);
        const y = view.squareY(absY);
        const i = this.gridUnitIndex(x, y, width, view);
        return i;
    }
    deleteAt(sqIndex, shapeId, shapeFillSetId, gpuTextures) {
        this.textures[sqIndex][0] = 0;
        this.textures[sqIndex][1] = 0;
        this.rotation[sqIndex] = 0;
        const unitIndex = gpuTextures.getUnitIndex(shapeId, shapeFillSetId);
        this.uv[unitIndex][sqIndex] = undefined;
    }
    paintAt(sqIndex, shapeId, shapeFillSetId, rotation, gpuTextures) {
        if (!this.textures[sqIndex]) {
            return;
        }
        this.textures[sqIndex][0] = shapeId;
        this.textures[sqIndex][1] = shapeFillSetId;
        this.rotation[sqIndex] = rotation;
        const unitIndex = gpuTextures.getUnitIndex(shapeId, shapeFillSetId);
        if (this.uv.length <= unitIndex) {
            this.newUVArray();
        }
        const uvInfo = gpuTextures.getUV(shapeId, shapeFillSetId, unitIndex);
        this.uv[unitIndex][sqIndex] = uvInfo;
    }
    newUVArray() {
        return this.uv.push(new Array(length));
    }
    clearTextures() {
        for (let i = 0; i < this.textures.length; i++) {
            this.textures[i][0] = 0;
            this.textures[i][1] = 0;
        }
        for (let u = 0; u < this.uv.length; u++) {
            this.uv[u] = new Array(this.length);
        }
    }
    fromGrid(v, grid, gpuTextures, isPatternOn) {
        this.clearTextures();
        const u = v.unitSize;
        const totalHorizSq = Math.ceil(this.w / u) + 2;
        const totalVertSq = Math.ceil(this.h / u) + 2;
        const initX = v.squareLayerX();
        const initY = v.squareLayerY();
        const usePattern = isPatternOn;
        for (let x = 0; x < totalHorizSq; x++) {
            for (let y = 0; y < totalVertSq; y++) {
                let atX = initX + x;
                let atY = initY + y;
                if (usePattern && grid.pattern) {
                    atX = grid.pattern.getX(atX);
                    atY = grid.pattern.getY(atY);
                }
                const elem = grid.getElementAt(atX, atY);
                if (!elem) {
                    continue;
                }
                const uIndex = ClipSpace.gridUnitIndex(x, y, this.w, v);
                this.paintAt(uIndex, elem.shapeId, elem.fillSetId, elem.rotation, gpuTextures);
            }
        }
    }
}
exports.ClipSpace = ClipSpace;
}
// default/engine/runtime/device.js
$fsx.f[78] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var RuntimeMediaSize;
(function (RuntimeMediaSize) {
    RuntimeMediaSize[RuntimeMediaSize['Normal'] = 1] = 'Normal';
    RuntimeMediaSize[RuntimeMediaSize['NotSmall'] = 30] = 'NotSmall';
    RuntimeMediaSize[RuntimeMediaSize['Large'] = 60] = 'Large';
}(RuntimeMediaSize = exports.RuntimeMediaSize || (exports.RuntimeMediaSize = {})));
class Device {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.isUsingMouse = true;
        this.dpr = Math.round(window.devicePixelRatio * 100);
        const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize || '16px');
        if (this.width > fontSize * RuntimeMediaSize.NotSmall) {
            this.mediaSize = RuntimeMediaSize.NotSmall;
            if (this.width > fontSize * RuntimeMediaSize.Large) {
                this.mediaSize = RuntimeMediaSize.Large;
            }
        } else {
            this.mediaSize = RuntimeMediaSize.Normal;
        }
        this.hasSystemColorPicker = Device.hasSystemColorPicker();
        this.isInPortrait = this.width < this.height;
        this.isShort = this.height < 560 && this.isInPortrait || this.width < 560 && !this.isInPortrait;
    }
    static hasSystemColorPicker() {
        const i = document.createElement('input');
        i.setAttribute('type', 'color');
        return i.type !== 'text';
    }
}
exports.Device = Device;
}
// default/engine/runtime/dom_rects.js
$fsx.f[79] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class DOMRects {
    shapeEditorRect() {
        const possibleElems = document.getElementsByClassName('ShapeGrid');
        if (possibleElems.length < 1) {
            throw new Error('Cannot get bounding rect: .ShapeGrid element not found');
        }
        const shapeElem = possibleElems[0];
        this.shapeEditor = shapeElem.getBoundingClientRect();
        return this.shapeEditor;
    }
    playerRect() {
        const possibleElems = document.getElementsByClassName('PlayerCanvas');
        if (possibleElems.length < 1) {
            throw new Error('Cannot get bounding rect: .PlayerCanvas element not found');
        }
        const playerElem = possibleElems[0];
        this.player = playerElem.getBoundingClientRect();
        return this.player;
    }
    posterAreaRect() {
        const areaElem = document.getElementById('posterDrawArea');
        if (!areaElem) {
            throw new Error('Cannot get bounding rect: #drawArea element not found');
        }
        this.posterArea = areaElem.getBoundingClientRect();
        return this.posterArea;
    }
    tshirtAreaRect() {
        const areaElem = document.getElementById('tshirtDrawArea');
        if (!areaElem) {
            throw new Error('Cannot get bounding rect: #drawArea element not found');
        }
        this.tshirtArea = areaElem.getBoundingClientRect();
        return this.tshirtArea;
    }
    colorPickerRect() {
        const possibleElems = document.getElementsByClassName('ColorCanvas');
        if (possibleElems.length < 1) {
            throw new Error('Cannot get bounding rect: .ColorCanvas element not found');
        }
        const colorPickerElem = possibleElems[0];
        this.colorPicker = colorPickerElem.getBoundingClientRect();
        return this.colorPicker;
    }
    isInside(x, y, r) {
        const xInside = x >= r.left && x <= r.left + r.width;
        const yInside = y >= r.top && y <= r.top + r.height;
        return xInside && yInside;
    }
}
exports.DOMRects = DOMRects;
}
// default/engine/runtime/initialStateWorker.js
$fsx.f[80] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
class InitialStateWorker {
    constructor() {
        const workerCode = new Blob([`
		let initialState = null;
		onmessage = function(e) {
			if (e.data === 'GET') {
				self.postMessage({ initialState });
			} else {
				// set the initial state
				initialState = e.data.initialState;
			}
		}
		`], { type: 'text/javascript' });
        this.worker = new Worker(window.URL.createObjectURL(workerCode));
    }
    setInitialState(s) {
        this.worker.postMessage({ initialState: s.toJSON() });
    }
    getInitialState() {
        return new Promise((resolve, reject) => {
            this.worker.onmessage = null;
            this.worker.onmessage = e => {
                if (e.data.initialState) {
                    resolve(data_1.State.revive(e.data.initialState));
                } else {
                    reject('Could not find initialState');
                }
            };
            this.worker.postMessage('GET');
        });
    }
}
exports.InitialStateWorker = InitialStateWorker;
}
// default/engine/runtime/loading.js
$fsx.f[81] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Loading {
    constructor() {
        this.initElems();
        this._isLoadingFullscreen = true;
    }
    get isLoadingFullscreen() {
        return this._isLoadingFullscreen;
    }
    initElems() {
        this.fullElem = document.getElementById('loading');
    }
    startFullscreen() {
        const elem = this.fullElem;
        if (elem && !this._isLoadingFullscreen) {
            this._isLoadingFullscreen = true;
            elem.classList.remove('o-0');
            elem.classList.add('o-100');
            elem.classList.add('blur-6');
            elem.classList.remove('dn');
            elem.classList.add('flex');
            return new Promise(resolve => {
                this.fullAnim = setTimeout(() => {
                    this.fullAnim = null;
                    resolve(this);
                }, 250);
            });
        } else {
            this.initElems();
            return Promise.resolve(this);
        }
    }
    stopFullscreen() {
        const elem = this.fullElem;
        if (elem) {
            elem.classList.remove('o-100');
            elem.classList.remove('o-90');
            elem.classList.add('o-0');
            const mainElem = document.getElementById('app');
            if (mainElem) {
                mainElem.classList.remove('blur-6');
            }
            return new Promise(resolve => {
                this.fullAnim = setTimeout(() => {
                    elem.classList.remove('flex');
                    elem.classList.add('dn');
                    this.fullAnim = null;
                    this._isLoadingFullscreen = false;
                    resolve(this);
                }, 250);
            });
        } else {
            this.initElems();
            return Promise.resolve(this);
        }
    }
}
exports.Loading = Loading;
}
// default/engine/runtime/texture_manager.js
$fsx.f[82] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const texture_atlas_1 = $fsx.r(83);
class TextureManager {
    constructor(dpr, singleTextureSize, textureUnits, maxTextureSize) {
        this.singleTextureSize = singleTextureSize;
        this.textureUnitsNum = textureUnits;
        this.atlasTextureSize = maxTextureSize;
        this.dpr = dpr;
        this.emptyAtlas = new Uint8Array(maxTextureSize * maxTextureSize * 4);
        this.emptySingleTexture = new Uint8Array(singleTextureSize * singleTextureSize * 4);
        this.idUnit = new data_1.VectorMap();
        this.units = [new texture_atlas_1.TextureAtlas(this.dpr, this.singleTextureSize, this.atlasTextureSize, 0, this.emptyAtlas)];
    }
    getUnitIndex(shapeId, fillSetId) {
        for (let i = 0; i < this.units.length; i++) {
            const curUnit = this.units[i];
            if (curUnit.indices.hasXY(shapeId, fillSetId)) {
                return i;
            }
        }
        throw new Error(`No Texture for shapeId ${ shapeId } and fillSetId ${ fillSetId }`);
    }
    getUV(shapeId, fillSetId, unitIndex) {
        return this.units[unitIndex].getUV(shapeId, fillSetId);
    }
    getGLTexture(unitIndex) {
        const texture = this.units[unitIndex].texture;
        if (!texture) {
            throw new Error(`No GL Texture for the unit index ${ unitIndex }`);
        }
        return texture;
    }
    resetUnits() {
        for (let i = 0; i < this.units.length; i++) {
            this.units[i].reset(this.emptyAtlas);
        }
    }
    texturize(img, canvas, shapeId, shapeFillId, svg) {
        let curUnit = this.units.length - 1;
        if (!this.units[curUnit].hasSpace) {
            this.units.push(new texture_atlas_1.TextureAtlas(this.dpr, this.singleTextureSize, this.atlasTextureSize, curUnit + 1, this.emptyAtlas));
            curUnit++;
        }
        return this.units[curUnit].addSvg(new data_1.Vector2D(shapeId, shapeFillId), svg, img, canvas);
    }
    updateTexture(img, canvas, shapeId, shapeFillId, svg) {
        for (let i = 0; i < this.units.length; i++) {
            const unit = this.units[i];
            if (unit.hasId(shapeId, shapeFillId)) {
                return unit.updateSVG(new data_1.Vector2D(shapeId, shapeFillId), svg, img, canvas);
            }
        }
        return Promise.reject(`No unit found for the provided id ${ shapeId } and fill ${ shapeFillId }`);
    }
    uploadToVRAM(gl) {
        const result = [];
        for (let i = 0; i < this.units.length; i++) {
            result.push(this.units[i].toGPU(gl));
        }
        return Promise.all(result);
    }
}
exports.TextureManager = TextureManager;
}
// default/engine/runtime/texture_atlas.js
$fsx.f[83] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const helpersgl_1 = $fsx.r(84);
const texture_actions_1 = $fsx.r(86);
class TextureAtlas {
    constructor(dpr, svgSize, glTextureSize, unitIndex, emptyAtlas) {
        this.unitIndex = unitIndex;
        this.dpr = dpr;
        this.texturesPerLine = glTextureSize / svgSize;
        this.maxTextures = this.texturesPerLine * this.texturesPerLine;
        this.uvCoords = new Array(this.maxTextures);
        console.log(`Texture size ${ svgSize }px (max ${ glTextureSize }), texturesPerLine ${ this.texturesPerLine }, maxTextures: ${ this.maxTextures }`);
        this.ids = new Array(this.maxTextures);
        const p = new Promise((resolve, reject) => {
            for (let i = 0; i < this.maxTextures; i++) {
                this.ids[i] = new Array(2);
                this.uvCoords[i] = new Float32Array(4);
            }
        });
        this.svgs = new Array(this.maxTextures);
        this.at = 0;
        this.svgSize = svgSize;
        this.indices = new data_1.VectorMap();
        this.changed = true;
        this.changes = [new texture_actions_1.TextureChangeAlloc(emptyAtlas, glTextureSize, glTextureSize)];
    }
    textureCoords(index) {
        return new data_1.Vector2D(index % this.texturesPerLine * this.svgSize, Math.floor(index / this.texturesPerLine) * this.svgSize);
    }
    get hasSpace() {
        return this.at < this.maxTextures - 1;
    }
    getUV(shapeId, shapeFillId) {
        const i = this.indices.getXY(shapeId, shapeFillId);
        if (i === undefined) {
            console.trace();
            throw new Error(`Cannot get Texture uvCoords for shapeId ${ shapeId } and shapeFillID ${ shapeFillId }: no index found`);
        }
        if (!this.uvCoords) {
            console.trace();
            throw new Error(`Texture uvCoords is not defined (when trying to get the coords for shapeId ${ shapeId } and shapeFillID ${ shapeFillId })\nPlease call toGPU() before accessing uvCoords[]`);
        }
        return this.uvCoords[i];
    }
    hasId(shapeId, shapeFillId) {
        return this.indices.hasXY(shapeId, shapeFillId);
    }
    renderToArray(svg, img, ctx) {
        return new Promise((resolve, reject) => {
            img.src = `data:image/svg+xml,${ svg }`;
            img.onload = () => {
                if (ctx) {
                    ctx.clearRect(0, 0, this.svgSize, this.svgSize);
                    ctx.drawImage(img, 0, 0, this.svgSize, this.svgSize);
                    const d = ctx.getImageData(0, 0, this.svgSize, this.svgSize);
                    resolve(new Uint8Array(d.data.copyWithin(0, 0)));
                }
            };
            img.onerror = e => reject(e.message);
        });
    }
    addSvg(id, svg, img, ctx) {
        return new Promise((resolve, reject) => {
            if (this.indices.has(id)) {
                reject('Texture already present');
            }
            this.ids[this.at][0] = id.x;
            this.ids[this.at][1] = id.y;
            this.renderToArray(svg, img, ctx).then(arrData => {
                this.svgs[this.at] = arrData;
                this.indices.addValue(id, this.at);
                const index = this.at;
                this.at++;
                const num = this.texturesPerLine;
                const uvLen = 1 / num;
                const ammount = this.maxTextures;
                const u = index % num * uvLen;
                const v = Math.floor(index / num) * uvLen;
                this.uvCoords[index][0] = u;
                this.uvCoords[index][1] = v;
                this.uvCoords[index][2] = uvLen;
                this.uvCoords[index][3] = this.unitIndex;
                this.changed = true;
                this.changes.push(new texture_actions_1.TextureChangeUpdate(this.svgSize, this.textureCoords(index), arrData));
                resolve(this);
            }, reject);
        });
    }
    updateSVG(id, svg, img, ctx) {
        return new Promise((resolve, reject) => {
            this.renderToArray(svg, img, ctx).then(arrData => {
                const index = this.indices.get(id);
                if (!index) {
                    reject('Texture not present. Cannot update it.');
                    return;
                }
                this.svgs[index] = arrData;
                this.changed = true;
                this.changes.push(new texture_actions_1.TextureChangeUpdate(this.svgSize, this.textureCoords(index), arrData));
                resolve(this);
            }, reject);
        });
    }
    toGPU(gl) {
        if (!this.changed) {
            return Promise.resolve(this);
        }
        for (let i = 0; i < this.changes.length; i++) {
            const c = this.changes[i];
            switch (c.action) {
            case texture_actions_1.TextureAction.Alloc:
                this.gpuTextureAlloc(gl, c);
                break;
            case texture_actions_1.TextureAction.Update:
                this.gpuTextureUpdate(gl, c);
                break;
            }
        }
        this.changed = false;
        this.changes.length = 0;
        return Promise.resolve(this);
    }
    gpuTextureAlloc(gl, change) {
        return new Promise((resolve, reject) => {
            const webglTexId = helpersgl_1.HelpersGL.textureArray(gl, change.emptyAtlas, change.width, change.height, false);
            this.texture = webglTexId;
            resolve(webglTexId);
        });
    }
    gpuTextureUpdate(gl, change) {
        return new Promise((resolve, reject) => {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, change.xoffset, change.yoffset, change.width, change.height, gl.RGBA, gl.UNSIGNED_BYTE, change.data);
            gl.bindTexture(gl.TEXTURE_2D, null);
            resolve();
        });
    }
    reset(emptyAtlas) {
        this.at = 0;
        this.indices.clear();
        this.changed = true;
        this.changes.push(new texture_actions_1.TextureChangeUpdate(this.glTextureSize, new data_1.Vector2D(0, 0), emptyAtlas));
    }
}
exports.TextureAtlas = TextureAtlas;
}
// default/engine/render/3d/shaders/helpersgl.js
$fsx.f[84] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const context_1 = $fsx.r(85);
class HelpersGL {
    static initShaderProgram(gl, vsSource, fsSource, verticesLocName) {
        const vertexShader = HelpersGL.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = HelpersGL.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        if (verticesLocName) {
            gl.bindAttribLocation(shaderProgram, 0, verticesLocName);
        }
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS) || !shaderProgram) {
            throw new Error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
    }
    static checkError(gl) {
        const e = gl.getError();
        let msg;
        switch (e) {
        case gl.NO_ERROR:
            msg = 'No error has been recorded.';
            break;
        case gl.INVALID_ENUM:
            msg = 'An unacceptable value has been specified for an enumerated argument.';
            break;
        case gl.INVALID_VALUE:
            msg = 'A numeric argument is out of range.';
            break;
        case gl.INVALID_OPERATION:
            msg = 'The specified command is not allowed for the current state.';
            break;
        case gl.INVALID_FRAMEBUFFER_OPERATION:
            msg = 'The currently bound framebuffer is not framebuffer complete when trying to render to or to read from it.';
            break;
        case gl.OUT_OF_MEMORY:
            msg = 'Not enough memory is left to execute the command.';
            break;
        case gl.CONTEXT_LOST_WEBGL:
            msg = 'WebGL context is lost!';
            break;
        }
        console.log(msg);
    }
    static loadShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) || !shader) {
            const e = new Error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw e;
        }
        return shader;
    }
    static glBuffer(gl, data, numItems, itemSize, type, isStatic, buffer) {
        let b;
        if (buffer === undefined) {
            const _b = gl.createBuffer();
            if (!_b) {
                throw new Error('Unable to create WebGL Buffer in HelpersGL()');
            }
            b = _b;
        } else {
            b = buffer.buffer;
        }
        gl.bindBuffer(type, b);
        gl.bufferData(type, data, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
        if (buffer === undefined) {
            return new context_1.ShaderBuffer(b, data, numItems, itemSize);
        } else {
            return buffer;
        }
    }
    static bufferFloat32(gl, data, numItems, itemSize, isStatic, buffer) {
        let drawStatic = isStatic;
        if (drawStatic === undefined) {
            drawStatic = true;
        }
        return HelpersGL.glBuffer(gl, data, numItems, itemSize, gl.ARRAY_BUFFER, drawStatic, buffer);
    }
    static buffer(gl, data, numItems, itemSize, type) {
        const t = type || gl.ARRAY_BUFFER;
        let bData;
        if (t === gl.ELEMENT_ARRAY_BUFFER) {
            bData = new Uint16Array(data);
        } else {
            bData = new Float32Array(data);
        }
        return HelpersGL.glBuffer(gl, bData, numItems, itemSize, t, true);
    }
    static putTextureInGPU(gl, toGPU, doMipMap = false) {
        const glTexture = gl.createTexture();
        if (glTexture === null) {
            throw new Error('Unable to create WebGL texture');
        }
        gl.bindTexture(gl.TEXTURE_2D, glTexture);
        toGPU(gl);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        if (doMipMap) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.generateMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);
        return glTexture;
    }
    static texture(gl, _texture, doMipMap = false) {
        const toGPU = _gl => _gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _texture);
        return HelpersGL.putTextureInGPU(gl, toGPU, doMipMap);
    }
    static textureArray(gl, _texture, width, height, doMipMap = false) {
        const toGPU = _gl => {
            return _gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, _texture);
        };
        return HelpersGL.putTextureInGPU(gl, toGPU, doMipMap);
    }
}
exports.HelpersGL = HelpersGL;
}
// default/engine/render/context.js
$fsx.f[85] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class ShaderProgram {
    constructor(p, loc) {
        this.program = p;
        this.loc = loc;
    }
    activateAll(gl) {
        for (let i = 0; i < this.loc.attributesIds.length; i++) {
            gl.enableVertexAttribArray(this.loc.attributesIds[i]);
        }
    }
    switchFrom(gl, oldProgram) {
        for (let i = 0; i < oldProgram.loc.attributesIds.length; i++) {
            gl.disableVertexAttribArray(oldProgram.loc.attributesIds[i]);
        }
        this.activateAll(gl);
    }
}
exports.ShaderProgram = ShaderProgram;
function switchProgramTo(canvas, newProgram) {
    if (canvas.program === null) {
        newProgram.activateAll(canvas.ctx);
    } else {
        newProgram.switchFrom(canvas.ctx, canvas.program);
    }
    canvas.program = newProgram;
    canvas.ctx.useProgram(newProgram.program);
}
exports.switchProgramTo = switchProgramTo;
class ShaderBuffer {
    constructor(buffer, data, numItems, itemSize) {
        this.buffer = buffer;
        this.data = data;
        this.numItems = numItems;
        this.itemSize = itemSize;
    }
}
exports.ShaderBuffer = ShaderBuffer;
function toCanvasCtx(ctx, width, height, svg) {
    return {
        ctx,
        height,
        svg,
        width,
        ratio: 1
    };
}
exports.toCanvasCtx = toCanvasCtx;
function toWebGLCtx(ctx, width, height) {
    return {
        width: ctx.canvas.clientWidth,
        height: ctx.canvas.clientHeight,
        propsWidth: width,
        propsHeight: height,
        ctx,
        ratio: 1,
        program: null,
        maxTextureSize: ctx.getParameter(ctx.MAX_TEXTURE_SIZE),
        maxNumTextures: ctx.getParameter(ctx.MAX_TEXTURE_IMAGE_UNITS)
    };
}
exports.toWebGLCtx = toWebGLCtx;
function toColorPickerCanvasCtx(ctx) {
    return Object.assign(ctx, { canvasCache: {} });
}
exports.toColorPickerCanvasCtx = toColorPickerCanvasCtx;
}
// default/engine/runtime/texture_actions.js
$fsx.f[86] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var TextureAction;
(function (TextureAction) {
    TextureAction['Alloc'] = 'Alloc';
    TextureAction['Update'] = 'Update';
}(TextureAction = exports.TextureAction || (exports.TextureAction = {})));
class TextureChangeAlloc {
    constructor(emptyAtlas, width, height) {
        this.emptyAtlas = emptyAtlas;
        this.width = width;
        this.height = height;
        this.action = TextureAction.Alloc;
    }
}
exports.TextureChangeAlloc = TextureChangeAlloc;
class TextureChangeUpdate {
    constructor(size, bottomLeftCoords, d) {
        this.action = TextureAction.Update;
        this.width = size;
        this.height = size;
        this.xoffset = bottomLeftCoords.x;
        this.yoffset = bottomLeftCoords.y;
        this.data = d;
    }
}
exports.TextureChangeUpdate = TextureChangeUpdate;
}
// default/engine/runtime/movement.js
$fsx.f[87] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Movement {
    constructor(startX = 0, startY = 0, isMoving = true, detail = null) {
        this._startX = startX;
        this._startY = startY;
        this._isMoving = isMoving;
        this._detail = detail;
    }
    get startX() {
        return this._startX;
    }
    get startY() {
        return this._startY;
    }
    get isMoving() {
        return this._isMoving;
    }
    get detail() {
        return this._detail;
    }
    setDetail(d) {
        this._detail = d;
    }
    start(startX, startY) {
        this._startX = startX;
        this._startY = startY;
        this._isMoving = true;
        this._detail = null;
    }
    end() {
        this._isMoving = false;
        this._detail = null;
    }
}
exports.Movement = Movement;
}
// default/engine/render/2d/color_canvas_painter.js
$fsx.f[89] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
class ColorCanvasPainter {
    static INIT(ctx, _state) {
        const state = _state.fills.colors.editor;
        const sliceSize = ctx.width / 2;
        const r1 = sliceSize * state.sliceCircleRatio1;
        const r2 = sliceSize * state.sliceCircleRatio2;
        const cx = ctx.width / 2;
        const cy = cx;
        ctx.canvasCache = {};
        ctx.canvasCache[state.mode] = null;
        ColorCanvasPainter._renderBackground(ctx, state, cx, cy);
        if (state.mode === data_1.WheelMode.WHEEL_HERING_MODE) {
            ColorCanvasPainter._heringCircle(ctx, ctx.width, state.heringColors, state.hering, state.ringRatio1, state.ringRatio2);
        } else if (state.mode === data_1.WheelMode.WHEEL_BRIGHTNESS_MODE) {
            ColorCanvasPainter._unitCircle(ctx, ctx.width, state.selectedSlice, state.slices, state.ringRatio1, state.ringRatio2, state.brightnessColors, state.brightnessOffset, state.mode);
        } else if (state.mode === data_1.WheelMode.WHEEL_SATURATION_MODE) {
            ColorCanvasPainter._unitCircle(ctx, ctx.width, state.selectedSlice, state.slices, state.ringRatio1, state.ringRatio2, state.saturationColors, state.saturationOffset, state.mode);
        }
        ColorCanvasPainter._circleSliceN(ctx.ctx, cx, cy, state.slices, r1, r2, 180 / state.slices, state.colors, state.colors);
        ColorCanvasPainter._renderSelectedColor(ctx, state);
        ColorCanvasPainter._renderSliceLines(ctx, state, cx, cy);
        ColorCanvasPainter._renderDragInfo(ctx, state, cx, cy);
    }
    static _renderDragInfo(context, wheel, cx, cy) {
        const selected = wheel.selectedSlice;
        const size = context.width;
        const sliceAngle = 2 * Math.PI / wheel.slices;
        const r = 3;
        const distOut = wheel.ringRatio1 * size - (wheel.ringRatio1 - wheel.ringRatio2) * size / 2;
        const a = selected * sliceAngle;
        const halfSlice = sliceAngle / 2;
        const xd = cx + Math.cos(a + halfSlice) * distOut;
        const yd = cy + Math.sin(a + halfSlice) * distOut;
        const ctx = context.ctx;
        ctx.beginPath();
        ctx.moveTo(xd, yd);
        ctx.arc(cx, cy, distOut, a + halfSlice, a + sliceAngle, false);
        const downX = cx + Math.cos(a + sliceAngle) * distOut;
        const downY = cy + Math.sin(a + sliceAngle) * distOut;
        const arrowLen = 1.25;
        const downXarrow1 = cx + Math.cos(a + sliceAngle / arrowLen) * (distOut + r);
        const downYarrow1 = cy + Math.sin(a + sliceAngle / arrowLen) * (distOut + r);
        const downXarrow2 = cx + Math.cos(a + sliceAngle / arrowLen) * (distOut - r);
        const downYarrow2 = cy + Math.sin(a + sliceAngle / arrowLen) * (distOut - r);
        ctx.moveTo(downX, downY);
        ctx.lineTo(downXarrow1, downYarrow1);
        ctx.lineTo(downXarrow2, downYarrow2);
        ctx.lineTo(downX, downY);
        const xu = cx + Math.cos(a - halfSlice) * distOut;
        const yu = cy + Math.sin(a - halfSlice) * distOut;
        ctx.moveTo(xu, yu);
        ctx.arc(cx, cy, distOut, a - halfSlice, a - sliceAngle, true);
        const upX = cx + Math.cos(a - sliceAngle) * distOut;
        const upY = cy + Math.sin(a - sliceAngle) * distOut;
        const upXarrow1 = cx + Math.cos(a - sliceAngle / arrowLen) * (distOut - r);
        const upYarrow1 = cy + Math.sin(a - sliceAngle / arrowLen) * (distOut - r);
        const upXarrow2 = cx + Math.cos(a - sliceAngle / arrowLen) * (distOut + r);
        const upYarrow2 = cy + Math.sin(a - sliceAngle / arrowLen) * (distOut + r);
        ctx.moveTo(upX, upY);
        ctx.lineTo(upXarrow1, upYarrow1);
        ctx.lineTo(upXarrow2, upYarrow2);
        ctx.lineTo(upX, upY);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.fill();
        ctx.stroke();
    }
    static _renderSliceLines(context, wheel, cx, cy) {
        const selected = wheel.selectedSlice;
        const size = context.width;
        const sliceAngle = 2 * Math.PI / wheel.slices;
        const a1 = selected * sliceAngle + sliceAngle / 2;
        const a2 = selected * sliceAngle - sliceAngle / 2;
        const distIn = wheel.sliceCircleRatio1 * (size / 2);
        const distOut = wheel.ringRatio1 * size;
        const x1in = cx + Math.cos(a1) * distIn;
        const y1in = cy + Math.sin(a1) * distIn;
        const x1out = cx + Math.cos(a1) * distOut;
        const y1out = cy + Math.sin(a1) * distOut;
        const x2in = cx + Math.cos(a2) * distIn;
        const y2in = cy + Math.sin(a2) * distIn;
        const x2out = cx + Math.cos(a2) * distOut;
        const y2out = cy + Math.sin(a2) * distOut;
        const ctx = context.ctx;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x1in, y1in);
        ctx.lineTo(x1out, y1out);
        ctx.moveTo(x2in, y2in);
        ctx.lineTo(x2out, y2out);
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
        return a2;
    }
    static _renderPrecision(context, wheel, cx, cy, curAngle) {
        const size = context.width;
        const sliceAngle = 2 * Math.PI / wheel.slices;
        const a2 = ColorCanvasPainter._renderSliceLines(context, wheel, cx, cy);
        const rulerLen = 8;
        const ctx = context.ctx;
        ctx.beginPath();
        const rulerDistIn = wheel.ringRatio2 * size;
        const totalRulerLines = 6;
        for (let i = 0; i <= totalRulerLines; i++) {
            const offset = curAngle % sliceAngle;
            const lineSpacingAngle = sliceAngle / (totalRulerLines + 1);
            const apos = a2 + i * lineSpacingAngle;
            let a = offset;
            if (a + apos > a2 + sliceAngle) {
                a = a2 + offset - (totalRulerLines - i + 1) * lineSpacingAngle;
            } else if (a - apos < a2) {
                a = sliceAngle + a2 + offset - (totalRulerLines - i + 1) * lineSpacingAngle;
            } else {
                a += apos;
            }
            const extraLong = i % 4 === 0 ? 5 : 0;
            const rulerX1 = cx + Math.cos(a) * rulerDistIn;
            const rulerY1 = cy + Math.sin(a) * rulerDistIn;
            const rulerX2 = cx + Math.cos(a) * (rulerDistIn + rulerLen + extraLong);
            const rulerY2 = cy + Math.sin(a) * (rulerDistIn + rulerLen + extraLong);
            ctx.moveTo(rulerX1, rulerY1);
            ctx.lineTo(rulerX2, rulerY2);
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();
    }
    static _renderBackground(canvas, wheel, cx, cy) {
        canvas.ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.ctx.beginPath();
        canvas.ctx.arc(cx, cy, canvas.width * wheel.ringRatio1, 0, 2 * Math.PI, false);
        canvas.ctx.closePath();
        canvas.ctx.fillStyle = '#FFFFFF';
        canvas.ctx.fill();
        canvas.ctx.strokeStyle = '#555555';
        canvas.ctx.stroke();
    }
    static startMovement(_state, mov, rect) {
        const wheel = _state.fills.colors.editor;
        const size = rect.width;
        const cx = size / 2;
        const cy = cx;
        const sliceR1 = cx * wheel.sliceCircleRatio1;
        const sliceR2 = cx * wheel.sliceCircleRatio2;
        const heringR1 = size * wheel.ringRatio1;
        const heringR2 = size * wheel.ringRatio2;
        const x = mov.startX - rect.left;
        const y = mov.startY - rect.top;
        const angle = Math.atan2(cy - y, cx - x) + Math.PI;
        const circleTouch = Math.pow(x - cx, 2) + Math.pow(y - cy, 2);
        const sliceAngle = 2 * Math.PI / wheel.slices;
        if (circleTouch <= sliceR2 * sliceR2 && circleTouch >= sliceR1 * sliceR1) {
            let slice = 0.5 + angle / sliceAngle;
            if (slice > 15.3) {
                slice -= 0.1;
            }
            slice = Math.floor(slice % 16);
            return slice;
        } else if (circleTouch <= heringR1 * heringR1 && circleTouch >= heringR2 * heringR2) {
            if (wheel.mode === data_1.WheelMode.WHEEL_HERING_MODE) {
                const hRot = wheel.hering;
                const heringDetail = {
                    in: data_1.WheelMode.WHEEL_HERING_MODE,
                    angle: angle - hRot
                };
                return heringDetail;
            } else if (wheel.mode === data_1.WheelMode.WHEEL_BRIGHTNESS_MODE) {
                const brightnessDetail = {
                    in: data_1.WheelMode.WHEEL_BRIGHTNESS_MODE,
                    initValue: wheel.brightness,
                    startAngle: angle
                };
                return brightnessDetail;
            } else if (wheel.mode === data_1.WheelMode.WHEEL_SATURATION_MODE) {
                const saturationDetail = {
                    in: data_1.WheelMode.WHEEL_SATURATION_MODE,
                    initValue: wheel.saturation,
                    startAngle: angle
                };
                return saturationDetail;
            }
        }
        return null;
    }
    static _renderTris(ctx, slices, posR, cx, cy, selected, color) {
        const r = 8;
        const w = 4;
        const sliceAngle = 2 * Math.PI / slices;
        const a = selected * sliceAngle;
        const x = cx + Math.cos(a) * posR;
        const y = cy + Math.sin(a) * posR;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.lineTo(cx + Math.cos(a + sliceAngle / w) * posR, cy + Math.sin(a + sliceAngle / w) * posR);
        ctx.lineTo(cx + Math.cos(a - sliceAngle / w) * posR, cy + Math.sin(a - sliceAngle / w) * posR);
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }
    static _renderSelectedColor(canvas, wheel) {
        const size = canvas.width;
        const r = 0.1 * size;
        const cx = size / 2;
        const cy = cx;
        canvas.ctx.beginPath();
        canvas.ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
        canvas.ctx.closePath();
        canvas.ctx.fillStyle = wheel.getSelectedColor();
        canvas.ctx.fill();
        ColorCanvasPainter._renderTris(canvas.ctx, wheel.slices, r * 1.21, cx, cy, wheel.selectedSlice, '#ffffff');
    }
    static wheelMoving(ctx, state) {
        if (state.fills.colors.editor.mode === data_1.WheelMode.WHEEL_HERING_MODE) {
            ColorCanvasPainter.heringMove(ctx, state);
        } else if (state.fills.colors.editor.mode === data_1.WheelMode.WHEEL_BRIGHTNESS_MODE) {
            const c = state.fills.colors.editor.brightnessColors;
            ColorCanvasPainter.unitMove(ctx, state, c, state.fills.colors.editor.brightnessOffset);
        } else if (state.fills.colors.editor.mode === data_1.WheelMode.WHEEL_SATURATION_MODE) {
            const c = state.fills.colors.editor.saturationColors;
            ColorCanvasPainter.unitMove(ctx, state, c, state.fills.colors.editor.saturationOffset);
        }
    }
    static unitMove(canvas, state, wheelColors, offset) {
        const wheel = state.fills.colors.editor;
        const sliceSize = canvas.width / 2;
        const r1 = sliceSize * wheel.sliceCircleRatio1;
        const r2 = sliceSize * wheel.sliceCircleRatio2;
        const cx = canvas.width / 2;
        const cy = cx;
        const ctx = canvas.ctx;
        ColorCanvasPainter._renderBackground(canvas, wheel, cx, cy);
        ColorCanvasPainter._unitCircle(canvas, canvas.width, wheel.selectedSlice, wheel.slices, wheel.ringRatio1, wheel.ringRatio2, wheelColors, offset, wheel.mode);
        ColorCanvasPainter._circleSliceN(ctx, cx, cy, wheel.slices, r1, r2, 180 / wheel.slices, wheel.colors, wheel.colors);
        ColorCanvasPainter._renderSelectedColor(canvas, state.fills.colors.editor);
        ColorCanvasPainter._renderPrecision(canvas, state.fills.colors.editor, cx, cy, 2 * Math.PI - offset * Math.PI / 180);
    }
    static heringMove(ctx, state) {
        const wheel = state.fills.colors.editor;
        const sliceSize = ctx.width / 2;
        const r1 = sliceSize * wheel.sliceCircleRatio1;
        const r2 = sliceSize * wheel.sliceCircleRatio2;
        const cx = ctx.width / 2;
        const cy = cx;
        ColorCanvasPainter._renderBackground(ctx, wheel, cx, cy);
        ColorCanvasPainter._circleSliceN(ctx.ctx, cx, cy, wheel.slices, r1, r2, 180 / wheel.slices, wheel.colors, wheel.colors);
        ColorCanvasPainter._heringCircle(ctx, ctx.width, wheel.heringColors, wheel.hering, wheel.ringRatio1, wheel.ringRatio2);
        ColorCanvasPainter._renderSelectedColor(ctx, wheel);
        ColorCanvasPainter._renderPrecision(ctx, wheel, cx, cy, wheel.hering);
    }
    static _createCacheCtx(size, canvas, mode, value) {
        const canvasElem = document.createElement('canvas');
        canvasElem.width = size;
        canvasElem.height = size;
        const cacheCtx = canvasElem.getContext('2d');
        if (!cacheCtx) {
            throw new Error('Unable to create color picker cache 2d context');
        }
        canvas.canvasCache[mode] = {
            ctx: cacheCtx,
            elem: canvasElem,
            init: value
        };
        return cacheCtx;
    }
    static _unitCircle(realCtx, size, pos, slices, ratio1, ratio2, colors, offset, mode) {
        if (realCtx.canvasCache[mode]) {
            const cached = realCtx.canvasCache[mode];
            const diff = 0.0174533 * (cached.init - offset);
            const center = size / 2;
            realCtx.ctx.translate(center, center);
            realCtx.ctx.rotate(diff);
            realCtx.ctx.drawImage(cached.elem, -center, -center, size, size);
            realCtx.ctx.rotate(-diff);
            realCtx.ctx.translate(-center, -center);
            return;
        }
        const ctx = ColorCanvasPainter._createCacheCtx(size, realCtx, mode, offset);
        if (!ctx) {
            return;
        }
        const r1 = size * ratio1;
        const r2 = size * ratio2;
        const lineW = r1 - r2;
        const rmid = r1 + (r2 - r1) / 2;
        const cx = size / 2;
        const cy = cx;
        const total = colors.length;
        const oneDeg = 2 * Math.PI / total;
        const curSliceAngle = 2 * Math.PI / slices * pos;
        const sAngle = curSliceAngle;
        let x0 = cx + rmid * Math.cos(sAngle);
        let y0 = cy + rmid * Math.sin(sAngle);
        ctx.moveTo(x0, y0);
        for (let prev = total - 1, i = 0; i < total; prev = i, i++) {
            const deg = oneDeg * (i + 1);
            const x1 = cx + rmid * Math.cos(sAngle + deg);
            const y1 = cy + rmid * Math.sin(sAngle + deg);
            ctx.beginPath();
            const g = ctx.createLinearGradient(x0, y0, x1, y1);
            g.addColorStop(0, colors[(prev + offset) % total]);
            g.addColorStop(1, colors[(i + offset) % total]);
            const angle1 = sAngle + oneDeg * i;
            const angle2 = angle1 + 2 * oneDeg;
            ctx.arc(cx, cy, rmid, angle1, angle2, false);
            ctx.lineWidth = lineW;
            ctx.strokeStyle = g;
            ctx.stroke();
            x0 = x1;
            y0 = y1;
        }
        ctx.lineWidth = 1;
        realCtx.ctx.drawImage(realCtx.canvasCache[mode].elem, 0, 0);
    }
    static _heringCircle(canvas, size, colors, rot, ratio1, ratio2) {
        const mode = data_1.WheelMode.WHEEL_HERING_MODE;
        if (canvas.canvasCache[mode]) {
            const cached = canvas.canvasCache[mode];
            const diff = rot - cached.init;
            const center = size / 2;
            canvas.ctx.translate(center, center);
            canvas.ctx.rotate(diff);
            canvas.ctx.drawImage(cached.elem, -center, -center, size, size);
            canvas.ctx.rotate(-diff);
            canvas.ctx.translate(-center, -center);
            return;
        }
        const ctx = ColorCanvasPainter._createCacheCtx(size, canvas, mode, rot);
        if (!ctx) {
            return;
        }
        const sin = Math.sin(rot);
        const cos = Math.cos(rot);
        const cx = size / 2;
        const cy = cx;
        const r1 = size * ratio1;
        const r2 = size * ratio2;
        const stroke = '#555555';
        const strokeWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - r1 * sin, cy + r1 * cos);
        ctx.arc(cx, cy, r2, Math.PI / 2 + rot, 3 * Math.PI / 2 + rot, true);
        ctx.arc(cx, cy, r1, 3 * Math.PI / 2 + rot, Math.PI / 2 + rot, false);
        ctx.fillStyle = colors[0];
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(cx + r2 * sin, cy - r2 * cos);
        ctx.arc(cx, cy, r1, 3 * Math.PI / 2 + rot, Math.PI / 2 + rot, true);
        ctx.arc(cx, cy, r2, Math.PI / 2 + rot, 3 * Math.PI / 2 + rot, false);
        ctx.fillStyle = colors[2];
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(cx + r2 * cos, cy + r2 * sin);
        ctx.ellipse(cx, cy, r2, r1, rot, 0, Math.PI);
        ctx.arc(cx, cy, r2, Math.PI + rot, rot, true);
        ctx.fillStyle = colors[1];
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        ctx.beginPath();
        ctx.moveTo(cx - r2 * cos, cy - r2 * sin);
        ctx.ellipse(cx, cy, r2, r1, rot, Math.PI, 0);
        ctx.arc(cx, cy, r2, rot, Math.PI + rot, true);
        ctx.fillStyle = colors[3];
        ctx.fill();
        ctx.strokeStyle = stroke;
        ctx.lineWidth = strokeWidth;
        canvas.ctx.drawImage(canvas.canvasCache[mode].elem, 0, 0);
    }
    static _circleSliceN(ctx, cx, cy, n, r1, r2, rot, fills, strokes) {
        const inner = ColorCanvasPainter._splitCircle(cx, cy, r1, n, rot);
        const outter = ColorCanvasPainter._splitCircle(cx, cy, r2, n, rot);
        const _rot = -rot * Math.PI / 180;
        const splitAngle = 2 * Math.PI / n;
        let xOutPrev = outter[n * 2 - 2];
        let yOutPrev = outter[n * 2 - 1];
        let xInPrev = inner[n * 2 - 2];
        let yInPrev = inner[n * 2 - 1];
        let prevAngle = _rot + (n - 1) * splitAngle;
        for (let i = 0; i <= inner.length; i += 2) {
            const j = i / 2;
            const xIn = inner[i];
            const yIn = inner[i + 1];
            const xOut = outter[i];
            const yOut = outter[i + 1];
            if (i > 0) {
                const index = j - 1;
                ctx.beginPath();
                ctx.strokeStyle = strokes[index];
                const color = fills[index];
                ctx.fillStyle = color;
                ctx.moveTo(xInPrev, yInPrev);
                ctx.lineTo(xOutPrev, yOutPrev);
                ctx.arc(cx, cy, r2, prevAngle, _rot + j * splitAngle, false);
                ctx.lineTo(xIn, yIn);
                ctx.arc(cx, cy, r1, _rot + j * splitAngle, prevAngle, true);
                ctx.stroke();
                ctx.fill();
            }
            xOutPrev = xOut;
            yOutPrev = yOut;
            xInPrev = xIn;
            yInPrev = yIn;
            prevAngle = _rot + j * splitAngle;
        }
    }
    static _splitCircle(x, y, r, n, deg) {
        const result = [];
        const rot = -deg * Math.PI / 180;
        const splitAngle = 2 * Math.PI / n;
        for (let i = 0; i < n; i++) {
            result.push(x + Math.cos(rot + i * splitAngle) * r);
            result.push(y + Math.sin(rot + i * splitAngle) * r);
        }
        return result;
    }
}
ColorCanvasPainter.selectColor = ColorCanvasPainter.INIT;
ColorCanvasPainter.pickerMode = ColorCanvasPainter.INIT;
ColorCanvasPainter.pickColor = ColorCanvasPainter.INIT;
ColorCanvasPainter.editorSelectShape = ColorCanvasPainter.INIT;
ColorCanvasPainter.editRandomColors = ColorCanvasPainter.INIT;
ColorCanvasPainter.stopMovement = ColorCanvasPainter.INIT;
ColorCanvasPainter.enterColorSwitch = ColorCanvasPainter.INIT;
exports.ColorCanvasPainter = ColorCanvasPainter;
}
// default/engine/render/2d/player_canvas_painter.js
$fsx.f[90] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class PlayerCanvasPainter {
    static PAINT(ctx, _state, img, viewbox) {
        const _w = ctx.canvas.width;
        const _h = ctx.canvas.height;
        ctx.clearRect(0, 0, _w, _h);
        const {w, h, vbw, vbh} = this.getWH(_w, _h, viewbox);
        const cvbw = Math.round((Math.max(_w, w) - Math.min(_w, w)) / 2);
        const cvbh = Math.round((Math.max(_h, h) - Math.min(_h, h)) / 2);
        ctx.drawImage(img, cvbw, cvbh);
    }
    static getWH(_w, _h, viewbox) {
        const vbw = viewbox[0];
        const vbh = viewbox[1];
        let w = _w;
        let h = _h;
        if (w > h) {
            w = vbw / vbh * _h;
        } else {
            h = vbh / vbw * _w;
        }
        return {
            w,
            h,
            vbw,
            vbh
        };
    }
    static SVGHEAD(svg, _w, _h, viewbox) {
        const {w, h, vbw, vbh} = this.getWH(_w, _h, viewbox);
        const fullsvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${ w }" height="${ h }" shape-rendering="crispEdges" preserveAspectRatio="xMidYMin meet" viewBox="0 0 ${ vbw } ${ vbh }">${ svg }</svg>`;
        return `data:image/svg+xml,${ encodeURIComponent(fullsvg) }`;
    }
    static SVG(_state, w, h, viewbox) {
        return ``;
    }
}
exports.PlayerCanvasPainter = PlayerCanvasPainter;
}
// default/engine/render/3d/scene_painter.js
$fsx.f[91] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const fullscreen_shader_1 = $fsx.r(92);
class ScenePainter {
    constructor(webgl, state, textures, clipspace) {
        this.webgl = webgl;
        this._state = state;
        this.fullscreenShader = new fullscreen_shader_1.FullscreenShader(webgl, state, textures, clipspace);
    }
    get shader() {
        return this.fullscreenShader;
    }
    set state(s) {
        this._state = s;
        this.fullscreenShader.state = s;
    }
    init() {
        const gl = this.webgl.ctx;
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);
        gl.disable(gl.DEPTH_TEST);
        this.fullscreenShader.init();
        const [r, g, b, a] = data_1.RGBColor.fromHex('#f4f4f4').toGL();
        gl.clearColor(r, g, b, a);
        gl.enable(gl.CULL_FACE);
        this.fullscreenShader.draw(0);
    }
    openCols(_state, onDone, onStart) {
        this.fullscreenShader.openCols(onDone, onStart);
    }
    closeCols(_state, onDone, onStart) {
        this.fullscreenShader.closeCols(onDone, onStart);
    }
    cursorMove(sqId) {
        this.fullscreenShader.cursorMove(sqId);
    }
    gridLines(visible) {
        this.fullscreenShader.layers.sqgrid.isGridVisible = visible;
        this.fullscreenShader.draw(0);
    }
    redraw(textures, clipspace, state) {
        this.fullscreenShader.layers.sqgrid.textureIdsChanged = true;
        this.fullscreenShader.layers.sqgrid.shapeTextures = textures;
        this.fullscreenShader.layers.sqgrid.clipspace = clipspace;
        this.fullscreenShader.layers.sqgrid._state = state;
        this.fullscreenShader.draw(0);
    }
    hideCursor() {
        this.fullscreenShader.layers.sqgrid.cursorAt = -10;
    }
}
exports.ScenePainter = ScenePainter;
}
// default/engine/render/3d/shaders/fullscreen.shader.js
$fsx.f[92] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const context_1 = $fsx.r(85);
const helpersgl_1 = $fsx.r(84);
const layers_shader_1 = $fsx.r(93);
const locations_1 = $fsx.r(95);
const shader_animation_1 = $fsx.r(96);
var FullscreenAnimations;
(function (FullscreenAnimations) {
    FullscreenAnimations[FullscreenAnimations['None'] = 0] = 'None';
    FullscreenAnimations[FullscreenAnimations['Open'] = 1] = 'Open';
    FullscreenAnimations[FullscreenAnimations['Shift'] = 2] = 'Shift';
    FullscreenAnimations[FullscreenAnimations['Blur'] = 3] = 'Blur';
}(FullscreenAnimations || (FullscreenAnimations = {})));
var FullscreenMode;
(function (FullscreenMode) {
    FullscreenMode[FullscreenMode['Full'] = 0] = 'Full';
    FullscreenMode[FullscreenMode['Expand'] = 1] = 'Expand';
    FullscreenMode[FullscreenMode['Cols'] = 2] = 'Cols';
}(FullscreenMode = exports.FullscreenMode || (exports.FullscreenMode = {})));
class FullscreenShader {
    constructor(canvas, state, textures, clipspace) {
        this.ratio = canvas.ratio;
        this.width = canvas.width;
        this.height = canvas.height;
        this.gl = canvas.ctx;
        this.context = canvas;
        this._state = state;
        this.layers = new layers_shader_1.LayersShader(canvas, state, textures, clipspace);
        this.isNotSmall = true;
        this.mode = FullscreenMode.Cols;
        const duration = 333;
        this.debugTextures = textures;
        this.openAnimation = new shader_animation_1.ShaderAnimation(duration, FullscreenAnimations.Open, shader_animation_1.ShaderAnimation.linearRev);
        this.openAmmount = 4;
        this.onAnimationDone = undefined;
        this.openAnimation.onEnd = runOnEnd => {
            if (this.openAnimation.direction === shader_animation_1.AnimationDirection.Normal) {
                this.openAnimation.direction = shader_animation_1.AnimationDirection.Reverse;
            } else {
                this.openAnimation.direction = shader_animation_1.AnimationDirection.Normal;
            }
            if (runOnEnd && this.onAnimationDone) {
                this.onAnimationDone();
            }
        };
        this.draw = () => {
            return;
        };
    }
    init() {
        this.layers.init();
        this.shader = this.initShaders(this.gl);
        this.buffers = this.initBuffers(this.gl);
        this.textures = this.initTextures();
        this.draw = t => {
            this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
            this.layers.draw();
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
            context_1.switchProgramTo(this.context, this.shader);
            this.openAnimation.draw(this.gl, this.shader.loc, this.buffers[3], this.buffers[4], this.buffers[5]);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[0].buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aVertexPosition'), this.buffers[0].itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[2].buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aTextureCoord'), this.buffers[2].itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[0]);
            this.shader.loc.setSamplerUniform(this.gl, 'uSampler', 0);
            this.setUniforms();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[1].buffer);
            this.gl.drawElements(this.gl.TRIANGLES, this.buffers[1].numItems, this.gl.UNSIGNED_SHORT, 0);
        };
    }
    setUniforms() {
        this.shader.loc.set1Uniform(this.gl, 'iOpenAmmount', this.openAmmount);
    }
    locations(gl, p) {
        const loc = new locations_1.Locations('FullscreenShader');
        loc.locateAttrib(gl, p, 'aVertexPosition');
        loc.locateAttrib(gl, p, 'aShapeIndex');
        loc.locateAttrib(gl, p, 'aTextureCoord');
        loc.locateUniform(gl, p, 'uSampler');
        loc.locateUniform(gl, p, 'iOpenAmmount');
        return shader_animation_1.ShaderAnimation.Locations(gl, p, loc);
    }
    _addColVertex(vData, iData, x1, x2, index) {
        vData.push(x1);
        vData.push(-1);
        vData.push(0);
        vData.push(x2);
        vData.push(-1);
        vData.push(0);
        vData.push(x1);
        vData.push(1);
        vData.push(0);
        vData.push(x2);
        vData.push(1);
        vData.push(0);
        iData.push(index);
        iData.push(index + 1);
        iData.push(index + 2);
        iData.push(index + 2);
        iData.push(index + 1);
        iData.push(index + 3);
    }
    _textureColData(tData, w, cols, fstColPx) {
        const yAspect = 1;
        const xAspect = 1;
        const uLen = xAspect;
        const vLen = yAspect;
        const fstU = uLen * fstColPx / w;
        const colUSize = (uLen - fstU) / cols;
        const diffAdjustment = Math.ceil(fstU);
        for (let i = 0; i < cols; i++) {
            const u1 = i * colUSize;
            const u2 = u1 + colUSize;
            tData.push(u1);
            tData.push(0);
            tData.push(u2);
            tData.push(0);
            tData.push(u1);
            tData.push(vLen);
            tData.push(u2);
            tData.push(vLen);
        }
        if (diffAdjustment) {
            const i = cols;
            const u1 = i * colUSize;
            const u2 = u1 + fstU;
            tData.push(u1);
            tData.push(0);
            tData.push(u2);
            tData.push(0);
            tData.push(u1);
            tData.push(vLen);
            tData.push(u2);
            tData.push(vLen);
        }
        return tData;
    }
    _colPolys(w) {
        const clipSpaceDim = 2;
        const colSize = 128;
        const cols = Math.floor(w / colSize);
        const fstColPx = w % colSize;
        const fstColClip = clipSpaceDim * fstColPx / w;
        const colClipSize = (clipSpaceDim - fstColClip) / cols;
        const vData = [];
        const iData = [];
        const diffAdjustment = Math.ceil(fstColClip);
        let x1;
        let x2;
        for (let i = 0; i < cols; i++) {
            x1 = -1 + i * colClipSize;
            x2 = x1 + colClipSize;
            const index = i * 4;
            this._addColVertex(vData, iData, x1, x2, index);
        }
        if (diffAdjustment) {
            const i = cols;
            x1 = -1 + i * colClipSize;
            x2 = x1 + fstColClip;
            const index = i * 4;
            this._addColVertex(vData, iData, x1, x2, index);
        }
        const tData = [];
        this._textureColData(tData, w, cols, fstColPx);
        return {
            vData,
            iData,
            tData
        };
    }
    _shapeIds(verticesAmmount) {
        const result = new Array(verticesAmmount);
        const vertsPerFace = 4;
        for (let i = 0; i < verticesAmmount; i++) {
            result[i] = Math.floor(i / vertsPerFace);
        }
        return result;
    }
    _shapeDelays(verticesAmmount, itemDelay) {
        const result = new Array(verticesAmmount);
        const vertsPerFace = 4;
        for (let i = 0; i < verticesAmmount; i++) {
            result[i] = Math.floor(i / vertsPerFace) * itemDelay;
        }
        return result;
    }
    initBuffersCols(gl) {
        const {vData, iData, tData} = this._colPolys(this.width * this.ratio);
        const numberOfVerts = vData.length / 3;
        const vBuffer = helpersgl_1.HelpersGL.buffer(gl, vData, numberOfVerts, 3);
        const iBuffer = helpersgl_1.HelpersGL.buffer(gl, iData, iData.length, 1, gl.ELEMENT_ARRAY_BUFFER);
        const tBuffer = helpersgl_1.HelpersGL.buffer(gl, tData, tData.length / 2, 2);
        const delaysArray = this._shapeDelays(numberOfVerts, 40);
        this.openAnimation.maxDelay = delaysArray.reduce((a, b) => Math.max(a, b));
        const [shapeIds, delays, revDelays] = shader_animation_1.ShaderAnimation.initBuffers(gl, this._shapeIds(numberOfVerts), delaysArray);
        return [
            vBuffer,
            iBuffer,
            tBuffer,
            shapeIds,
            delays,
            revDelays
        ];
    }
    initBuffers(gl) {
        this.colsBuffers = this.initBuffersCols(gl);
        return this.choseBuffers();
    }
    choseBuffers() {
        switch (this.mode) {
        case FullscreenMode.Cols:
            return this.colsBuffers;
        }
        return [];
    }
    initTextures() {
        if (!this.layers.targetTexture) {
            throw new Error('Unable to access the layers target texture');
        }
        return [this.layers.targetTexture];
    }
    initShadersCols(gl) {
        const program = helpersgl_1.HelpersGL.initShaderProgram(gl, FullscreenShader.vShaderCols, FullscreenShader.fShaderCols);
        gl.useProgram(program);
        const locations = this.locations(gl, program);
        return new context_1.ShaderProgram(program, locations);
    }
    initShaders(gl) {
        this.colsShader = this.initShadersCols(gl);
        return this.choseShader();
    }
    choseShader() {
        switch (this.mode) {
        case FullscreenMode.Cols:
            return this.colsShader;
        }
        return this.colsShader;
    }
    openCols(onDone, onStart) {
        this.openAnimation.stop(false);
        this.onAnimationDone = onDone;
        this.openAnimation.start(this.draw);
        if (onStart) {
            onStart();
        }
    }
    closeCols(onDone, onStart) {
        this.openAnimation.stop(false);
        this.onAnimationDone = onDone;
        this.openAnimation.startReverse(this.draw);
        if (onStart) {
            onStart();
        }
    }
    set state(state) {
        this._state = state;
        this.layers.state = state;
    }
    cursorMove(sqId) {
        this.layers.sqgrid.cursorAt = sqId;
        this.draw(0);
    }
}
FullscreenShader.vShaderCols = `
	${ shader_animation_1.ShaderAnimation.AnimationVars }
	uniform float iOpenAmmount;
	attribute vec4 aVertexPosition;
	attribute vec2 aTextureCoord;
	varying vec2 vTextureCoord;
	// varying float vFaceIndex;
	void main() {
		// float openUntil = iOpenAmmount;
		// float deltaT = iTimeDelta;
		// float animId = iAnimationId;
		vec4 pos = aVertexPosition;
		if (aShapeIndex <= iOpenAmmount) {
		if (iAnimationDirection == 1.0) {
			float delay = aShapeDelay * 0.001;
			float curTime = max(iTime, delay) - delay;
			float param = min(curTime / iDuration, 1.0);
			pos.y = pos.y + 2.0 * sin(param * 0.5 * PI);
		} else {
			float delay = aShapeRevDelay * 0.001;
			float curTime = iTime + delay;
			float param = min(curTime / iDuration, 1.0);
			pos.y = pos.y + 2.0 * cos(param * 0.5 * PI);
		}
	}
		gl_Position = pos;
		vTextureCoord = aTextureCoord;
		// vFaceIndex = aShapeIndex;
	}
	`;
FullscreenShader.fShaderCols = `
	precision mediump float;
	uniform sampler2D uSampler;
	varying vec2 vTextureCoord;
	// varying float vFaceIndex;
	void main() {
		vec4 textureColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
		gl_FragColor = textureColor;
	}
	`;
exports.FullscreenShader = FullscreenShader;
}
// default/engine/render/3d/shaders/layers.shader.js
$fsx.f[93] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const sqgrid_shader_1 = $fsx.r(94);
class LayersShader {
    constructor(canvas, state, textures, clipspace) {
        this._state = state;
        this.ratio = canvas.ratio;
        this.width = canvas.width;
        this.height = canvas.height;
        this.sqgrid = new sqgrid_shader_1.SqGridShader(canvas, state, textures, clipspace);
        this.gl = canvas.ctx;
        this.draw = () => {
            throw new Error('Trying to draw() before initialization in LayersShader');
        };
    }
    init() {
        this.targetTexture = this._initTargetTexture();
        this.framebuffer = this._initFrameBuffer();
        this.sqgrid.init();
        this.draw = () => {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.targetTexture);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
            this.sqgrid.draw();
        };
    }
    _initFrameBuffer() {
        const gl = this.gl;
        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, this.targetTexture, 0);
        return fb;
    }
    _initTargetTexture() {
        const gl = this.gl;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width * this.ratio, this.height * this.ratio, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return targetTexture;
    }
    set state(state) {
        this._state = state;
        this.sqgrid.state = state;
    }
}
exports.LayersShader = LayersShader;
}
// default/engine/render/3d/shaders/sqgrid.shader.js
$fsx.f[94] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const context_1 = $fsx.r(85);
const helpersgl_1 = $fsx.r(84);
const locations_1 = $fsx.r(95);
class SqGridShader {
    constructor(canvas, state, textures, clipspace) {
        this.vShader = () => `
	attribute vec3 aVertexPosition;
	attribute float aVertexIdd;
	attribute float aFaceIndex;
	// attribute float aFaceVertexIdd;
	// attribute vec2 aFaceTexture;
	attribute vec4 aFaceTextureCoords;
	attribute float aFaceRot;
	uniform vec3 iResolution;
	uniform float iUnitSize;
	uniform vec2 iOffset;
	uniform float iRenderingLines;
	uniform float iRenderingCursor;
	uniform float iCursorAt;
	uniform vec4 iGridLineColor;
	uniform vec4 iCursorColor;
	// uniform vec2 iCurrentTexture;
	varying vec4 v_color;
	varying float fromTexture;
	varying vec2 v_texCoord;
	vec2 rotate(vec2 v, float a, vec2 c) {
		return vec2(
			c.x + (v.x - c.x) * cos(a) - (v.y - c.y) * sin(a),
			c.y + (v.x - c.x) * sin(a) + (v.y - c.y) * cos(a));
	}
	void main() {
		float rot = aFaceRot;
		float z = 0.0;
		float vid = aVertexIdd;
		// float fid = aFaceVertexIdd;
		float isRenderingLines = iRenderingLines;
		vec4 lineColor = iGridLineColor;
		float cursorAt = iCursorAt;
		vec4 cursorColor = iCursorColor;
		// vec2 ft = aFaceTexture;
		// vec2 curT = iCurrentTexture;
		vec4 curTextureCoords = aFaceTextureCoords;
		float face = aFaceIndex;
		// code starts here:
		v_color = vec4(0.0, 0.0, 0.0, 0.0);
		fromTexture = 0.0;
		v_color = iRenderingLines * iGridLineColor;
		if (face == cursorAt && iRenderingCursor == 1.0) {
			v_color = v_color + iRenderingCursor * iCursorColor;
		} else
		if ((curTextureCoords.w != -1.0) && iRenderingLines != 1.0) {
			fromTexture = 1.0;
			// calculate the texture coords
			float faceVertexNum = vid - (face * 4.0);
			v_texCoord = rotate(
				vec2(
					curTextureCoords.x + mod(faceVertexNum, 2.0) * curTextureCoords.z,
					curTextureCoords.y + curTextureCoords.z - step(1.5, faceVertexNum) * curTextureCoords.z),
				-2.0 * 3.14156 * (aFaceRot),
				vec2(
					curTextureCoords.x + (curTextureCoords.z / 2.0),
					curTextureCoords.y + curTextureCoords.z - (curTextureCoords.z / 2.0)
				));
		}
		vec2 len = vec2(
			iUnitSize * 2.0 / iResolution.x,
			iUnitSize * 2.0 / iResolution.y
		);
		vec2 numSquares = ceil((iResolution.xy / vec2(iUnitSize, iUnitSize))) + vec2(2.0, 2.0);
		vec2 off = iOffset;
		float offX = mod((iOffset.x / iResolution.x) * 2.0, len.x);
		float offY = mod((iOffset.y / iResolution.y) * 2.0, len.y);
		float faceX = -1.0 + mod(face, (numSquares.x)) * len.x - len.x / 2.0 - offX;
		float faceY = -1.0 + ceil(face / (numSquares.x)) * len.y - len.y / 2.0 - offY;
		float x = faceX + aVertexPosition.x * len.x / 2.0;
		float y = faceY + aVertexPosition.y * len.y / 2.0;
		float faceVisible = step(face, (numSquares.x) * (numSquares.y));
		gl_Position = vec4(x, -y, z, faceVisible);
	}
	`;
        this.fShader = () => `
	precision mediump float;
	uniform sampler2D texture;
	varying float fromTexture;
	varying vec4 v_color;
	varying vec2 v_texCoord;
	void main() {
		// vec4 textureColor = vec4(fromTexture, 0.5, 0.5, 1.0);
		vec4 textureColor = texture2D(texture, v_texCoord);
		gl_FragColor = (1.0 - fromTexture) * v_color + fromTexture * textureColor;
		// gl_FragColor = texture2D(texture, v_texCoord);
	}
	`;
        this._state = state;
        this.clipspace = clipspace;
        this.shapeTextures = textures;
        this.ratio = canvas.ratio;
        this.width = canvas.width;
        this.height = canvas.height;
        this.cursorAt = -1;
        this.context = canvas;
        this.cursorColor = [
            1,
            0,
            0,
            1
        ];
        this.cursorFaceId = -123;
        this.gl = canvas.ctx;
        this.offset = new Array(2);
        this.emptyUV = new Float32Array([
            0,
            0,
            0,
            -1
        ]);
        this.isGridVisible = true;
        this.draw = () => {
            throw new Error('Trying to draw() before initialization in SqGridShader');
        };
    }
    setCursorColor() {
        const color = this._state.fills.getFillObj(this._state.currentLayer.cursorColor);
        if (color) {
            this.cursorColor = color.toGL();
        }
        return this.cursorColor;
    }
    drawTextures(drawBuffer) {
        const squares = this.clipspace.textures.length;
        if (this.textureIdsChanged) {
            this.textureIds.fill(0);
            for (let sq = 0; sq < squares; sq++) {
                const t = this.clipspace.textures[sq];
                const verts = 4;
                for (let v = 0; v < verts; v++) {
                    const vindex = (sq * verts + v) * 2;
                    this.textureIds[vindex] = t[0];
                    this.textureIds[vindex + 1] = t[1];
                }
            }
            if (this.textureIdsBuffer) {
                this.textureIdsBuffer = helpersgl_1.HelpersGL.bufferFloat32(this.gl, this.textureIds, this.textureIds.length / 2, 2, false, this.textureIdsBuffer);
            }
        }
        if (this.textureIdsBuffer) {
        }
        this.textureRot.fill(0);
        for (let sq = 0; sq < squares; sq++) {
            const rot = this.clipspace.rotation[sq];
            const verts = 4;
            for (let v = 0; v < verts; v++) {
                this.textureRot[sq * verts + v] = rot;
            }
        }
        if (this.textureRotBuffer) {
            this.textureRotBuffer = helpersgl_1.HelpersGL.bufferFloat32(this.gl, this.textureRot, this.textureIds.length, 1, false, this.textureRotBuffer);
        } else {
            this.textureRotBuffer = helpersgl_1.HelpersGL.bufferFloat32(this.gl, this.textureRot, this.textureIds.length, 1, false, undefined);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureRotBuffer.buffer);
        this.gl.vertexAttribPointer(this.shader.loc.attrib('aFaceRot'), this.textureRotBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        for (let u = 0; u < this.clipspace.uv.length; u++) {
            const uv = this.clipspace.uv[u];
            for (let sq = 0; sq < squares; sq++) {
                const coords = uv[sq] || this.emptyUV;
                const verts = 4;
                for (let v = 0; v < verts; v++) {
                    this.textureCoords.set(coords, sq * verts * coords.length + v * coords.length);
                }
            }
            if (this.textureCoordsBuffer) {
                this.textureCoordsBuffer = helpersgl_1.HelpersGL.bufferFloat32(this.gl, this.textureCoords, this.textureCoords.length / 4, 4, true, this.textureCoordsBuffer);
            } else {
                this.textureCoordsBuffer = helpersgl_1.HelpersGL.bufferFloat32(this.gl, this.textureCoords, this.textureCoords.length / 4, 4, true, undefined);
            }
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordsBuffer.buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aFaceTextureCoords'), this.textureCoordsBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.shapeTextures.getGLTexture(u));
            this.shader.loc.set1UniformInt(this.gl, 'texture', 0);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, drawBuffer.buffer);
            this.gl.drawElements(this.gl.TRIANGLES, drawBuffer.numItems, this.gl.UNSIGNED_SHORT, 0);
        }
    }
    init() {
        this.shader = this.initShaders(this.gl);
        this.buffers = this.initBuffers(this.gl);
        this.textureIdsChanged = true;
        this.shader.loc.setUniform(this.gl, 'iResolution', [
            this.width,
            this.height,
            this.width / this.height
        ]);
        this.shader.loc.setUniform(this.gl, 'iGridLineColor', this._state.currentLayer.gridLineColor);
        this.shader.loc.set1Uniform(this.gl, 'iCursorAt', this.cursorAt);
        this.shader.loc.setUniform(this.gl, 'iCursorColor', this.setCursorColor());
        this.draw = () => {
            context_1.switchProgramTo(this.context, this.shader);
            this.offset[0] = this._state.viewport.x;
            this.offset[1] = this._state.viewport.y;
            this.shader.loc.set1Uniform(this.gl, 'iUnitSize', this._state.viewport.unitSize);
            this.shader.loc.setUniform(this.gl, 'iOffset', this.offset);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[0].buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aVertexPosition'), this.buffers[0].itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[1].buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aVertexIdd'), this.buffers[1].itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[2].buffer);
            this.gl.vertexAttribPointer(this.shader.loc.attrib('aFaceIndex'), this.buffers[2].itemSize, this.gl.FLOAT, false, 0, 0);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers[3].buffer);
            this.shader.loc.set1Uniform(this.gl, 'iRenderingCursor', 0);
            this.shader.loc.set1Uniform(this.gl, 'iRenderingLines', 0);
            this.drawTextures(this.buffers[4]);
            this.shader.loc.set1Uniform(this.gl, 'iRenderingLines', 1);
            this.shader.loc.set1Uniform(this.gl, 'iCursorAt', this.cursorAt);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffers[5].buffer);
            if (this.isGridVisible) {
                this.gl.drawElements(this.gl.LINES, this.buffers[5].numItems, this.gl.UNSIGNED_SHORT, 0);
            }
            if (this.cursorAt >= 0) {
                this.shader.loc.set1Uniform(this.gl, 'iRenderingLines', 0);
                this.shader.loc.set1Uniform(this.gl, 'iRenderingCursor', 1);
                this.gl.drawElements(this.gl.LINES, 8, this.gl.UNSIGNED_SHORT, 16 * this.cursorAt);
            }
        };
    }
    locations(gl, p) {
        const loc = new locations_1.Locations('SqGrid');
        loc.locateAttrib(gl, p, 'aVertexIdd');
        loc.locateAttrib(gl, p, 'aFaceIndex');
        loc.locateAttrib(gl, p, 'aVertexPosition');
        loc.locateAttrib(gl, p, 'aFaceTextureCoords');
        loc.locateAttrib(gl, p, 'aFaceRot');
        loc.locateUniform(gl, p, 'iResolution');
        loc.locateUniform(gl, p, 'iUnitSize');
        loc.locateUniform(gl, p, 'iOffset');
        loc.locateUniform(gl, p, 'iGridLineColor');
        loc.locateUniform(gl, p, 'iCursorAt');
        loc.locateUniform(gl, p, 'iCursorColor');
        loc.locateUniform(gl, p, 'iRenderingLines');
        loc.locateUniform(gl, p, 'iRenderingCursor');
        loc.locateUniform(gl, p, 'texture');
        return loc;
    }
    initShaders(gl) {
        const program = helpersgl_1.HelpersGL.initShaderProgram(gl, this.vShader(), this.fShader(), 'aVertexPosition');
        gl.useProgram(program);
        return new context_1.ShaderProgram(program, this.locations(gl, program));
    }
    quad(pos, vid, faces, indices, lines, faceNum, offset) {
        pos.push(-1);
        pos.push(1);
        pos.push(0);
        pos.push(1);
        pos.push(1);
        pos.push(0);
        pos.push(-1);
        pos.push(-1);
        pos.push(0);
        pos.push(1);
        pos.push(-1);
        pos.push(0);
        for (let v = 0; v < 4; v++) {
            vid.push(offset + v);
            faces.push(faceNum);
        }
        indices.push(offset);
        indices.push(offset + 1);
        indices.push(offset + 2);
        indices.push(offset + 2);
        indices.push(offset + 1);
        indices.push(offset + 3);
        lines.push(offset + 0);
        lines.push(offset + 1);
        lines.push(offset + 1);
        lines.push(offset + 3);
        lines.push(offset + 3);
        lines.push(offset + 2);
        lines.push(offset + 2);
        lines.push(offset + 0);
    }
    initBuffers(gl) {
        const aVertexPositionData = [];
        const aVertexIdData = [];
        const aFaceVertexIdData = [];
        const aFaceIndexData = [];
        const lines = [];
        const w = this.width;
        const h = this.height;
        const minSize = this._state.viewport.minSize;
        const totalSquaresH = Math.ceil(w / minSize) + 2;
        const totalSquaresV = Math.ceil(h / minSize) + 1;
        const totalSquares = totalSquaresH * totalSquaresV;
        const out = 0;
        this.textureRot = new Float32Array(totalSquares * 4);
        this.textureIds = new Float32Array(totalSquares * 4 * 2);
        this.textureCoords = new Float32Array(totalSquares * 4 * 4);
        for (let sq = 0; sq < totalSquares; sq++) {
            const sqNumPts = 4;
            const sqVertexOffset = sq * sqNumPts;
            this.quad(aVertexPositionData, aVertexIdData, aFaceIndexData, aFaceVertexIdData, lines, sq, sqVertexOffset);
        }
        const bufVertexPositionData = helpersgl_1.HelpersGL.buffer(gl, aVertexPositionData, aVertexPositionData.length / 3, 3);
        const bufVertexIdData = helpersgl_1.HelpersGL.buffer(gl, aVertexIdData, aVertexIdData.length, 1);
        const bufFaceIndexData = helpersgl_1.HelpersGL.buffer(gl, aFaceIndexData, aFaceIndexData.length, 1);
        const bufFaceVertexIdData = helpersgl_1.HelpersGL.buffer(gl, aFaceVertexIdData, aFaceVertexIdData.length, 1);
        const indices = helpersgl_1.HelpersGL.buffer(gl, aFaceVertexIdData, aFaceVertexIdData.length, 1, gl.ELEMENT_ARRAY_BUFFER);
        const lineIndices = helpersgl_1.HelpersGL.buffer(gl, lines, lines.length, 1, gl.ELEMENT_ARRAY_BUFFER);
        return [
            bufVertexPositionData,
            bufVertexIdData,
            bufFaceIndexData,
            bufFaceVertexIdData,
            indices,
            lineIndices
        ];
    }
    set state(state) {
        this._state = state;
    }
}
exports.SqGridShader = SqGridShader;
}
// default/engine/render/3d/shaders/locations.js
$fsx.f[95] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class UniformLocation {
    constructor(id, values) {
        this.id = id;
        this.values = values;
    }
}
class Locations {
    constructor(moduleName) {
        this.uniforms = new Map();
        this.attributes = new Map();
        this.moduleName = moduleName;
        this.attributesIds = [];
    }
    attribs() {
        return this.attributes.entries();
    }
    attribIds() {
        return this.attributes.values();
    }
    locateAttrib(gl, p, name) {
        const location = gl.getAttribLocation(p, name);
        if (location === -1) {
            throw new Error(`Unable to find ${ name } in ${ this.moduleName }`);
        }
        this.attributes.set(name, location);
        this.attributesIds.push(location);
        return location;
    }
    locateUniform(gl, p, name) {
        const location = gl.getUniformLocation(p, name);
        if (!location) {
            throw new Error(`Unable to find ${ name } in ${ this.moduleName }`);
        }
        const uniform = new UniformLocation(location, []);
        this.uniforms.set(name, uniform);
        return location;
    }
    attrib(name) {
        const a = this.attributes.get(name);
        if (a === undefined) {
            throw new Error(`Cannot get attribute ${ name } in ${ this.moduleName }`);
        }
        return a;
    }
    setSamplerUniform(gl, name, value) {
        const u = this.uniforms.get(name);
        if (u === undefined) {
            throw new Error(`Cannot set uniform ${ name } in ${ this.moduleName }: Not found`);
        }
        if (u.values[0] !== value) {
            u.values[0] = value;
            gl.uniform1i(u.id, value);
        }
    }
    set1Uniform(gl, name, value) {
        const u = this.uniforms.get(name);
        if (u === undefined) {
            throw new Error(`Cannot set uniform ${ name } in ${ this.moduleName }: Not found`);
        }
        if (u.values[0] !== value) {
            u.values[0] = value;
            gl.uniform1f(u.id, value);
        }
    }
    set1UniformInt(gl, name, value) {
        const u = this.uniforms.get(name);
        if (u === undefined) {
            throw new Error(`Cannot set uniform ${ name } in ${ this.moduleName }: Not found`);
        }
        if (u.values[0] !== value) {
            u.values[0] = value;
            gl.uniform1i(u.id, value);
        }
    }
    setUniform(gl, name, values) {
        const u = this.uniforms.get(name);
        if (!u) {
            throw new Error(`Cannot set uniform ${ name } in ${ this.moduleName }: Not found`);
        }
        if (u.values.length === 0) {
            u.values = values.slice(0);
            gl[`uniform${ values.length }fv`](u.id, values);
            return;
        }
        for (let i = 0; i < u.values.length; i++) {
            if (u.values[i] !== values[i]) {
                u.values = values.slice(0);
                gl[`uniform${ values.length }fv`](u.id, values);
                return;
            }
        }
    }
}
exports.Locations = Locations;
}
// default/engine/render/3d/shaders/shader_animation.js
$fsx.f[96] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const helpersgl_1 = $fsx.r(84);
var AnimationDirection;
(function (AnimationDirection) {
    AnimationDirection[AnimationDirection['Normal'] = 1] = 'Normal';
    AnimationDirection[AnimationDirection['Reverse'] = 2] = 'Reverse';
}(AnimationDirection = exports.AnimationDirection || (exports.AnimationDirection = {})));
class ShaderAnimation {
    constructor(duration, id, reverseTime) {
        this.duration = duration;
        this.revDuration = duration;
        this.startTime = 0;
        this.deltaTime = 0;
        this.currentTime = 0;
        this.runningTime = 0;
        this.runningId = 0;
        this.isRunning = false;
        this.maxDelay = 0;
        this.finished = true;
        this.id = id;
        this.direction = AnimationDirection.Normal;
        this.onEnd = null;
        this.reverseTime = reverseTime;
        this.update = t => {
            this.play(t);
            let d = this.duration;
            if (this.direction === AnimationDirection.Reverse) {
                d = this.revDuration;
            }
            if (this.duration !== 0 && this.runningTime > d + this.maxDelay) {
                this.finish();
            } else {
                this.runningId = requestAnimationFrame(this.update);
                this.runningFunction(t);
            }
        };
    }
    static initBuffers(gl, shapeIds, delays) {
        const shapeIdsBuffer = helpersgl_1.HelpersGL.buffer(gl, shapeIds, shapeIds.length, 1);
        const shapeDelaysBuffer = helpersgl_1.HelpersGL.buffer(gl, delays, delays.length, 1);
        const rev = delays.copyWithin(0, 0);
        const shapeRevDelaysBuffer = helpersgl_1.HelpersGL.buffer(gl, rev, rev.length, 1);
        return [
            shapeIdsBuffer,
            shapeDelaysBuffer,
            shapeRevDelaysBuffer
        ];
    }
    static Locations(gl, p, loc) {
        loc.locateUniform(gl, p, 'PI');
        loc.locateUniform(gl, p, 'iTime');
        loc.locateUniform(gl, p, 'iDuration');
        loc.locateUniform(gl, p, 'iAnimationDirection');
        loc.locateAttrib(gl, p, 'aShapeIndex');
        loc.locateAttrib(gl, p, 'aShapeDelay');
        loc.locateAttrib(gl, p, 'aShapeRevDelay');
        return loc;
    }
    setUniforms(gl, loc) {
        loc.set1Uniform(gl, 'PI', Math.PI);
        loc.set1Uniform(gl, 'iTime', this.runningTime * 0.001);
        loc.set1Uniform(gl, 'iAnimationDirection', this.direction);
        loc.set1Uniform(gl, 'iDuration', this.direction === AnimationDirection.Normal ? this.duration * 0.001 : this.revDuration * 0.001);
    }
    run(f) {
        if (!this.finished) {
            let dur = this.duration;
            let revDur = this.revDuration;
            if (this.direction === AnimationDirection.Reverse) {
                dur = this.revDuration;
                revDur = this.duration;
            }
            this.runningTime = this.reverseTime(this.direction, this.runningTime, dur, revDur);
        } else {
            this.runningTime = 0;
        }
        this.isRunning = true;
        this.finished = false;
        this.deltaTime = 0;
        this.runningFunction = f;
        this.startTime = performance.now();
        this.currentTime = performance.now();
        this.runningId = requestAnimationFrame(this.update);
    }
    start(f) {
        this.direction = AnimationDirection.Normal;
        this.run(f);
    }
    startReverse(f) {
        this.direction = AnimationDirection.Reverse;
        this.run(f);
    }
    play(t) {
        this.deltaTime = t - this.currentTime;
        this.currentTime = t;
        this.runningTime += this.deltaTime;
    }
    finish() {
        this.finished = true;
        this.stop();
    }
    stop(runOnEnd = true) {
        cancelAnimationFrame(this.runningId);
        this.startTime = 0;
        this.isRunning = false;
        if (this.finished) {
            this.runningTime = 0;
        }
        this.deltaTime = 0;
        this.currentTime = 0;
        if (this.onEnd) {
            this.onEnd(runOnEnd);
        }
    }
    draw(gl, loc, shapeIdsBuffer, shapeDelaysBuffer, shapeDelaysRevBuffer) {
        this.setUniforms(gl, loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, shapeIdsBuffer.buffer);
        gl.vertexAttribPointer(loc.attrib('aShapeIndex'), shapeIdsBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, shapeDelaysBuffer.buffer);
        gl.vertexAttribPointer(loc.attrib('aShapeDelay'), shapeDelaysBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, shapeDelaysRevBuffer.buffer);
        gl.vertexAttribPointer(loc.attrib('aShapeRevDelay'), shapeDelaysRevBuffer.itemSize, gl.FLOAT, false, 0, 0);
    }
}
ShaderAnimation.linearRev = (dir, runningT, newDuration, oldDuration) => {
    const param = Math.min(runningT, oldDuration) / oldDuration;
    return newDuration - param * newDuration;
};
ShaderAnimation.AnimationVars = `
	uniform float      PI;
	uniform float      iTime;
	// uniform float      iTimeDelta;
	uniform float      iDuration;
	// uniform float      iAnimationId;
	uniform float      iAnimationDirection;
	attribute float    aShapeIndex;
	attribute float    aShapeDelay;
	attribute float    aShapeRevDelay;`;
exports.ShaderAnimation = ShaderAnimation;
}
// default/engine/net.js
$fsx.f[97] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const billing_1 = $fsx.r(98);
const export_1 = $fsx.r(99);
const login_1 = $fsx.r(100);
const product_1 = $fsx.r(101);
const profile_1 = $fsx.r(103);
const publish_1 = $fsx.r(104);
class Net {
    constructor() {
        this.hostname = 'https://gridgenerator.com';
        this.graphql = (queryStr, token) => {
            return new Promise((resolve, reject) => this.httpData('/graphql/', { query: queryStr }, 'POST', token).then(response => {
                if (response.ok) {
                    resolve(response.json());
                } else if (response.status === 401) {
                    reject('Unauthorized');
                } else {
                    response.json().then(msg => reject(Net.graphqlErrorMsg(msg)));
                }
            }, reject));
        };
        this.postData = (url, data, token) => {
            return this.httpData(url, data, 'POST', token);
        };
        this.getData = (url, token) => {
            return this.httpData(url, null, 'GET', token);
        };
        this.login = new login_1.NetLogin(this.hostname, this.getData, this.postData);
        this.profile = new profile_1.NetProfile(this.hostname, this.graphql, this.getData);
        this.publish = new publish_1.NetPublish(this.hostname, this.graphql, this.postData);
        this.billing = new billing_1.NetBilling(this.hostname, this.getData, this.postData);
        this.product = new product_1.NetProduct(this.hostname, this.getData, this.postData);
        this.export = new export_1.NetExport(this.hostname, this.getData, this.postData);
    }
    static isUnauthorized(error) {
        return error === 'Unauthorized';
    }
    static graphqlErrorMsg(response) {
        let result = 'Ooops. There was an error. ';
        if (response.errors) {
            result += 'Please contact us with these details: ';
            response.errors.map(error => {
                result += error.message;
                if (error.locations) {
                    error.locations.map(l => result += `[line: ${ l.line }; col: ${ l.column }]`);
                }
            });
        }
        return result;
    }
    httpData(url, data, method, token) {
        const headers = new Headers();
        headers.append('Content-type', 'application/json');
        if (token) {
            headers.append('Authorization', `Bearer ${ token.jwt }`);
        }
        return fetch(url, {
            body: method !== 'GET' ? JSON.stringify(data) : undefined,
            cache: 'no-cache',
            credentials: 'include',
            headers,
            method,
            redirect: 'follow',
            referrer: 'no-referrer'
        });
    }
}
exports.Net = Net;
}
// default/engine/net/billing.js
$fsx.f[98] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class NetBilling {
    constructor(hostname, doGet, doPost) {
        this.postData = doPost;
        this.getData = doGet;
        this.hostname = hostname;
    }
    getClientToken(t) {
        return this.postData(this.hostname + '/payments/token', {}, t).then(response => response.text());
    }
    getBillingData(t) {
        return this.getData(this.hostname + '/payments/billingInfo', t);
    }
    postNonce(t, nonce, paymentType, billingInfo) {
        return this.postData(this.hostname + '/payments/checkout', {
            nonce,
            paymentType,
            billingInfo
        }, t).then(response => response.json());
    }
    getInvoiceHistory(t) {
        return this.getData(this.hostname + '/payments/invoiceHistory', t).then(response => response.json());
    }
}
exports.NetBilling = NetBilling;
}
// default/engine/net/export.js
$fsx.f[99] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
class NetExport {
    constructor(hostname, get, post) {
        this.hostname = hostname;
        this.postData = post;
        this.getData = get;
    }
    getExportFile(t, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${ t.jwt }`);
            fetch('/products/exported/' + file, {
                credentials: 'include',
                headers
            }).then(response => {
                console.log('GOT RESPONSE', response);
                response.blob().then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    console.log('GOT URL');
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.style = 'display: none';
                    a.href = url;
                    a.download = '';
                    a.click();
                });
            });
        });
    }
    postExportPayment(t, payment, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.postData(this.hostname + '/products/export', {
                payment,
                data
            }, t).then(response => response.json());
        });
    }
    postCanExport(t, hash) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.postData(this.hostname + '/products/canExport', { hash }, t).then(response => response.json());
        });
    }
    postExportPNG(t, hash, res, pattern) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.postData(this.hostname + '/products/convert/png', {
                hash,
                res,
                pattern
            }, t).then(response => response.json());
        });
    }
    postExportMP4(t, hash, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.postData(this.hostname + '/products/convert/mp4', {
                hash,
                res
            }, t).then(response => response.json());
        });
    }
    postExportGIF(t, hash, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.postData(this.hostname + '/products/convert/gif', {
                hash,
                res
            }, t).then(response => response.json());
        });
    }
}
exports.NetExport = NetExport;
}
// default/engine/net/login.js
$fsx.f[100] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
class NetLogin {
    constructor(hostname, get, post) {
        this.hostname = hostname;
        this.postData = post;
        this.getData = get;
    }
    verifyEmail(searchLink) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getData(this.hostname + '/auth/verify' + searchLink).then(response => response.json());
        });
    }
    recover(uname) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const d = { j: uname };
            return this.postData(this.hostname + '/auth/email/recover', d).then(response => response.json());
        });
    }
    resetPassword(newPass, searchLink) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const d = { c: newPass };
            return this.postData(this.hostname + '/auth/email/recover' + searchLink, d).then(response => response.json());
        });
    }
    emailRegister(uname, p) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const d = {
                j: uname,
                c: p
            };
            return this.postData(this.hostname + '/auth/email/create', d).then(response => response.json(), error => console.log('Network Error: ', error));
        });
    }
    emailLogin(uname, p) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const d = {
                j: uname,
                c: p
            };
            return this.postData(this.hostname + '/auth/email/login', d).then(response => response.json());
        });
    }
}
exports.NetLogin = NetLogin;
}
// default/engine/net/product.js
$fsx.f[101] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const countries_json_1 = $fsx.r(102);
class NetProduct {
    constructor(hostname, get, post) {
        this.hostname = hostname;
        this.postData = post;
        this.getData = get;
    }
    getCountryLst() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.getData(this.hostname + countries_json_1.default).then(response => response.json());
        });
    }
}
exports.NetProduct = NetProduct;
}
// default/assets/data/countries.json
$fsx.f[102] = function(module,exports){
module.exports.default = '/assets/7732e09e-countries.json';
}
// default/engine/net/profile.js
$fsx.f[103] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
class NetProfile {
    constructor(hostname, graphql, getData) {
        this.graphql = graphql;
        this.getData = getData;
        this.hostname = hostname;
        this.projProps = `id,
		title,
		description,
		legal,
		initialState,
		finalState,
		fatState,
		isPublished,
		action,
		svg,
		svgViewBox,
		publishedAt,
		createdAt,
		updatedAt,
		parentId,
		parentPath`;
    }
    getProfile(t) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.graphql(`{ curProfile { id, name, badges, about, createdAt } }`, t);
        });
    }
    getProject(id, t) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.graphql(`{ workById (id: ${ id }) { ${ this.projProps } }}`, t);
        });
    }
    getProfileProjects(t) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.graphql(`{ curWorks
				{
					edges {
						node {
							${ this.projProps }
						}
					}
				}
			}`, t);
        });
    }
    updateProfile(t, profile) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const name = profile.filledName;
            const about = profile.filledAbout;
            if (!name) {
                return Promise.reject('Profile form not properly filled');
            }
            return this.graphql(`mutation
			{ setProfile(input: { name: "${ name }", about: "${ about ? about : null }" })
				{ profile { id, name, badges, about, createdAt } }
			}`, t);
        });
    }
    setBadges(t, badges) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.graphql(`mutation
			{ setBadges(input: { badges: ${ JSON.stringify(badges) } })
				{ profile { id, name, badges, about, createdAt } }
			}`, t);
        });
    }
}
exports.NetProfile = NetProfile;
}
// default/engine/net/publish.js
$fsx.f[104] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class NetPublish {
    constructor(hostname, graphql, post) {
        this.graphql = graphql;
        this.postData = post;
        this.hostname = hostname;
    }
    publishProject(t, project) {
        const title = project.title;
        const desc = project.description;
        const license = project.legal;
        const svg = project.svg;
        const viewbox = project.svgViewBox;
        if (!viewbox || !svg) {
            return Promise.reject('Not enough SVG data in project');
        }
        const result = new Promise((resolve, reject) => {
            const input = `{
				title: ${ JSON.stringify(title) },
				description: ${ desc ? desc : null },
				license: ${ license },
				svg: ${ JSON.stringify(svg) },
				svgviewbox: [${ viewbox[2] }, ${ viewbox[3] }],
				initialState: ${ JSON.stringify(JSON.stringify(project.initialState)) },
				finalState: ${ JSON.stringify(JSON.stringify(project.finalState)) },
				fatState: ${ JSON.stringify(JSON.stringify(project.fatState)) },
				version: ${ project.initialState.version },
				action: ${ project.action },
				parent: ${ project.parentId ? project.parentId : null }
			}`;
            const query = `mutation {
				newWork(input: ${ input }) {
					work { id, publishedAt }
				}
			}
			`;
            const work = {
                title,
                description: desc ? desc : null,
                license,
                svg,
                svgviewbox: [
                    viewbox[2],
                    viewbox[3]
                ],
                initialState: project.initialState,
                finalState: project.finalState,
                fatState: project.fatState,
                version: project.initialState.version,
                action: project.action,
                parent: project.parentId ? project.parentId : null
            };
            this.postData(this.hostname + '/publish/', {
                work,
                query
            }, t).then(response => {
                if (response.ok) {
                    resolve(response.json());
                } else if (response.status === 401) {
                    reject('Unauthorized');
                } else {
                    response.json().then(reject);
                }
            }, reject);
        });
        return result;
    }
}
exports.NetPublish = NetPublish;
}
// default/engine/net/token.js
$fsx.f[105] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Token {
    constructor(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error(`Invalid token: has ${ parts.length } parts`);
        }
        try {
            const tobj = JSON.parse(atob(parts[1]));
            this.id = tobj.id;
            this.caps = tobj.caps;
            this.role = tobj.role;
            this.jwt = token;
        } catch (e) {
            throw new Error(`Cannot parse Token ${ e }`);
        }
    }
}
exports.Token = Token;
}
// default/dom/components/base/buttons.jsx
$fsx.f[106] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.Button = props => normalizeProps(createVNode(1, 'button', `Button avenir b--black-10 pa2 link f7 br1 transition-o ba ${ props.disabled ? 'bg-mid-gray light-gray o-0' : `bg-${ props.bg || 'blue' } pointer ${ props.color ? props.color : 'near-white' } dim o-100` } ttu ${ props.className || '' }`, props.label, 0, Object.assign({}, noPropagation, {
    'onClick': props.disabled ? null : props.id && props.onAction ? inferno_1.linkEvent(props.id, props.onAction) : props.onAction,
    'disabled': props.disabled
})));
exports.AmmountBtn = props => {
    return createVNode(1, 'div', 'AmmountBtn flex items-center justify-center', [
        createVNode(1, 'button', 'dec bg-white ttu f7 pa2 link b--black-10 ba pointer dim', createTextVNode('-'), 2, {
            'disabled': props.min === props.value,
            'onClick': inferno_1.linkEvent(props.arg, props.onDec)
        }),
        createVNode(1, 'div', 'bg-white ammount ttu pa2 f7 b--black-10 bt bb', props.value, 0),
        createVNode(1, 'button', 'inc bg-white ttu f7 pa2 link b--black-10 ba pointer dim', createTextVNode('+'), 2, {
            'onClick': inferno_1.linkEvent(props.arg, props.onInc),
            'disabled': props.max === props.value
        })
    ], 4);
};
exports.TextButton = props => {
    const {className, width, bgColor, fgColor, disabled} = props;
    const tachyonsCommon = `f8 ttu absolute b--none w${ width || 3 } h2 bg-transparent dark-gray`;
    const tachyonsNormal = `link pointer`;
    const tachyonsPrimary = 'link blue pointer';
    const tachyonsDisabled = 'light-silver bg-near-white';
    let tachyons = `${ tachyonsCommon } ${ tachyonsNormal }`;
    if (disabled) {
        tachyons = tachyonsDisabled;
    }
    const cx = `TextButton ${ className || '' } bb b--dark-gray w${ width || 3 } w-expand-over`;
    return createVNode(1, 'div', cx, [
        normalizeProps(createVNode(1, 'button', tachyons, props.label, 0, Object.assign({}, noPropagation, { 'onClick': disabled ? null : props.onAction }))),
        createVNode(1, 'div', `w${ width || 3 }-expand h2 bg-white bb b--dark-gray`)
    ], 4);
};
}
// default/dom/components/base/new_close.jsx
$fsx.f[107] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.NewCloseBtn = props => normalizeProps(createVNode(1, 'button', `NewCloseBt ${ props.className || '' } hover-opacity bg-transparent pointer bn ma0 pa0`, createVNode(32, 'svg', '', createVNode(1, 'path', null, null, 1, {
    'd': 'M42.001,29.999h-8v-8.001c0-1.104-0.896-2-2-2s-2,0.896-2,2 v8.001h-8c-1.104,0-2,0.895-2,2c0,1.104,0.896,2,2,2h8v8c0,1.104,0.896,2,2,2s2-0.896,2-2v-8h8c1.104,0,2-0.896,2-2 C44.001,30.894,43.105,29.999,42.001,29.999z',
    'fill': '#333333'
}), 2, {
    'viewBox': props.big ? '10 10 54 54' : '0 0 64 64',
    'style': { transform: `rotate(${ props.rotated ? '45deg' : '0' })` }
}), 2, Object.assign({}, noPropagation, { 'onClick': props.onAction })));
}
// default/dom/components/editor/color_picker.jsx
$fsx.f[108] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const canvas_1 = $fsx.r(109);
const color_code_1 = $fsx.r(111);
const color_shapes_1 = $fsx.r(112);
const mode_menu_1 = $fsx.r(113);
const recent_1 = $fsx.r(114);
const figures_menu_1 = $fsx.r(115);
function needsVertExpansion(isInPortrait, size) {
    return size === engine_1.RuntimeMediaSize.Normal && isInPortrait;
}
function needsHorizExpansion(isInPortrait, size) {
    return !isInPortrait && size !== engine_1.RuntimeMediaSize.Large;
}
exports.ColorPicker = props => {
    const {fillEditor, colorPickerEvents, runtime, className, style} = props;
    const shapes = fillEditor.paths;
    const label = fillEditor.primaryActionTitle;
    const primaryVisible = runtime.device.mediaSize !== engine_1.RuntimeMediaSize.Normal;
    const isShort = runtime.device.isShort;
    let size = 320;
    let shapeSize = 3;
    if (isShort) {
        size = 250;
        shapeSize = 2;
    }
    const canvasStyleSize = size;
    const shapeMenuSize = `h3 w3 h4-l w4-l`;
    const colorCanvasProps = {
        className: 'transition-wh',
        size,
        onCanvasInit: colorPickerEvents.onColorCanvasInit,
        onCanvasUnmount: colorPickerEvents.onColorCanvasUnmount,
        style: {
            width: `${ canvasStyleSize }px`,
            height: `${ canvasStyleSize }px`
        }
    };
    console.log('ENTERING COLOR PICKER WITH FILL EDITOR:', fillEditor);
    const colorCodeProps = {
        style: {
            width: `${ canvasStyleSize }px`,
            height: `${ canvasStyleSize }px`
        },
        color: fillEditor.colorCode,
        onDone: colorPickerEvents.onSaveCode
    };
    const systemPickerProps = {
        className: `${ runtime.device.hasSystemColorPicker ? 'dn' : 'absolute w3 h3 br-100' }`,
        style: { transform: 'translateY(-2rem)' },
        onColorPick: colorPickerEvents.onColorPick,
        color: fillEditor.selectedFillString()
    };
    const modeMenuProps = {
        className: `h3`,
        isVertical: false,
        onAction: colorPickerEvents.onModeChange,
        menu: fillEditor.colorMenu
    };
    const colorShapesProps = {
        className: `${ shapeMenuSize } transition-wh`,
        onAction: props.onShapePathSelect,
        resolution: fillEditor.templateRes,
        shapesPaths: shapes,
        templatePath: fillEditor.templatePath,
        selected: fillEditor.selected
    };
    const fillPaths = fillEditor.fillPaths;
    const figMenuProps = {
        className: 'center mw-70',
        fills: fillPaths[0],
        shapes: fillPaths[1],
        resolution: fillEditor.templateRes,
        selected: fillPaths[2],
        isNotSmall: true,
        onEnterTemplateSelector: () => 0,
        onFigureAction: data => {
            const fid = fillEditor.fidByPos(data.index);
            if (!fid) {
                return;
            }
            props.onShapePathSelect(fid);
        }
    };
    return createVNode(1, 'div', `ColorPicker ${ className || '' } flex justify-center items-start editormw editor-shadow h-100-ns pr5-ns`, createVNode(1, 'div', 'flex flex-column justify-center items-center', [
        normalizeProps(createComponentVNode(2, canvas_1.ColorCanvas, Object.assign({}, colorCanvasProps))),
        fillEditor.editorMode === data_1.UIFillEditorMode.Code ? normalizeProps(createComponentVNode(2, color_code_1.ColorCode, Object.assign({}, colorCodeProps))) : normalizeProps(createComponentVNode(2, mode_menu_1.ModeMenu, Object.assign({}, modeMenuProps))),
        fillEditor.editorMode !== data_1.UIFillEditorMode.Code ? createVNode(1, 'div', 'center mt4-ns', normalizeProps(createComponentVNode(2, color_shapes_1.ColorShapes, Object.assign({}, colorShapesProps))), 2) : createVNode(1, 'div'),
        fillPaths[0].length > 1 ? normalizeProps(createComponentVNode(2, figures_menu_1.FiguresMenu, Object.assign({}, figMenuProps))) : createVNode(1, 'div'),
        createComponentVNode(2, recent_1.RecentColors, {
            'className': 'fixed bottom-0 left-0 flex flex-column-reverse items-center justify-center h-100 w2 w3-ns overflow-hidden',
            'hexValues': fillEditor.mruColors,
            'onColorSelect': colorPickerEvents.onColorPick,
            'onCode': colorPickerEvents.onCode,
            'isOnCode': fillEditor.editorMode === data_1.UIFillEditorMode.Code
        })
    ], 0), 2, { 'style': style || {} });
};
}
// default/dom/components/editor/color_picker/canvas.jsx
$fsx.f[109] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
const canvas_1 = $fsx.r(110);
function ColorCanvas(props) {
    return createComponentVNode(2, canvas_1.default, {
        'onContext': props.onCanvasInit,
        'onUnmount': props.onCanvasUnmount,
        'width': props.size,
        'height': props.size,
        'className': `ColorCanvas ${ props.className || '' }`,
        'is3D': false,
        'style': props.style
    });
}
exports.ColorCanvas = ColorCanvas;
}
// default/dom/components/base/canvas.jsx
$fsx.f[110] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const engine_1 = $fsx.r(75);
const initPixelRatio = (canvas, _context, w, h, is3D = false) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const ctx = _context.ctx;
    const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
    const ratio = devicePixelRatio / backingStoreRatio;
    _context.ratio = ratio;
    if (devicePixelRatio !== backingStoreRatio) {
        const oldWidth = w;
        const oldHeight = h;
        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;
        canvas.style.width = `${ oldWidth }px`;
        canvas.style.height = `${ oldHeight }px`;
        if (!is3D) {
            ctx.scale(ratio, ratio);
        }
    }
};
class Canvas extends inferno_1.Component {
    constructor(props) {
        super(props);
    }
    canvasElemRef(domNode) {
        this.canvasElement = domNode;
    }
    componentDidMount() {
        const canvas = this.canvasElement;
        const props = this.props;
        let context;
        if (props.is3D) {
            const ctx3D = canvas.getContext('experimental-webgl');
            if (!ctx3D) {
                console.error('No webgl support');
                return;
            }
            context = engine_1.toWebGLCtx(ctx3D, props.width, props.height);
        } else {
            const ctx2D = canvas.getContext('2d');
            if (!ctx2D) {
                console.warn('No canvas support');
                return;
            }
            context = engine_1.toCanvasCtx(ctx2D, props.width, props.height, document.createElementNS('http://www.w3.org/2000/svg', 'svg'));
        }
        initPixelRatio(canvas, context, this.props.width, this.props.height, props.is3D);
        if (props.onContext) {
            props.onContext(context);
        }
    }
    componentWillUnmount() {
        const canvas = this.canvasElement;
        const props = this.props;
        if (canvas) {
            const context = canvas.getContext('2d');
            if (props.onUnmount && context) {
                props.onUnmount(context);
            }
        }
    }
    render() {
        const props = this.props;
        return createVNode(1, 'canvas', `Canvas ${ props.is3D ? 'webgl' : '' } ${ props.className || '' }`, null, 1, {
            'width': props.width,
            'height': props.height,
            'style': props.style
        }, null, this.canvasElemRef.bind(this));
    }
}
exports.default = Canvas;
}
// default/dom/components/editor/color_picker/color_code.jsx
$fsx.f[111] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
class ColorCode extends inferno_1.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            r: props.color.r,
            g: props.color.g,
            b: props.color.b,
            hex: data_1.RGBColor.toHex(props.color)
        };
    }
    handleR(that, e) {
        const target = e.target;
        const t = target.value;
        const newR = parseInt(t, 10);
        if (!isNaN(newR)) {
            const hex = data_1.RGBColor.toHex(new data_1.RGBColor(newR, that.state.g, that.state.b));
            that.setState({
                r: newR,
                g: that.state.g,
                b: that.state.b,
                hex
            });
        }
    }
    handleG(that, e) {
        const target = e.target;
        const t = target.value;
        const newG = parseInt(t, 10);
        if (!isNaN(newG)) {
            const hex = data_1.RGBColor.toHex(new data_1.RGBColor(that.state.r, newG, that.state.b));
            that.setState({
                r: that.state.r,
                g: newG,
                b: that.state.b,
                hex
            });
        }
    }
    handleB(that, e) {
        const target = e.target;
        const t = target.value;
        const newB = parseInt(t, 10);
        if (!isNaN(newB)) {
            const hex = data_1.RGBColor.toHex(new data_1.RGBColor(that.state.r, that.state.g, newB));
            that.setState({
                r: that.state.r,
                g: that.state.g,
                b: newB,
                hex
            });
        }
    }
    handleHex(that, e) {
        const target = e.target;
        let t = target.value;
        const hasHash = t[0] === '#';
        let c;
        if (t.length === 6 && !hasHash) {
            c = data_1.RGBColor.fromHex(`#${ t }`);
        } else if (t.length === 7 && hasHash) {
            c = data_1.RGBColor.fromHex(t);
        } else {
            const correctLen = 6;
            let colorT = t;
            do {
                colorT = colorT + '0';
            } while (colorT.length < correctLen);
            if (hasHash) {
                c = data_1.RGBColor.fromHex(colorT);
            } else {
                c = data_1.RGBColor.fromHex(`#${ colorT }`);
            }
        }
        if (c) {
            that.setState({
                r: c.r,
                g: c.g,
                b: c.b,
                hex: t
            });
        }
    }
    componentWillReceiveProps(props) {
        this.state = {
            r: props.color.r,
            g: props.color.g,
            b: props.color.b,
            hex: data_1.RGBColor.toHex(props.color)
        };
    }
    render() {
        const props = this.props;
        return createVNode(1, 'div', `ColorCode bg-near-white top-0 absolute ${ props.className || '' }`, [
            createVNode(1, 'div', 'flex flex-column items-start justify-center mt5', [
                createVNode(1, 'div', 'flex', [
                    createVNode(1, 'p', 'sans-serif mh3', createTextVNode('RGB'), 2),
                    createVNode(64, 'input', 'f4 sans-serif w3 pa1', null, 1, {
                        'onInput': inferno_1.linkEvent(this, this.handleR),
                        'value': this.state.r,
                        'defaultValue': `${ props.color.r }`,
                        'maxLength': 3,
                        'placeholder': 'R'
                    }),
                    createVNode(64, 'input', 'f4 sans-serif w3 pa1', null, 1, {
                        'onInput': inferno_1.linkEvent(this, this.handleG),
                        'value': this.state.g,
                        'defaultValue': `${ props.color.g }`,
                        'maxLength': 3,
                        'placeholder': 'G'
                    }),
                    createVNode(64, 'input', 'f4 sans-serif w3 pa1', null, 1, {
                        'onInput': inferno_1.linkEvent(this, this.handleB),
                        'value': this.state.b,
                        'defaultValue': `${ props.color.b }`,
                        'maxLength': 3,
                        'placeholder': 'B'
                    })
                ], 4),
                createVNode(1, 'div', 'flex mt2 items-center', [
                    createVNode(1, 'p', 'sans-serif mh3', createTextVNode('HEX'), 2),
                    createVNode(64, 'input', 'f4 sans-serif w4 pa1', null, 1, {
                        'onInput': inferno_1.linkEvent(this, this.handleHex),
                        'value': this.state.hex,
                        'defaultValue': data_1.RGBColor.toHex(props.color),
                        'maxLength': 7
                    }),
                    createVNode(1, 'div', 'ml3 br-100 w2 h2', null, 1, { 'style': { background: this.state.hex } })
                ], 4)
            ], 4),
            createComponentVNode(2, buttons_1.Button, {
                'id': data_1.RGBColor.toHex(new data_1.RGBColor(this.state.r, this.state.g, this.state.b)),
                'className': 'ml5 mt2',
                'label': 'Done',
                'onAction': props.onDone
            })
        ], 4, { 'style': props.style });
    }
}
exports.ColorCode = ColorCode;
}
// default/dom/components/editor/color_picker/color_shapes.jsx
$fsx.f[112] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
function buildDefs(paths) {
    const result = [];
    for (const entry of paths.entries()) {
        const path = entry[1];
        const id = result.length;
        const href = `#${ id }`;
        const xlink = {
            'xlink:href': href,
            'visibility': 'visible'
        };
        result.push(createVNode(1, 'defs', null, [
            createVNode(1, 'path', null, null, 1, {
                'd': path.d,
                'id': id
            }),
            createVNode(1, 'clipPath', null, normalizeProps(createVNode(1, 'use', null, null, 1, Object.assign({}, xlink))), 2, { 'id': `clip-${ id }` })
        ], 4, null, `pathdef-${ id }`));
    }
    return result;
}
function buildPaths(selected, paths, onAction, accum) {
    let i = 0;
    for (const [fillId, path] of paths.entries()) {
        const id = i++;
        const xlink = { 'xlink:href': `#${ id }` };
        const action = onAction ? inferno_1.linkEvent(fillId, onAction) : onAction;
        accum.push(createVNode(1, 'g', null, normalizeProps(createVNode(1, 'use', 'hover-orange-stroke pointer', null, 1, Object.assign({}, xlink, {
            'fill': path.fill,
            'onClick': action,
            'onTouchEnd': action,
            'stroke-width': 20,
            'clip-path': `url(#clip-${ id })`
        }))), 2, null, `pathuse-${ id }`));
    }
    return accum;
}
function buildShapes(props) {
    let result = buildDefs(props.shapesPaths);
    const action = props.onAction;
    result = buildPaths(props.selected, props.shapesPaths, action, result);
    result.push(createVNode(1, 'path', null, null, 1, {
        'd': props.templatePath,
        'stroke': '#333333',
        'fill': 'transparent',
        'stroke-width': 10
    }, 'template-path-shape'));
    return result;
}
exports.ColorShapes = props => createVNode(32, 'svg', `ColorShapes pointer ${ props.className || '' }`, buildShapes(props), 8, {
    'xmlns': 'http://www.w3.org/2000/svg',
    'version': '1.1',
    'baseProfile': 'basic',
    'viewBox': `0 0 ${ props.resolution } ${ props.resolution }`
});
}
// default/dom/components/editor/color_picker/mode_menu.jsx
$fsx.f[113] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
function ModeMenu(props) {
    return createVNode(1, 'nav', `ModeMenu ${ props.className || '' }`, props.menu.map((id, e, isSelected) => createVNode(1, 'button', `h3 pointer bg-transparent bn pa0 ma0 w3 ${ isSelected ? 'bottom-circle' : 'hover-color' }`, [
        createVNode(1, 'img', 'w2', null, 1, {
            'src': e.iconUrl,
            'alt': `${ id }`
        }),
        createVNode(1, 'p', 'sans-serif f7 black ma0 pa0', e.label, 0)
    ], 4, { 'onClick': inferno_1.linkEvent(id, props.onAction) })), 0);
}
exports.ModeMenu = ModeMenu;
}
// default/dom/components/editor/color_picker/recent.jsx
$fsx.f[114] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const buttons_1 = $fsx.r(106);
exports.RecentColors = props => createVNode(1, 'nav', `RecentColors ${ props.className || '' }`, [
    createVNode(1, 'div', 'Code dn flex-ns flex-column items-center justify-center', createComponentVNode(2, buttons_1.Button, {
        'className': 'mt2',
        'label': props.isOnCode ? 'Exit' : 'Code',
        'onAction': props.onCode
    }), 2),
    createVNode(1, 'div', 'MRU flex flex-column-reverse', props.hexValues.map(h => createVNode(1, 'button', 'pa0 ma0 w1 h1 w2-ns h2-ns br-100 b--dark-gray dim pointer ba mv2 mv1-ns', null, 1, {
        'onClick': inferno_1.linkEvent(h, props.onColorSelect),
        'style': { 'background-color': h }
    })), 0),
    createVNode(1, 'p', 'f7-ns f8 ttu gray sans-serif center tc w2', createTextVNode('In Use'), 2)
], 4);
}
// default/dom/components/editor/shape/figures_menu.jsx
$fsx.f[115] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const buttons_1 = $fsx.r(106);
function renderMenu(props) {
    const viewbox = `0 0 ${ props.resolution } ${ props.resolution }`;
    const className = 'ba w1 h1 mh1 dim pointer b--light-silver w2-ns h2-ns';
    const selectedCx = className + ' b--orange';
    const btnCx = 'color-btn pa0 bn link pointer dim bg-transparent mt1';
    const result = [];
    for (let i = 0; i < props.shapes.length; i++) {
        result.push(createVNode(1, 'button', btnCx, createVNode(32, 'svg', props.selected === i ? selectedCx : className, createVNode(1, 'path', null, null, 1, {
            'd': props.shapes[i],
            'fill': props.fills[i]
        }), 2, {
            'version': '1.1',
            'baseProfile': 'basic',
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': viewbox
        }), 2, {
            'onClick': inferno_1.linkEvent({
                d: props.shapes[i],
                index: i
            }, props.onFigureAction)
        }, `${ props.shapes[i] }-${ props.fills[i] }`));
    }
    return result;
}
exports.FiguresMenu = props => {
    const hasShapes = props.shapes.length > 0;
    const cx = `FiguresMenu ${ props.className || '' } fixed bottom-4 mb3 static-ns`;
    if (!hasShapes) {
        return createVNode(1, 'div', `${ cx }
				w-100 h2 flex items-center justify-center bg-near-white pr0-ns mb0-ns mt2-ns h3-ns items-end-ns ml0-ns`, createComponentVNode(2, buttons_1.Button, {
            'className': 'mr0-ns blue b--blue',
            'bg': 'near-white',
            'label': 'Change Shape Template',
            'onAction': props.onEnterTemplateSelector
        }), 2, { 'style': props.isNotSmall && props.size ? { width: `${ props.size }px` } : {} });
    } else {
        return createVNode(1, 'nav', `${ cx } flex justify-center h2 items-center bg-near-white overflow-y-auto flex-wrap mb0-ns mt2-ns ml0-ns h3-ns items-end-ns justify-center-ns w-100`, renderMenu(props), 0, { 'style': props.isNotSmall && props.size ? { width: `${ props.size }px` } : {} });
    }
};
}
// default/dom/components/editor/export.jsx
$fsx.f[116] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const export_animation_svg_1 = $fsx.r(117);
const export_image_svg_1 = $fsx.r(118);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const animation_1 = $fsx.r(119);
const done_1 = $fsx.r(121);
const image_1 = $fsx.r(123);
const payment_1 = $fsx.r(124);
function selectProductComponent(props) {
    switch (props.data.at) {
    case data_1.ExportAt.Image:
        return createComponentVNode(2, image_1.ExportImage, {
            'data': props.data,
            'events': props.events
        });
    case data_1.ExportAt.Video:
        return createComponentVNode(2, animation_1.ExportAnimation, {
            'data': props.data,
            'events': props.events,
            'playerEvents': props.playerEvents,
            'playerData': props.playerData
        });
    case data_1.ExportAt.Done:
        return createComponentVNode(2, done_1.ExportDone, {
            'data': props.data,
            'events': props.events,
            'height': props.height
        });
    default:
        return renderPayment(props);
    }
}
function renderPayment(props) {
    return createComponentVNode(2, payment_1.ExportPayment, {
        'height': props.height,
        'onExit': props.onExit
    }, null, { 'onComponentDidMount': props.events.loadPaypal });
}
function renderExport(props) {
    return createVNode(1, 'div', `Export ${ props.className || '' }
		flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('Export project'), 2),
        createVNode(1, 'div', 'flex items-center justify-center gray', [
            createVNode(1, 'a', `pv2 ph4 ${ props.data.at === data_1.ExportAt.Image ? 'z-1 br bl bt b--gray bg-white black bold' : 'bg-transparent gray' } flex f6 link dim ttu pointer`, [
                createTextVNode(' '),
                createVNode(1, 'img', 'mr2 w1 h1', null, 1, { 'src': export_image_svg_1.default }),
                createTextVNode(' Image ')
            ], 4, { 'onClick': props.events.onChangeToImage }),
            createVNode(1, 'a', `pv2 ph4 ${ props.data.at === data_1.ExportAt.Video ? 'z-1 br bl bt b--gray bg-white black bold' : 'bg-transparent gray' } flex f6 link dim ttu pointer`, [
                createTextVNode(' '),
                createVNode(1, 'img', 'mr2 w1 h1', null, 1, { 'src': export_animation_svg_1.default }),
                createTextVNode(' Animation ')
            ], 4, { 'onClick': props.events.onChangeToVideo })
        ], 4),
        createVNode(1, 'div', 'bt b--gray bg-white w-100', selectProductComponent(props), 0, {
            'style': {
                'box-shadow': 'inset -5px 0 2px -1px #ccc',
                'transform': 'translateY(-1px)'
            }
        }),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createVNode(1, 'div', 'mt4 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': props.data.at === data_1.ExportAt.Done ? 'Done' : 'Cancel',
                'onAction': props.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'label': props.data.at === data_1.ExportAt.Done ? 'Download It' : 'Export',
                'onAction': props.events.onExport
            })
        ], 4)
    ], 4), 2, { 'style': { height: props.height } });
}
function renderLoading(props) {
    return createVNode(1, 'div', `ExportLoading ${ props.className || '' }
			flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', props.data.at === data_1.ExportAt.Preparing ? 'Preparing file' : 'Loading', 0),
        createVNode(1, 'p', '', props.data.at === data_1.ExportAt.Preparing ? 'Please wait (takes a couple of minutes)' : 'Please wait', 0),
        createVNode(1, 'div', 'mt4 flex items-center justify-center', createComponentVNode(2, buttons_1.Button, {
            'className': 'mh2',
            'bg': 'transparent',
            'color': 'dark-gray',
            'label': 'Cancel',
            'onAction': props.onExit
        }), 2)
    ], 4), 2, { 'style': { height: props.height } });
}
exports.Export = props => {
    if (props.data.isLoading || props.data.at === data_1.ExportAt.Preparing) {
        return renderLoading(props);
    } else if (props.data.needsPayment) {
        return renderPayment(props);
    } else {
        return renderExport(props);
    }
};
}
// default/assets/icons/export-animation.svg
$fsx.f[117] = function(module,exports){
module.exports.default = '/assets/4ea2c944-export-animation.svg';
}
// default/assets/icons/export-image.svg
$fsx.f[118] = function(module,exports){
module.exports.default = '/assets/393024ad-export-image.svg';
}
// default/dom/components/editor/export/animation.jsx
$fsx.f[119] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const svg_1 = $fsx.r(120);
exports.ExportAnimation = props => {
    const res = props.data.calcres();
    return createVNode(1, 'section', `ExportAnimation flex ${ props.className || '' }`, [
        createVNode(1, 'div', 'mock flex flex-column items-center justify-center ml3 w4 w5-ns', props.data.imgPreview && props.data.imgViewbox ? createComponentVNode(2, svg_1.ArtSVG, {
            'className': 'w4 h4',
            'svg': props.data.imgPreview,
            'viewbox': props.data.imgViewbox
        }) : createVNode(1, 'div'), 0),
        createVNode(1, 'div', 'info', [
            createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Chose Format'), 2),
            createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w3 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.format === data_1.ExportEditorFormat.MP4 ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('MP4'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportEditorFormat.MP4, props.events.onFormatChange) }),
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w3 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.format === data_1.ExportEditorFormat.GIF ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('GIF'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportEditorFormat.GIF, props.events.onFormatChange) })
            ], 4)
        ], 4)
    ], 4);
};
}
// default/dom/components/base/svg.jsx
$fsx.f[120] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
exports.ArtSVG = props => {
    const xlinkns = { 'xmlns:xlink': 'http://www.w3.org/1999/xlink' };
    const shapeRendering = { 'shape-rendering': 'crispEdges' };
    return normalizeProps(createVNode(32, 'svg', props.className, null, 1, Object.assign({}, shapeRendering, {
        'version': '1.1',
        'xmlns': 'http://www.w3.org/2000/svg',
        'x': '0px',
        'y': '0px',
        'style': props.style,
        'viewBox': props.viewbox.join(' '),
        'dangerouslySetInnerHTML': { __html: props.svg }
    })));
};
}
// default/dom/components/editor/export/done.jsx
$fsx.f[121] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
const export_done_svg_1 = $fsx.r(122);
exports.ExportDone = props => createVNode(1, 'div', `ExportDone ${ props.className || '' }
		flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
    createVNode(1, 'h2', '', createTextVNode('Your file is ready'), 2),
    createVNode(1, 'img', 'pv3', null, 1, {
        'src': export_done_svg_1.default,
        'alt': 'Done'
    })
], 4), 2);
}
// default/assets/icons/export-done.svg
$fsx.f[122] = function(module,exports){
module.exports.default = '/assets/46a43915-export-done.svg';
}
// default/dom/components/editor/export/image.jsx
$fsx.f[123] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const svg_1 = $fsx.r(120);
exports.ExportImage = props => {
    const res = props.data.calcres();
    return createVNode(1, 'section', `ExportImage flex ${ props.className || '' }`, [
        createVNode(1, 'div', 'mock flex flex-column items-center justify-center ml3 w4 w5-ns', props.data.imgPreview && props.data.imgViewbox ? createComponentVNode(2, svg_1.ArtSVG, {
            'className': 'w4 h4',
            'svg': props.data.imgPreview,
            'viewbox': props.data.imgViewbox
        }) : createVNode(1, 'div'), 0),
        createVNode(1, 'div', 'info', [
            createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Chose Format'), 2),
            createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w3 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.format === data_1.ExportEditorFormat.SVG ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('SVG'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportEditorFormat.SVG, props.events.onFormatChange) }),
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w3 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.format === data_1.ExportEditorFormat.PNG ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('PNG'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportEditorFormat.PNG, props.events.onFormatChange) })
            ], 4),
            createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Size'), 2),
            createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.size === data_1.ExportSize.HDReady ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('S'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportSize.HDReady, props.events.onSizeChange) }),
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.size === data_1.ExportSize.FullHD ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('M'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportSize.FullHD, props.events.onSizeChange) }),
                createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.data.size === data_1.ExportSize.UHD ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('L'), 2, { 'onClick': inferno_1.linkEvent(data_1.ExportSize.UHD, props.events.onSizeChange) })
            ], 4),
            createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Dimension'), 2),
            createVNode(1, 'p', 'ma0 pa0 f7 ttu', [
                Math.ceil(res.width),
                createTextVNode(' \u2715 '),
                Math.ceil(res.height)
            ], 0),
            createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Pattern'), 2),
            createVNode(64, 'input', 'w3 w4-ns', null, 1, {
                'type': 'range',
                'min': '1',
                'max': '8',
                'step': '1',
                'defaultValue': `${ props.data.patternSize }`,
                'onChange': props.events.onPatternChange
            })
        ], 4)
    ], 4);
};
}
// default/dom/components/editor/export/payment.jsx
$fsx.f[124] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const export_animation_svg_1 = $fsx.r(117);
const export_image_svg_1 = $fsx.r(118);
const buttons_1 = $fsx.r(106);
const total_1 = $fsx.r(125);
exports.ExportPayment = props => {
    return createVNode(1, 'div', `ExportPayment ${ props.className || '' }
			flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('Locked feature'), 2),
        createVNode(1, 'div', 'bt b--gray bg-white w-100 flex flex-column justify-center items-center', [
            createVNode(1, 'p', 'b tc', [
                createTextVNode('Exporting this project is a paid feature'),
                createVNode(1, 'br'),
                createTextVNode('By paying you can save it as')
            ], 4),
            createVNode(1, 'div', 'w5 flex items-center', [
                createVNode(1, 'img', 'w2 mr3', null, 1, {
                    'src': export_image_svg_1.default,
                    'alt': 'image'
                }),
                createVNode(1, 'p', '', [
                    createTextVNode('Image '),
                    createVNode(1, 'span', 'f6 i', createTextVNode('(SVG or PNG)'), 2)
                ], 4)
            ], 4),
            createVNode(1, 'div', 'w5 flex items-center', [
                createVNode(1, 'img', 'w2 mr3', null, 1, {
                    'src': export_animation_svg_1.default,
                    'alt': 'image'
                }),
                createVNode(1, 'p', '', [
                    createTextVNode('Animation '),
                    createVNode(1, 'span', 'f6 i', createTextVNode('(GIF or MP4)'), 2)
                ], 4)
            ], 4),
            createVNode(1, 'p', 'f6 mb3', createTextVNode('You will also be supporting Grid Generator.'), 2)
        ], 4, {
            'style': {
                'box-shadow': 'inset -5px 0 2px -1px #ccc',
                'transform': 'translateY(-1px)'
            }
        }),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createComponentVNode(2, total_1.TotalPrice, {
            'products': [{
                    price: 4.69,
                    quantity: 1
                }]
        }),
        createVNode(1, 'div', 'mt4 flex flex-column items-center justify-center', [
            createVNode(1, 'div', null, null, 1, { 'id': 'paypal-button' }),
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mv3',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'onAction': props.onExit
            })
        ], 4)
    ], 4), 2, { 'style': { height: props.height } });
};
}
// default/dom/components/editor/product/total.jsx
$fsx.f[125] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
function sumPrices(p) {
    let total = 0;
    for (let i = 0; i < p.length; i++) {
        total += p[i].price * p[i].quantity;
    }
    return total;
}
exports.TotalPrice = props => {
    const cx = `TotalPrice flex items-center justify-center`;
    const pcx = `ttu f7 ma0 pa0 mr2`;
    if (props.products.length > 0) {
        return createVNode(1, 'div', cx, [
            createVNode(1, 'p', pcx, createTextVNode('Total:'), 2),
            createVNode(1, 'p', 'ttu b f5 ma0 pa0', [
                createTextVNode('\u20AC'),
                sumPrices(props.products)
            ], 0)
        ], 4);
    } else {
        return createVNode(1, 'div', cx, createVNode(1, 'p', pcx, createTextVNode('No items in the cart'), 2), 2);
    }
};
}
// default/dom/components/editor/product.jsx
$fsx.f[126] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const product_frame_svg_1 = $fsx.r(127);
const product_shirt_svg_1 = $fsx.r(128);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const form_1 = $fsx.r(129);
const in_cart_product_1 = $fsx.r(130);
const poster_1 = $fsx.r(132);
const total_1 = $fsx.r(125);
const tshirt_1 = $fsx.r(134);
function selectProductComponent(props) {
    switch (props.data.product.at) {
    case data_1.ProductAt.Poster:
        return createComponentVNode(2, poster_1.Poster, {
            'posterType': props.data.product.posterType,
            'posterDeltaX': props.data.product.posterDeltaX,
            'posterDeltaY': props.data.product.posterDeltaY,
            'posterPreviewH': props.data.product.posterPreviewH,
            'posterPreviewW': props.data.product.posterPreviewW,
            'onAddToCart': props.events.onAddToCart,
            'onArtSizeChange': props.events.onArtSizeChange,
            'onTypeChange': props.events.onPosterTypeChange,
            'artSize': props.data.product.artSize,
            'svg': props.data.product.artSVG || '',
            'svgViewbox': props.data.product.artViewbox || [
                0,
                0,
                0,
                0
            ],
            'price': props.data.product.price
        });
    default:
        return createComponentVNode(2, tshirt_1.TShirt, {
            'price': props.data.product.price,
            'onTypeChange': props.events.onTShirtTypeChange,
            'onSizeChange': props.events.onTShirtSizeChange,
            'onArtSizeChange': props.events.onArtSizeChange,
            'onColorChange': props.events.onTShirtColorChange,
            'onAddToCart': props.events.onAddToCart,
            'tshirtType': props.data.product.tshirtType,
            'tshirtSize': props.data.product.tshirtSize,
            'tshirtColor': props.data.product.tshirtColor,
            'tshirtDeltaX': props.data.product.tshirtDeltaX,
            'tshirtDeltaY': props.data.product.tshirtDeltaY,
            'tshirtPreviewH': props.data.product.tshirtPreviewH,
            'tshirtPreviewW': props.data.product.tshirtPreviewW,
            'artSize': props.data.product.artSize,
            'svg': props.data.product.artSVG || '',
            'svgViewbox': props.data.product.artViewbox || [
                0,
                0,
                0,
                0
            ]
        });
    }
}
function renderAddress(props) {
    const inputcx = 'input-reset f6 ba b--black-20 br1 pa2 mb2 ml2 db w5';
    const labelcx = 'f6 b pa2 db tl';
    return createVNode(1, 'div', `ProductEditor ${ props.className || '' }
			flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('Shipping Address'), 2),
        createVNode(1, 'div', 'form', [
            createVNode(1, 'label', labelcx, createTextVNode('Name'), 2),
            createComponentVNode(2, form_1.Input, {
                'className': inputcx,
                'type': 'text',
                'name': 'address-name',
                'id': 'address-name',
                'required': true,
                'value': props.data.address ? props.data.address.name : ''
            }),
            createVNode(1, 'label', labelcx, createTextVNode('Country'), 2),
            createVNode(256, 'select', inputcx, props.data.address.countries.map(c => createVNode(1, 'option', null, c.name, 0, {
                'value': c.code,
                'selected': c.code === props.data.address.country
            })), 0, {
                'id': 'address-country',
                'onChange': props.events.onChangeCountry
            }),
            createVNode(1, 'label', labelcx, [
                createTextVNode('Address '),
                createVNode(1, 'span', 'f6 gray', createTextVNode('(Street, house number, building number, apt...)'), 2)
            ], 4),
            createComponentVNode(2, form_1.Input, {
                'className': inputcx,
                'type': 'text',
                'name': 'address-address',
                'id': 'address-address',
                'required': true,
                'value': props.data.address ? props.data.address.address : ''
            }),
            createVNode(1, 'div', 'flex', [
                createVNode(1, 'div', null, [
                    createVNode(1, 'label', labelcx, createTextVNode('Postal Code'), 2),
                    createComponentVNode(2, form_1.Input, {
                        'className': inputcx,
                        'type': 'text',
                        'name': 'address-postal',
                        'id': 'address-postal',
                        'required': true,
                        'value': props.data.address ? props.data.address.postalCode : ''
                    })
                ], 4),
                createVNode(1, 'div', null, [
                    createVNode(1, 'label', labelcx, createTextVNode('City'), 2),
                    createComponentVNode(2, form_1.Input, {
                        'className': inputcx,
                        'type': 'text',
                        'name': 'address-city',
                        'id': 'address-city',
                        'required': true,
                        'value': props.data.address ? props.data.address.city : ''
                    })
                ], 4)
            ], 4),
            createVNode(1, 'label', labelcx, createTextVNode('State / Province / Region'), 2),
            props.data.address.states ? createVNode(256, 'select', inputcx, props.data.address.states.map(s => createVNode(1, 'option', null, s.name, 0, {
                'value': s.code,
                'selected': s.code === props.data.address.state
            })), 0, { 'id': 'address-state' }) : createComponentVNode(2, form_1.Input, {
                'className': inputcx,
                'type': 'text',
                'name': 'address-state',
                'id': 'address-state',
                'required': true,
                'value': props.data.address ? props.data.address.state : ''
            })
        ], 0),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createComponentVNode(2, total_1.TotalPrice, { 'products': props.data.inside }),
        createVNode(1, 'div', 'mt4 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'onAction': props.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'id': props.data,
                'className': 'mh2',
                'label': 'Continue',
                'onAction': props.events.onShippingAddressDone
            })
        ], 4)
    ], 4), 2, { 'style': { height: props.height } });
}
function renderConfirmation(props) {
    return createVNode(1, 'div', `ProductEditor ${ props.className || '' }
			flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('Confirm your order'), 2),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createComponentVNode(2, total_1.TotalPrice, { 'products': props.data.inside }),
        createVNode(1, 'div', 'mt4 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'onAction': props.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'id': props.data,
                'className': 'mh2',
                'label': 'Checkout',
                'onAction': props.events.onAddToCart
            })
        ], 4)
    ], 4), 2, { 'style': { height: props.height } });
}
function buildProducts(props) {
    const result = props.data.inside.map((p, i) => createComponentVNode(2, in_cart_product_1.InCartProduct, {
        'index': i,
        'product': p,
        'events': props.events
    }, i));
    result.push(createComponentVNode(2, buttons_1.Button, {
        'className': 'mt3',
        'bg': 'transparent',
        'color': 'dark-gray',
        'label': 'Add New Product',
        'onAction': props.onExit
    }));
    return result;
}
function renderCart(props) {
    return createVNode(1, 'div', `ProductEditor ${ props.className || '' }
		flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('In Cart'), 2),
        createVNode(1, 'nav', null, buildProducts(props), 0),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createComponentVNode(2, total_1.TotalPrice, { 'products': props.data.inside }),
        createVNode(1, 'div', 'mt4 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'onAction': props.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'id': props.data,
                'className': 'mh2',
                'label': 'Checkout',
                'onAction': props.events.onCheckoutCart
            })
        ], 4)
    ], 4), 2, { 'style': { height: props.height } });
}
function renderProduct(props) {
    return createVNode(1, 'div', `ProductEditor ${ props.className || '' }
		flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', '', createTextVNode('Bring it to life'), 2),
        createVNode(1, 'div', 'flex items-center justify-center gray', [
            createVNode(1, 'a', `pv2 ph4 ${ props.data.product.at === data_1.ProductAt.Poster ? 'z-1 br bl bt b--gray bg-white black bold' : 'bg-transparent gray' } flex f6 link dim ttu pointer`, [
                createVNode(1, 'img', 'mr2 w1 h1', null, 1, { 'src': product_frame_svg_1.default }),
                createTextVNode('Poster')
            ], 4, { 'onClick': props.events.onChangeToPoster }),
            createVNode(1, 'a', `pv2 ph4 ${ props.data.product.at === data_1.ProductAt.TShirt ? 'z-1 br bl bt b--gray bg-white black bold' : 'bg-transparent gray' } flex f6 link dim ttu pointer`, [
                createVNode(1, 'img', 'mr2 w1 h1', null, 1, { 'src': product_shirt_svg_1.default }),
                createTextVNode('T-Shirt')
            ], 4, { 'onClick': props.events.onChangeToTShirt })
        ], 4),
        createVNode(1, 'div', 'bt b--gray bg-white w-100', selectProductComponent(props), 0, {
            'style': {
                'box-shadow': 'inset -5px 0 2px -1px #ccc',
                'transform': 'translateY(-1px)'
            }
        }),
        createVNode(1, 'hr', 'mt4 w5 bb bw1 b--black-10'),
        createComponentVNode(2, total_1.TotalPrice, { 'products': props.data.inside }),
        props.data.inside.length > 0 ? createVNode(1, 'div', 'mt4 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'onAction': props.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'View Cart',
                'onAction': props.events.onViewCart
            }),
            createComponentVNode(2, buttons_1.Button, {
                'id': props.data,
                'className': 'mh2',
                'label': 'Checkout',
                'onAction': props.events.onAddToCart
            })
        ], 4) : createVNode(1, 'div', 'mt4 w5 flex items-center justify-center', createComponentVNode(2, buttons_1.Button, {
            'className': 'mh2',
            'bg': 'transparent',
            'color': 'dark-gray',
            'label': 'Cancel',
            'onAction': props.onExit
        }), 2)
    ], 0), 2, { 'style': { height: props.height } });
}
exports.Product = props => {
    switch (props.data.at) {
    case data_1.CartAt.Product:
        return renderProduct(props);
    case data_1.CartAt.InCart:
        return renderCart(props);
    case data_1.CartAt.ShippingAddress:
        return renderAddress(props);
    case data_1.CartAt.Confirmation:
        return renderConfirmation(props);
    }
};
}
// default/assets/icons/product-frame.svg
$fsx.f[127] = function(module,exports){
module.exports.default = '/assets/95978f69-product-frame.svg';
}
// default/assets/icons/product-shirt.svg
$fsx.f[128] = function(module,exports){
module.exports.default = '/assets/3a8d97e1-product-shirt.svg';
}
// default/dom/components/base/form.jsx
$fsx.f[129] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
class Input extends inferno_1.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { inputValue: null };
    }
    handleText(that, e) {
        const t = e.target;
        that.setState({ inputValue: t.value ? t.value : '' });
        if (this && this.props.onInput) {
            this.props.onInput(t.value);
        }
    }
    render() {
        return createVNode(64, 'input', this.props.className || '', null, 1, {
            'id': this.props.id || null,
            'type': this.props.type || 'text',
            'value': this.state.inputValue || this.props.value,
            'defaultValue': this.props.defaultValue || '',
            'onInput': inferno_1.linkEvent(this, this.handleText),
            'disabled': this.props.disabled,
            'placeholder': this.props.placeholder || '',
            'maxLength': this.props.maxLength || null
        });
    }
}
exports.Input = Input;
class TextArea extends inferno_1.Component {
    constructor(props, context) {
        super(props, context);
        this.state = { inputValue: null };
    }
    handleText(that, e) {
        const t = e.target;
        that.setState({ inputValue: t.value ? t.value : '' });
    }
    render() {
        return createVNode(128, 'textarea', this.props.className || '', null, 1, {
            'id': this.props.id || null,
            'value': this.state.inputValue || this.props.value,
            'defaultValue': this.props.defaultValue || '',
            'onInput': inferno_1.linkEvent(this, this.handleText),
            'disabled': this.props.disabled,
            'placeholder': this.props.placeholder || ''
        });
    }
}
exports.TextArea = TextArea;
}
// default/dom/components/editor/product/in_cart_product.jsx
$fsx.f[130] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const product_cart_remove_svg_1 = $fsx.r(131);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
function renderInfo(product) {
    const pcx = 'mh2';
    const tcx = 'ttu f6 ma0 pa0';
    const scx = 'ttu f7 ma0 pa0 normal';
    switch (product.at) {
    case data_1.ProductAt.Poster:
        return createVNode(1, 'div', pcx, [
            createVNode(1, 'h1', tcx, product.productType(), 0),
            createVNode(1, 'h2', scx, [
                createTextVNode('Size: '),
                createVNode(1, 'span', null, product.posterType, 0)
            ], 4)
        ], 4);
    case data_1.ProductAt.TShirt:
        return createVNode(1, 'div', pcx, [
            createVNode(1, 'h1', tcx, product.productType(), 0),
            createVNode(1, 'h2', scx, [
                createTextVNode('Size: '),
                createVNode(1, 'span', null, product.tshirtSize, 0)
            ], 4),
            createVNode(1, 'h2', scx, [
                createTextVNode('Type: '),
                createVNode(1, 'span', null, product.tshirtType, 0)
            ], 4),
            createVNode(1, 'h2', scx + ' flex items-center justify-start', [
                createTextVNode('Color: '),
                createVNode(1, 'div', 'mh2 ba w1 h1', null, 1, { 'style': { background: product.tshirtColor } })
            ], 4)
        ], 4);
    }
}
exports.InCartProduct = props => {
    if (!props.product.artViewbox || !props.product.artSVG) {
        return createVNode(1, 'div', 'InCartProduct empty');
    }
    const extra = { 'shape-rendering': 'crispEdges' };
    return createVNode(1, 'article', 'InCartProduct flex items-center justify-start', [
        createVNode(1, 'div', 'product bg-white ba w5 pa2 flex items-stretch justify-between', [
            createVNode(1, 'div', 'flex items-center justify-start', [
                normalizeProps(createVNode(32, 'svg', 'w2 h2 mh2', null, 1, Object.assign({}, extra, {
                    'version': '1.1',
                    'xmlns': 'http://www.w3.org/2000/svg',
                    'x': '0px',
                    'y': '0px',
                    'viewBox': props.product.artViewbox.join(' '),
                    'style': { background: 'white' },
                    'dangerouslySetInnerHTML': { __html: props.product.artSVG }
                }))),
                renderInfo(props.product)
            ], 0),
            createVNode(1, 'div', 'flex flex-column items-end justify-start', [
                createVNode(1, 'p', 'ma0 pa0 ttu orange f5 bold', [
                    createTextVNode('\u20AC'),
                    props.product.price
                ], 0),
                createVNode(1, 'p', 'ma0 pa0 ttu black f8 normal small', createTextVNode('(per unit)'), 2)
            ], 4)
        ], 4),
        createVNode(1, 'div', 'tools ml2 flex flex-column items-between justify-center', [
            createVNode(1, 'div', 'quantity flex flex-column items-center justify-center mb3', [
                createVNode(1, 'p', 'f7 ttu normal ma0 pa0', createTextVNode('Quantity'), 2),
                createComponentVNode(2, buttons_1.AmmountBtn, {
                    'onInc': props.events.onCartIncQty,
                    'onDec': props.events.onCartDecQty,
                    'value': props.product.quantity,
                    'max': 128,
                    'min': 1,
                    'arg': props.index
                })
            ], 4),
            createVNode(1, 'a', 'link dim red f8 ttu ma0 pa0', createVNode(1, 'img', 'w1 h1', null, 1, {
                'src': product_cart_remove_svg_1.default,
                'alt': 'remove'
            }), 2, {
                'href': '#',
                'onClick': inferno_1.linkEvent(props.index, props.events.onCartRemove)
            })
        ], 4)
    ], 4);
};
}
// default/assets/icons/product-cart-remove.svg
$fsx.f[131] = function(module,exports){
module.exports.default = '/assets/eea00fa-product-cart-remove.svg';
}
// default/dom/components/editor/product/poster.jsx
$fsx.f[132] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const mock_center_1 = $fsx.r(133);
exports.Poster = props => createVNode(1, 'section', `Poster flex ${ props.className || '' }`, [
    createVNode(1, 'div', 'mock flex flex-column items-center justify-center ml3 w4 w5-ns', [
        createComponentVNode(2, mock_center_1.MockPosterCenter, {
            'preview': props.svg,
            'previewH': props.posterPreviewH,
            'previewW': props.posterPreviewW,
            'previewX': props.posterDeltaX,
            'previewY': props.posterDeltaY,
            'viewBox': props.svgViewbox.join(' '),
            'ratio': data_1.PosterSizes[props.posterType][0] / data_1.PosterSizes[props.posterType][1],
            'className': 'pa3'
        }),
        createVNode(1, 'h2', 'f7 pa0 ma0', createTextVNode('Art Size'), 2),
        createVNode(64, 'input', 'w3 w4-ns', null, 1, {
            'type': 'range',
            'min': '0',
            'max': '1',
            'step': '0.01',
            'defaultValue': `${ props.artSize }`,
            'onChange': props.onArtSizeChange
        })
    ], 4),
    createVNode(1, 'div', 'info', [
        createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Chose Size'), 2),
        createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.posterType === data_1.PosterType.A1 ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('A1'), 2, { 'onClick': inferno_1.linkEvent(data_1.PosterType.A1, props.onTypeChange) }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.posterType === data_1.PosterType.A2 ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('A2'), 2, { 'onClick': inferno_1.linkEvent(data_1.PosterType.A2, props.onTypeChange) }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w2 h2 ba pa2 f7 link dim ttu dark-gray pointer ${ props.posterType === data_1.PosterType.A3 ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('A3'), 2, { 'onClick': inferno_1.linkEvent(data_1.PosterType.A3, props.onTypeChange) })
        ], 4),
        createVNode(1, 'h2', 'mt3 mb0 f7', `Printable Area of ${ data_1.PosterSizes[props.posterType][0] }x${ data_1.PosterSizes[props.posterType][1] }cm`, 0),
        createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Price'), 2),
        createVNode(1, 'p', 'ma0 pa0 f3 ttu b orange', [
            createTextVNode('\u20AC'),
            props.price
        ], 0),
        createComponentVNode(2, buttons_1.Button, {
            'id': 'poster add',
            'className': 'mt4 mb2',
            'label': 'Add to cart',
            'onAction': props.onAddToCart
        })
    ], 4)
], 4);
}
// default/dom/components/editor/product/mock_center.jsx
$fsx.f[133] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
exports.MockPosterCenter = props => {
    const x = 6 + (500 - 354) / 2;
    const use = {
        'xlink:href': '#art',
        'width': props.previewW,
        'height': props.previewH,
        'x': x + props.previewX,
        'y': 6 + props.previewY,
        'className': 'pointer'
    };
    const clip = { 'clip-path': 'url(#rectClip)' };
    const extra = { 'shape-rendering': 'crispEdges' };
    return createVNode(32, 'svg', props.className, [
        createVNode(1, 'style', null, `
				.st3{fill: none;stroke:#00AEEF;stroke-width:4;stroke-linecap:round;stroke-miterlimit:10;stroke-dasharray:12,12,12,12,12,12;}
			`, 0, { 'type': 'text/css' }),
        createVNode(1, 'clipPath', null, createVNode(1, 'rect', 'st3', null, 1, {
            'x': x,
            'y': 6,
            'width': 354,
            'height': 500
        }), 2, { 'id': 'rectClip' }),
        createVNode(1, 'rect', 'st3', null, 1, {
            'id': 'posterDrawArea',
            'x': x,
            'y': 6,
            'width': 354,
            'height': 500
        }),
        normalizeProps(createVNode(1, 'symbol', null, null, 1, Object.assign({}, extra, {
            'id': 'art',
            'viewBox': props.viewBox,
            'dangerouslySetInnerHTML': { __html: props.preview }
        }))),
        normalizeProps(createVNode(1, 'g', null, normalizeProps(createVNode(1, 'use', null, null, 1, Object.assign({}, use))), 2, Object.assign({}, clip)))
    ], 4, {
        'version': '1.1',
        'xmlns': 'http://www.w3.org/2000/svg',
        'x': '0px',
        'y': '0px',
        'viewBox': '0 0 512 512',
        'style': { 'enable-background': 'new 0 0 512 512' }
    });
};
exports.MockTShirtCenter = props => {
    const areaX = 122;
    const areaY = 100;
    const use = {
        'xlink:href': '#art',
        'width': props.previewW,
        'height': props.previewH,
        'x': areaX + props.previewX,
        'y': areaY + props.previewY,
        'className': 'pointer'
    };
    const clip = { 'clip-path': 'url(#rectClip)' };
    const extra = { 'shape-rendering': 'crispEdges' };
    return createVNode(32, 'svg', props.className, [
        createVNode(1, 'style', null, `
			.st0{fill: #FFFFFF;stroke:#808285;stroke-width:2;stroke-miterlimit:10;}
			.st1{fill: #FFFFFF;stroke:#808285;stroke-width:1.1027;stroke-miterlimit:10;}
			.st2{fill: none;stroke:#808285;stroke-width:1.1027;stroke-miterlimit:10;}
			.st3{fill: none;stroke:#00AEEF;stroke-width:4;stroke-linecap:round;stroke-miterlimit:10;stroke-dasharray:12,12,12,12,12,12;}
		`, 0, { 'type': 'text/css' }),
        createVNode(1, 'clipPath', null, createVNode(1, 'rect', 'st3', null, 1, {
            'x': areaX,
            'y': areaY,
            'width': '264',
            'height': '352'
        }), 2, { 'id': 'rectClip' }),
        createVNode(1, 'path', 'st0', null, 1, {
            'id': 'XMLID_8_',
            'd': 'M405.6,235.3c-4.6-4.6-5.3-31.5-15-34.4c-9.7,16.6,2.3,249.6-1.4,259.1\n\t\t\tc-2.8,22.2-135.1,49.6-259.8,14.3c-5.5-1.9-15.5-4.2-18.3-9.2c5.4-20.1,12.8-206.7,2.7-255.3c-4.7,7-8.3,15.3-14.1,21.6\n\t\t\tc0,0-51.3,4.2-86.6-33.3c0,0,23.6-61.7,31.9-79c3.8-12.4,9.5-24.8,16.4-35.8c12.6-20,29.8-28.1,52.2-33.6\n\t\t\tc61.7-15.8,69-29.6,87.3-37.3c6.2,9,29.7,15.2,45,16.6c35.3,3.5,65.9-17.8,66.5-17.3c5.5,4.2,15.3,10.9,21.5,13.9\n\t\t\tc26.2,12.6,56.3,13.6,82,27.5c0,0,34.4,8.5,54.5,79.9l27.7,70.7C498,203.7,467.7,242.7,405.6,235.3z'
        }),
        createVNode(1, 'path', 'st1', null, 1, {
            'id': 'XMLID_7_',
            'd': 'M87.1,58.2c0,0,29.6,94.6,26.6,151.6'
        }),
        createVNode(1, 'path', 'st1', null, 1, {
            'id': 'XMLID_6_',
            'd': 'M422.4,56.1c0,0-32.6,96.3-31.9,144.8'
        }),
        createVNode(1, 'path', 'st2', null, 1, {
            'id': 'XMLID_5_',
            'd': 'M182.7,22.8c2.8,12.5,17.3,39.5,58.9,42.3c58.2,1.4,79.7-35.7,82.4-45'
        }),
        createVNode(1, 'path', 'st2', null, 1, {
            'id': 'XMLID_4_',
            'd': 'M191.8,16.6c2.8,12.5,14.5,36.7,58.2,38.1c48.5-3.5,63.7-30.2,66.5-39.5'
        }),
        createVNode(1, 'path', 'st1', null, 1, {
            'id': 'XMLID_3_',
            'd': 'M402.4,224.4c0,0,54.7,6.9,91.4-33.9'
        }),
        createVNode(1, 'path', 'st1', null, 1, {
            'id': 'XMLID_2_',
            'd': 'M18.6,182.2c0,0,11.1,33.9,87.3,39.5'
        }),
        createVNode(1, 'path', 'st1', null, 1, {
            'id': 'XMLID_1_',
            'd': 'M112.1,451.7c0,0,155.9,63.7,279.2-2.1'
        }),
        createVNode(1, 'rect', 'st3', null, 1, {
            'id': 'tshirtDrawArea',
            'x': areaX,
            'y': areaY,
            'width': '264',
            'height': '352'
        }),
        normalizeProps(createVNode(1, 'symbol', null, null, 1, Object.assign({}, extra, {
            'id': 'art',
            'viewBox': props.viewBox,
            'dangerouslySetInnerHTML': { __html: props.preview }
        }))),
        normalizeProps(createVNode(1, 'g', null, normalizeProps(createVNode(1, 'use', null, null, 1, Object.assign({}, use))), 2, Object.assign({}, clip)))
    ], 4, {
        'version': '1.1',
        'xmlns': 'http://www.w3.org/2000/svg',
        'x': '0px',
        'y': '0px',
        'viewBox': '0 0 512 512',
        'style': { 'enable-background': 'new 0 0 512 512' }
    });
};
}
// default/dom/components/editor/product/tshirt.jsx
$fsx.f[134] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const mock_center_1 = $fsx.r(133);
exports.TShirt = props => createVNode(1, 'section', `TShirt flex ${ props.className || '' }`, [
    createVNode(1, 'div', 'mock flex flex-column items-center justify-center', [
        createComponentVNode(2, mock_center_1.MockTShirtCenter, {
            'preview': props.svg,
            'previewH': props.tshirtPreviewH,
            'previewW': props.tshirtPreviewW,
            'previewX': props.tshirtDeltaX,
            'previewY': props.tshirtDeltaY,
            'viewBox': props.svgViewbox.join(' '),
            'className': 'w4 h4 w5-ns h5-ns pa4 pb0'
        }),
        createVNode(1, 'h2', 'f7 pa0 ma0', createTextVNode('Art Size'), 2),
        createVNode(64, 'input', 'w3 w4-ns', null, 1, {
            'type': 'range',
            'min': '0',
            'max': '1',
            'step': '0.01',
            'defaultValue': `${ props.artSize }`,
            'onChange': props.onArtSizeChange
        })
    ], 4),
    createVNode(1, 'div', 'info', [
        createVNode(1, 'h2', 'f7', createTextVNode('Chose Format'), 2),
        createVNode(1, 'div', 'flex flex-column items-start justify-start gray', [
            createVNode(1, 'a', `f7 link dim ttu dark-gray mh2 pointer ${ props.tshirtType === data_1.TShirtType.Unisex ? 'b underline' : '' }`, createTextVNode('Unisex'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtType.Unisex, props.onTypeChange) }),
            createVNode(1, 'a', `f7 link dim ttu dark-gray mh2 pointer ${ props.tshirtType === data_1.TShirtType.Man ? 'b underline' : '' }`, createTextVNode('Man'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtType.Man, props.onTypeChange) }),
            createVNode(1, 'a', `f7 link dim ttu dark-gray mh2 pointer ${ props.tshirtType === data_1.TShirtType.Woman ? 'b underline' : '' }`, createTextVNode('Woman'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtType.Woman, props.onTypeChange) })
        ], 4),
        createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Chose Size'), 2),
        createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtSize === data_1.TShirtSize.S ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('S'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtSize.S, props.onSizeChange) }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtSize === data_1.TShirtSize.M ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('M'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtSize.M, props.onSizeChange) }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtSize === data_1.TShirtSize.L ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('L'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtSize.L, props.onSizeChange) }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtSize === data_1.TShirtSize.XL ? 'bw2 b--blue black' : 'gray b--gray' }`, createTextVNode('XL'), 2, { 'onClick': inferno_1.linkEvent(data_1.TShirtSize.XL, props.onSizeChange) })
        ], 4),
        createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Chose Color'), 2),
        createVNode(1, 'div', 'flex items-start justify-start flex-wrap gray', [
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtColor === data_1.TShirtColor.White ? 'bw2 b--blue black' : 'gray b--gray' }`, null, 1, {
                'onClick': inferno_1.linkEvent(data_1.TShirtColor.White, props.onColorChange),
                'style': { background: data_1.TShirtColor.White }
            }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtColor === data_1.TShirtColor.Black ? 'bw2 b--blue black' : 'gray b--gray' }`, null, 1, {
                'onClick': inferno_1.linkEvent(data_1.TShirtColor.Black, props.onColorChange),
                'style': { background: data_1.TShirtColor.Black }
            }),
            createVNode(1, 'a', `flex items-center justify-center mt2 mr2 w1 h1 w2-ns h2-ns ba pa2 f7 link dim ttu dark-gray pointer ${ props.tshirtColor === data_1.TShirtColor.HeatherGray ? 'bw2 b--blue black' : 'gray b--gray' }`, null, 1, {
                'onClick': inferno_1.linkEvent(data_1.TShirtColor.HeatherGray, props.onColorChange),
                'style': { background: data_1.TShirtColor.HeatherGray }
            })
        ], 4),
        createVNode(1, 'h2', 'mt3 mb0 f7', createTextVNode('Price'), 2),
        createVNode(1, 'p', 'ma0 pa0 f3 ttu b orange', [
            createTextVNode('\u20AC'),
            props.price
        ], 0),
        createComponentVNode(2, buttons_1.Button, {
            'id': 'tshirt add',
            'className': 'mt4 mb2',
            'label': 'Add to cart',
            'onAction': props.onAddToCart
        })
    ], 4)
], 4);
}
// default/dom/components/editor/publish.jsx
$fsx.f[135] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const license_cc_svg_1 = $fsx.r(136);
const license_cc0_svg_1 = $fsx.r(137);
const license_ccby_svg_1 = $fsx.r(138);
const license_ccnc_svg_1 = $fsx.r(139);
const license_ccnd_svg_1 = $fsx.r(140);
const license_ccsa_svg_1 = $fsx.r(141);
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const form_1 = $fsx.r(129);
const license_desc_1 = $fsx.r(142);
const license_img_1 = $fsx.r(143);
function renderLicenseBadge(isAvailable, cx, logo, title, onAction, isSelected, desc) {
    return createVNode(1, 'a', `link pointer ${ isAvailable ? 'dim' : 'o-20' } flex items-center lh-copy pa3 ph0-l bb b--black-10 ${ cx }`, [
        createVNode(1, 'img', `w2 h2 w3-ns h3-ns br-100 transition-o ${ isSelected ? 'o-100' : 'o-40' }`, null, 1, { 'src': logo }),
        createVNode(1, 'div', 'pl3 flex-auto', [
            createVNode(1, 'span', 'f6 db black-70', title, 0),
            createVNode(1, 'span', 'f7 db black-70', desc ? desc : '', 0)
        ], 4),
        createVNode(1, 'div')
    ], 4, { 'onClick': isAvailable ? onAction : null });
}
function renderLicense(props) {
    const license = new Set(props.data.license.split('_'));
    return createVNode(1, 'section', 'w-100 flex flex-column items-center justify-start h-100 overflow-auto pt4', [
        createVNode(1, 'h2', 'mt0', props.data.title ? `License for ${ props.data.title }` : `Change license`, 0),
        createVNode(1, 'ul', 'list pl0 mt0 measure center', [
            renderLicenseBadge(true, '', license_cc0_svg_1.default, 'Public Domain', props.events.onLicenseCC0, license.has('CC0')),
            renderLicenseBadge(true, '', license_cc_svg_1.default, 'Creative Commons', props.events.onLicenseCCBY, license.has('BY')),
            renderLicenseBadge(true, 'ml4', license_ccby_svg_1.default, 'Attribution', props.events.onLicenseCCBY, license.has('BY'), 'Others must give appropriate credit, provide a link to the license, and indicate if changes were made.'),
            renderLicenseBadge(true, 'ml4', license_ccsa_svg_1.default, 'Share Alike', props.events.onLicenseCCSA, license.has('SA'), ' If someone remixes, transforms, or builds upon this material, they must distribute their contributions under the same license as the original.'),
            renderLicenseBadge(props.isPaidAccount, 'ml4', license_ccnc_svg_1.default, 'Non Commercial', props.events.onLicenseCCNC, license.has('NC'), 'Others may not use the material for commercial purposes.'),
            renderLicenseBadge(props.isPaidAccount, 'ml4', license_ccnd_svg_1.default, 'No Derivatives', props.events.onLicenseCCND, license.has('ND'), 'If others remix, transform, or build upon this material, they may not distribute the modified material.')
        ], 0),
        createVNode(1, 'div', 'mt4 w5 flex items-center justify-center', createComponentVNode(2, buttons_1.Button, {
            'id': props.data,
            'className': 'mh2 mb4',
            'label': 'Done',
            'onAction': props.events.exitLicense
        }), 2)
    ], 4);
}
function renderMetadata(props) {
    const inputcx = 'input-reset f6 ba b--black-20 br1 pa2 mb2 db w-100';
    const isLoading = props.data.state === data_1.PublishState.Loading;
    const events = {
        onPublish: props.events.onPublish,
        enterLicense: props.events.enterLicense,
        onExit: props.onExit
    };
    if (isLoading) {
        const nop = () => null;
        events.onPublish = nop;
        events.enterLicense = nop;
        events.onExit = nop;
    }
    const subtitleCx = 'mv1';
    return createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', 'mv0', createTextVNode('Publish'), 2),
        createVNode(1, 'h3', 'mv0 f5', createTextVNode('And share with your friends'), 2),
        createVNode(1, 'div', 'mt3 w-100 bt bb bg-white flex flex-column items-center justify-center', [
            createVNode(1, 'h4', `mt4 mb1`, createTextVNode('Title'), 2),
            createVNode(1, 'div', 'flex items-center justify-center gray', createComponentVNode(2, form_1.Input, {
                'id': 'publish-title',
                'className': inputcx,
                'placeholder': 'Name of this project',
                'defaultValue': props.data.title,
                'value': props.data.title,
                'disabled': isLoading
            }), 2),
            createVNode(1, 'h4', subtitleCx, createTextVNode('Description'), 2),
            createVNode(1, 'div', 'flex items-center justify-center gray', createComponentVNode(2, form_1.TextArea, {
                'id': 'publish-desc',
                'className': inputcx + ' h3 h4-ns',
                'defaultValue': props.data.desc,
                'value': props.data.desc,
                'disabled': isLoading
            }), 2),
            createVNode(1, 'h4', subtitleCx, createTextVNode('License'), 2),
            createVNode(1, 'div', 'flex flex-column items-center justify-center gray', [
                createComponentVNode(2, license_img_1.LicenseImg, {
                    'license': props.data.license,
                    'onAction': events.enterLicense
                }),
                createComponentVNode(2, license_desc_1.LicenseDesc, {
                    'className': 'f7 dark-gray mw5 mt2 tj pa0',
                    'license': props.data.license
                })
            ], 4)
        ], 4),
        createVNode(1, 'div', 'mt4 w5 flex items-center justify-center', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'mh2',
                'bg': 'transparent',
                'color': 'dark-gray',
                'label': 'Cancel',
                'disabled': isLoading,
                'onAction': events.onExit
            }),
            createComponentVNode(2, buttons_1.Button, {
                'id': props.data,
                'className': 'mh2',
                'label': `Publish`,
                'disabled': isLoading,
                'onAction': events.onPublish
            })
        ], 4)
    ], 4);
}
exports.Publish = props => {
    return createVNode(1, 'div', `PublishEditor ${ props.className || '' }
	flex justify-center items-center editormw editor-shadow sans-serif h-100`, props.data.at === data_1.PublishAt.Metadata ? renderMetadata(props) : renderLicense(props), 0, { 'style': { height: props.height } });
};
}
// default/assets/icons/license-cc.svg
$fsx.f[136] = function(module,exports){
module.exports.default = '/assets/58c2d206-license-cc.svg';
}
// default/assets/icons/license-cc0.svg
$fsx.f[137] = function(module,exports){
module.exports.default = '/assets/8094b005-license-cc0.svg';
}
// default/assets/icons/license-ccby.svg
$fsx.f[138] = function(module,exports){
module.exports.default = '/assets/6a1da20f-license-ccby.svg';
}
// default/assets/icons/license-ccnc.svg
$fsx.f[139] = function(module,exports){
module.exports.default = '/assets/389cb107-license-ccnc.svg';
}
// default/assets/icons/license-ccnd.svg
$fsx.f[140] = function(module,exports){
module.exports.default = '/assets/f6a117c2-license-ccnd.svg';
}
// default/assets/icons/license-ccsa.svg
$fsx.f[141] = function(module,exports){
module.exports.default = '/assets/8f9c9c04-license-ccsa.svg';
}
// default/dom/components/editor/publish/license_desc.jsx
$fsx.f[142] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
exports.LicenseDesc = props => {
    switch (props.license) {
    case 'BY':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform the work and make derivative works and remixes based on this work only if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode(') in the manner specified by these.')
        ], 4);
    case 'BY_SA':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform the work and make derivative works and remixes based on this work only if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode(') in the manner specified by these and the distribution of derivative works is under a license identical ("not more restrictive") to the license that governs this work.')
        ], 4);
    case 'BY_NC':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform the work and make derivative works and remixes based on this work only for non-commercial purposes and if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode(').')
        ], 4);
    case 'BY_ND':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform only verbatim copies of the work and only if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode('). Derivative works and remixes based on it are not allowed.')
        ], 4);
    case 'BY_NC_SA':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform the work and make derivative works and remixes based on this work only for non-commercial purposes and if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode(') and the distribution of derivative works is under a license identical ("not more restrictive") to the license that governs this work.')
        ], 4);
    case 'BY_NC_ND':
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, [
            createTextVNode('Others may copy, distribute, display and perform only verbatim copies of the work and only for non-commercial purposes and only if they give the author the credits ('),
            createVNode(1, 'a', 'link dim', createTextVNode('attribution'), 2, {
                'href': 'https://en.wikipedia.org/wiki/Creative_Commons_license#Attribution',
                'target': '_blank'
            }),
            createTextVNode('). Derivative works and remixes based on it are not allowed.')
        ], 4);
    default:
        return createVNode(1, 'p', `LicenseDesc ${ props.className || '' }`, createTextVNode('Globaly free for any use without restrictions'), 2);
    }
};
}
// default/dom/components/editor/publish/license_img.jsx
$fsx.f[143] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const license_cc0_mark_svg_1 = $fsx.r(144);
const license_ccby_mark_svg_1 = $fsx.r(145);
const license_ccbync_mark_svg_1 = $fsx.r(146);
const license_ccbyncnd_mark_svg_1 = $fsx.r(147);
const license_ccbyncsa_mark_svg_1 = $fsx.r(148);
const license_ccbynd_mark_svg_1 = $fsx.r(149);
const license_ccbysa_mark_svg_1 = $fsx.r(150);
exports.LicenseImg = props => {
    const acx = `link dim pointer ${ props.className || '' }`;
    switch (props.license) {
    case 'BY':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccby_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by/4.0/legalcode' : '#',
            'target': props.link ? '_blank' : ''
        });
    case 'BY_SA':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccbysa_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by-sa/4.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    case 'BY_NC':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccbync_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by-nc/4.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    case 'BY_ND':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccbynd_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by-nd/4.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    case 'BY_NC_SA':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccbyncsa_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    case 'BY_NC_ND':
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_ccbyncnd_mark_svg_1.default,
            'alt': 'CC BY-Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    default:
        return createVNode(1, 'a', acx, createVNode(1, 'img', 'h2', null, 1, {
            'src': license_cc0_mark_svg_1.default,
            'alt': 'Public Domain Logo'
        }), 2, {
            'rel': 'license',
            'onClick': props.onAction,
            'href': props.link ? 'https://creativecommons.org/publicdomain/zero/1.0/legalcode' : '',
            'target': props.link ? '_blank' : ''
        });
    }
};
}
// default/assets/icons/license-cc0-mark.svg
$fsx.f[144] = function(module,exports){
module.exports.default = '/assets/74eb4a3e-license-cc0-mark.svg';
}
// default/assets/icons/license-ccby-mark.svg
$fsx.f[145] = function(module,exports){
module.exports.default = '/assets/be0f9db6-license-ccby-mark.svg';
}
// default/assets/icons/license-ccbync-mark.svg
$fsx.f[146] = function(module,exports){
module.exports.default = '/assets/9e7f2384-license-ccbync-mark.svg';
}
// default/assets/icons/license-ccbyncnd-mark.svg
$fsx.f[147] = function(module,exports){
module.exports.default = '/assets/497d9de7-license-ccbyncnd-mark.svg';
}
// default/assets/icons/license-ccbyncsa-mark.svg
$fsx.f[148] = function(module,exports){
module.exports.default = '/assets/8897addd-license-ccbyncsa-mark.svg';
}
// default/assets/icons/license-ccbynd-mark.svg
$fsx.f[149] = function(module,exports){
module.exports.default = '/assets/c048330c-license-ccbynd-mark.svg';
}
// default/assets/icons/license-ccbysa-mark.svg
$fsx.f[150] = function(module,exports){
module.exports.default = '/assets/f3873d00-license-ccbysa-mark.svg';
}
// default/dom/components/editor/publish/preview.jsx
$fsx.f[151] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const social_facebook_svg_1 = $fsx.r(152);
const social_twitter_svg_1 = $fsx.r(153);
const buttons_1 = $fsx.r(106);
exports.PublishPreview = props => {
    const h2cx = 'mt4 mb4';
    let vbw = 512;
    let vbh = 512;
    if (props.project.svgViewBox) {
        vbw = props.project.svgViewBox[2];
        vbh = props.project.svgViewBox[3];
    }
    let w = 220;
    let h = Math.floor(w * vbh / vbw);
    if (vbw < vbh) {
        h = Math.floor(w * vbw / vbh);
    }
    if (h > 128) {
        h = 128;
        w = Math.floor(h * vbh / vbw);
    }
    const xlink = { 'xmlns:xlink': 'http://www.w3.org/1999/xlink' };
    const projectUrl = `https://gridgenerator.com/p/${ props.project.id }`;
    const mp4Url = `https://gridgenerator.com/static/${ props.project.id }.mp4`;
    const subtitleCx = 'mv1';
    return createVNode(1, 'div', `PublishEditor ${ props.className || '' }
			flex justify-center items-center editormw editor-shadow sans-serif h-100`, createVNode(1, 'section', 'w-100 flex flex-column items-center justify-center', [
        createVNode(1, 'h2', 'mv0', createTextVNode('Congratulations'), 2),
        createVNode(1, 'h3', 'mv0 f5', createTextVNode('Project now online'), 2),
        createVNode(1, 'div', 'mt3 w-100 bt bb bg-white flex flex-column items-center justify-center', [
            createVNode(1, 'h4', 'mt4 mb2', createTextVNode('Access it on your "projects" menu'), 2),
            createVNode(1, 'h4', `mt4 mb2`, createTextVNode('Share it'), 2),
            createVNode(1, 'div', 'flex items-center justify-center gray', [
                createVNode(1, 'a', 'pointer link mh2', createVNode(1, 'img', 'h2 pointer', null, 1, {
                    'src': social_twitter_svg_1.default,
                    'alt': 'Twitter'
                }), 2, {
                    'href': `https://twitter.com/intent/tweet?text=${ encodeURIComponent(projectUrl) }`,
                    'target': '_blank'
                }),
                createVNode(1, 'a', 'pointer link mh2', createVNode(1, 'img', 'h2 pointer', null, 1, {
                    'src': social_facebook_svg_1.default,
                    'alt': 'Facebook'
                }), 2, {
                    'href': `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent(projectUrl) }`,
                    'target': '_blank'
                })
            ], 4),
            createVNode(1, 'h4', 'mt4 mb1', createTextVNode('Link'), 2),
            createVNode(1, 'div', 'flex flex-column items-center justify-center gray mb4', [
                createVNode(1, 'a', 'pointer link flex items-center justify-center', [
                    createVNode(1, 'p', `Button b--black-10 pa2 link f7 br1 mr3 transition-o ba bg-light-gray pointer near-black dim o-100 ttu`, createTextVNode('Copy'), 2),
                    createVNode(64, 'input', 'input-reset bn sans-serif f6 bg-transparent h2 w5', null, 1, {
                        'id': 'publish-url',
                        'value': projectUrl
                    })
                ], 4, {
                    'onClick': e => {
                        e.preventDefault();
                        const urlLink = document.getElementById('publish-url');
                        urlLink.select();
                        try {
                            const successful = document.execCommand('copy');
                        } catch (err) {
                            console.error('Oops, unable to copy', err);
                        }
                    }
                }),
                createVNode(1, 'p', null, createTextVNode('or MP4:'), 2),
                createVNode(1, 'a', 'pointer link flex items-center justify-center', [
                    createVNode(1, 'p', `Button b--black-10 pa2 link f7 br1 mr3 transition-o ba bg-light-gray pointer near-black dim o-100 ttu`, createTextVNode('Copy'), 2),
                    createVNode(64, 'input', 'input-reset bn sans-serif f6 bg-transparent h2 w5', null, 1, {
                        'id': 'publish-mp4-url',
                        'value': mp4Url
                    })
                ], 4, {
                    'onClick': e => {
                        e.preventDefault();
                        const urlLink = document.getElementById('publish-mp4-url');
                        urlLink.select();
                        try {
                            const successful = document.execCommand('copy');
                        } catch (err) {
                            console.error('Oops, unable to copy', err);
                        }
                    }
                })
            ], 4)
        ], 4),
        createVNode(1, 'div', 'mt4 w5 flex items-center justify-center', createComponentVNode(2, buttons_1.Button, {
            'className': 'mh2',
            'bg': 'green',
            'color': 'dark-gray',
            'label': 'Done',
            'onAction': props.onExit
        }), 2)
    ], 4), 2, { 'style': { height: props.height } });
};
}
// default/assets/icons/social-facebook.svg
$fsx.f[152] = function(module,exports){
module.exports.default = '/assets/1d8eab37-social-facebook.svg';
}
// default/assets/icons/social-twitter.svg
$fsx.f[153] = function(module,exports){
module.exports.default = '/assets/5efad37c-social-twitter.svg';
}
// default/dom/components/editor/shape_editor.jsx
$fsx.f[154] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const shape_editor_1 = $fsx.r(44);
const actions_menu_1 = $fsx.r(155);
const figure_options_1 = $fsx.r(158);
const figures_menu_1 = $fsx.r(115);
const grid_1 = $fsx.r(160);
function chooseMenu(props) {
    switch (props.shapeEditor.editorMode) {
    case shape_editor_1.UIShapeEditorMode.Fill:
        break;
    default:
        if (props.shapeEditor.selectedShape > -1) {
            const figOpsProps = {
                fill: props.shapeEditor.fills[props.shapeEditor.selectedShape],
                onDelete: props.onFigureDelete,
                onEdit: props.onFigureEdit,
                onFill: props.onFigureFill
            };
            return normalizeProps(createComponentVNode(2, figure_options_1.FigureOpts, Object.assign({}, figOpsProps)));
        } else if (props.shapeEditor.ambiguities.length > 1) {
            const shapeAmbiguitiesProps = {
                className: '',
                shapes: props.shapeEditor.ambiguities,
                selected: -1,
                fill: '#FFB700',
                title: 'Or did you want this instead ? ',
                renderFirstShape: true,
                onAction: props.onSolveAmbiguity,
                onDelete: props.onFigureDelete
            };
            return normalizeProps(createComponentVNode(2, actions_menu_1.ShapeActionsMenu, Object.assign({}, shapeAmbiguitiesProps)));
        } else {
            const shapeActionsMenuProps = {
                className: '',
                shapes: props.shapeEditor.currentShapeActions,
                selected: props.shapeEditor.selectedAction,
                fill: '#FFB700',
                onAction: props.onReverseAction,
                onDelete: props.onFigureDelete
            };
            return normalizeProps(createComponentVNode(2, actions_menu_1.ShapeActionsMenu, Object.assign({}, shapeActionsMenuProps)));
        }
    }
}
exports.ShapeEditor = props => {
    const figuresMenuProps = {
        className: '',
        onFigureAction: props.onFigureSelect,
        fills: props.shapeEditor.fills,
        shapes: props.shapeEditor.shapesD,
        resolution: props.shapeEditor.templateRes,
        selected: props.shapeEditor.selectedShape,
        onEnterTemplateSelector: props.onEnterTemplateSelector,
        size: props.size,
        isNotSmall: props.isNotSmall
    };
    return createVNode(1, 'div', `ShapeEditor ${ props.className || '' }
			flex flex-column justify-start items-center h-100-ns editormw editor-shadow pr4-ns`, [
        normalizeProps(createComponentVNode(2, figures_menu_1.FiguresMenu, Object.assign({}, figuresMenuProps))),
        normalizeProps(createComponentVNode(2, grid_1.ShapeGrid, Object.assign({}, props, { 'className': 'mt2' }))),
        createVNode(1, 'div', 'w-100 h3-ns', chooseMenu(props), 0, { 'style': props.isNotSmall ? { width: `${ props.size }px` } : {} })
    ], 4, { 'style': props.style || {} });
};
}
// default/dom/components/editor/shape/actions_menu.jsx
$fsx.f[155] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const shape_remove_svg_1 = $fsx.r(156);
const outline_1 = $fsx.r(157);
function renderBtn(index, shape, fill, isSelected, action) {
    const stroke = '#FF6300';
    const className = 'h1 w1 ba b--light-silver mh1 h2-ns w2-ns mh2-ns';
    const selectedCx = `${ className } b--orange`;
    const btnClassName = 'bn bg-transparent pa0 ma0 pointer dim';
    return createVNode(1, 'button', btnClassName, createComponentVNode(2, outline_1.ShapeOutline, {
        'paths': [shape],
        'fill': fill,
        'stroke': stroke,
        'className': isSelected ? selectedCx : className
    }), 2, { 'onClick': inferno_1.linkEvent(index, action) }, `${ index }-${ shape }`);
}
function renderShapes(shapes, fill, selected, action, title, renderFirst, onDelete) {
    const result = [createVNode(1, 'p', `sans-serif ttu mh1 ${ shapes.length > 2 ? 'ml2 w4 f7-ns f8 mv0' : 'f6 tc w-100' }`, inferno_1.createTextVNode(title), 2, null, 'shapes-actions-label')];
    if (shapes.length > 1 && !renderFirst) {
        result.unshift(createVNode(1, 'button', 'bn bg-transparent pa1 ma0 pointer dim flex items-center justify-center', [
            createVNode(1, 'img', 'w1 h1', null, 1, {
                'src': shape_remove_svg_1.default,
                'alt': 'clear',
                'title': 'clear'
            }),
            createVNode(1, 'p', 'u underline pa0 sans-serif ttu f7-ns f8 ml2', createTextVNode('Delete'), 2)
        ], 4, { 'onClick': onDelete }, 'shape-clear-del'));
    }
    if (renderFirst) {
        result.unshift(renderBtn(0, shapes[0], fill, true, action));
    }
    if (shapes.length <= 2) {
        if (shapes.length === 2) {
            result.pop();
        }
        return result;
    }
    for (let i = shapes.length - 1; i > Math.max(shapes.length - 7, 0); i--) {
        if (shapes[i].length !== 0) {
            result.push(renderBtn(i, shapes[i], fill, i === selected, action));
        }
    }
    return result;
}
exports.ShapeActionsMenu = props => {
    const title = props.shapes.length > 1 ? props.title || 'Or Go Back To: ' : 'Make your shape: connect the dots.';
    return createVNode(1, 'nav', `ShapeActionsMenu ${ props.className || '' } flex justify-start items-center w-100 bg-near-white overflow-hidden`, renderShapes(props.shapes, props.fill, props.selected, props.onAction, title, props.renderFirstShape || false, props.onDelete), 8, { 'style': props.style || {} });
};
}
// default/assets/icons/shape-remove.svg
$fsx.f[156] = function(module,exports){
module.exports.default = '/assets/eea00fa-shape-remove.svg';
}
// default/dom/components/editor/shape/outline.jsx
$fsx.f[157] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const outlineStroke = 32;
const halfStroke = outlineStroke / 2;
function renderPaths(paths, strokeColor, fillColor, strokeWidth) {
    const result = [];
    for (let i = 0; i < paths.length; i++) {
        result.push(createVNode(1, 'path', null, null, 1, {
            'd': paths[i],
            'stroke': strokeColor,
            'fill': fillColor,
            'stroke-width': strokeWidth
        }));
    }
    return result;
}
exports.ShapeOutline = props => {
    const res = props.resolution || 512 + halfStroke;
    const stroke = props.stroke || '#111111';
    const fill = props.fill || 'transparent';
    return createVNode(32, 'svg', `ShapeOutline transition-transform ${ props.className || '' }`, renderPaths(props.paths, stroke, fill, outlineStroke), 0, {
        'version': '1.1',
        'baseProfile': 'basic',
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': `${ -halfStroke } ${ -halfStroke } ${ res + halfStroke } ${ res + halfStroke }`,
        'style': { transform: `rotate(${ 2 * Math.PI * (props.rotation || 0) }rad)` }
    });
};
}
// default/dom/components/editor/shape/figure_options.jsx
$fsx.f[158] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
const shape_edit_svg_1 = $fsx.r(159);
const shape_remove_svg_1 = $fsx.r(156);
function renderOpts(props) {
    const btnCx = 'sans-serif ba ma0 pa1 ph2 pointer dim flex justify-center items-center b--black-10 br1 mr3-ns';
    const txtCx = 'f8 ttu pa0 ma0 pr2';
    return [
        createVNode(1, 'button', btnCx, [
            createVNode(1, 'p', txtCx, createTextVNode('Fill'), 2),
            createVNode(32, 'svg', 'w1 h1', createVNode(1, 'circle', null, null, 1, {
                'cx': 32,
                'cy': 32,
                'r': 26,
                'fill': props.fill,
                'stroke': '#222222',
                'stroke-width': 2
            }), 2, { 'viewBox': '0 0 64 64' })
        ], 4, { 'onClick': props.onFill }, 'btn-figfill'),
        createVNode(1, 'button', btnCx, [
            createVNode(1, 'p', txtCx, createTextVNode('Edit'), 2),
            createVNode(1, 'img', 'w1 h1', null, 1, {
                'src': shape_edit_svg_1.default,
                'alt': 'edit icon'
            })
        ], 4, { 'onClick': props.onEdit }, 'btn-figedit'),
        createVNode(1, 'button', btnCx, [
            createVNode(1, 'p', txtCx, createTextVNode('Delete'), 2),
            createVNode(1, 'img', 'w1 h1', null, 1, {
                'src': shape_remove_svg_1.default,
                'alt': 'remove icon'
            })
        ], 4, { 'onClick': props.onDelete }, 'btn-figremove')
    ];
}
exports.FigureOpts = props => {
    return createVNode(1, 'nav', `FigureOpts ${ props.className || '' } flex justify-around items-center w-100 bg-near-white  justify-center-ns mt3-ns`, renderOpts(props), 8, { 'style': props.style || {} });
};
}
// default/assets/icons/shape-edit.svg
$fsx.f[159] = function(module,exports){
module.exports.default = '/assets/8ca71e1a-shape-edit.svg';
}
// default/dom/components/editor/shape/grid.jsx
$fsx.f[160] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const point_1 = $fsx.r(161);
const ShapeGridColor0 = '#333333';
const ShapeGridColor2 = '#EEEEEE';
function renderPts(pts, clickablePts, selectedPts, action) {
    const result = [];
    for (let i = 0; i < pts.length; i++) {
        result.push(createComponentVNode(2, point_1.ShapePoint, {
            'pointAttribs': {
                x: pts[i].x,
                y: pts[i].y,
                isActive: selectedPts.has(pts[i]),
                isClickable: clickablePts.has(pts[i])
            },
            'onAction': action
        }, `${ pts[i].x },${ pts[i].y }`));
    }
    return result;
}
function renderShapes(shapesD, fills) {
    const result = [];
    for (let i = 0; i < shapesD.length; i++) {
        result.push(createVNode(1, 'path', null, null, 1, {
            'd': shapesD[i],
            'fill': fills[i]
        }, `${ i }-${ shapesD[i] }`));
    }
    return result;
}
class ShapeGrid extends inferno_1.Component {
    componentDidMount() {
        this.props.onShapeMount();
    }
    render() {
        const props = this.props;
        const margin = 30;
        const halfMargin = margin / 2;
        const maxLen = props.shapeEditor.templateRes + margin;
        return createVNode(32, 'svg', `ShapeGrid ${ props.className || '' }`, [
            createVNode(1, 'rect', null, null, 1, {
                'x': -halfMargin,
                'y': -halfMargin,
                'width': maxLen,
                'height': maxLen,
                'fill': ShapeGridColor2
            }),
            ...renderShapes(props.shapeEditor.shapesD, props.shapeEditor.fills),
            createVNode(1, 'path', null, null, 1, {
                'd': props.shapeEditor.templatePath,
                'stroke': ShapeGridColor0,
                'fill': 'transparent',
                'stroke-width': '1px',
                'stroke-dasharray': '4 4'
            }),
            createVNode(1, 'path', 'current-shape-stroke orange-stroke gold-fill', null, 1, {
                'd': props.shapeEditor.currentShape,
                'stroke-width': '3',
                'fill-opacity': '0.6'
            }),
            createVNode(1, 'g', 'points', renderPts(props.shapeEditor.allPts, props.shapeEditor.clickablePts, props.shapeEditor.selectedPts, props.onPointAction), 8),
            props.shapeEditor.currentEdge ? createComponentVNode(2, point_1.ShapePoint, {
                'pointAttribs': {
                    x: props.shapeEditor.currentEdge.x,
                    y: props.shapeEditor.currentEdge.y,
                    isActive: true,
                    isCurrentEdge: true
                },
                'onAction': null
            }) : createVNode(1, 'g', 'no-edge1'),
            props.shapeEditor.otherEdge ? createComponentVNode(2, point_1.ShapePoint, {
                'pointAttribs': {
                    x: props.shapeEditor.otherEdge.x,
                    y: props.shapeEditor.otherEdge.y,
                    isOtherEdge: true
                },
                'onAction': props.onPointAction
            }) : createVNode(1, 'g', 'no-edge2')
        ], 0, {
            'version': '1.1',
            'baseProfile': 'basic',
            'xmlns': 'http://www.w3.org/2000/svg',
            'width': props.size,
            'height': props.size,
            'style': props.style,
            'viewBox': `-${ halfMargin } -${ halfMargin } ${ maxLen } ${ maxLen }`
        });
    }
}
exports.ShapeGrid = ShapeGrid;
}
// default/dom/components/editor/shape/point.jsx
$fsx.f[161] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
function genKey(a, def) {
    if (!a && def) {
        return def;
    }
    return `${ a.x },${ a.y }`;
}
exports.ShapePoint = props => {
    if (props.pointAttribs.isOtherEdge) {
        return createVNode(1, 'g', null, createVNode(32, 'svg', null, [
            createVNode(1, 'path', null, null, 1, {
                'fill': '#88C057',
                'd': 'M32,0C14.327,0,0,14.322,0,31.999c0,17.669,14.327,31.999,32,31.999s32-14.33,32-31.999 C64,14.322,49.673,0,32,0z'
            }),
            createVNode(1, 'path', null, null, 1, {
                'fill': '#FFFFFF',
                'd': 'M45.428,22.571c-0.776-0.775-2.033-0.775-2.81,0 L28.001,37.189l-6.618-6.618c-0.775-0.775-2.033-0.775-2.809,0c-0.776,0.775-0.776,2.033,0,2.81l7.803,7.803 c0.061,0.083,0.122,0.166,0.197,0.241c0.394,0.394,0.911,0.586,1.427,0.58c0.516,0.006,1.033-0.187,1.427-0.58 c0.076-0.076,0.139-0.161,0.2-0.245l15.8-15.8C46.203,24.605,46.203,23.347,45.428,22.571z'
            })
        ], 4, {
            'version': '1.1',
            'xmlns': 'http://www.w3.org/2000/svg',
            'viewBox': '0 0 64 63.998',
            'width': '20px',
            'height': '20px'
        }), 2, {
            'ontouchstart': props.onAction ? inferno_1.linkEvent(props.pointAttribs, props.onAction) : props.onAction,
            'onClick': props.onAction ? inferno_1.linkEvent(props.pointAttribs, props.onAction) : props.onAction,
            'style': {
                transform: `translate(${ props.pointAttribs.x - 10 }px, ${ props.pointAttribs.y - 10 }px)`,
                cursor: 'pointer',
                width: '1rem',
                height: '1rem',
                background: 'red'
            }
        }, genKey(props.pointAttribs, `isOtherEdge`));
    }
    let cx = 'ShapePoint transition-o ';
    if (props.pointAttribs.isCurrentEdge) {
        cx += 'orange-fill dark-blue-stroke ';
    } else if (props.pointAttribs.isActive) {
        cx += `orange-fill ${ props.pointAttribs.isClickable ? 'dark-gray-stroke pointer' : 'no-stroke' } `;
    } else if (props.pointAttribs.isClickable) {
        cx += 'light-gray-fill dark-gray-stroke hover-orange-stroke pointer o-100';
    } else {
        cx += 'light-gray-fill dark-gray-stroke o-10';
    }
    const _action = props.pointAttribs.isClickable && props.onAction ? inferno_1.linkEvent(props.pointAttribs, props.onAction) : null;
    const centerx = props.pointAttribs.x;
    const centery = props.pointAttribs.y;
    return createVNode(1, 'circle', cx, null, 1, {
        'cx': centerx,
        'cy': centery,
        'r': 6,
        'stroke-width': 2,
        'onClick': _action
    }, genKey(props.pointAttribs, `c(${ centerx },${ centery })`));
};
}
// default/dom/components/editor/template_picker.jsx
$fsx.f[162] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const buttons_1 = $fsx.r(106);
const selector_1 = $fsx.r(163);
exports.TemplatePicker = props => createVNode(1, 'section', `TemplatePicker mw6-ns ml5-ns flex-ns flex-column-reverse justify-start-ns h-100-ns pb6-ns ${ props.className || '' }`, [
    createComponentVNode(2, selector_1.TemplateSelector, {
        'templates': props.templates,
        'margin': 30,
        'bg': '#cdecff',
        'bghover': '#f6fffe',
        'stroke': '#00449e',
        'onTemplateSelect': props.onTemplateSelect
    }),
    createVNode(1, 'div', 'fixed bottom-4 mb3 static-ns flex w-100 ml5 pr5 items-center justify-center h2 bg-near-white pr0-ns mb4-ns mt2-ns h3-ns items-center-ns ml0-ns', createComponentVNode(2, buttons_1.Button, {
        'className': 'mr5 mr0-ns b--gray',
        'color': 'gray',
        'bg': 'near-white',
        'label': 'Cancel',
        'onAction': props.onCancel
    }), 2)
], 4);
}
// default/dom/components/editor/template/selector.jsx
$fsx.f[163] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
exports.TemplateSelector = props => createVNode(1, 'nav', `TemplateSelector ${ props.className || '' } list flex flex-wrap bg-near-white ph2 pv3 flex-column-ns items-center-ns justify-center-ns pv0-ns ph0-ns mt3-ns`, props.templates.map((t, tid) => {
    const maxLen = t.resolution + props.margin;
    return createVNode(1, 'li', 'list-item link pointer dim ph1', createVNode(32, 'svg', 'w4 h4', [
        createVNode(1, 'rect', null, null, 1, {
            'x': -props.margin / 2,
            'y': -props.margin / 2,
            'width': maxLen,
            'height': maxLen,
            'fill': props.bg
        }),
        createVNode(1, 'path', null, null, 1, {
            'd': t.pathString,
            'stroke': props.stroke,
            'fill': 'transparent',
            'stroke-width': '2px'
        })
    ], 4, {
        'version': '1.1',
        'baseProfile': 'basic',
        'xmlns': 'http://www.w3.org/2000/svg',
        'viewBox': `-${ props.margin / 2 } -${ props.margin / 2 } ${ maxLen } ${ maxLen }`,
        'onClick': inferno_1.linkEvent(tid, props.onTemplateSelect)
    }), 2);
}), 0);
}
// default/dom/components/hud.jsx
$fsx.f[164] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const delete_menu_1 = $fsx.r(165);
const features_menu_1 = $fsx.r(166);
const fills_menu_1 = $fsx.r(167);
const shapes_menu_1 = $fsx.r(168);
const submenu_zoom_1 = $fsx.r(169);
const tools_menu_1 = $fsx.r(172);
const zoom_menu_1 = $fsx.r(176);
function currentToolSubmenu(props) {
    switch (props.ui.toolsMenu.selected) {
    case data_1.ToolsMenuId.Zoom:
        return createComponentVNode(2, submenu_zoom_1.SubmenuZoom, {
            'onZoomIn': props.onSceneZoomIn,
            'onZoomOut': props.onSceneZoomOut
        });
    default:
        return createVNode(1, 'div', 'NoSubmenu');
    }
}
function currentToolMenu(id, fillsProps, deleteProps, zoomProps) {
    switch (id) {
    case data_1.ToolsMenuId.Paint:
        return normalizeProps(createComponentVNode(2, fills_menu_1.FillsMenu, Object.assign({}, fillsProps)));
    case data_1.ToolsMenuId.Delete:
        return normalizeProps(createComponentVNode(2, delete_menu_1.DeleteMenu, Object.assign({}, deleteProps)));
    case data_1.ToolsMenuId.Zoom:
        return normalizeProps(createComponentVNode(2, zoom_menu_1.ZoomMenu, Object.assign({}, zoomProps)));
    }
}
const debugFunc = e => e;
exports.HUD = props => {
    const toolsMenuProps = {
        className: `absolute bottom-2 mb4 left-0 w-100 visible-ns`,
        withMoveZoom: props.mediaSize !== engine_1.RuntimeMediaSize.Normal,
        menu: props.ui.toolsMenu,
        onAction: props.onSelectTool,
        onZoomIn: props.onSceneZoomIn,
        onZoomOut: props.onSceneZoomOut,
        onToggleGrid: props.onToggleGrid,
        onTogglePattern: props.onTogglePattern,
        onExitGrid: props.onExitGrid,
        isGridVisible: props.ui.toolsSubmenus.isGridVisible,
        isPatternOn: props.ui.toolsSubmenus.isGridPatternOn,
        isVisible: props.ui.at === data_1.UIState.Project
    };
    const shapesMenuProps = {
        menu: props.ui.shapesMenu,
        onAction: props.onSelectShape,
        onNew: props.onNewShape,
        atShapesEditor: props.ui.at === data_1.UIState.ShapeEditor,
        editorShapes: props.editorShapes,
        isEditorOnTop: props.ui.isEditorOnTop,
        isExitingEditor: props.ui.isExitingEditor,
        isEnteringEditor: props.ui.isEnteringEditor,
        isShort: props.isShort,
        className: `absolute bottom-2 mb4 left-0 vertical-menuh`,
        isOtherEditorVisible: props.ui.at === data_1.UIState.FillEditor || props.ui.at === data_1.UIState.Export || props.ui.at === data_1.UIState.Publish || props.ui.at === data_1.UIState.PublishPreview || props.ui.at === data_1.UIState.Product
    };
    const fillsMenuProps = {
        menu: props.ui.fillsMenu,
        onAction: props.onSelectFill,
        onNew: props.onNewFill,
        atFillEditor: props.ui.at === data_1.UIState.FillEditor,
        isEditorOnTop: props.ui.isEditorOnTop,
        isExitingEditor: props.ui.isExitingEditor,
        isEnteringEditor: props.ui.isEnteringEditor,
        isShort: props.isShort,
        className: 'absolute bottom-2 mb4 right-0 vertical-menuh',
        isOtherEditorVisible: props.ui.at === data_1.UIState.ShapeEditor || props.ui.at === data_1.UIState.Export || props.ui.at === data_1.UIState.Publish || props.ui.at === data_1.UIState.PublishPreview || props.ui.at === data_1.UIState.Product
    };
    const deleteMenuProps = {
        onClearAll: props.onClearAll,
        className: 'absolute bottom-2 mb5 right-0 pb2'
    };
    const zoomMenuProps = {
        className: 'absolute bottom-2 mb5 right-0 pb2',
        percentage: props.zoom,
        middleAt: props.zoomMiddleAt,
        size: 255
    };
    const featuresMenuProps = {
        className: `center h2 ma0 pa0 flex items-center justify-center transition-o ${ props.ui.at === data_1.UIState.Project ? 'o-100' : 'o-0' }`,
        menu: props.ui.featuresMenu,
        onAction: props.onFeaturesMenu,
        canUseFeatures: props.isLoggedIn,
        gotoLogin: props.gotoLogin
    };
    return createVNode(1, 'section', `HUD ${ props.className || '' }`, [
        createVNode(1, 'h1', `mb0 lh-title f6 w-100 tc sans-serif ttu black transition-transform ${ props.ui.at === data_1.UIState.Project ? '' : 'translate-y--3' }`, inferno_1.createTextVNode(props.title), 2),
        normalizeProps(createComponentVNode(2, features_menu_1.FeaturesMenu, Object.assign({}, featuresMenuProps))),
        normalizeProps(createComponentVNode(2, tools_menu_1.ToolsMenu, Object.assign({}, toolsMenuProps))),
        currentToolMenu(props.ui.toolsMenu.selected, fillsMenuProps, deleteMenuProps, zoomMenuProps),
        normalizeProps(createComponentVNode(2, shapes_menu_1.ShapesMenu, Object.assign({}, shapesMenuProps)))
    ], 0);
};
}
// default/dom/components/hud/delete_menu.jsx
$fsx.f[165] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const buttons_1 = $fsx.r(106);
exports.DeleteMenu = props => {
    const btnProps = {
        onAction: props.onClearAll,
        label: 'Clear All'
    };
    return createVNode(1, 'nav', `DeleteMenu ${ props.className || '' } ma0 pa0 w3 transition-transform flex flex-column items-center justify-end`, normalizeProps(createComponentVNode(2, buttons_1.TextButton, Object.assign({}, btnProps))), 2);
};
}
// default/dom/components/hud/features_menu.jsx
$fsx.f[166] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.FeaturesMenu = props => createVNode(1, 'nav', `FeaturesMenu ${ props.className || '' }`, props.menu.map((_id, e, isSelected) => {
    const id = _id;
    const label = e.label;
    return normalizeProps(createVNode(1, 'a', `f7 dim no-underline black ttu sans-serif dib ph2 pointer top-bar ${ isSelected ? 'top-bar-selected' : '' }`, e.iconUrl ? createVNode(1, 'div', 'flex items-center justify-center', [
        createVNode(1, 'p', 'mr1', label, 0),
        createVNode(1, 'img', 'mb1 w1 h1', null, 1, { 'src': e.iconUrl })
    ], 4) : label, 0, Object.assign({}, noPropagation, {
        'onClick': inferno_1.linkEvent(id, props.onAction),
        'href': props.canUseFeatures ? `/${ id }` : '/login'
    }), `featuresmenu-${ id }`));
}), 8);
}
// default/dom/components/hud/fills_menu.jsx
$fsx.f[167] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const common_1 = $fsx.r(73);
const new_close_1 = $fsx.r(107);
const noPropagation = common_1.justClick;
function buildBtns(props, selectedCx, notSelectedCx) {
    const result = [];
    const selected = props.menu.selected;
    for (const [id, entry] of props.menu.iter()) {
        result.push(normalizeProps(createVNode(1, 'button', `bg-transparent pointer bn ma0 pa1 w2 h2 transition-transform
				${ id === selected ? selectedCx : notSelectedCx }`, createVNode(1, 'div', 'transition-transform bn pa0 ma0', null, 1, {
            'style': { transform: `rotate(${ 2 * Math.PI * (entry.rotation || 0) }rad)` },
            'dangerouslySetInnerHTML': { __html: entry.svg }
        }), 2, Object.assign({}, noPropagation, { 'onClick': inferno_1.linkEvent(id, props.onAction) }), `fill_${ id }_${ entry.svg }`)));
    }
    const rotated = props.isEditorOnTop || props.isEnteringEditor;
    result.push(createComponentVNode(2, new_close_1.NewCloseBtn, {
        'className': 'w2 h2',
        'rotated': rotated,
        'big': false,
        'onAction': props.onNew
    }, `fillsnewclosebtn-${ rotated }`));
    return result;
}
exports.FillsMenu = props => {
    let notSelectedCx = '';
    let selectedCx = 'right-circle';
    if (props.isEnteringEditor || props.isExitingEditor) {
        if (props.isEditorOnTop) {
            selectedCx += ' translate-0';
        } else {
            selectedCx += ' translate-x2';
        }
        notSelectedCx = 'translate-xy2';
    } else {
        selectedCx += ' translate-0';
        if (props.atFillEditor) {
            notSelectedCx += ' translate-xy2';
        }
        notSelectedCx += ' translate-0';
    }
    return createVNode(1, 'nav', `FillsMenu ${ props.className || '' } ma0 pa0 w3 transition-transform flex flex-column items-center justify-end
		${ props.isOtherEditorVisible ? 'translate-x2' : 'translate-0' }`, buildBtns(props, selectedCx, notSelectedCx), 8);
};
}
// default/dom/components/hud/shapes_menu.jsx
$fsx.f[168] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const common_1 = $fsx.r(73);
const new_close_1 = $fsx.r(107);
const outline_1 = $fsx.r(157);
const noPropagation = common_1.justClick;
function buildBtns(props, selectedCx, notSelectedCx) {
    const result = [];
    const selected = props.menu.selected;
    for (const [id, entry] of props.menu.iter()) {
        const key = `shapesmenubtn-${ id }-${ entry.svgPaths.join('-') }`;
        let cx = 'w2 h2';
        let svgPaths = entry.svgPaths;
        if (props.isEditorOnTop || props.isExitingEditor) {
            svgPaths = props.editorShapes;
            cx += ' ba b--gray b--dashed';
        }
        result.push(normalizeProps(createVNode(1, 'button', `bg-transparent pointer bn ma0 pa0 transition-transform
					${ id === selected ? selectedCx : notSelectedCx }`, createComponentVNode(2, outline_1.ShapeOutline, {
            'paths': svgPaths,
            'className': cx,
            'rotation': entry.rotation
        }), 2, Object.assign({}, noPropagation, { 'onClick': inferno_1.linkEvent(id, props.onAction) }), key)));
    }
    const rotated = props.isEditorOnTop || props.isEnteringEditor;
    result.push(createComponentVNode(2, new_close_1.NewCloseBtn, {
        'className': 'w2 h2 onboarding1-right',
        'rotated': rotated,
        'big': false,
        'onAction': props.onNew
    }, `shapesnewclosebtn-${ rotated }`));
    return result;
}
exports.ShapesMenu = props => {
    let notSelectedCx = '';
    let selectedCx = 'left-circle';
    if (props.isEnteringEditor || props.isExitingEditor) {
        if (props.isEditorOnTop) {
            selectedCx += ' translate-0';
        } else {
            selectedCx += ' translate-x-2';
        }
        notSelectedCx = 'translate-xy-2';
    } else {
        if (props.atShapesEditor) {
            if (props.isShort) {
                selectedCx += ' translate-x-2';
            } else {
                selectedCx += ' translate-0';
            }
            notSelectedCx += ' translate-xy-2';
        } else {
            notSelectedCx += ' translate-0';
            selectedCx += ' translate-0';
        }
    }
    return createVNode(1, 'nav', `ShapesMenu ${ props.className || '' } ma0 pa0 w3 transition-transform flex flex-column items-center justify-end
	${ props.isOtherEditorVisible ? 'translate-x-2' : 'translate-0' }`, buildBtns(props, selectedCx, notSelectedCx), 8);
};
}
// default/dom/components/hud/submenu_zoom.jsx
$fsx.f[169] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
const zoom_in_svg_1 = $fsx.r(170);
const zoom_out_svg_1 = $fsx.r(171);
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.SubmenuZoom = props => {
    return createVNode(1, 'div', 'dib', createVNode(1, 'nav', 'flex flex-column bottom-circle', [
        normalizeProps(createVNode(1, 'a', 'flex items-center justify-center w2 h2', createVNode(1, 'img', 'w1 h1', null, 1, {
            'src': zoom_in_svg_1.default,
            'alt': 'Zoom in'
        }), 2, Object.assign({}, noPropagation, {
            'href': '#',
            'onClick': props.onZoomIn
        }))),
        normalizeProps(createVNode(1, 'a', 'flex items-center justify-center w2 h2', createVNode(1, 'img', 'w1 h1', null, 1, {
            'src': zoom_out_svg_1.default,
            'alt': 'Zoom out'
        }), 2, Object.assign({}, noPropagation, {
            'href': '#',
            'onClick': props.onZoomOut
        })))
    ], 4), 2);
};
}
// default/assets/icons/zoom-in.svg
$fsx.f[170] = function(module,exports){
module.exports.default = '/assets/da1a0dd4-zoom-in.svg';
}
// default/assets/icons/zoom-out.svg
$fsx.f[171] = function(module,exports){
module.exports.default = '/assets/f9959128-zoom-out.svg';
}
// default/dom/components/hud/tools_menu.jsx
$fsx.f[172] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const common_1 = $fsx.r(73);
const submenu_grid_1 = $fsx.r(173);
const submenu_zoom_1 = $fsx.r(169);
const noPropagation = common_1.justClick;
exports.ToolsMenu = props => createVNode(1, 'nav', `ToolsMenu ${ props.className || '' } ${ props.isVisible ? 'flex' : 'dn' } items-end justify-center`, props.menu.map((id, e, isSelected) => {
    if (id === data_1.ToolsMenuId.Zoom && isSelected) {
        return createComponentVNode(2, submenu_zoom_1.SubmenuZoom, {
            'onZoomIn': props.onZoomIn,
            'onZoomOut': props.onZoomOut
        }, `zoom-submenu`);
    } else if (id === data_1.ToolsMenuId.Grid && isSelected) {
        return createComponentVNode(2, submenu_grid_1.SubmenuGrid, {
            'onView': props.onToggleGrid,
            'onPattern': props.onTogglePattern,
            'onExit': props.onExitGrid,
            'isGridVisible': props.isGridVisible,
            'isPatternOn': props.isPatternOn
        }, `grid-submenu`);
    } else {
        return normalizeProps(createVNode(1, 'a', `f7 no-underline black hover-color ttu sans-serif dib ph2 pv2 ${ isSelected ? 'bottom-circle' : '' }`, [
            e.tooltip ? createVNode(1, 'div', 'absolute', null, 1, { 'data-tooltip': e.tooltip }) : createVNode(1, 'div'),
            createVNode(1, 'img', 'w1', null, 1, {
                'src': e.iconUrl,
                'alt': `${ e.label } tool`
            })
        ], 0, Object.assign({}, noPropagation, {
            'href': `#${ id }`,
            'onClick': inferno_1.linkEvent(id, props.onAction)
        }), `toolsmenu-${ id }`));
    }
}, (id, e, isSelected) => {
    if (props.withMoveZoom) {
        return true;
    } else {
        return id !== data_1.ToolsMenuId.Zoom && id !== data_1.ToolsMenuId.Move;
    }
}), 8);
}
// default/dom/components/hud/submenu_grid.jsx
$fsx.f[173] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
const grid_pattern_svg_1 = $fsx.r(174);
const grid_view_svg_1 = $fsx.r(175);
const tools_grid_svg_1 = $fsx.r(34);
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.SubmenuGrid = props => {
    return createVNode(1, 'div', 'dib', createVNode(1, 'nav', 'flex flex-column bottom-circle', [
        normalizeProps(createVNode(1, 'a', 'flex items-center justify-center w2 h2', createVNode(1, 'img', `w1 h1 ${ !props.isGridVisible ? 'o-40 grayscale' : '' }`, null, 1, {
            'src': grid_view_svg_1.default,
            'alt': 'Toggle Grid'
        }), 2, Object.assign({}, noPropagation, {
            'href': '#',
            'onClick': props.onView
        }))),
        normalizeProps(createVNode(1, 'a', 'flex items-center justify-center w2 h2', createVNode(1, 'img', `w1 h1 ${ !props.isPatternOn ? 'o-40 grayscale' : '' }`, null, 1, {
            'src': grid_pattern_svg_1.default,
            'alt': 'Toggle Pattern'
        }), 2, Object.assign({}, noPropagation, {
            'href': '#',
            'onClick': props.onPattern
        }))),
        createVNode(1, 'p', 'gray pa0 ma0 tc', createTextVNode('\u25B2'), 2, {
            'style': {
                'font-size': '0.5rem',
                'transform': 'translateY(0.4rem)'
            }
        }),
        normalizeProps(createVNode(1, 'a', 'flex items-center justify-center w2 h2', createVNode(1, 'img', 'w1 h1', null, 1, {
            'src': tools_grid_svg_1.default,
            'alt': 'Grid Tool'
        }), 2, Object.assign({}, noPropagation, {
            'href': '#',
            'onClick': props.onExit
        })))
    ], 4), 2);
};
}
// default/assets/icons/grid-pattern.svg
$fsx.f[174] = function(module,exports){
module.exports.default = '/assets/c932986b-grid-pattern.svg';
}
// default/assets/icons/grid-view.svg
$fsx.f[175] = function(module,exports){
module.exports.default = '/assets/c5f05c3e-grid-view.svg';
}
// default/dom/components/hud/zoom_menu.jsx
$fsx.f[176] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const vlen = 255;
const hlen = 3;
const lineColor = '#5e2ca5';
const cursorColor = '#AA0022';
exports.ZoomMenu = props => {
    const cursorPos = vlen * props.percentage;
    return createVNode(32, 'svg', `ZoomMenu ${ props.className || '' }`, [
        createVNode(1, 'path', null, null, 1, {
            'd': `M${ hlen } 0 V ${ vlen * props.middleAt } H ${ hlen * 2 } H 0 H ${ hlen } V ${ vlen }`,
            'stroke': lineColor,
            'stroke-width': 1,
            'stroke-linecap': 'round'
        }),
        createVNode(1, 'path', null, null, 1, {
            'd': `M${ hlen * 2 } ${ cursorPos } H 0`,
            'stroke': cursorColor,
            'stroke-width': 2,
            'stroke-linecap': 'round'
        })
    ], 4, {
        'version': '1.1',
        'baseProfile': 'basic',
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': 32,
        'height': props.size,
        'style': props.style,
        'viewBox': `0 0 16 255`
    });
};
}
// default/dom/components/scene.jsx
$fsx.f[177] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
const canvas_1 = $fsx.r(110);
exports.Scene = props => {
    const canvasProps = {
        is3D: true,
        className: props.className,
        onContext: props.onContext,
        height: props.height,
        width: props.width
    };
    return normalizeProps(createComponentVNode(2, canvas_1.default, Object.assign({}, canvasProps)));
};
}
// default/dom/events.js
$fsx.f[178] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const clip_pattern_1 = $fsx.r(21);
const common_1 = $fsx.r(73);
const color_picker_events_1 = $fsx.r(179);
const export_events_1 = $fsx.r(180);
const hud_events_1 = $fsx.r(181);
const meander_events_1 = $fsx.r(182);
const onboarding_events_1 = $fsx.r(183);
const player_events_1 = $fsx.r(184);
const product_events_1 = $fsx.r(185);
const project_events_1 = $fsx.r(186);
const publish_events_1 = $fsx.r(187);
const recorder_events_1 = $fsx.r(188);
const scene_events_1 = $fsx.r(189);
const shape_editor_events_1 = $fsx.r(190);
class Events {
    constructor(rt, s, m, cart, net, proj, onboarding, player, refresher) {
        this.runtime = rt;
        this.state = s;
        this.meander = m;
        this.net = net;
        this.projects = proj;
        this.cart = cart;
        this.refresher = refresher;
        this.player = player;
        this.onboarding = onboarding;
        this.onMouseDown = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            if (!this.runtime.device.isUsingMouse) {
                this.runtime.device.isUsingMouse = true;
                this.refresher.refreshRuntimeOnly(this.runtime);
                this.updateMouseUsage();
            }
            if (this.state.current.isPatternOn) {
                const hit = this.state.current.patternHit(e.clientX, e.clientY);
                if (hit === clip_pattern_1.PatternHit.EndCircle || hit === clip_pattern_1.PatternHit.StartCircle) {
                    this.state.hudStartPatternAdjust(hit === clip_pattern_1.PatternHit.StartCircle);
                    this.refresher.refreshStateOnly(this.state);
                    return;
                }
            }
            this.getEventHandler().onMouseDown(e);
        };
        this.onMouseMove = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            this.getEventHandler().onMouseMove(e);
        };
        this.onMouseUp = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            this.getEventHandler().onMouseUp(e);
        };
        this.onTouchStart = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            if (this.runtime.device.isUsingMouse) {
                this.runtime.device.isUsingMouse = false;
                this.refresher.refreshRuntimeOnly(this.runtime);
                this.updateMouseUsage();
            }
            this.getEventHandler().onTouchStart(e);
        };
        this.onTouchMove = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            this.getEventHandler().onTouchMove(e);
        };
        this.onTouchEnd = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            this.getEventHandler().onTouchEnd(e);
        };
        this.onTouchCancel = e => {
            if (this.meander.course !== data_1.MeanderCourse.Project || this.state.current.ui.at === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.Export) {
                return;
            }
            this.getEventHandler().onTouchCancel(e);
        };
        this.onWebGLInit = ctx => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.sceneEvents.onWebGLInit(ctx);
            this.meanderEvents.initProject();
        });
        this.colorPickerEvents = new color_picker_events_1.ColorPickerEvents(rt, s, refresher);
        this.shapeEditorEvents = new shape_editor_events_1.ShapeEditorEvents(rt, s, refresher);
        this.recorderEvents = new recorder_events_1.RecorderEvents(rt, s, refresher);
        this.sceneEvents = new scene_events_1.SceneEvents(rt, s, refresher);
        this.projectEvents = new project_events_1.ProjectEvents(rt, s, this.net, this.projects, refresher, this.sceneEvents.reset);
        this.publishEvents = new publish_events_1.PublishEvents(rt, s, this.net, refresher, this.projects);
        this.productEvents = new product_events_1.ProductEvents(rt, s, this.cart, this.net, refresher, this.projects);
        this.onboardingEvents = new onboarding_events_1.OnboardingEvents(rt, s, refresher, this.onboarding);
        this.hudEvents = new hud_events_1.HUDEvents(rt, s, refresher, this.sceneEvents.openCols, this.sceneEvents.closeCols, this.sceneEvents.onRedraw);
        this.exportEvents = new export_events_1.ExportEvents(rt, s, this.net, this.projects, refresher, this.hudEvents.onExitFeatures);
        this.meanderEvents = new meander_events_1.MeanderEvents(rt, m, this.net, refresher, this.projectEvents.beforeLogin, this.projectEvents.afterLogin, this.projectEvents.refreshProjects, this.projectEvents.getProject, this.projectEvents.reviveProject, this.projectEvents.reviveNetProject);
        this.shouldUpdateHUD = (lastProps, nextProps) => {
            const dontUpdate = nextProps.action === common_1.UpdateAction.Pan;
            return !dontUpdate;
        };
        this.shouldUpdateScene = (lastProps, nextProps) => {
            const dontUpdate = nextProps.action === common_1.UpdateAction.Pan;
            return !dontUpdate;
        };
        this.shouldUpdateMeander = (lastProps, nextProps) => {
            const dontUpdate = nextProps.action === common_1.UpdateAction.Pan;
            return !dontUpdate;
        };
        this.shouldUpdateEditor = (lastProps, nextProps) => {
            const dontUpdate = nextProps.action === common_1.UpdateAction.Pan;
            return !dontUpdate;
        };
        this.shouldUpdatePattern = (lastProps, nextProps) => {
            return true;
        };
        if (player) {
            this.playerEvents = new player_events_1.PlayerEvents(rt, player, refresher, this.meanderEvents.gotoRoot);
        }
    }
    update(rt, state) {
        this.updateRuntime(rt);
        this.updateState(state);
    }
    updateOnboarding(o) {
        this.onboarding = o;
        this.onboardingEvents.onboarding = o;
    }
    updateNet(n) {
        this.net = n;
        this.meanderEvents.net = n;
        this.productEvents.net = n;
        this.exportEvents.net = n;
    }
    updateMeander(m) {
        this.meanderEvents.meander = m;
    }
    updateCart(c) {
        this.productEvents.cart = c;
    }
    updateProjects(p) {
        this.projects = p;
        this.projectEvents.projects = p;
        this.publishEvents.projects = p;
        this.exportEvents.projects = p;
    }
    updateRuntime(rt) {
        this.runtime = rt;
        this.colorPickerEvents.runtime = rt;
        this.shapeEditorEvents.runtime = rt;
        this.recorderEvents.runtime = rt;
        this.sceneEvents.runtime = rt;
        this.hudEvents.runtime = rt;
        this.exportEvents.runtime = rt;
        this.publishEvents.runtime = rt;
        this.projectEvents.runtime = rt;
        this.onboardingEvents.runtime = rt;
        if (this.playerEvents) {
            this.playerEvents.runtime = rt;
        }
        this.meanderEvents.runtime = rt;
        this.productEvents.runtime = rt;
    }
    updateState(state) {
        this.state = state;
        this.colorPickerEvents.state = state;
        this.shapeEditorEvents.state = state;
        this.recorderEvents.state = state;
        this.sceneEvents.state = state;
        this.hudEvents.state = state;
        this.exportEvents.state = state;
        this.publishEvents.state = state;
        this.projectEvents.state = state;
        this.productEvents.state = state;
        this.onboardingEvents.state = state;
    }
    updatePlayer(p) {
        if (!this.playerEvents) {
            this.playerEvents = new player_events_1.PlayerEvents(this.runtime, p, this.refresher, this.meanderEvents.gotoRoot);
        } else {
            this.playerEvents.state = p;
        }
    }
    initialPlayerState(s) {
        if (!this.playerEvents) {
            return;
        } else {
            this.playerEvents.setInitialState(s);
        }
    }
    updateMouseUsage() {
        const domElem = document.getElementsByTagName('body')[0];
        if (this.runtime.device.isUsingMouse) {
            common_1.removeTouch(domElem, this);
            common_1.addMouse(domElem, this);
        } else {
            common_1.removeMouse(domElem, this);
            common_1.addTouch(domElem, this);
        }
    }
    getEventHandler() {
        const isAt = this.state.current.ui.at;
        if (isAt === data_1.UIState.FillEditor || this.state.current.ui.shapeEditor.editorMode === data_1.UIShapeEditorMode.Fill) {
            return this.colorPickerEvents;
        } else if (isAt === data_1.UIState.ShapeEditor) {
            return this.shapeEditorEvents;
        } else if (isAt === data_1.UIState.Publish || this.state.current.ui.at === data_1.UIState.PublishPreview) {
            return this.publishEvents;
        } else if (isAt === data_1.UIState.Export) {
            return this.exportEvents;
        } else if (isAt === data_1.UIState.Product) {
            return this.productEvents;
        } else if (isAt === data_1.UIState.PatternAdjustEnd || isAt === data_1.UIState.PatternAdjustStart) {
            return this.hudEvents;
        }
        return this.sceneEvents;
    }
}
exports.Events = Events;
}
// default/dom/events/color_picker_events.js
$fsx.f[179] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const movement_1 = $fsx.r(87);
const common_1 = $fsx.r(73);
class ColorPickerEvents {
    constructor(rt, s, refresher) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.onColorCanvasInit = ctx => {
            const cpctx = engine_1.toColorPickerCanvasCtx(ctx);
            this.runtime.rects.colorPickerRect();
            engine_1.Runtime.setColorPickerCtx(this.runtime, cpctx);
            this.refresher.refreshRuntimeOnly(this.runtime);
            engine_1.ColorCanvasPainter.INIT(cpctx, this.state.current);
        };
        this.onColorCanvasUnmount = () => {
            engine_1.Runtime.unsetColorPickerCtx(this.runtime);
            this.refresher.refreshRuntimeOnly(this.runtime);
        };
        this.onMouseDown = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onStartMovement(common_1.getEventX(e), common_1.getEventY(e));
            }
        };
        this.onMouseUp = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onStopMovement();
            }
        };
        this.onMouseMove = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onMovement(common_1.getEventX(e), common_1.getEventY(e));
            }
        };
        this.onTouchStart = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onStartMovement(common_1.getEventX(e), common_1.getEventY(e));
            }
        };
        this.onTouchMove = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onMovement(common_1.getEventX(e), common_1.getEventY(e));
            }
        };
        this.onTouchEnd = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onStopMovement();
            }
        };
        this.onTouchCancel = e => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Color) {
                this.onStopMovement();
            }
        };
        this.onStartMovement = (x, y) => {
            if (!this.runtime.rects.colorPicker) {
                throw new Error('Cannot start color picker movement event: No client rect for the color picker in runtime');
            }
            if (!this.runtime.movement) {
                this.runtime.movement = new movement_1.Movement(x, y, true);
            } else {
                this.runtime.movement.start(x, y);
            }
            const detail = engine_1.ColorCanvasPainter.startMovement(this.state.current, this.runtime.movement, this.runtime.rects.colorPicker);
            if (detail !== null) {
                if (typeof detail === 'number') {
                    this.runtime.movement = null;
                    this.state.colorPickerSelectColor(detail);
                    if (!this.runtime.colorPickerCtx) {
                        throw new Error('Cannot select color, runtime context is not present');
                    }
                    engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
                } else {
                    this.runtime.movement.setDetail(detail);
                }
            } else {
                if (!this.runtime.movement) {
                    this.runtime.movement = new movement_1.Movement(x, y, false);
                } else {
                    this.runtime.movement.end();
                }
            }
            this.refresher.refreshAll(this.runtime, this.state);
        };
        this.onStopMovement = () => {
            if (!this.runtime.movement || !this.runtime.movement.isMoving) {
                this.refresher.refreshDOMOnly();
                return;
            }
            this.runtime.movement.end();
            this.refresher.refreshAll(this.runtime, this.state);
            if (!this.runtime.colorPickerCtx) {
                throw new Error('Cannot stop color movement, runtime context is not present');
            }
            engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
        };
        this.onMovement = (_x, _y) => {
            if (!this.runtime.movement || !this.runtime.movement.isMoving) {
                return;
            }
            const detail = this.runtime.movement.detail;
            if (detail === null) {
                throw new Error('Unable to access the movement detail in color picker');
            }
            if (typeof detail !== 'number') {
                const rect = this.runtime.rects.colorPicker;
                if (!rect) {
                    throw new Error('Cannot move color picker: no rectangle is defined in runtime');
                }
                const size = rect.width;
                const cx = size / 2;
                const cy = cx;
                const x = _x - rect.left;
                const y = _y - rect.top;
                const angle = Math.atan2(cy - y, cx - x) + Math.PI;
                if (detail.in === data_1.WheelMode.WHEEL_HERING_MODE) {
                    const detailAngle = detail.angle;
                    if (!detailAngle) {
                        return new Error('No "angle" in movement detail in color picker');
                    }
                    this.state.colorPickerMoveWheel(angle - detailAngle);
                    this.refresher.refreshStateAndDOM(this.state);
                    if (!this.runtime.colorPickerCtx) {
                        throw new Error('Canvas Ctx not present when moving color wheel');
                    }
                    engine_1.ColorCanvasPainter.wheelMoving(this.runtime.colorPickerCtx, this.state.current);
                } else if (detail.in === data_1.WheelMode.WHEEL_BRIGHTNESS_MODE || detail.in === data_1.WheelMode.WHEEL_SATURATION_MODE) {
                    if (!this.runtime.colorPickerCtx) {
                        throw new Error('Canvas Ctx not present when moving color wheel');
                    }
                    const detailStart = detail.startAngle;
                    if (!detailStart) {
                        return new Error('No "startAngle" in movement detail in color picker');
                    }
                    const angleDiff = angle - detailStart;
                    const angleRatio = (1 - angleDiff / (2 * Math.PI)) % 1;
                    const detailInit = detail.initValue;
                    if (!detailInit) {
                        return new Error('No "initValue" in movement detail in color picker');
                    }
                    const adjusted = (angleRatio + detailInit) % 1;
                    this.state.colorPickerMoveWheel(adjusted);
                    this.refresher.refreshStateAndDOM(this.state);
                    engine_1.ColorCanvasPainter.wheelMoving(this.runtime.colorPickerCtx, this.state.current);
                }
            }
        };
        this.onModeChange = m => {
            this.state.colorPickerModeChange(m);
            this.refresher.refreshStateAndDOM(this.state);
            if (!this.runtime.colorPickerCtx) {
                throw new Error('Cannot select color, runtime context is not present');
            }
            engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
        };
        this.onCode = () => {
            if (this.state.current.ui.fillEditor.editorMode === data_1.UIFillEditorMode.Code) {
                this.state.colorPickerExitCode();
            } else {
                this.state.colorPickerEnterCode();
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onSaveCode = hex => {
            console.log('SAVING COLOR CODE', hex);
            this.state.colorPickerSaveCode(hex);
            this.refresher.refreshStateAndDOM(this.state);
            if (!this.runtime.colorPickerCtx) {
                throw new Error('Cannot select color, runtime context is not present');
            }
            engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
        };
        this.onColorPick = hexStr => {
            this.state.colorPickerSystem(hexStr);
            this.refresher.refreshStateAndDOM(this.state);
            if (!this.runtime.colorPickerCtx) {
                throw new Error('Cannot select color, runtime context is not present');
            }
            engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
        };
        this.onChangeFillId = fillId => {
            this.state.colorPickerSelectFillId(fillId);
            this.refresher.refreshStateAndDOM(this.state);
            if (!this.runtime.colorPickerCtx) {
                throw new Error('Cannot change shape, runtime context is not present');
            }
            engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
        };
    }
}
exports.ColorPickerEvents = ColorPickerEvents;
}
// default/dom/events/export_events.js
$fsx.f[180] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const common_1 = $fsx.r(73);
class ExportEvents {
    constructor(rt, s, n, p, refresher, onExit) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.net = n;
        this.projects = p;
        this.onExitFeatures = onExit;
        this.loadPaypal = () => {
            if (!this.runtime.token) {
            } else {
                common_1.loadScript('https://www.paypalobjects.com/api/checkout.js', 'gg-paypal-checkout').then(() => {
                    if (paypal) {
                        paypal.Button.render({
                            env: undefined,
                            commit: true,
                            style: {
                                color: 'gold',
                                size: 'small'
                            },
                            client: {
                                sandbox: undefined,
                                production: undefined
                            },
                            payment: (data, actions) => {
                                return actions.payment.create({
                                    payment: {
                                        transactions: [{
                                                amount: {
                                                    total: '4.69',
                                                    currency: 'EUR'
                                                }
                                            }]
                                    }
                                });
                            },
                            onAuthorize: (data, actions) => {
                                return actions.payment.execute().then(payment => {
                                    this.projects.exportCurrent().then(proj => {
                                        if (this.runtime.token) {
                                            this.net.export.postExportPayment(this.runtime.token, payment, proj).then(_ => {
                                                this.state.exportImagePreview(true);
                                                this.refresher.refreshStateAndDOM(this.state);
                                            }, fail => {
                                                console.log('ERROR CONTACTING SERVER AFTER PAYMENT', fail);
                                            });
                                        } else {
                                        }
                                    });
                                });
                            },
                            onCancel: (data, actions) => {
                                this.onExitFeatures();
                            },
                            onError: err => {
                                this.onExitFeatures();
                            }
                        }, '#paypal-button');
                    }
                }, error => {
                    console.log('ERROR LOADING PAYPAL', error);
                });
            }
        };
        this.onExportInit = () => {
            common_1.loadScript('https://www.paypalobjects.com/api/checkout.js', 'gg-paypal-checkout');
            console.log('initializing export');
            this.projects.getHash().then(hash => {
                console.log('export hash');
                if (!this.runtime.token) {
                    if (localStorage.jwt) {
                        this.runtime.token = localStorage.jwt;
                        this.refresher.refreshRuntimeOnly(this.runtime);
                        this.onExportInit();
                    } else {
                        console.log('export ERROR no token');
                        return;
                    }
                } else {
                    console.log('export checking with server');
                    this.net.export.postCanExport(this.runtime.token, hash).then(response => {
                        console.log('export can export');
                        this.state.exportImagePreview(response.canExport);
                        this.refresher.refreshStateAndDOM(this.state);
                    });
                }
            });
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onChangeToImage = e => {
            e.preventDefault();
            this.state.exportChangeTo(data_1.ExportAt.Image);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onChangeToVideo = e => {
            e.preventDefault();
            this.state.exportChangeTo(data_1.ExportAt.Video);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFormatChange = (fmt, e) => {
            e.preventDefault();
            this.state = this.state.exportFormatChange(fmt);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onSizeChange = (size, e) => {
            e.preventDefault();
            this.state = this.state.exportSizeChange(size);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onPatternChange = e => {
            e.preventDefault();
            const t = e.target;
            if (t) {
                const value = parseFloat(t.value);
                if (!isNaN(value)) {
                    this.state = this.state.exportPatternChange(value);
                    this.refresher.refreshStateAndDOM(this.state);
                }
            }
        };
        this.onExport = e => {
            if (e) {
                e.preventDefault();
            }
            const exportEditor = this.state.current.ui.exportEditor;
            if (exportEditor.at === data_1.ExportAt.Done && this.runtime.token && exportEditor.fname) {
                this.net.export.getExportFile(this.runtime.token, exportEditor.fname);
                return;
            }
            const res = exportEditor.calcres();
            if (exportEditor.at === data_1.ExportAt.Image) {
                if (exportEditor.format === data_1.ExportEditorFormat.PNG) {
                    this.prepareFile();
                    this.projects.getHash().then(hash => {
                        if (this.runtime.token) {
                            this.net.export.postExportPNG(this.runtime.token, hash, exportEditor.calcres(), exportEditor.patternSize).then(exported => {
                                this.doneFile(exported.file);
                            }, error => {
                                console.log('GOT ERROR', error);
                            });
                        } else {
                        }
                    });
                } else if (exportEditor.dim) {
                    const svg = this.state.current.renderSVG(exportEditor.dim, res.width, res.height);
                    const fname = 'GridGenerator.svg';
                    common_1.downloadFile(svg, fname);
                }
            } else {
                this.prepareFile();
                if (exportEditor.format === data_1.ExportEditorFormat.MP4) {
                    this.projects.getHash().then(hash => {
                        if (this.runtime.token) {
                            this.net.export.postExportMP4(this.runtime.token, hash, exportEditor.calcres()).then(exported => {
                                this.doneFile(exported.file);
                            }, error => {
                                console.log('GOT ERROR', error);
                            });
                        } else {
                        }
                    });
                } else {
                    this.projects.getHash().then(hash => {
                        if (this.runtime.token) {
                            this.net.export.postExportGIF(this.runtime.token, hash, exportEditor.calcres()).then(exported => {
                                this.doneFile(exported.file);
                            }, error => {
                                console.log('GOT ERROR', error);
                            });
                        } else {
                        }
                    });
                }
            }
        };
        this.doneFile = fname => {
            console.log('DONE FILE', fname);
            this.state.exportDone(fname);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onError = error => {
            this.state.exportError(error);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.prepareFile = () => {
            this.state.exportPrepare();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onMouseDown = e => {
            return;
        };
        this.onMouseUp = e => {
            return;
        };
        this.onMouseMove = e => {
            return;
        };
        this.onTouchStart = e => {
            return;
        };
        this.onTouchMove = e => {
            return;
        };
        this.onTouchEnd = e => {
            return;
        };
        this.onTouchCancel = e => {
            return;
        };
    }
}
exports.ExportEvents = ExportEvents;
}
// default/dom/events/hud_events.js
$fsx.f[181] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
class HUDEvents {
    constructor(rt, s, refresher, openScene, closeScene, redrawScene) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.actionSets = new data_1.FatActionSets();
        this.openScene = openScene;
        this.closeScene = closeScene;
        this.redrawScene = redrawScene;
        this.showEditor = () => {
            this.state.hudUIEditorOnTop();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onDiscardShape = () => {
            const isExisting = this.state.current.ui.shapeEditor.isExistingShape;
            if (!isExisting) {
                this.state.hudDiscardNewShape();
            } else {
                this.state.hudDiscardEditedShape();
            }
            this.refresher.refreshAll(this.runtime, this.state);
            this.closeScene(() => {
                if (this.state.current.ui.exitingEditor) {
                    this.state.hudUICloseNewShape();
                    this.refresher.refreshStateAndDOM(this.state);
                }
            });
        };
        this.onFeaturesMenu = (feature, e) => {
            e.preventDefault();
            this.state.hudEnterFeature(feature);
            this.refresher.refreshStateAndDOM(this.state);
            this.openScene(this.showEditor);
        };
        this.onNewShape = () => {
            this.state.hudEnterNewShape();
            this.refresher.refreshStateAndDOM(this.state);
            this.openScene(this.showEditor);
        };
        this.onNewFill = () => {
            const numFills = this.state.current.selectedShapeNumFills;
            const shapeFillSetId = this.state.current.newShapeFillSetId(this.runtime.rnd);
            const fillIds = this.state.current.newFillIds(this.runtime.rnd, numFills);
            console.log('[SHAPE]: NUM FILLS', numFills, 'FILL IDS:', fillIds);
            const colors = [];
            for (let c = 0; c < numFills; c++) {
                const rndSat = Math.random() * 0.65 + 0.2;
                const rndLight = Math.random() * 0.65 + 0.2;
                colors.push(data_1.RGBColor.randomHering(rndSat, rndLight, Math.random()));
            }
            this.state.hudEnterNewFill(shapeFillSetId, fillIds, colors);
            this.openScene(this.showEditor);
            this.refresher.refreshAll(this.runtime, this.state);
            if (this.runtime.colorPickerCtx) {
                engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
            }
        };
        this.onExitFeatures = onDone => {
            this.state.featuresExit();
            this.refresher.refreshAll(this.runtime, this.state);
            this.closeScene(() => {
                if (this.state.current.ui.exitingEditor) {
                    this.state.featuresClose();
                    this.refresher.refreshStateAndDOM(this.state);
                    if (onDone && typeof onDone === 'function') {
                        onDone();
                    }
                }
            });
        };
        this.onDiscardFill = () => {
            this.state.hudDiscardNewFills();
            this.refresher.refreshAll(this.runtime, this.state);
            this.closeScene(() => {
                if (this.state.current.ui.exitingEditor) {
                    this.state.hudUICloseNewFill();
                    this.refresher.refreshStateAndDOM(this.state);
                }
            });
        };
        this.onSaveFill = () => {
            this.state.hudSaveNewFills();
            this.refresher.refreshAll(this.runtime, this.state);
            this.closeScene(() => {
                if (this.state.current.ui.exitingEditor) {
                    this.state.hudUICloseNewFill();
                    this.refresher.refreshStateAndDOM(this.state);
                }
            });
            this.shape2Texture();
        };
        this.onSaveShape = () => {
            const isExisting = this.state.current.ui.shapeEditor.isExistingShape;
            const type = this.state.current.currentLayerType;
            if (isExisting) {
                const shapeId = this.state.current.selectedShapeId;
                const shapeFillSetId = this.state.current.selectedShape.selectedFillSet;
                const rndIds = this.state.current.fills.rndFillIds(this.runtime.rnd, this.state.current.shapes.getMaxNeededDups(shapeId));
                this.state.hudSaveShape(type, shapeId, shapeFillSetId, rndIds);
                this.refresher.refreshStateOnly(this.state);
                this.refresher.refreshRuntimeOnly(this.runtime);
                this.shape2Texture(true);
            } else {
                const shapeId = this.state.current.newShapeId(this.runtime.rnd);
                const shapeFillSetId = this.runtime.rnd.pop();
                this.state.hudSaveShape(type, shapeId, shapeFillSetId, []);
                this.shape2Texture();
            }
            this.refresher.refreshAll(this.runtime, this.state);
            this.closeScene(() => {
                if (this.state.current.ui.exitingEditor) {
                    this.state.hudUICloseNewShape();
                    this.refresher.refreshStateAndDOM(this.state);
                }
            });
            return null;
        };
        this.onSelectShape = shapeId => {
            const layer = this.state.current.layers.getSelected();
            if (this.state.current.ui.currentTool !== data_1.ToolsMenuId.Paint) {
                this.state.hudSelectShape(shapeId);
            } else if (shapeId === layer.selectedShape) {
                this.state.hudEnterEditShape();
                this.openScene(this.showEditor);
            } else {
                this.state.hudSelectShape(shapeId);
            }
            this.refresher.refreshAll(this.runtime, this.state);
        };
        this.onSelectFill = fillId => {
            this.state.hudSelectFill(fillId);
            this.refresher.refreshAll(this.runtime, this.state);
        };
        this.onSelectTool = (toolsId, e) => {
            e.preventDefault();
            if (toolsId === data_1.ToolsMenuId.Undo) {
                this.runtime.getInitialState().then(initialState => {
                    this.state.prev(initialState, this.actionSets.undoActions, 1);
                    engine_1.Runtime.resetClipSpace(this.runtime, this.state.current, true).then(updatedRT => {
                        this.refresher.refreshAll(updatedRT, this.state);
                        this.redrawScene();
                    }, error => console.warn(`Cannot reset runtime/clipspace to perform Undo action: ${ error }`));
                }, error => console.warn(`Cannot get initial state to perform Undo action: ${ error }`));
            } else {
                this.state.hudSelectTool(toolsId);
                this.refresher.refreshAll(this.runtime, this.state);
            }
        };
        this.onClearAll = () => {
            this.state.hudClearAll();
            engine_1.Runtime.resetClipSpace(this.runtime, this.state.current, true).then(_rt => {
                this.refresher.refreshAll(_rt, this.state);
                this.redrawScene();
            });
        };
        this.onGridPattern = e => {
            e.preventDefault();
            this.state.hudTogglePattern();
            if (this.state.current.ui.toolsSubmenus.isGridPatternOn) {
                const pattern = this.state.current.pattern;
                if (!pattern) {
                    const v = this.state.current.viewport;
                    const centerX = v.squareX(this.runtime.width / 2);
                    const centerY = v.squareX(this.runtime.height / 2);
                    this.state.hudNewPattern(v.squareLayerX() + centerX, v.squareLayerY() + centerY);
                }
                this.state.hudUpdatePatternPos();
            }
            if (this.runtime.textures) {
                this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, this.state.current.currentLayer.pattern !== null);
                this.redrawScene();
            }
            this.refresher.refreshAll(this.runtime, this.state);
        };
        this.onGridExit = e => {
            e.preventDefault();
            this.state.hudSelectTool(data_1.ToolsMenuId.Paint);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onMouseUp = e => {
            e.preventDefault();
            this.state.hudStopPatternAdjust();
            if (this.state.current.currentLayer.pattern && this.runtime.textures) {
                this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, true);
                this.redrawScene();
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onMouseMove = e => {
            e.preventDefault();
            const v = this.state.current.viewport;
            const layerX = v.squareLayerX() + v.squareX(e.clientX);
            const layerY = v.squareLayerY() + v.squareX(e.clientY);
            this.patternify(layerX, layerY, false);
        };
        this.onMouseDown = e => {
            e.preventDefault();
        };
        this.onTouchStart = e => {
            e.preventDefault();
        };
        this.onTouchMove = e => {
            e.preventDefault();
            const v = this.state.current.viewport;
            const touch = e.touches.item(0);
            if (touch) {
                const layerX = v.squareLayerX() + v.squareX(touch.clientX);
                const layerY = v.squareLayerY() + v.squareX(touch.clientY);
                this.patternify(layerX, layerY, false);
            }
        };
        this.onTouchEnd = e => {
            e.preventDefault();
            this.state.hudStopPatternAdjust();
            if (this.state.current.currentLayer.pattern && this.runtime.textures) {
                this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, true);
                this.redrawScene();
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onTouchCancel = e => {
            e.preventDefault();
        };
    }
    shape2Texture(update = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const shape = this.state.current.selectedShape;
            const shapeId = this.state.current.selectedShapeId;
            const newFillSetId = this.state.current.selectedShape.selectedFillSet;
            const size = this.runtime.getTextureSize(this.state.current.viewport);
            const svg = this.state.current.fills.buildSVG(shape.resolution, shape.getSelectedFills(), size, size);
            if (update) {
                for (const [fillSetId, m] of shape.entries()) {
                    yield this.runtime.updateTexture(shapeId, fillSetId, this.state.current.fills.buildSVG(shape.resolution, m, size, size));
                }
                this.refresher.refreshAll(this.runtime, this.state);
                this.redrawScene();
            } else {
                this.runtime.addTexture(shapeId, newFillSetId, svg).then(() => {
                    this.refresher.refreshAll(this.runtime, this.state);
                    this.redrawScene();
                });
            }
        });
    }
    patternify(layerX, layerY, show) {
        const pattern = this.state.current.pattern;
        if (pattern) {
            if (this.state.current.ui.at === data_1.UIState.PatternAdjustEnd && (pattern.gridPattern.endX === layerX && pattern.gridPattern.endY === layerY)) {
                return;
            } else if (pattern.gridPattern.startX === layerX && pattern.gridPattern.startY === layerY) {
                return;
            }
        }
        this.state.hudPatternAdjust(layerX, layerY);
        this.state.hudUpdatePatternPos();
        if (this.state.current.currentLayer.pattern && this.runtime.textures) {
            this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, show);
            this.redrawScene();
        }
        this.refresher.refreshStateAndDOM(this.state);
    }
}
exports.HUDEvents = HUDEvents;
}
// default/dom/events/meander_events.js
$fsx.f[182] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = $fsx.r(240);
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const loading_1 = $fsx.r(81);
class MeanderEvents {
    constructor(rt, m, net, refresher, storeCurProj, restorePrevProj, refreshProjs, getProj, reviveProj, reviveNetProj) {
        this.runtime = rt;
        this.meander = m;
        this.net = net;
        this.refresher = refresher;
        this.refreshProjs = refreshProjs;
        this.reviveProj = reviveProj;
        this.reviveNetProj = reviveNetProj;
        this.getProject = getProj;
        this.loading = new loading_1.Loading();
        this.appContainer = document.getElementById('app');
        this.refresher.refreshRuntimeOnly(this.runtime);
        this.startLoading = () => {
            this.loading.startFullscreen().then(l => this.loading = l);
        };
        this.stopLoading = () => {
            this.loading.stopFullscreen().then(l => this.loading = l);
        };
        this.clearToken = () => {
            this.runtime.token = null;
            localStorage.jwt = null;
            this.refresher.refreshMeanderOnly(this.meander);
            this.refresher.refreshRuntimeOnly(this.runtime);
        };
        this.sessionExpired = () => {
            this.meander.profile.clear();
            this.meander.login.error = `Sorry, your session expired.`;
            this.gotoLogin();
            this.updateDOM();
            this.loading.stopFullscreen();
            this.updateDOM();
            return;
        };
        this.onProjectNew = () => {
            this.loading.startFullscreen().then(l => this.loading = l);
            this.refresher.refreshNewProject(new data_1.Project(new data_1.State()));
            this.gotoRoot();
        };
        this.initProject = () => {
            const unload = () => {
                this.loading.stopFullscreen().then(loading => {
                    window.addEventListener('popstate', this.fromRoute);
                    this.loading = loading;
                    this.unblurProject();
                    this.fromRoute();
                    this.refresher.refreshMeanderOnly(this.meander);
                });
            };
            if (localStorage.jwt) {
                this.initFromToken(localStorage.jwt).then(unload, unload);
            } else {
                unload();
            }
        };
        this.initFromToken = tokenStr => {
            return new Promise((resolve, reject) => {
                localStorage.jwt = tokenStr;
                const token = new engine_1.Token(tokenStr);
                localStorage.token = token;
                this.runtime.token = token;
                this.refresher.refreshRuntimeOnly(this.runtime);
                this.meander.profile.startLoading();
                this.refresher.refreshMeanderOnly(this.meander);
                this.updateDOM();
                this.net.profile.getProfile(token).then(profile => {
                    const p = profile.data.curProfile;
                    if (p && p.id) {
                        this.meander.profile.buildProfile(p.id, p.name, p.about, p.createdAt, p.badges);
                        this.meander.profile.stopLoading('');
                        this.updateDOM();
                        resolve();
                    } else {
                        this.meander.profile.errorLoading('Profile with no ID. Please get in contact with us.');
                        this.updateDOM();
                        resolve();
                        return;
                    }
                }, error => {
                    if (engine_1.Net.isUnauthorized(error)) {
                        this.sessionExpired();
                        return;
                    } else {
                        this.meander.profile.errorLoading(error);
                        this.updateDOM();
                    }
                });
            });
        };
        this.blurProject = () => {
            const appElem = this.appContainer;
            if (!appElem) {
                return;
            }
            if (appElem.classList.contains('blur-6')) {
                return;
            }
            appElem.classList.add('blur-0');
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    appElem.classList.add('blur-6');
                    appElem.classList.remove('blur-0');
                });
            });
        };
        this.onMenuAction = (id, e) => {
            e.preventDefault();
            const hist = {
                menuId: id,
                course: this.transformMenuIdToCourse(id)
            };
            const route = window.location.pathname.slice(1);
            if (route !== id) {
                window.history.pushState(hist, id, `/${ id }`);
            }
            this.fromRoute();
        };
        this.fromRoute = e => {
            const routes = window.location.pathname.slice(1).split('/');
            switch (routes[0]) {
            case data_1.MainMenuId.About:
                this.onRouteAbout();
                break;
            case data_1.MainMenuId.Collective:
                this.onRouteCollective();
                break;
            case data_1.MainMenuId.Pricing:
                this.onRoutePricing();
                break;
            case data_1.MainMenuId.Profile:
                this.onRouteProfile();
                break;
            case 'login':
                this.onRouteLogin();
                break;
            case 'loginSocial':
                this.onRouteLoginSocial();
                break;
            case 'loginError':
                this.onRouteLoginError();
                break;
            case 'verify':
                this.onRouteVerify();
                break;
            case 'recover':
                this.onRouteRecover();
                break;
            case 'p':
                this.onRouteViewProject(routes[1]);
                break;
            default:
                this.onRouteRoot();
            }
            this.updateDOM();
        };
        this.onRouteRoot = () => {
            this.unblurProject();
            this.meander.course = data_1.MeanderCourse.Project;
        };
        this.onRouteVerify = () => {
            this.meander.course = data_1.MeanderCourse.Verify;
            this.verifyEmail(window.location.search);
        };
        this.onRouteLogin = () => {
            this.meander.course = data_1.MeanderCourse.Login;
        };
        this.onRouteLoginSocial = () => {
            const query = window.location.search.split('=');
            if (query.length !== 2 || query[0] !== '?t') {
                this.meander.login.isLoading = false;
                this.meander.course = data_1.MeanderCourse.Login;
                this.meander.login.error = 'Login failed';
                this.updateDOM();
            } else {
                this.initFromToken(query[1]);
                this.gotoRoot();
            }
        };
        this.onRouteLoginError = () => {
            this.meander.course = data_1.MeanderCourse.Login;
            this.meander.login.isLoading = false;
            const query = window.location.search.split('=');
            if (query.length !== 2 || query[0] !== '?msg') {
                this.meander.login.error = 'Login failed';
            } else {
                this.meander.login.error = `Login failed: ${ decodeURIComponent(query[1]) }`;
            }
            this.updateDOM();
        };
        this.onRouteProfile = () => {
            if (this.runtime.token && this.runtime.token.id) {
                this.meander.course = data_1.MeanderCourse.Profile;
                if (this.meander.profile.menu.selected === data_1.ProfileMenuId.Projects) {
                    this.onProfileProjects();
                }
                this.updateDOM();
            } else {
                this.onRouteLogin();
            }
        };
        this.onRouteViewProject = projNum => {
            this.meander.course = data_1.MeanderCourse.ViewProject;
            const projInfo = projNum.split('#');
            const projId = parseInt(projInfo[0], 10);
            if (isNaN(projId)) {
                return;
            }
            const p = this.getProject(projId);
            if (!p) {
                this.net.profile.getProject(projId, this.runtime.token || undefined).then(resp => {
                    const data = resp.data;
                    if (data.workById) {
                        this.reviveNetProj(data.workById).then(proj => {
                            const stored = proj.toStored();
                            if (!stored) {
                                console.log('ERROR, could not convert project to stored', proj);
                                return;
                            }
                            stored.initialState = data.workById.initialState || '';
                            stored.finalState = data.workById.finalState || '';
                            stored.fatState = data.workById.fatState || '';
                            this.updateProjectView(proj, stored);
                        }, error => {
                        });
                    }
                }, error => {
                });
            } else {
                this.reviveProj(projId).then(proj => {
                    this.updateProjectView(proj, p);
                }, error => {
                });
            }
        };
        this.onRouteAbout = () => {
            this.meander.course = data_1.MeanderCourse.About;
            this.updateDOM();
        };
        this.onRoutePricing = () => {
            this.meander.course = data_1.MeanderCourse.Pricing;
            this.updateDOM();
        };
        this.onRouteCollective = () => {
            this.meander.course = data_1.MeanderCourse.Collective;
        };
        this.onRouteRecover = () => {
            this.meander.course = data_1.MeanderCourse.Recover;
        };
        this.onAboutSubmenuAction = (optionId, e) => {
            e.preventDefault();
            this.meander.about.menu.selected = optionId;
            this.updateDOM();
        };
        this.onProfileSubmenuAction = (optionId, e) => {
            e.preventDefault();
            this.meander.profile.menu.selected = optionId;
            this.updateDOM();
            if (optionId === data_1.ProfileMenuId.Projects) {
                this.onProfileProjects();
            }
        };
        this.gotoPricing = e => {
            if (e) {
                e.preventDefault();
            }
            const hist = { course: data_1.MeanderCourse.Pricing };
            window.history.pushState(hist, 'Grid Generator', '/pricing');
            this.fromRoute();
        };
        this.gotoProjects = () => {
            const hist = { course: data_1.MeanderCourse.Profile };
            window.history.pushState(hist, 'Grid Generator', '/profile');
            this.fromRoute();
        };
        this.gotoRoot = () => {
            const hist = { course: data_1.MeanderCourse.Project };
            window.history.pushState(hist, 'Grid Generator', '/');
            this.fromRoute();
        };
        this.gotoLogin = () => {
            const hist = { course: data_1.MeanderCourse.Login };
            this.clearToken();
            this.refresher.refreshRuntimeOnly(this.runtime);
            window.history.replaceState(hist, 'Grid Generator', '/login');
            this.fromRoute();
        };
        this.gotoView = id => {
            window.history.pushState(null, 'Grid Generator', `/p/${ id }`);
            this.fromRoute();
        };
        this.onProfileUpdate = e => {
            const formData = this.getProfileForm();
            if (!this.runtime.token) {
                this.gotoLogin();
                this.updateDOM();
                return;
            }
            this.meander.profile.form = formData;
            this.meander.profile.startLoading();
            this.updateDOM();
            this.net.profile.updateProfile(this.runtime.token, this.meander.profile).then(response => {
                if (!response.data || !response.data.setProfile || !response.data.setProfile.profile) {
                    this.meander.profile.errorLoading('Invalid response from server when updating profile, please get in contact with us.');
                    this.updateDOM();
                    return;
                }
                const p = response.data.setProfile.profile;
                this.meander.profile.buildProfile(p.id, p.name, p.about, p.createdAt, p.badges);
                this.meander.profile.stopLoading('Profile updated');
                this.updateDOM();
            }, error => {
                if (engine_1.Net.isUnauthorized(error)) {
                    this.sessionExpired();
                    return;
                } else {
                    this.meander.profile.errorLoading(error);
                    this.updateDOM();
                }
            });
        };
        this.onProfileProjects = () => {
            if (this.runtime.token) {
                this.meander.profile.startLoading();
                this.net.profile.getProfileProjects(this.runtime.token).then(response => {
                    const data = response.data;
                    if (data.curWorks && data.curWorks.edges && data.curWorks.edges && data.curWorks.edges.length > 0) {
                        const projects = data.curWorks.edges.map(edge => edge.node);
                        this.refreshProjs(projects);
                    } else {
                    }
                    this.meander.profile.stopLoading('');
                    this.updateDOM();
                }, error => {
                    if (engine_1.Net.isUnauthorized(error)) {
                        this.sessionExpired();
                        return;
                    } else {
                        this.meander.profile.errorLoading(error);
                        this.updateDOM();
                    }
                });
            } else {
                this.gotoLogin();
                this.updateDOM();
            }
        };
        this.verifyEmail = searchLink => {
            this.net.login.verifyEmail(searchLink).then(res => {
                if (res.result && res.token) {
                    this.meander.verify.state = data_1.VerifyingState.Success;
                    this.meander.verify.user = 'Welcome to Grid Generator!';
                    this.initFromToken(res.token);
                } else if (res.reason === 'User already verified') {
                    this.meander.verify.state = data_1.VerifyingState.AlreadyVerified;
                    this.meander.verify.user = null;
                } else {
                    this.meander.verify.state = data_1.VerifyingState.Failed;
                    this.meander.verify.user = null;
                }
                this.updateDOM();
            }, error => {
                this.meander.verify.state = data_1.VerifyingState.Failed;
                this.meander.verify.user = null;
                this.updateDOM();
            });
        };
        this.loginEmail = e => {
            if (e) {
                e.preventDefault();
            }
            this.getLoginData().then(loginData => {
                this.meander.login.isLoading = true;
                this.updateDOM();
                this.net.login.emailLogin(loginData.u, loginData.p).then(res => {
                    if (!res.result) {
                        this.meander.login.error = 'Wrong credentials';
                        this.meander.login.isLoading = false;
                        this.meander.login.showRecover = true;
                        this.updateDOM();
                    } else {
                        const tokenStr = res.token;
                        this.initFromToken(tokenStr);
                        this.meander.login.error = null;
                        this.meander.login.isLoading = false;
                        this.gotoRoot();
                    }
                }, error => {
                    this.meander.login.isLoading = false;
                    this.meander.login.error = error.message;
                    this.updateDOM();
                });
            }, inputError => {
                this.meander.login.error = inputError;
                this.updateDOM();
                return;
            });
        };
        this.recover = e => {
            e.preventDefault();
            this.getInputValue('login-u').then(username => {
                this.meander.login.isLoading = true;
                this.updateDOM();
                this.net.login.recover(username).then(answer => {
                    if (answer.result) {
                        this.meander.login.successEmail = 'Recovery link';
                        this.meander.login.successTitle = 'Password recover';
                        this.meander.login.success = answer.reason;
                    } else {
                        this.meander.login.error = answer.reason;
                    }
                    this.meander.login.isLoading = false;
                    this.updateDOM();
                    return;
                }, error => {
                    this.meander.login.isLoading = false;
                    this.meander.login.error = error;
                    this.updateDOM();
                });
            }, inputError => {
                this.meander.login.isLoading = false;
                this.meander.login.error = inputError;
                this.updateDOM();
            });
        };
        this.resetPassword = e => {
            if (e) {
                e.preventDefault();
            }
            this.getInputValue('recover-p').then(newPass => {
                this.meander.recover.state = data_1.RecoverState.Recovering;
                this.updateDOM();
                this.net.login.resetPassword(newPass, window.location.search || '').then(answer => {
                    this.meander.login = new data_1.MeanderLogin();
                    if (answer.result === false) {
                        this.meander.login.error = `Sorry ${ answer.reason }. Please try to recover the password again`;
                        this.meander.login.showRecover = true;
                        this.updateDOM();
                    } else {
                        this.meander.login.success = 'Password updated. Try to login with it.';
                    }
                    this.meander.course = data_1.MeanderCourse.Login;
                    this.gotoLogin();
                    this.updateDOM();
                }, error => {
                    this.meander.recover.error = error;
                    this.updateDOM();
                });
            }, inputError => {
                this.meander.recover.error = inputError;
                this.updateDOM();
            });
        };
        this.registerEmail = e => {
            if (e) {
                e.preventDefault();
            }
            this.getLoginData().then(loginData => {
                this.meander.login.isLoading = true;
                this.updateDOM();
                this.net.login.emailRegister(loginData.u, loginData.p).then(answer => {
                    this.meander.login.isLoading = false;
                    this.meander.login.error = null;
                    if (answer.result) {
                        this.meander.login.success = answer.reason;
                        this.meander.login.successEmail = loginData.u;
                        this.meander.login.successTitle = 'Thank you';
                    } else {
                        this.meander.login.error = answer.reason;
                    }
                    this.updateDOM();
                }, netError => {
                    this.meander.login.isLoading = false;
                    this.meander.login.error = netError.message;
                    this.updateDOM();
                });
            }, inputError => {
                this.meander.login.error = inputError;
                this.updateDOM();
            });
        };
        this.onProjectView = (id, e) => {
            e.preventDefault();
            this.gotoView(id);
        };
    }
    updateProjectView(proj, p) {
        if (proj.fatState && proj.svg && proj.svgViewBox) {
            const ps = new data_1.PlayerState(proj);
            ps.canvasWidth = Math.min(this.runtime.device.width, 830);
            ps.canvasHeight = Math.min(proj.svgViewBox[1] / proj.svgViewBox[0] * ps.canvasWidth, this.runtime.device.height - 256);
            this.refresher.refreshPlayerInitialState(ps, proj.initialState);
            this.meander.view = new data_1.MeanderView();
            this.meander.view.project = p;
            this.updateDOM();
        } else {
        }
    }
    get containerNode() {
        let app = this.appContainer;
        if (!app) {
            app = document.getElementById('app');
            if (!app) {
                throw new Error('Cannot find container node in Meander Events');
            }
        }
        return app;
    }
    getInputValue(id) {
        return new Promise((resolve, reject) => {
            const elem = document.getElementById(id);
            if (!elem) {
                reject(`#${ id } element not found`);
            }
            if (!elem.validity.valid) {
                reject(elem.validationMessage);
            }
            resolve(elem.value);
        });
    }
    getLoginData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const handleError = error => ({
                u: '',
                p: '',
                error
            });
            return this.getInputValue('login-u').then(username => this.getInputValue('login-p').then(pass => ({
                u: username,
                p: pass,
                error: null
            }), handleError), handleError);
        });
    }
    getProfileForm() {
        const newNameElem = document.getElementById('profile-name');
        if (!newNameElem) {
            throw new Error('Cannot find the profile-name input element');
        }
        const newName = newNameElem.value;
        const newBioElem = document.getElementById('profile-bio');
        if (!newBioElem) {
            throw new Error('Cannot find the profile-bio textarea element');
        }
        const newBio = newBioElem.value;
        return {
            name: newName,
            about: newBio
        };
    }
    getBillingInfo() {
        let result = {};
        const firstnameElem = document.getElementById('firstname');
        const lastnameElem = document.getElementById('lastname');
        const vatidElem = document.getElementById('vatid');
        const emailElem = document.getElementById('email');
        const companyElem = document.getElementById('company');
        const websiteElem = document.getElementById('website');
        const phoneElem = document.getElementById('phone');
        const regionElem = document.getElementById('region');
        const cityElem = document.getElementById('city');
        const postalElem = document.getElementById('postal');
        const streetElem = document.getElementById('street');
        const countryElem = document.getElementById('country');
        if (countryElem && countryElem.value && countryElem.value !== '-1') {
            const country = data_1.getCountry(parseInt(countryElem.value, 10));
            result = Object.assign(result, {
                countryCodeNumeric: country.code,
                countryCodeAlpha2: country.alpha2
            });
        }
        if (firstnameElem && firstnameElem.value) {
            result = Object.assign(result, { firstName: firstnameElem.value });
        }
        if (lastnameElem && lastnameElem.value) {
            result = Object.assign(result, { lastName: lastnameElem.value });
        }
        if (vatidElem && vatidElem.value) {
            result = Object.assign(result, { vatid: vatidElem.value });
        }
        if (emailElem && emailElem.value) {
            result = Object.assign(result, { email: emailElem.value });
        }
        if (companyElem && companyElem.value) {
            result = Object.assign(result, { company: companyElem.value });
        }
        if (websiteElem && websiteElem.value) {
            result = Object.assign(result, { website: websiteElem.value });
        }
        if (phoneElem && phoneElem.value) {
            result = Object.assign(result, { phone: phoneElem.value });
        }
        if (regionElem && regionElem.value) {
            result = Object.assign(result, { region: regionElem.value });
        }
        if (cityElem && cityElem.value) {
            result = Object.assign(result, { locality: cityElem.value });
        }
        if (postalElem && postalElem.value) {
            result = Object.assign(result, { postalCode: postalElem.value });
        }
        if (streetElem && streetElem.value) {
            result = Object.assign(result, { streetAddress: streetElem.value });
        }
        return result;
    }
    transformMenuIdToCourse(id) {
        switch (id) {
        case data_1.MainMenuId.About:
            return data_1.MeanderCourse.About;
        case data_1.MainMenuId.Collective:
            return data_1.MeanderCourse.Collective;
        case data_1.MainMenuId.Pricing:
            return data_1.MeanderCourse.Pricing;
        case data_1.MainMenuId.Profile:
            return data_1.MeanderCourse.Login;
        }
        return data_1.MeanderCourse.Login;
    }
    updateDOM() {
        if (this) {
            this.refresher.refreshMeanderOnly(this.meander);
            this.refresher.refreshDOMOnly();
        }
    }
    unblurProject() {
        const appElem = this.containerNode;
        appElem.classList.remove('blur-6');
    }
}
exports.MeanderEvents = MeanderEvents;
}
// default/dom/events/onboarding_events.js
$fsx.f[183] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class OnboardingEvents {
    constructor(rt, s, refresher, onboarding) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.onboarding = onboarding;
    }
}
exports.OnboardingEvents = OnboardingEvents;
}
// default/dom/events/player_events.js
$fsx.f[184] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
const common_1 = $fsx.r(73);
class PlayerEvents {
    constructor(rt, p, refresher, exit) {
        this.runtime = rt;
        this.state = p;
        this.refresher = refresher;
        const fas = new data_1.FatActionSets();
        this.playerActions = fas.sitePlayerActions;
        this.exit = exit;
        this.onClickAction = e => {
            e.stopImmediatePropagation();
            e.preventDefault();
            return;
        };
        this.onPlayerCanvasInit = ctx => {
            if (!this.runtime.playerImg) {
                this.runtime.playerImg = new Image(ctx.width, ctx.height);
                this.runtime.playerImg.addEventListener('load', this.onPlayerImgLoad, false);
                this.runtime.playerImg.addEventListener('error', e => console.warn('PLAYER GOT ERROR', e));
            }
            this.runtime.rects.playerRect();
            engine_1.Runtime.setPlayerCtx(this.runtime, ctx.ctx);
            this.refresher.refreshRuntimeOnly(this.runtime);
            const svg = engine_1.PlayerCanvasPainter.SVGHEAD(this.state.thumbnailSvg, ctx.width, ctx.height, this.state.thumbnailSvgViewBox);
            this.state.currentViewBox = this.state.thumbnailSvgViewBox;
            this.runtime.playerImg.src = svg;
        };
        this.onPlayerImgLoad = () => {
            if (this.runtime.playerCtx && this.runtime.playerImg) {
                engine_1.PlayerCanvasPainter.PAINT(this.runtime.playerCtx, this.state.state.current, this.runtime.playerImg, this.state.currentViewBox);
            }
        };
        this.onPlay = () => {
            const interval = 60;
            this.state.isPlaying = true;
            const loop = () => {
                if ((this.state.isAtEnd || !this.state.isPlaying) && this.runtime.playerLoop) {
                    this.stopLoop();
                    this.refresher.refreshPlayerAndDOM(this.state);
                    return;
                } else {
                    this.state.state.fastRestoreFwd(this.playerActions);
                    this.paint(this.state.state.current);
                    this.updateVersion();
                }
            };
            if (this.state.isAtEnd) {
                this.getInitialState().then(s => {
                    this.state.state.restoreTo(0, s);
                    this.paint(this.state.state.current);
                    this.updateVersion();
                    this.runtime.playerLoop = setInterval(loop, interval);
                    this.refresher.refreshRuntimeOnly(this.runtime);
                }, this.onTimeTravelError);
            } else {
                this.getInitialState().then(s => {
                    this.state.state.restoreTo(this.state.state.version, s);
                    this.updateVersion();
                    this.paint(this.state.state.current);
                    this.refresher.refreshPlayerAndDOM(this.state);
                    this.runtime.playerLoop = setInterval(loop, interval);
                    this.refresher.refreshRuntimeOnly(this.runtime);
                }, this.onTimeTravelError);
            }
        };
        this.onPause = () => {
            this.stopLoop();
            this.state.isPlaying = false;
            this.getInitialState().then(s => {
                this.state.state.next(s, this.playerActions);
                this.updateVersion();
                this.refresher.refreshPlayerAndDOM(this.state);
                this.paint(this.state.state.current);
            }, this.onTimeTravelError);
        };
        this.onNext = () => {
            this.stopLoop();
            this.updateVersion();
            if (this.state.isAtEnd) {
                return;
            }
            this.getInitialState().then(s => {
                this.state.state.next(s, this.playerActions);
                this.updateVersion();
                this.paint(this.state.state.current);
            }, this.onTimeTravelError);
        };
        this.onPrev = () => {
            this.stopLoop();
            if (this.state.isAtStart) {
                return;
            }
            this.getInitialState().then(s => {
                this.state.state.prev(s, this.playerActions);
                this.updateVersion();
                this.paint(this.state.state.current);
            }, this.onTimeTravelError);
        };
        this.onToBegin = () => {
            this.stopLoop();
            this.getInitialState().then(s => {
                this.state.state.restoreTo(0, s);
                this.updateVersion();
                this.paint(this.state.state.current);
            }, this.onTimeTravelError);
        };
        this.onToEnd = () => {
            if (this.runtime.playerLoop) {
                clearInterval(this.runtime.playerLoop);
                this.refresher.refreshRuntimeOnly(this.runtime);
            }
            this.getInitialState().then(s => {
                this.state.state.restoreTo(this.state.state.maxVersion, s);
                this.updateVersion();
                this.paint(this.state.state.current);
            }, this.onTimeTravelError);
        };
        this.onDownload = () => {
            const s = this.state.state.current;
            const dims = s.currentLayer.dimensions();
            const {viewbox} = s.createSVGParts(dims);
            const svg = s.renderSVG(dims, viewbox[0] / 4, viewbox[0] / 4);
            common_1.downloadFile(svg, 'GRID_GENERATOR_' + this.state.title + '.svg');
        };
        this.onRemix = () => {
            const initial = this.state.state.current;
            initial.resetUI();
            const fs = new data_1.FatState(initial);
            const newProj = new data_1.Project(data_1.State.revive(initial.toJSON()), data_1.ProjectAction.Fork, this.state.proj.license, fs);
            newProj.parentId = this.state.proj.id;
            newProj.id = null;
            newProj.title = this.state.title + ' Remix';
            this.refresher.refreshNewProject(newProj);
            this.exit();
        };
    }
    setInitialState(s) {
        this.runtime.setInitialState(s);
    }
    getInitialState() {
        return this.runtime.getInitialState();
    }
    stopLoop() {
        if (this.runtime.playerLoop) {
            clearInterval(this.runtime.playerLoop);
            this.runtime.playerLoop = null;
            this.state.isPlaying = false;
            this.refresher.refreshRuntimeOnly(this.runtime);
        }
    }
    updateVersion() {
        const v = this.state.state.version;
        let updateDOM = false;
        if (v === 0) {
            updateDOM = this.state.isAtStart !== true || this.state.isAtEnd;
            this.state.isAtStart = true;
            this.state.isAtEnd = false;
        } else if (v === this.state.state.maxVersion) {
            updateDOM = this.state.isAtEnd !== true || this.state.isAtStart;
            this.state.isAtEnd = true;
            this.state.isAtStart = false;
        } else {
            updateDOM = this.state.isAtEnd || this.state.isAtStart;
            this.state.isAtEnd = false;
            this.state.isAtStart = false;
        }
        this.refresher.refreshPlayerOnly(this.state);
        if (updateDOM) {
            this.refresher.refreshDOMOnly();
        }
    }
    onTimeTravelError(e) {
    }
    paint(s) {
        if (!this.runtime.playerImg || !this.runtime.playerCtx) {
            return;
        }
        const {svg, viewbox} = s.createSVG();
        this.state.currentViewBox = this.state.thumbnailSvgViewBox;
        const finalSVG = engine_1.PlayerCanvasPainter.SVGHEAD(svg, this.state.canvasWidth, this.state.canvasHeight, this.state.currentViewBox);
        this.runtime.playerImg.src = finalSVG;
    }
}
exports.PlayerEvents = PlayerEvents;
}
// default/dom/events/product_events.js
$fsx.f[185] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const movement_1 = $fsx.r(87);
class ProductEvents {
    constructor(rt, state, cart, net, refresher, proj) {
        this.runtime = rt;
        this.state = state;
        this.refresher = refresher;
        this.net = net;
        this.projects = proj;
        this.cart = cart;
        this.onChangeToTShirt = () => {
            this.cart.product.at = data_1.ProductAt.TShirt;
            this.cart.product.setPrice(this.cart.prices);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onChangeToPoster = () => {
            this.cart.product.at = data_1.ProductAt.Poster;
            this.cart.product.setPrice(this.cart.prices);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onArtSizeChange = e => {
            const t = e.target;
            if (t) {
                const value = parseFloat(t.value);
                if (!isNaN(value)) {
                    this.cart.product.artSize = value;
                    this.cart.product.zoom(value);
                    this.refresher.refreshCartOnly(this.cart);
                    this.refresher.refreshDOMOnly();
                }
            }
        };
        this.onPosterTypeChange = t => {
            this.cart.product.posterType = t;
            this.cart.product.setPrice(this.cart.prices);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onTShirtTypeChange = t => {
            this.cart.product.tshirtType = t;
            this.cart.product.setPrice(this.cart.prices);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onTShirtSizeChange = s => {
            this.cart.product.tshirtSize = s;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onTShirtColorChange = c => {
            this.cart.product.tshirtColor = c;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onViewCart = () => {
            this.cart.at = data_1.CartAt.InCart;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onCheckoutCart = () => {
            this.net.product.getCountryLst().then(v => {
                this.cart.at = data_1.CartAt.ShippingAddress;
                this.cart.address.countries = v.countries;
                this.refresher.refreshCartOnly(this.cart);
                this.refresher.refreshDOMOnly();
            }, fail => {
                console.log('COULD NOT GET COUNTRIES', fail);
            });
        };
        this.onChangeCountry = () => {
            const countryElem = document.getElementById('address-country');
            if (!countryElem) {
            } else {
                this.cart.address.country = countryElem.value;
                this.cart.address.states = null;
                for (let i = 0; i < this.cart.address.countries.length; i++) {
                    const c = this.cart.address.countries[i];
                    if (c.code === countryElem.value && c.states !== null) {
                        this.cart.address.states = c.states;
                    }
                }
                this.refresher.refreshCartOnly(this.cart);
                this.refresher.refreshDOMOnly();
            }
        };
        this.onShippingAddressDone = () => {
            const nameElem = document.getElementById('address-name');
            if (!nameElem) {
            } else {
                this.cart.address.name = nameElem.value;
            }
            const countryElem = document.getElementById('address-country');
            if (!countryElem) {
            } else {
                this.cart.address.country = countryElem.value;
            }
            const stateElem = document.getElementById('address-state');
            if (!stateElem) {
            } else {
                this.cart.address.state = stateElem.value;
            }
            const addressElem = document.getElementById('address-address');
            if (!addressElem) {
            } else {
                this.cart.address.address = addressElem.value;
            }
            const postalElem = document.getElementById('address-postal');
            if (!postalElem) {
            } else {
                this.cart.address.postalCode = postalElem.value;
            }
            const cityElem = document.getElementById('address-city');
            if (!cityElem) {
            } else {
                this.cart.address.city = cityElem.value;
            }
            this.cart.at = data_1.CartAt.Confirmation;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onConfirmationDone = () => {
            this.cart.at = data_1.CartAt.Confirmation;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onProductInit = () => {
            const art = this.state.current.createSVG();
            this.cart.product.withArt(art);
            this.cart.product.init();
            this.cart.product.setPrice(this.cart.prices);
            this.cart.at = data_1.CartAt.Product;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onMouseDown = e => {
            this.onDown(e.clientX, e.clientY);
            return;
        };
        this.onMouseUp = e => {
            this.onUp();
            return;
        };
        this.onMouseMove = e => {
            this.onMove(e.clientX, e.clientY);
            return;
        };
        this.onTouchStart = e => {
            const t = e.touches.item(0);
            if (t) {
                this.onDown(t.clientX, t.clientY);
            }
            return;
        };
        this.onTouchMove = e => {
            const t = e.touches.item(0);
            if (t) {
                this.onMove(t.clientX, t.clientY);
            }
            return;
        };
        this.onTouchEnd = e => {
            this.onUp();
            return;
        };
        this.onTouchCancel = e => {
            this.onUp();
            return;
        };
        this.onAddToCart = () => {
            this.cart.addToCart();
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onCartIncQty = index => {
            this.cart.incQty(index);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onCartDecQty = index => {
            this.cart.decQty(index);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
        this.onCartRemove = (index, e) => {
            e.preventDefault();
            this.cart.inside.splice(index, 1);
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        };
    }
    onPosterDown(x, y) {
        let posterArea = this.runtime.rects.posterArea;
        if (!posterArea) {
            posterArea = this.runtime.rects.posterAreaRect();
        }
        if (this.runtime.rects.isInside(x, y, posterArea)) {
            const detail = {
                startDeltaX: this.cart.product.posterDeltaX,
                startDeltaY: this.cart.product.posterDeltaY
            };
            if (this.runtime.movement) {
                this.runtime.movement.start(x, y);
                this.runtime.movement.setDetail(detail);
            } else {
                this.runtime.movement = new movement_1.Movement(x, y, true, detail);
            }
            this.refresher.refreshRuntimeOnly(this.runtime);
        }
    }
    onTShirtDown(x, y) {
        let tshirtArea = this.runtime.rects.tshirtArea;
        if (!tshirtArea) {
            tshirtArea = this.runtime.rects.tshirtAreaRect();
        }
        if (this.runtime.rects.isInside(x, y, tshirtArea)) {
            const detail = {
                startDeltaX: this.cart.product.tshirtDeltaX,
                startDeltaY: this.cart.product.tshirtDeltaY
            };
            if (this.runtime.movement) {
                this.runtime.movement.start(x, y);
                this.runtime.movement.setDetail(detail);
            } else {
                this.runtime.movement = new movement_1.Movement(x, y, true, detail);
            }
            this.refresher.refreshRuntimeOnly(this.runtime);
        }
    }
    onDown(x, y) {
        if (this.cart.at === data_1.CartAt.Product) {
            if (this.cart.product.at === data_1.ProductAt.TShirt) {
                this.onTShirtDown(x, y);
            } else {
                this.onPosterDown(x, y);
            }
        }
    }
    onPosterMove(deltaX, deltaY, d) {
        if (deltaX !== this.cart.product.posterDeltaX || deltaY !== this.cart.product.posterDeltaY) {
            this.cart.product.posterDeltaX = d.startDeltaX + deltaX;
            this.cart.product.posterDeltaY = d.startDeltaY + deltaY;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        }
    }
    onTShirtMove(deltaX, deltaY, d) {
        if (deltaX !== this.cart.product.tshirtDeltaX || deltaY !== this.cart.product.tshirtDeltaY) {
            this.cart.product.tshirtDeltaX = d.startDeltaX + deltaX;
            this.cart.product.tshirtDeltaY = d.startDeltaY + deltaY;
            this.refresher.refreshCartOnly(this.cart);
            this.refresher.refreshDOMOnly();
        }
    }
    onMove(x, y) {
        if (!this.runtime.movement || !this.runtime.movement.isMoving || !this.runtime.movement.detail) {
            return;
        }
        const deltaX = x - this.runtime.movement.startX;
        const deltaY = y - this.runtime.movement.startY;
        if (this.cart.product.at === data_1.ProductAt.TShirt) {
            this.onTShirtMove(deltaX, deltaY, this.runtime.movement.detail);
        } else {
            this.onPosterMove(deltaX, deltaY, this.runtime.movement.detail);
        }
    }
    onUp() {
        if (this.runtime.movement) {
            this.runtime.movement.end();
            this.refresher.refreshRuntimeOnly(this.runtime);
        }
    }
}
exports.ProductEvents = ProductEvents;
}
// default/dom/events/project_events.js
$fsx.f[186] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
class ProjectEvents {
    constructor(rt, s, net, p, refresher, resetScene) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.net = net;
        this.projects = p;
        this.resetScene = resetScene;
        this.refreshProjects = (projs, closeCurrent = false) => {
            this.projects.refreshProjects(projs);
            if (closeCurrent) {
                this.projects.closeCurrent();
            }
            this.refresher.refreshProjectsOnly(this.projects);
        };
        this.getProject = id => {
            return this.projects.get(id);
        };
        this.reviveNetProject = proj => {
            if (proj.initialState && proj.finalState && proj.fatState) {
                return this.parseInWorker(proj);
            }
            return Promise.reject(`Server returned an invalid project`);
        };
        this.reviveProject = id => {
            const storedProj = this.projects.get(id);
            if (storedProj) {
                return this.parseInWorker(storedProj);
            }
            return Promise.reject(`No such project ${ id }`);
        };
        this.beforeLogin = () => {
        };
        this.afterLogin = id => {
            return new Promise((resolve, reject) => {
            });
        };
        const workerCode = new Blob([`
		onmessage = function(e) {
			const { initialState, fatState, finalState } = e.data;
			const final = Object.assign({}, e.data, {
				initialState: JSON.parse(initialState),
				fatState: JSON.parse(fatState),
				finalState: JSON.parse(finalState)
			});
			self.postMessage(final);
		}
		`], { type: 'text/javascript' });
        this.reviverWorker = new Worker(window.URL.createObjectURL(workerCode));
    }
    parseInWorker(o) {
        const p = new Promise((resolve, reject) => {
            this.reviverWorker.onmessage = e => {
                const proj = data_1.Project.revive(e.data);
                if (proj.fatState) {
                    resolve(proj);
                } else {
                    reject('Could not parse Project State');
                }
            };
        });
        this.reviverWorker.postMessage(o);
        return p;
    }
}
exports.ProjectEvents = ProjectEvents;
}
// default/dom/events/publish_events.js
$fsx.f[187] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const engine_1 = $fsx.r(75);
class PublishEvents {
    constructor(rt, s, net, refresher, proj) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.net = net;
        this.projects = proj;
        this.onPublish = (data, e) => {
            const form = this.getFormValues();
            const desc = form.desc;
            let title = form.title;
            if (!title) {
                title = 'Untitled';
            }
            if (!this.runtime.token) {
                this.state.publishError('Please login first.');
                return;
            }
            const license = this.state.current.ui.publishEditor.license;
            this.projects.prepareToPublish(this.state.current, this.state, title, desc, license);
            this.state.publishStartLoading();
            this.refresher.refreshStateAndDOM(this.state);
            this.net.publish.publishProject(this.runtime.token, this.projects.current).then(response => {
                if (response.errors) {
                    this.state.publishError(engine_1.Net.graphqlErrorMsg(response));
                    this.refresher.refreshStateAndDOM(this.state);
                    console.log('GOT ERROR PUBLISH DATA', response);
                    return;
                } else {
                    console.log('GOT PUBLISHED DATA', response);
                    if (response.data) {
                        console.log('VALID', response.data);
                        this.projects = this.projects.publishCurrent(response.data.newWork.work);
                        this.state.publishSuccess();
                        this.refresher.refreshProjectsOnly(this.projects);
                        this.refresher.refreshStateAndDOM(this.state);
                    }
                }
            }, fail => {
                this.state.publishError(engine_1.Net.graphqlErrorMsg(fail));
                this.refresher.refreshStateAndDOM(this.state);
            });
        };
        this.onLicenseCC0 = e => {
            e.preventDefault();
            if (this.state.current.ui.publishEditor.license === 'CC0') {
                this.state.publishSetLicense('BY');
            } else {
                this.state.publishSetLicense('CC0');
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onLicenseCCBY = e => {
            e.preventDefault();
            if (this.state.current.ui.publishEditor.license !== 'CC0') {
                this.state.publishSetLicense('CC0');
            } else {
                this.state.publishSetLicense('BY');
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onLicenseCCSA = e => {
            e.preventDefault();
            let license = 'BY_SA';
            switch (this.state.current.ui.publishEditor.license) {
            case 'CC0':
            case 'BY':
                license = 'BY_SA';
                break;
            case 'BY_SA':
                license = 'BY';
                break;
            case 'BY_NC':
                license = 'BY_NC_SA';
                break;
            case 'BY_ND':
                license = 'BY_SA';
                break;
            case 'BY_NC_ND':
                license = 'BY_NC_SA';
                break;
            case 'BY_NC_SA':
                license = 'BY_NC';
                break;
            }
            this.state.publishSetLicense(license);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onLicenseCCNC = e => {
            e.preventDefault();
            let license = 'BY-NC';
            switch (this.state.current.ui.publishEditor.license) {
            case 'CC0':
            case 'BY':
                license = 'BY_NC';
                break;
            case 'BY_SA':
                license = 'BY_NC_SA';
                break;
            case 'BY_NC':
                license = 'BY';
                break;
            case 'BY_ND':
                license = 'BY_NC_ND';
                break;
            case 'BY_NC_ND':
                license = 'BY_ND';
                break;
            case 'BY_NC_SA':
                license = 'BY_SA';
                break;
            }
            this.state.publishSetLicense(license);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onLicenseCCND = e => {
            e.preventDefault();
            let license = 'BY-ND';
            switch (this.state.current.ui.publishEditor.license) {
            case 'CC0':
            case 'BY':
                license = 'BY_ND';
                break;
            case 'BY_SA':
                license = 'BY_ND';
                break;
            case 'BY_NC':
                license = 'BY_NC_ND';
                break;
            case 'BY_ND':
                license = 'BY';
                break;
            case 'BY_NC_ND':
                license = 'BY_NC';
                break;
            case 'BY_NC_SA':
                license = 'BY_NC_ND';
                break;
            }
            this.state.publishSetLicense(license);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.enterLicense = e => {
            e.preventDefault();
            const {title, desc} = this.getFormValues();
            this.state.publishEnterLicense(title, desc);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.exitLicense = () => {
            this.state.publishExitLicense();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onMouseDown = e => {
            return;
        };
        this.onMouseUp = e => {
            return;
        };
        this.onMouseMove = e => {
            return;
        };
        this.onTouchStart = e => {
            return;
        };
        this.onTouchMove = e => {
            return;
        };
        this.onTouchEnd = e => {
            return;
        };
        this.onTouchCancel = e => {
            return;
        };
    }
    getFormValues() {
        const titleElem = document.getElementById('publish-title');
        const descElem = document.getElementById('publish-desc');
        let title = null;
        let desc = null;
        if (titleElem && titleElem.value) {
            title = titleElem.value;
        }
        if (descElem && descElem.value) {
            desc = descElem.value;
        }
        return {
            title,
            desc
        };
    }
}
exports.PublishEvents = PublishEvents;
}
// default/dom/events/recorder_events.js
$fsx.f[188] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const engine_1 = $fsx.r(75);
class RecorderEvents {
    constructor(rt, s, refresher) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.restoreTo = v => {
            this.state.restoreTo(v);
            this.refresher.refreshStateAndDOM(this.state);
            this.canvasRefresh();
        };
    }
    canvasRefresh() {
        if (!this.runtime.colorPickerCtx) {
            throw new Error('Cannot restore&refresh canvas, color context is not present');
        }
        engine_1.ColorCanvasPainter.INIT(this.runtime.colorPickerCtx, this.state.current);
    }
}
exports.RecorderEvents = RecorderEvents;
}
// default/dom/events/scene_events.js
$fsx.f[189] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const cursor_1 = $fsx.r(22);
const engine_1 = $fsx.r(75);
const common_1 = $fsx.r(73);
var SceneAction;
(function (SceneAction) {
    SceneAction[SceneAction['Paint'] = 100] = 'Paint';
    SceneAction[SceneAction['Delete'] = 101] = 'Delete';
    SceneAction[SceneAction['DeleteFill'] = 102] = 'DeleteFill';
    SceneAction[SceneAction['Move'] = 103] = 'Move';
    SceneAction[SceneAction['Zoom'] = 104] = 'Zoom';
}(SceneAction || (SceneAction = {})));
class SceneEvents {
    constructor(rt, s, refresher) {
        this.curAction = null;
        this.runtime = rt;
        this._state = s;
        this.refresher = refresher;
        this.scene = null;
        this._sqrsPerLine = Math.ceil(this.runtime.width / s.current.viewport.unitSize);
        this.onWebGLInit = ctx => {
            engine_1.Runtime.setWebGLCtx(this.runtime, ctx, this._state.current.viewport.maxSize);
            return engine_1.Runtime.resetClipSpace(this.runtime, s.current).then(_rt => {
                this.refresher.refreshRuntimeOnly(_rt);
                this.paintersInit();
            }, error => console.error(error));
        };
        this.redraw = () => {
            this.refresher.refreshRuntimeOnly(this.runtime);
            if (!this.scene) {
                throw new Error('Cannot paint: no webgl scene present');
            }
            if (!this.runtime.textures) {
                throw new Error('Cannot paint: not runtime textures present');
            }
            this.scene.redraw(this.runtime.textures, this.runtime.clipSpace, this._state.current);
        };
        this.openCols = onDone => {
            if (!this.scene) {
                throw new Error('Trying to open columns without a created scene');
            }
            this.scene.openCols(this._state.current, onDone);
        };
        this.closeCols = onDone => {
            if (!this.scene) {
                throw new Error('Trying to close columns without a created scene');
            }
            this.scene.closeCols(this._state.current, onDone);
        };
        this.onRedraw = onDone => {
            if (!this.scene) {
                throw new Error('Trying to redraw scene without a created scene');
            }
            if (!this.runtime.textures) {
                throw new Error('Trying to redraw scene without textures');
            }
            this.scene.redraw(this.runtime.textures, this.runtime.clipSpace, this._state.current);
            if (onDone) {
                onDone();
            }
        };
        this.onTouchStart = e => {
            this.t1Start = e.touches.item(0);
            if (e.touches.length > 1) {
                this.t2Start = e.touches.item(1);
            } else if (e.touches.length === 1) {
                if (this._state.current.ui.currentTool === data_1.ToolsMenuId.Delete) {
                    this.curAction = SceneAction.Delete;
                }
            } else {
                this.t1Start = null;
                this.t2Start = null;
                return;
            }
        };
        this.onTouchMove = e => {
            e.preventDefault();
            const t1 = e.touches.item(0);
            if (!t1 || !this.t1Start) {
                return;
            }
            if (e.touches.length > 1) {
                const t2 = e.touches.item(1);
                if (!t2 || !this.t2Start) {
                    return;
                }
                const vx = t2.clientX - t1.clientX;
                const vy = t2.clientY - t1.clientY;
                const vlen = Math.hypot(vx, vy);
                const svx = this.t2Start.clientX - this.t1Start.clientX;
                const svy = this.t2Start.clientY - this.t1Start.clientY;
                const svlen = Math.hypot(svx, svy);
                const diffLen = vlen - svlen;
                const zoomMidX = t1.clientX + (t2.clientX - t1.clientX) / 2;
                const zoomMidY = t1.clientY + (t2.clientY - t1.clientY) / 2;
                this.curAction = SceneAction.Zoom;
                this.zoom(zoomMidX, t2.clientY, -1);
            } else {
                this.curAction = SceneAction.Move;
                this.move(t1.clientX, t1.clientY);
            }
        };
        this.onTouchEnd = e => {
            e.preventDefault();
            if (this.curAction !== SceneAction.Move && this.curAction !== SceneAction.Zoom && this.t1Start) {
                this.onGridAction(this.t1Start.clientX, this.t1Start.clientY);
            }
            this.stopAction();
        };
        this.onTouchCancel = e => {
            this.stopAction();
        };
        this.stopAction = () => {
            if (this.curAction === SceneAction.Zoom) {
                this._state.sceneStopZoom();
                this.refresher.refreshDOMOnly();
            }
            this.curAction = null;
            this.startMove = null;
            this.startZoom = null;
            this.t1Start = null;
            this.t2Start = null;
        };
        this.onMouseUp = e => {
            this.stopAction();
            this.updateMouseIcon(e.clientX, e.clientY);
        };
        this.onMouseDown = e => {
            if (this._state.current.ui.currentTool === data_1.ToolsMenuId.Delete) {
                this.curAction = SceneAction.Delete;
            } else if (this._state.current.ui.currentTool === data_1.ToolsMenuId.Move) {
                this.curAction = SceneAction.Move;
                this.move(e.clientX, e.clientY);
            } else if (this._state.current.ui.currentTool === data_1.ToolsMenuId.Zoom) {
                this.curAction = SceneAction.Zoom;
                this.zoom(e.clientX, e.clientY);
            }
            this.onGridAction(e.clientX, e.clientY);
        };
        this.onMouseMove = e => {
            if (e.buttons === 1 || e.buttons === undefined && e.which === 1) {
                if (this.curAction === SceneAction.Move) {
                    this.move(e.clientX, e.clientY);
                } else if (this.curAction === SceneAction.Zoom) {
                    this.zoom(e.clientX, e.clientY);
                } else {
                    this.onGridAction(e.clientX, e.clientY);
                }
            } else {
                this.onCursorMove(e.clientX, e.clientY);
            }
        };
        this.onGridAction = (screenX, screenY) => {
            const view = this._state.current.viewport;
            this.updateCursor(screenX, screenY, view);
            const cursor = this._state.current.currentLayer.cursor;
            const layerX = cursor[0];
            const layerY = cursor[1];
            const grid = this._state.current.currentLayer;
            const shapeId = grid.selectedShape;
            const shapeFillId = this._state.current.selectedShape.selectedFillSet;
            const rot = grid.getShapeRotation(shapeId);
            const layerElem = grid.getElementAt(layerX, layerY);
            const isElemDiff = !layerElem || layerElem.shapeId !== shapeId || layerElem.fillSetId !== shapeFillId || layerElem.rotation !== rot;
            const isElemEq = layerElem && layerElem.shapeId === shapeId && layerElem.fillSetId === shapeFillId && layerElem.rotation === rot;
            if (isElemDiff && (this.curAction === null || this.curAction === SceneAction.Paint)) {
                this.paintAt(screenX, screenY, layerX, layerY, shapeId, shapeFillId, rot);
            } else if (isElemEq && this.curAction === null) {
                this.rotateAt(screenX, screenY, layerX, layerY, shapeId, shapeFillId);
            } else if (this.curAction === SceneAction.Delete) {
                this.curAction = SceneAction.Delete;
                this.deleteAt(screenX, screenY, layerX, layerY, shapeId, shapeFillId);
            } else {
            }
        };
        this.onZoomIn = e => {
            e.preventDefault();
            this.clickZoom(1);
        };
        this.onZoomOut = e => {
            e.preventDefault();
            this.clickZoom(-1);
        };
        this.onCursorMove = (absX, absY) => {
            if (!this.scene) {
                return;
            }
            const view = this._state.current.viewport;
            const updated = this.updateCursor(absX, absY, view);
            if (updated) {
                const sqIndex = engine_1.ClipSpace.gridIndex(absX, absY, view, this.runtime.width);
                this.scene.cursorMove(sqIndex);
                this.updateMouseIcon(absX, absY);
            }
        };
        this.reset = () => {
            if (this.scene && this.runtime.textures) {
                this.scene.redraw(this.runtime.textures, this.runtime.clipSpace, this.state.current);
            } else {
                this.paintersInit();
            }
        };
        this.onGridToggle = e => {
            e.preventDefault();
            this.state.sceneToggleGrid();
            if (this.scene) {
                this.scene.gridLines(this.state.current.ui.toolsSubmenus.isGridVisible);
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
    }
    get state() {
        return this._state;
    }
    set state(s) {
        this._state = s;
        if (this.scene) {
            this.scene.state = s.current;
        }
    }
    updateMouseIcon(absX, absY) {
        const view = this._state.current.viewport;
        const grid = this._state.current.currentLayer;
        const shapeId = grid.selectedShape;
        const shapeFillId = this._state.current.selectedShape.selectedFillSet;
        const rot = grid.getShapeRotation(shapeId);
        const x = view.squareLayerX() + view.squareX(absX);
        const y = view.squareLayerY() + view.squareY(absY);
        const layerElem = grid.getElementAt(x, y);
        const isElemDiff = !layerElem || layerElem.shapeId !== shapeId || layerElem.fillSetId !== shapeFillId || layerElem.rotation !== rot;
        const isElemEq = layerElem && layerElem.shapeId === shapeId && layerElem.fillSetId === shapeFillId && layerElem.rotation === rot;
        const toolId = this._state.current.ui.currentTool;
        const canRotate = toolId !== data_1.ToolsMenuId.Move && toolId !== data_1.ToolsMenuId.Delete && toolId !== data_1.ToolsMenuId.Zoom;
        if (isElemEq && canRotate) {
            if (this._state.current.ui.cursorHandler.cursor !== cursor_1.UICursor.Rotate) {
                this._state.hudMouseCursorRotate();
                this.refresher.refreshStateAndDOM(this._state);
            }
        } else {
            const ui = this._state.current.ui;
            if (ui.cursorHandler.cursor !== ui.currentToolMouseIcon()) {
                this._state.hudMouseCursorFromTool();
                this.refresher.refreshStateAndDOM(this._state);
            }
        }
    }
    updateCursor(screenX, screenY, view) {
        const needsCursorUpdate = this._state.current.currentLayer.isCursorUpdateNeeded(screenX, screenY, view);
        if (needsCursorUpdate) {
            this._state.sceneCursor(screenX, screenY);
        }
        return needsCursorUpdate;
    }
    paintersInit() {
        if (!this.runtime.webglCtx || !this.runtime.textures) {
            return;
        }
        if (this.scene) {
        }
        this.scene = new engine_1.ScenePainter(this.runtime.webglCtx, this._state.current, this.runtime.textures, this.runtime.clipSpace);
        this.scene.init();
    }
    paintAt(x, y, layerX, layerY, shapeId, shapeFillId, rot) {
        this.curAction = SceneAction.Paint;
        this._state.scenePaint(layerX, layerY);
        const sqIndex = engine_1.ClipSpace.gridIndex(x, y, this._state.current.viewport, this.runtime.width);
        if (!this.runtime.textures) {
            throw new Error('Cannot paint: not runtime textures present');
        }
        if (this.state.current.currentLayer.pattern) {
            this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, this.state.current.isPatternOn);
            this.redraw();
            this.refresher.refreshRuntimeOnly(this.runtime);
        } else {
            this.runtime.clipSpace.paintAt(sqIndex, shapeId, shapeFillId, rot, this.runtime.textures);
            this.redraw();
        }
    }
    rotateAt(x, y, layerX, layerY, shapeId, shapeFillId) {
        this._state.hudRotateShape();
        this.refresher.refreshStateAndDOM(this.state);
        const grid = this._state.current.currentLayer;
        this.paintAt(x, y, layerX, layerY, shapeId, shapeFillId, grid.getShapeRotation(shapeId));
    }
    deleteAt(x, y, layerX, layerY, shapeId, shapeFillId) {
        this._state.sceneDelete(layerX, layerY);
        const sqIndex = engine_1.ClipSpace.gridIndex(x, y, this._state.current.viewport, this.runtime.width);
        if (!this.runtime.textures) {
            throw new Error('Cannot delete: not runtime textures present');
        }
        if (this.state.current.currentLayer.pattern) {
            this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, this.state.current.isPatternOn);
            this.redraw();
            this.refresher.refreshRuntimeOnly(this.runtime);
        } else {
            this.runtime.clipSpace.deleteAt(sqIndex, shapeId, shapeFillId, this.runtime.textures);
            this.redraw();
        }
    }
    move(x, y) {
        if (!this.startMove) {
            this.startMove = new data_1.Vector2D(x, y);
            return;
        }
        if (this.scene) {
            this.scene.hideCursor();
        }
        this._state.sceneMove(x - this.startMove.x, y - this.startMove.y);
        if (this._state.current.isPatternOn) {
            this.refresher.refreshStateAndDOM(this._state, common_1.UpdateAction.Pan);
            if (!this.runtime.textures) {
                return;
            }
            this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, this.state.current.isPatternOn);
            this.redraw();
        } else {
            this.refresher.refreshStateOnly(this._state);
            engine_1.Runtime.resetClipSpace(this.runtime, this._state.current, true).then(_rt => {
                this.runtime = _rt;
                this.refresher.refreshRuntimeOnly(_rt);
                this.redraw();
            });
        }
        this.startMove = new data_1.Vector2D(x, y);
    }
    clickZoom(mult) {
        let midX = this.runtime.device.width / 2;
        let midY = this.runtime.device.height / 2;
        const v = this._state.current.viewport;
        if (!this.state.current.ui.isZooming) {
            this.startZoom = new data_1.Vector2D(midX, midY);
            this.pointZoom = new data_1.Vector2D(v.x + midX, v.y + midY);
            this.viewportZoom = new data_1.Vector2D(v.x, v.y);
            this.startZoomSize = v.unitSize;
            this.state.sceneStartZoom();
            this.refresher.refreshStateOnly(this.state);
        } else if (this.startZoom) {
            midX = this.startZoom.x;
            midY = this.startZoom.y;
        }
        let inc = 8;
        const normalSize = this.startZoomSize || 64;
        if (v.unitSize > normalSize) {
            inc = inc * (v.unitSize / normalSize);
        }
        let zoomAmmount = 0;
        if (mult < 0) {
            zoomAmmount = -inc * 2;
        } else {
            zoomAmmount = inc * 2;
        }
        this.zoom(midX - zoomAmmount, midY - zoomAmmount);
    }
    zoom(x, y, mult = 1) {
        const v = this._state.current.viewport;
        const l = this._state.current.currentLayer;
        const w = this.runtime.width;
        const h = this.runtime.height;
        if (!this.startZoom || !this.state.current.ui.isZooming) {
            this.startZoom = new data_1.Vector2D(x, y);
            this.pointZoom = new data_1.Vector2D(v.x + x, v.y + y);
            this.viewportZoom = new data_1.Vector2D(v.x, v.y);
            this.state.sceneStartZoom();
            this.refresher.refreshStateOnly(this.state);
            return;
        }
        if (!this.viewportZoom || !this.startZoom || !this.pointZoom) {
            return;
        }
        const ammount = mult * (y - this.startZoom.y);
        if (ammount > 0 && v.unitSize - ammount < v.minSize) {
            return;
        } else if (ammount < 0 && v.unitSize + Math.abs(ammount) > v.maxSize) {
            return;
        }
        const px = this.pointZoom.x;
        const py = this.pointZoom.y;
        const cx = v.x + w / 2;
        const cy = v.y + h / 2;
        const ovx = this.viewportZoom.x;
        const ovy = this.viewportZoom.y;
        this._state.sceneZoom(px, py, -ammount, cx, cy, ovx, ovy);
        this.refresher.refreshStateOnly(this._state);
        this.startZoom = new data_1.Vector2D(x, y);
        if (this.state.current.currentLayer.pattern && this.runtime.textures) {
            this.runtime.clipSpace.fromGrid(this.state.current.viewport, this.state.current.currentLayer, this.runtime.textures, this.state.current.isPatternOn);
            this.redraw();
            this.refresher.refreshAll(this.runtime, this._state);
        } else {
            engine_1.Runtime.resetClipSpace(this.runtime, this._state.current, true).then(_rt => {
                this.refresher.refreshAll(_rt, this._state);
                this.redraw();
            });
        }
    }
    get _scene() {
        return this.scene;
    }
}
exports.SceneEvents = SceneEvents;
}
// default/dom/events/shape_editor_events.js
$fsx.f[190] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
const data_1 = $fsx.r(1);
const engine_1 = $fsx.r(75);
class ShapeEditorEvents {
    constructor(rt, s, refresher) {
        this.runtime = rt;
        this.state = s;
        this.refresher = refresher;
        this.onShapeMount = () => {
            this.runtime.rects.shapeEditorRect();
            this.refresher.refreshRuntimeOnly(this.runtime);
        };
        this.onMouseDown = e => {
        };
        this.onMouseUp = e => {
        };
        this.onMouseMove = e => {
        };
        this.onTouchStart = e => {
            const curMode = this.state.current.ui.shapeEditor.editorMode;
            if (curMode === data_1.UIShapeEditorMode.Shape) {
                const touch = e.touches.item(0);
                if (touch) {
                    const x = touch.clientX;
                    const y = touch.clientY;
                    if (!this.runtime.movement) {
                        this.runtime.movement = new engine_1.Movement(x, y, true);
                    } else {
                        this.runtime.movement.start(x, y);
                    }
                    this.refresher.refreshRuntimeOnly(this.runtime);
                }
            } else {
                this.runtime.movement = null;
                this.refresher.refreshRuntimeOnly(this.runtime);
            }
        };
        this.onTouchMove = e => {
        };
        this.onTouchEnd = e => {
            const rect = this.runtime.rects.shapeEditor;
            if (!rect) {
                throw new Error('Unable to handle mousedown in shape: no shape client rect');
            }
            if (this.runtime.movement) {
                const x = this.runtime.movement.startX;
                const y = this.runtime.movement.startY;
                if (!this.runtime.rects.isInside(x, y, rect) && e.touches.length <= 1) {
                    return true;
                }
                const xparam = (x - rect.left) / rect.width;
                const yparam = (y - rect.top) / rect.height;
                const templateRes = this.state.current.shapes.editor.template.resolution;
                const pt = this.state.current.nearestActivePt(xparam * templateRes, yparam * templateRes);
                if (pt) {
                    this.onPointAction({
                        x: pt.x,
                        y: pt.y,
                        isOtherEdge: this.state.current.isOtherEdge(pt.x, pt.y),
                        isCurrentEdge: this.state.current.isCurrentEdge(pt.x, pt.y)
                    });
                }
                this.runtime.movement.end();
                this.refresher.refreshRuntimeOnly(this.runtime);
                return true;
            } else {
                return true;
            }
        };
        this.onTouchCancel = e => {
        };
        this.onPointAction = e => {
            const pt = new data_1.Vector2D(e.x, e.y);
            if (e.isOtherEdge) {
                const rndSat = Math.random() * 0.45 + 0.4;
                const rndLight = Math.random() * 0.45 + 0.4;
                const colors = [data_1.RGBColor.randomHering(rndSat, rndLight, Math.random())];
                const fillId = this.state.current.newFillIds(this.runtime.rnd, 1);
                this.state.shapeClose(pt, colors, fillId);
            } else {
                this.state.shapePointAction(pt);
            }
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onReverseTo = actionIndex => {
            this.state.shapeReverseTo(actionIndex);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onSolveAmbiguity = index => {
            this.state.shapeSolveAmbiguity(index);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFigureSelect = data => {
            this.state.shapeSelectFigure(data.d);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFigureDelete = () => {
            this.state.shapeDeleteFigure();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFigureEdit = () => {
            this.state.shapeEditFigure();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFigureFill = () => {
            this.state.shapeFillFigure();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onEnterTemplateSelector = () => {
            this.state.shapeEnterTemplateSelector();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onTemplateSelect = tid => {
            this.state.shapeSelectTemplate(tid);
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onExitTemplateSelector = () => {
            this.state.shapeExitTemplateSelector();
            this.refresher.refreshStateAndDOM(this.state);
        };
        this.onFigureFillDone = () => {
            this.state.shapeFillDone();
            this.refresher.refreshStateAndDOM(this.state);
        };
    }
}
exports.ShapeEditorEvents = ShapeEditorEvents;
}
// default/dom/debug.js
$fsx.f[191] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Debug {
    constructor(enabled, rt, events, state) {
        this.updateNumber = 0;
        this.enabled = enabled;
        this.runtime = rt;
        this.events = events;
        this.fat = state;
        const nop = () => {
            return;
        };
        if (!enabled) {
            this.render = nop;
            this.showTextures = nop;
            return;
        }
        this.showTextures = () => {
            console.log(`%c TEXTURES`, 'background: blue; color: white; display: block;');
            const scene = this.events.sceneEvents._scene;
            if (!scene) {
                console.log('No textures available');
                return;
            }
            const shader = scene.shader;
            console.log({});
        };
        this.render = () => {
            if (this.enabled) {
                this.updateNumber++;
                console.log(`%c RENDER ${ this.updateNumber }`, 'background: green; color: white; display: block;');
                return this.updateNumber;
            }
        };
        this.initKeys();
    }
    initKeys() {
    }
}
exports.Debug = Debug;
}
// default/dom/components/meander.jsx
$fsx.f[192] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const main_menu_1 = $fsx.r(193);
const about_1 = $fsx.r(194);
const collective_1 = $fsx.r(200);
const login_1 = $fsx.r(201);
const pricing_1 = $fsx.r(203);
const profile_1 = $fsx.r(208);
const project_view_1 = $fsx.r(214);
const recover_1 = $fsx.r(223);
const verify_1 = $fsx.r(224);
function selectCourse(props) {
    const sectionCx = 'overflow-auto h-100 tc';
    const textCx = 'f6 fs-normal';
    const titleCx = 'mt2 mb0 baskerville i fw1 f1';
    const subtitleCx = 'mt3 mb0 f6 fw4 ttu tracked';
    const defaultProps = {
        sectionClassName: sectionCx,
        textClassName: textCx,
        titleClassName: titleCx,
        subtitleClassName: subtitleCx,
        onExit: props.events.gotoRoot
    };
    switch (props.meander.course) {
    case data_1.MeanderCourse.Profile:
        const about = props.meander.profile.about || '';
        if (props.meander.profile.id && props.meander.profile.name && props.meander.profile.created) {
            return normalizeProps(createComponentVNode(2, profile_1.ProfileSection, Object.assign({}, defaultProps, {
                'menu': props.meander.profile.menu,
                'profile': props.meander.profile,
                'profileId': props.meander.profile.id,
                'badges': props.meander.profile.badges,
                'profileAbout': about,
                'profileName': props.meander.profile.name,
                'profileCreated': props.meander.profile.created,
                'profileForm': props.meander.profile.form,
                'onProfileUpdate': props.events.onProfileUpdate,
                'profileIsLoading': props.meander.profile.loadingStatus === data_1.ProfileStatus.Loading,
                'profileHasError': props.meander.profile.loadingStatus === data_1.ProfileStatus.Error,
                'profileLoadingMsg': props.meander.profile.loadingStatusMsg,
                'onMenuAction': props.events.onProfileSubmenuAction,
                'projects': props.projects,
                'isLoading': props.meander.profile.loadingStatus === data_1.ProfileStatus.Loading,
                'currentProject': props.currentProject,
                'onProjectView': props.events.onProjectView,
                'onProjectNew': props.events.onProjectNew,
                'title': props.meander.profile.name || 'Profile'
            })));
        }
        break;
    case data_1.MeanderCourse.Pricing:
        return normalizeProps(createComponentVNode(2, pricing_1.MeanderPricing, Object.assign({}, defaultProps)));
    case data_1.MeanderCourse.Collective:
        return normalizeProps(createComponentVNode(2, collective_1.MeanderCollective, Object.assign({}, defaultProps, { 'collective': props.meander.collective })));
    case data_1.MeanderCourse.About:
        return normalizeProps(createComponentVNode(2, about_1.MeanderAbout, Object.assign({}, defaultProps, {
            'menu': props.meander.about.menu,
            'onMenuAction': props.events.onAboutSubmenuAction
        })));
    case data_1.MeanderCourse.Verify:
        return createComponentVNode(2, verify_1.MeanderVerify, {
            'onExit': props.events.gotoRoot,
            'state': props.meander.verify.state,
            'user': props.meander.verify.user
        });
    case data_1.MeanderCourse.Login:
        return createComponentVNode(2, login_1.MeanderLogin, {
            'onExit': props.events.gotoRoot,
            'onLogin': props.events.loginEmail,
            'onRegister': props.events.registerEmail,
            'isLoading': props.meander.login.isLoading,
            'errorMsg': props.meander.login.error,
            'successMsg': props.meander.login.success,
            'successTitle': props.meander.login.successTitle,
            'successEmail': props.meander.login.successEmail,
            'showRecoverPw': props.meander.login.showRecover,
            'onRecover': props.events.recover
        });
    case data_1.MeanderCourse.Recover:
        return createComponentVNode(2, recover_1.MeanderRecover, {
            'onRecover': props.events.resetPassword,
            'isLoading': props.meander.recover.isLoading,
            'errorMsg': props.meander.recover.error,
            'onExit': props.events.gotoLogin
        });
    case data_1.MeanderCourse.ViewProject:
        return normalizeProps(createComponentVNode(2, project_view_1.ProjectView, Object.assign({}, defaultProps, {
            'project': props.meander.view.project,
            'playerState': props.playerState,
            'playerEvents': props.playerEvents
        })));
    }
    return createVNode(1, 'div');
}
exports.MeanderFull = props => {
    const mainMenuProps = {
        menu: props.menu,
        userId: props.userId,
        onAction: props.events.onMenuAction,
        className: `fixed bottom-0 left-0 w-100 transition-bg ${ props.meander.course !== data_1.MeanderCourse.Project ? 'bt pt3 b--light-gray bg-white' : 'bg-transparent' }`
    };
    return createVNode(1, 'div', `MeanderFull fixed sans-serif transition-transform
				${ props.isMenuHidden ? 'translate-y-3 ' : ' ' }
				${ props.className || '' }`, [
        props.meander.course === data_1.MeanderCourse.Project ? createVNode(1, 'div') : createVNode(1, 'div', 'children', selectCourse(props), 0, { 'style': { height: `${ props.height }px` } }),
        normalizeProps(createComponentVNode(2, main_menu_1.MainMenu, Object.assign({}, mainMenuProps)))
    ], 0);
};
}
// default/dom/components/hud/main_menu.jsx
$fsx.f[193] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var normalizeProps = Inferno.normalizeProps;
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
const data_1 = $fsx.r(1);
const common_1 = $fsx.r(73);
const noPropagation = common_1.justClick;
exports.MainMenu = props => createVNode(1, 'nav', `MainMenu ${ props.className || '' } flex items-center justify-center`, props.menu.map((_id, e, isSelected) => {
    let id = _id;
    let label = e.label;
    if (id === data_1.MainMenuId.Profile && props.userId === null) {
        label = 'Login';
        id = 'login';
    }
    return normalizeProps(createVNode(1, 'a', `f7 no-underline black ttu sans-serif dib ph2 pb4 pt1 pointer top-bar ${ isSelected ? 'top-bar-selected' : '' }`, label, 0, Object.assign({}, noPropagation, {
        'onClick': inferno_1.linkEvent(id, props.onAction),
        'href': `/${ id }`
    }), `mainmenu-${ id }`));
}), 8);
}
// default/dom/components/meander/about.jsx
$fsx.f[194] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const about_contact_1 = $fsx.r(195);
const about_gridgenerator_1 = $fsx.r(197);
const menu_1 = $fsx.r(198);
const wrapper_1 = $fsx.r(199);
function MeanderAbout(props) {
    const mainCx = '';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderAbout',
        'title': 'About',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'h-100 ttn mw7 center bl br b--light-gray bg-meander pb5', [
            createComponentVNode(2, menu_1.MeanderMenu, {
                'menu': props.menu,
                'onAction': props.onMenuAction
            }),
            props.menu.selected === data_1.AboutMenuId.GridGenerator ? createComponentVNode(2, about_gridgenerator_1.AboutGridGenerator, {
                'className': props.sectionClassName,
                'titleClassName': props.titleClassName,
                'subtitleClassName': props.subtitleClassName
            }) : createComponentVNode(2, about_contact_1.AboutContact, {
                'className': props.sectionClassName,
                'titleClassName': props.titleClassName,
                'subtitleClassName': props.subtitleClassName,
                'textClassName': props.textClassName
            })
        ], 0, { 'onClick': e => e.stopImmediatePropagation() })
    });
}
exports.MeanderAbout = MeanderAbout;
}
// default/dom/components/meander/about_contact.jsx
$fsx.f[195] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
const social_insta_svg_1 = $fsx.r(196);
const social_twitter_svg_1 = $fsx.r(153);
exports.AboutContact = props => createVNode(1, 'address', `AboutContact user-select ${ props.className }`, [
    createVNode(1, 'h1', props.titleClassName, createTextVNode('Connect with Grid Generator'), 2),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Social Networks'), 2),
    createVNode(1, 'div', 'contact-social mt2 flex-column items-center justify-center', [
        createVNode(1, 'a', null, createVNode(1, 'img', 'w2 h2 ma2', null, 1, {
            'src': social_twitter_svg_1.default,
            'alt': 'twitter'
        }), 2, {
            'href': 'https://twitter.com/grid_generator',
            'target': '_blank'
        }),
        createVNode(1, 'a', null, createVNode(1, 'img', 'w2 h2 ma2', null, 1, {
            'src': social_insta_svg_1.default,
            'alt': 'instagram'
        }), 2, {
            'href': 'https://www.instagram.com/gridgenerator/',
            'target': '_blank'
        })
    ], 4),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Customer Support'), 2),
    createVNode(1, 'p', props.textClassName, [
        createTextVNode('Contact for all support requests '),
        createVNode(1, 'a', 'link pointer', createTextVNode('here'), 2, { 'href': 'mailto:support@gridgenerator.com' })
    ], 4),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Press Inquiries'), 2),
    createVNode(1, 'p', props.textClassName, [
        createTextVNode('Contact for press and media questions '),
        createVNode(1, 'a', 'link pointer', createTextVNode('here'), 2, { 'href': 'mailto:press@gridgenerator.com' })
    ], 4),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('General'), 2),
    createVNode(1, 'p', props.textClassName, [
        createTextVNode('Can\u2019t find the right category above ? Get in touch '),
        createVNode(1, 'a', 'link pointer', createTextVNode('here'), 2, { 'href': 'mailto:contact@gridgenerator.com' })
    ], 4),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Address'), 2),
    createVNode(1, 'p', props.textClassName, [
        createTextVNode('Started in '),
        createVNode(1, 'a', 'link pointer', createTextVNode('Alenquer '), 2, { 'href': 'https://pt.wikipedia.org/wiki/Alenquer_(Portugal)' }),
        createTextVNode(' I now spend most of my days in Lisbon. You can visit me at:')
    ], 4),
    createVNode(1, 'p', props.textClassName, createTextVNode('Rua Heróis de Quionga, n.25 r/c esq., 1170-178 Lisbon. '), 2)
], 4);
}
// default/assets/icons/social-insta.svg
$fsx.f[196] = function(module,exports){
module.exports.default = '/assets/1ef7a5cb-social-insta.svg';
}
// default/dom/components/meander/about_gridgenerator.jsx
$fsx.f[197] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createVNode = Inferno.createVNode;
exports.AboutGridGenerator = props => createVNode(1, 'section', `AboutGridGenerator user-select ${ props.className }`, [
    createVNode(1, 'h1', props.titleClassName, createTextVNode('Grid Generator'), 2),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('The idea'), 2),
    createVNode(1, 'div', 'flex flex-column items-center justify-center', [
        createVNode(1, 'p', 'f6 pa3 measure lh-copy tj', [
            createTextVNode('The idea was born in 2014 from the concept of mixing and remixing art. Initially it started with sounds but rapidly evolved to another kind of tool. A painting tool made for the internet. In 2016 I quit my job and started to work on what would become Grid Generator. Back then it was still a rough tool to remix sounds with colors and simple visual forms. After going on and off about it I decided to apply to a startup grant from the Portuguese government in 2017. The grant is named '),
            createVNode(1, 'a', 'link', createTextVNode('StartUp Voucher'), 2, {
                'target': '_blank',
                'href': 'https://www.iapmei.pt/PRODUTOS-E-SERVICOS/Empreendedorismo-Inovacao/Empreendedorismo/Apoios-e-Incentivos/Startup-Voucher.aspx'
            }),
            createTextVNode(', and it consists in a small monthly fee to help new ideas mature and become new companies. I applied to it with the idea of developing a tool to draw patterns with grids and shapes. That was when Grid Generator started evolving into what it is today.')
        ], 4),
        createVNode(1, 'p', 'f6 pa3 measure lh-copy tj', [
            createTextVNode('For a more personal touch on the inspiration behind Grid Generator checkout '),
            createVNode(1, 'a', 'link', createTextVNode('this post '), 2, {
                'target': '_blank',
                'href': 'http://www.hugodaniel.pt/posts/2017-10-25-Lisbon-as-an-inspiration-for-my-project.html'
            }),
            createTextVNode(' I wrote about it before WebSummit 2017.')
        ], 4)
    ], 4)
], 4);
}
// default/dom/components/meander/menu.jsx
$fsx.f[198] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
exports.MeanderMenu = props => {
    return createVNode(1, 'header', 'bg-meander black-80 tc pt0 avenir', createVNode(1, 'nav', 'f6 f5-l bb b--light-gray tc mw7 center', props.menu.map((key, entry, isSelected) => createVNode(1, 'a', `f6 f5-l link pointer bg-animate black-80 ${ isSelected ? 'b' : '' } hover-bg-${ entry.iconUrl } dib pa3 ph4-l`, entry.label, 0, { 'onClick': inferno_1.linkEvent(key, props.onAction) })), 0), 2);
};
}
// default/dom/components/meander/wrapper.jsx
$fsx.f[199] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const new_close_1 = $fsx.r(107);
function MeanderWrapper(props) {
    return createVNode(1, 'section', `wrapper h-100 ${ props.className || '' }`, [
        createVNode(1, 'header', 'flex items-center justify-center absolute top-0 w-100 h3 bg-white bb b--light-gray', [
            createVNode(1, 'h1', 'mt3 pt2 f3 f2-ns tc-ns title truncate', props.title, 0),
            createComponentVNode(2, new_close_1.NewCloseBtn, {
                'className': 'absolute right-2 right-3-ns top-1 flex items-center justify-center w2 h2',
                'big': false,
                'rotated': true,
                'onAction': props.onExit
            })
        ], 4),
        createVNode(1, 'div', 'pt5 h-100 pb5', props.children, 0, { 'onClick': props.onExit })
    ], 4);
}
exports.MeanderWrapper = MeanderWrapper;
}
// default/dom/components/meander/collective.jsx
$fsx.f[200] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const wrapper_1 = $fsx.r(199);
function MeanderCollective(props) {
    const mainCx = '';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderCollective',
        'title': 'Collective',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'flex flex-column items-center justify-center w-100 h-100', [
            createVNode(1, 'p', 'f5 ttu center', createTextVNode('Nothing here yet'), 2),
            createVNode(1, 'p', null, createTextVNode(':\'('), 2)
        ], 4)
    });
}
exports.MeanderCollective = MeanderCollective;
}
// default/dom/components/meander/login.jsx
$fsx.f[201] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const google_svg_1 = $fsx.r(202);
const buttons_1 = $fsx.r(106);
const wrapper_1 = $fsx.r(199);
function MeanderLogin(props) {
    const inputcx = 'input-reset f6 ba b--black-20 br1 pa2 mb2 db w-100';
    const scx = 'f7 mv2 lh-copy db';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderLogin',
        'title': 'Login',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'w-100 h-100 flex items-center justify-center', props.successEmail ? createVNode(1, 'div', 'w5 h4 pa3 ba br2 b--gray bg-white', [
            createVNode(1, 'h2', 'f5', props.successTitle, 0),
            createVNode(1, 'small', `green ${ scx }`, props.successMsg, 0),
            createVNode(1, 'small', 'db f7 pa0 ma0', createTextVNode('Please check your e-mail to proceed'), 2)
        ], 4) : createVNode(1, 'div', 'w5 pa3 ba br2 b--gray bg-white', [
            createVNode(1, 'form', 'w-100', createVNode(1, 'fieldset', 'bn pa0', [
                createVNode(64, 'input', inputcx, null, 1, {
                    'type': 'email',
                    'placeholder': 'e-mail',
                    'name': 'login-u',
                    'id': 'login-u',
                    'required': true,
                    'disabled': props.isLoading
                }),
                createVNode(64, 'input', inputcx, null, 1, {
                    'minLength': 8,
                    'type': 'password',
                    'placeholder': 'password',
                    'name': 'login-p',
                    'id': 'login-p',
                    'required': true,
                    'disabled': props.isLoading
                }),
                createVNode(1, 'div', 'flex justify-between', [
                    createComponentVNode(2, buttons_1.Button, {
                        'disabled': props.isLoading,
                        'bg': 'dark-blue',
                        'label': 'login',
                        'onAction': props.onLogin
                    }),
                    createComponentVNode(2, buttons_1.Button, {
                        'disabled': props.isLoading,
                        'label': 'register',
                        'onAction': props.onRegister
                    })
                ], 4),
                props.isLoading ? createVNode(1, 'small', `gray ${ scx }`, createTextVNode('Loading'), 2, { 'id': 'login-loading' }) : props.errorMsg ? createVNode(1, 'small', `red ${ scx }`, props.errorMsg ? props.errorMsg : ' ', 0, { 'id': 'password-desc' }) : createVNode(1, 'small', `green ${ scx }`, props.successMsg ? props.successMsg : ' ', 0, { 'id': 'password-desc' })
            ], 0), 2, {
                'noValidate': true,
                'id': 'login-form'
            }),
            props.showRecoverPw ? createVNode(1, 'div', 'recover', createVNode(1, 'a', 'f7 gray link', createTextVNode('Forgot your password ?'), 2, {
                'href': '/recover',
                'onClick': props.onRecover
            }), 2) : createVNode(1, 'div', 'social', [
                createVNode(1, 'p', 'f7 tc ttu gray', createTextVNode('or'), 2),
                createVNode(1, 'a', 'f4 fw6 black link dim', createVNode(1, 'div', 'b--black-10 pa2 link f7 br1 transition-o ba pointer near-white dim o-100 flex items-center justify-between', [
                    createVNode(1, 'img', 'w1 h1', null, 1, {
                        'src': google_svg_1.default,
                        'alt': 'google icon'
                    }),
                    createVNode(1, 'span', 'black', createTextVNode('Login with Google'), 2)
                ], 4), 2, { 'href': '/auth/google' })
            ], 4)
        ], 0), 0, { 'onClick': e => e.stopImmediatePropagation() })
    });
}
exports.MeanderLogin = MeanderLogin;
}
// default/assets/icons/google.svg
$fsx.f[202] = function(module,exports){
module.exports.default = '/assets/5a7ff3a1-google.svg';
}
// default/dom/components/meander/pricing.jsx
$fsx.f[203] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const pricing_features_svg_1 = $fsx.r(204);
const pricing_integration_svg_1 = $fsx.r(205);
const product_shirt_svg_1 = $fsx.r(128);
const pricing_ok_svg_1 = $fsx.r(206);
const pricing_card_1 = $fsx.r(207);
const wrapper_1 = $fsx.r(199);
const PricingItem = props => createVNode(1, 'li', 'list-item f7 h2 flex items-center justify-left mv1', [
    createVNode(1, 'img', 'w1 h1 mr2', null, 1, {
        'src': pricing_ok_svg_1.default,
        'alt': 'Feature:'
    }),
    createVNode(1, 'p', 'tl', props.children, 0)
], 4);
function MeanderPricing(props) {
    const cardCx = '';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderPricing',
        'title': 'Pricing',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'h-100 ttn center bl br b--light-gray bg-meander', createVNode(1, 'div', props.sectionClassName, [
            createVNode(1, 'h1', props.titleClassName, createTextVNode('Do more with Grid Generator'), 2),
            createVNode(1, 'h2', props.subtitleClassName, createTextVNode('And help develop the app further.'), 2),
            createVNode(1, 'div', 'contact-social flex flex-wrap', [
                createComponentVNode(2, pricing_card_1.PricingCard, {
                    'className': cardCx,
                    'imgUrl': pricing_features_svg_1.default,
                    'name': 'Export',
                    'title1': 'Use anywhere you want',
                    'subtitle1': '\u20AC4.69 per project',
                    'desc': 'Save it as SVG, PNG or export your creation process as an MP4 or GIF animation',
                    'children': createVNode(1, 'ul', 'list pl1', [
                        createComponentVNode(2, PricingItem, { 'children': 'Vector Image (SVG)' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Raster Image (PNG)' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Automatic records your creation process' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Creation animation (MP4)' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Creation GIF' })
                    ], 4)
                }),
                createComponentVNode(2, pricing_card_1.PricingCard, {
                    'className': cardCx,
                    'imgUrl': product_shirt_svg_1.default,
                    'name': 'Make products',
                    'title1': 'Bring your creation to life',
                    'subtitle1': '(upcoming)',
                    'desc': 'Create your shapes and patterns and turn them into products. ',
                    'children': createVNode(1, 'ul', 'list pl1', [
                        createComponentVNode(2, PricingItem, { 'children': createVNode(1, 'b', null, createTextVNode('Buy customized products with your creations'), 2) }),
                        createComponentVNode(2, PricingItem, { 'children': 'Order your custom T-Shirts' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Order custom Tote Bags' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Order custom Posters' })
                    ], 4)
                }),
                createComponentVNode(2, pricing_card_1.PricingCard, {
                    'className': cardCx,
                    'imgUrl': pricing_integration_svg_1.default,
                    'name': 'Integration',
                    'title1': 'Adapt to your business',
                    'subtitle1': 'Monthly rates + setup fee',
                    'desc': 'Customized solution for your business. Allow your clients to create shapes and patterns that fit into your products. Send an e-mail for further details.',
                    'children': createVNode(1, 'ul', 'list pl1', [
                        createComponentVNode(2, PricingItem, { 'children': createVNode(1, 'b', null, createTextVNode('Adapt the tool to your desire'), 2) }),
                        createComponentVNode(2, PricingItem, { 'children': 'Use your domain' }),
                        createComponentVNode(2, PricingItem, { 'children': 'Advanced training for your end users and admins' })
                    ], 4)
                })
            ], 4)
        ], 4), 2, {
            'style': { 'max-width': '52rem' },
            'onClick': e => e.stopImmediatePropagation()
        })
    });
}
exports.MeanderPricing = MeanderPricing;
}
// default/assets/icons/pricing-features.svg
$fsx.f[204] = function(module,exports){
module.exports.default = '/assets/20ad5ecb-pricing-features.svg';
}
// default/assets/icons/pricing-integration.svg
$fsx.f[205] = function(module,exports){
module.exports.default = '/assets/5c126f8-pricing-integration.svg';
}
// default/assets/icons/pricing-ok.svg
$fsx.f[206] = function(module,exports){
module.exports.default = '/assets/185adff7-pricing-ok.svg';
}
// default/dom/components/meander/pricing_card.jsx
$fsx.f[207] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
exports.PricingCard = props => createVNode(1, 'article', `PricingCard mw5 center bg-white br3 pa3 pa4-ns mv3 ba b--black-10 ${ props.className }`, [
    createVNode(1, 'div', 'tc', [
        createVNode(1, 'h1', 'f4 mb4 mt1', props.name, 0),
        createVNode(1, 'img', 'h3 w3 dib', null, 1, {
            'src': props.imgUrl,
            'alt': `Icon for our "${ props.name }" plan`
        }),
        createVNode(1, 'h2', 'h4 f4', [
            props.title1,
            createVNode(1, 'br'),
            createVNode(1, 'span', 'f6 gray', props.subtitle1, 0)
        ], 0),
        props.title2 ? createVNode(1, 'h3', 'f5', [
            props.title2,
            createVNode(1, 'br'),
            createVNode(1, 'span', 'f6 gray', props.subtitle2, 0)
        ], 0) : createVNode(1, 'div'),
        createVNode(1, 'hr', 'mw3 bb bw1 b--black-10')
    ], 0),
    createVNode(1, 'p', 'h4 flex items-center lh-copy measure center f6 black-70', props.desc, 0),
    createVNode(1, 'hr', 'mw3 bb bw1 b--black-10'),
    props.children
], 0);
}
// default/dom/components/meander/profile.jsx
$fsx.f[208] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const menu_1 = $fsx.r(198);
const profile_me_1 = $fsx.r(209);
const profile_projects_1 = $fsx.r(212);
const wrapper_1 = $fsx.r(199);
function ProfileSection(props) {
    const mainCx = '';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderProfile',
        'title': props.title,
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'h-100 ttn mw7 center bl br b--light-gray bg-meander pb5', [
            createComponentVNode(2, menu_1.MeanderMenu, {
                'menu': props.menu,
                'onAction': props.onMenuAction
            }),
            props.menu.selected === data_1.ProfileMenuId.Profile ? createComponentVNode(2, profile_me_1.ProfileMe, {
                'className': props.sectionClassName,
                'titleClassName': props.titleClassName,
                'subtitleClassName': props.subtitleClassName,
                'profileId': props.profileId,
                'profileAbout': props.profileAbout,
                'profileName': props.profileName,
                'profileCreated': props.profileCreated,
                'profileForm': props.profileForm,
                'badges': props.badges,
                'isLoading': props.profileIsLoading,
                'onUpdate': props.onProfileUpdate,
                'hasError': props.profileHasError,
                'loadingMsg': props.profileLoadingMsg
            }) : props.menu.selected === data_1.ProfileMenuId.Projects ? createComponentVNode(2, profile_projects_1.ProfileProjects, {
                'className': props.sectionClassName,
                'titleClassName': props.titleClassName,
                'subtitleClassName': props.subtitleClassName,
                'projects': props.projects,
                'currentProject': props.currentProject,
                'onProjectView': props.onProjectView,
                'onProjectNew': props.onProjectNew,
                'isLoading': props.isLoading
            }) : createVNode(1, 'div')
        ], 0, { 'onClick': e => e.stopImmediatePropagation() })
    });
}
exports.ProfileSection = ProfileSection;
}
// default/dom/components/meander/profile_me.jsx
$fsx.f[209] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const profile_earlyadopter_svg_1 = $fsx.r(210);
const profile_payedaccount_svg_1 = $fsx.r(211);
const buttons_1 = $fsx.r(106);
const form_1 = $fsx.r(129);
const inputcx = 'input-reset f6 ba b--black-20 br1 pa2 mb2 ml2 db w5';
const labelcx = 'f6 b pa2 db tl';
const successCx = 'dtc f7 pa2 tl green';
const errorCx = 'dtc f7 pa2 tl red';
const neutralCx = 'dtc f7 pa2 tl gray';
function renderBadges(badges) {
    const imgcx = 'w2 h2';
    return createVNode(1, 'div', null, [
        createVNode(1, 'label', labelcx, createTextVNode('Badges:'), 2),
        createVNode(1, 'div', 'flex items-start justify-center', [
            badges.indexOf('earlyadopter') !== -1 ? createVNode(1, 'img', imgcx, null, 1, {
                'src': profile_earlyadopter_svg_1.default,
                'alt': 'early adopter',
                'title': 'Early Adopter'
            }) : createVNode(1, 'div'),
            badges.indexOf('supporter') !== -1 ? createVNode(1, 'img', imgcx, null, 1, {
                'src': profile_payedaccount_svg_1.default,
                'alt': 'supporter',
                'title': 'Supporter'
            }) : createVNode(1, 'div')
        ], 0)
    ], 4);
}
exports.ProfileMe = props => createVNode(1, 'section', `ProfileMe user-select ${ props.className }`, [
    createVNode(1, 'h1', props.titleClassName, createTextVNode('About me'), 2),
    createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Public Information'), 2),
    createVNode(1, 'div', 'pt4 pa5-ns pb0-ns flex flex-column items-start justify-center', [
        props.badges && props.badges.length > 0 ? renderBadges(props.badges) : createVNode(1, 'div'),
        createVNode(1, 'label', labelcx, createTextVNode('Others know me as:'), 2),
        createComponentVNode(2, form_1.Input, {
            'className': inputcx,
            'type': 'text',
            'placeholder': props.profileName,
            'name': 'profile-name',
            'id': 'profile-name',
            'required': true,
            'disabled': props.isLoading,
            'value': props.profileForm ? props.profileForm.name : props.profileName
        }),
        createVNode(1, 'label', labelcx, createTextVNode('Bio:'), 2),
        createComponentVNode(2, form_1.TextArea, {
            'className': inputcx + ' h4',
            'placeholder': props.profileAbout,
            'name': 'profile-bio',
            'id': 'profile-bio',
            'disabled': props.isLoading,
            'value': props.profileForm ? props.profileForm.about : null
        }),
        createVNode(1, 'div', 'dt', [
            createComponentVNode(2, buttons_1.Button, {
                'className': 'ml2 dtc',
                'label': 'Update Profile',
                'onAction': props.onUpdate,
                'disabled': props.isLoading
            }),
            props.isLoading ? createVNode(1, 'p', neutralCx, createTextVNode('Updating'), 2) : createVNode(1, 'p', props.hasError ? errorCx : successCx, props.loadingMsg, 0)
        ], 0)
    ], 0)
], 4);
}
// default/assets/icons/profile-earlyadopter.svg
$fsx.f[210] = function(module,exports){
module.exports.default = '/assets/473c9b5a-profile-earlyadopter.svg';
}
// default/assets/icons/profile-payedaccount.svg
$fsx.f[211] = function(module,exports){
module.exports.default = '/assets/f2757cd7-profile-payedaccount.svg';
}
// default/dom/components/meander/profile_projects.jsx
$fsx.f[212] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const buttons_1 = $fsx.r(106);
const project_card_1 = $fsx.r(213);
exports.ProfileProjects = props => {
    return createVNode(1, 'section', `ProfileProjects user-select ${ props.className }`, [
        createVNode(1, 'h1', props.titleClassName, createTextVNode('Projects'), 2),
        props.isLoading ? createVNode(1, 'h2', props.subtitleClassName, createTextVNode('Loading...'), 2) : createVNode(1, 'div', 'w-100', [
            createVNode(1, 'div', 'flex items-center justify-center mv2 ', createComponentVNode(2, buttons_1.Button, {
                'className': '',
                'label': 'New Project',
                'onAction': props.onProjectNew
            }), 2),
            createVNode(1, 'div', 'h-100 flex flex-wrap flex-row items-start justify-center', props.projects.map(p => createComponentVNode(2, project_card_1.ProjectCard, {
                'project': p,
                'onView': props.onProjectView
            })), 0)
        ], 4)
    ], 0);
};
}
// default/dom/components/meander/project_card.jsx
$fsx.f[213] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const inferno_1 = $fsx.r(236);
exports.ProjectCard = props => {
    let vbw = 512;
    let vbh = 512;
    if (props.project.svgViewBox) {
        vbw = props.project.svgViewBox[0];
        vbh = props.project.svgViewBox[1];
    }
    let w = 254;
    let h = Math.floor(w * vbh / vbw);
    if (vbw < vbh) {
        h = Math.floor(w * vbw / vbh);
    }
    if (h > 254 || isNaN(h)) {
        h = 190;
        w = Math.floor(h * vbh / vbw);
        if (isNaN(w)) {
            w = 254;
        }
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="110" height="60" shape-rendering="crispEdges" viewBox="0 0 ${ vbw } ${ vbh }">${ props.project.svg }</svg>`;
    const src = `data:image/svg+xml,${ encodeURIComponent(svg) }`;
    return createVNode(1, 'section', 'ProjectCard tc pa3 w4', createVNode(1, 'a', 'pointer link dim f6 gray', createVNode(1, 'article', 'hide-child relative ba b--black-20 mw5 center', [
        createVNode(1, 'img', 'pa0 ma0 h3', null, 1, {
            'src': src,
            'alt': 'Preview'
        }),
        createVNode(1, 'div', 'pa2 bt b--black-20', createVNode(1, 'div', 'flex justify-between items-center', createVNode(1, 'h1', 'truncate f7 ttu tl', props.project.title, 0), 2), 2)
    ], 4), 2, { 'onClick': inferno_1.linkEvent(props.project.id, props.onView) }), 2);
};
}
// default/dom/components/meander/project_view.jsx
$fsx.f[214] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const player_1 = $fsx.r(215);
const controls_1 = $fsx.r(216);
const wrapper_1 = $fsx.r(199);
exports.ProjectView = props => {
    const title = props.project ? props.project.title : 'Loading...';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'ProjectView',
        'title': 'Grid Generator',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'h-100 ttn center bl br b--light-gray bg-meander', createVNode(1, 'div', props.sectionClassName, props.playerState && props.playerEvents && props.project ? [
            createVNode(1, 'h1', props.titleClassName, title, 0),
            createVNode(1, 'h2', props.subtitleClassName, props.project.description, 0),
            createComponentVNode(2, player_1.Player, {
                'className': 'center player w-80 h4 bg-red',
                'state': props.playerState,
                'events': props.playerEvents
            }),
            createVNode(1, 'nav', 'w-100 ph4-ns flex flex-column items-center justify-center', [
                createComponentVNode(2, controls_1.PlayerControls, {
                    'className': 'flex',
                    'isPlaying': props.playerState.isPlaying,
                    'isAtEnd': props.playerState.isAtEnd,
                    'isAtStart': props.playerState.isAtStart,
                    'onPlay': props.playerEvents.onPlay,
                    'onPause': props.playerEvents.onPause,
                    'onNext': props.playerEvents.onNext,
                    'onPrev': props.playerEvents.onPrev,
                    'onToBegin': props.playerEvents.onToBegin,
                    'onToEnd': props.playerEvents.onToEnd
                }),
                createVNode(1, 'div', 'mt2 h3 flex items-center justify-center', createComponentVNode(2, buttons_1.Button, {
                    'label': 'Change it',
                    'className': 'w4',
                    'bg': 'transparent',
                    'color': 'dark-gray',
                    'disabled': !data_1.canRemix(props.project.legal),
                    'onAction': props.playerEvents.onRemix
                }), 0)
            ], 4)
        ] : createVNode(1, 'div', 'sans-serif f7 gray ttu center player w-80 h5 flex items-center justify-center', createTextVNode('Loading...'), 2), 0), 2, {
            'style': { 'max-width': '52rem' },
            'onClick': e => e.stopImmediatePropagation()
        })
    });
};
}
// default/dom/components/player.jsx
$fsx.f[215] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const canvas_1 = $fsx.r(110);
exports.Player = props => {
    return createVNode(1, 'div', 'Player', createComponentVNode(2, canvas_1.default, {
        'className': 'PlayerCanvas',
        'onContext': props.events.onPlayerCanvasInit,
        'width': props.state.canvasWidth,
        'height': props.state.canvasHeight,
        'is3D': false
    }), 2, { 'onClick': props.events.onClickAction });
};
}
// default/dom/components/player/controls.jsx
$fsx.f[216] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
const controls_next_svg_1 = $fsx.r(217);
const controls_pause_svg_1 = $fsx.r(218);
const controls_play_svg_1 = $fsx.r(219);
const controls_prev_svg_1 = $fsx.r(220);
const controls_tobegin_svg_1 = $fsx.r(221);
const controls_toend_svg_1 = $fsx.r(222);
exports.PlayerControls = props => {
    const btncx = 'button-reset bg-transparent pa0 pointer bn flex dim mh1 mh2-ns mv0';
    const normalBtn = 'w2 h2 ' + btncx;
    const bigBtn = 'w3 h3' + btncx;
    const btnoff = ' o-30';
    return createVNode(1, 'nav', `PlayerControls flex items-center justify-center ${ props.className || '' }`, props.isPlaying ? [createVNode(1, 'button', bigBtn, createVNode(1, 'img', null, null, 1, {
            'src': controls_pause_svg_1.default,
            'alt': 'Pause',
            'title': 'Pause animation'
        }), 2, { 'onClick': props.onPause })] : [
        createVNode(1, 'button', normalBtn, createVNode(1, 'img', props.isAtStart ? btnoff : '', null, 1, {
            'src': controls_tobegin_svg_1.default,
            'alt': 'To Start',
            'title': 'Go to the start of the animation'
        }), 2, { 'onClick': props.isAtStart ? null : props.onToBegin }),
        createVNode(1, 'button', normalBtn, createVNode(1, 'img', props.isAtStart ? btnoff : '', null, 1, {
            'src': controls_prev_svg_1.default,
            'alt': 'Previous',
            'title': 'Move one action backwards'
        }), 2, { 'onClick': props.isAtStart ? null : props.onPrev }),
        createVNode(1, 'button', bigBtn, createVNode(1, 'img', null, null, 1, {
            'src': controls_play_svg_1.default,
            'alt': 'Play',
            'title': 'play'
        }), 2, { 'onClick': props.onPlay }),
        createVNode(1, 'button', normalBtn, createVNode(1, 'img', props.isAtEnd ? btnoff : '', null, 1, {
            'src': controls_next_svg_1.default,
            'alt': 'Next',
            'title': 'Move one action forward'
        }), 2, { 'onClick': props.isAtEnd ? null : props.onNext }),
        createVNode(1, 'button', normalBtn, createVNode(1, 'img', props.isAtEnd ? btnoff : '', null, 1, {
            'src': controls_toend_svg_1.default,
            'alt': 'To End',
            'title': 'Move to the end'
        }), 2, { 'onClick': props.isAtEnd ? null : props.onToEnd })
    ], 0);
};
}
// default/assets/icons/controls-next.svg
$fsx.f[217] = function(module,exports){
module.exports.default = '/assets/355b66d9-controls-next.svg';
}
// default/assets/icons/controls-pause.svg
$fsx.f[218] = function(module,exports){
module.exports.default = '/assets/96e57737-controls-pause.svg';
}
// default/assets/icons/controls-play.svg
$fsx.f[219] = function(module,exports){
module.exports.default = '/assets/782465b2-controls-play.svg';
}
// default/assets/icons/controls-prev.svg
$fsx.f[220] = function(module,exports){
module.exports.default = '/assets/4274fc40-controls-prev.svg';
}
// default/assets/icons/controls-tobegin.svg
$fsx.f[221] = function(module,exports){
module.exports.default = '/assets/fc7fd676-controls-tobegin.svg';
}
// default/assets/icons/controls-toend.svg
$fsx.f[222] = function(module,exports){
module.exports.default = '/assets/a54983a-controls-toend.svg';
}
// default/dom/components/meander/recover.jsx
$fsx.f[223] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const buttons_1 = $fsx.r(106);
const wrapper_1 = $fsx.r(199);
function MeanderRecover(props) {
    const inputcx = 'input-reset f6 ba b--black-20 br1 pa2 mb2 db w-100';
    const scx = 'f7 h1 lh-copy db';
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderRecover',
        'title': 'Forgot ?',
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'w-100 h-100 flex items-center justify-center', createVNode(1, 'div', 'w5 h5 pa3 ba br2 b--gray bg-white', createVNode(1, 'form', 'w-100', createVNode(1, 'fieldset', 'bn pa0', [
            createVNode(1, 'label', null, null, 1, { 'for': 'recover-p' }),
            createVNode(64, 'input', inputcx, null, 1, {
                'minLength': 8,
                'type': 'password',
                'placeholder': 'new password',
                'name': 'recover-p',
                'id': 'recover-p',
                'required': true,
                'disabled': props.isLoading
            }),
            createVNode(1, 'div', 'flex justify-between', createComponentVNode(2, buttons_1.Button, {
                'disabled': props.isLoading,
                'label': 'recover',
                'onAction': props.onRecover
            }), 2),
            props.isLoading ? createVNode(1, 'small', `gray mb2 ${ scx }`, createTextVNode('Loading'), 2, { 'id': 'recover-loading' }) : props.errorMsg ? createVNode(1, 'small', `red mb2 ${ scx }`, props.errorMsg ? props.errorMsg : ' ', 0, { 'id': 'password-desc' }) : createVNode(1, 'small', `green mb2 ${ scx }`, null, 1, { 'id': 'password-desc' })
        ], 0), 2, {
            'noValidate': true,
            'id': 'recover-form'
        }), 2), 2)
    });
}
exports.MeanderRecover = MeanderRecover;
}
// default/dom/components/meander/verify.jsx
$fsx.f[224] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createTextVNode = Inferno.createTextVNode;
var createComponentVNode = Inferno.createComponentVNode;
var createVNode = Inferno.createVNode;
const data_1 = $fsx.r(1);
const buttons_1 = $fsx.r(106);
const wrapper_1 = $fsx.r(199);
function verifyState(props) {
    const pcx = 'f6 tc';
    switch (props.state) {
    case data_1.VerifyingState.Verifying:
        return createVNode(1, 'p', pcx, createTextVNode('Please wait...'), 2);
    case data_1.VerifyingState.Success:
        return createVNode(1, 'div', 'flex flex-column items-center justify-center', [
            createVNode(1, 'p', `green ${ pcx }`, props.user, 0),
            createComponentVNode(2, buttons_1.Button, {
                'label': 'Start',
                'onAction': props.onExit
            })
        ], 4);
    case data_1.VerifyingState.AlreadyVerified:
        return createVNode(1, 'p', `yellow ${ pcx }`, createTextVNode('Already verified'), 2);
    case data_1.VerifyingState.Failed:
        return createVNode(1, 'p', `red ${ pcx }`, createTextVNode('Verification error'), 2);
    }
}
function MeanderVerify(props) {
    let title = 'Verifying';
    let h = 'h3';
    if (props.state === data_1.VerifyingState.Success) {
        title = 'Verified!';
        h = 'h4';
    }
    return createComponentVNode(2, wrapper_1.MeanderWrapper, {
        'className': 'MeanderVerify',
        'title': title,
        'onExit': props.onExit,
        'children': createVNode(1, 'div', 'w-100 h-100 flex items-center justify-center', createVNode(1, 'div', `w5 ${ h } pa3 ba br2 b--gray bg-white flex flex-column items-center justify-center`, verifyState(props), 0), 2)
    });
}
exports.MeanderVerify = MeanderVerify;
}
// default/dom/events/refresher.js
$fsx.f[225] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
class Refresher {
    constructor(rro, rso, rsdom, rdom, rmean, rcart, rproj, ronboard, rplay, rplaydom, rplayis, newp) {
        this.refreshNewProject = newp;
        this.refreshStateOnly = rso;
        this.refreshRuntimeOnly = rro;
        this.refreshDOMOnly = rdom;
        this.refreshMeanderOnly = rmean;
        this.refreshCartOnly = rcart;
        this.refreshStateAndDOM = rsdom;
        this.refreshProjectsOnly = rproj;
        this.refreshOnboardingOnly = ronboard;
        this.refreshPlayerOnly = rplay;
        this.refreshPlayerInitialState = rplayis;
        this.refreshPlayerAndDOM = rplaydom;
        this.refreshAll = (r, s, m) => {
            this.refreshRuntimeOnly(r);
            this.refreshStateOnly(s);
            this.refreshDOMOnly();
            if (m) {
                this.refreshMeanderOnly(m);
            }
        };
    }
}
exports.Refresher = Refresher;
}
// default/dom/components/pattern.jsx
$fsx.f[226] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: true });
var Inferno = $fsx.r(236);
var createVNode = Inferno.createVNode;
exports.Pattern = props => {
    const color = '#2030AA';
    const l = props.unitSize / 8;
    return createVNode(32, 'svg', props.className, [
        createVNode(1, 'rect', null, null, 1, {
            'x': props.startPosX,
            'y': props.startPosY,
            'width': props.endPosX - props.startPosX,
            'height': props.endPosY - props.startPosY,
            'stroke': color,
            'stroke-width': l,
            'fill': 'transparent'
        }),
        createVNode(1, 'circle', null, null, 1, {
            'cx': props.startPosX,
            'cy': props.startPosY,
            'r': l * 2,
            'fill': color
        }),
        createVNode(1, 'circle', null, null, 1, {
            'cx': props.endPosX,
            'cy': props.endPosY,
            'r': l * 2,
            'fill': color
        })
    ], 4, {
        'version': '1.1',
        'baseProfile': 'basic',
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': props.w,
        'height': props.h
    });
};
}
// default/fills.css
$fsx.f[227] = function(){
$fsx.r(234)('default/fills.css', '.no-stroke {\n\tstroke: transparent;\n}\n.no-fill {\n\tfill: transparent;\n}\n.near-black-fill {\n\tfill: #111111;\n}\n.dark-gray-fill {\n\tfill: #333333;\n}\n.light-gray-fill {\n\tfill: #EEEEEE;\n}\n.near-white-fill {\n\tfill: #F4F4F4;\n}\n.orange-fill {\n\tfill: #FF6300\n}\n.light-red-fill {\n\tfill: #FF725C;\n}\n.gold-fill {\n\tfill: #FFB700;\n}\n.yellow-fill {\n\tfill: #FFD700;\n}\n.dark-blue-fill {\n\tfill: #00449E;\n}\n.blue-fill {\n\tfill: #357EDD;\n}\n.light-blue-fill {\n\tfill: #96CCFF;\n}\n\n/* SVG Stroke */\n.near-black-stroke {\n\tstroke: #111111;\n}\n.dark-gray-stroke {\n\tstroke: #333333;\n}\n.light-gray-stroke {\n\tstroke: #EEEEEE;\n}\n.near-white-stroke {\n\tstroke: #F4F4F4;\n}\n.impact-zone:hover + .hover-orange-stroke,\n.hover-orange-stroke:hover,\n.orange-stroke {\n\tstroke: #FF6300;\n}\n.light-red-stroke {\n\tstroke: #FF725C;\n}\n.gold-stroke {\n\tstroke: #FFB700;\n}\n.yellow-stroke {\n\tstroke: #FFD700;\n}\n.dark-blue-stroke {\n\tstroke: #00449E;\n}\n.blue-stroke {\n\tstroke: #357EDD;\n}\n.light-blue-stroke {\n\tstroke: #96CCFF;\n}');
}
// default/main.css
$fsx.f[228] = function(){
$fsx.r(234)('default/main.css', ':root {\n\t--orange: #FF6300;\n\t--black: #000000;\n\t--ns-min-width: 30em;\n\t--l-min-width: 60em;\n}\nhtml {\n\toverflow:hidden;\n}\nbody {\n\tmargin: 0;\n\tpadding: 0;\n\toverflow:hidden;\n}\ncursor-normal {\n\tcursor: auto;\n}\ncanvas {\n\t-webkit-tap-highlight-color: transparent;\n}\nbutton:focus {\n\toutline: 0;\n}\n.no-overflow {\n\toverflow: hidden;\n}\n#app {\n\tbackground: #f4f4f4;\n\twidth: 100%;\n\theight: 100%;\n\toverflow: hidden;\n\tposition: fixed;\n}\n.select-text {\n\t-moz-user-select: text;\n\t-webkit-user-select: text;\n\t-ms-user-select: text;\n\tuser-select: text;\n}\n.no-select {\n\t-webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n.editorw {\n\twidth: 640px;\n}\n.editormw {\n\tmax-width: 640px;\n}\n.editormw-ns {\n\tmax-width: calc(640px - 4rem);\n}\n.editor-shadow {\n\tbox-shadow: inset -5px 0 2px -1px #ccc;\n}\n.s1 {\n\tstroke-width: 1rem;\n}\n.top-bar {\n\ttransition: width 100ms;\n}\n.top-bar::before {\n\tcontent: "";\n\tposition: absolute;\n\ttop: -4px;\n\theight: 1px;\n\twidth: 0;\n\ttransition: width 100ms;\n\tborder-top: 3px solid var(--black);\n}\n.top-bar-selected::before,\n.top-bar:hover::before {\n\twidth: 16px;\n}\n.bottom-circle {\n\ttransform: translateY(-0.7rem);\n}\n.bottom-circle::before {\n\tcontent: "";\n\tposition: absolute;\n\ttop: calc(100% - 2px);\n\tleft: calc(50% - 2px);\n\theight: 4px;\n\twidth: 4px;\n\tborder-radius: 50%;\n\tbackground: var(--orange);\n}\n.left-circle {\n\ttransform: translateX(0rem);\n}\n.left-circle::before {\n\tcontent: "";\n\tposition: absolute;\n\ttop: calc(50% - 2px);\n\tright: calc(120% - 2px);\n\theight: 4px;\n\twidth: 4px;\n\tborder-radius: 50%;\n\tbackground: var(--orange);\n}\n.right-circle {\n\ttransform: translateX(0rem);\n}\n.right-circle::before {\n\tcontent: "";\n\tposition: absolute;\n\ttop: calc(50% - 2px);\n\tright: calc(0% - 6px);\n\theight: 4px;\n\twidth: 4px;\n\tborder-radius: 50%;\n\tbackground: var(--orange);\n}\n.right-3 {\n\tright: 3rem;\n}\n.left-4 {\n\tleft: 3rem;\n}\n.bottom-4 {\n\tbottom: 3rem;\n}\n.grayscale {\n\tfilter: grayscale(90%);\n}\n.hover-color {\n\tfilter: grayscale(80%);\n\ttransition: filter .15s ease-in;\n}\n.hover-color:hover {\n\tfilter: grayscale(0);\n\ttransition: filter .15s ease-in;\n}\n.vertical-menuh {\n\theight: calc(100% - 4rem);\n}\n.visible {\n  visibility: visible;\n}\n.not-visible {\n  visibility: hidden;\n}\n.blur-6 {\n\tfilter: blur(6px);\n}\n.blur-0 {\n\tfilter: blur(0px);\n}\n.children-opacity .children {\n\ttransition: opacity 200ms ease-in, transform 200ms ease-out;\n\ttransition-delay: 200ms 300ms;\n}\n.children-o-0 .children {\n\topacity: 0;\n\ttransform: translateY(-1rem);\n}\n.children-o-100 .children {\n\topacity: 1;\n\ttransform: translateY(0);\n}\n.transition-blur {\n\ttransition: blur 600ms;\n}\n.transition-bg {\n\ttransition: background-color 300ms;\n}\n.transition-o {\n\ttransition: opacity 300ms;\n}\n.transition-wh {\n\ttransition: width 300ms, height 300ms;\n}\n.transition-transform {\n\ttransition: transform 300ms;\t\n}\n.translate-y-2 {\n\ttransform: translateY(3rem);\n}\n.translate-y-2 {\n\ttransform: translateY(3rem);\n}\n.translate-y-3 {\n\ttransform: translateY(4rem);\n}\n.translate-y--3 {\n\ttransform: translateY(-4rem);\n}\n.translate-x-2 {\n\ttransform: translateX(-3rem);\n}\n.translate-x2 {\n\ttransform: translateX(3rem);\n}\n.translate-xy2 {\n\ttransform: translate(3rem, -2rem);\n}\n.translate-xy-2 {\n\ttransform: translate(-3rem, -2rem);\n}\n.bg-meander {\n\tbackground-color: rgba(255,255,255,0.8);\n\ttransition: background 200ms ease-in;\n}\n.f8 {\n\tfont-size: 0.675rem;\n}\n.mw-70 {\n\tmax-width: 70%;\n}\n.w-expand-over .w3-expand {\n\twidth: 0;\n\ttransition: width 200ms ease-in;\n}\n.w-expand-over:hover .w3-expand {\n\twidth: 8rem;\n\ttransition: width 200ms ease-out;\n}\n.w-expand-over .w4-expand {\n\twidth: 0;\n\ttransition: width 200ms ease-in;\n}\n.w-expand-over:hover .w4-expand {\n\twidth: 8rem;\n\ttransition: width 200ms ease-out;\n}\n@media (min-width: 30em) {\n\t.visible-ns {\n\t\tvisibility: visible;\t\t\n\t}\n\t.right-3-ns {\n\t\tright: 3rem;\n\t}\n}\n\na [data-tooltip] {\n\tvisibility: collapse;\n\topacity: 0;\n\ttransition: opacity 300ms 300ms;\n}\na:hover [data-tooltip] {\n\tvisibility: visible;\n\tmargin-left: 8px;\n\topacity: 1;\n\ttransition: opacity 300ms 300ms;\n}\n[data-tooltip]::before {\n    content: "";\n    position: absolute;\n    top: -16px;\n    left:50%;\n    transform: translateX(-50%);\n    border-width: 4px 6px 0 6px;\n    border-style: solid;\n    border-color: rgba(0,0,0,0.7) transparent transparent     transparent;\n    z-index: 100;\n}\n[data-tooltip]::after {\n    content: attr(data-tooltip);\n    position: absolute;\n    left:50%;\n    top: -16px;\n    transform: translateX(-50%)   translateY(-100%);\n    background: rgba(0,0,0,0.7);\n    text-align: center;\n    color: #fff;\n    padding:4px 2px;\n    font-size: 12px;\n    min-width: 80px;\n    border-radius: 5px;\n    pointer-events: none;\n}\n');
}
// base64-js/index.js
$fsx.f[229] = function(module,exports){
exports.toByteArray = toByteArray;
exports.fromByteArray = fromByteArray;
var lookup = [];
var revLookup = [];
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
}
revLookup['-'.charCodeAt(0)] = 62;
revLookup['_'.charCodeAt(0)] = 63;
function getLens(b64) {
    var len = b64.length;
    if (len % 4 > 0) {
        throw new Error('Invalid string. Length must be a multiple of 4');
    }
    var validLen = b64.indexOf('=');
    if (validLen === -1)
        validLen = len;
    var placeHoldersLen = validLen === len ? 0 : 4 - validLen % 4;
    return [
        validLen,
        placeHoldersLen
    ];
}
function byteLength(b64) {
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function _byteLength(b64, validLen, placeHoldersLen) {
    return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
}
function toByteArray(b64) {
    var tmp;
    var lens = getLens(b64);
    var validLen = lens[0];
    var placeHoldersLen = lens[1];
    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
    var curByte = 0;
    var len = placeHoldersLen > 0 ? validLen - 4 : validLen;
    var i;
    for (i = 0; i < len; i += 4) {
        tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
        arr[curByte++] = tmp & 255;
    }
    if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
    }
    return arr;
}
function tripletToBase64(num) {
    return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
    var tmp;
    var output = [];
    for (var i = start; i < end; i += 3) {
        tmp = (uint8[i] << 16 & 16711680) + (uint8[i + 1] << 8 & 65280) + (uint8[i + 2] & 255);
        output.push(tripletToBase64(tmp));
    }
    return output.join('');
}
function fromByteArray(uint8) {
    var tmp;
    var len = uint8.length;
    var extraBytes = len % 3;
    var parts = [];
    var maxChunkLength = 16383;
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
        parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
    }
    if (extraBytes === 1) {
        tmp = uint8[len - 1];
        parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + '==');
    } else if (extraBytes === 2) {
        tmp = (uint8[len - 2] << 8) + uint8[len - 1];
        parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + '=');
    }
    return parts.join('');
}
}
// buffer/index.js
$fsx.f[230] = function(module,exports){
'use strict';
var base64 = $fsx.r(229);
var ieee754 = $fsx.r(235);
exports.Buffer = Buffer;
exports.FuseShim = true;
exports.SlowBuffer = SlowBuffer;
exports.INSPECT_MAX_BYTES = 50;
var K_MAX_LENGTH = 2147483647;
exports.kMaxLength = K_MAX_LENGTH;
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();
if (!Buffer.TYPED_ARRAY_SUPPORT) {
    console.error('This browser lacks typed array (Uint8Array) support which is required by ' + '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.');
}
function typedArraySupport() {
    try {
        var arr = new Uint8Array(1);
        arr.__proto__ = {
            __proto__: Uint8Array.prototype,
            foo: function () {
                return 42;
            }
        };
        return arr.foo() === 42;
    } catch (e) {
        return false;
    }
}
function createBuffer(length) {
    if (length > K_MAX_LENGTH) {
        throw new RangeError('Invalid typed array length');
    }
    var buf = new Uint8Array(length);
    buf.__proto__ = Buffer.prototype;
    return buf;
}
function Buffer(arg, encodingOrOffset, length) {
    if (typeof arg === 'number') {
        if (typeof encodingOrOffset === 'string') {
            throw new Error('If encoding is specified then the first argument must be a string');
        }
        return allocUnsafe(arg);
    }
    return from(arg, encodingOrOffset, length);
}
if (typeof Symbol !== 'undefined' && Symbol.species && Buffer[Symbol.species] === Buffer) {
    Object.defineProperty(Buffer, Symbol.species, {
        value: null,
        configurable: true,
        enumerable: false,
        writable: false
    });
}
Buffer.poolSize = 8192;
function from(value, encodingOrOffset, length) {
    if (typeof value === 'number') {
        throw new TypeError('"value" argument must not be a number');
    }
    if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
        return fromArrayBuffer(value, encodingOrOffset, length);
    }
    if (typeof value === 'string') {
        return fromString(value, encodingOrOffset);
    }
    return fromObject(value);
}
Buffer.from = function (value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length);
};
Buffer.prototype.__proto__ = Uint8Array.prototype;
Buffer.__proto__ = Uint8Array;
function assertSize(size) {
    if (typeof size !== 'number') {
        throw new TypeError('"size" argument must be a number');
    } else if (size < 0) {
        throw new RangeError('"size" argument must not be negative');
    }
}
function alloc(size, fill, encoding) {
    assertSize(size);
    if (size <= 0) {
        return createBuffer(size);
    }
    if (fill !== undefined) {
        return typeof encoding === 'string' ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
    }
    return createBuffer(size);
}
Buffer.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding);
};
function allocUnsafe(size) {
    assertSize(size);
    return createBuffer(size < 0 ? 0 : checked(size) | 0);
}
Buffer.allocUnsafe = function (size) {
    return allocUnsafe(size);
};
Buffer.allocUnsafeSlow = function (size) {
    return allocUnsafe(size);
};
function fromString(string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
        encoding = 'utf8';
    }
    if (!Buffer.isEncoding(encoding)) {
        throw new TypeError('"encoding" must be a valid string encoding');
    }
    var length = byteLength(string, encoding) | 0;
    var buf = createBuffer(length);
    var actual = buf.write(string, encoding);
    if (actual !== length) {
        buf = buf.slice(0, actual);
    }
    return buf;
}
function fromArrayLike(array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0;
    var buf = createBuffer(length);
    for (var i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
    }
    return buf;
}
function fromArrayBuffer(array, byteOffset, length) {
    array.byteLength;
    if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('\'offset\' is out of bounds');
    }
    if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('\'length\' is out of bounds');
    }
    var buf;
    if (byteOffset === undefined && length === undefined) {
        buf = new Uint8Array(array);
    } else if (length === undefined) {
        buf = new Uint8Array(array, byteOffset);
    } else {
        buf = new Uint8Array(array, byteOffset, length);
    }
    buf.__proto__ = Buffer.prototype;
    return buf;
}
function fromObject(obj) {
    if (Buffer.isBuffer(obj)) {
        var len = checked(obj.length) | 0;
        var buf = createBuffer(len);
        if (buf.length === 0) {
            return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
    }
    if (obj) {
        if (typeof ArrayBuffer !== 'undefined' && obj.buffer instanceof ArrayBuffer || 'length' in obj) {
            if (typeof obj.length !== 'number' || isnan(obj.length)) {
                return createBuffer(0);
            }
            return fromArrayLike(obj);
        }
        if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
            return fromArrayLike(obj.data);
        }
    }
    throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.');
}
function checked(length) {
    if (length >= K_MAX_LENGTH) {
        throw new RangeError('Attempt to allocate Buffer larger than maximum ' + 'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes');
    }
    return length | 0;
}
function SlowBuffer(length) {
    if (+length != length) {
        length = 0;
    }
    return Buffer.alloc(+length);
}
Buffer.isBuffer = function isBuffer(b) {
    return !!(b != null && b._isBuffer);
};
Buffer.compare = function compare(a, b) {
    if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
        throw new TypeError('Arguments must be Buffers');
    }
    if (a === b)
        return 0;
    var x = a.length;
    var y = b.length;
    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
            x = a[i];
            y = b[i];
            break;
        }
    }
    if (x < y)
        return -1;
    if (y < x)
        return 1;
    return 0;
};
Buffer.isEncoding = function isEncoding(encoding) {
    switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
        return true;
    default:
        return false;
    }
};
Buffer.concat = function concat(list, length) {
    if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
    }
    if (list.length === 0) {
        return Buffer.alloc(0);
    }
    var i;
    if (length === undefined) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
            length += list[i].length;
        }
    }
    var buffer = Buffer.allocUnsafe(length);
    var pos = 0;
    for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!Buffer.isBuffer(buf)) {
            throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
    }
    return buffer;
};
function byteLength(string, encoding) {
    if (Buffer.isBuffer(string)) {
        return string.length;
    }
    if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
        return string.byteLength;
    }
    if (typeof string !== 'string') {
        string = '' + string;
    }
    var len = string.length;
    if (len === 0)
        return 0;
    var loweredCase = false;
    for (;;) {
        switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
            return len;
        case 'utf8':
        case 'utf-8':
        case undefined:
            return utf8ToBytes(string).length;
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return len * 2;
        case 'hex':
            return len >>> 1;
        case 'base64':
            return base64ToBytes(string).length;
        default:
            if (loweredCase)
                return utf8ToBytes(string).length;
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
    }
}
Buffer.byteLength = byteLength;
function slowToString(encoding, start, end) {
    var loweredCase = false;
    if (start === undefined || start < 0) {
        start = 0;
    }
    if (start > this.length) {
        return '';
    }
    if (end === undefined || end > this.length) {
        end = this.length;
    }
    if (end <= 0) {
        return '';
    }
    end >>>= 0;
    start >>>= 0;
    if (end <= start) {
        return '';
    }
    if (!encoding)
        encoding = 'utf8';
    while (true) {
        switch (encoding) {
        case 'hex':
            return hexSlice(this, start, end);
        case 'utf8':
        case 'utf-8':
            return utf8Slice(this, start, end);
        case 'ascii':
            return asciiSlice(this, start, end);
        case 'latin1':
        case 'binary':
            return latin1Slice(this, start, end);
        case 'base64':
            return base64Slice(this, start, end);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return utf16leSlice(this, start, end);
        default:
            if (loweredCase)
                throw new TypeError('Unknown encoding: ' + encoding);
            encoding = (encoding + '').toLowerCase();
            loweredCase = true;
        }
    }
}
Buffer.prototype._isBuffer = true;
function swap(b, n, m) {
    var i = b[n];
    b[n] = b[m];
    b[m] = i;
}
Buffer.prototype.swap16 = function swap16() {
    var len = this.length;
    if (len % 2 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 16-bits');
    }
    for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
    }
    return this;
};
Buffer.prototype.swap32 = function swap32() {
    var len = this.length;
    if (len % 4 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 32-bits');
    }
    for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
    }
    return this;
};
Buffer.prototype.swap64 = function swap64() {
    var len = this.length;
    if (len % 8 !== 0) {
        throw new RangeError('Buffer size must be a multiple of 64-bits');
    }
    for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
    }
    return this;
};
Buffer.prototype.toString = function toString() {
    var length = this.length;
    if (length === 0)
        return '';
    if (arguments.length === 0)
        return utf8Slice(this, 0, length);
    return slowToString.apply(this, arguments);
};
Buffer.prototype.equals = function equals(b) {
    if (!Buffer.isBuffer(b))
        throw new TypeError('Argument must be a Buffer');
    if (this === b)
        return true;
    return Buffer.compare(this, b) === 0;
};
Buffer.prototype.inspect = function inspect() {
    var str = '';
    var max = exports.INSPECT_MAX_BYTES;
    if (this.length > 0) {
        str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
        if (this.length > max)
            str += ' ... ';
    }
    return '<Buffer ' + str + '>';
};
Buffer.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
    if (!Buffer.isBuffer(target)) {
        throw new TypeError('Argument must be a Buffer');
    }
    if (start === undefined) {
        start = 0;
    }
    if (end === undefined) {
        end = target ? target.length : 0;
    }
    if (thisStart === undefined) {
        thisStart = 0;
    }
    if (thisEnd === undefined) {
        thisEnd = this.length;
    }
    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError('out of range index');
    }
    if (thisStart >= thisEnd && start >= end) {
        return 0;
    }
    if (thisStart >= thisEnd) {
        return -1;
    }
    if (start >= end) {
        return 1;
    }
    start >>>= 0;
    end >>>= 0;
    thisStart >>>= 0;
    thisEnd >>>= 0;
    if (this === target)
        return 0;
    var x = thisEnd - thisStart;
    var y = end - start;
    var len = Math.min(x, y);
    var thisCopy = this.slice(thisStart, thisEnd);
    var targetCopy = target.slice(start, end);
    for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
            x = thisCopy[i];
            y = targetCopy[i];
            break;
        }
    }
    if (x < y)
        return -1;
    if (y < x)
        return 1;
    return 0;
};
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
    if (buffer.length === 0)
        return -1;
    if (typeof byteOffset === 'string') {
        encoding = byteOffset;
        byteOffset = 0;
    } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
    } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
    }
    byteOffset = +byteOffset;
    if (isNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
    }
    if (byteOffset < 0)
        byteOffset = buffer.length + byteOffset;
    if (byteOffset >= buffer.length) {
        if (dir)
            return -1;
        else
            byteOffset = buffer.length - 1;
    } else if (byteOffset < 0) {
        if (dir)
            byteOffset = 0;
        else
            return -1;
    }
    if (typeof val === 'string') {
        val = Buffer.from(val, encoding);
    }
    if (Buffer.isBuffer(val)) {
        if (val.length === 0) {
            return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
    } else if (typeof val === 'number') {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === 'function') {
            if (dir) {
                return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
            } else {
                return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
            }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
    }
    throw new TypeError('val must be string, number or Buffer');
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
    var indexSize = 1;
    var arrLength = arr.length;
    var valLength = val.length;
    if (encoding !== undefined) {
        encoding = String(encoding).toLowerCase();
        if (encoding === 'ucs2' || encoding === 'ucs-2' || encoding === 'utf16le' || encoding === 'utf-16le') {
            if (arr.length < 2 || val.length < 2) {
                return -1;
            }
            indexSize = 2;
            arrLength /= 2;
            valLength /= 2;
            byteOffset /= 2;
        }
    }
    function read(buf, i) {
        if (indexSize === 1) {
            return buf[i];
        } else {
            return buf.readUInt16BE(i * indexSize);
        }
    }
    var i;
    if (dir) {
        var foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
            if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
                if (foundIndex === -1)
                    foundIndex = i;
                if (i - foundIndex + 1 === valLength)
                    return foundIndex * indexSize;
            } else {
                if (foundIndex !== -1)
                    i -= i - foundIndex;
                foundIndex = -1;
            }
        }
    } else {
        if (byteOffset + valLength > arrLength)
            byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
            var found = true;
            for (var j = 0; j < valLength; j++) {
                if (read(arr, i + j) !== read(val, j)) {
                    found = false;
                    break;
                }
            }
            if (found)
                return i;
        }
    }
    return -1;
}
Buffer.prototype.includes = function includes(val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1;
};
Buffer.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
};
Buffer.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
};
function hexWrite(buf, string, offset, length) {
    offset = Number(offset) || 0;
    var remaining = buf.length - offset;
    if (!length) {
        length = remaining;
    } else {
        length = Number(length);
        if (length > remaining) {
            length = remaining;
        }
    }
    var strLen = string.length;
    if (strLen % 2 !== 0)
        throw new TypeError('Invalid hex string');
    if (length > strLen / 2) {
        length = strLen / 2;
    }
    for (var i = 0; i < length; ++i) {
        var parsed = parseInt(string.substr(i * 2, 2), 16);
        if (isNaN(parsed))
            return i;
        buf[offset + i] = parsed;
    }
    return i;
}
function utf8Write(buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
Buffer.prototype.write = function write(string, offset, length, encoding) {
    if (offset === undefined) {
        encoding = 'utf8';
        length = this.length;
        offset = 0;
    } else if (length === undefined && typeof offset === 'string') {
        encoding = offset;
        length = this.length;
        offset = 0;
    } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
            length = length >>> 0;
            if (encoding === undefined)
                encoding = 'utf8';
        } else {
            encoding = length;
            length = undefined;
        }
    } else {
        throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');
    }
    var remaining = this.length - offset;
    if (length === undefined || length > remaining)
        length = remaining;
    if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError('Attempt to write outside buffer bounds');
    }
    if (!encoding)
        encoding = 'utf8';
    var loweredCase = false;
    for (;;) {
        switch (encoding) {
        case 'hex':
            return hexWrite(this, string, offset, length);
        case 'utf8':
        case 'utf-8':
            return utf8Write(this, string, offset, length);
        case 'ascii':
            return asciiWrite(this, string, offset, length);
        case 'latin1':
        case 'binary':
            return latin1Write(this, string, offset, length);
        case 'base64':
            return base64Write(this, string, offset, length);
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
            return ucs2Write(this, string, offset, length);
        default:
            if (loweredCase)
                throw new TypeError('Unknown encoding: ' + encoding);
            encoding = ('' + encoding).toLowerCase();
            loweredCase = true;
        }
    }
};
Buffer.prototype.toJSON = function toJSON() {
    return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
    };
};
function base64Slice(buf, start, end) {
    if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
    } else {
        return base64.fromByteArray(buf.slice(start, end));
    }
}
function utf8Slice(buf, start, end) {
    end = Math.min(buf.length, end);
    var res = [];
    var i = start;
    while (i < end) {
        var firstByte = buf[i];
        var codePoint = null;
        var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
            var secondByte, thirdByte, fourthByte, tempCodePoint;
            switch (bytesPerSequence) {
            case 1:
                if (firstByte < 128) {
                    codePoint = firstByte;
                }
                break;
            case 2:
                secondByte = buf[i + 1];
                if ((secondByte & 192) === 128) {
                    tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                    if (tempCodePoint > 127) {
                        codePoint = tempCodePoint;
                    }
                }
                break;
            case 3:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                    tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                    if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                        codePoint = tempCodePoint;
                    }
                }
                break;
            case 4:
                secondByte = buf[i + 1];
                thirdByte = buf[i + 2];
                fourthByte = buf[i + 3];
                if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                    tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                    if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                        codePoint = tempCodePoint;
                    }
                }
            }
        }
        if (codePoint === null) {
            codePoint = 65533;
            bytesPerSequence = 1;
        } else if (codePoint > 65535) {
            codePoint -= 65536;
            res.push(codePoint >>> 10 & 1023 | 55296);
            codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
    }
    return decodeCodePointsArray(res);
}
var MAX_ARGUMENTS_LENGTH = 4096;
function decodeCodePointsArray(codePoints) {
    var len = codePoints.length;
    if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
    }
    var res = '';
    var i = 0;
    while (i < len) {
        res += String.fromCharCode.apply(String, codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH));
    }
    return res;
}
function asciiSlice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
    }
    return ret;
}
function latin1Slice(buf, start, end) {
    var ret = '';
    end = Math.min(buf.length, end);
    for (var i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
    }
    return ret;
}
function hexSlice(buf, start, end) {
    var len = buf.length;
    if (!start || start < 0)
        start = 0;
    if (!end || end < 0 || end > len)
        end = len;
    var out = '';
    for (var i = start; i < end; ++i) {
        out += toHex(buf[i]);
    }
    return out;
}
function utf16leSlice(buf, start, end) {
    var bytes = buf.slice(start, end);
    var res = '';
    for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
    }
    return res;
}
Buffer.prototype.slice = function slice(start, end) {
    var len = this.length;
    start = ~~start;
    end = end === undefined ? len : ~~end;
    if (start < 0) {
        start += len;
        if (start < 0)
            start = 0;
    } else if (start > len) {
        start = len;
    }
    if (end < 0) {
        end += len;
        if (end < 0)
            end = 0;
    } else if (end > len) {
        end = len;
    }
    if (end < start)
        end = start;
    var newBuf = this.subarray(start, end);
    newBuf.__proto__ = Buffer.prototype;
    return newBuf;
};
function checkOffset(offset, ext, length) {
    if (offset % 1 !== 0 || offset < 0)
        throw new RangeError('offset is not uint');
    if (offset + ext > length)
        throw new RangeError('Trying to access beyond buffer length');
}
Buffer.prototype.readUIntLE = function readUIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert)
        checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 256)) {
        val += this[offset + i] * mul;
    }
    return val;
};
Buffer.prototype.readUIntBE = function readUIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        checkOffset(offset, byteLength, this.length);
    }
    var val = this[offset + --byteLength];
    var mul = 1;
    while (byteLength > 0 && (mul *= 256)) {
        val += this[offset + --byteLength] * mul;
    }
    return val;
};
Buffer.prototype.readUInt8 = function readUInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 1, this.length);
    return this[offset];
};
Buffer.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 2, this.length);
    return this[offset] | this[offset + 1] << 8;
};
Buffer.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 2, this.length);
    return this[offset] << 8 | this[offset + 1];
};
Buffer.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
};
Buffer.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
};
Buffer.prototype.readIntLE = function readIntLE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert)
        checkOffset(offset, byteLength, this.length);
    var val = this[offset];
    var mul = 1;
    var i = 0;
    while (++i < byteLength && (mul *= 256)) {
        val += this[offset + i] * mul;
    }
    mul *= 128;
    if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readIntBE = function readIntBE(offset, byteLength, noAssert) {
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert)
        checkOffset(offset, byteLength, this.length);
    var i = byteLength;
    var mul = 1;
    var val = this[offset + --i];
    while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
    }
    mul *= 128;
    if (val >= mul)
        val -= Math.pow(2, 8 * byteLength);
    return val;
};
Buffer.prototype.readInt8 = function readInt8(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 1, this.length);
    if (!(this[offset] & 128))
        return this[offset];
    return (255 - this[offset] + 1) * -1;
};
Buffer.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 2, this.length);
    var val = this[offset] | this[offset + 1] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 2, this.length);
    var val = this[offset + 1] | this[offset] << 8;
    return val & 32768 ? val | 4294901760 : val;
};
Buffer.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
};
Buffer.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
};
Buffer.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, true, 23, 4);
};
Buffer.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 4, this.length);
    return ieee754.read(this, offset, false, 23, 4);
};
Buffer.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, true, 52, 8);
};
Buffer.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
    offset = offset >>> 0;
    if (!noAssert)
        checkOffset(offset, 8, this.length);
    return ieee754.read(this, offset, false, 52, 8);
};
function checkInt(buf, value, offset, ext, max, min) {
    if (!Buffer.isBuffer(buf))
        throw new TypeError('"buffer" argument must be a Buffer instance');
    if (value > max || value < min)
        throw new RangeError('"value" argument is out of bounds');
    if (offset + ext > buf.length)
        throw new RangeError('Index out of range');
}
Buffer.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var mul = 1;
    var i = 0;
    this[offset] = value & 255;
    while (++i < byteLength && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    byteLength = byteLength >>> 0;
    if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength) - 1;
        checkInt(this, value, offset, byteLength, maxBytes, 0);
    }
    var i = byteLength - 1;
    var mul = 1;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
    this[offset] = value & 255;
    return offset + 1;
};
Buffer.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
};
Buffer.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset + 3] = value >>> 24;
    this[offset + 2] = value >>> 16;
    this[offset + 1] = value >>> 8;
    this[offset] = value & 255;
    return offset + 4;
};
Buffer.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
};
Buffer.prototype.writeIntLE = function writeIntLE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = 0;
    var mul = 1;
    var sub = 0;
    this[offset] = value & 255;
    while (++i < byteLength && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeIntBE = function writeIntBE(value, offset, byteLength, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength - 1);
        checkInt(this, value, offset, byteLength, limit - 1, -limit);
    }
    var i = byteLength - 1;
    var mul = 1;
    var sub = 0;
    this[offset + i] = value & 255;
    while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
            sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
    }
    return offset + byteLength;
};
Buffer.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
    if (value < 0)
        value = 255 + value + 1;
    this[offset] = value & 255;
    return offset + 1;
};
Buffer.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    return offset + 2;
};
Buffer.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
    this[offset] = value >>> 8;
    this[offset + 1] = value & 255;
    return offset + 2;
};
Buffer.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
    this[offset] = value & 255;
    this[offset + 1] = value >>> 8;
    this[offset + 2] = value >>> 16;
    this[offset + 3] = value >>> 24;
    return offset + 4;
};
Buffer.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
    if (value < 0)
        value = 4294967295 + value + 1;
    this[offset] = value >>> 24;
    this[offset + 1] = value >>> 16;
    this[offset + 2] = value >>> 8;
    this[offset + 3] = value & 255;
    return offset + 4;
};
function checkIEEE754(buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length)
        throw new RangeError('Index out of range');
    if (offset < 0)
        throw new RangeError('Index out of range');
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4);
    return offset + 4;
}
Buffer.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert);
};
Buffer.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert);
};
function writeDouble(buf, value, offset, littleEndian, noAssert) {
    value = +value;
    offset = offset >>> 0;
    if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 1.7976931348623157e+308, -1.7976931348623157e+308);
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8);
    return offset + 8;
}
Buffer.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert);
};
Buffer.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert);
};
Buffer.prototype.copy = function copy(target, targetStart, start, end) {
    if (!start)
        start = 0;
    if (!end && end !== 0)
        end = this.length;
    if (targetStart >= target.length)
        targetStart = target.length;
    if (!targetStart)
        targetStart = 0;
    if (end > 0 && end < start)
        end = start;
    if (end === start)
        return 0;
    if (target.length === 0 || this.length === 0)
        return 0;
    if (targetStart < 0) {
        throw new RangeError('targetStart out of bounds');
    }
    if (start < 0 || start >= this.length)
        throw new RangeError('sourceStart out of bounds');
    if (end < 0)
        throw new RangeError('sourceEnd out of bounds');
    if (end > this.length)
        end = this.length;
    if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
    }
    var len = end - start;
    var i;
    if (this === target && start < targetStart && targetStart < end) {
        for (i = len - 1; i >= 0; --i) {
            target[i + targetStart] = this[i + start];
        }
    } else if (len < 1000) {
        for (i = 0; i < len; ++i) {
            target[i + targetStart] = this[i + start];
        }
    } else {
        Uint8Array.prototype.set.call(target, this.subarray(start, start + len), targetStart);
    }
    return len;
};
Buffer.prototype.fill = function fill(val, start, end, encoding) {
    if (typeof val === 'string') {
        if (typeof start === 'string') {
            encoding = start;
            start = 0;
            end = this.length;
        } else if (typeof end === 'string') {
            encoding = end;
            end = this.length;
        }
        if (val.length === 1) {
            var code = val.charCodeAt(0);
            if (code < 256) {
                val = code;
            }
        }
        if (encoding !== undefined && typeof encoding !== 'string') {
            throw new TypeError('encoding must be a string');
        }
        if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
            throw new TypeError('Unknown encoding: ' + encoding);
        }
    } else if (typeof val === 'number') {
        val = val & 255;
    }
    if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError('Out of range index');
    }
    if (end <= start) {
        return this;
    }
    start = start >>> 0;
    end = end === undefined ? this.length : end >>> 0;
    if (!val)
        val = 0;
    var i;
    if (typeof val === 'number') {
        for (i = start; i < end; ++i) {
            this[i] = val;
        }
    } else {
        var bytes = Buffer.isBuffer(val) ? val : new Buffer(val, encoding);
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
            this[i + start] = bytes[i % len];
        }
    }
    return this;
};
var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
function base64clean(str) {
    str = stringtrim(str).replace(INVALID_BASE64_RE, '');
    if (str.length < 2)
        return '';
    while (str.length % 4 !== 0) {
        str = str + '=';
    }
    return str;
}
function stringtrim(str) {
    if (str.trim)
        return str.trim();
    return str.replace(/^\s+|\s+$/g, '');
}
function toHex(n) {
    if (n < 16)
        return '0' + n.toString(16);
    return n.toString(16);
}
function utf8ToBytes(string, units) {
    units = units || Infinity;
    var codePoint;
    var length = string.length;
    var leadSurrogate = null;
    var bytes = [];
    for (var i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
            if (!leadSurrogate) {
                if (codePoint > 56319) {
                    if ((units -= 3) > -1)
                        bytes.push(239, 191, 189);
                    continue;
                } else if (i + 1 === length) {
                    if ((units -= 3) > -1)
                        bytes.push(239, 191, 189);
                    continue;
                }
                leadSurrogate = codePoint;
                continue;
            }
            if (codePoint < 56320) {
                if ((units -= 3) > -1)
                    bytes.push(239, 191, 189);
                leadSurrogate = codePoint;
                continue;
            }
            codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
            if ((units -= 3) > -1)
                bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
            if ((units -= 1) < 0)
                break;
            bytes.push(codePoint);
        } else if (codePoint < 2048) {
            if ((units -= 2) < 0)
                break;
            bytes.push(codePoint >> 6 | 192, codePoint & 63 | 128);
        } else if (codePoint < 65536) {
            if ((units -= 3) < 0)
                break;
            bytes.push(codePoint >> 12 | 224, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else if (codePoint < 1114112) {
            if ((units -= 4) < 0)
                break;
            bytes.push(codePoint >> 18 | 240, codePoint >> 12 & 63 | 128, codePoint >> 6 & 63 | 128, codePoint & 63 | 128);
        } else {
            throw new Error('Invalid code point');
        }
    }
    return bytes;
}
function asciiToBytes(str) {
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
    }
    return byteArray;
}
function utf16leToBytes(str, units) {
    var c, hi, lo;
    var byteArray = [];
    for (var i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0)
            break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
    }
    return byteArray;
}
function base64ToBytes(str) {
    return base64.toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length)
            break;
        dst[i + offset] = src[i];
    }
    return i;
}
function isnan(val) {
    return val !== val;
}
}
// cuint/index.js
$fsx.f[231] = function(module,exports){
exports.UINT32 = $fsx.r(232);
exports.UINT64 = $fsx.r(233);
}
// cuint/lib/uint32.js
$fsx.f[232] = function(module,exports){
;
(function (root) {
    var radixPowerCache = {
        36: UINT32(Math.pow(36, 5)),
        16: UINT32(Math.pow(16, 7)),
        10: UINT32(Math.pow(10, 9)),
        2: UINT32(Math.pow(2, 30))
    };
    var radixCache = {
        36: UINT32(36),
        16: UINT32(16),
        10: UINT32(10),
        2: UINT32(2)
    };
    function UINT32(l, h) {
        if (!(this instanceof UINT32))
            return new UINT32(l, h);
        this._low = 0;
        this._high = 0;
        this.remainder = null;
        if (typeof h == 'undefined')
            return fromNumber.call(this, l);
        if (typeof l == 'string')
            return fromString.call(this, l, h);
        fromBits.call(this, l, h);
    }
    function fromBits(l, h) {
        this._low = l | 0;
        this._high = h | 0;
        return this;
    }
    UINT32.prototype.fromBits = fromBits;
    function fromNumber(value) {
        this._low = value & 65535;
        this._high = value >>> 16;
        return this;
    }
    UINT32.prototype.fromNumber = fromNumber;
    function fromString(s, radix) {
        var value = parseInt(s, radix || 10);
        this._low = value & 65535;
        this._high = value >>> 16;
        return this;
    }
    UINT32.prototype.fromString = fromString;
    UINT32.prototype.toNumber = function () {
        return this._high * 65536 + this._low;
    };
    UINT32.prototype.toString = function (radix) {
        return this.toNumber().toString(radix || 10);
    };
    UINT32.prototype.add = function (other) {
        var a00 = this._low + other._low;
        var a16 = a00 >>> 16;
        a16 += this._high + other._high;
        this._low = a00 & 65535;
        this._high = a16 & 65535;
        return this;
    };
    UINT32.prototype.subtract = function (other) {
        return this.add(other.clone().negate());
    };
    UINT32.prototype.multiply = function (other) {
        var a16 = this._high;
        var a00 = this._low;
        var b16 = other._high;
        var b00 = other._low;
        var c16, c00;
        c00 = a00 * b00;
        c16 = c00 >>> 16;
        c16 += a16 * b00;
        c16 &= 65535;
        c16 += a00 * b16;
        this._low = c00 & 65535;
        this._high = c16 & 65535;
        return this;
    };
    UINT32.prototype.div = function (other) {
        if (other._low == 0 && other._high == 0)
            throw Error('division by zero');
        if (other._high == 0 && other._low == 1) {
            this.remainder = new UINT32(0);
            return this;
        }
        if (other.gt(this)) {
            this.remainder = this.clone();
            this._low = 0;
            this._high = 0;
            return this;
        }
        if (this.eq(other)) {
            this.remainder = new UINT32(0);
            this._low = 1;
            this._high = 0;
            return this;
        }
        var _other = other.clone();
        var i = -1;
        while (!this.lt(_other)) {
            _other.shiftLeft(1, true);
            i++;
        }
        this.remainder = this.clone();
        this._low = 0;
        this._high = 0;
        for (; i >= 0; i--) {
            _other.shiftRight(1);
            if (!this.remainder.lt(_other)) {
                this.remainder.subtract(_other);
                if (i >= 16) {
                    this._high |= 1 << i - 16;
                } else {
                    this._low |= 1 << i;
                }
            }
        }
        return this;
    };
    UINT32.prototype.negate = function () {
        var v = (~this._low & 65535) + 1;
        this._low = v & 65535;
        this._high = ~this._high + (v >>> 16) & 65535;
        return this;
    };
    UINT32.prototype.equals = UINT32.prototype.eq = function (other) {
        return this._low == other._low && this._high == other._high;
    };
    UINT32.prototype.greaterThan = UINT32.prototype.gt = function (other) {
        if (this._high > other._high)
            return true;
        if (this._high < other._high)
            return false;
        return this._low > other._low;
    };
    UINT32.prototype.lessThan = UINT32.prototype.lt = function (other) {
        if (this._high < other._high)
            return true;
        if (this._high > other._high)
            return false;
        return this._low < other._low;
    };
    UINT32.prototype.or = function (other) {
        this._low |= other._low;
        this._high |= other._high;
        return this;
    };
    UINT32.prototype.and = function (other) {
        this._low &= other._low;
        this._high &= other._high;
        return this;
    };
    UINT32.prototype.not = function () {
        this._low = ~this._low & 65535;
        this._high = ~this._high & 65535;
        return this;
    };
    UINT32.prototype.xor = function (other) {
        this._low ^= other._low;
        this._high ^= other._high;
        return this;
    };
    UINT32.prototype.shiftRight = UINT32.prototype.shiftr = function (n) {
        if (n > 16) {
            this._low = this._high >> n - 16;
            this._high = 0;
        } else if (n == 16) {
            this._low = this._high;
            this._high = 0;
        } else {
            this._low = this._low >> n | this._high << 16 - n & 65535;
            this._high >>= n;
        }
        return this;
    };
    UINT32.prototype.shiftLeft = UINT32.prototype.shiftl = function (n, allowOverflow) {
        if (n > 16) {
            this._high = this._low << n - 16;
            this._low = 0;
            if (!allowOverflow) {
                this._high &= 65535;
            }
        } else if (n == 16) {
            this._high = this._low;
            this._low = 0;
        } else {
            this._high = this._high << n | this._low >> 16 - n;
            this._low = this._low << n & 65535;
            if (!allowOverflow) {
                this._high &= 65535;
            }
        }
        return this;
    };
    UINT32.prototype.rotateLeft = UINT32.prototype.rotl = function (n) {
        var v = this._high << 16 | this._low;
        v = v << n | v >>> 32 - n;
        this._low = v & 65535;
        this._high = v >>> 16;
        return this;
    };
    UINT32.prototype.rotateRight = UINT32.prototype.rotr = function (n) {
        var v = this._high << 16 | this._low;
        v = v >>> n | v << 32 - n;
        this._low = v & 65535;
        this._high = v >>> 16;
        return this;
    };
    UINT32.prototype.clone = function () {
        return new UINT32(this._low, this._high);
    };
    if ('undefined' != 'undefined' && define.amd) {
        define([], function () {
            return UINT32;
        });
    } else if ('object' != 'undefined' && module.exports) {
        module.exports = UINT32;
    } else {
        root['UINT32'] = UINT32;
    }
}(this));
}
// cuint/lib/uint64.js
$fsx.f[233] = function(module,exports){
;
(function (root) {
    var radixPowerCache = {
        16: UINT64(Math.pow(16, 5)),
        10: UINT64(Math.pow(10, 5)),
        2: UINT64(Math.pow(2, 5))
    };
    var radixCache = {
        16: UINT64(16),
        10: UINT64(10),
        2: UINT64(2)
    };
    function UINT64(a00, a16, a32, a48) {
        if (!(this instanceof UINT64))
            return new UINT64(a00, a16, a32, a48);
        this.remainder = null;
        if (typeof a00 == 'string')
            return fromString.call(this, a00, a16);
        if (typeof a16 == 'undefined')
            return fromNumber.call(this, a00);
        fromBits.apply(this, arguments);
    }
    function fromBits(a00, a16, a32, a48) {
        if (typeof a32 == 'undefined') {
            this._a00 = a00 & 65535;
            this._a16 = a00 >>> 16;
            this._a32 = a16 & 65535;
            this._a48 = a16 >>> 16;
            return this;
        }
        this._a00 = a00 | 0;
        this._a16 = a16 | 0;
        this._a32 = a32 | 0;
        this._a48 = a48 | 0;
        return this;
    }
    UINT64.prototype.fromBits = fromBits;
    function fromNumber(value) {
        this._a00 = value & 65535;
        this._a16 = value >>> 16;
        this._a32 = 0;
        this._a48 = 0;
        return this;
    }
    UINT64.prototype.fromNumber = fromNumber;
    function fromString(s, radix) {
        radix = radix || 10;
        this._a00 = 0;
        this._a16 = 0;
        this._a32 = 0;
        this._a48 = 0;
        var radixUint = radixPowerCache[radix] || new UINT64(Math.pow(radix, 5));
        for (var i = 0, len = s.length; i < len; i += 5) {
            var size = Math.min(5, len - i);
            var value = parseInt(s.slice(i, i + size), radix);
            this.multiply(size < 5 ? new UINT64(Math.pow(radix, size)) : radixUint).add(new UINT64(value));
        }
        return this;
    }
    UINT64.prototype.fromString = fromString;
    UINT64.prototype.toNumber = function () {
        return this._a16 * 65536 + this._a00;
    };
    UINT64.prototype.toString = function (radix) {
        radix = radix || 10;
        var radixUint = radixCache[radix] || new UINT64(radix);
        if (!this.gt(radixUint))
            return this.toNumber().toString(radix);
        var self = this.clone();
        var res = new Array(64);
        for (var i = 63; i >= 0; i--) {
            self.div(radixUint);
            res[i] = self.remainder.toNumber().toString(radix);
            if (!self.gt(radixUint))
                break;
        }
        res[i - 1] = self.toNumber().toString(radix);
        return res.join('');
    };
    UINT64.prototype.add = function (other) {
        var a00 = this._a00 + other._a00;
        var a16 = a00 >>> 16;
        a16 += this._a16 + other._a16;
        var a32 = a16 >>> 16;
        a32 += this._a32 + other._a32;
        var a48 = a32 >>> 16;
        a48 += this._a48 + other._a48;
        this._a00 = a00 & 65535;
        this._a16 = a16 & 65535;
        this._a32 = a32 & 65535;
        this._a48 = a48 & 65535;
        return this;
    };
    UINT64.prototype.subtract = function (other) {
        return this.add(other.clone().negate());
    };
    UINT64.prototype.multiply = function (other) {
        var a00 = this._a00;
        var a16 = this._a16;
        var a32 = this._a32;
        var a48 = this._a48;
        var b00 = other._a00;
        var b16 = other._a16;
        var b32 = other._a32;
        var b48 = other._a48;
        var c00 = a00 * b00;
        var c16 = c00 >>> 16;
        c16 += a00 * b16;
        var c32 = c16 >>> 16;
        c16 &= 65535;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c32 += a00 * b32;
        var c48 = c32 >>> 16;
        c32 &= 65535;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 65535;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c48 += a00 * b48;
        c48 &= 65535;
        c48 += a16 * b32;
        c48 &= 65535;
        c48 += a32 * b16;
        c48 &= 65535;
        c48 += a48 * b00;
        this._a00 = c00 & 65535;
        this._a16 = c16 & 65535;
        this._a32 = c32 & 65535;
        this._a48 = c48 & 65535;
        return this;
    };
    UINT64.prototype.div = function (other) {
        if (other._a16 == 0 && other._a32 == 0 && other._a48 == 0) {
            if (other._a00 == 0)
                throw Error('division by zero');
            if (other._a00 == 1) {
                this.remainder = new UINT64(0);
                return this;
            }
        }
        if (other.gt(this)) {
            this.remainder = this.clone();
            this._a00 = 0;
            this._a16 = 0;
            this._a32 = 0;
            this._a48 = 0;
            return this;
        }
        if (this.eq(other)) {
            this.remainder = new UINT64(0);
            this._a00 = 1;
            this._a16 = 0;
            this._a32 = 0;
            this._a48 = 0;
            return this;
        }
        var _other = other.clone();
        var i = -1;
        while (!this.lt(_other)) {
            _other.shiftLeft(1, true);
            i++;
        }
        this.remainder = this.clone();
        this._a00 = 0;
        this._a16 = 0;
        this._a32 = 0;
        this._a48 = 0;
        for (; i >= 0; i--) {
            _other.shiftRight(1);
            if (!this.remainder.lt(_other)) {
                this.remainder.subtract(_other);
                if (i >= 48) {
                    this._a48 |= 1 << i - 48;
                } else if (i >= 32) {
                    this._a32 |= 1 << i - 32;
                } else if (i >= 16) {
                    this._a16 |= 1 << i - 16;
                } else {
                    this._a00 |= 1 << i;
                }
            }
        }
        return this;
    };
    UINT64.prototype.negate = function () {
        var v = (~this._a00 & 65535) + 1;
        this._a00 = v & 65535;
        v = (~this._a16 & 65535) + (v >>> 16);
        this._a16 = v & 65535;
        v = (~this._a32 & 65535) + (v >>> 16);
        this._a32 = v & 65535;
        this._a48 = ~this._a48 + (v >>> 16) & 65535;
        return this;
    };
    UINT64.prototype.equals = UINT64.prototype.eq = function (other) {
        return this._a48 == other._a48 && this._a00 == other._a00 && this._a32 == other._a32 && this._a16 == other._a16;
    };
    UINT64.prototype.greaterThan = UINT64.prototype.gt = function (other) {
        if (this._a48 > other._a48)
            return true;
        if (this._a48 < other._a48)
            return false;
        if (this._a32 > other._a32)
            return true;
        if (this._a32 < other._a32)
            return false;
        if (this._a16 > other._a16)
            return true;
        if (this._a16 < other._a16)
            return false;
        return this._a00 > other._a00;
    };
    UINT64.prototype.lessThan = UINT64.prototype.lt = function (other) {
        if (this._a48 < other._a48)
            return true;
        if (this._a48 > other._a48)
            return false;
        if (this._a32 < other._a32)
            return true;
        if (this._a32 > other._a32)
            return false;
        if (this._a16 < other._a16)
            return true;
        if (this._a16 > other._a16)
            return false;
        return this._a00 < other._a00;
    };
    UINT64.prototype.or = function (other) {
        this._a00 |= other._a00;
        this._a16 |= other._a16;
        this._a32 |= other._a32;
        this._a48 |= other._a48;
        return this;
    };
    UINT64.prototype.and = function (other) {
        this._a00 &= other._a00;
        this._a16 &= other._a16;
        this._a32 &= other._a32;
        this._a48 &= other._a48;
        return this;
    };
    UINT64.prototype.xor = function (other) {
        this._a00 ^= other._a00;
        this._a16 ^= other._a16;
        this._a32 ^= other._a32;
        this._a48 ^= other._a48;
        return this;
    };
    UINT64.prototype.not = function () {
        this._a00 = ~this._a00 & 65535;
        this._a16 = ~this._a16 & 65535;
        this._a32 = ~this._a32 & 65535;
        this._a48 = ~this._a48 & 65535;
        return this;
    };
    UINT64.prototype.shiftRight = UINT64.prototype.shiftr = function (n) {
        n %= 64;
        if (n >= 48) {
            this._a00 = this._a48 >> n - 48;
            this._a16 = 0;
            this._a32 = 0;
            this._a48 = 0;
        } else if (n >= 32) {
            n -= 32;
            this._a00 = (this._a32 >> n | this._a48 << 16 - n) & 65535;
            this._a16 = this._a48 >> n & 65535;
            this._a32 = 0;
            this._a48 = 0;
        } else if (n >= 16) {
            n -= 16;
            this._a00 = (this._a16 >> n | this._a32 << 16 - n) & 65535;
            this._a16 = (this._a32 >> n | this._a48 << 16 - n) & 65535;
            this._a32 = this._a48 >> n & 65535;
            this._a48 = 0;
        } else {
            this._a00 = (this._a00 >> n | this._a16 << 16 - n) & 65535;
            this._a16 = (this._a16 >> n | this._a32 << 16 - n) & 65535;
            this._a32 = (this._a32 >> n | this._a48 << 16 - n) & 65535;
            this._a48 = this._a48 >> n & 65535;
        }
        return this;
    };
    UINT64.prototype.shiftLeft = UINT64.prototype.shiftl = function (n, allowOverflow) {
        n %= 64;
        if (n >= 48) {
            this._a48 = this._a00 << n - 48;
            this._a32 = 0;
            this._a16 = 0;
            this._a00 = 0;
        } else if (n >= 32) {
            n -= 32;
            this._a48 = this._a16 << n | this._a00 >> 16 - n;
            this._a32 = this._a00 << n & 65535;
            this._a16 = 0;
            this._a00 = 0;
        } else if (n >= 16) {
            n -= 16;
            this._a48 = this._a32 << n | this._a16 >> 16 - n;
            this._a32 = (this._a16 << n | this._a00 >> 16 - n) & 65535;
            this._a16 = this._a00 << n & 65535;
            this._a00 = 0;
        } else {
            this._a48 = this._a48 << n | this._a32 >> 16 - n;
            this._a32 = (this._a32 << n | this._a16 >> 16 - n) & 65535;
            this._a16 = (this._a16 << n | this._a00 >> 16 - n) & 65535;
            this._a00 = this._a00 << n & 65535;
        }
        if (!allowOverflow) {
            this._a48 &= 65535;
        }
        return this;
    };
    UINT64.prototype.rotateLeft = UINT64.prototype.rotl = function (n) {
        n %= 64;
        if (n == 0)
            return this;
        if (n >= 32) {
            var v = this._a00;
            this._a00 = this._a32;
            this._a32 = v;
            v = this._a48;
            this._a48 = this._a16;
            this._a16 = v;
            if (n == 32)
                return this;
            n -= 32;
        }
        var high = this._a48 << 16 | this._a32;
        var low = this._a16 << 16 | this._a00;
        var _high = high << n | low >>> 32 - n;
        var _low = low << n | high >>> 32 - n;
        this._a00 = _low & 65535;
        this._a16 = _low >>> 16;
        this._a32 = _high & 65535;
        this._a48 = _high >>> 16;
        return this;
    };
    UINT64.prototype.rotateRight = UINT64.prototype.rotr = function (n) {
        n %= 64;
        if (n == 0)
            return this;
        if (n >= 32) {
            var v = this._a00;
            this._a00 = this._a32;
            this._a32 = v;
            v = this._a48;
            this._a48 = this._a16;
            this._a16 = v;
            if (n == 32)
                return this;
            n -= 32;
        }
        var high = this._a48 << 16 | this._a32;
        var low = this._a16 << 16 | this._a00;
        var _high = high >>> n | low << 32 - n;
        var _low = low >>> n | high << 32 - n;
        this._a00 = _low & 65535;
        this._a16 = _low >>> 16;
        this._a32 = _high & 65535;
        this._a48 = _high >>> 16;
        return this;
    };
    UINT64.prototype.clone = function () {
        return new UINT64(this._a00, this._a16, this._a32, this._a48);
    };
    if ('undefined' != 'undefined' && define.amd) {
        define([], function () {
            return UINT64;
        });
    } else if ('object' != 'undefined' && module.exports) {
        module.exports = UINT64;
    } else {
        root['UINT64'] = UINT64;
    }
}(this));
}
// fuse-box-css/index.js
$fsx.f[234] = function(module,exports){
var __filename = "index.js";
var runningInBrowser = true || 'browser' === 'electron';
var cssHandler = function (__filename, contents) {
    if (runningInBrowser) {
        var styleId = __filename.replace(/[\.\/]+/g, '-');
        if (styleId.charAt(0) === '-')
            styleId = styleId.substring(1);
        var exists = document.getElementById(styleId);
        if (!exists) {
            var s = document.createElement(contents ? 'style' : 'link');
            s.id = styleId;
            s.type = 'text/css';
            if (contents) {
                s.innerHTML = contents;
            } else {
                s.rel = 'stylesheet';
                s.href = __filename;
            }
            document.getElementsByTagName('head')[0].appendChild(s);
        } else {
            if (contents) {
                exists.innerHTML = contents;
            }
        }
    }
};
if (typeof FuseBox !== 'undefined' && runningInBrowser) {
    FuseBox.on('async', function (name) {
        if (/\.css$/.test(name)) {
            cssHandler(name);
            return false;
        }
    });
}
module.exports = cssHandler;
}
// ieee754/index.js
$fsx.f[235] = function(module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var nBits = -7;
    var i = isLE ? nBytes - 1 : 0;
    var d = isLE ? -1 : 1;
    var s = buffer[offset + i];
    i += d;
    e = s & (1 << -nBits) - 1;
    s >>= -nBits;
    nBits += eLen;
    for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    m = e & (1 << -nBits) - 1;
    e >>= -nBits;
    nBits += mLen;
    for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
    }
    if (e === 0) {
        e = 1 - eBias;
    } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
    } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};
exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c;
    var eLen = nBytes * 8 - mLen - 1;
    var eMax = (1 << eLen) - 1;
    var eBias = eMax >> 1;
    var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
    var i = isLE ? 0 : nBytes - 1;
    var d = isLE ? 1 : -1;
    var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
    value = Math.abs(value);
    if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
    } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
            e--;
            c *= 2;
        }
        if (e + eBias >= 1) {
            value += rt / c;
        } else {
            value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
            e++;
            c /= 2;
        }
        if (e + eBias >= eMax) {
            m = 0;
            e = eMax;
        } else if (e + eBias >= 1) {
            m = (value * c - 1) * Math.pow(2, mLen);
            e = e + eBias;
        } else {
            m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
            e = 0;
        }
    }
    for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
    }
    e = e << mLen | m;
    eLen += mLen;
    for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
    }
    buffer[offset + i - d] |= s * 128;
};
}
// inferno/index.js
$fsx.f[236] = function(module,exports){
module.exports = $fsx.r(237);
}
// inferno/dist/index.cjs.min.js
$fsx.f[237] = function(module,exports){
Object.defineProperty(exports, '__esModule', { value: !0 });
var g = '$NO_OP', n = 'a runtime error occured! Use Inferno in development environment to find the error.', e = !('undefined' == 'object' || !window.document), f = Array.isArray;
function d(e) {
    var n = typeof e;
    return 'string' === n || 'number' === n;
}
function x(e) {
    return y(e) || h(e);
}
function p(e) {
    return h(e) || !1 === e || t(e) || y(e);
}
function S(e) {
    return 'function' == typeof e;
}
function v(e) {
    return 'string' == typeof e;
}
function m(e) {
    return 'number' == typeof e;
}
function h(e) {
    return null === e;
}
function t(e) {
    return !0 === e;
}
function y(e) {
    return void 0 === e;
}
function a(e) {
    throw e || (e = n), new Error('Inferno Error: ' + e);
}
function $(e, n) {
    var t = {};
    if (e)
        for (var o in e)
            t[o] = e[o];
    if (n)
        for (var r in n)
            t[r] = n[r];
    return t;
}
var b = '$';
function k(e, n, t, o, r, a, l, i) {
    return {
        childFlags: e,
        children: n,
        className: t,
        dom: null,
        flags: o,
        key: void 0 === r ? null : r,
        parentVNode: null,
        props: void 0 === a ? null : a,
        ref: void 0 === l ? null : l,
        type: i
    };
}
function l(e, n, t, o, r, a, l, i) {
    var s = void 0 === r ? 1 : r, c = k(s, o, t, e, l, a, i, n), u = w.createVNode;
    return 'function' == typeof u && u(c), 0 === s && U(c, c.children), c;
}
function i(e, n, t, o, r) {
    0 < (2 & e) && (e = n.prototype && S(n.prototype.render) ? 4 : 8);
    var a = n.defaultProps;
    if (!x(a))
        for (var l in (t || (t = {}), a))
            y(t[l]) && (t[l] = a[l]);
    if (0 < (8 & e)) {
        var i = n.defaultHooks;
        if (!x(i))
            if (r)
                for (var s in i)
                    y(r[s]) && (r[s] = i[s]);
            else
                r = i;
    }
    var c = k(1, null, null, e, o, t, r, n), u = w.createVNode;
    return S(u) && u(c), c;
}
function C(e, n) {
    return k(1, x(e) ? '' : e, null, 16, n, null, null, null);
}
function o(e) {
    var n = e.props;
    if (n) {
        var t = e.flags;
        481 & t && (void 0 !== n.children && x(e.children) && U(e, n.children), void 0 !== n.className && (e.className = n.className || null, n.className = void 0)), void 0 !== n.key && (e.key = n.key, n.key = void 0), void 0 !== n.ref && (e.ref = 8 & t ? $(e.ref, n.ref) : n.ref, n.ref = void 0);
    }
    return e;
}
function N(e) {
    var n, t = e.flags;
    if (14 & t) {
        var o, r = e.props;
        if (!h(r))
            for (var a in (o = {}, r))
                o[a] = r[a];
        n = i(t, e.type, o, e.key, e.ref);
    } else
        481 & t ? n = l(t, e.type, e.className, e.children, e.childFlags, e.props, e.key, e.ref) : 16 & t ? n = C(e.children, e.key) : 1024 & t && (n = e);
    return n;
}
function s() {
    return C('', null);
}
function P(e, n, t, o) {
    for (var r = e.length; t < r; t++) {
        var a = e[t];
        if (!p(a)) {
            var l = o + b + t;
            if (f(a))
                P(a, n, 0, l);
            else {
                if (d(a))
                    a = C(a, l);
                else {
                    var i = a.key, s = v(i) && i[0] === b;
                    h(a.dom) && !s || (a = N(a)), h(i) || s ? a.key = l : a.key = o + i;
                }
                n.push(a);
            }
        }
    }
}
function r(e) {
    return 'svg' === e ? 32 : 'input' === e ? 64 : 'select' === e ? 256 : 'textarea' === e ? 128 : 1;
}
function U(e, n) {
    var t, o = 1;
    if (p(n))
        t = n;
    else if (v(n))
        o = 2, t = C(n);
    else if (m(n))
        o = 2, t = C(n + '');
    else if (f(n)) {
        var r = n.length;
        if (0 === r)
            t = null, o = 1;
        else {
            (Object.isFrozen(n) || !0 === n.$) && (n = n.slice()), o = 8;
            for (var a = 0; a < r; a++) {
                var l = n[a];
                if (p(l) || f(l)) {
                    P(n, t = t || n.slice(0, a), a, '');
                    break;
                }
                if (d(l))
                    (t = t || n.slice(0, a)).push(C(l, b + a));
                else {
                    var i = l.key, s = h(l.dom), c = h(i), u = !c && v(i) && i[0] === b;
                    !s || c || u ? (t = t || n.slice(0, a), s && !u || (l = N(l)), (c || u) && (l.key = b + a), t.push(l)) : t && t.push(l);
                }
            }
            (t = t || n).$ = !0;
        }
    } else
        h((t = n).dom) || (t = N(n)), o = 2;
    return e.children = t, e.childFlags = o, e;
}
var w = {
    afterRender: null,
    beforeRender: null,
    createVNode: null,
    renderComplete: null
};
function c(e, n) {
    return S(n) ? {
        data: e,
        event: n
    } : null;
}
var u = 'http://www.w3.org/1999/xlink', V = 'http://www.w3.org/XML/1998/namespace', M = 'http://www.w3.org/2000/svg', D = {
        'xlink:actuate': u,
        'xlink:arcrole': u,
        'xlink:href': u,
        'xlink:role': u,
        'xlink:show': u,
        'xlink:title': u,
        'xlink:type': u,
        'xml:base': V,
        'xml:lang': V,
        'xml:space': V
    }, I = {}, F = [];
function L(e, n) {
    e.appendChild(n);
}
function T(e, n, t) {
    x(t) ? L(e, n) : e.insertBefore(n, t);
}
function O(e, n) {
    return n ? document.createElementNS(M, e) : document.createElement(e);
}
function R(e, n, t) {
    e.replaceChild(n, t);
}
function B(e, n) {
    e.removeChild(n);
}
function W(e) {
    for (var n; void 0 !== (n = e.shift());)
        n();
}
var E = {}, A = {};
function _(e, n, t) {
    var o = E[e], r = t.$EV;
    n ? (o || (A[e] = z(e), E[e] = 0), r || (r = t.$EV = {}), r[e] || E[e]++, r[e] = n) : r && r[e] && (E[e]--, 1 === o && (document.removeEventListener(X(e), A[e]), A[e] = null), r[e] = n);
}
function H(e, n, t, o, r) {
    for (var a = n; !h(a);) {
        if (t && a.disabled)
            return;
        var l = a.$EV;
        if (l) {
            var i = l[o];
            if (i && (r.dom = a, i.event ? i.event(i.data, e) : i(e), e.cancelBubble))
                return;
        }
        a = a.parentNode;
    }
}
function X(e) {
    return e.substr(2).toLowerCase();
}
function j() {
    this.cancelBubble = !0, this.immediatePropagationStopped || this.stopImmediatePropagation();
}
function z(r) {
    var e = function (e) {
        var n = e.type, t = 'click' === n || 'dblclick' === n;
        if (t && 0 !== e.button)
            return e.stopPropagation(), !1;
        e.stopPropagation = j;
        var o = { dom: document };
        Object.defineProperty(e, 'currentTarget', {
            configurable: !0,
            get: function () {
                return o.dom;
            }
        }), H(e, e.target, t, r, o);
    };
    return document.addEventListener(X(r), e), e;
}
function K(e, n) {
    var t = document.createElement('i');
    return t.innerHTML = n, t.innerHTML === e.innerHTML;
}
function Q(e, n) {
    return Boolean(n && n.dangerouslySetInnerHTML && n.dangerouslySetInnerHTML.__html && K(e, n.dangerouslySetInnerHTML.__html));
}
function q(e, n, t) {
    if (e[n]) {
        var o = e[n];
        o.event ? o.event(o.data, t) : o(t);
    } else {
        var r = n.toLowerCase();
        e[r] && e[r](t);
    }
}
function G(i, s) {
    var e = function (e) {
        e.stopPropagation();
        var n = this.$V;
        if (n) {
            var t = n.props || I, o = n.dom;
            if (v(i))
                q(t, i, e);
            else
                for (var r = 0; r < i.length; r++)
                    q(t, i[r], e);
            if (S(s)) {
                var a = this.$V, l = a.props || I;
                s(l, o, !1, a);
            }
        }
    };
    return Object.defineProperty(e, 'wrapped', {
        configurable: !1,
        enumerable: !1,
        value: !0,
        writable: !1
    }), e;
}
function J(e) {
    return 'checkbox' === e || 'radio' === e;
}
var Y = G('onInput', te), Z = G([
        'onClick',
        'onChange'
    ], te);
function ee(e) {
    e.stopPropagation();
}
function ne(e, n) {
    J(n.type) ? (e.onchange = Z, e.onclick = ee) : e.oninput = Y;
}
function te(e, n) {
    var t = e.type, o = e.value, r = e.checked, a = e.multiple, l = e.defaultValue, i = !x(o);
    t && t !== n.type && n.setAttribute('type', t), x(a) || a === n.multiple || (n.multiple = a), x(l) || i || (n.defaultValue = l + ''), J(t) ? (i && (n.value = o), x(r) || (n.checked = r)) : i && n.value !== o ? (n.defaultValue = o, n.value = o) : x(r) || (n.checked = r);
}
function oe(e, n) {
    if ('optgroup' === e.type) {
        var t = e.children, o = e.childFlags;
        if (12 & o)
            for (var r = 0, a = t.length; r < a; r++)
                re(t[r], n);
        else
            2 === o && re(t, n);
    } else
        re(e, n);
}
function re(e, n) {
    var t = e.props || I, o = e.dom;
    o.value = t.value, f(n) && -1 !== n.indexOf(t.value) || t.value === n ? o.selected = !0 : x(n) && x(t.selected) || (o.selected = t.selected || !1);
}
ee.wrapped = !0;
var ae = G('onChange', ie);
function le(e) {
    e.onchange = ae;
}
function ie(e, n, t, o) {
    var r = Boolean(e.multiple);
    x(e.multiple) || r === n.multiple || (n.multiple = r);
    var a = o.childFlags;
    if (0 == (1 & a)) {
        var l = o.children, i = e.value;
        if (t && x(i) && (i = e.defaultValue), 12 & a)
            for (var s = 0, c = l.length; s < c; s++)
                oe(l[s], i);
        else
            2 === a && oe(l, i);
    }
}
var se = G('onInput', fe), ce = G('onChange');
function ue(e, n) {
    e.oninput = se, n.onChange && (e.onchange = ce);
}
function fe(e, n, t) {
    var o = e.value, r = n.value;
    if (x(o)) {
        if (t) {
            var a = e.defaultValue;
            x(a) || a === r || (n.defaultValue = a, n.value = a);
        }
    } else
        r !== o && (n.defaultValue = o, n.value = o);
}
function de(e, n, t, o, r, a) {
    64 & e ? te(o, t) : 256 & e ? ie(o, t, r, n) : 128 & e && fe(o, t, r), a && (t.$V = n);
}
function pe(e, n, t) {
    64 & e ? ne(n, t) : 256 & e ? le(n) : 128 & e && ue(n, t);
}
function ve(e) {
    return e.type && J(e.type) ? !x(e.checked) : !x(e.value);
}
function me(e, n) {
    he(e), n && e.dom && (B(n, e.dom), e.dom = null);
}
function he(e) {
    var n = e.flags;
    if (481 & n) {
        var t = e.ref, o = e.props;
        S(t) && t(null);
        var r = e.children, a = e.childFlags;
        if (12 & a ? ge(r) : 2 === a && he(r), !h(o))
            for (var l in o)
                switch (l) {
                case 'onClick':
                case 'onDblClick':
                case 'onFocusIn':
                case 'onFocusOut':
                case 'onKeyDown':
                case 'onKeyPress':
                case 'onKeyUp':
                case 'onMouseDown':
                case 'onMouseMove':
                case 'onMouseUp':
                case 'onSubmit':
                case 'onTouchEnd':
                case 'onTouchMove':
                case 'onTouchStart':
                    _(l, null, e.dom);
                }
    } else {
        var i = e.children;
        if (i)
            if (14 & n) {
                var s = e.ref;
                4 & n ? (S(i.componentWillUnmount) && i.componentWillUnmount(), S(s) && s(null), i.$UN = !0, i.$LI && he(i.$LI)) : (!x(s) && S(s.onComponentWillUnmount) && s.onComponentWillUnmount(e.dom, e.props || I), he(i));
            } else
                1024 & n && me(i, e.type);
    }
}
function ge(e) {
    for (var n = 0, t = e.length; n < t; n++)
        he(e[n]);
}
function ye(e, n) {
    ge(n), e.textContent = '';
}
function $e(n, t) {
    return function (e) {
        n(t.data, e);
    };
}
function be(e, n, t) {
    var o = e.toLowerCase();
    if (S(n) || x(n)) {
        var r = t[o];
        r && r.wrapped || (t[o] = n);
    } else {
        var a = n.event;
        a && S(a) && (t[o] = $e(a, n));
    }
}
function ke(e, n) {
    switch (e) {
    case 'animationIterationCount':
    case 'borderImageOutset':
    case 'borderImageSlice':
    case 'borderImageWidth':
    case 'boxFlex':
    case 'boxFlexGroup':
    case 'boxOrdinalGroup':
    case 'columnCount':
    case 'fillOpacity':
    case 'flex':
    case 'flexGrow':
    case 'flexNegative':
    case 'flexOrder':
    case 'flexPositive':
    case 'flexShrink':
    case 'floodOpacity':
    case 'fontWeight':
    case 'gridColumn':
    case 'gridRow':
    case 'lineClamp':
    case 'lineHeight':
    case 'opacity':
    case 'order':
    case 'orphans':
    case 'stopOpacity':
    case 'strokeDasharray':
    case 'strokeDashoffset':
    case 'strokeMiterlimit':
    case 'strokeOpacity':
    case 'strokeWidth':
    case 'tabSize':
    case 'widows':
    case 'zIndex':
    case 'zoom':
        return n;
    default:
        return n + 'px';
    }
}
function Ce(e, n, t) {
    var o, r, a = t.style;
    if (v(n))
        a.cssText = n;
    else if (x(e) || v(e))
        for (o in n)
            r = n[o], a[o] = m(r) ? ke(o, r) : r;
    else {
        for (o in n)
            (r = n[o]) !== e[o] && (a[o] = m(r) ? ke(o, r) : r);
        for (o in e)
            x(n[o]) && (a[o] = '');
    }
}
function xe(e, n, t, o, r, a, l) {
    switch (e) {
    case 'onClick':
    case 'onDblClick':
    case 'onFocusIn':
    case 'onFocusOut':
    case 'onKeyDown':
    case 'onKeyPress':
    case 'onKeyUp':
    case 'onMouseDown':
    case 'onMouseMove':
    case 'onMouseUp':
    case 'onSubmit':
    case 'onTouchEnd':
    case 'onTouchMove':
    case 'onTouchStart':
        _(e, t, o);
        break;
    case 'children':
    case 'childrenType':
    case 'className':
    case 'defaultValue':
    case 'key':
    case 'multiple':
    case 'ref':
        break;
    case 'autoFocus':
        o.autofocus = !!t;
        break;
    case 'allowfullscreen':
    case 'autoplay':
    case 'capture':
    case 'checked':
    case 'controls':
    case 'default':
    case 'disabled':
    case 'hidden':
    case 'indeterminate':
    case 'loop':
    case 'muted':
    case 'novalidate':
    case 'open':
    case 'readOnly':
    case 'required':
    case 'reversed':
    case 'scoped':
    case 'seamless':
    case 'selected':
        o[e] = !!t;
        break;
    case 'defaultChecked':
    case 'value':
    case 'volume':
        if (a && 'value' === e)
            return;
        var i = x(t) ? '' : t;
        o[e] !== i && (o[e] = i);
        break;
    case 'dangerouslySetInnerHTML':
        var s = n && n.__html || '', c = t && t.__html || '';
        s !== c && (x(c) || K(o, c) || (h(l) || (12 & l.childFlags ? ge(l.children) : 2 === l.childFlags && he(l.children), l.children = null, l.childFlags = 1), o.innerHTML = c));
        break;
    default:
        'o' === e[0] && 'n' === e[1] ? be(e, t, o) : x(t) ? o.removeAttribute(e) : 'style' === e ? Ce(n, t, o) : r && D[e] ? o.setAttributeNS(D[e], e, t) : o.setAttribute(e, t);
    }
}
function Se(e, n, t, o, r) {
    var a = !1, l = 0 < (448 & n);
    for (var i in (l && (a = ve(t)) && pe(n, o, t), t))
        xe(i, null, t[i], o, r, a, null);
    l && de(n, e, o, t, !0, a);
}
function Pe(e, n, t, o) {
    var r = new n(t, o);
    if ((e.children = r).$V = e, r.$BS = !1, r.context = o, r.props === I && (r.props = t), r.$UN = !1, S(r.componentWillMount)) {
        if (r.$BR = !0, r.componentWillMount(), r.$PSS) {
            var a = r.state, l = r.$PS;
            if (h(a))
                r.state = l;
            else
                for (var i in l)
                    a[i] = l[i];
            r.$PSS = !1, r.$PS = null;
        }
        r.$BR = !1;
    }
    S(w.beforeRender) && w.beforeRender(r);
    var s, c = Ne(r.render(t, r.state, o), e);
    return S(r.getChildContext) && (s = r.getChildContext()), x(s) ? r.$CX = o : r.$CX = $(o, s), S(w.afterRender) && w.afterRender(r), r.$LI = c, r;
}
function Ne(e, n) {
    return p(e) ? e = s() : d(e) ? e = C(e, null) : (e.dom && (e = N(e)), 14 & e.flags && (e.parentVNode = n)), e;
}
function Ue(e, n, t, o) {
    var r = e.flags;
    return 481 & r ? Ve(e, n, t, o) : 14 & r ? De(e, n, t, o, 0 < (4 & r)) : 512 & r || 16 & r ? we(e, n) : 1024 & r ? (Ue(e.children, e.type, t, !1), e.dom = we(s(), n)) : void 0;
}
function we(e, n) {
    var t = e.dom = document.createTextNode(e.children);
    return h(n) || L(n, t), t;
}
function Ve(e, n, t, o) {
    var r = e.flags, a = e.children, l = e.props, i = e.className, s = e.ref, c = e.childFlags;
    o = o || 0 < (32 & r);
    var u = O(e.type, o);
    if (e.dom = u, x(i) || '' === i || (o ? u.setAttribute('class', i) : u.className = i), h(n) || L(n, u), 0 == (1 & c)) {
        var f = !0 === o && 'foreignObject' !== e.type;
        2 === c ? Ue(a, u, t, f) : 12 & c && Me(a, u, t, f);
    }
    return h(l) || Se(e, r, l, u, o), S(s) && Oe(u, s), u;
}
function Me(e, n, t, o) {
    for (var r = 0, a = e.length; r < a; r++) {
        var l = e[r];
        h(l.dom) || (e[r] = l = N(l)), Ue(l, n, t, o);
    }
}
function De(e, n, t, o, r) {
    var a, l = e.type, i = e.props || I, s = e.ref;
    if (r) {
        var c = Pe(e, l, i, t);
        e.dom = a = Ue(c.$LI, null, c.$CX, o), Fe(e, s, c), c.$UPD = !1;
    } else {
        var u = Ne(l(i, t), e);
        e.children = u, e.dom = a = Ue(u, null, t, o), Te(i, s, a);
    }
    return h(n) || L(n, a), a;
}
function Ie(e) {
    return function () {
        e.$UPD = !0, e.componentDidMount(), e.$UPD = !1;
    };
}
function Fe(e, n, t) {
    S(n) && n(t), S(t.componentDidMount) && F.push(Ie(t));
}
function Le(e, n, t) {
    return function () {
        return e.onComponentDidMount(n, t);
    };
}
function Te(e, n, t) {
    x(n) || (S(n.onComponentWillMount) && n.onComponentWillMount(e), S(n.onComponentDidMount) && F.push(Le(n, t, e)));
}
function Oe(e, n) {
    F.push(function () {
        return n(e);
    });
}
function Re(e, n, t, o, r) {
    var a = e.type, l = e.ref, i = e.props || I;
    if (r) {
        var s = Pe(e, a, i, t), c = s.$LI;
        Ee(c, n, s.$CX, o), e.dom = c.dom, Fe(e, l, s), s.$UPD = !1;
    } else {
        var u = Ne(a(i, t), e);
        Ee(u, n, t, o), e.children = u, e.dom = u.dom, Te(i, l, n);
    }
}
function Be(e, n, t, o) {
    var r = e.children, a = e.props, l = e.className, i = e.flags, s = e.ref;
    if (o = o || 0 < (32 & i), 1 !== n.nodeType || n.tagName.toLowerCase() !== e.type) {
        var c = Ve(e, null, t, o);
        e.dom = c, R(n.parentNode, c, n);
    } else {
        var u = (e.dom = n).firstChild, f = e.childFlags;
        if (0 == (1 & f)) {
            for (var d = null; u;)
                d = u.nextSibling, 8 === u.nodeType && ('!' === u.data ? n.replaceChild(document.createTextNode(''), u) : n.removeChild(u)), u = d;
            if (u = n.firstChild, 2 === f)
                h(u) ? Ue(r, n, t, o) : (d = u.nextSibling, Ee(r, u, t, o), u = d);
            else if (12 & f)
                for (var p = 0, v = r.length; p < v; p++) {
                    var m = r[p];
                    h(u) ? Ue(m, n, t, o) : (d = u.nextSibling, Ee(m, u, t, o), u = d);
                }
            for (; u;)
                d = u.nextSibling, n.removeChild(u), u = d;
        } else
            h(n.firstChild) || Q(n, a) || (n.textContent = '', 448 & i && (n.defaultValue = ''));
        h(a) || Se(e, i, a, n, o), x(l) ? '' !== n.className && n.removeAttribute('class') : o ? n.setAttribute('class', l) : n.className = l, S(s) && Oe(n, s);
    }
}
function We(e, n) {
    if (3 !== n.nodeType) {
        var t = we(e, null);
        e.dom = t, R(n.parentNode, t, n);
    } else {
        var o = e.children;
        n.nodeValue !== o && (n.nodeValue = o), e.dom = n;
    }
}
function Ee(e, n, t, o) {
    var r = e.flags;
    14 & r ? Re(e, n, t, o, 0 < (4 & r)) : 481 & r ? Be(e, n, t, o) : 16 & r ? We(e, n) : 512 & r ? e.dom = n : a();
}
function Ae(e, n, t) {
    var o = n.firstChild;
    if (!h(o))
        for (p(e) || Ee(e, o, I, !1), o = n.firstChild; o = o.nextSibling;)
            n.removeChild(o);
    0 < F.length && W(F), n.$V = e, S(t) && t();
}
function _e(e, n, t, o, r) {
    he(e), R(t, Ue(n, null, o, r), e.dom);
}
function He(e, n, t, o, r) {
    var a = 0 | n.flags;
    e.flags !== a || 2048 & a ? _e(e, n, t, o, r) : 481 & a ? ze(e, n, t, o, r, a) : 14 & a ? qe(e, n, t, o, r, 0 < (4 & a)) : 16 & a ? Ge(e, n) : 512 & a ? n.dom = e.dom : je(e, n, o);
}
function Xe(e, n) {
    e.textContent !== n.children && (e.textContent = n.children);
}
function je(e, n, t) {
    var o = e.type, r = n.type, a = n.children;
    if (Ke(e.childFlags, n.childFlags, e.children, a, o, t, !1), n.dom = e.dom, o !== r && !p(a)) {
        var l = a.dom;
        o.removeChild(l), r.appendChild(l);
    }
}
function ze(e, n, t, o, r, a) {
    var l = n.type;
    if (e.type !== l)
        _e(e, n, t, o, r);
    else {
        var i, s = e.dom, c = e.props, u = n.props, f = !1, d = !1;
        if (n.dom = s, r = r || 0 < (32 & a), c !== u) {
            var p = c || I;
            if ((i = u || I) !== I)
                for (var v in ((f = 0 < (448 & a)) && (d = ve(i)), i)) {
                    var m = p[v], h = i[v];
                    m !== h && xe(v, m, h, s, r, d, e);
                }
            if (p !== I)
                for (var g in p)
                    i.hasOwnProperty(g) || x(p[g]) || xe(g, p[g], null, s, r, d, e);
        }
        var y = e.children, $ = n.children, b = n.ref, k = e.className, C = n.className;
        4096 & a ? Xe(s, $) : Ke(e.childFlags, n.childFlags, y, $, s, o, r && 'foreignObject' !== l), f && de(a, n, s, i, !1, d), k !== C && (x(C) ? s.removeAttribute('class') : r ? s.setAttribute('class', C) : s.className = C), S(b) && e.ref !== b && Oe(s, b);
    }
}
function Ke(e, n, t, o, r, a, l) {
    switch (e) {
    case 2:
        switch (n) {
        case 2:
            He(t, o, r, a, l);
            break;
        case 1:
            me(t, r);
            break;
        default:
            me(t, r), Me(o, r, a, l);
        }
        break;
    case 1:
        switch (n) {
        case 2:
            Ue(o, r, a, l);
            break;
        case 1:
            break;
        default:
            Me(o, r, a, l);
        }
        break;
    default:
        if (12 & n) {
            var i = t.length, s = o.length;
            0 === i ? 0 < s && Me(o, r, a, l) : 0 === s ? ye(r, t) : 8 === n && 8 === e ? Ye(t, o, r, a, l, i, s) : Je(t, o, r, a, l, i, s);
        } else
            1 === n ? ye(r, t) : 2 === n && (ye(r, t), Ue(o, r, a, l));
    }
}
function Qe(e, n, t, o, r, a, l, i, s) {
    var c, u = e.state, f = e.props;
    if (!(t.children = e).$UN) {
        if (f !== o || o === I) {
            if (!s && S(e.componentWillReceiveProps)) {
                if (e.$BR = !0, e.componentWillReceiveProps(o, a), e.$UN)
                    return;
                e.$BR = !1;
            }
            e.$PSS && (n = $(n, e.$PS), e.$PSS = !1, e.$PS = null);
        }
        var d = Boolean(e.shouldComponentUpdate);
        if (i || !d || d && e.shouldComponentUpdate(o, n, a)) {
            S(e.componentWillUpdate) && (e.$BS = !0, e.componentWillUpdate(o, n, a), e.$BS = !1), e.props = o, e.state = n, e.context = a, S(w.beforeRender) && w.beforeRender(e), c = e.render(o, n, a), S(w.afterRender) && w.afterRender(e);
            var p, v = c !== g;
            if (S(e.getChildContext) && (p = e.getChildContext()), p = x(p) ? a : $(a, p), e.$CX = p, v) {
                var m = e.$LI, h = Ne(c, t);
                He(m, h, r, p, l), e.$LI = h, S(e.componentDidUpdate) && e.componentDidUpdate(f, u);
            }
        } else
            e.props = o, e.state = n, e.context = a;
        t.dom = e.$LI.dom;
    }
}
function qe(e, n, t, o, r, a) {
    var l = n.type, i = e.key, s = n.key;
    if (e.type !== l || i !== s)
        _e(e, n, t, o, r);
    else {
        var c = n.props || I;
        if (a) {
            var u = e.children;
            u.$UPD = !0, u.$V = n, Qe(u, u.state, n, c, t, o, r, !1, !1), u.$UPD = !1;
        } else {
            var f = !0, d = e.props, p = n.ref, v = !x(p), m = e.children;
            if (n.dom = e.dom, n.children = m, v && S(p.onComponentShouldUpdate) && (f = p.onComponentShouldUpdate(d, c)), !1 !== f) {
                v && S(p.onComponentWillUpdate) && p.onComponentWillUpdate(d, c);
                var h = l(c, o);
                h !== g && (He(m, h = Ne(h, n), t, o, r), n.children = h, n.dom = h.dom, v && S(p.onComponentDidUpdate) && p.onComponentDidUpdate(d, c));
            } else
                14 & m.flags && (m.parentVNode = n);
        }
    }
}
function Ge(e, n) {
    var t = n.children, o = e.dom;
    t !== e.children && (o.nodeValue = t), n.dom = o;
}
function Je(e, n, t, o, r, a, l) {
    for (var i, s, c = l < a ? l : a, u = 0; u < c; u++)
        i = n[u], s = e[u], i.dom && (i = n[u] = N(i)), He(s, i, t, o, r), e[u] = i;
    if (a < l)
        for (u = c; u < l; u++)
            (i = n[u]).dom && (i = n[u] = N(i)), Ue(i, t, o, r);
    else if (l < a)
        for (u = c; u < a; u++)
            me(e[u], t);
}
function Ye(e, n, t, o, r, a, l) {
    var i, s, c = a - 1, u = l - 1, f = 0, d = e[f], p = n[f];
    e: {
        for (; d.key === p.key;) {
            if (p.dom && (n[f] = p = N(p)), He(d, p, t, o, r), e[f] = p, c < ++f || u < f)
                break e;
            d = e[f], p = n[f];
        }
        for (d = e[c], p = n[u]; d.key === p.key;) {
            if (p.dom && (n[u] = p = N(p)), He(d, p, t, o, r), e[c] = p, u--, --c < f || u < f)
                break e;
            d = e[c], p = n[u];
        }
    }
    if (c < f) {
        if (f <= u)
            for (var v = (s = u + 1) < l ? n[s].dom : null; f <= u;)
                (p = n[f]).dom && (n[f] = p = N(p)), f++, T(t, Ue(p, null, o, r), v);
    } else if (u < f)
        for (; f <= c;)
            me(e[f++], t);
    else {
        var m = f, h = f, g = c - f + 1, y = u - f + 1, $ = [];
        for (i = 0; i < y; i++)
            $.push(0);
        var b = g === a, k = !1, C = 0, x = 0;
        if (l < 4 || (g | y) < 32)
            for (i = m; i <= c; i++)
                if (d = e[i], x < y) {
                    for (f = h; f <= u; f++)
                        if (p = n[f], d.key === p.key) {
                            if ($[f - h] = i + 1, b)
                                for (b = !1; m < i;)
                                    me(e[m++], t);
                            f < C ? k = !0 : C = f, p.dom && (n[f] = p = N(p)), He(d, p, t, o, r), x++;
                            break;
                        }
                    !b && u < f && me(d, t);
                } else
                    b || me(d, t);
        else {
            var S = {};
            for (i = h; i <= u; i++)
                S[n[i].key] = i;
            for (i = m; i <= c; i++)
                if (d = e[i], x < y)
                    if (void 0 !== (f = S[d.key])) {
                        if (b)
                            for (b = !1; m < i;)
                                me(e[m++], t);
                        p = n[f], $[f - h] = i + 1, f < C ? k = !0 : C = f, p.dom && (n[f] = p = N(p)), He(d, p, t, o, r), x++;
                    } else
                        b || me(d, t);
                else
                    b || me(d, t);
        }
        if (b)
            ye(t, e), Me(n, t, o, r);
        else if (k) {
            var P = Ze($);
            for (f = P.length - 1, i = y - 1; 0 <= i; i--)
                0 === $[i] ? ((p = n[C = i + h]).dom && (n[C] = p = N(p)), s = C + 1, T(t, Ue(p, null, o, r), s < l ? n[s].dom : null)) : f < 0 || i !== P[f] ? (s = (C = i + h) + 1, T(t, (p = n[C]).dom, s < l ? n[s].dom : null)) : f--;
        } else if (x !== y)
            for (i = y - 1; 0 <= i; i--)
                0 === $[i] && ((p = n[C = i + h]).dom && (n[C] = p = N(p)), s = C + 1, T(t, Ue(p, null, o, r), s < l ? n[s].dom : null));
    }
}
function Ze(e) {
    var n, t, o, r, a, l = e.slice(), i = [0], s = e.length;
    for (n = 0; n < s; n++) {
        var c = e[n];
        if (0 !== c) {
            if (e[t = i[i.length - 1]] < c) {
                l[n] = t, i.push(n);
                continue;
            }
            for (o = 0, r = i.length - 1; o < r;)
                e[i[a = (o + r) / 2 | 0]] < c ? o = a + 1 : r = a;
            c < e[i[o]] && (0 < o && (l[n] = i[o - 1]), i[o] = n);
        }
    }
    for (r = i[(o = i.length) - 1]; 0 < o--;)
        r = l[i[o] = r];
    return i;
}
var en = e ? document.body : null;
function nn(e, n, t) {
    if (e !== g) {
        var o = n.$V;
        return x(o) ? p(e) || (e.dom && (e = N(e)), h(n.firstChild) ? (Ue(e, n, I, !1), n.$V = e) : Ae(e, n), o = e) : x(e) ? (me(o, n), n.$V = null) : (e.dom && (e = N(e)), He(o, e, n, I, !1), o = n.$V = e), 0 < F.length && W(F), S(t) && t(), S(w.renderComplete) && w.renderComplete(o), o && 14 & o.flags ? o.children : void 0;
    }
}
function tn(t) {
    return function (e, n) {
        t || (t = e), nn(n, t);
    };
}
function on(e, n) {
    return l(1024, n, null, e, 0, null, p(e) ? null : e.key, null);
}
var rn = 'undefined' == typeof Promise ? null : Promise.resolve(), an = 'undefined' == typeof requestAnimationFrame ? setTimeout : requestAnimationFrame.bind(window);
function ln(e) {
    return rn ? rn.then(e) : an(e);
}
function sn(e, n, t, o) {
    S(n) && (n = n(e.state, e.props, e.context));
    var r = e.$PS;
    if (x(r))
        e.$PS = n;
    else
        for (var a in n)
            r[a] = n[a];
    if (e.$PSS || e.$BR)
        e.$PSS = !0, e.$BR && S(t) && F.push(t.bind(e));
    else if (e.$UPD) {
        var l = e.$QU;
        h(l) && ln(cn(e, l = e.$QU = [])), S(t) && l.push(t);
    } else
        e.$PSS = !0, e.$UPD = !0, un(e, o, t), e.$UPD = !1;
}
function cn(t, o) {
    return function () {
        t.$QU = null, t.$UPD = !0, un(t, !1, function () {
            for (var e = 0, n = o.length; e < n; e++)
                o[e].call(t);
        }), t.$UPD = !1;
    };
}
function un(e, n, t) {
    if (!e.$UN) {
        if (n || !e.$BR) {
            e.$PSS = !1;
            var o = e.$PS, r = $(e.state, o), a = e.props, l = e.context;
            e.$PS = null;
            var i = e.$V, s = e.$LI;
            if (Qe(e, r, i, a, s.dom && s.dom.parentNode, l, 0 < (32 & i.flags), n, !0), e.$UN)
                return;
            if (0 == (1024 & e.$LI.flags))
                for (var c = e.$LI.dom; !h(i = i.parentVNode);)
                    0 < (14 & i.flags) && (i.dom = c);
            0 < F.length && W(F);
        } else
            e.state = e.$PS, e.$PS = null;
        S(t) && t.call(e);
    }
}
var fn = function (e, n) {
    this.state = null, this.$BR = !1, this.$BS = !0, this.$PSS = !1, this.$PS = null, this.$LI = null, this.$V = null, this.$UN = !1, this.$CX = null, this.$UPD = !0, this.$QU = null, this.props = e || I, this.context = n || I;
};
fn.prototype.forceUpdate = function (e) {
    this.$UN || sn(this, {}, e, !0);
}, fn.prototype.setState = function (e, n) {
    this.$UN || this.$BS || sn(this, e, n, !1);
}, fn.prototype.render = function (e, n, t) {
};
var dn = Object.freeze({}), pn = '5.6.1';
exports.Component = fn, exports.EMPTY_OBJ = I, exports.NO_OP = g, exports.createComponentVNode = i, exports.createPortal = on, exports.createRenderer = tn, exports.createTextVNode = C, exports.createVNode = l, exports.directClone = N, exports.getFlagsForElementVnode = r, exports.getNumberStyleValue = ke, exports.hydrate = Ae, exports.linkEvent = c, exports.normalizeProps = o, exports.options = w, exports.render = nn, exports.version = pn, exports.JSX = dn;
}
// tslib/tslib.js
$fsx.f[240] = function(module,exports){
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __createBinding;
(function (factory) {
    var root = 'undefined' === 'object' ? global : typeof self === 'object' ? self : typeof this === 'object' ? this : {};
    if ('undefined' === 'function' && define.amd) {
        define('tslib', ['exports'], function (exports) {
            factory(createExporter(root, createExporter(exports)));
        });
    } else if ('object' === 'object' && typeof module.exports === 'object') {
        factory(createExporter(root, createExporter(module.exports)));
    } else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === 'function') {
                Object.defineProperty(exports, '__esModule', { value: true });
            } else {
                exports.__esModule = true;
            }
        }
        return function (id, v) {
            return exports[id] = previous ? previous(id, v) : v;
        };
    }
}(function (exporter) {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p))
                d[p] = b[p];
    };
    __extends = function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    __rest = function (s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === 'function')
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };
    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    __param = function (paramIndex, decorator) {
        return function (target, key) {
            decorator(target, key, paramIndex);
        };
    };
    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
            return Reflect.metadata(metadataKey, metadataValue);
    };
    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P ? value : new P(function (resolve) {
                resolve(value);
            });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    __generator = function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1)
                        throw t[1];
                    return t[1];
                },
                trys: [],
                ops: []
            }, f, y, t, g;
        return g = {
            next: verb(0),
            'throw': verb(1),
            'return': verb(2)
        }, typeof Symbol === 'function' && (g[Symbol.iterator] = function () {
            return this;
        }), g;
        function verb(n) {
            return function (v) {
                return step([
                    n,
                    v
                ]);
            };
        }
        function step(op) {
            if (f)
                throw new TypeError('Generator is already executing.');
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [
                            op[0] & 2,
                            t.value
                        ];
                    switch (op[0]) {
                    case 0:
                    case 1:
                        t = op;
                        break;
                    case 4:
                        _.label++;
                        return {
                            value: op[1],
                            done: false
                        };
                    case 5:
                        _.label++;
                        y = op[1];
                        op = [0];
                        continue;
                    case 7:
                        op = _.ops.pop();
                        _.trys.pop();
                        continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;
                            continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];
                            break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];
                            t = op;
                            break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];
                            _.ops.push(op);
                            break;
                        }
                        if (t[2])
                            _.ops.pop();
                        _.trys.pop();
                        continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [
                        6,
                        e
                    ];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return {
                value: op[0] ? op[1] : void 0,
                done: true
            };
        }
    };
    __exportStar = function (m, o) {
        for (var p in m)
            if (p !== 'default' && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    };
    __createBinding = Object.create ? function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, {
            enumerable: true,
            get: function () {
                return m[k];
            }
        });
    } : function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    };
    __values = function (o) {
        var s = typeof Symbol === 'function' && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === 'number')
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return {
                        value: o && o[i++],
                        done: !o
                    };
                }
            };
        throw new TypeError(s ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
    };
    __read = function (o, n) {
        var m = typeof Symbol === 'function' && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        } catch (error) {
            e = { error: error };
        } finally {
            try {
                if (r && !r.done && (m = i['return']))
                    m.call(i);
            } finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    };
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };
    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };
    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError('Symbol.asyncIterator is not defined.');
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb('next'), verb('throw'), verb('return'), i[Symbol.asyncIterator] = function () {
            return this;
        }, i;
        function verb(n) {
            if (g[n])
                i[n] = function (v) {
                    return new Promise(function (a, b) {
                        q.push([
                            n,
                            v,
                            a,
                            b
                        ]) > 1 || resume(n, v);
                    });
                };
        }
        function resume(n, v) {
            try {
                step(g[n](v));
            } catch (e) {
                settle(q[0][3], e);
            }
        }
        function step(r) {
            r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
        }
        function fulfill(value) {
            resume('next', value);
        }
        function reject(value) {
            resume('throw', value);
        }
        function settle(f, v) {
            if (f(v), q.shift(), q.length)
                resume(q[0][0], q[0][1]);
        }
    };
    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb('next'), verb('throw', function (e) {
            throw e;
        }), verb('return'), i[Symbol.iterator] = function () {
            return this;
        }, i;
        function verb(n, f) {
            i[n] = o[n] ? function (v) {
                return (p = !p) ? {
                    value: __await(o[n](v)),
                    done: n === 'return'
                } : f ? f(v) : v;
            } : f;
        }
    };
    __asyncValues = function (o) {
        if (!Symbol.asyncIterator)
            throw new TypeError('Symbol.asyncIterator is not defined.');
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === 'function' ? __values(o) : o[Symbol.iterator](), i = {}, verb('next'), verb('throw'), verb('return'), i[Symbol.asyncIterator] = function () {
            return this;
        }, i);
        function verb(n) {
            i[n] = o[n] && function (v) {
                return new Promise(function (resolve, reject) {
                    v = o[n](v), settle(resolve, reject, v.done, v.value);
                });
            };
        }
        function settle(resolve, reject, d, v) {
            Promise.resolve(v).then(function (v) {
                resolve({
                    value: v,
                    done: d
                });
            }, reject);
        }
    };
    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, 'raw', { value: raw });
        } else {
            cooked.raw = raw;
        }
        return cooked;
    };
    var __setModuleDefault = Object.create ? function (o, v) {
        Object.defineProperty(o, 'default', {
            enumerable: true,
            value: v
        });
    } : function (o, v) {
        o['default'] = v;
    };
    __importStar = function (mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
    __importDefault = function (mod) {
        return mod && mod.__esModule ? mod : { 'default': mod };
    };
    __classPrivateFieldGet = function (receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to get private field on non-instance');
        }
        return privateMap.get(receiver);
    };
    __classPrivateFieldSet = function (receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError('attempted to set private field on non-instance');
        }
        privateMap.set(receiver, value);
        return value;
    };
    exporter('__extends', __extends);
    exporter('__assign', __assign);
    exporter('__rest', __rest);
    exporter('__decorate', __decorate);
    exporter('__param', __param);
    exporter('__metadata', __metadata);
    exporter('__awaiter', __awaiter);
    exporter('__generator', __generator);
    exporter('__exportStar', __exportStar);
    exporter('__createBinding', __createBinding);
    exporter('__values', __values);
    exporter('__read', __read);
    exporter('__spread', __spread);
    exporter('__spreadArrays', __spreadArrays);
    exporter('__await', __await);
    exporter('__asyncGenerator', __asyncGenerator);
    exporter('__asyncDelegator', __asyncDelegator);
    exporter('__asyncValues', __asyncValues);
    exporter('__makeTemplateObject', __makeTemplateObject);
    exporter('__importStar', __importStar);
    exporter('__importDefault', __importDefault);
    exporter('__classPrivateFieldGet', __classPrivateFieldGet);
    exporter('__classPrivateFieldSet', __classPrivateFieldSet);
}));
}
// xxhashjs/lib/index.js
$fsx.f[241] = function(module,exports){
module.exports = {
    h32: $fsx.r(242),
    h64: $fsx.r(243)
};
}
// xxhashjs/lib/xxhash.js
$fsx.f[242] = function(module,exports){
var Buffer = $fsx.r(230).Buffer;
var UINT32 = $fsx.r(231).UINT32;
UINT32.prototype.xxh_update = function (low, high) {
    var b00 = PRIME32_2._low;
    var b16 = PRIME32_2._high;
    var c16, c00;
    c00 = low * b00;
    c16 = c00 >>> 16;
    c16 += high * b00;
    c16 &= 65535;
    c16 += low * b16;
    var a00 = this._low + (c00 & 65535);
    var a16 = a00 >>> 16;
    a16 += this._high + (c16 & 65535);
    var v = a16 << 16 | a00 & 65535;
    v = v << 13 | v >>> 19;
    a00 = v & 65535;
    a16 = v >>> 16;
    b00 = PRIME32_1._low;
    b16 = PRIME32_1._high;
    c00 = a00 * b00;
    c16 = c00 >>> 16;
    c16 += a16 * b00;
    c16 &= 65535;
    c16 += a00 * b16;
    this._low = c00 & 65535;
    this._high = c16 & 65535;
};
var PRIME32_1 = UINT32('2654435761');
var PRIME32_2 = UINT32('2246822519');
var PRIME32_3 = UINT32('3266489917');
var PRIME32_4 = UINT32('668265263');
var PRIME32_5 = UINT32('374761393');
function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0, n = str.length; i < n; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 128)
            utf8.push(charcode);
        else if (charcode < 2048) {
            utf8.push(192 | charcode >> 6, 128 | charcode & 63);
        } else if (charcode < 55296 || charcode >= 57344) {
            utf8.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
        } else {
            i++;
            charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
            utf8.push(240 | charcode >> 18, 128 | charcode >> 12 & 63, 128 | charcode >> 6 & 63, 128 | charcode & 63);
        }
    }
    return new Uint8Array(utf8);
}
function XXH() {
    if (arguments.length == 2)
        return new XXH(arguments[1]).update(arguments[0]).digest();
    if (!(this instanceof XXH))
        return new XXH(arguments[0]);
    init.call(this, arguments[0]);
}
function init(seed) {
    this.seed = seed instanceof UINT32 ? seed.clone() : UINT32(seed);
    this.v1 = this.seed.clone().add(PRIME32_1).add(PRIME32_2);
    this.v2 = this.seed.clone().add(PRIME32_2);
    this.v3 = this.seed.clone();
    this.v4 = this.seed.clone().subtract(PRIME32_1);
    this.total_len = 0;
    this.memsize = 0;
    this.memory = null;
    return this;
}
XXH.prototype.init = init;
XXH.prototype.update = function (input) {
    var isString = typeof input == 'string';
    var isArrayBuffer;
    if (isString) {
        input = toUTF8Array(input);
        isString = false;
        isArrayBuffer = true;
    }
    if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        isArrayBuffer = true;
        input = new Uint8Array(input);
    }
    var p = 0;
    var len = input.length;
    var bEnd = p + len;
    if (len == 0)
        return this;
    this.total_len += len;
    if (this.memsize == 0) {
        if (isString) {
            this.memory = '';
        } else if (isArrayBuffer) {
            this.memory = new Uint8Array(16);
        } else {
            this.memory = new Buffer(16);
        }
    }
    if (this.memsize + len < 16) {
        if (isString) {
            this.memory += input;
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(0, len), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, 0, len);
        }
        this.memsize += len;
        return this;
    }
    if (this.memsize > 0) {
        if (isString) {
            this.memory += input.slice(0, 16 - this.memsize);
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(0, 16 - this.memsize), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, 0, 16 - this.memsize);
        }
        var p32 = 0;
        if (isString) {
            this.v1.xxh_update(this.memory.charCodeAt(p32 + 1) << 8 | this.memory.charCodeAt(p32), this.memory.charCodeAt(p32 + 3) << 8 | this.memory.charCodeAt(p32 + 2));
            p32 += 4;
            this.v2.xxh_update(this.memory.charCodeAt(p32 + 1) << 8 | this.memory.charCodeAt(p32), this.memory.charCodeAt(p32 + 3) << 8 | this.memory.charCodeAt(p32 + 2));
            p32 += 4;
            this.v3.xxh_update(this.memory.charCodeAt(p32 + 1) << 8 | this.memory.charCodeAt(p32), this.memory.charCodeAt(p32 + 3) << 8 | this.memory.charCodeAt(p32 + 2));
            p32 += 4;
            this.v4.xxh_update(this.memory.charCodeAt(p32 + 1) << 8 | this.memory.charCodeAt(p32), this.memory.charCodeAt(p32 + 3) << 8 | this.memory.charCodeAt(p32 + 2));
        } else {
            this.v1.xxh_update(this.memory[p32 + 1] << 8 | this.memory[p32], this.memory[p32 + 3] << 8 | this.memory[p32 + 2]);
            p32 += 4;
            this.v2.xxh_update(this.memory[p32 + 1] << 8 | this.memory[p32], this.memory[p32 + 3] << 8 | this.memory[p32 + 2]);
            p32 += 4;
            this.v3.xxh_update(this.memory[p32 + 1] << 8 | this.memory[p32], this.memory[p32 + 3] << 8 | this.memory[p32 + 2]);
            p32 += 4;
            this.v4.xxh_update(this.memory[p32 + 1] << 8 | this.memory[p32], this.memory[p32 + 3] << 8 | this.memory[p32 + 2]);
        }
        p += 16 - this.memsize;
        this.memsize = 0;
        if (isString)
            this.memory = '';
    }
    if (p <= bEnd - 16) {
        var limit = bEnd - 16;
        do {
            if (isString) {
                this.v1.xxh_update(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2));
                p += 4;
                this.v2.xxh_update(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2));
                p += 4;
                this.v3.xxh_update(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2));
                p += 4;
                this.v4.xxh_update(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2));
            } else {
                this.v1.xxh_update(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2]);
                p += 4;
                this.v2.xxh_update(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2]);
                p += 4;
                this.v3.xxh_update(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2]);
                p += 4;
                this.v4.xxh_update(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2]);
            }
            p += 4;
        } while (p <= limit);
    }
    if (p < bEnd) {
        if (isString) {
            this.memory += input.slice(p);
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(p, bEnd), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, p, bEnd);
        }
        this.memsize = bEnd - p;
    }
    return this;
};
XXH.prototype.digest = function () {
    var input = this.memory;
    var isString = typeof input == 'string';
    var p = 0;
    var bEnd = this.memsize;
    var h32, h;
    var u = new UINT32();
    if (this.total_len >= 16) {
        h32 = this.v1.rotl(1).add(this.v2.rotl(7).add(this.v3.rotl(12).add(this.v4.rotl(18))));
    } else {
        h32 = this.seed.clone().add(PRIME32_5);
    }
    h32.add(u.fromNumber(this.total_len));
    while (p <= bEnd - 4) {
        if (isString) {
            u.fromBits(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2));
        } else {
            u.fromBits(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2]);
        }
        h32.add(u.multiply(PRIME32_3)).rotl(17).multiply(PRIME32_4);
        p += 4;
    }
    while (p < bEnd) {
        u.fromBits(isString ? input.charCodeAt(p++) : input[p++], 0);
        h32.add(u.multiply(PRIME32_5)).rotl(11).multiply(PRIME32_1);
    }
    h = h32.clone().shiftRight(15);
    h32.xor(h).multiply(PRIME32_2);
    h = h32.clone().shiftRight(13);
    h32.xor(h).multiply(PRIME32_3);
    h = h32.clone().shiftRight(16);
    h32.xor(h);
    this.init(this.seed);
    return h32;
};
module.exports = XXH;
}
// xxhashjs/lib/xxhash64.js
$fsx.f[243] = function(module,exports){
var Buffer = $fsx.r(230).Buffer;
var UINT64 = $fsx.r(231).UINT64;
var PRIME64_1 = UINT64('11400714785074694791');
var PRIME64_2 = UINT64('14029467366897019727');
var PRIME64_3 = UINT64('1609587929392839161');
var PRIME64_4 = UINT64('9650029242287828579');
var PRIME64_5 = UINT64('2870177450012600261');
function toUTF8Array(str) {
    var utf8 = [];
    for (var i = 0, n = str.length; i < n; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 128)
            utf8.push(charcode);
        else if (charcode < 2048) {
            utf8.push(192 | charcode >> 6, 128 | charcode & 63);
        } else if (charcode < 55296 || charcode >= 57344) {
            utf8.push(224 | charcode >> 12, 128 | charcode >> 6 & 63, 128 | charcode & 63);
        } else {
            i++;
            charcode = 65536 + ((charcode & 1023) << 10 | str.charCodeAt(i) & 1023);
            utf8.push(240 | charcode >> 18, 128 | charcode >> 12 & 63, 128 | charcode >> 6 & 63, 128 | charcode & 63);
        }
    }
    return new Uint8Array(utf8);
}
function XXH64() {
    if (arguments.length == 2)
        return new XXH64(arguments[1]).update(arguments[0]).digest();
    if (!(this instanceof XXH64))
        return new XXH64(arguments[0]);
    init.call(this, arguments[0]);
}
function init(seed) {
    this.seed = seed instanceof UINT64 ? seed.clone() : UINT64(seed);
    this.v1 = this.seed.clone().add(PRIME64_1).add(PRIME64_2);
    this.v2 = this.seed.clone().add(PRIME64_2);
    this.v3 = this.seed.clone();
    this.v4 = this.seed.clone().subtract(PRIME64_1);
    this.total_len = 0;
    this.memsize = 0;
    this.memory = null;
    return this;
}
XXH64.prototype.init = init;
XXH64.prototype.update = function (input) {
    var isString = typeof input == 'string';
    var isArrayBuffer;
    if (isString) {
        input = toUTF8Array(input);
        isString = false;
        isArrayBuffer = true;
    }
    if (typeof ArrayBuffer !== 'undefined' && input instanceof ArrayBuffer) {
        isArrayBuffer = true;
        input = new Uint8Array(input);
    }
    var p = 0;
    var len = input.length;
    var bEnd = p + len;
    if (len == 0)
        return this;
    this.total_len += len;
    if (this.memsize == 0) {
        if (isString) {
            this.memory = '';
        } else if (isArrayBuffer) {
            this.memory = new Uint8Array(32);
        } else {
            this.memory = new Buffer(32);
        }
    }
    if (this.memsize + len < 32) {
        if (isString) {
            this.memory += input;
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(0, len), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, 0, len);
        }
        this.memsize += len;
        return this;
    }
    if (this.memsize > 0) {
        if (isString) {
            this.memory += input.slice(0, 32 - this.memsize);
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(0, 32 - this.memsize), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, 0, 32 - this.memsize);
        }
        var p64 = 0;
        if (isString) {
            var other;
            other = UINT64(this.memory.charCodeAt(p64 + 1) << 8 | this.memory.charCodeAt(p64), this.memory.charCodeAt(p64 + 3) << 8 | this.memory.charCodeAt(p64 + 2), this.memory.charCodeAt(p64 + 5) << 8 | this.memory.charCodeAt(p64 + 4), this.memory.charCodeAt(p64 + 7) << 8 | this.memory.charCodeAt(p64 + 6));
            this.v1.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory.charCodeAt(p64 + 1) << 8 | this.memory.charCodeAt(p64), this.memory.charCodeAt(p64 + 3) << 8 | this.memory.charCodeAt(p64 + 2), this.memory.charCodeAt(p64 + 5) << 8 | this.memory.charCodeAt(p64 + 4), this.memory.charCodeAt(p64 + 7) << 8 | this.memory.charCodeAt(p64 + 6));
            this.v2.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory.charCodeAt(p64 + 1) << 8 | this.memory.charCodeAt(p64), this.memory.charCodeAt(p64 + 3) << 8 | this.memory.charCodeAt(p64 + 2), this.memory.charCodeAt(p64 + 5) << 8 | this.memory.charCodeAt(p64 + 4), this.memory.charCodeAt(p64 + 7) << 8 | this.memory.charCodeAt(p64 + 6));
            this.v3.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory.charCodeAt(p64 + 1) << 8 | this.memory.charCodeAt(p64), this.memory.charCodeAt(p64 + 3) << 8 | this.memory.charCodeAt(p64 + 2), this.memory.charCodeAt(p64 + 5) << 8 | this.memory.charCodeAt(p64 + 4), this.memory.charCodeAt(p64 + 7) << 8 | this.memory.charCodeAt(p64 + 6));
            this.v4.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
        } else {
            var other;
            other = UINT64(this.memory[p64 + 1] << 8 | this.memory[p64], this.memory[p64 + 3] << 8 | this.memory[p64 + 2], this.memory[p64 + 5] << 8 | this.memory[p64 + 4], this.memory[p64 + 7] << 8 | this.memory[p64 + 6]);
            this.v1.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory[p64 + 1] << 8 | this.memory[p64], this.memory[p64 + 3] << 8 | this.memory[p64 + 2], this.memory[p64 + 5] << 8 | this.memory[p64 + 4], this.memory[p64 + 7] << 8 | this.memory[p64 + 6]);
            this.v2.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory[p64 + 1] << 8 | this.memory[p64], this.memory[p64 + 3] << 8 | this.memory[p64 + 2], this.memory[p64 + 5] << 8 | this.memory[p64 + 4], this.memory[p64 + 7] << 8 | this.memory[p64 + 6]);
            this.v3.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            p64 += 8;
            other = UINT64(this.memory[p64 + 1] << 8 | this.memory[p64], this.memory[p64 + 3] << 8 | this.memory[p64 + 2], this.memory[p64 + 5] << 8 | this.memory[p64 + 4], this.memory[p64 + 7] << 8 | this.memory[p64 + 6]);
            this.v4.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
        }
        p += 32 - this.memsize;
        this.memsize = 0;
        if (isString)
            this.memory = '';
    }
    if (p <= bEnd - 32) {
        var limit = bEnd - 32;
        do {
            if (isString) {
                var other;
                other = UINT64(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), input.charCodeAt(p + 5) << 8 | input.charCodeAt(p + 4), input.charCodeAt(p + 7) << 8 | input.charCodeAt(p + 6));
                this.v1.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), input.charCodeAt(p + 5) << 8 | input.charCodeAt(p + 4), input.charCodeAt(p + 7) << 8 | input.charCodeAt(p + 6));
                this.v2.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), input.charCodeAt(p + 5) << 8 | input.charCodeAt(p + 4), input.charCodeAt(p + 7) << 8 | input.charCodeAt(p + 6));
                this.v3.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), input.charCodeAt(p + 5) << 8 | input.charCodeAt(p + 4), input.charCodeAt(p + 7) << 8 | input.charCodeAt(p + 6));
                this.v4.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            } else {
                var other;
                other = UINT64(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], input[p + 5] << 8 | input[p + 4], input[p + 7] << 8 | input[p + 6]);
                this.v1.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], input[p + 5] << 8 | input[p + 4], input[p + 7] << 8 | input[p + 6]);
                this.v2.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], input[p + 5] << 8 | input[p + 4], input[p + 7] << 8 | input[p + 6]);
                this.v3.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
                p += 8;
                other = UINT64(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], input[p + 5] << 8 | input[p + 4], input[p + 7] << 8 | input[p + 6]);
                this.v4.add(other.multiply(PRIME64_2)).rotl(31).multiply(PRIME64_1);
            }
            p += 8;
        } while (p <= limit);
    }
    if (p < bEnd) {
        if (isString) {
            this.memory += input.slice(p);
        } else if (isArrayBuffer) {
            this.memory.set(input.subarray(p, bEnd), this.memsize);
        } else {
            input.copy(this.memory, this.memsize, p, bEnd);
        }
        this.memsize = bEnd - p;
    }
    return this;
};
XXH64.prototype.digest = function () {
    var input = this.memory;
    var isString = typeof input == 'string';
    var p = 0;
    var bEnd = this.memsize;
    var h64, h;
    var u = new UINT64();
    if (this.total_len >= 32) {
        h64 = this.v1.clone().rotl(1);
        h64.add(this.v2.clone().rotl(7));
        h64.add(this.v3.clone().rotl(12));
        h64.add(this.v4.clone().rotl(18));
        h64.xor(this.v1.multiply(PRIME64_2).rotl(31).multiply(PRIME64_1));
        h64.multiply(PRIME64_1).add(PRIME64_4);
        h64.xor(this.v2.multiply(PRIME64_2).rotl(31).multiply(PRIME64_1));
        h64.multiply(PRIME64_1).add(PRIME64_4);
        h64.xor(this.v3.multiply(PRIME64_2).rotl(31).multiply(PRIME64_1));
        h64.multiply(PRIME64_1).add(PRIME64_4);
        h64.xor(this.v4.multiply(PRIME64_2).rotl(31).multiply(PRIME64_1));
        h64.multiply(PRIME64_1).add(PRIME64_4);
    } else {
        h64 = this.seed.clone().add(PRIME64_5);
    }
    h64.add(u.fromNumber(this.total_len));
    while (p <= bEnd - 8) {
        if (isString) {
            u.fromBits(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), input.charCodeAt(p + 5) << 8 | input.charCodeAt(p + 4), input.charCodeAt(p + 7) << 8 | input.charCodeAt(p + 6));
        } else {
            u.fromBits(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], input[p + 5] << 8 | input[p + 4], input[p + 7] << 8 | input[p + 6]);
        }
        u.multiply(PRIME64_2).rotl(31).multiply(PRIME64_1);
        h64.xor(u).rotl(27).multiply(PRIME64_1).add(PRIME64_4);
        p += 8;
    }
    if (p + 4 <= bEnd) {
        if (isString) {
            u.fromBits(input.charCodeAt(p + 1) << 8 | input.charCodeAt(p), input.charCodeAt(p + 3) << 8 | input.charCodeAt(p + 2), 0, 0);
        } else {
            u.fromBits(input[p + 1] << 8 | input[p], input[p + 3] << 8 | input[p + 2], 0, 0);
        }
        h64.xor(u.multiply(PRIME64_1)).rotl(23).multiply(PRIME64_2).add(PRIME64_3);
        p += 4;
    }
    while (p < bEnd) {
        u.fromBits(isString ? input.charCodeAt(p++) : input[p++], 0, 0, 0);
        h64.xor(u.multiply(PRIME64_5)).rotl(11).multiply(PRIME64_1);
    }
    h = h64.clone().shiftRight(33);
    h64.xor(h).multiply(PRIME64_2);
    h = h64.clone().shiftRight(29);
    h64.xor(h).multiply(PRIME64_3);
    h = h64.clone().shiftRight(32);
    h64.xor(h);
    this.init(this.seed);
    return h64;
};
module.exports = XXH64;
}
var global = window
$fsx.r(0)
})($fsx);