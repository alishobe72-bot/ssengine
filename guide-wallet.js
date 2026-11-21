// ==============================================
// SS LIVE AI GUIDE - WALLET SYSTEM
// ==============================================

(function () {
  "use strict";

  const WALLET = window.SS_GUIDE_WALLET = {
    version: "1.0.0",

    storageKey: "SS_ENGINE_WALLET_V1",

    data: {
      guidePoints: 0,
      creatorPoints: 0,
      history: []
    },

    ready: false
  };

  // ------------------------------------------
  // LOAD WALLET
  // ------------------------------------------

  WALLET.load = function () {
    try {
      const saved = localStorage.getItem(
        WALLET.storageKey
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        WALLET.data.guidePoints =
          Math.max(0, Number(parsed.guidePoints) || 0);

        WALLET.data.creatorPoints =
          Math.max(0, Number(parsed.creatorPoints) || 0);

        WALLET.data.history =
          Array.isArray(parsed.history)
            ? parsed.history.slice(-500)
            : [];
      }
    } catch (error) {
      console.error("Wallet loading error:", error);
    }
  };

  // ------------------------------------------
  // SAVE WALLET
  // ------------------------------------------

  WALLET.save = function () {
    try {
      localStorage.setItem(
        WALLET.storageKey,
        JSON.stringify(WALLET.data)
      );

      return true;
    } catch (error) {
      console.error("Wallet saving error:", error);
      return false;
    }
  };

  // ------------------------------------------
  // ADD TRANSACTION HISTORY
  // ------------------------------------------

  WALLET.addHistory = function (
    type,
    action,
    points,
    note
  ) {
    WALLET.data.history.push({
      id: Date.now() + "-" + Math.random().toString(36).slice(2),
      type,
      action,
      points,
      note: String(note || ""),
      date: new Date().toISOString()
    });

    WALLET.data.history =
      WALLET.data.history.slice(-500);

    WALLET.save();
  };

  // ------------------------------------------
  // GET BALANCE
  // ------------------------------------------

  WALLET.getBalance = function (type) {
    if (type === "guide") {
      return WALLET.data.guidePoints;
    }

    if (type === "creator") {
      return WALLET.data.creatorPoints;
    }

    return null;
  };

  // ------------------------------------------
  // ADD POINTS
  // ------------------------------------------

  WALLET.addPoints = function (
    type,
    points,
    note
  ) {
    points = Number(points);

    if (!Number.isSafeInteger(points) || points <= 0) {
      return {
        success: false,
        message: "अमान्य पॉइंट राशि।"
      };
    }

    if (type === "guide") {
      WALLET.data.guidePoints += points;
    } else if (type === "creator") {
      WALLET.data.creatorPoints += points;
    } else {
      return {
        success: false,
        message: "अमान्य वॉलेट।"
      };
    }

    WALLET.addHistory(
      type,
      "POINTS_ADDED",
      points,
      note || "Points added"
    );

    return {
      success: true,
      balance: WALLET.getBalance(type)
    };
  };

  // ------------------------------------------
  // SPEND POINTS
  // ------------------------------------------

  WALLET.spendPoints = function (
    type,
    points,
    note
  ) {
    points = Number(points);

    if (!Number.isSafeInteger(points) || points <= 0) {
      return {
        success: false,
        message: "अमान्य पॉइंट राशि।"
      };
    }

    const balance = WALLET.getBalance(type);

    if (balance === null) {
      return {
        success: false,
        message: "अमान्य वॉलेट।"
      };
    }

    if (balance < points) {
      return {
        success: false,
        message: "आपके पास पर्याप्त पॉइंट नहीं हैं।"
      };
    }

    if (type === "guide") {
      WALLET.data.guidePoints -= points;
    } else {
      WALLET.data.creatorPoints -= points;
    }

    WALLET.addHistory(
      type,
      "POINTS_USED",
      -points,
      note || "AI usage"
    );

    return {
      success: true,
      balance: WALLET.getBalance(type)
    };
  };

  // ------------------------------------------
  // TRANSACTION HISTORY
  // ------------------------------------------

  WALLET.getHistory = function (type) {
    if (!type) {
      return [...WALLET.data.history];
    }

    return WALLET.data.history.filter(
      item => item.type === type
    );
  };

  // ------------------------------------------
  // WALLET SUMMARY
  // ------------------------------------------

  WALLET.getSummary = function () {
    return {
      guidePoints: WALLET.data.guidePoints,
      creatorPoints: WALLET.data.creatorPoints,
      totalTransactions: WALLET.data.history.length
    };
  };

  // ------------------------------------------
  // INITIALIZE
  // ------------------------------------------

  WALLET.init = function () {
    WALLET.load();
    WALLET.ready = true;

    console.log(
      "SS LIVE AI GUIDE WALLET READY"
    );
  };

  WALLET.init();

})();
