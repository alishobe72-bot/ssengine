// ==============================================
// SS LIVE AI GUIDE
// WORKSPACE TOOLS & PERMISSION SYSTEM
// ==============================================

(function () {
  "use strict";

  const TOOLS = window.SS_GUIDE_TOOLS = {
    version: "1.0.0",
    ready: false,
    permission: false,
    currentWorkspace: "HOME",
    workspaces: [
      "GAME ENGINE",
      "AI ENGINE",
      "APP ENGINE",
      "MODEL ENGINE",
      "AI PRODUCT CREATOR"
    ],
    actions: []
  };

  // ------------------------------------------
  // WORKSPACE DETECTION
  // ------------------------------------------

  TOOLS.detectWorkspace = function () {
    const text = (
      document.title + " " +
      (document.body?.innerText || "").slice(0, 3000)
    ).toUpperCase();

    const found = TOOLS.workspaces.find(
      name => text.includes(name)
    );

    TOOLS.currentWorkspace = found || "HOME";

    return TOOLS.currentWorkspace;
  };

  // ------------------------------------------
  // WORKSPACE INFORMATION
  // ------------------------------------------

  TOOLS.getWorkspaceInfo = function () {
    return {
      current: TOOLS.detectWorkspace(),
      available: [...TOOLS.workspaces]
    };
  };

  // ------------------------------------------
  // USER PERMISSION
  // ------------------------------------------

  TOOLS.requestPermission = function (action) {
    return new Promise(resolve => {
      const approved = window.confirm(
        "SS LIVE AI GUIDE अनुमति माँग रही है:\n\n" +
        action +
        "\n\nक्या आप इसकी अनुमति देते हैं?"
      );

      TOOLS.permission = approved;

      resolve(approved);
    });
  };

  // ------------------------------------------
  // SAFE WORKSPACE NAVIGATION
  // ------------------------------------------

  TOOLS.navigateWorkspace = async function (workspace) {
    const target = TOOLS.workspaces.find(
      name => name === String(workspace).toUpperCase()
    );

    if (!target) {
      return {
        success: false,
        message: "यह वर्कस्पेस उपलब्ध नहीं है।"
      };
    }

    const approved = await TOOLS.requestPermission(
      "वर्कस्पेस खोलें: " + target
    );

    if (!approved) {
      return {
        success: false,
        message: "उपयोगकर्ता ने अनुमति नहीं दी।"
      };
    }

    // केवल पहले से मौजूद और स्पष्ट रूप से नामित
    // workspace navigation controls इस्तेमाल होंगे।

    const buttons = Array.from(
      document.querySelectorAll("button, a")
    );

    const button = buttons.find(element => {
      const label = (
        element.innerText ||
        element.getAttribute("aria-label") ||
        ""
      ).trim().toUpperCase();

      return label === target;
    });

    if (!button) {
      return {
        success: false,
        message:
          "वर्कस्पेस का बटन नहीं मिला। पहले UI में navigation जोड़ना होगा।"
      };
    }

    button.click();

    TOOLS.currentWorkspace = target;

    return {
      success: true,
      workspace: target
    };
  };

  // ------------------------------------------
  // READ-ONLY SCREEN INFORMATION
  // ------------------------------------------

  TOOLS.getScreenInfo = function () {
    return {
      title: document.title,
      width: window.innerWidth,
      height: window.innerHeight,
      currentWorkspace: TOOLS.detectWorkspace(),
      visibleText:
        (document.body?.innerText || "").slice(0, 2000)
    };
  };

  // ------------------------------------------
  // AVAILABLE TOOLS
  // ------------------------------------------

  TOOLS.getAvailableTools = function () {
    return [
      {
        name: "getWorkspaceInfo",
        description: "मौजूदा वर्कस्पेस की जानकारी"
      },
      {
        name: "getScreenInfo",
        description: "स्क्रीन की सामान्य जानकारी"
      },
      {
        name: "navigateWorkspace",
        description: "अनुमति लेकर वर्कस्पेस खोलना"
      }
    ];
  };

  // ------------------------------------------
  // TOOL EXECUTION
  // ------------------------------------------

  TOOLS.execute = async function (name, args) {
    args = args || {};

    switch (name) {
      case "getWorkspaceInfo":
        return TOOLS.getWorkspaceInfo();

      case "getScreenInfo":
        return TOOLS.getScreenInfo();

      case "navigateWorkspace":
        return await TOOLS.navigateWorkspace(
          args.workspace
        );

      default:
        return {
          success: false,
          message: "यह टूल उपलब्ध नहीं है।"
        };
    }
  };

  // ------------------------------------------
  // INITIALIZATION
  // ------------------------------------------

  TOOLS.init = function () {
    TOOLS.detectWorkspace();
    TOOLS.ready = true;

    console.log(
      "SS LIVE AI GUIDE WORKSPACE TOOLS READY"
    );
  };

  TOOLS.init();

})();
