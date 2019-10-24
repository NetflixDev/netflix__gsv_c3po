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
  var errorTimeout;
  var bannerClick;
  var monetIntegrator;
  var ribbon;
  var cta;
  var logo;

  function animateCta() {
    document.getElementById("cta").style.clip = "rect(0px,128px,128px,0px)";
  }
  function animateRibbon() {
    ribbon.play();
  }
  function animateNRibbon() {
    var p = document.getElementById("nRibbon").style;
    p.opacity = "1";
    p.left = "444px";
  }
  function animateTitle() {
    var t = document.getElementById("title").style;
    t.opacity = "1";
    t.left = "0px";
  }
  function animatePanel() {
    var p = document.getElementById("panel").style;
    p.opacity = "1";
    p.right = "0px";
  }
  function animateLogo() {
    logo.play();
  }
  function showBug() {
    var e = document.getElementById("ratingBug");
    if (e["data-src"]) e.style.display = "block";
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
    });

    var e;
    e = document.getElementById("tuneIn");
    injectScaledText(e, data[0].textLocale, data[0].text);

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
    setTimeout(animateRibbon, 0);
    setTimeout(animateTitle, 700);
    setTimeout(animatePanel, 700);
    setTimeout(animateNRibbon, 700);
    setTimeout(showBug, 1000);
    setTimeout(animateLogo, 2500);
    setTimeout(animateCta, 1500);

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
    startAnimation();
    clearTimeout(errorTimeout);
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
    var imgMetadata = Monet.getFieldMetadata("Main_Image");
    var mainImgs = Monet.getFieldValue("Main_Image");
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
          text: Monet.getFieldValue("Headline_Text"),
          textLocale: Monet.getLocale(),
          cta: Monet.getFieldValue("CTA_Text"),
          ctaLocale: Monet.getLocale(),
          disclaimer: Monet.getFieldValue("Description_Text"),
          disclaimerLocale: Monet.getLocale(),
          url: Monet.getFieldValue("Exit_URL"),
          templateBlack: true,
          isOriginalTitle: true,
          ratingBug: Monet.getFieldValue("Ratings_Bug_Image")
        };
      });
      injectData(data);
    } catch (error) {
      handleError(error);
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

    errorTimeout = setTimeout(function() {
      handleError(new Error("timeout"));
    }, 10000);

    Monet.trackEvent("MONET_INITIALIZED");
    buildAd();

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
