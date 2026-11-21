// ======================================
// SS LIVE AI GUIDE - AVATAR MODULE
// ======================================

(function () {
  "use strict";

  window.SSGuideInit = function () {
    if (document.getElementById("ss-live-guide")) return;

    const root = document.createElement("div");
    root.id = "ss-live-guide";

    root.innerHTML = `
      <button class="ss-guide-button"
        id="ssGuideOpen"
        aria-label="Open SS Live AI Guide">
        <span class="ss-guide-avatar-placeholder">👩🏻</span>
      </button>

      <section class="ss-guide-panel"
        id="ssGuidePanel"
        style="display:none;">

        <header class="ss-guide-header">
          <div class="ss-guide-title">
            SS LIVE AI GUIDE
          </div>

          <button class="ss-guide-close"
            id="ssGuideClose">×</button>
        </header>

        <div class="ss-guide-avatar">
          <div class="ss-guide-avatar-placeholder"
            id="ssGuideFace">👩🏻</div>
        </div>

        <div class="ss-guide-status"
          id="ssGuideStatus">
          Your AI Guide is ready
        </div>

        <div class="ss-guide-messages"
          id="ssGuideMessages">

          <div class="ss-guide-message bot">
            नमस्ते! मैं SS LIVE AI GUIDE हूँ।
            बताइए, मैं आपकी क्या मदद कर सकती हूँ?
          </div>

        </div>

        <div class="ss-guide-input-area">

          <div class="ss-guide-input-row">
            <input
              class="ss-guide-input"
              id="ssGuideInput"
              type="text"
              placeholder="अपना सवाल लिखें..."
            >

            <button
              class="ss-guide-send"
              id="ssGuideSend">
              Send
            </button>
          </div>

          <div class="ss-guide-actions">

            <button
              class="ss-guide-action"
              id="ssGuideMic">
              🎙 बोलें
            </button>

            <button
              class="ss-guide-action"
              id="ssGuideSpeak">
              🔊 सुनें
            </button>

            <button
              class="ss-guide-action"
              id="ssGuideStop">
              ⏹ Stop
            </button>

          </div>
        </div>
      </section>
    `;

    document.body.appendChild(root);

    const panel = document.getElementById("ssGuidePanel");

    document.getElementById("ssGuideOpen")
      .onclick = function () {
        panel.style.display = "flex";
      };

    document.getElementById("ssGuideClose")
      .onclick = function () {
        panel.style.display = "none";
      };

    const input = document.getElementById("ssGuideInput");

    function sendMessage() {
      const message = input.value.trim();

      if (!message) return;

      if (typeof window.SSGuideSend === "function") {
        window.SSGuideSend(message);
      } else {
        window.SSGuideAddMessage(
          "bot",
          "गाइड का AI इंजन अभी कनेक्ट किया जा रहा है।"
        );
      }

      input.value = "";
    }

    document.getElementById("ssGuideSend")
      .onclick = sendMessage;

    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") sendMessage();
    });

    document.getElementById("ssGuideMic")
      .onclick = function () {
        if (window.SSGuideStartVoice) {
          window.SSGuideStartVoice();
        } else {
          alert("Voice module अभी कनेक्ट नहीं हुआ है।");
        }
      };

    document.getElementById("ssGuideSpeak")
      .onclick = function () {
        if (window.SSGuideSpeak) {
          window.SSGuideSpeak();
        }
      };

    document.getElementById("ssGuideStop")
      .onclick = function () {
        if (window.SSGuideStopVoice) {
          window.SSGuideStopVoice();
        }
      };

    window.SSGuideAddMessage = function (type, message) {
      const box = document.getElementById("ssGuideMessages");
      if (!box) return;

      const item = document.createElement("div");
      item.className = "ss-guide-message " + type;
      item.textContent = message;

      box.appendChild(item);
      box.scrollTop = box.scrollHeight;
    };

    window.SSGuideSetStatus = function (message) {
      const status = document.getElementById("ssGuideStatus");
      if (status) status.textContent = message;
    };

    console.log("SS LIVE AI GUIDE Avatar Ready");
  };
})();
