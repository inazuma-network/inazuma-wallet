/* Bridges page <-> extension. */
(() => {
  const s = document.createElement("script");
  s.src = chrome.runtime.getURL("inpage.js");
  s.async = false;
  (document.head || document.documentElement).prepend(s);
  s.remove();

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const msg = event.data;
    if (!msg || msg.channel !== "inazuma:request") return;
    chrome.runtime.sendMessage(
      { type: "INAZ_RPC", method: msg.method, params: msg.params, origin: location.origin },
      (res) => {
        const err = chrome.runtime.lastError;
        window.postMessage(
          {
            channel: "inazuma:response",
            id: msg.id,
            result: res && res.ok ? res.result : undefined,
            error: err ? err.message : res && !res.ok ? res.error : undefined,
          },
          "*",
        );
      },
    );
  });
})();
