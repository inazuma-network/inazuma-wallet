/* Inazuma Wallet service worker: storage access, full-tab fallback, and the
   dapp connection bridge (window.inazuma -> content.js -> here). */
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get("vault").then(() => {});
});

/** id -> reply callback for open approval windows. */
const waiting = new Map();

const vaultAddress = async () => {
  const { vault } = await chrome.storage.local.get("vault");
  return vault && vault.address ? vault.address : null;
};

const approvedSites = async () => {
  const { sites } = await chrome.storage.local.get("sites");
  return Array.isArray(sites) ? sites : [];
};

async function handleRpc(msg, reply) {
  const address = await vaultAddress();

  if (msg.method === "inaz_address") {
    const sites = await approvedSites();
    reply({ ok: true, result: sites.includes(msg.origin) ? address : null });
    return;
  }

  if (msg.method === "inaz_disconnect") {
    const sites = (await approvedSites()).filter((s) => s !== msg.origin);
    await chrome.storage.local.set({ sites });
    reply({ ok: true, result: true });
    return;
  }

  if (msg.method === "inaz_signMessage") {
    const text = msg.params && typeof msg.params.message === "string" ? msg.params.message : "";
    if (!address) {
      reply({ ok: false, error: "No Inazuma wallet yet — open the extension and create one." });
      return;
    }
    if (!(await approvedSites()).includes(msg.origin)) {
      reply({ ok: false, error: "Connect this site first." });
      return;
    }
    if (!text || text.length > 2000) {
      reply({ ok: false, error: "Invalid message to sign." });
      return;
    }
    await openApproval(reply, { origin: msg.origin, address, message: text });
    return;
  }

  if (msg.method !== "inaz_connect") {
    reply({ ok: false, error: `Unsupported method: ${msg.method}` });
    return;
  }

  if (!address) {
    reply({ ok: false, error: "No Inazuma wallet yet — open the extension and create one." });
    return;
  }

  const sites = await approvedSites();
  if (sites.includes(msg.origin)) {
    reply({ ok: true, result: { address } });
    return;
  }

  await openApproval(reply, { origin: msg.origin, address });
}

/** Stores a pending request and surfaces the extension popup to approve it. */
async function openApproval(reply, req) {
  const id = `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  waiting.set(id, reply);
  await chrome.storage.local.set({ pending: { id, at: Date.now(), ...req } });
  try {
    await chrome.action.setBadgeText({ text: "1" });
    await chrome.action.setBadgeBackgroundColor({ color: "#F02FC3" });
  } catch {
    /* ignore */
  }
  // Preferred: render the request inside the extension's own popup.
  try {
    await chrome.action.openPopup();
    return;
  } catch {
    /* older Chrome or no active window — fall back to a small popup window */
  }
  const url = chrome.runtime.getURL(
    `approve.html?id=${id}&origin=${encodeURIComponent(req.origin)}&address=${encodeURIComponent(req.address)}`,
  );
  chrome.windows.create({ url, type: "popup", width: 380, height: 580, focused: true });
}

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (!msg) return false;

  if (msg.type === "OPEN_TAB") {
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
    reply({ ok: true });
    return true;
  }

  if (msg.type === "INAZ_RPC") {
    handleRpc(msg, reply);
    return true;
  }

  if (msg.type === "INAZ_APPROVAL") {
    const pending = waiting.get(msg.id);
    waiting.delete(msg.id);
    (async () => {
      await chrome.storage.local.remove("pending");
      try {
        await chrome.action.setBadgeText({ text: "" });
      } catch {
        /* ignore */
      }
      if (msg.approved) {
        const sites = await approvedSites();
        if (!sites.includes(msg.origin)) {
          await chrome.storage.local.set({ sites: [...sites, msg.origin] });
        }
        const address = await vaultAddress();
        pending && pending({ ok: true, result: { address } });
      } else {
        pending && pending({ ok: false, error: "Connection rejected." });
      }
      reply({ ok: true });
    })();
    return true;
  }

  if (msg.type === "INAZ_SIGNED") {
    const pending = waiting.get(msg.id);
    waiting.delete(msg.id);
    (async () => {
      await chrome.storage.local.remove("pending");
      try {
        await chrome.action.setBadgeText({ text: "" });
      } catch {
        /* ignore */
      }
      if (pending) {
        if (msg.signature)
          pending({ ok: true, result: { address: msg.address, signature: msg.signature } });
        else pending({ ok: false, error: msg.error || "Signature rejected." });
      }
      reply({ ok: true });
    })();
    return true;
  }

  if (msg.type === "INAZ_APPROVAL_CLOSED") {
    const pending = waiting.get(msg.id);
    if (pending) {
      waiting.delete(msg.id);
      pending({ ok: false, error: "Connection window closed." });
    }
    return false;
  }

  return false;
});
