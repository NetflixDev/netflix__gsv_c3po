
/* wc-netflix-fonts:NetflixFontsComponent.js, VERSION: 7.0.1, Published: 2019/09/10 16:04:15 $*/
!(function() {
  var COMPONENT_NAME = 'netflix-fonts';

  /**
   * Font selection takes the following inputs:
   *  - locale, string matching keys in the `fonts` dictionary below. Locales defined by Monet-Integrator will append.
   *  - light, boolean indicating font weight is required
   *  - normal, boolean indicating font weight
   *  - bold, boolean indicated font weight
   *
   * Font declarations are injected as <link> tags which load stylesheets
   * containing the @font-face.
   *
   * https://github.com/bramstein/fontfaceobserver then monitors for success / fail of those requests.
   *
   * If all weights for a particular family fail, then fallback fonts of corresponding
   * weights will be attempted. Browsers are not strict about weight, so if any one weight of a family
   * succeeds, then all weights are considered successful. See Bramstein's response here: https://github.com/bramstein/fontfaceobserver/issues/38
   *
   * If all fallbacks fail, component will throw.
   *
   * If fonts succeed to load, component will dispatch 'ready'.
   *
   */
  var FONT_CDN = 'https://ae.nflximg.net/monet/fonts';
  var fonts = {
    // english
    en: [
      {
        fam: 'Netflix Sans',
        weights: {
          '300': 'en__ns__300.css',
          '500': 'en__ns__500.css',
          '700': 'en__ns__700.css'
        },
        test: 'BESbwy'
      }
    ],

    // hebrew
    he: [
      {
        fam: 'Noto Sans Hebrew',
        weights: {
          '400': 'hebrew/he__nsh__400.css',
          '700': 'hebrew/he__nsh__700.css'
        },
        test: 'צפו עכשיו'
      },
      {
        fam: 'Assistant',
        weights: {
          '400': 'hebrew/he__a__400.css',
          '600': 'hebrew/he__a__600.css',
          '700': 'hebrew/he__a__700.css'
        },
        test: 'אצפו עכשיו'
      },
      {
        fam: 'Rubik',
        weights: {
          '400': 'hebrew/he__r__400.css',
          '700': 'hebrew/he__r__700.css'
        },
        test: 'צפו עכשיו'
      }
    ],

    // thai
    th: [
      {
        fam: 'Graphik Thai',
        weights: {
          '300': 'thai/th__gt__300.css',
          '500': 'thai/th__gt__500.css',
          '700': 'thai/th__gt__700.css'
        },
        test: 'รับชมได้แล้ว'
      },
      {
        fam: 'Neue Helvetica Thai',
        weights: {
          '400': 'thai/th__nht__400.css',
          '700': 'thai/th__nht__700.css'
        },
        test: 'รับชมได้แล้ว'
      },
      {
        fam: 'Prompt',
        weights: {
          '400': 'thai/th__p__400.css',
          '600': 'thai/th__p__600.css',
          '700': 'thai/th__p__700.css'
        },
        test: 'รับชมได้แล้ว'
      }
    ],

    // arabic
    ar: [
      {
        fam: 'Neue Helvetica Arab',
        weights: {
          '400': 'arabic/ar__nha__400.css',
          '700': 'arabic/ar__nha__700.css'
        },
        test: 'شاهد الآن'
      },
      {
        fam: 'Changa',
        weights: {
          '400': 'arabic/ar__c__400.css',
          '600': 'arabic/ar__c__600.css',
          '700': 'arabic/ar__c__700.css'
        },
        test: 'شاهد الآن'
      },
      {
        fam: 'Droid Arabic Kufi',
        weights: {
          '400': 'arabic/ar__dak__400.css',
          '700': 'arabic/ar__dak__700.css'
        },
        test: 'شاهد الآن'
      }
    ]
  };

  /**
   * Weight management
   *
   */

  var weightsMap = {
    light: [300, 400],
    normal: [500, 600],
    bold: [700]
  };
  // enable weight requests by string ('light', 'bold', etc), or by numerical weight (300, 400, etc)
  function getWeights(value) {
    if (isNaN(value)) {
      return weightsMap[value] || [];
    } else {
      return [value];
    }
  }
  function getFontReqsByWeights(font, weightReqs) {
    return weightReqs.map(function(weightReq) {
      // language exceptions for font requirements w/o normal font
      weightReq = accountForLocaleExceptions(font, weightReq);

      var weights = getWeights(weightReq); // standardize weights
      return weights.reduce(function(acc, weight) {
        // verify requested weight has a definition in "fonts"
        if (weight in font.weights) {
          acc.push({
            url: FONT_CDN + '/' + font.weights[weight],
            weight: weight
          });
        }

        return acc;
      }, []);
    });
  }
  function accountForLocaleExceptions(font, weightReq) {
    if ((font.fam === 'Neue Helvetica Arab' || font.fam === 'Noto Sans Hebrew') && weightReq === 'normal') {
      return 'bold';
    }
    return weightReq;
  }

  /**
   * Font loading
   *
   *
   */
  function loadFonts(component, locales, weights) {
    console.log('loadFonts:', locales, weights);
    var promises = [];
    locales.forEach(function(locale) {
      if (locale in fonts) {
        promises.push(loadLocale(locale, weights));
      }
    });

    if (!promises.length) {
      promises.push(loadLocale('en', weights));
    }

    return Promise.all(promises)
      .then(function(fontLoads) {
        console.log('All fonts are loaded.');

        // generate public fontLoads data object
        component._generateFontLoadsObj(fontLoads);

        component.dispatchEvent(new CustomEvent('ready'));
        component.setAttribute('ready', '');

        return fontLoads;
      })
      .catch(function(err) {
        component.dispatchEvent(
          new CustomEvent('containerFailover', {
            detail: 'Failed to load fonts. Error:' + err
          })
        );
      });
  }
  function loadLocale(locale, weights, index) {
    return new Promise(function(resolve, reject) {
      var localeIndex = index || 0;
      if (localeIndex >= fonts[locale].length) {
        reject(new Error('No more fallback fonts available.'));
      }
      var promises = [];
      var font = fonts[locale][localeIndex];
      var reqs = getFontReqsByWeights(font, weights);
      reqs.forEach(function(req) {
        req.forEach(function(weight) {
          injectFontCss(weight.url);
          promises.push(observeFontLoad(font, locale, weight, localeIndex));
        });
      });
      Promise.all(promises)
        .then(function(fonts) {
          resolve({
            locale: locale,
            fonts: fonts
          });
        })
        .catch(function(err) {
          reject(err);
        });
    });
  }
  function observeFontLoad(font, locale, weight, index) {
    return new Promise(function(resolve, reject) {
      var observer = new FontFaceObserver(font.fam, { weight: weight.weight });
      observer
        .load(font.test)
        .then(function(f) {
          console.log('Loaded font: "' + f.family + '", weight: ' + f.weight);
          resolve(f);
        })
        .catch(function(err) {
          console.log('Failed to load font: "' + font.fam + '", weight: ' + weight.weight);
          // recurse to next locale for failed weight load
          loadLocale(locale, [weight.weight], index + 1)
            .then(function() {
              resolve();
            })
            .catch(function(err) {
              reject(err);
            });
        });
    });
  }
  function injectFontCss(url) {
    console.log('injectFontCss()', url);
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.media = 'all';
    head.appendChild(link);
  }

  /**
   * Utilities
   *
   */
  function pushUnique(arr, val) {
    if (val && arr.indexOf(val) === -1) {
      arr.push(val);
    }
    return arr;
  }

  /**
   * Element declaration
   *
   */
  if (customElements.define) {
    var FontsComponent = function() {
      var self = Utils.reflectConstruct(HTMLElement, [], this.constructor);
      self._attached = false;
      self._hasInited = false;
      return self;
    };

    FontsComponent.prototype = Object.create(HTMLElement.prototype, {
      disconnectedCallback: {
        value: function() {
          this._attached = false;
        }
      },
      connectedCallback: {
        value: function() {
          var dom = this;

          this._attached = true;
          if (this._hasInited) {
            return;
          }
          this._hasInited = true;

          Utils.createStyle.call(
            dom,
            '',
            '.en, .da, .nl, .fi, .fr, .de, .it, .no, .pt, .ro, .es, .sv, .tr, .pl, .el',
            "font-family: 'Netflix Sans', Helvetica, Arial, sans-serif;",
            '.zh',
            "-webkit-locale: 'zh'; font-family: 'Netflix Sans', 'Microsoft JhengHei UI', '微軟正黑體', 'Heiti TC', '黑体-简', Arial, Helvetica, sans-serif;",
            '.ja',
            "-webkit-locale: 'ja'; font-family: 'Netflix Sans', 'Yu Gothic Medium', 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ', Arial, Helvetica, sans-serif;",
            '.ko',
            "-webkit-locale: 'ko'; font-family: 'Netflix Sans', 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', '애플 SD 산돌고딕 Neo', Arial, Helvetica, sans-serif;",
            '.ar',
            "font-family: 'Netflix Sans', 'Neue Helvetica Arab', 'Changa', 'Droid Arabic Kufi', Arial, sans-serif;",
            '.th',
            "font-family: 'Graphik Thai', 'Neue Helvetica Thai', 'Prompt', Arial, sans-serif;",
            '.th .cta_copy',
            'margin-top: -2px;',
            '.he',
            "font-family: 'Netflix Sans', 'Noto Sans Hebrew', 'Assistant', 'Rubik', Arial, sans-serif;"
          );

          // @param: locale
          var locales = this.getAttribute('locale') ? this.getAttribute('locale').split(/\s*,\s*/) : null;

          // @param: weights
          var weights = [];
          // light
          if (this.hasAttribute('light') && this.getAttribute('light').toString() !== 'false') {
            weights.push('light');
          }
          // normal, will load by default, unless explicitly turned off
          if (this.hasAttribute('normal')) {
            if (this.getAttribute('normal').toString() !== 'false') {
              weights.push('normal');
            }
          } else {
            weights.push('normal');
          }
          // bold
          if (this.hasAttribute('bold') && this.getAttribute('bold').toString() !== 'false') {
            weights.push('bold');
          }

          var MonetComponent = document.querySelector('monet-integrator');
          if (MonetComponent) {
            MonetComponent.register(this);

            var self = this;
            MonetComponent.ensureInitialized().then(function() {
              try {
                var locale = Monet.getLocale();
                if (locale && locale.split('.')[0] === 'text') {
                  var monetLocale = locale.substr(0, 2); // this doesn't catch correctly if data is not present, bc MI doesn't reject the promise
                }
                loadFonts(dom, [locale], weights);
              } catch (e) {
                Monet.logEvent('MONET_DATA_ERROR', {
                  details: 'Failed to load backup Monet data',
                  stack: e
                });
              }
            });
          }
        }
      },
      preview: {
        value: function() {
          return false;
        }
      },
      // map locale to primary loaded font
      _generateFontLoadsObj: {
        value: function(fontLoads) {
          if (fontLoads) {
            var fontLoadsObj = fontLoads.reduce(function(acc, fontLoad) {
              acc[fontLoad.locale] = fontLoad.fonts;
              return acc;
            }, {});
            this.fontLoads = fontLoadsObj;
          }
        }
      }
    });

    FontsComponent.prototype.constructor = FontsComponent;
    Object.setPrototypeOf(FontsComponent, HTMLElement);
    customElements.define(COMPONENT_NAME, FontsComponent);
  }
})();
