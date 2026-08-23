/** Inazuma Wallet popup — app-grade UX, keys never leave the device. */
import QRCode from "qrcode";
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
const SITE = "https://inazuma.network";
const EXPLORER = `${SITE}/explorer`;
/** Indexed transaction feed. The node itself has no address-level tx index. */
const TX_API = `${SITE}/api/public/chain/txs`;
const ADDRESS_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
const AUTOLOCK_MS = 15 * 60 * 1000;

const root = document.getElementById("root") as HTMLElement;
const tabsBar = document.getElementById("tabs") as HTMLElement;
const hdrLock = document.getElementById("hdrlock") as HTMLButtonElement;
const hdrAcct = document.getElementById("hdracct") as HTMLButtonElement;

type Tab = "wallet" | "activity" | "settings";
type Pending = { id: string; origin: string; address: string; message?: string };
type Account = { label: string; vault: Vault };
type Tx = {
  hash: string;
  from?: string | null;
  to?: string | null;
  amount?: string;
  height?: number;
  kind?: string;
  timestampMs?: number;
};

let accounts: Account[] = [];
let active = 0;
let keypair: Keypair | null = null;
let tab: Tab = "wallet";
let balance = 0n;
let hidden = false;
let history: Tx[] = [];
let timer: number | null = null;

const vault = () => accounts[active]?.vault ?? null;

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
  /** Reads the account list, migrating the legacy single-vault layout. */
  async load(): Promise<{ accounts: Account[]; active: number }> {
    const out = await chrome.storage.local.get(["accounts", "active", "vault", "hidden"]);
    hidden = out.hidden === true;
    let list = Array.isArray(out.accounts) ? (out.accounts as Account[]) : [];
    if (!list.length && out.vault) {
      list = [{ label: "Account 1", vault: out.vault as Vault }];
      await chrome.storage.local.set({ accounts: list, active: 0 });
    }
    const idx = Math.min(Number(out.active ?? 0), Math.max(0, list.length - 1));
    return { accounts: list, active: idx };
  },
  save: () => chrome.storage.local.set({ accounts, active }),
  clearAll: () =>
    chrome.storage.local.remove([
      "vault",
      "accounts",
      "active",
      "sites",
      "cacheAddr",
      "cacheBal",
      "cacheTxs",
    ]),
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

function stopPolling() {
  if (timer !== null) window.clearInterval(timer);
  timer = null;
}

function lock() {
  keypair = null;
  stopPolling();
  const v = vault();
  if (v) lockScreen(v);
}

hdrLock.onclick = lock;
hdrAcct.onclick = () => void accountsScreen();

tabsBar.querySelectorAll<HTMLButtonElement>("button[data-tab]").forEach((btn) => {
  btn.onclick = () => {
    tab = btn.dataset.tab as Tab;
    void renderApp();
  };
});

function chromeUi(signedIn: boolean) {
  tabsBar.classList.toggle("on", signedIn);
  hdrLock.style.display = signedIn ? "grid" : "none";
  hdrAcct.style.display = signedIn ? "flex" : "none";
  if (signedIn && keypair) {
    hdrAcct.innerHTML = `<b>${esc(accounts[active]?.label ?? "Account")}</b><span>${short(keypair.address, 4)}</span>`;
  }
  tabsBar
    .querySelectorAll<HTMLButtonElement>("button[data-tab]")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
}

/* ---------- onboarding ---------- */

function welcome() {
  chromeUi(false);
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
  el("imp").onclick = () => importScreen();
}

function passwordFields() {
  return `<label>Password</label>
    <input id="pw" type="password" placeholder="At least 8 characters" />
    <label>Confirm password</label>
    <input id="pw2" type="password" placeholder="Repeat password" />`;
}

async function addAccount(secret: string, label?: string) {
  const pw = el<HTMLInputElement>("pw").value;
  const pw2 = el<HTMLInputElement>("pw2").value;
  if (pw.length < 8) throw new Error("Use at least 8 characters.");
  if (pw !== pw2) throw new Error("Passwords do not match.");
  const v = await encryptVault(secret, pw);
  if (accounts.some((a) => a.vault.address === v.address))
    throw new Error("That wallet is already in this browser.");
  accounts = [...accounts, { label: label ?? `Account ${accounts.length + 1}`, vault: v }];
  active = accounts.length - 1;
  await store.save();
  keypair = keypairFromSecret(secret);
  balance = 0n;
  history = [];
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
      <p>Unlocks this account on this browser. It never leaves your device.</p>
      ${passwordFields()}
      <button id="save">Saved it — continue</button>
      <button id="back" class="ghost">Cancel</button>
      <div id="msg"></div>
    </div>`;
  wireReveals();
  wireCopies();
  el("save").onclick = () =>
    addAccount(kp.mnemonic ?? kp.key).catch((e) => message(e.message, "err"));
  el("back").onclick = () => (accounts.length ? void renderApp() : welcome());
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
    addAccount(el<HTMLTextAreaElement>("sk").value.trim()).catch((e) => message(e.message, "err"));
  el("back").onclick = () => (accounts.length ? void renderApp() : welcome());
}

function lockScreen(v: Vault) {
  chromeUi(false);
  root.innerHTML = `
    <div class="card hero center">
      <img class="logo-lg" src="icon128.png" alt="Inazuma" />
      <h1 class="title">Welcome back</h1>
      <p class="mono">${esc(accounts[active]?.label ?? "Account")} · ${short(v.address, 6)}</p>
      <input id="pw" type="password" placeholder="Password" />
      <button id="open">Unlock</button>
      ${accounts.length > 1 ? `<button id="switch" class="ghost">Switch account</button>` : ""}
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
  const sw = document.getElementById("switch");
  if (sw) sw.onclick = () => void accountsScreen();
}

/* ---------- accounts ---------- */

async function accountsScreen() {
  chromeUi(false);
  root.innerHTML = `
    <div class="card">
      <h2>Accounts</h2>
      <p>Each account has its own keys and password. Switching never touches the others.</p>
      <ul id="list">
        ${accounts
          .map(
            (a, i) => `<li class="acct${i === active ? " on" : ""}" data-pick="${i}">
              <span class="av">${esc((a.label[0] ?? "A").toUpperCase())}</span>
              <span class="txmeta"><b>${esc(a.label)}</b><span class="sub muted">${short(a.vault.address, 6)}</span></span>
              <span class="sig">${i === active ? "&#10003;" : ""}</span>
            </li>`,
          )
          .join("")}
      </ul>
    </div>
    <div class="card">
      <button id="add">Create new account</button>
      <button id="imp" class="ghost">Import existing</button>
      ${keypair ? `<button id="back" class="ghost">Back to wallet</button>` : ""}
      <div id="msg"></div>
    </div>`;
  root.querySelectorAll<HTMLElement>("[data-pick]").forEach((node) => {
    node.onclick = async () => {
      const i = Number(node.dataset.pick);
      if (i === active && keypair) {
        await renderApp();
        return;
      }
      active = i;
      keypair = null;
      balance = 0n;
      history = [];
      await store.save();
      lockScreen(accounts[i].vault);
    };
  });
  el("add").onclick = () => backupScreen(createKeypair());
  el("imp").onclick = () => importScreen();
  const back = document.getElementById("back");
  if (back) back.onclick = () => void renderApp();
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
  paintBalance();
  stopPolling();
  timer = window.setInterval(() => void refresh(), 8000);
  void refresh();
}

function tile(id: string, glyph: string, label: string) {
  return `<button class="tile" id="${id}"><span>${glyph}</span>${label}</button>`;
}

function walletTab() {
  const kp = keypair!;
  root.innerHTML = `
    <div class="card hero">
      <div class="balrow">
        <span class="sub muted">Total balance</span>
        <button class="iconbtn" id="eye" title="Hide balance">${hidden ? "&#9673;" : "&#9678;"}</button>
      </div>
      <div class="balance" id="bal">${hidden ? "••••" : formatInaz(balance)}<span>INAZ</span></div>
      <div class="addrrow">
        <span class="mono" title="${esc(kp.address)}">${short(kp.address, 10)}</span>
        ${copyBtn("cpaddr", kp.address, "Copy address")}
        <button class="iconbtn" id="openexp" title="View in explorer">&#8599;</button>
      </div>
      <div class="tiles">
        ${tile("go-send", "&#8599;", "Send")}
        ${tile("go-recv", "&#8600;", "Receive")}
        ${tile("go-act", "&#8635;", "Activity")}
        ${tile("go-set", "&#9881;", "Settings")}
      </div>
    </div>
    <div class="card">
      <div class="balrow"><h2>Recent</h2><span class="sub muted" id="fee">Fee ${formatInaz(MIN_FEE, 6)} INAZ</span></div>
      <ul id="mini"><li class="tx muted">Loading…</li></ul>
    </div>
    <div id="msg"></div>`;
  wireCopies();
  el("eye").onclick = () => {
    hidden = !hidden;
    void chrome.storage.local.set({ hidden });
    walletTab();
    paintBalance();
    renderTxList("mini", 4);
  };
  el("openexp").onclick = () =>
    void chrome.tabs.create({ url: `${EXPLORER}/address/${kp.address}` });
  el("go-send").onclick = () => sendScreen();
  el("go-recv").onclick = () => void receiveScreen();
  el("go-act").onclick = () => {
    tab = "activity";
    void renderApp();
  };
  el("go-set").onclick = () => {
    tab = "settings";
    void renderApp();
  };
  renderTxList("mini", 4);
}

/* ---------- send ---------- */

function sendScreen() {
  tabsBar.classList.remove("on");
  root.innerHTML = `
    <div class="card">
      <h2>Send INAZ</h2>
      <label>Recipient</label>
      <input id="to" placeholder="Inazuma address" spellcheck="false" />
      <label>Amount</label>
      <input id="amt" placeholder="0.00" inputmode="decimal" />
      <div class="kv"><span class="muted">Available</span><span>${formatInaz(balance, 6)} INAZ</span></div>
      <div class="kv"><span class="muted">Network fee</span><span>${formatInaz(MIN_FEE, 6)} INAZ</span></div>
      <div class="row" style="margin-top:12px">
        <button class="ghost" id="max">Max</button>
        <button id="review">Review</button>
      </div>
      <button class="ghost" id="cancel">Back</button>
      <div id="msg"></div>
    </div>`;
  el("max").onclick = () => {
    const spend = balance > MIN_FEE ? balance - MIN_FEE : 0n;
    el<HTMLInputElement>("amt").value = formatInaz(spend, 9);
  };
  el("review").onclick = () => review().catch((e) => message(e.message, "err"));
  el("cancel").onclick = () => {
    tab = "wallet";
    void renderApp();
  };
  el<HTMLInputElement>("to").focus();
}

async function receiveScreen() {
  const kp = keypair!;
  tabsBar.classList.remove("on");
  let png = "";
  try {
    png = await QRCode.toDataURL(kp.address, {
      margin: 1,
      width: 220,
      color: { dark: "#f6f6f8", light: "#0e0e14" },
    });
  } catch {
    png = "";
  }
  root.innerHTML = `
    <div class="card center">
      <h2>Receive</h2>
      <p>Only send INAZ and Inazuma-native assets to this address.</p>
      ${png ? `<img class="qr" src="${png}" alt="Address QR" />` : ""}
      <div class="addrrow">
        <span class="mono" title="${esc(kp.address)}">${short(kp.address, 10)}</span>
        ${copyBtn("cpaddr3", kp.address, "Copy address")}
      </div>
      <button class="ghost" id="back" style="margin-top:12px">Back</button>
      <div id="msg"></div>
    </div>`;
  wireCopies();
  el("back").onclick = () => {
    tab = "wallet";
    void renderApp();
  };
}

async function review() {
  const to = el<HTMLInputElement>("to").value.trim();
  const raw = el<HTMLInputElement>("amt").value;
  if (!ADDRESS_RE.test(to)) throw new Error("That is not a valid Inazuma address.");
  if (to === keypair!.address) throw new Error("That is your own address.");
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
  el("cancel").onclick = () => sendScreen();
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
  if (history.length) renderTxList("full", 25);
}

function renderTxList(id: string, limit: number) {
  const kp = keypair;
  const list = document.getElementById(id);
  if (!list || !kp) return;
  const rows = history.slice(0, limit);
  if (!rows.length) {
    list.innerHTML = `<li class="tx muted">No transactions yet.</li>`;
    return;
  }
  list.innerHTML = rows
    .map((t) => {
      const out = t.from === kp.address;
      const self = t.from === t.to;
      const other = out ? t.to : t.from;
      const label =
        t.kind && t.kind !== "transfer" ? cap(t.kind) : self ? "Self" : out ? "Sent" : "Received";
      const sign = self || !t.amount || t.amount === "0" ? "" : out ? "-" : "+";
      const amt = hidden ? "••" : `${sign}${t.amount ? formatInaz(BigInt(t.amount), 4) : "0"}`;
      return `<li class="tx" data-hash="${esc(t.hash)}" title="Open in explorer">
        <span class="dot ${out && !self ? "out" : "in"}">${out && !self ? "&#8599;" : "&#8600;"}</span>
        <span class="txmeta">
          <b>${esc(label)}</b>
          <span class="sub muted">${other ? short(other, 5) : "—"}${
            t.timestampMs ? ` · ${ago(t.timestampMs)}` : ""
          }</span>
        </span>
        <span class="txamt ${out && !self ? "" : "sig"}">${amt}</span>
      </li>`;
    })
    .join("");
  list.querySelectorAll<HTMLElement>("li[data-hash]").forEach((li) => {
    li.style.cursor = "pointer";
    li.onclick = () => void chrome.tabs.create({ url: `${EXPLORER}/tx/${li.dataset.hash}` });
  });
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function ago(ms: number) {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

/* ---------- settings ---------- */

async function settingsTab() {
  const kp = keypair!;
  const sites = await store.sites();
  root.innerHTML = `
    <div class="card">
      <h2>Account</h2>
      <label>Name</label>
      <input id="label" value="${esc(accounts[active]?.label ?? "Account")}" />
      <button class="ghost" id="rename">Save name</button>
      <div class="addrrow">
        <span class="mono">${short(kp.address, 9)}</span>
        ${copyBtn("cpaddr2", kp.address, "Copy address")}
      </div>
      <div class="kv" style="margin-top:10px"><span class="muted">Network</span><span>Inazuma Mainnet</span></div>
      <div class="kv"><span class="muted">Signature scheme</span><span>ed25519 + ML-DSA-65</span></div>
      <div class="kv"><span class="muted">PQ fingerprint</span><span class="sig">${pqFingerprint(kp.secretHex)}</span></div>
      <div class="kv"><span class="muted">Auto-lock</span><span>15 min</span></div>
      <button class="ghost" id="accts" style="margin-top:10px">Manage accounts</button>
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
      <button id="rmacct" class="danger">Remove this account</button>
    </div>`;
  wireCopies();

  root.querySelectorAll<HTMLElement>("[data-revoke]").forEach((node) => {
    node.onclick = async () => {
      const next = sites.filter((_, i) => i !== Number(node.dataset.revoke));
      await store.setSites(next);
      await settingsTab();
    };
  });

  el("rename").onclick = async () => {
    const name = el<HTMLInputElement>("label").value.trim().slice(0, 24);
    if (!name) return message("Enter a name.", "err");
    accounts[active] = { ...accounts[active], label: name };
    await store.save();
    chromeUi(true);
    message("Name saved", "ok");
  };
  el("accts").onclick = () => void accountsScreen();
  el("exp").onclick = () => {
    const pw = el<HTMLInputElement>("expw").value;
    decryptVault(vault()!, pw)
      .then((full) => showSecrets(full))
      .catch(() => message("Wrong password.", "err"));
  };
  el("lockbtn").onclick = lock;
  el("rmacct").onclick = async () => {
    accounts = accounts.filter((_, i) => i !== active);
    active = 0;
    keypair = null;
    balance = 0n;
    history = [];
    stopPolling();
    if (!accounts.length) {
      await store.clearAll();
      welcome();
      return;
    }
    await store.save();
    lockScreen(accounts[0].vault);
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

function paintBalance() {
  const bal = document.getElementById("bal");
  if (bal) bal.innerHTML = `${hidden ? "••••" : formatInaz(balance)}<span>INAZ</span>`;
}

/** Last known balance + history, so the popup paints instantly instead of blank. */
async function loadCache(address: string) {
  const out = await chrome.storage.local.get(["cacheBal", "cacheTxs", "cacheAddr"]);
  if (out.cacheAddr !== address) return;
  if (typeof out.cacheBal === "string") balance = BigInt(out.cacheBal);
  if (Array.isArray(out.cacheTxs)) history = out.cacheTxs as Tx[];
}

function saveCache(address: string) {
  void chrome.storage.local.set({
    cacheAddr: address,
    cacheBal: balance.toString(),
    cacheTxs: history.slice(0, 25),
  });
}

async function fetchBalance(address: string) {
  const acct = await rpc<{ balance: string }>("inaz_getAccount", { address });
  return BigInt(acct.balance ?? "0");
}

async function fetchHistory(address: string): Promise<Tx[]> {
  const res = await fetch(`${TX_API}?address=${encodeURIComponent(address)}&limit=25`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Indexer returned ${res.status}`);
  const json = (await res.json()) as {
    txs?: {
      hash: string;
      from: string | null;
      to: string | null;
      amountRai: string;
      height: number;
      kind: string;
      timestampMs: number;
    }[];
  };
  return (json.txs ?? []).map((t) => ({
    hash: t.hash,
    from: t.from,
    to: t.to,
    amount: t.amountRai,
    height: t.height,
    kind: t.kind,
    timestampMs: t.timestampMs,
  }));
}

/**
 * Balance and history are fetched independently so a slow or empty history
 * never delays the number the user actually came to see.
 */
async function refresh() {
  const kp = keypair;
  if (!kp) return;
  const address = kp.address;

  const balTask = fetchBalance(address)
    .then((b) => {
      balance = b;
      paintBalance();
      saveCache(address);
    })
    .catch((e) => message(e instanceof Error ? e.message : "Node unreachable.", "err"));

  const histTask = fetchHistory(address)
    .then((txs) => {
      history = txs;
      renderTxList("mini", 4);
      renderTxList("full", 25);
      saveCache(address);
    })
    .catch(() => {
      renderTxList("mini", 4);
      renderTxList("full", 25);
    });

  await Promise.all([balTask, histTask]);
}

/* ---------- boot ---------- */

async function boot() {
  const loaded = await store.load();
  accounts = loaded.accounts;
  active = loaded.active;
  const out = await chrome.storage.local.get(["pending", "lastActive"]);
  const pending = out.pending as Pending | undefined;
  const last = Number(out.lastActive ?? 0);
  if (keypair && Date.now() - last > AUTOLOCK_MS) keypair = null;

  const v = vault();
  if (pending && v && !keypair) {
    lockScreen(v);
    return;
  }
  if (pending && v && keypair) {
    if (pending.message) signRequestScreen(pending);
    else approvalScreen(pending);
    return;
  }
  if (keypair) {
    await loadCache(keypair.address);
    await renderApp();
    return;
  }
  if (v) lockScreen(v);
  else welcome();
}

document.addEventListener("click", () => void chrome.storage.local.set({ lastActive: Date.now() }));
void boot();
