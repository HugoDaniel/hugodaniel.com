# hugodaniel.com — hardcore-techy roadmap

Goal: turn the blog into a maximalist personal infrastructure project — multi-protocol, signed, self-hosted identity. Each section is independently shippable.

---

## 0. Identity baseline

- Canonical identity: `Hugo Daniel <mail@hugodaniel.com>`
- Canonical web: `https://hugodaniel.com`
- Old `@hugodaniel.pt` artifacts are dead and will not be revived.

### Legacy key cleanup (one-time)

| Key | Fingerprint | Status | Action |
|---|---|---|---|
| RSA-4096 (2018, `.pt`) | `AFF14A1A…092BD266` | Published on `keys.openpgp.org`, secret lost | Leave it. Hagrid only surfaces by *verified* email; the `.pt` address is gone, so it's already orphaned. Nothing to do. |
| Ed25519 (2023, `.pt`) | `3BB22695…EE5C0385` | Never published, encrypted privkey was paste-exposed | Delete locally + shred files. |

```bash
gpg --delete-secret-keys 3BB2269571755EA44921F37695B8CF22EE5C0385 || true
gpg --delete-keys        3BB2269571755EA44921F37695B8CF22EE5C0385 || true
# shred any .asc files holding key B's material
```

---

## 1. GPG on YubiKey (starting point)

### Current status (2026-05-22)

Done on another machine:
- Keys generated on YubiKey (curve25519, sign+encrypt+auth subkeys), valid 2y
- Primary fingerprint: `E49D 556A D099 3482 CA78 B6E8 C181 88F9 E2A4 C0AD`
- Signing subkey on card: `87A7 5F4B 6E29 677C 8BFA F4A3 8760 4148 1DDD 1357`
- UIDs: `mail@hugodaniel.com`, `hello@hugodaniel.com`
- Card metadata + URL set, touch-to-sign enabled on Sign/Decrypt/Auth
- Public key published at https://hugodaniel.com/pgp.asc (also at `static/pgp.asc`)
- Revocation certificate generated and stored offline in ≥2 locations

Remaining: import pubkey on this machine, push to Hagrid + verify email, serve WKD, add `/pgp` page + footer link, sign the Atom feed, add fingerprint to `/security.txt`.

Treat the procedural sections below as reference — useful for the future backup YubiKey or disaster recovery, but not a re-do list.

### Hardware

- **YubiKey 5 NFC** (or 5C NFC if USB-C). Firmware ≥ 5.2.3 for Ed25519. ~€55.
- Optional: a second YubiKey as a backup (configured identically, kept in a drawer).

### Approach: generate on-card

Pros: secret material physically can't leak. Cons: no backup of the secret — but for a blog signing key, that's fine. The revocation cert + ability to publish a successor key is enough.

If we ever decide we need an offline primary + subkeys-on-card setup, that's a separate, more involved migration. Skipping for now.

### Pre-flight on the daily machine

```bash
# sanity
gpg --version          # need >= 2.2
gpg --card-status      # confirm YubiKey detected
```

If `--card-status` says "No such device" on macOS: `brew install ykman gnupg pinentry-mac`, then add to `~/.gnupg/gpg-agent.conf`:
```
pinentry-program /opt/homebrew/bin/pinentry-mac
```
and `gpgconf --kill gpg-agent`.

### Set card metadata + PINs ✅

```bash
gpg --card-edit
> admin
> passwd     # change Admin PIN (default 12345678) and User PIN (default 123456)
> name       # → Daniel / Hugo
> lang       # → en
> url        # → https://hugodaniel.com/pgp.asc  (where the public key will live)
> quit
```

Use long, unique PINs. Admin PIN unlocks reset/regeneration; User PIN unlocks daily signing. Touch policy: enable touch-to-sign so a malware'd machine still can't silently sign.

```bash
ykman openpgp keys set-touch sig on   # touch required for signature
ykman openpgp keys set-touch aut on
```

### Generate keys on the card ✅

```bash
gpg --card-edit
> admin
> key-attr           # choose ECC → Curve 25519 for sign + auth + encrypt
> generate
  Make off-card backup? → No
  Key valid for? → 2y       # rotate-friendly; can extend before expiry
  Real name → Hugo Daniel
  Email    → mail@hugodaniel.com
  Comment  → (blank)
> quit
```

After this:
- Primary `[SC]` (sign + certify), encrypt subkey `[E]`, auth subkey `[A]` all live on the YubiKey.
- Local keyring has only **stubs** pointing to the card.
- `gpg --list-secret-keys` shows `ssb>` (the `>` = on smartcard).

### Generate a revocation certificate ✅

This is the kill-switch if the YubiKey is lost or stolen. Without it, a lost YubiKey means the key lives on uselessly; with it, you publish revocation and move on.

```bash
gpg --output ~/Documents/hugodaniel-revoke.asc --gen-revoke mail@hugodaniel.com
# Reason: 1 = key compromised  (generic enough for "lost yubikey" too)
```

Store this outside the daily machine: encrypted USB, password manager attachment, printed paper-copy in a drawer. Anywhere except the same laptop.

### Configure this machine to use the YubiKey

Done elsewhere; this machine still needs to be wired up. Card is already detected here (`gpg --card-status` works, pinentry-mac fine, URL on card resolves), but the new public key has not been imported into the local keyring yet.

```bash
# 1. Import the public key from the canonical location
gpg --fetch-keys https://hugodaniel.com/pgp.asc
# (once WKD is live, prefer:
#  gpg --auto-key-locate clear,wkd --locate-keys mail@hugodaniel.com)

# 2. Register the on-card key stubs into the local keyring
gpg --card-status > /dev/null

# 3. Set ultimate trust on the primary
echo "E49D556AD0993482CA78B6E8C18188F9E2A4C0AD:6:" | gpg --import-ownertrust

# 4. Verify signing actually hits the card (prompts for touch)
echo test | gpg --clearsign
```

Optional cleanup — the orphaned 2018 `.pt` RSA key is the only `pub` in the local keyring right now. Per §0 it's dead:

```bash
gpg --delete-keys AFF14A1A00D18A783222F9EE87F9CDC0092BD266
```

Harmless to leave; the `.pt` UID is gone so keys.openpgp.org won't surface it anyway.

If `pinentry-mac` ever stops being picked up, the `~/.gnupg/gpg-agent.conf` snippet from the pre-flight section above still applies.

### Publish

```bash
# 1. Export the public key  ✅ done — file at static/pgp.asc
gpg --armor --export mail@hugodaniel.com > ~/Dev/hugodaniel.com/static/pgp.asc

# 2. Push to keys.openpgp.org (Hagrid)  ⏳ TODO
gpg --keyserver hkps://keys.openpgp.org --send-keys E49D556AD0993482CA78B6E8C18188F9E2A4C0AD

# 3. Verify the email  ⏳ TODO — Hagrid emails mail@hugodaniel.com a link, click it.
#    Repeat for hello@hugodaniel.com (second UID). After this the key
#    is findable by email lookup.
```

### Wire up WKD on hugodaniel.com

Web Key Directory means `gpg --locate-keys mail@hugodaniel.com` resolves directly from your own domain — no third party. This is the flex.

```bash
# Compute paths
cd ~/Dev/hugodaniel.com
WKD_HASH=$(gpg --with-wkd-hash --list-keys mail@hugodaniel.com | grep -oE '[a-z0-9]{32}@hugodaniel\.com' | cut -d@ -f1)
echo "$WKD_HASH"

# Direct method (works if hugodaniel.com serves it)
mkdir -p static/.well-known/openpgpkey/hu
gpg --no-armor --export mail@hugodaniel.com > "static/.well-known/openpgpkey/hu/$WKD_HASH"
touch static/.well-known/openpgpkey/policy

# Commit + deploy
git add static/.well-known/openpgpkey/
make publish
```

Verify from another machine after deploy:
```bash
gpg --locate-external-keys mail@hugodaniel.com   # forces remote sources, no local cache
# should return the new key, with origin "wkd"
```

> **Server TLS chain fix (was blocking WKD — fixed 2026-05-22).** hugodaniel.com (OpenBSD + relayd) was serving only the leaf certificate. GnuTLS clients (dirmngr/WKD) failed with `General error` while curl/browsers succeeded via AIA chasing. Fixed by serving the full chain.
> ```
> Certificate chain
>  0 s:CN=hugodaniel.com
>    i:C=US, O=Let's Encrypt, CN=R13     ← leaf only
> ```
> Fix in nginx: switch `ssl_certificate` from `cert.pem` to `fullchain.pem`, then `nginx -s reload`. Verify:
> ```bash
> echo | openssl s_client -connect hugodaniel.com:443 -servername hugodaniel.com -showcerts 2>/dev/null | grep -E "^ [0-9] s:"
> # should show 2 entries: leaf + R13
> ```

### Blog integration

- Add `/pgp` page in `content/`: short text + link to `/pgp.asc`, fingerprint in monospace, instructions for `gpg --locate-keys`.
- Add `<link rel="pgpkey" href="/pgp.asc">` to `templates/index.html` head.
- Add the fingerprint to `static/security.txt` (RFC 9116) under `Encryption:`.
- **Sign the Atom feed:** in `Makefile`, after `zola build`:
  ```make
  publish: build
      gpg --batch --yes --detach-sign --armor public/atom.xml
      rsync ...
  ```
  Result: `/atom.xml.asc` exists alongside the feed. Anyone can verify it was signed by the WKD-resolved key.

### Acceptance criteria for section 1

- [x] `gpg --card-status` shows the YubiKey with three subkeys
- [x] `gpg --locate-external-keys mail@hugodaniel.com` resolves via WKD from hugodaniel.com *(verified 2026-05-22 after OpenBSD/relayd cert chain fix)*
- [x] `keys.openpgp.org/search?q=mail@hugodaniel.com` finds the new key *(both UIDs verified 2026-05-22)*
- [x] `https://hugodaniel.com/pgp.asc` returns the public key
- [x] `https://hugodaniel.com/atom.xml.asc` exists and verifies against the published key *(verified 2026-05-22)*
- [x] Revocation cert stored in two physical locations
- [x] PGP page linked from the site footer *(rendered on every post via `templates/page.html`)*
- [x] New pubkey imported into this machine's local keyring with ultimate trust

---

## 2. Tor onion service (v3)

### Server side
- `apt install tor`
- In `/etc/tor/torrc`:
  ```
  HiddenServiceDir /var/lib/tor/hugodaniel/
  HiddenServiceVersion 3
  HiddenServicePort 80 127.0.0.1:80
  ```
- `systemctl restart tor` → onion address appears at `/var/lib/tor/hugodaniel/hostname`.
- Configure nginx/whatever to also serve hugodaniel.com on `127.0.0.1:80`.

### Client-side discovery
- Add header to clearnet responses: `Onion-Location: http://<onion>.onion/`. Tor Browser auto-suggests the switch.
- Add `<link rel="onion-location" href="http://...onion/">` to `<head>` as fallback.
- Add to `/colophon` page.

### Acceptance
- [ ] `.onion` URL loads the same content
- [ ] Tor Browser shows "Onion available" banner on clearnet visit

---

## 3. Gemini capsule (`gemini://hugodaniel.com`)

- Server: `agate` (single binary, Rust) or `molly-brown`.
- Convert posts: markdown → gemtext is mostly mechanical — short script in `Makefile` using `md2gemini` or hand-written awk.
- Capsule structure mirrors `content/posts/` but flat. Index is a hand-curated `.gmi`.
- TLS cert: Gemini insists on its own; `agate` can self-sign or use the Let's Encrypt cert.

### Acceptance
- [ ] `gemini://hugodaniel.com/` loads in Lagrange / amfora
- [ ] Latest 5 posts available as `.gmi`
- [ ] Linked from `/colophon` on clearweb

---

## 4. Gopher hole (`gopher://hugodaniel.com`)

- Server: `geomyidae` (most active) or `gophernicus`.
- Plain text export of posts; gophermap as the index.
- Lower priority than Gemini — Gemini is more alive in 2026.

---

## 5. Network-layer flex

| Item | Effort | Payoff |
|---|---|---|
| DNSSEC on hugodaniel.com | Low (registrar UI) | Foundation for DANE |
| DANE/TLSA record for HTTPS cert | Low | Real cryptographic flex |
| HTTP/3 + 0-RTT on nginx | Low | Quietly modern |
| IPv6-only subdomain `v6.hugodaniel.com` | Low | Gimmick, fun |
| IPFS mirror with DNSLink (`_dnslink.hugodaniel.com`) | Medium | Decentralization story |
| Public Tor relay (separate from onion) | Medium | Real contribution to the network |

---

## 6. Identity & metadata

- [x] `/.well-known/security.txt` (RFC 9116) — Contact, Expires, Encryption (PGP fingerprint), Preferred-Languages
- [ ] `/humans.txt`
- [ ] Expand existing `/llms.txt`
- [ ] `/.well-known/webfinger` for `acct:hugo@hugodaniel.com`
- [ ] `<link rel="me">` to fediverse handle
- [ ] Keyoxide profile linking PGP key ↔ fediverse ↔ GitHub
- [ ] `/colophon` page: stack, server, fonts, this plan as a public artifact

---

## 7. Feeds & social plumbing

- [ ] JSON Feed (`/feed.json`) alongside Atom
- [ ] h-feed microformats on the index template
- [ ] WebMention receiver: start with `webmention.io`, self-host `webmentiond` later
- [ ] ActivityPub via `bridgy-fed` so the blog itself is followable from Mastodon

---

## 8. Stretch / fun

- Finger daemon (`efingerd`) serving a `.plan` file
- I2P eepsite mirror
- Custom `Server:` header joke
- ASCII-art comment in HTML source for view-source readers
- Terminal aesthetic toggle (CSS-only, respects existing dark mode)

---

## Order of operations

1. **Section 1 (GPG + YubiKey)** — keys + publication done. Remaining: import pubkey on this machine, Hagrid push + verify, WKD, atom feed signing, `/pgp` page. ~30 min of plumbing.
2. **Section 2 (Tor onion)** — fastest "feels hardcore" win after PGP (~30 min)
3. **Section 6 (security.txt + colophon)** — cheap; benefits from §1 being done
4. **Section 3 (Gemini)** — biggest content-engineering effort, do after the easy wins
5. Everything else: opportunistic
