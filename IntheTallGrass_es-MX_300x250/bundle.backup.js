(function() {
  var defaultData = {
    img:
      "https://art-s.nflximg.net/50e0c/15722991e6d94c1af3d373cee1b67871d0450e0c.jpg",
    text: "See what’s next.",
    textLocale: "en",
    cta: "WATCH NOW",
    ctaLocale: "en",
    disclaimer: "",
    disclaimerLocale: "en",
    url: "https://www.netflix.com/",
    templateBlack: true,
    isOriginalTitle: false,
    ratingBug: ""
  };
  var adData = defaultData;
  var animationStarted = false;
  var onClickUrl = "https://www.netflix.com/";
  var isDataInjected = false;
  var isEnablerLoaded = false;
  var isFontLoaded = false;
  var isImageLoaded = false;
  var isBackupShown = false;
  var isMultititle = false;
  var isStarted = false;
  var carousel;

  function animateCta() {
    document.getElementById("cta").style.clip = "rect(0px,100px,100px,0px)";
  }
  function animateRibbon() {
    var l = document.getElementById("ribbon_left").style;
    var r = document.getElementById("ribbon_right").style;
    var m = document.getElementById("ribbon_mid").style;
    setTimeout(function() {
      l.transform = "matrix(1, 0, 0, 1, 0, 0)";
    }, 0);
    setTimeout(function() {
      m.transform = "translate(-50%, -50%) matrix(1, 0, 0, 1, 0, 0)";
    }, 0);
    setTimeout(function() {
      r.transform = "matrix(1, 0, 0, 1, 0, 0)";
    }, 400);
    setTimeout(function() {
      l.transform = "matrix(1, 0, 0, 1, 0, -250)";
    }, 1000);
    setTimeout(function() {
      m.transform = "translate(-50%, 100%) matrix(1, 0, 0, 1, 0, 0)";
    }, 1200);
    setTimeout(function() {
      r.transform = "matrix(1, 0, 0, 1, 0, -250)";
    }, 1400);
  }
  function animateTitle() {
    var t = document.getElementById("title").style;
    t.opacity = "1";
    t.top = "0px";
  }
  function animatePanel() {
    var p = document.getElementById("panel").style;
    p.opacity = "1";
    p.bottom = "0px";
  }
  function animateLogo() {
    document.getElementById("logo").style.clip = "rect(0px,100px,30px,0px)";
  }
  function showBug() {
    var e = document.getElementById("ratingBug");
    if (e["data-src"]) e.style.display = "block";
  }
  // TODO: use CTA component
  function initCta() {
    var b = document.getElementById("bannerClick");
    var c = document.getElementById("cta-button");
    b.addEventListener("mouseover", function() {
      c.className = "button hover isArrow";
    });
    b.addEventListener("mouseout", function() {
      c.className = "button isArrow";
    });
    b.addEventListener("click", function(event) {
      Monet.logEvent("AD_EXIT", { url: onClickUrl });
      Enabler.exit("Default Exit", onClickUrl);
      var t = String(event.target);
      Monet.logEvent("CLICK", {
        src: t,
        coords: { x: event.clientX, y: event.clientY }
      });
      clearInterval(carousel);
      var items = document.querySelectorAll(".artworkImage");
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("in");
        items[i].classList.remove("out");
      }
    });
  }
  function checkForLoaded(elm, cb) {
    if (elm.complete) return cb();
    elm.addEventListener("load", cb);
    elm.addEventListener("error", cb);
  }
  function injectData(data) {
    adData = data[0];
    isDataInjected = true;
    imgLoaded = 0;
    data.forEach(function(d, i) {
      var item;
      if (!document.querySelectorAll(".artworkImage")[i]) {
        item = document.querySelector(".artworkImage").cloneNode(true);
        item.classList.remove("first");
        document.querySelector(".artworkImage").parentNode.appendChild(item);
      }
      item = document.querySelectorAll(".artworkImage")[i];
      var img = item.querySelector(".artworkImage-img");
      img.id = "title-img-" + (i + 1);
      img.src = data[i].img;
      checkForLoaded(img, function() {
        imgLoaded++;
        if (imgLoaded >= data.length) {
          isImageLoaded = true;
          startAd();
        }
      });
    });

    var e;
    e = document.getElementById("tuneIn");
    injectScaledText(e, data[0].textLocale, data[0].text, true);

    e = document.getElementById("disclaimer");
    injectScaledText(e, data[0].disclaimerLocale, data[0].disclaimer);

    e = document.getElementById("cta-text");
    injectScaledText(e, data[0].ctaLocale, data[0].cta);

    e = document.getElementById("ratingBug");
    if (data[0].ratingBug) {
      e.src = data[0].ratingBug;
      e["data-src"] = data[0].ratingBug;
    }

    var rootClass = "banner";
    if (!data[0].templateBlack) rootClass += " lightSkin";
    if (data[0].isOriginalTitle) rootClass += " originalTitle";
    e = document.getElementById("banner");
    e.className = rootClass;
    onClickUrl = data[0].url;
  }
  function startAnimation() {
    if (!isDataInjected) injectData(defaultData);
    if (animationStarted) return;
    animationStarted = true;
    setTimeout(animateRibbon, 0);
    setTimeout(animateTitle, 500);
    setTimeout(animatePanel, 500);
    setTimeout(showBug, 1000);
    if (adData.isOriginalTitle) {
      setTimeout(animateCta, 1500);
    } else {
      setTimeout(animateLogo, 1500);
      setTimeout(animateCta, 2500);
    }
    if (isMultititle) setTimeout(startGallery, 2200);
  }
  function startGallery() {
    var items = document.querySelectorAll(".artworkImage");
    i = 0;
    var c = 0;
    carousel = setInterval(function() {
      var p = c;
      c = c + 1 >= items.length ? 0 : c + 1;
      var pitem = document.querySelectorAll(".artworkImage")[p];
      var citem = document.querySelectorAll(".artworkImage")[c];

      pitem.classList.remove("in");
      pitem.classList.add("out");
      citem.classList.remove("out");
      citem.classList.remove("first");
      citem.classList.add("in");
      pitem.style.animationName = "slideout";
      pitem.style.animationDelay = "0s";
      citem.style.animationName = "slidein";
      citem.style.animationDelay = ".2s";
      i++;
      if (i > 5) clearInterval(carousel);
    }, 2300);
  }
  function showBackup() {
    animationStarted = true;
    var e = document.getElementById("backup");
    e.src = "backup.jpg";
    e.style.display = "block";
    isBackupShown = true;
  }
  function injectScaledText(container, className, text, left) {
    container.innerHTML = "";
    var content = document.createElement("div");
    content.className = className + " scaledText" + (left ? " left" : "");
    content.innerHTML = text;
    container.appendChild(content);
    setTimeout(function() {
      function getPadding(el, s) {
        return parseInt(
          window.getComputedStyle(el, null).getPropertyValue("padding-" + s)
        );
      }
      var paddingX =
        getPadding(container, "left") + getPadding(container, "right");
      var paddingY =
        getPadding(container, "top") + getPadding(container, "bottom");
      var containerWidth = container.offsetWidth - paddingX;
      var containerHeight = container.offsetHeight - paddingY;
      var contentWidth = content.offsetWidth;
      var contentHeight = content.offsetHeight;
      var scaleX = containerWidth / contentWidth;
      var scaleY = containerHeight / contentHeight;
      var scale = Math.max(Math.min(scaleX * 0.9, scaleY * 0.9, 1), 0.5);
      contentWidth *= scale;
      contentHeight *= scale;
      var y = (containerHeight - contentHeight) / 2 / scale + "px";
      var x = (containerWidth - contentWidth) / 2 / scale + "px";
      if (left) x = 0;
      content.style.transform =
        "scale(" + scale + ") translate(" + x + ", " + y + ")";
    });
  }
  function loadFonts(locales, callback) {
    var fonts = {};
    var fontFamilies = {
      en: ["Netflix Sans"],
      he: ["Noto Sans Hebrew", "Assistant", "Rubik"],
      th: ["Neue Helvetica Thai", "Prompt"],
      ar: ["Neue Helvetica Arab", "Changa", "Droid Arabic Kufi"]
    };
    locales = locales.filter(function(value, index, self) {
      return self.indexOf(value) === index;
    });
    for (var i = 0; i < locales.length; i++) {
      switch (locales[i]) {
        case "he":
          fonts.he = {
            links: [
              "https://fonts.googleapis.com/earlyaccess/notosanshebrew.css",
              "https://fonts.googleapis.com/css?family=Assistant:400,600,700&subset=hebrew",
              "https://fonts.googleapis.com/css?family=Rubik:400,700&subset=hebrew"
            ],
            fams: fontFamilies.he.slice()
          };
          break;

        case "th":
          fonts.th = {
            links: [
              "https://ae.nflximg.net/monet/fonts/thai/neuehelveticathai.css",
              "https://fonts.googleapis.com/css?family=Prompt:400,600,700&subset=thai"
            ],
            fams: fontFamilies.th.slice()
          };
          break;

        case "ar":
          fonts.ar = {
            links: [
              "https://ae.nflximg.net/monet/fonts/arabic/neuehelveticaarabic.css",
              "https://fonts.googleapis.com/css?family=Changa:400,600,700&subset=arabic",
              "https://fonts.googleapis.com/earlyaccess/droidarabickufi.css"
            ],
            fams: fontFamilies.ar.slice()
          };
          break;
      }
    }
    fonts.en = {
      links: ["https://ae.nflximg.net/monet/fonts/netflixsans.css"],
      fams: fontFamilies.en.slice()
    };
    var failed = [];
    function onComplete() {
      if (failed.length) {
        var urls = [];
        var fams = [];
        for (var i = 0; i < failed.length; i++) {
          for (f in fontFamilies) {
            var index = fontFamilies[f].indexOf(failed[i]);
            if (index > -1) {
              if (fontFamilies[f][index + 1]) {
                urls.push(fonts[f].links.shift());
                fams.push(fonts[f].fams.shift());
              }
              break;
            }
          }
        }
        if (urls[0]) {
          WebFontConfig.custom.families = fams;
          WebFontConfig.custom.urls = urls;
          WebFont.load(WebFontConfig);
        } else {
          this.fontsLoaded = true;
          callback();
        }
        failed = [];
      } else {
        this.fontsLoaded = true;
        callback();
      }
    }
    var urls = [];
    var fams = [];
    for (var i in fonts) {
      var u = fonts[i].links.shift();
      var f = fonts[i].fams.shift();
      if (u) {
        urls.push(u);
        fams.push(f);
      }
    }
    var WebFontConfig = {
      custom: {
        families: fams,
        urls: urls
      },
      timeout: 2e3,
      active: onComplete.bind(this),
      inactive: onComplete.bind(this),
      fontinactive: function(familyName) {
        failed.push(familyName);
      }
    };
    WebFont.load(WebFontConfig);
  }
  function startAd() {
    if (!isEnablerLoaded) return;
    if (!isFontLoaded) return;
    if (!isImageLoaded) return;
    if (isBackupShown) return;
    if (isStarted) return;
    isStarted = true;
    Monet.logEvent("MONET_IMPRESSION");
    startAnimation();
    clearTimeout(errorTimeout);
  }
  function enablerInit() {
    isEnablerLoaded = true;
    startAd();
  }
  function verifyData(data) {
    if (typeof data.img !== "string")
      throw new Error("Data Error: img = " + data.img);
    if (typeof data.text !== "string")
      throw new Error("Data Error: text = " + data.text);
    if (data.textLocale.length !== 2)
      throw new Error("Data Error: textLocale = " + data.textLocale);
    if (typeof data.cta !== "string")
      throw new Error("Data Error: cta = " + data.cta);
    if (data.ctaLocale.length !== 2)
      throw new Error("Data Error: ctaLocale = " + data.ctaLocale);
    if (typeof data.disclaimer !== "string")
      throw new Error("Data Error: disclaimer = " + data.disclaimer);
    if (data.disclaimerLocale.length !== 2)
      throw new Error(
        "Data Error: disclaimerLocale = " + data.disclaimerLocale
      );
    if (typeof data.url !== "string")
      throw new Error("Data Error: url = " + data.url);
    if (typeof data.templateBlack !== "boolean")
      throw new Error("Data Error: templateBlack = " + data.templateBlack);
    if (typeof data.ratingBug !== "string")
      throw new Error("Data Error: ratingBug = " + data.ratingBug);
  }
  function handleError(error) {
    console.log(error);
    Monet.logEvent("MONET_DATA_ERROR", {
      stack: error.stack,
      details: error.message
    });
    Monet.logEvent("BACKUP_ASSETS_LOADED");
    showBackup();
  }
  function loadBackup() {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open("GET", "backup.json", true);
    xobj.onreadystatechange = function() {
      if (xobj.readyState === 4 && xobj.status === 200) {
        var data = JSON.parse(xobj.responseText);
        buildAd(data);
      }
    };
    xobj.send(null);
  }
  function buildAd(monetAssets) {
    if (monetAssets.assetGroups.length > 1) isMultititle = true;
    Monet.logEvent("MONET_ASSETS_LOADED");
    try {
      var data = [];
      monetAssets.assetGroups.forEach(function(d, i) {
        data[i] = {
          img: d["image.Single_Image_300x250_C20"].url,
          text: monetAssets.rootAssets["text.Tune_In"].text,
          textLocale: Monet.getComponentLocale("text.Tune_In").substr(0, 2),
          cta: monetAssets.rootAssets["text.CTA"].text,
          ctaLocale: Monet.getComponentLocale("text.CTA").substr(0, 2),
          disclaimer: monetAssets.rootAssets["text.Disclaimer"].text,
          disclaimerLocale: Monet.getComponentLocale("text.Disclaimer").substr(
            0,
            2
          ),
          url: monetAssets.rootAssets["url.Exit_URL_Desktop"].url,
          templateBlack: monetAssets.rootAssets["bool.Template_Black"].value,
          isOriginalTitle:
            d["text.Netflix_Title_Type"].text.toLowerCase() === "original",
          ratingBug: d["image.Ratings_Bug_22x22"].url
        };
        verifyData(data[i]);
      });
      injectData(data);
      loadFonts([data[0].textLocale, data[0].ctaLocale], function() {
        isFontLoaded = true;
        injectData(data);
        startAd();
      });
    } catch (error) {
      handleError(error);
    }
  }

  if (window.Enabler) {
    initCta();
    var errorTimeout = setTimeout(function() {
      handleError(new Error("timeout"));
    }, 10000);

    if (Enabler.isInitialized()) enablerInit();
    else Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInit);

    Monet.initialize(Enabler, { local: true });
    Monet.logEvent("MONET_INITIALIZED");
    Monet.load(Monet.buildMonetRequest(), buildAd, handleError);
    //Monet.load(Monet.buildMonetRequest(), buildAd, loadBackup)
  }
})();
