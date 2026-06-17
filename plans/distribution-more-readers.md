# Distribution Plan — more readers ("the missing half of the career")

## Context

Hugo's writing is world-class for its niche (GPU empiricism, DSL design, honest career essays) but is published into a vacuum: no submissions, no email list, no analytics, a self-hosted forge (`git.hugodaniel.com`) with zero network effects, and a one-and-done publishing pattern. Goal: **audience for the writing first** (income/SJON adoption as second-order effects). Constraints: ~5h/week, GitHub + Codeberg read-only mirrors approved (canonical stays self-hosted), talks + podcasts approved, no corporate identity links on the site (LinkedIn/Instagram exist as push/listening channels only).

Core principle: **publishing is not distributing.** Every piece needs a push step, and the archive itself is an unexploited asset.

---

## Pillar 0 — Site as hub (weeks 1–2)

The only channels you own are the site, the feed, and an email list. Harden them before driving traffic:

1. **`/start-here` page** — curated entry points by reader type: the WGSL-limits series, the LX/machine-collaboration essays, the 2016–18 bootstrapping saga, "Lost in the middle." HN traffic without a landing path evaporates.
2. **Newsletter** — RSS-to-email so marginal cost is zero. Buttondown (indie, privacy-respecting) or self-hosted listmonk to match the sovereignty stack. Signup link in post footer + start-here. The email list is the only audience that survives a platform dying.
3. **Analytics** — you cannot improve what you can't see. Lightest fit for the OpenBSD stack: `goaccess` over httpd logs (zero JS, zero third parties) or self-hosted Plausible/GoatCounter.
4. **Series landing pages** — one page for the WGSL-limits series, one for the LX essays (vendor-neutral home, decoupled from boreDOM).
5. **Post footer** — add start-here + newsletter + "reply by email" links. `rel=me` links for Mastodon verification.

## Pillar 1 — Syndication & presence (ongoing, ~1h/week)

- **Bluesky** (existing): every essay + small TIL-sized posts from WGSL/SJON work, 2–3/week.
- **LinkedIn** (existing account; site stays free of LinkedIn identity links): one post per essay — 2–3 sentences of native intro in your own voice, then the link. ~10 min per essay. This is the channel where the *secondary* goal (income leads) lives: ex-colleagues, the LottieLab/Sketch alumni network, Portuguese tech scene, hiring managers. The technical essays (WGSL limits, SJON, LX) matter more here than the personal ones.
- **Mastodon on merveilles.town** — apply for an account. Creative computing, permacomputing, demoscene-adjacent, sovereignty-minded: this is precisely your tribe, and the Gemini/onion/YubiKey work will resonate there like nowhere else.
- **Instagram** (existing, listening channel for arts): keep as-is, zero commitment. Optional only: when visual artifacts already exist (PNGine renders, Grid Generator patterns, demo frames), cross-post them — never make content for it.
- **Gemini**: submit capsule posts to Antenna (the Gemini aggregator) — the capsule exists, it's just unlisted.

## Pillar 2 — The submission machine (the core; ~1h/week)

**Rule: nothing ships without being submitted to 2–3 venues within 24h.** Venue map by content type:

| Content | Venues |
|---|---|
| Essays (Lost in the middle, LX, sovereignty) | HN, lobste.rs, Merveilles, Future of Coding newsletter |
| SJON / language posts | r/programminglanguages, r/lisp, Future of Coding Slack, ziggit.dev |
| WGSL / GPU posts | HN, r/webgpu, r/GraphicsProgramming, JavaScript Weekly / Frontend Focus (email curators) |
| Tools (miniray, SJON playground, webgpu-diagnostics) | Show HN, Console.dev (takes tool submissions), pouët.net (demoscene tools) |

Mechanics: HN Tue–Thu around 14:00–16:00 UTC; one resubmit allowed if no traction. lobste.rs needs an invite — source one via Merveilles/Bluesky/#lobsters IRC; your niche is well represented there. On Reddit, participate genuinely in r/programminglanguages before/alongside link posts — it's a community that rewards exactly your kind of content.

**Backlog campaign (one per week, the archive is the asset):** never-submitted evergreen pieces, in order: WGSL limits I & II → PNGine → "Lost in the middle" → miniray → "R.I.P. Rest In Prompt" → the 2016–18 bootstrapping/eviction saga reframed as a 10-years-later retrospective (HN front-page material — honest failure retrospectives outperform almost everything).

## Pillar 3 — Mirrors & registries (weeks 2–4, mostly one-time)

- **Forgejo push-mirroring** from git.hugodaniel.com → `github.com/<user>/{sjon,miniray,pngine,shader-canvas}` and Codeberg. README banner on mirrors: "Canonical: git.hugodaniel.com — read-only mirror." Sovereignty intact, discoverability restored.
- **Registries are passive distribution:** npm (SJON JS host), crates.io (`sjon_host`), zigistry (Zig core), and the GitHub mirror gives `go install github.com/...@latest` for miniray for free.
- **Awesome-list PRs:** awesome-zig, awesome-webgpu, awesome-creative-coding, awesome-lisp.

## Pillar 4 — Talks & podcasts (one move per quarter)

- **Inércia 2026 (Dec)** — you're already in the scene: PNGine/miniray talk, the failed-demo-to-tooling redemption arc is a great story.
- **FOSDEM 2027 (Brussels, Feb; CFPs ~Oct–Nov 2026)** — the *Declarative and Minimalistic Computing* devroom is literally SJON's home turf; the graphics devroom fits the WGSL-limits talk.
- **Podcast pitches, one per quarter:** CoRecursive (story-driven — the bootstrapping/eviction/AI-crisis arc is a perfect episode), Developer Voices (Kris Jenkins, language/tools deep dives, takes pitches), Future of Coding podcast, Software Unscripted (language design).
- Build the WGSL-limits talk deck **once**, reuse everywhere; publish slides + recording on the site.

## Pillar 5 — Essay pipeline (the supply side, ~2h/week)

1. **"The sovereign website"** — you built the YubiKey/WKD/onion/Gemini/signed-feed stack and never wrote the essay. It's sitting there, already done, and it's prime HN/Merveilles material.
2. **SJON agent-loop experiment** — give a model the webgpu schema, show diagnostics-driven repair converging. Evidence for the agent positioning.
3. **Vendor-neutral LX essay** — the pattern, freed from boreDOM.
4. **Bootstrapping retrospective, 10 years later.**
5. **Quarterly "state of SJON"** — replaces the new-project reflex.

## Weekly operating system (5h)

- 2h — writing (pipeline above)
- 1h — submissions + syndication (new + one backlog item; LinkedIn push included)
- 1h — community presence (replies on Merveilles/lobste.rs/Bluesky/FoC — being a person, not a link-dropper)
- 1h — rotating quarterly project (mirror setup → talk deck → podcast pitch → CFP)

## 90-day calendar

- **Weeks 1–2:** site hub (start-here, newsletter, analytics, series pages, footer). Merveilles application; lobste.rs invite hunt.
- **Weeks 2–4:** Forgejo mirrors + registries + awesome-list PRs.
- **Week 3:** submit "Lost in the middle" (HN) + SJON post (r/programminglanguages, FoC Slack).
- **Week 4:** Show HN: SJON playground.
- **Weeks 5–8:** "The sovereign website" essay + submit; backlog cadence running; pitch CoRecursive.
- **Weeks 9–12:** agent-loop SJON post; Inércia talk proposal; first "state of SJON"; FOSDEM CFP watch.

## KPIs at day 90

- Feed + newsletter subscribers: baseline measured, then 200+.
- Two front-page-anywhere moments (HN / lobste.rs / FoC newsletter pickup).
- One podcast booked or talk accepted.
- Three meaningful inbound emails/conversations from strangers.
- (Secondary) first SJON issue/user from a stranger.

## Anti-goals

No corporate identity links on the site (LinkedIn/Instagram are push/listening channels only, never part of the site's identity). No Twitter/Facebook. No YouTube/video pipeline — wrong cost/benefit at 5h/week. No engagement-bait or posting-for-the-algorithm; every submission is something you'd defend in the comments. Building time stays protected: distribution is capped at 5h, not allowed to eat the work that makes it worth distributing.
