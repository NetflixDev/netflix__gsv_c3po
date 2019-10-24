
/* wc-netflix-text:NetflixTextComponent.js, VERSION: 6.0.0, Published: 2019/09/10 15:56:41 $*/
!(function() {
  // remove any tags, replace <br> with \n and render back to innerHTML
  function safeBRReplace(str) {
    var frag = document.createDocumentFragment();
    frag.textContent = str.replace(/<br\s*\/?>/gm, '\n');
    return frag.textContent.replace(/\n/gm, '<br>');
  }

  if (window.customElements && window.customElements.define) {
    var COMPONENT_NAME = 'netflix-text';

    var TextComponent = function() {
      var self = Utils.reflectConstruct(HTMLElement, [], this.constructor);
      self._attached = false;
      self._hasInited = false;
      return self;
    };

    TextComponent.prototype = Object.create(HTMLElement.prototype, {
      disconnectedCallback: {
        value: function() {
          this._attached = false;
        }
      },
      connectedCallback: {
        value: function() {
          var textSpan = document.createElement('span');
          this.appendChild(textSpan);

          this._attached = true;

          if (this._hasInited) {
            return;
          }

          this._hasInited = true;

          var dom = this;
          var textSpan = this.children[0];

          var MonetComponent = document.querySelector('monet-integrator');
          if (MonetComponent) {
            MonetComponent.register(this);
            MonetComponent.ensureInitialized().then(function() {
              var fieldName = dom.getAttribute('data-dynamic-key') + '_Text';
              try {
                var dynamicText = Monet.getFieldValue(fieldName);
                if (dynamicText) {
                  textSpan.innerHTML = safeBRReplace(dynamicText);
                  var locale = Monet.getLocale();
                  if (locale) {
                    textSpan.classList.add(locale.substr(0, 2));
                  }
                }

                dom.dispatchEvent(new CustomEvent('ready'));
              } catch (e) {
                console.error('Monet dynamic ID not found in JSON: ', fieldName);
              }
            });
          } else {
            console.warn('No "monet-integrator" component found. Dynamic binding is disabled');
          }
        }
      },

      preview: {
        value: function() {
          this.children[0].innerHTML = 'This is a preview of the text component.';
          // ensure the preview in C2.0 doesn't get cut off
          this.style.height = '40px';
          this.style.display = 'inline-block';
        }
      }
    });

    TextComponent.prototype.constructor = TextComponent;
    Object.setPrototypeOf(TextComponent, HTMLElement);

    if (!customElements.get(COMPONENT_NAME)) {
      customElements.define(COMPONENT_NAME, TextComponent);
    }
  }
})();
