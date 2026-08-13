# Wallet security

## Key handling

- Keys are generated in the extension with the platform CSPRNG.
- The vault is AES-GCM encrypted with a PBKDF2-SHA256 key (210,000 iterations)
  derived from the user's password; the plaintext key exists only in the
  background worker's memory while unlocked, and is dropped on lock or browser exit.
- Web pages, content scripts and the popup never receive key material. They send
  requests; the worker signs.
- Backups are `inazkey1…` strings or 24 words. Both are Inazuma-specific and
  cannot be imported into other networks' wallets.

## Approval model

Connect, message signing and every transaction open a separate approval window
showing origin, recipient, amount and fee. Nothing auto-approves, and site
permissions are per-origin and revocable from the popup.

## Post-quantum posture

Transactions carry an ML-DSA-65 (FIPS 204) co-signature derived from the same
master secret, so accounts are already bound to a quantum-resistant key before
the network enforces it.

## Reporting a vulnerability

Open a private security advisory on this repository. Please do not file public
issues for exploitable bugs. Include reproduction steps, affected version
(`manifest.json` → `version`) and impact.
