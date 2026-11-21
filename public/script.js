(function () {
  "use strict";

  // Récupération de l'attribut data-site
  var currentScript = document.currentScript;
  if (!currentScript) return;
  var siteId = currentScript.getAttribute("data-site");
  if (!siteId) return;

  var endpoint = currentScript.src.replace(/\/script\.js$/, "/api/collect");

  // Détection automatique du device
  var device = "desktop";
  var ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "tablet";
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    device = "mobile";
  }

  // Détection intelligente de la source
  var referrer = document.referrer || "";
  var source = "direct";
  var urlParams = new URLSearchParams(window.location.search);
  var utmSource = urlParams.get("utm_source");

  if (utmSource) {
    source = utmSource.toLowerCase();
  } else if (referrer) {
    var refLower = referrer.toLowerCase();
    if (refLower.indexOf("tiktok.com") !== -1 || ua.indexOf("musical_ly") !== -1 || ua.indexOf("Bytedance") !== -1) {
      source = "tiktok";
    } else if (refLower.indexOf("instagram.com") !== -1 || ua.indexOf("Instagram") !== -1) {
      source = "instagram";
    } else if (refLower.indexOf("whatsapp") !== -1 || refLower.indexOf("wa.me") !== -1) {
      source = "whatsapp";
    } else if (refLower.indexOf("t.co") !== -1 || refLower.indexOf("twitter.com") !== -1 || refLower.indexOf("x.com") !== -1) {
      source = "x";
    } else if (refLower.indexOf("google.") !== -1) {
      source = "google";
    } else if (refLower.indexOf("youtube.com") !== -1 || refLower.indexOf("youtu.be") !== -1) {
      source = "youtube";
    } else if (refLower.indexOf("facebook.com") !== -1) {
      source = "facebook";
    } else {
      try {
        source = new URL(referrer).hostname.replace(/^www\./, "");
      } catch (e) {
        source = "referral";
      }
    }
  }

  // Identifiant anonyme de session journalière sans cookie
  var dateStr = new Date().toISOString().slice(0, 10);
  var rawHash = [navigator.userAgent, screen.width, screen.height, dateStr].join("|");
  var hash = 0;
  for (var i = 0; i < rawHash.length; i++) {
    hash = (hash << 5) - hash + rawHash.charCodeAt(i);
    hash |= 0;
  }
  var sessionId = "s_" + Math.abs(hash).toString(36);

  // Envoi de l'événement pageview
  function trackEvent(eventName, amount) {
    var payload = {
      website_id: siteId,
      path: window.location.pathname || "/",
      referrer: referrer,
      source: source,
      device: device,
      session_id: sessionId,
      event_name: eventName || "pageview",
      amount: amount || 0
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", endpoint, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(payload));
    }
  }

  // Traçage de la page vue initiale
  trackEvent("pageview");

  // Détection automatique des clics sur les boutons de paiement
  document.addEventListener("click", function (e) {
    var target = e.target;
    var payBtn = target.closest("[data-izi-event='pay']") || target.closest("a[href*='stripe']"), 
        whopBtn = target.closest("a[href*='whop.com']"),
        paydunyaBtn = target.closest("a[href*='paydunya']"),
        cinetpayBtn = target.closest("a[href*='cinetpay']");

    if (payBtn || whopBtn || paydunyaBtn || cinetpayBtn) {
      var amount = 0;
      var el = payBtn || whopBtn || paydunyaBtn || cinetpayBtn;
      if (el && el.getAttribute("data-izi-amount")) {
        amount = parseFloat(el.getAttribute("data-izi-amount")) || 0;
      }
      trackEvent("checkout_click", amount);
    }
  }, true);

  // Exposer l'API globale window.izi
  window.izi = {
    track: function (eventName, amount) {
      trackEvent(eventName, amount);
    }
  };
})();
