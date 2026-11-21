// ==========================================
// SS ENGINE - GUIDE MASTER CONNECTION
// ==========================================

(function () {
 "use strict";

 const GUIDE_FILES = {
  css: [
   "guide.css"
  ],

  scripts: [
   "guide-avatar.js",
   "guide-voice.js",
   "guide-engine.js",
   "guide-tools.js",
   "guide-wallet.js"
  ]
 };

 const loaded = new Set();

 function loadCSS(file) {
  return new Promise((resolve, reject) => {

   if (loaded.has(file)) {
    resolve();
    return;
   }

   const link = document.createElement("link");

   link.rel = "stylesheet";
   link.href = file;

   link.onload = () => {
    loaded.add(file);
    resolve();
   };

   link.onerror = () => {
    reject(new Error("CSS load failed: " + file));
   };

   document.head.appendChild(link);
  });
 }

 function loadScript(file) {
  return new Promise((resolve, reject) => {

   if (loaded.has(file)) {
    resolve();
    return;
   }

   const script = document.createElement("script");

   script.src = file;
   script.async = false;

   script.onload = () => {
    loaded.add(file);
    resolve();
   };

   script.onerror = () => {
    reject(new Error("Script load failed: " + file));
   };

   document.body.appendChild(script);
  });
 }

 async function startGuide() {

  try {

   console.log("SS LIVE AI GUIDE: Starting...");

   for (const file of GUIDE_FILES.css) {
    await loadCSS(file);
   }

   for (const file of GUIDE_FILES.scripts) {
    await loadScript(file);
   }

   if (typeof window.SSGuideInit === "function") {
    await window.SSGuideInit();
   }

   window.SS_LIVE_GUIDE_READY = true;

   console.log("SS LIVE AI GUIDE: Connected.");

   window.dispatchEvent(
    new CustomEvent("ss-guide-ready")
   );

  } catch (error) {

   window.SS_LIVE_GUIDE_READY = false;

   console.error("SS GUIDE ERROR:", error);

   window.dispatchEvent(
    new CustomEvent("ss-guide-error", {
     detail: error.message
    })
   );

  }
 }

 window.SSGuideMaster = {
  start: startGuide,

  status: function () {
   return window.SS_LIVE_GUIDE_READY === true;
  }
 };

 if (document.readyState === "loading") {

  document.addEventListener(
   "DOMContentLoaded",
   startGuide,
   { once: true }
  );

 } else {

  startGuide();

 }

})();
