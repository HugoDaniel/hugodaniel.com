// WebGPU for you — shared demo helper.
// Every post in the series embeds a demo module that imports this file.
//
// Contract with the post markup:
//   <div class="wfy-demo">
//     <div class="wfy-live"> ...canvas + controls... </div>
//     <div class="wfy-fallback" hidden>
//       <p data-wfy-reason></p> ...video/screenshot fallback...
//     </div>
//   </div>
// When WebGPU is unavailable, .wfy-live is hidden and .wfy-fallback shown.

/**
 * Request adapter + device and configure the canvas context.
 * Returns { device, adapter, context, format, canvas } or null (fallback shown).
 */
export async function initDemo({
  canvasId,
  requiredFeatures = [],
  optionalFeatures = [],
}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null; // not on this page
  const wrapper = canvas.closest(".wfy-demo");

  const bail = (reason) => {
    showFallback(wrapper, reason);
    return null;
  };

  if (!navigator.gpu) {
    return bail("This browser has no WebGPU (navigator.gpu is missing).");
  }

  let adapter = null;
  try {
    adapter = await navigator.gpu.requestAdapter();
  } catch (_) {
    /* fall through to the null check */
  }
  if (!adapter) {
    return bail("WebGPU is here, but no adapter answered the call.");
  }

  const missing = requiredFeatures.filter((f) => !adapter.features.has(f));
  if (missing.length > 0) {
    return bail(`This GPU is missing the "${missing.join('", "')}" feature.`);
  }
  const features = [
    ...requiredFeatures,
    ...optionalFeatures.filter((f) => adapter.features.has(f)),
  ];

  let device = null;
  try {
    device = await adapter.requestDevice({ requiredFeatures: features });
  } catch (e) {
    return bail(`The adapter refused to hand over a device: ${e.message}`);
  }

  device.lost.then((info) => {
    if (info.reason === "destroyed") return;
    showFallback(
      wrapper,
      `The GPU left mid-sentence (device lost: ${info.message || info.reason}).`,
    );
  });

  // Size the drawing buffer to the CSS size once, capped by device limits.
  const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
  const max = device.limits.maxTextureDimension2D;
  canvas.width = Math.min(Math.floor(canvas.clientWidth * dpr) || 400, max);
  canvas.height = Math.min(Math.floor(canvas.clientHeight * dpr) || 300, max);

  const context = canvas.getContext("webgpu");
  const format = navigator.gpu.getPreferredCanvasFormat();
  context.configure({ device, format, alphaMode: "opaque" });

  return { device, adapter, context, format, canvas };
}

function showFallback(wrapper, reason) {
  if (!wrapper) return;
  for (const el of wrapper.querySelectorAll(".wfy-live")) el.hidden = true;
  for (const el of wrapper.querySelectorAll(".wfy-fallback")) {
    el.hidden = false;
    const note = el.querySelector("[data-wfy-reason]");
    if (note) note.textContent = reason;
  }
}

/**
 * A tiny on-page error console. In this series, errors are content:
 * the demos trigger real validation errors on purpose and show the
 * browser's own words for them.
 *
 * Returns { log, scoped }:
 *   log(message, kind)  — kind: "error" | "ok" | "info"
 *   scoped(label, fn)   — runs fn inside a validation error scope;
 *                         returns { result, error } and logs the error.
 */
export function errorConsole(device, preOrId) {
  const pre = typeof preOrId === "string"
    ? document.getElementById(preOrId)
    : preOrId;
  const MAX_LINES = 10;

  const log = (message, kind = "info") => {
    if (!pre) return;
    const line = document.createElement("span");
    line.className = `wfy-log wfy-log-${kind}`;
    const mark = kind === "error" ? "✗" : kind === "ok" ? "✓" : "·";
    line.textContent = `${mark} ${message}\n`;
    pre.prepend(line);
    while (pre.childNodes.length > MAX_LINES) {
      pre.removeChild(pre.lastChild);
    }
  };

  device.addEventListener?.("uncapturederror", (e) => {
    log(`uncaptured: ${e.error.message}`, "error");
  });

  const scoped = async (label, fn) => {
    device.pushErrorScope("validation");
    let result = null;
    let thrown = null;
    try {
      result = await fn();
    } catch (e) {
      thrown = e;
    }
    const error = await device.popErrorScope();
    if (thrown) {
      log(`${label}: ${thrown.message}`, "error");
      return { result: null, error: thrown };
    }
    if (error) {
      log(`${label}: ${error.message}`, "error");
    }
    return { result, error };
  };

  return { log, scoped };
}

/**
 * Probe whether this browser knows a vertex format at all.
 * Unknown enum strings throw a TypeError synchronously (WebIDL),
 * before any GPU validation happens — which is exactly the signal
 * we want. Real validation errors are swallowed by an error scope.
 */
export async function probeVertexFormat(device, format, componentCount) {
  const vecType = componentCount === 2 ? "vec2f" : "vec4f";
  const code = `
    @vertex fn vs(@location(0) a: ${vecType}) -> @builtin(position) vec4f {
      return vec4f(0.0);
    }
    @fragment fn fs() -> @location(0) vec4f { return vec4f(0.0); }
  `;
  device.pushErrorScope("validation");
  let known = true;
  try {
    const module = device.createShaderModule({ code });
    device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module,
        buffers: [{
          arrayStride: 16,
          attributes: [{ shaderLocation: 0, offset: 0, format }],
        }],
      },
      fragment: {
        module,
        targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
      },
    });
  } catch (_) {
    known = false; // TypeError: enum value not in this browser's dictionary
  }
  await device.popErrorScope();
  return known;
}
