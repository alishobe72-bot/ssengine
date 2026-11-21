// ================================================
// SS LIVE AI GUIDE
// MAIN AI ENGINE
// ================================================

(function () {
  "use strict";

  const ENGINE = window.SS_GUIDE_ENGINE = {
    version: "1.0.0",
    ready: false,
    busy: false,

    config: {
      // अपने SS ENGINE के सही AI chat endpoint से जोड़ना होगा।
      apiEndpoint: "/api/ai/chat",

      // अनुरोध पूरा होने की अधिकतम प्रतीक्षा
      timeout: 60000,

      // बातचीत का संदर्भ
      maxHistory: 20
    },

    history: []
  };

  // -----------------------------------------------
  // CONFIGURATION
  // -----------------------------------------------

  ENGINE.configure = function (options) {
    if (!options || typeof options !== "object") return;

    if (options.apiEndpoint) {
      ENGINE.config.apiEndpoint = options.apiEndpoint;
    }

    if (Number.isFinite(options.timeout)) {
      ENGINE.config.timeout = options.timeout;
    }

    if (Number.isFinite(options.maxHistory)) {
      ENGINE.config.maxHistory = options.maxHistory;
    }
  };

  // -----------------------------------------------
  // LANGUAGE DETECTION
  // -----------------------------------------------

  ENGINE.detectLanguage = function (text) {
    if (/[\u0900-\u097F]/.test(text)) return "hi-IN";
    if (/[\u0600-\u06FF]/.test(text)) return "ur-PK";
    if (/[a-zA-Z]/.test(text)) return "en-US";

    return navigator.language || "hi-IN";
  };

  // -----------------------------------------------
  // MESSAGE HISTORY
  // -----------------------------------------------

  ENGINE.addHistory = function (role, content) {
    ENGINE.history.push({
      role: role,
      content: String(content),
      timestamp: Date.now()
    });

    const limit = ENGINE.config.maxHistory;

    if (ENGINE.history.length > limit) {
      ENGINE.history =
        ENGINE.history.slice(-limit);
    }
  };

  ENGINE.clearHistory = function () {
    ENGINE.history = [];
  };

  // -----------------------------------------------
  // DISPLAY MESSAGE
  // -----------------------------------------------

  ENGINE.showMessage = function (role, message) {
    if (typeof window.SSGuideAddMessage === "function") {
      window.SSGuideAddMessage(role, message);
    }
  };

  // -----------------------------------------------
  // REQUEST AI SERVER
  // -----------------------------------------------

  ENGINE.requestAI = async function (message) {
    const controller = new AbortController();

    const timer = setTimeout(
      () => controller.abort(),
      ENGINE.config.timeout
    );

    try {
      const response = await fetch(
        ENGINE.config.apiEndpoint,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            message: message,
            prompt: message,
            history: ENGINE.history.map(item => ({
              role: item.role,
              content: item.content
            })),

            source: "SS_LIVE_AI_GUIDE",

            language: ENGINE.detectLanguage(message)
          }),

          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error(
          "AI server error: " + response.status
        );
      }

      const data = await response.json();

      const answer =
        data.reply ||
        data.response ||
        data.output ||
        data.answer ||
        data.message;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("AI server returned no readable answer.");
      }

      return answer.trim();

    } finally {
      clearTimeout(timer);
    }
  };

  // -----------------------------------------------
  // MAIN CHAT FUNCTION
  // -----------------------------------------------

  window.SSGuideSend = async function (message) {
    message = String(message || "").trim();

    if (!message) return;

    if (ENGINE.busy) {
      ENGINE.showMessage(
        "bot",
        "एक जवाब तैयार हो रहा है। कृपया थोड़ी देर प्रतीक्षा करें।"
      );
      return;
    }

    // Voice module पहले से user message दिखा सकता है।
    const box = document.getElementById("ssGuideMessages");

    const lastMessage = box
      ? box.querySelector(".ss-guide-message:last-child")
      : null;

    if (
      !lastMessage ||
      !lastMessage.classList.contains("user") ||
      lastMessage.textContent.trim() !== message
    ) {
      ENGINE.showMessage("user", message);
    }

    ENGINE.addHistory("user", message);

    ENGINE.busy = true;

    window.SSGuideSetStatus?.(
      "AI जवाब तैयार कर रही है..."
    );

    try {
      const answer = await ENGINE.requestAI(message);

      ENGINE.addHistory("assistant", answer);

      ENGINE.showMessage("bot", answer);

      window.SSGuideSetStatus?.(
        "गाइड तैयार है।"
      );

      // यदि आवाज़ की सुविधा उपलब्ध है तो जवाब बोलें।
      if (typeof window.SSGuideSpeakText === "function") {
        window.SSGuideSpeakText(
          answer,
          ENGINE.detectLanguage(answer)
        );
      }

      return answer;

    } catch (error) {
      console.error("SS GUIDE AI ERROR:", error);

      let errorMessage =
        "AI सर्वर से जवाब नहीं मिल पाया। कृपया बाद में कोशिश करें।";

      if (error.name === "AbortError") {
        errorMessage =
          "AI सर्वर ने जवाब देने में बहुत समय लिया।";
      }

      ENGINE.showMessage("bot", errorMessage);

      window.SSGuideSetStatus?.(
        "AI कनेक्शन उपलब्ध नहीं है।"
      );

      return null;

    } finally {
      ENGINE.busy = false;
    }
  };

  // -----------------------------------------------
  // PUBLIC STATUS
  // -----------------------------------------------

  ENGINE.status = function () {
    return {
      ready: ENGINE.ready,
      busy: ENGINE.busy,
      endpoint: ENGINE.config.apiEndpoint,
      historyCount: ENGINE.history.length
    };
  };

  // -----------------------------------------------
  // INITIALIZATION
  // -----------------------------------------------

  ENGINE.init = function () {
    ENGINE.ready = true;

    console.log(
      "SS LIVE AI GUIDE ENGINE INITIALIZED"
    );
  };

  ENGINE.init();

})();
