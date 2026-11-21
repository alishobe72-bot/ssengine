// =====================================================
// SS ENGINE - GLOBAL REGION SYSTEM
// Country Detection | Currency | Language | Preferences
// =====================================================

(function (global) {
  "use strict";

  const STORAGE_KEY = "ss_engine_region_v1";

  const COUNTRIES = {
    IN: ["INR", "₹", "hi"],
    US: ["USD", "$", "en"],
    GB: ["GBP", "£", "en"],
    CA: ["CAD", "CA$", "en"],
    AU: ["AUD", "A$", "en"],
    NZ: ["NZD", "NZ$", "en"],
    FR: ["EUR", "€", "fr"],
    DE: ["EUR", "€", "de"],
    IT: ["EUR", "€", "it"],
    ES: ["EUR", "€", "es"],
    NL: ["EUR", "€", "nl"],
    BE: ["EUR", "€", "nl"],
    PT: ["EUR", "€", "pt"],
    IE: ["EUR", "€", "en"],
    FI: ["EUR", "€", "fi"],
    GR: ["EUR", "€", "el"],
    AT: ["EUR", "€", "de"],
    CH: ["CHF", "CHF", "de"],
    SE: ["SEK", "kr", "sv"],
    NO: ["NOK", "kr", "no"],
    DK: ["DKK", "kr", "da"],
    PL: ["PLN", "zł", "pl"],
    CZ: ["CZK", "Kč", "cs"],
    HU: ["HUF", "Ft", "hu"],
    RO: ["RON", "lei", "ro"],
    BG: ["BGN", "лв", "bg"],
    TR: ["TRY", "₺", "tr"],
    RU: ["RUB", "₽", "ru"],
    UA: ["UAH", "₴", "uk"],
    SA: ["SAR", "ر.س", "ar"],
    AE: ["AED", "د.إ", "ar"],
    QA: ["QAR", "ر.ق", "ar"],
    KW: ["KWD", "د.ك", "ar"],
    BH: ["BHD", "د.ب", "ar"],
    OM: ["OMR", "ر.ع.", "ar"],
    EG: ["EGP", "E£", "ar"],
    PK: ["PKR", "₨", "ur"],
    BD: ["BDT", "৳", "bn"],
    LK: ["LKR", "Rs", "si"],
    NP: ["NPR", "रु", "ne"],
    JP: ["JPY", "¥", "ja"],
    CN: ["CNY", "¥", "zh"],
    HK: ["HKD", "HK$", "zh"],
    TW: ["TWD", "NT$", "zh"],
    KR: ["KRW", "₩", "ko"],
    SG: ["SGD", "S$", "en"],
    MY: ["MYR", "RM", "ms"],
    ID: ["IDR", "Rp", "id"],
    TH: ["THB", "฿", "th"],
    VN: ["VND", "₫", "vi"],
    PH: ["PHP", "₱", "en"],
    KH: ["KHR", "៛", "km"],
    MM: ["MMK", "K", "my"],
    BR: ["BRL", "R$", "pt"],
    MX: ["MXN", "MX$", "es"],
    AR: ["ARS", "$", "es"],
    CL: ["CLP", "$", "es"],
    CO: ["COP", "$", "es"],
    PE: ["PEN", "S/", "es"],
    ZA: ["ZAR", "R", "en"],
    NG: ["NGN", "₦", "en"],
    KE: ["KES", "KSh", "en"],
    GH: ["GHS", "₵", "en"],
    TZ: ["TZS", "TSh", "sw"],
    UG: ["UGX", "USh", "en"],
    MA: ["MAD", "د.م.", "ar"],
    IL: ["ILS", "₪", "he"],
    IS: ["ISK", "kr", "is"],
    CR: ["CRC", "₡", "es"],
    PA: ["PAB", "B/.", "es"],
    DO: ["DOP", "RD$", "es"],
    JM: ["JMD", "J$", "en"],
    TT: ["TTD", "TT$", "en"],
    FJ: ["FJD", "FJ$", "en"]
  };

  const LANGUAGE_NAMES = {
    en: "English",
    hi: "हिन्दी",
    ur: "اردو",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    pt: "Português",
    ar: "العربية",
    ja: "日本語",
    zh: "中文",
    ko: "한국어",
    bn: "বাংলা",
    ru: "Русский",
    tr: "Türkçe",
    id: "Bahasa Indonesia",
    ms: "Bahasa Melayu",
    th: "ไทย",
    vi: "Tiếng Việt",
    nl: "Nederlands",
    sv: "Svenska",
    no: "Norsk",
    da: "Dansk",
    fi: "Suomi",
    pl: "Polski",
    cs: "Čeština",
    uk: "Українська",
    el: "Ελληνικά",
    ne: "नेपाली",
    si: "සිංහල",
    sw: "Kiswahili",
    he: "עברית"
  };

  const TRANSLATIONS = {
    en: {
      recharge: "Recharge",
      wallet: "Wallet",
      balance: "Balance",
      plans: "Recharge Plans",
      payment: "Payment",
      settings: "Settings",
      language: "Language",
      currency: "Currency",
      country: "Country",
      continue: "Continue",
      cancel: "Cancel",
      success: "Successful",
      failed: "Failed"
    },
    hi: {
      recharge: "रिचार्ज",
      wallet: "वॉलेट",
      balance: "बैलेंस",
      plans: "रिचार्ज प्लान",
      payment: "भुगतान",
      settings: "सेटिंग्स",
      language: "भाषा",
      currency: "मुद्रा",
      country: "देश",
      continue: "आगे बढ़ें",
      cancel: "रद्द करें",
      success: "सफल",
      failed: "असफल"
    },
    ur: {
      recharge: "ریچارج",
      wallet: "والیٹ",
      balance: "بیلنس",
      plans: "ریچارج پلان",
      payment: "ادائیگی",
      settings: "ترتیبات",
      language: "زبان",
      currency: "کرنسی",
      country: "ملک",
      continue: "جاری رکھیں",
      cancel: "منسوخ",
      success: "کامیاب",
      failed: "ناکام"
    },
    fr: {
      recharge: "Recharge",
      wallet: "Portefeuille",
      balance: "Solde",
      plans: "Forfaits",
      payment: "Paiement",
      settings: "Paramètres",
      language: "Langue",
      currency: "Devise",
      country: "Pays",
      continue: "Continuer",
      cancel: "Annuler",
      success: "Réussi",
      failed: "Échoué"
    },
    de: {
      recharge: "Aufladen",
      wallet: "Geldbörse",
      balance: "Guthaben",
      plans: "Tarife",
      payment: "Zahlung",
      settings: "Einstellungen",
      language: "Sprache",
      currency: "Währung",
      country: "Land",
      continue: "Weiter",
      cancel: "Abbrechen",
      success: "Erfolgreich",
      failed: "Fehlgeschlagen"
    },
    es: {
      recharge: "Recargar",
      wallet: "Cartera",
      balance: "Saldo",
      plans: "Planes",
      payment: "Pago",
      settings: "Configuración",
      language: "Idioma",
      currency: "Moneda",
      country: "País",
      continue: "Continuar",
      cancel: "Cancelar",
      success: "Correcto",
      failed: "Fallido"
    },
    ar: {
      recharge: "إعادة الشحن",
      wallet: "المحفظة",
      balance: "الرصيد",
      plans: "خطط الشحن",
      payment: "الدفع",
      settings: "الإعدادات",
      language: "اللغة",
      currency: "العملة",
      country: "البلد",
      continue: "متابعة",
      cancel: "إلغاء",
      success: "ناجح",
      failed: "فشل"
    },
    ja: {
      recharge: "チャージ",
      wallet: "ウォレット",
      balance: "残高",
      plans: "プラン",
      payment: "支払い",
      settings: "設定",
      language: "言語",
      currency: "通貨",
      country: "国",
      continue: "続行",
      cancel: "キャンセル",
      success: "成功",
      failed: "失敗"
    },
    zh: {
      recharge: "充值",
      wallet: "钱包",
      balance: "余额",
      plans: "充值套餐",
      payment: "付款",
      settings: "设置",
      language: "语言",
      currency: "货币",
      country: "国家",
      continue: "继续",
      cancel: "取消",
      success: "成功",
      failed: "失败"
    }
  };

  const DEFAULT_COUNTRY = "US";

  let settings = {
    country: DEFAULT_COUNTRY,
    currency: "USD",
    symbol: "$",
    language: "en",
    manual: false
  };

  function getCountrySettings(country) {
    const item = COUNTRIES[country];

    if (!item) {
      return {
        country,
        currency: "USD",
        symbol: "$",
        language: "en"
      };
    }

    return {
      country,
      currency: item[0],
      symbol: item[1],
      language: item[2]
    };
  }

  function getBrowserCountry() {
    const locale =
      global.navigator?.language || "en-US";

    const match = locale.match(/-([A-Za-z]{2})$/);

    return match ? match[1].toUpperCase() : null;
  }

  function getBrowserLanguage() {
    const language =
      global.navigator?.language || "en";

    return language.split("-")[0].toLowerCase();
  }

  function save() {
    try {
      global.localStorage?.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.warn("SS Region: Could not save settings.");
    }
  }

  function load() {
    try {
      const saved =
        global.localStorage?.getItem(STORAGE_KEY);

      if (!saved) return false;

      const parsed = JSON.parse(saved);

      if (
        parsed &&
        COUNTRIES[parsed.country] &&
        !parsed.manual
      ) {
        settings = {
          ...getCountrySettings(parsed.country),
          manual: false
        };

        return true;
      }

      if (
        parsed &&
        COUNTRIES[parsed.country] &&
        parsed.manual === true
      ) {
        settings = {
          ...getCountrySettings(parsed.country),
          language: LANGUAGE_NAMES[parsed.language]
            ? parsed.language
            : getCountrySettings(parsed.country).language,
          manual: true
        };

        return true;
      }
    } catch (error) {
      console.warn("SS Region: Saved settings invalid.");
    }

    return false;
  }

  async function detectCountry() {
    try {
      const response = await fetch(
        "https://ipapi.co/json/",
        {
          method: "GET",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(5000)
        }
      );

      if (!response.ok) {
        throw new Error("Country service unavailable");
      }

      const data = await response.json();

      if (data.country_code && COUNTRIES[data.country_code]) {
        return data.country_code;
      }
    } catch (error) {
      console.warn("SS Region: Automatic detection unavailable.");
    }

    const browserCountry = getBrowserCountry();

    if (browserCountry && COUNTRIES[browserCountry]) {
      return browserCountry;
    }

    return DEFAULT_COUNTRY;
  }

  async function initialize() {
    if (load()) {
      applyDocumentSettings();
      return getSettings();
    }

    const country = await detectCountry();

    settings = {
      ...getCountrySettings(country),
      manual: false
    };

    save();
    applyDocumentSettings();

    return getSettings();
  }

  function applyDocumentSettings() {
    if (!global.document) return;

    global.document.documentElement.lang =
      settings.language;

    global.document.documentElement.dir =
      settings.language === "ar" ||
      settings.language === "ur" ||
      settings.language === "he"
        ? "rtl"
        : "ltr";

    global.document.documentElement.dataset.country =
      settings.country;

    global.document.documentElement.dataset.currency =
      settings.currency;
  }

  function changeCountry(country) {
    country = String(country).toUpperCase();

    if (!COUNTRIES[country]) {
      throw new Error("Unsupported country.");
    }

    settings = {
      ...getCountrySettings(country),
      manual: true
    };

    save();
    applyDocumentSettings();

    return getSettings();
  }

  function changeLanguage(language) {
    language = String(language).toLowerCase();

    if (!LANGUAGE_NAMES[language]) {
      throw new Error("Unsupported language.");
    }

    settings.language = language;
    settings.manual = true;

    save();
    applyDocumentSettings();

    return getSettings();
  }

  function getSettings() {
    return { ...settings };
  }

  function formatPrice(amount) {
    amount = Number(amount);

    if (!Number.isFinite(amount)) {
      throw new TypeError("Invalid price.");
    }

    return new Intl.NumberFormat(
      settings.language,
      {
        style: "currency",
        currency: settings.currency
      }
    ).format(amount);
  }

  function translate(key) {
    const dictionary =
      TRANSLATIONS[settings.language] ||
      TRANSLATIONS.en;

    return dictionary[key] ||
      TRANSLATIONS.en[key] ||
      key;
  }

  function getCountries() {
    return Object.keys(COUNTRIES).map(code => ({
      code,
      currency: COUNTRIES[code][0],
      symbol: COUNTRIES[code][1],
      language: COUNTRIES[code][2]
    }));
  }

  function getLanguages() {
    return Object.entries(LANGUAGE_NAMES).map(
      ([code, name]) => ({ code, name })
    );
  }

  function getCountryName(countryCode) {
    try {
      return new Intl.DisplayNames(
        [settings.language],
        { type: "region" }
      ).of(countryCode);
    } catch (error) {
      return countryCode;
    }
  }

  function reset() {
    try {
      global.localStorage?.removeItem(STORAGE_KEY);
    } catch (error) {}

    settings = {
      ...getCountrySettings(DEFAULT_COUNTRY),
      manual: false
    };

    applyDocumentSettings();

    return getSettings();
  }

  function getTranslationDictionary() {
    return {
      ...(TRANSLATIONS[settings.language] ||
        TRANSLATIONS.en)
    };
  }

  const API = {
    initialize,
    detectCountry,
    changeCountry,
    changeLanguage,
    formatPrice,
    translate,
    getSettings,
    getCountries,
    getLanguages,
    getCountryName,
    getTranslationDictionary,
    reset,
    COUNTRIES,
    LANGUAGE_NAMES,
    TRANSLATIONS
  };

  global.SS_REGION = API;

  if (global.document) {
    global.SS_REGION_READY = initialize();
  }

})(typeof window !== "undefined" ? window : globalThis);      
