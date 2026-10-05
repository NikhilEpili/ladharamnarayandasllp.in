document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("#enquiry form");
  if (!form) return;
  var btn = form.querySelector('button[type="button"]');
  if (!btn) return;
  btn.addEventListener("click", function () {
    var biz = (document.getElementById("biz") || {}).value || "";
    var ph = (document.getElementById("ph") || {}).value || "";
    var loc = (document.getElementById("loc") || {}).value || "";
    var bt = (document.getElementById("bt") || {}).value || "";
    var msg = (document.getElementById("msg") || {}).value || "";
    var lines = [
      "Supply enquiry — Ladharam Narayandas LLP",
      biz && "Business: " + biz,
      ph && "Phone: " + ph,
      loc && "Location: " + loc,
      bt && "Business type: " + bt,
      msg && "Requirements: " + msg,
    ].filter(Boolean);
    var url =
      "https://wa.me/918928351313?text=" +
      encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
