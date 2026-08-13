/** Inazuma Wallet popup — OKX-class UX, keys never leave the device. */
import {
  createKeypair,
  decryptVault,
  encryptVault,
  formatInaz,
  keypairFromSecret,
  parseInaz,
  pqFingerprint,
  signMessage,
  signTransfer,
  MIN_FEE,
  type Keypair,
  type Vault,
} from "../../src/lib/wallet-core";

const RPC = "https://rpc.inazuma.network";
const EXPLORER = "https://inazuma.network/explorer";
const ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const AUTOLOCK_MS = 15 * 60 * 1000;

const root = document.getElementById("root") as HTMLElement;
const tabsBar = document.getElementById("tabs") as HTMLElement;
const hdrLock = document.getElementById("hdrlock") as HTMLButtonElement;

type Tab = "wallet" | "activity" | "settings";
type Pending = { id: string; origin: string; address: string; message?: string };
type Tx = { hash: string; from?: string; to?: string; amount?: string; height?: number };

let vault: Vault | null = null;
let keypair: Keypair | null = null;
let tab: Tab = "wallet";
let balance = 0n;
let history: Tx[] = [];
let timer: number | null = null;

/* ---------- helpers ---------- */

async function rpc<T>(method: string, params: unknown = {}): Promise<T> {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = (await res.json()) as { result?: T; error?: { message?: string } };
  if (json.error) throw new Error(json.error.message ?? "RPC error");
  return json.result as T;
}

const store = {
  async get(): Promise<Vault | null> {
    const out = await chrome.storage.local.get("vault");
    return (out.vault as Vault | undefined) ?? null;
  },
  set: (v: Vault) => chrome.storage.local.set({ vault: v }),
  clear: () => chrome.storage.local.remove(["vault", "sites"]),
  async sites(): Promise<string[]> {
    const out = await chrome.storage.local.get("sites");
    return Array.isArray(out.sites) ? (out.sites as string[]) : [];
  },
  setSites: (sites: string[]) => chrome.storage.local.set({ sites }),
};

const el = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const short = (v: string, n = 6) => (v.length > n * 2 + 2 ? `${v.slice(0, n)}…${v.slice(-n)}` : v);
const esc = (v: string) => v.replace(/[<>&"]/g, (c) => `&#${c.charCodeAt(0)};`);

function message(text: string, kind: "ok" | "err") {
  const box = document.getElementById("msg");
  if (box) {
    box.className = `msg ${kind}`;
    box.textContent = text;
  }
}

function copyBtn(id: string, value: string, title = "Copy") {
  return `<button class="iconbtn" id="${id}" data-copy="${esc(value)}" title="${title}">&#9106;</button>`;
}

function wireCopies() {
  root.querySelectorAll<HTMLElement>("[data-copy]").forEach((node) => {
    node.onclick = () => {
      void navigator.clipboard.writeText(node.dataset.copy ?? "");
      const before = node.innerHTML;
      node.innerHTML = "&#10003;";
      window.setTimeout(() => (node.innerHTML = before), 1100);
      message("Copied to clipboard", "ok");
    };
  });
}

/** Blur-until-revealed secret block with an eye toggle. */
function revealBlock(id: string, inner: string) {
  return `<div class="reveal" id="${id}">
      <div class="secret">${inner}</div>
      <div class="eye" data-reveal="${id}">&#9673; Tap to reveal</div>
    </div>`;
}

function wireReveals() {
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    node.onclick = () => {
      const box = el(node.dataset.reveal!);
      const shown = box.classList.toggle("shown");
      node.innerHTML = shown ? "&#9678; Hide" : "&#9673; Tap to reveal";
    };
  });
}

function wordGrid(mnemonic: string) {
  return `<div class="words">${mnemonic
    .split(/\s+/)
    .map((w, i) => `<span><i>${i + 1}</i>${w}</span>`)
    .join("")}</div>`;
}

function chrome_setChip(text: string) {
  const chip = document.getElementById("chip");
  if (chip) chip.textContent = text;
}

function stopPolling() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
}

function lock() {
  keypair = null;
  stopPolling();
  if (vault) lockScreen(vault);
}

hdrLock.onclick = lock;

tabsBar.querySelectorAll<HTMLButtonElement>("button[data-tab]").forEach((btn) => {
  btn.onclick = () => {
    tab = btn.dataset.tab as Tab;
    renderApp();
  };
});

function chromeUi(signedIn: boolean) {
  tabsBar.classList.toggle("on", signedIn);
  hdrLock.style.display = signedIn ? "grid" : "none";
  tabsBar.querySelectorAll<HTMLButtonElement>("button[data-tab]").forEach((b) =>
    b.classList.toggle("active", b.dataset.tab === tab),
  );
}

/* ---------- onboarding ---------- */

function welcome() {
  chromeUi(false);
  chrome_setChip("Mainnet");
  root.innerHTML = `
    <div class="card hero center">
      <img class="logo-lg" src="icon128.png" alt="Inazuma" />
      <h1 class="title">Your Inazuma wallet</h1>
      <p>Self-custody on a sovereign L1. 400ms blocks, ed25519 keys with a
         quantum-resistant ML-DSA co-signer, encrypted on this device.</p>
      <button id="new">Create a new wallet</button>
      <button id="imp" class="ghost">I already have a wallet</button>
    </div>
    <div class="card">
      <div class="kv"><span class="muted">Keys stored</span><span>On this device only</span></div>
      <div class="kv"><span class="muted">Encryption</span><span>AES-256-GCM</span></div>
      <div class="kv"><span class="muted">Recovery</span><span>24 words</span></div>
    </div>
    <div id="msg"></div>`;
  el("new").onclick = () => backupScreen(createKeypair());
  el("imp").onclick = importScreen;
}

function passwordFields() {
  return `<label>Password</label>
    <input id="pw" type="password" placeholder="At least 8 characters" />
    <label>Confirm password</label>
    <input id="pw2" type="password" placeholder="Repeat password" />`;
}

async function saveVault(secret: string) {
  const pw = el<HTMLInputElement>("pw").value;
  const pw2 = el<HTMLInputElement>("pw2").value;
  if (pw.length < 8) throw new Error("Use at least 8 characters.");
  if (pw !== pw2) throw new Error("Passwords do not match.");
  vault = await encryptVault(secret, pw);
  await store.set(vault);
  keypair = keypairFromSecret(secret);
  tab = "wallet";
  await renderApp();
}

function backupScreen(kp: Keypair) {
  chromeUi(false);
  root.innerHTML = `
    <div class="card">
      <h2>Back up your phrase</h2>
      <p>Write these 24 words down offline. Anyone who sees them owns your funds —
         Inazuma cannot restore them for you.</p>
      ${revealBlock("seed", kp.mnemonic ? wordGrid(kp.mnemonic) : esc(kp.key))}
      <div class="row" style="margin-top:10px">
        <button class="ghost" data-copy="${esc(kp.mnemonic ?? kp.key)}">Copy phrase</button>
      </div>
      <div class="kv"><span class="muted">Address</span><span>${short(kp.address)}</span></div>
      <div class="kv"><span class="muted">PQ fingerprint</span><span class="sig">${pqFingerprint(kp.secretHex)}</span></div>
    </div>
    <div class="card">
      <h2>Set a password</h2>
      <p>Unlocks this wallet on this browser. It never leaves your device.</p>
      ${passwordFields()}
      <button id="save">Saved it — continue</button>
      <button id="back" class="ghost">Cancel</button>
      <div id="msg"></div>
    </div>`;
  wireReveals();
  wireCopies();
  el("save").onclick = () =>
    saveVault(kp.mnemonic ?? kp.key).catch((e) => message(e.message, "err"));
  el("back").onclick = welcome;
}

function importScreen() {
  chromeUi(false);
  root.innerHTML = `
    <div class="card">
      <h2>Import wallet</h2>
      <p>Paste your 24-word recovery phrase or an <span class="sig">inazkey1…</span> key.</p>
      <textarea id="sk" rows="3" placeholder="word word word …  or  inazkey1…" spellcheck="false"></textarea>
      ${passwordFields()}
      <button id="save">Import wallet</button>
      <button id="back" class="ghost">Cancel</button>
      <div id="msg"></div>
    </div>`;
  el("save").onclick = () =>
    saveVault(el<HTMLTextAreaElement>("sk").value.trim()).catch((e) => message(e.message, "err"));
  el("back").onclick = welcome;
}

function lockScreen(v: Vault) {
  chromeUi(false);
  root.innerHTML = `
    <div class="card hero center">
      <img class="logo-lg" src="icon128.png" alt="Inazuma" />
      <h1 class="title">Welcome back</h1>
      <p class="mono">${short(v.address, 8)}</p>
      <input id="pw" type="password" placeholder="Password" />
      <button id="open">Unlock</button>
      <button id="forget" class="ghost">Forget this wallet</button>
      <div id="msg"></div>
    </div>`;
  const unlock = async () => {
    keypair = await decryptVault(v, el<HTMLInputElement>("pw").value);
    tab = "wallet";
    await chrome.storage.local.set({ lastActive: Date.now() });
    await boot();
  };
  el("open").onclick = () => unlock().catch((e) => message(e.message, "err"));
  el<HTMLInputElement>("pw").onkeydown = (e) => {
    if ((e as KeyboardEvent).key === "Enter") unlock().catch((err) => message(err.message, "err"));
  };
  el<HTMLInputElement>("pw").focus();
  el("forget").onclick = async () => {
    await store.clear();
    vault = null;
    welcome();
  };
}

/* ---------- connect approval ---------- */

function approvalScreen(p: Pending) {
  chromeUi(false);
  root.innerHTML = `
    <div class="card hero">
      <h2>Connect request</h2>
      <p>This site is asking to see your Inazuma address.</p>
      <div class="kv"><span class="muted">Site</span><span>${esc(p.origin.replace(/^https?:\/\//, ""))}</span></div>
      <div class="kv"><span class="muted">Account</span><span class="sig">${short(p.address, 8)}</span></div>
      <div class="kv"><span class="muted">Network</span><span>Inazuma Mainnet</span></div>
    </div>
    <div class="card">
      <p>Only your public address is shared. This site can never move funds without
         a transaction you approve here.</p>
      <div class="row">
        <button id="reject" class="ghost">Reject</button>
        <button id="approve">Connect</button>
      </div>
    </div>`;
  const answer = (approved: boolean) =>
    chrome.runtime.sendMessage(
      { type: "INAZ_APPROVAL", id: p.id, origin: p.origin, approved },
      () => void boot(),
    );
  el("approve").onclick = () => answer(true);
  el("reject").onclick = () => answer(false);
}

/* ---------- sign-in (message signature) approval ---------- */

function signRequestScreen(p: Pending) {
  chromeUi(false);
  root.innerHTML = `
    <div class="card hero">
      <h2>Signature request</h2>
      <p>This site wants you to prove you own this wallet. No gas, no funds move.</p>
      <div class="kv"><span class="muted">Site</span><span>${esc(p.origin.replace(/^https?:\/\//, ""))}</span></div>
      <div class="kv"><span class="muted">Account</span><span class="sig">${short(p.address, 8)}</span></div>
    </div>
    <div class="card">
      <label>Message</label>
      <div class="secret" style="white-space:pre-wrap;font-size:11px">${esc(p.message ?? "")}</div>
      <div class="row" style="margin-top:12px">
        <button id="reject" class="ghost">Reject</button>
        <button id="sign">Sign</button>
      </div>
      <div id="msg"></div>
    </div>`;
  el("reject").onclick = () =>
    chrome.runtime.sendMessage(
      { type: "INAZ_SIGNED", id: p.id, error: "Signature rejected." },
      () => void boot(),
    );
  el("sign").onclick = () => {
    try {
      const out = signMessage(keypair!.key, p.message ?? "");
      chrome.runtime.sendMessage(
        { type: "INAZ_SIGNED", id: p.id, address: out.address, signature: out.signature },
        () => void boot(),
      );
    } catch (e) {
      message((e as Error).message, "err");
    }
  };
}

/* ---------- main app ---------- */

async function renderApp() {
  if (!keypair) return;
  chromeUi(true);
  if (tab === "wallet") walletTab();
  if (tab === "activity") activityTab();
  if (tab === "settings") await settingsTab();
  stopPolling();
  timer = window.setInterval(() => void refresh(), 8000);
  void refresh();
}

function walletTab() {
  const kp = keypair!;
  root.innerHTML = `
    <div class="card hero">
      <span class="sub muted">Total balance</span>
      <div class="balance" id="bal">${formatInaz(balance)}<span>INAZ</span></div>
      <span class="sub muted" id="fee">Network fee ${formatInaz(MIN_FEE, 6)} INAZ · 400ms blocks</span>
      <div class="addrrow">
        <span class="mono" title="${esc(kp.address)}">${short(kp.address, 10)}</span>
        ${copyBtn("cpaddr", kp.address, "Copy address")}
        <button class="iconbtn" id="openexp" title="View in explorer">&#8599;</button>
      </div>
    </div>
    <div class="card">
      <h2>Send INAZ</h2>
      <label>Recipient</label>
      <input id="to" placeholder="Inazuma address" spellcheck="false" />
      <label>Amount</label>
      <input id="amt" placeholder="0.00" inputmode="decimal" />
      <div class="row">
        <button class="ghost" id="max">Max</button>
        <button id="review">Review</button>
      </div>
      <div id="msg"></div>
    </div>
    <div class="card">
      <h2>Recent</h2>
      <ul id="mini"><li class="tx muted">Loading…</li></ul>
    </div>`;
  wireCopies();
  el("openexp").onclick = () =>
    void chrome.tabs.create({ url: `${EXPLORER}/address/${kp.address}` });
  el("max").onclick = () => {
    const spend = balance > MIN_FEE ? balance - MIN_FEE : 0n;
    el<HTMLInputElement>("amt").value = formatInaz(spend, 9);
  };
  el("review").onclick = () => review().catch((e) => message(e.message, "err"));
  renderTxList("mini", 4);
}

async function review() {
  const to = el<HTMLInputElement>("to").value.trim();
  const raw = el<HTMLInputElement>("amt").value;
  if (!ADDRESS_RE.test(to)) throw new Error("That is not a valid Inazuma address.");
  const amountRai = parseInaz(raw);
  if (amountRai <= 0n) throw new Error("Enter an amount above zero.");
  if (amountRai + MIN_FEE > balance) throw new Error("Not enough balance for amount + fee.");
  confirmScreen(to, amountRai);
}

function confirmScreen(to: string, amountRai: bigint) {
  const kp = keypair!;
  tabsBar.classList.remove("on");
  root.innerHTML = `
    <div class="card hero center">
      <span class="sub muted">You are sending</span>
      <div class="balance">${formatInaz(amountRai, 6)}<span>INAZ</span></div>
    </div>
    <div class="card">
      <div class="kv"><span class="muted">From</span><span>${short(kp.address)}</span></div>
      <div class="kv"><span class="muted">To</span><span>${short(to)}</span></div>
      <div class="kv"><span class="muted">Network fee</span><span>${formatInaz(MIN_FEE, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Total</span><span class="sig">${formatInaz(amountRai + MIN_FEE, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Signature</span><span>ed25519 + ML-DSA-65</span></div>
    </div>
    <div class="card">
      <div class="row">
        <button class="ghost" id="cancel">Back</button>
        <button id="confirm">Confirm &amp; send</button>
      </div>
      <div id="msg"></div>
    </div>`;
  el("cancel").onclick = () => {
    tab = "wallet";
    void renderApp();
  };
  el("confirm").onclick = () => {
    el<HTMLButtonElement>("confirm").disabled = true;
    send(to, amountRai)
      .then((hash) => sentScreen(hash, to, amountRai))
      .catch((e) => {
        el<HTMLButtonElement>("confirm").disabled = false;
        message(e.message, "err");
      });
  };
}

async function send(to: string, amountRai: bigint) {
  const kp = keypair!;
  const acct = await rpc<{ balance: string; pendingNonce: number; nonce: number }>(
    "inaz_getAccount",
    { address: kp.address },
  );
  if (amountRai + MIN_FEE > BigInt(acct.balance ?? "0"))
    throw new Error("Not enough balance for amount + fee.");
  const tx = signTransfer({
    secret: kp.key,
    to,
    amountRai,
    nonce: acct.pendingNonce ?? acct.nonce ?? 0,
  });
  const out = await rpc<{ hash: string }>("inaz_sendTransaction", { tx });
  return out.hash;
}

function sentScreen(hash: string, to: string, amountRai: bigint) {
  root.innerHTML = `
    <div class="card hero center">
      <div style="font-size:34px;line-height:1">&#10003;</div>
      <h1 class="title" style="margin-top:8px">Transfer sent</h1>
      <p>${formatInaz(amountRai, 6)} INAZ to ${short(to)}</p>
    </div>
    <div class="card">
      <label>Transaction hash</label>
      <div class="addrrow">
        <span class="mono">${short(hash, 10)}</span>
        ${copyBtn("cphash", hash, "Copy hash")}
        <button class="iconbtn" id="openexp" title="View in explorer">&#8599;</button>
      </div>
      <button id="done" style="margin-top:12px">Back to wallet</button>
      <div id="msg"></div>
    </div>`;
  wireCopies();
  el("openexp").onclick = () => void chrome.tabs.create({ url: `${EXPLORER}/tx/${hash}` });
  el("done").onclick = () => {
    tab = "wallet";
    void renderApp();
  };
}

/* ---------- activity ---------- */

function activityTab() {
  root.innerHTML = `
    <div class="card">
      <h2>Activity</h2>
      <ul id="full"><li class="tx muted">Loading…</li></ul>
    </div>
    <div id="msg"></div>`;
  renderTxList("full", 25);
}

function renderTxList(id: string, limit: number) {
  const kp = keypair;
  const list = document.getElementById(id);
  if (!list || !kp) return;
  const rows = history.slice(0, limit);
  if (!rows.length) {
    list.innerHTML = `<li class="tx muted">No transfers yet.</li>`;
    return;
  }
  list.innerHTML = rows
    .map((t) => {
      const out = t.from === kp.address;
      const other = out ? t.to : t.from;
      return `<li class="tx">
        <span class="dot ${out ? "out" : "in"}">${out ? "&#8599;" : "&#8600;"}</span>
        <span class="txmeta">
          <b>${out ? "Sent" : "Received"}</b>
          <span class="sub muted">${other ? short(other, 5) : "—"}</span>
        </span>
        <span class="txamt ${out ? "" : "sig"}">${out ? "-" : "+"}${
          t.amount ? formatInaz(BigInt(t.amount), 4) : "0"
        }</span>
      </li>`;
    })
    .join("");
}

/* ---------- settings ---------- */

async function settingsTab() {
  const kp = keypair!;
  const sites = await store.sites();
  root.innerHTML = `
    <div class="card">
      <h2>Account</h2>
      <div class="addrrow">
        <span class="mono">${short(kp.address, 9)}</span>
        ${copyBtn("cpaddr2", kp.address, "Copy address")}
      </div>
      <div class="kv" style="margin-top:10px"><span class="muted">Network</span><span>Inazuma Mainnet</span></div>
      <div class="kv"><span class="muted">Signature scheme</span><span>ed25519 + ML-DSA-65</span></div>
      <div class="kv"><span class="muted">PQ fingerprint</span><span class="sig">${pqFingerprint(kp.secretHex)}</span></div>
      <div class="kv"><span class="muted">Auto-lock</span><span>15 min</span></div>
    </div>
    <div class="card">
      <h2>Connected sites</h2>
      ${
        sites.length
          ? sites
              .map(
                (s, i) =>
                  `<div class="kv"><span>${esc(s.replace(/^https?:\/\//, ""))}</span><span><button class="iconbtn" data-revoke="${i}" title="Revoke">&#10005;</button></span></div>`,
              )
              .join("")
          : `<p>No sites connected yet.</p>`
      }
    </div>
    <div class="card warn">
      <h2>Reveal secrets</h2>
      <p>Enter your password to reveal your recovery phrase or private key. Never
         share them — anyone with them controls your funds.</p>
      <input id="expw" type="password" placeholder="Password" />
      <button id="exp" class="ghost">Reveal</button>
      <div id="secrets"></div>
      <div id="msg"></div>
    </div>
    <div class="card">
      <button id="lockbtn" class="ghost">Lock wallet</button>
      <button id="forget" class="danger">Remove wallet from this browser</button>
    </div>`;
  wireCopies();

  root.querySelectorAll<HTMLElement>("[data-revoke]").forEach((node) => {
    node.onclick = async () => {
      const next = sites.filter((_, i) => i !== Number(node.dataset.revoke));
      await store.setSites(next);
      await settingsTab();
    };
  });

  el("exp").onclick = () => {
    const pw = el<HTMLInputElement>("expw").value;
    decryptVault(vault!, pw)
      .then((full) => showSecrets(full))
      .catch(() => message("Wrong password.", "err"));
  };
  el("lockbtn").onclick = lock;
  el("forget").onclick = async () => {
    await store.clear();
    vault = null;
    keypair = null;
    stopPolling();
    welcome();
  };
}

function showSecrets(kp: Keypair) {
  const box = el("secrets");
  box.innerHTML = `
    ${kp.mnemonic ? `<label style="margin-top:10px">Recovery phrase</label>${revealBlock("s1", wordGrid(kp.mnemonic))}` : ""}
    <label style="margin-top:12px">Private key (Inazuma format)</label>
    ${revealBlock("s2", esc(kp.key))}
    <div class="row" style="margin-top:10px">
      ${kp.mnemonic ? `<button class="ghost" data-copy="${esc(kp.mnemonic)}">Copy phrase</button>` : ""}
      <button class="ghost" data-copy="${esc(kp.key)}">Copy key</button>
    </div>`;
  wireReveals();
  wireCopies();
  el<HTMLInputElement>("expw").value = "";
}

/* ---------- data ---------- */

async function refresh() {
  const kp = keypair;
  if (!kp) return;
  try {
    const acct = await rpc<{ balance: string }>("inaz_getAccount", { address: kp.address });
    balance = BigInt(acct.balance ?? "0");
    const bal = document.getElementById("bal");
    if (bal) bal.innerHTML = `${formatInaz(balance)}<span>INAZ</span>`;

    const blocks = await rpc<{ height: number; transactions?: Tx[] }[]>("inaz_latestBlocks", {
      limit: 60,
    });
    history = blocks.flatMap((b) =>
      (b.transactions ?? [])
        .filter((t) => t.from === kp.address || t.to === kp.address)
        .map((t) => ({ ...t, height: b.height })),
    );
    renderTxList("mini", 4);
    renderTxList("full", 25);
  } catch (e) {
    message(e instanceof Error ? e.message : "Node unreachable.", "err");
  }
}

/* ---------- boot ---------- */

async function boot() {
  vault = await store.get();
  const out = await chrome.storage.local.get(["pending", "lastActive"]);
  const pending = out.pending as Pending | undefined;
  const last = Number(out.lastActive ?? 0);
  if (keypair && Date.now() - last > AUTOLOCK_MS) keypair = null;

  if (pending && vault && !keypair) {
    lockScreen(vault);
    return;
  }
  if (pending && vault && keypair) {
    if (pending.message) signRequestScreen(pending);
    else approvalScreen(pending);
    return;
  }
  if (keypair) {
    await renderApp();
    return;
  }
  if (vault) lockScreen(vault);
  else welcome();
}

document.addEventListener("click", () => void chrome.storage.local.set({ lastActive: Date.now() }));
void boot();
