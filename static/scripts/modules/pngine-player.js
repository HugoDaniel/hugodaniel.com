// A play/pause player for a PNG that carries its own program.
//
// Markup contract, one per figure:
//
//   <figure class="pngine-player">
//     <div class="pngine-stage" style="background-image:url(...)">
//       <canvas width height></canvas>
//     </div>
//     <figcaption class="pngine-bar">
//       <button class="pngine-toggle" data-src="/images/whatever.png">Play</button>
//       <span class="pngine-status"></span>
//     </figcaption>
//   </figure>
//
// The PNG's pixels are the poster (a frame the CLI rendered natively) and its
// pNGb chunk is the compiled bytecode plus the executor WASM, so the picture
// you see before pressing Play is the program you are about to run. Nothing
// starts until the click: one worker and one GPU device per player, created on
// first press, then the button toggles.
//
// The button sits under the canvas on purpose. The runtime attaches pointer
// listeners to the canvas so shaders can read the pointer, and a control drawn
// over it would eat those events.

import { destroy, pause, play, pngine } from "./pngine-viewer.mjs";

function setup(root) {
  const canvas = root.querySelector("canvas");
  const button = root.querySelector(".pngine-toggle");
  const status = root.querySelector(".pngine-status");
  if (!canvas || !button || !status) return;

  const src = button.dataset.src;
  if (!src) return;

  if (!("gpu" in navigator)) {
    button.disabled = true;
    status.textContent =
      "No WebGPU in this browser. The picture is a frame rendered ahead of time.";
    return;
  }

  let instance = null;
  let starting = false;

  const setPlaying = (on) => {
    button.textContent = on ? "Pause" : "Play";
    button.setAttribute("aria-pressed", String(on));
    root.classList.toggle("is-playing", on);
  };

  button.addEventListener("click", async () => {
    if (starting) return;

    if (!instance) {
      starting = true;
      button.disabled = true;
      status.textContent = "Starting…";
      try {
        instance = await pngine(src, {
          canvas,
          autoResize: true,
          onError: (err) => {
            status.textContent = err.message;
            console.error("[pngine]", err);
          },
        });
      } catch (err) {
        status.textContent = "Could not start: " +
          (err instanceof Error ? err.message : String(err));
        console.error("[pngine]", err);
        starting = false;
        button.disabled = false;
        return;
      }
      status.textContent = "";
      starting = false;
      button.disabled = false;
      root.classList.add("is-live");
      play(instance);
      setPlaying(true);
      return;
    }

    if (instance.isPlaying) {
      pause(instance);
      setPlaying(false);
    } else {
      play(instance);
      setPlaying(true);
    }
  });

  // The worker, the device and the canvas listeners outlive garbage
  // collection; release them when the page goes away.
  addEventListener("pagehide", () => {
    if (instance) destroy(instance);
    instance = null;
  }, { once: true });
}

document.querySelectorAll(".pngine-player").forEach(setup);
