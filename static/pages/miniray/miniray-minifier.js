// @ts-check
/** @typedef {import("../../types").AppState} AppState */
/** @typedef {import("boredom").InitFunction<AppState | undefined>} InitFunction */
/** @typedef {import("boredom").RenderFunction<AppState | undefined>} RenderFunction */
import { webComponent } from "boredom"
import { minifyShader, presets } from "./main.js"

const DEBOUNCE_MS = 300
let debounceTimer

/** @param {string} text */
function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

export const WgslMinifier = webComponent(
  /** @type {InitFunction} */
  ({ on }) => {
    on("inputChange", ({ state: mutable, e }) => {
      if (!mutable) return

      const target = e.event.target
      if (target instanceof HTMLTextAreaElement) {
        mutable.input = target.value

        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          minifyShader(mutable)
        }, DEBOUNCE_MS)
      }
    })

    on("presetChange", ({ state: mutable, e }) => {
      if (!mutable) return

      const target = e.event.target
      if (!(target instanceof HTMLSelectElement)) return

      const presetName = target.value
      const preset = presets[presetName]
      if (!preset) return

      mutable.preset = presetName
      mutable.options.keepNames = [...preset.keepNames]
      mutable.options.mangleExternalBindings = preset.mangleExternalBindings

      minifyShader(mutable)
    })

    on("optionChange", ({ state: mutable, e }) => {
      if (!mutable) return

      const target = e.event.target
      if (!(target instanceof HTMLInputElement)) return

      const name = target.closest("label")?.textContent?.trim().toLowerCase()

      if (name?.includes("whitespace")) {
        mutable.options.minifyWhitespace = target.checked
      } else if (name?.includes("identifiers")) {
        mutable.options.minifyIdentifiers = target.checked
      } else if (name?.includes("syntax")) {
        mutable.options.minifySyntax = target.checked
      } else if (name?.includes("mangle")) {
        mutable.options.mangleExternalBindings = target.checked
      }

      minifyShader(mutable)
    })

    on("copy", async ({ state: mutable, e }) => {
      if (!mutable) return

      try {
        await navigator.clipboard.writeText(mutable.output)
        const btn = e.dispatcher
        if (btn instanceof HTMLButtonElement) {
          const original = btn.innerHTML
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Copied`
          setTimeout(() => {
            btn.innerHTML = original
          }, 1500)
        }
      } catch (err) {
        console.error("Failed to copy:", err)
      }
    })

    on("selectOutput", ({ e }) => {
      const target = e.event.target
      if (target instanceof HTMLTextAreaElement) {
        target.select()
      }
    })

    on("toggleReflection", ({ state: mutable }) => {
      if (!mutable) return
      mutable.showReflection = !mutable.showReflection
    })

    on("openErrorCodes", ({ state: mutable, e }) => {
      if (!mutable) return
      const target = e.event.target
      if (target instanceof HTMLElement) {
        const code = target.dataset.code
        if (code) {
          mutable.highlightedCode = code
        }
      }
      mutable.showErrorCodes = true
    })

    on("closeErrorCodes", ({ state: mutable }) => {
      if (!mutable) return
      mutable.showErrorCodes = false
      mutable.highlightedCode = null
    })

    return onRender
  }
)

/** @type {RenderFunction} */
function onRender({ state, refs }) {
  if (!state) return

  const loading = refs.loading
  const stats = refs.stats

  // Loading overlay with fade-out animation
  if (loading instanceof HTMLElement) {
    if (state.isLoading) {
      loading.hidden = false
      loading.classList.remove("fade-out")
    } else if (!loading.hidden && !loading.classList.contains("fade-out")) {
      // Trigger fade-out, then hide after animation
      loading.classList.add("fade-out")
      setTimeout(() => {
        loading.hidden = true
      }, 300)
    }
  }

  // Input/output
  const input = refs.input
  const output = refs.output
  if (input instanceof HTMLTextAreaElement && input.value !== state.input) {
    input.value = state.input
  }
  if (output instanceof HTMLTextAreaElement) {
    output.value = state.output
  }

  // Input/output sizes
  const inputSize = refs.inputSize
  const outputSize = refs.outputSize
  if (inputSize instanceof HTMLElement) {
    const bytes = new TextEncoder().encode(state.input).length
    inputSize.textContent = `${bytes}b`
  }
  if (outputSize instanceof HTMLElement && state.output) {
    const bytes = new TextEncoder().encode(state.output).length
    outputSize.textContent = `${bytes}b`
  }

  // Diagnostics display
  const diagnostics = refs.diagnostics
  if (diagnostics instanceof HTMLElement) {
    const hasIssues = state.validation &&
      (state.validation.errorCount > 0 || state.validation.warningCount > 0)

    diagnostics.hidden = !hasIssues
    diagnostics.innerHTML = ""

    if (hasIssues && state.validation) {
      for (const d of state.validation.diagnostics) {
        if (d.severity !== "error" && d.severity !== "warning") continue

        const item = document.createElement("div")
        item.className = `diagnostic-item ${d.severity}`

        const badge = d.severity === "error" ? "err" : "warn"
        const location = d.line > 0 ? `${d.line}:${d.column}` : ""

        item.innerHTML = `
          <span class="diagnostic-badge ${d.severity}">${badge}</span>
          ${location ? `<span class="diagnostic-location">${location}</span>` : ""}
          <span class="diagnostic-message">${escapeHtml(d.message)}</span>
        `

        // Make the error code a clickable button with manual event binding
        if (d.code) {
          const codeBtn = document.createElement("button")
          codeBtn.className = "diagnostic-code-btn"
          codeBtn.dataset.code = d.code
          codeBtn.textContent = d.code
          codeBtn.addEventListener("click", () => {
            state.highlightedCode = d.code
            state.showErrorCodes = true
          })
          item.appendChild(codeBtn)
        }

        diagnostics.appendChild(item)
      }
    }
  }

  // Preset dropdown
  const preset = refs.preset
  if (preset instanceof HTMLSelectElement) {
    preset.value = state.preset
  }

  // Options checkboxes
  const whitespace = refs.whitespace
  const identifiers = refs.identifiers
  const syntax = refs.syntax
  const mangle = refs.mangle

  if (whitespace instanceof HTMLInputElement) {
    whitespace.checked = state.options.minifyWhitespace
  }
  if (identifiers instanceof HTMLInputElement) {
    identifiers.checked = state.options.minifyIdentifiers
  }
  if (syntax instanceof HTMLInputElement) {
    syntax.checked = state.options.minifySyntax
  }
  if (mangle instanceof HTMLInputElement) {
    mangle.checked = state.options.mangleExternalBindings
  }

  // Stats
  if (stats instanceof HTMLElement) {
    stats.hidden = !state.stats

    if (state.stats) {
      const original = refs.original
      const minified = refs.minified
      const savings = refs.savings

      if (original instanceof HTMLElement) {
        original.textContent = `${state.stats.original}b`
      }
      if (minified instanceof HTMLElement) {
        minified.textContent = `${state.stats.minified}b`
      }
      if (savings instanceof HTMLElement) {
        savings.textContent = `-${state.stats.savings}%`
      }
    }
  }

  // Reflection container and toggle
  const reflectionContainer = refs.reflectionContainer
  const reflectionToggle = refs.reflectionToggle
  const reflection = refs.reflection
  const reflectionMeta = refs.reflectionMeta

  if (reflectionContainer instanceof HTMLElement) {
    reflectionContainer.hidden = !state.reflect
  }

  if (reflectionToggle instanceof HTMLElement) {
    reflectionToggle.setAttribute("aria-expanded", state.showReflection ? "true" : "false")
  }

  if (reflectionMeta instanceof HTMLElement && state.reflect) {
    const bindingCount = state.reflect.bindings?.length || 0
    const entryCount = state.reflect.entryPoints?.length || 0
    reflectionMeta.textContent = `${bindingCount} bindings, ${entryCount} entry points`
  }

  if (reflection instanceof HTMLElement) {
    reflection.hidden = !state.showReflection

    if (state.showReflection && state.reflect) {
      const bindingsBody = refs.bindingsBody
      const entryPointsBody = refs.entryPointsBody

      // Render bindings table
      if (bindingsBody instanceof HTMLElement) {
        bindingsBody.innerHTML = ""
        for (const b of state.reflect.bindings) {
          const row = document.createElement("tr")
          const size = b.layout ? `${b.layout.size}` : "-"
          row.innerHTML = `
            <td>${b.group}</td>
            <td>${b.binding}</td>
            <td><code>${b.name}</code></td>
            <td><code>${b.type}</code></td>
            <td>${size}</td>
          `
          bindingsBody.appendChild(row)
        }
        if (state.reflect.bindings.length === 0) {
          const row = document.createElement("tr")
          row.innerHTML = `<td colspan="5" class="empty">No bindings</td>`
          bindingsBody.appendChild(row)
        }
      }

      // Render entry points table
      if (entryPointsBody instanceof HTMLElement) {
        entryPointsBody.innerHTML = ""
        for (const ep of state.reflect.entryPoints) {
          const row = document.createElement("tr")
          const wgSize = ep.workgroupSize ? `[${ep.workgroupSize.join(", ")}]` : "-"
          row.innerHTML = `
            <td><code>${ep.name}</code></td>
            <td>${ep.stage}</td>
            <td>${wgSize}</td>
          `
          entryPointsBody.appendChild(row)
        }
        if (state.reflect.entryPoints.length === 0) {
          const row = document.createElement("tr")
          row.innerHTML = `<td colspan="3" class="empty">No entry points</td>`
          entryPointsBody.appendChild(row)
        }
      }
    }
  }

  // Error codes modal
  const errorCodesModal = refs.errorCodesModal
  const errorCodesList = refs.errorCodesList
  if (errorCodesModal instanceof HTMLElement) {
    errorCodesModal.hidden = !state.showErrorCodes

    if (state.showErrorCodes && errorCodesList instanceof HTMLElement) {
      errorCodesList.innerHTML = ""

      // Group codes by category
      const categories = {}
      for (const code of state.diagnosticCodes) {
        if (!categories[code.category]) {
          categories[code.category] = []
        }
        categories[code.category].push(code)
      }

      for (const [category, codes] of Object.entries(categories)) {
        const section = document.createElement("div")
        section.className = "error-code-category"

        const header = document.createElement("h3")
        header.className = "category-header"
        header.textContent = category
        section.appendChild(header)

        for (const code of codes) {
          const item = document.createElement("div")
          const isHighlighted = state.highlightedCode === code.code
          item.className = `error-code-item${isHighlighted ? " highlighted" : ""}`
          item.id = `code-${code.code}`

          const specRefHtml = code.specRef
            ? `<span class="error-code-spec">WGSL §${code.specRef}</span>`
            : ""

          item.innerHTML = `
            <div class="error-code-header">
              <span class="error-code-badge">${code.code}</span>
              <span class="error-code-title">${escapeHtml(code.title)}</span>
              ${specRefHtml}
            </div>
            <p class="error-code-description">${escapeHtml(code.description)}</p>
          `
          section.appendChild(item)
        }

        errorCodesList.appendChild(section)
      }

      // Scroll highlighted code into view
      if (state.highlightedCode) {
        const highlighted = document.getElementById(`code-${state.highlightedCode}`)
        if (highlighted) {
          highlighted.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }
  }
}
