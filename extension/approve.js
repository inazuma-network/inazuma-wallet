const params = new URLSearchParams(location.search);
const origin = params.get("origin") || "";
const address = params.get("address") || "";
const id = params.get("id") || "";

document.getElementById("origin").textContent = origin;
document.getElementById("addr").textContent = address;

const answer = (approved) => {
  chrome.runtime.sendMessage({ type: "INAZ_APPROVAL", id, origin, approved }, () => {
    window.close();
  });
};

document.getElementById("approve").addEventListener("click", () => answer(true));
document.getElementById("reject").addEventListener("click", () => answer(false));
window.addEventListener("unload", () => {
  chrome.runtime.sendMessage({ type: "INAZ_APPROVAL_CLOSED", id });
});