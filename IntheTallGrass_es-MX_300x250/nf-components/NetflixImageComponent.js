
/* wc-netflix-img:NetflixImageComponent.js, VERSION: 6.0.0, Published: 2019/09/10 15:53:52 $*/
!(function() {
  var COMPONENT_NAME = 'netflix-img';

  if (window.customElements && window.customElements.define) {
    var ImageComponent = function() {
      var self = Utils.reflectConstruct(HTMLElement, [], this.constructor);
      self._attached = false;
      self._hasInited = false;
      return self;
    };

    ImageComponent.prototype = Object.create(HTMLElement.prototype, {
      disconnectedCallback: {
        value: function() {
          this._attached = false;
        }
      },
      connectedCallback: {
        value: function() {
          var img = document.createElement('img');
          this.appendChild(img);

          this._attached = true;

          if (this._hasInited) {
            return;
          }

          this._hasInited = true;

          var dom = this;
          var img = this.children[0];

          var height = dom.getAttribute('height');
          var width = dom.getAttribute('width');
          if (width) img.setAttribute('width', width);
          if (height) img.setAttribute('height', height);

          var MonetComponent = document.querySelector('monet-integrator');
          if (MonetComponent) {
            MonetComponent.register(this);

            MonetComponent.ensureInitialized().then(function() {
              var imgPath;
              var bindSrc = dom.getAttribute('data-dynamic-key');
              var fieldName = bindSrc + '_Image';
              var imgId = dom.getAttribute('id');

              // absolute paths eg. assets/img.png
              if (/\.(jpe?g|png|gif|svg)$/i.test(bindSrc) || /\.(nflximg.net)/i.test(bindSrc)) {
                imgPath = bindSrc;
                img.setAttribute('src', bindSrc);
              } else {
                var value = Monet.getFieldValue(fieldName);
                if (value) {
                  // TODO: how to handle lists of text?
                  imgPath = value;
                  img.setAttribute('src', imgPath);
                } else if (value === undefined) {
                  // if value ignored in Monet manifest.json, throw data error
                  dom.dispatchEvent(
                    new CustomEvent('dataFailover', {
                      detail: 'Monet dynamic ID not found in JSON: ' + fieldName
                    })
                  );
                } else {
                  // if some falsy value besides undefined, assuming user wants image to be blank
                  dom.dispatchEvent(new CustomEvent('ready'));
                }
              }

              img.onload = function(event) {
                // image failed to load properly
                if (!img.complete && img.naturalWidth === 0) {
                  return dom.dispatchEvent(
                    new CustomEvent('containerFailover', {
                      detail: fieldName + ' failed to load'
                    })
                  );
                }
                dom.style.width = img.width + 'px';
                dom.style.height = img.height + 'px';
                img.style.position = 'absolute';
                dom.dispatchEvent(new CustomEvent('ready'));
              };

              img.onerror = function(event) {
                dom.dispatchEvent(
                  new CustomEvent('containerFailover', {
                    detail: fieldName + ' failed to load'
                  })
                );
              };

              if (imgId) {
                img.setAttribute('id', imgId + '-img');
              }
            });
          }
        }
      },

      preview: {
        value: function() {
          var imgPath = '//ae.nflximg.net/monet/img/c20/netflix_placement.svg';
          this.children[0].setAttribute('src', imgPath);
          this.setAttribute('width', 300);
          this.setAttribute('height', 300);
        }
      }
    });

    ImageComponent.prototype.constructor = ImageComponent;
    Object.setPrototypeOf(ImageComponent, HTMLElement);

    if (!customElements.get(COMPONENT_NAME)) {
      customElements.define(COMPONENT_NAME, ImageComponent);
    }
  }
})();
