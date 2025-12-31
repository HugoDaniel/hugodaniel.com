// PNGine Interactive Demo
// Handles drag & drop of PNGine files to demonstrate the "PNG that moves" concept

import { destroy, play, pngine, setUniform } from "./pngine.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("pngine-drop-zone");
  const canvas = document.getElementById("pngine-demo-canvas");
  const overlay = document.querySelector(".pngine-drop-overlay");
  const hint = document.getElementById("pngine-demo-hint");
  const fileInput = document.getElementById("pngine-file-input");

  // Exit early if elements don't exist (not on this page)
  if (!dropZone || !canvas || !overlay) return;

  let instance = null;

  // Load and initialize a PNGine file
  async function loadPngine(file) {
    // Cleanup previous instance
    if (instance) {
      destroy(instance);
      instance = null;
    }

    try {
      // Show loading state
      overlay.innerHTML = "<p>Loading shader...</p>";
      overlay.style.display = "flex";

      // Initialize PNGine with the dropped file
      instance = await pngine(file, { canvas });

      // Hide overlay, show canvas
      overlay.style.display = "none";
      if (hint) {
        hint.textContent = "";
      }

      // Mouse interaction - controls shader uniforms
      canvas.onmousemove = (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setUniform(instance, "C", x * 8.0);
        setUniform(instance, "colorShift", y * 2.0);
      };

      canvas.onmouseleave = () => {
        setUniform(instance, "C", 0.0);
        setUniform(instance, "colorShift", 0.0);
      };

      // Touch support for mobile
      canvas.ontouchmove = (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = (touch.clientY - rect.top) / rect.height;
        setUniform(instance, "C", x * 8.0);
        setUniform(instance, "colorShift", y * 2.0);
      };

      canvas.ontouchend = () => {
        setUniform(instance, "C", 0.0);
        setUniform(instance, "colorShift", 0.0);
      };

      // Start animation
      play(instance);
    } catch (err) {
      console.error("PNGine load error:", err);
      overlay.innerHTML = `
        <p style="color: #C75D3A;">Could not load shader</p>
        <p class="hint">${err.message}</p>
        <p class="hint">Make sure it's a valid PNGine file and your browser supports WebGPU.</p>
      `;
      overlay.style.display = "flex";
    }
  }

  // Drag & drop handlers
  dropZone.ondragover = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("dragover");
  };

  dropZone.ondragleave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");
  };

  dropZone.ondrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("dragover");

    const file = e.dataTransfer.files[0];
    if (file) {
      loadPngine(file);
    }
  };

  // File input fallback (for mobile and accessibility)
  overlay.onclick = () => fileInput.click();

  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      loadPngine(file);
    }
  };
});
