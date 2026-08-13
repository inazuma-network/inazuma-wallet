/* Injected into every page: exposes window.inazuma for dapps. */
(() => {
  const pending = new Map();
  let seq = 0;

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    const msg = event.data;
    if (!msg || msg.channel !== "inazuma:response") return;
    const entry = pending.get(msg.id);
    if (!entry) return;
    pending.delete(msg.id);
    if (msg.error) entry.reject(new Error(msg.error));
    else entry.resolve(msg.result);
  });

  const request = (method, params) =>
    new Promise((resolve, reject) => {
      const id = `inaz-${++seq}-${Date.now()}`;
      pending.set(id, { resolve, reject });
      window.postMessage({ channel: "inazuma:request", id, method, params }, "*");
      setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error("Request timed out."));
        }
      }, 120000);
    });

  window.inazuma = {
    isInazuma: true,
    chainId: 7777,
    request,
    connect: () => request("inaz_connect"),
    getAddress: () => request("inaz_address"),
    disconnect: () => request("inaz_disconnect"),
    /** Gas-free ownership proof: signs a UTF-8 message with the ed25519 key. */
    signMessage: (message) => request("inaz_signMessage", { message }),
  };

  window.dispatchEvent(new Event("inazuma#initialized"));
})();