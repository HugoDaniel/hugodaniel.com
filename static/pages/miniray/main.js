/** @typedef {import("./types").AppState} AppState */
import { inflictBoreDOM } from "boredom"

const runtimeAttr = Symbol("runtime")

/** @type {Record<string, { keepNames: string[], mangleExternalBindings: boolean }>} */
export const presets = {
  default: {
    keepNames: [],
    mangleExternalBindings: false,
  },
  "compute.toys": {
    keepNames: [
      "time", "mouse", "custom", "dispatch", "screen", "pass_in", "pass_out",
      "channel0", "channel1", "nearest", "bilinear", "trilinear",
      "nearest_repeat", "bilinear_repeat", "trilinear_repeat", "_keyboard",
      "Time", "Mouse", "Custom", "DispatchInfo",
      "int", "uint", "float",
      "int2", "int3", "int4", "uint2", "uint3", "uint4",
      "float2", "float3", "float4", "bool2", "bool3", "bool4",
      "float2x2", "float2x3", "float2x4", "float3x2", "float3x3", "float3x4",
      "float4x2", "float4x3", "float4x4",
      "keyDown", "assert", "passStore", "passLoad",
      "passSampleLevelBilinearRepeat", "main_image",
    ],
    mangleExternalBindings: false,
  },
}

/** @type {AppState} */
const initialState = {
  input: `// Example WGSL shader
struct Uniforms {
    resolution: vec2f,
    time: f32,
}

@group(0) @binding(0) var<uniform> uniforms: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var texture: texture_2d<f32>;

fn computeColor(uv: vec2f) -> vec4f {
    let color = vec3f(uv, sin(uniforms.time) * 0.5 + 0.5);
    return vec4f(color, 1.0);
}

@fragment
fn main(@builtin(position) pos: vec4f) -> @location(0) vec4f {
    let uv = pos.xy / uniforms.resolution;
    return computeColor(uv);
}`,
  output: "",
  isLoading: true,
  isMinifying: false,
  validation: null,
  stats: null,
  reflect: null,
  showReflection: false,
  showErrorCodes: false,
  diagnosticCodes: [],
  highlightedCode: null,
  preset: "default",
  options: {
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    mangleExternalBindings: false,
    keepNames: [],
  },
  [runtimeAttr]: {
    wasm: null,
  },
}

export { runtimeAttr }

async function loadWasm() {
  const script = document.createElement("script")
  script.src = "./wasm_exec.js"
  document.head.appendChild(script)

  await new Promise((resolve, reject) => {
    script.onload = resolve
    script.onerror = reject
  })

  const go = new Go()
  const response = await fetch("./miniray.wasm")
  const wasmBuffer = await response.arrayBuffer()
  const result = await WebAssembly.instantiate(wasmBuffer, go.importObject)

  // Start Go runtime (returns a Promise that resolves when Go exits)
  go.run(result.instance)

  // Wait for Go to set up __miniray (poll instead of fixed timeout)
  for (let i = 0; i < 50; i++) {
    if (globalThis.__miniray) {
      return globalThis.__miniray
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }

  throw new Error("WASM initialization failed: __miniray not set")
}

window.addEventListener("DOMContentLoaded", async () => {
  const state = await inflictBoreDOM(initialState)

  try {
    const wasm = await loadWasm()
    state[runtimeAttr].wasm = wasm
    state.isLoading = false

    // Load diagnostic codes
    try {
      const codes = wasm.getDiagnosticCodes()
      state.diagnosticCodes = codes || []
    } catch {
      state.diagnosticCodes = []
    }

    // Initial minification
    minifyShader(state)
  } catch (err) {
    state.validation = {
      valid: false,
      diagnostics: [{ severity: "error", message: `Failed to load WASM: ${err.message}`, line: 0, column: 0 }],
      errorCount: 1,
      warningCount: 0,
    }
    state.isLoading = false
  }
})

/** @param {AppState} state */
export function minifyShader(state) {
  const wasm = state[runtimeAttr].wasm
  if (!wasm || state.isMinifying) return

  state.isMinifying = true

  // Use setTimeout to avoid blocking the UI and allow state to update
  setTimeout(() => {
    try {
      // Always run validation first
      const validationResult = wasm.validate(state.input)
      state.validation = validationResult

      // Run minification
      const result = wasm.minify(state.input, state.options)

      if (result.errors && result.errors.length > 0) {
        state.output = ""
        state.stats = null
        state.reflect = null
      } else {
        state.output = result.code
        state.stats = {
          original: result.originalSize,
          minified: result.minifiedSize,
          savings: Math.round((1 - result.minifiedSize / result.originalSize) * 100),
        }

        // Also run reflection on the original source
        try {
          const reflectResult = wasm.reflect(state.input)
          if (reflectResult.errors && reflectResult.errors.length > 0) {
            state.reflect = null
          } else {
            state.reflect = reflectResult
          }
        } catch {
          state.reflect = null
        }
      }
    } catch (err) {
      state.validation = {
        valid: false,
        diagnostics: [{ severity: "error", message: err.message || "Processing failed", line: 0, column: 0 }],
        errorCount: 1,
        warningCount: 0,
      }
      state.output = ""
      state.stats = null
      state.reflect = null
    }

    state.isMinifying = false
  }, 0)
}
