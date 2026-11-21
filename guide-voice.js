// ==========================================
// SS LIVE AI GUIDE
// COMPLETE VOICE ENGINE
// ==========================================

(function () {
  "use strict";

  const GUIDE = window.SS_GUIDE_VOICE = {
    recognition: null,
    lastText: "",
    lastSpokenText: "",
    speaking: false,
    listening: false,
    language: navigator.language || "hi-IN",
    initialized: false
  };

  // ------------------------------------------
  // LANGUAGE
  // ------------------------------------------

  GUIDE.setLanguage = function (language) {
    if (!language) return;

    GUIDE.language = language;

    if (GUIDE.recognition) {
      GUIDE.recognition.lang = language;
    }
  };

  // ------------------------------------------
  // SPEECH RECOGNITION SUPPORT
  // ------------------------------------------

  GUIDE.initRecognition = function () {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      window.SSGuideSetStatus?.(
        "इस ब्राउज़र में Voice Recognition उपलब्ध नहीं है।"
      );
      return false;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = GUIDE.language;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function () {
      GUIDE.listening = true;
      window.SSGuideSetStatus?.("मैं आपकी बात सुन रही हूँ...");
    };

    recognition.onresult = function (event) {
      const transcript =
        event.results?.[0]?.[0]?.transcript || "";

      GUIDE.lastText = transcript;

      const input = document.getElementById("ssGuideInput");

      if (input) {
        input.value = transcript;
      }

      window.SSGuideAddMessage?.("user", transcript);

      if (typeof window.SSGuideSend === "function") {
        window.SSGuideSend(transcript);
      } else {
        window.SSGuideSetStatus?.(
          "AI Engine कनेक्ट होने की प्रतीक्षा है।"
        );
      }
    };

    recognition.onerror = function (event) {
      GUIDE.listening = false;

      window.SSGuideSetStatus?.(
        "Voice समस्या: " + event.error
      );
    };

    recognition.onend = function () {
      GUIDE.listening = false;

      window.SSGuideSetStatus?.("Voice बंद है।");
    };

    GUIDE.recognition = recognition;

    return true;
  };

  // ------------------------------------------
  // START LISTENING
  // ------------------------------------------

  window.SSGuideStartVoice = function () {
    if (!GUIDE.recognition) {
      if (!GUIDE.initRecognition()) return;
    }

    if (GUIDE.listening) return;

    try {
      GUIDE.recognition.lang = GUIDE.language;
      GUIDE.recognition.start();
    } catch (error) {
      window.SSGuideSetStatus?.(
        "Voice शुरू नहीं हो सकी। दोबारा प्रयास करें।"
      );
    }
  };

  // ------------------------------------------
  // STOP LISTENING
  // ------------------------------------------

  window.SSGuideStopListening = function () {
    if (GUIDE.recognition && GUIDE.listening) {
      GUIDE.recognition.stop();
    }

    GUIDE.listening = false;
  };

  // ------------------------------------------
  // TEXT TO SPEECH
  // ------------------------------------------

  window.SSGuideSpeakText = function (text, language) {
    if (!text || !("speechSynthesis" in window)) {
      window.SSGuideSetStatus?.(
        "Speech सुविधा उपलब्ध नहीं है।"
      );
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language || GUIDE.language;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = function () {
      GUIDE.speaking = true;
      GUIDE.lastSpokenText = text;

      window.SSGuideSetStatus?.("गाइड बोल रही है...");
    };

    utterance.onend = function () {
      GUIDE.speaking = false;

      window.SSGuideSetStatus?.("गाइड तैयार है।");
    };

    utterance.onerror = function () {
      GUIDE.speaking = false;

      window.SSGuideSetStatus?.(
        "आवाज़ चलाने में समस्या हुई।"
      );
    };

    window.speechSynthesis.speak(utterance);
  };

  // ------------------------------------------
  // SPEAK LAST AI RESPONSE
  // ------------------------------------------

  window.SSGuideSpeak = function () {
    const messages =
      document.querySelectorAll(
        "#ssGuideMessages .ss-guide-message.bot"
      );

    if (!messages.length) return;

    const latest = messages[messages.length - 1];

    window.SSGuideSpeakText(latest.textContent);
  };

  // ------------------------------------------
  // STOP SPEAKING
  // ------------------------------------------

  window.SSGuideStopVoice = function () {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    window.SSGuideStopListening();

    GUIDE.speaking = false;

    window.SSGuideSetStatus?.("Voice बंद कर दी गई है।");
  };

  // ------------------------------------------
  // INITIALIZATION
  // ------------------------------------------

  GUIDE.init = function () {
    if (GUIDE.initialized) return;

    GUIDE.initRecognition();

    GUIDE.initialized = true;

    console.log("SS GUIDE VOICE ENGINE READY");
  };

  GUIDE.init();

})();
