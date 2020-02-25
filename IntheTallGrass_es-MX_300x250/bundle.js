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
  var isBackupShown = false;
  var isMultititle = false;
  var isStarted = false;
  var carousel;
  var bannerClick;
  var monetIntegrator;
  var ribbon;
  var cta;
  var logo;

  function animateCta() {
    document.querySelector("netflix-cta").style.clip =
      "rect(0px,100px,100px,0px)";
  }
  function animateRibbon() {
    ribbon.play();
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
    logo.play();
  }
  function showBug() {
    var e = document.getElementById("ratingBug");
    if (e["data-src"]) e.style.display = "block";
  }
  function checkForLoaded(elm, cb) {
    if (elm.complete) return cb();
    elm.addEventListener("load", cb);
    elm.addEventListener("error", cb);
  }
  function injectData(data) {
    adData = data[0];
    isDataInjected = true;

    data.forEach(function(d, i) {
      var item;
      if (!document.querySelectorAll(".artworkImage")[i]) {
        item = document.querySelector(".artworkImage").cloneNode(true);
        item.classList.remove("first");
        document.querySelector(".artworkImage").parentNode.appendChild(item);
      }
      item = document.querySelectorAll(".artworkImage")[i];
      // var img = item.querySelector(".artworkImage-img");
      // img.id = "title-img-" + (i + 1);
    });

    var e;
    e = document.getElementById("tuneIn");
    injectScaledText(e, data[0].textLocale, data[0].text, true);

    e = document.getElementById("disclaimer");
    injectScaledText(e, data[0].disclaimerLocale, data[0].disclaimer);

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
    logo.reset();
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
  function startAd() {
    if (isBackupShown) return;
    if (isStarted) return;
    isStarted = true;
    Monet.trackEvent("MONET_IMPRESSION");
    sizeCta();
    startAnimation();
  }
  function handleError(error) {
    console.log(error);
    Monet.trackEvent("MONET_DATA_ERROR", {
      stack: error.stack,
      details: error.message
    });
    Monet.trackEvent("BACKUP_ASSETS_LOADED");
    showBackup();
  }
  function buildAd() {
    var imgMetadata = Monet.getFieldMetadata("MAIN_IMAGE");
    var mainImgs = Monet.getFieldValue("MAIN_IMAGE");
    // conform img value to Array
    if (!Array.isArray(mainImgs)) {
      mainImgs = [mainImgs];
    }
    if (mainImgs.length > 1 && imgMetadata.isList) {
      isMultititle = true;
    }
    try {
      var data = [];
      mainImgs.forEach(function(img, i) {
        data[i] = {
          img: img,
          text: Monet.getFieldValue("HEADLINE"),
          textLocale: Monet.getLocale(),
          cta: Monet.getFieldValue("CTA"),
          ctaLocale: Monet.getLocale(),
          disclaimer: Monet.getFieldValue("DESCRIPTION"),
          disclaimerLocale: Monet.getLocale(),
          url: Monet.getFieldValue("EXIT_URL"),
          templateBlack: true,
          isOriginalTitle: false,
          ratingBug: Monet.getFieldValue("RATINGS")
        };
      });
      injectData(data);
    } catch (error) {
      handleError(error);
    }
  }
  function sizeCta() {
    if (!adData.isOriginalTitle) {
      cta.setAttribute("width", 93);
      cta.setAttribute("height", 23);
      cta.setAttribute("font-size", 6);
      cta.setAttribute("min-font-size", 6);
      cta.resize();
    }
  }
  function addBannerClickListeners() {
    bannerClick.addEventListener("click", function() {
      Monet.adExit(onClickUrl);
    });
    bannerClick.addEventListener("mouseover", function() {
      cta.mouseover();
    });
    bannerClick.addEventListener("mouseout", function() {
      cta.mouseout();
    });
  }

  Monet.init().then(function() {
    // get element references
    bannerClick = document.getElementById("bannerClick");
    monetIntegrator = document.querySelector("monet-integrator");
    ribbon = document.querySelector("netflix-flushed-ribbon");
    cta = document.querySelector("netflix-cta");
    logo = document.querySelector("netflix-brand-logo");

    addBannerClickListeners();

    Monet.trackEvent("MONET_INITIALIZED");
    buildAd();
    sizeCta();

    var hasImpression = false;
    Monet.onVisibilityChange(function(visible) {
      if (visible && !hasImpression) {
        hasImpression = true;
        if (monetIntegrator.hasAttribute("allComponentsReady")) {
          startAd();
        } else {
          monetIntegrator.addEventListener("allComponentsReady", startAd);
        }
      }
    });
  });
})();
