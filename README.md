<h1 align="center">Inazuma Wallet</h1>

<p align="center">
  The self-custody wallet for the <b>Inazuma</b> layer-1 chain — a Chrome/Brave/Edge
  extension plus the provider API websites use to connect to it.
</p>

<p align="center">
  <img alt="manifest" src="https://img.shields.io/badge/manifest-v3-000000">
  <img alt="keys" src="https://img.shields.io/badge/keys-ed25519%20%2B%20ML--DSA--65-000000">
  <img alt="license" src="https://img.shields.io/badge/license-MIT-000000">
</p>

---

## What it does

- Create or import an Inazuma wallet (24-word phrase or `inazkey1…` key)
- Keys are encrypted with your password (AES-GCM, PBKDF2 210k) and **never leave your device**
- Send and receive INAZ and native tokens, see history and live balances
- Connect to any website through `window.inazuma`, with an approval popup for every connect, signature and transaction
- Prove wallet ownership to a site with a gas-free signature (Sign-In With Inazuma)
- Every transaction is dual-signed: Ed25519 + a quantum-resistant ML-DSA-65 co-signature

## Install (from source, 2 minutes)

1. Download this repo: **Code → Download ZIP**, then unzip it.
2. Open `chrome://extensions` in Chrome, Brave or Edge.
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the `extension/` folder from the unzipped repo.
5. Pin the Inazuma icon to your toolbar, click it, and choose **Create wallet**.

Updating later: download the new ZIP over the old folder and press **Reload** on
the extension card.

> A signed one-click build for the Chrome Web Store is in review. Until it lands,
> loading unpacked is the supported path and behaves identically.

## First run

| Step | What happens |
| --- | --- |
| Create wallet | You get 24 words. Write them on paper — they are the only recovery path. |
| Set password | Encrypts the vault on this device. It does not recover the wallet by itself. |
| Receive | Copy your base58 address, or claim test INAZ from the [faucet](https://github.com/inazuma-network/inazuma-faucet). |
| Send | Enter address + amount; fee defaults to the 1,000 rai minimum. Confirmation takes ~400 ms. |

Lost password + have the 24 words → reinstall and import.
Lost the 24 words → the wallet cannot be recovered by anyone, including us.

## For website developers

The extension injects `window.inazuma`. Nothing is exposed until the user approves.

```ts
// 1. detect (injected at document_start; still poll, bundles can run earlier)
const wallet = await new Promise((resolve) => {
  if (window.inazuma?.isInazuma) return resolve(window.inazuma);
  window.addEventListener("inazuma#initialized", () => resolve(window.inazuma), { once: true });
  setTimeout(() => resolve(window.inazuma ?? null), 3000);
});

if (!wallet) {
  // no extension: fall back to an in-page wallet (inazuma-sdk) or show install steps
}

// 2. connect — opens an approval popup
const { address } = await wallet.connect();

// 3. ask for a gas-free ownership proof (sign-in)
const { signature } = await wallet.signMessage("app.example wants you to sign in…");
```

Full method list, event list and error codes: [docs/provider-api.md](docs/provider-api.md).
Building without the extension (in-page wallet): use
[inazuma-sdk](https://github.com/inazuma-network/inazuma-sdk).

## Repo layout

```
extension/
  manifest.json     Manifest V3 definition
  background.js     service worker: vault, signing, RPC calls
  content.js        bridge between the page and the worker
  inpage.js         the window.inazuma provider injected into pages
  popup.html/js     wallet UI (accounts, send, receive, history, settings)
  approve.html/js   approval screens for connect / sign / send
docs/
  provider-api.md   the API websites use
  security.md       threat model and key handling
```

## Security

Keys are generated and used only inside the extension. The background worker
holds the decrypted key in memory while unlocked and wipes it on lock. Pages
can never read key material — they can only request actions the user approves.
Report vulnerabilities per [docs/security.md](docs/security.md).

## Ecosystem

| Repo | Purpose |
| --- | --- |
| [inazuma-core](https://github.com/inazuma-network/inazuma-core) | The Rust L1 node |
| [inazuma-sdk](https://github.com/inazuma-network/inazuma-sdk) | TypeScript SDK |
| [inazuma-wallet](https://github.com/inazuma-network/inazuma-wallet) | Wallet extension + provider (this repo) |
| [inazuma-docs](https://github.com/inazuma-network/inazuma-docs) | Network documentation |
| [inazuma-faucet](https://github.com/inazuma-network/inazuma-faucet) | Test-INAZ faucet |
| [inazuma-contracts](https://github.com/inazuma-network/inazuma-contracts) | WASM contract examples |

MIT licensed.
