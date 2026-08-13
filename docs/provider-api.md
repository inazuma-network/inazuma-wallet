# `window.inazuma` provider API

The extension injects `window.inazuma` into every page at `document_start`.
All methods return promises and reject with an `Error` whose message is safe to
show the user. Nothing is readable until the user approves a connection.

## Detection

```ts
function getProvider(timeoutMs = 3000) {
  return new Promise((resolve) => {
    if (window.inazuma?.isInazuma) return resolve(window.inazuma);
    const done = () => resolve(window.inazuma ?? null);
    window.addEventListener("inazuma#initialized", done, { once: true });
    setTimeout(done, timeoutMs);
  });
}

const wallet = await getProvider();
if (!wallet) { /* no extension: fall back to an in-page wallet or show install steps */ }
```

## Surface

| Member | Approval | Returns |
| --- | --- | --- |
| `isInazuma` | — | `true` |
| `chainId` | — | `7777` |
| `connect()` | popup, once per site | `{ address }` |
| `getAddress()` | none (after connect) | `{ address }` or rejects when not connected |
| `disconnect()` | none | forgets this site |
| `signMessage(message)` | popup | `{ address, signature }` — Ed25519 hex, gas-free |
| `request(method, params)` | depends | escape hatch for newer methods |

Requests time out after 120 s if the user never answers the popup.

## Events

```ts
window.addEventListener("inazuma#initialized", () => { /* provider ready */ });
```

## Errors

Rejections carry a message, not a numeric code. Handle these cases:

| Message contains | Meaning | What to do |
| --- | --- | --- |
| `rejected` | User pressed Cancel | Stay silent, keep the UI unchanged |
| `locked` | Wallet is locked | Ask the user to unlock the extension |
| `not connected` | `connect()` not approved yet | Call `connect()` first |
| `timed out` | Popup never answered | Let the user retry |

```ts
try {
  const { address } = await wallet.connect();
} catch (e) {
  if (/rejected/i.test(e.message)) return;
  console.error(e.message);
}
```

## Sign-in pattern (prove ownership, no gas)

1. Your server issues a random nonce and stores it briefly.
2. The page builds the message with `buildSignInMessage` from
   [inazuma-sdk](https://github.com/inazuma-network/inazuma-sdk).
3. `const { signature, address } = await wallet.signMessage(message)`.
4. The server calls `verifySignInSignature(address, message, signature)`, checks
   the nonce and the timestamp (5-minute window), then opens a session.

Signing never moves funds and costs nothing.

## Sending transactions

Transfers are confirmed inside the wallet UI. For app-initiated transfers, build
and sign locally with [inazuma-sdk](https://github.com/inazuma-network/inazuma-sdk)
when you hold an in-page wallet, or use `request()` for provider methods added in
later extension versions — check `manifest.json` → `version` before relying on one.
