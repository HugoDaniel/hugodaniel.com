+++
title = "PGP"
description = "Public key and fingerprint for verifying signed messages and signed files from Hugo Daniel."
date = 2026-05-22
extra = { place = "Amadora", author = "Hugo Daniel" }
+++

You can encrypt messages to me, or verify things I have signed, with this key.

## Fingerprint

```
E49D 556A D099 3482 CA78  B6E8 C181 88F9 E2A4 C0AD
```

Identities (both verified):

- `mail@hugodaniel.com`
- `hello@hugodaniel.com`

## Get the key

Pick whichever you trust most.

**Direct download** — [pgp.asc](/pgp.asc) — also reachable over Tor at [the onion mirror](http://gbbodsjshg2lrktc3vpcobn5i3qcuhtab5nkzjxaiip3yj5s3rlws7ad.onion/pgp.asc).

**Web Key Directory** — resolves straight from this domain:

```sh
gpg --locate-external-keys mail@hugodaniel.com
```

**Keyserver:**

```sh
gpg --keyserver hkps://keys.openpgp.org \
    --recv-keys E49D556AD0993482CA78B6E8C18188F9E2A4C0AD
```

## Verify the Atom feed

The feed at `/atom.xml` is detached-signed. Verify any snapshot you fetched:

```sh
curl -sO https://hugodaniel.com/atom.xml
curl -sO https://hugodaniel.com/atom.xml.asc
gpg --verify atom.xml.asc atom.xml
```

## Key details

- Algorithm: Ed25519 (curve25519) primary, with cv25519 encrypt and ed25519 sign/auth subkeys
- Created: 2026-05-21
- Subkeys live on a YubiKey 5; signing requires a physical touch
- Revocation certificate is stored offline in two locations — if this key disappears from circulation, it was revoked on purpose
