
/* wc-netflix-flushed-ribbon:NetflixFlushedRibbonComponent.js, VERSION: 6.0.0, Published: 2019/09/10 17:39:33 $*/
!(function() {
  var COMPONENT_NAME = 'netflix-flushed-ribbon';

  // checks for existing Utils from shared / imported Utils methods
  window.Utils = (function(Utils) {
    Utils.SvgContainer = function(width, height, coordinates, stroke) {
      return (
        '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="none" x="0px" y="0px" ' +
        'width="' +
        width +
        'px" ' +
        'height="' +
        height +
        'px" ' +
        'viewBox="0 0 ' +
        width +
        ' ' +
        height +
        '"><defs><linearGradient id="Gradient_1" gradientUnits="userSpaceOnUse" ' +
        coordinates +
        ' spreadMethod="pad"><stop  offset="0%" stop-color="#AD050F"/><stop offset="100%" stop-color="#9D030C"/></linearGradient>' +
        '<g ' +
        'transform="scale(' +
        width / 100 +
        ',' +
        height / 100 +
        ')" >' +
        '<path fill="#9D030C" stroke="none" d="' +
        stroke +
        '"/></g></defs><g transform="matrix( 1, 0, 0, 1, 0,0) "></svg>'
      );
    };

    return Utils;
  })(window.Utils || {});

  var FlushedRibbonComponent = function() {
    var self = Utils.reflectConstruct(HTMLElement, [], this.constructor);
    self._attached = false;
    self._hasInited = false;
    return self;
  };

  FlushedRibbonComponent.prototype = Object.create(HTMLElement.prototype, {
    disconnectedCallback: {
      value: function() {
        this._attached = false;
      }
    },
    connectedCallback: {
      value: function() {
        this._attached = true;

        if (this._hasInited) {
          return;
        }

        this._hasInited = true;

        function create(name, target) {
          var elem = document.createElement('div');
          elem.classList.add(name);
          if (target) {
            target.appendChild(elem);
          }
          return elem;
        }

        this.leftContainer = create('leftContainer', this);
        this.rightContainer = create('rightContainer', this);
        this.midContainer = create('midContainer', this);
        this.mid = create('mid', this.midContainer);

        this.width = this.getAttribute('width') || this.offsetWidth || 300;
        this.height = this.getAttribute('height') || this.offsetHeight || 250;

        this.scale = 1;

        var defaultScale = {
          '970x250': 2.5,
          '300x600': 1.5,
          '728x90': 2,
          '320x480': 1.3
        };

        var offset = this.width > this.height ? -6 : 7;

        if (defaultScale[this.width + 'x' + this.height]) {
          this.scale = defaultScale[this.width + 'x' + this.height];
        }

        if (Number(this.getAttribute('scale'))) {
          this.scale = Number(this.getAttribute('scale'));
        }

        var scaleWidth = this.width * 0.5;
        var scaleHeight = 600;

        this.leftContainer.innerHTML = Utils.SvgContainer(
          scaleWidth,
          scaleHeight,
          'x1="-11.475" y1="55.6375" x2="62.875" y2="50.4625"',
          'M 0 0 L 0 100 100 100 100 0 0 0 Z'
        );
        this.rightContainer.innerHTML = Utils.SvgContainer(
          scaleWidth,
          scaleHeight,
          'x1="111.475" y1="44.3125" x2="37.125" y2="49.4875"',
          'M 100 100 L 100 0 0 0 0 100 100 100 Z'
        );

        Utils.createStyle.call(
          this,
          COMPONENT_NAME,
          '',
          'overflow: hidden; width:' +
            this.width +
            'px; height:' +
            this.height +
            'px; display:block; position:relative; pointer-events:none; z-index:100;',
          '.leftContainer',
          'background-color: #9d030c;position: absolute; top: 0; left: 0; width: 50%; height: ' +
            this.height +
            'px; overflow: hidden;',
          '.rightContainer',
          'background-color: #9d030c;position: absolute; top: 0; right: 0; width: 50%; height: ' +
            this.height +
            'px;overflow: hidden;',
          '.midContainer',
          'position: absolute; width: ' +
            this.width +
            'px; height: ' +
            this.height +
            'px; transform-origin: 50% 50%; -webkit-transform: rotate(-19deg); transform:rotate(-19deg);',
          '.mid',
          'position:absolute; top:50%; left:50%; width: ' +
            160 * this.scale +
            'px; height: ' +
            this.height * 2.5 +
            'px; overflow: hidden; transform: translate(-50%,-150%); background-color: #e50914;'
        );

        TweenMax.set([this.leftContainer, this.rightContainer], { y: this.height });

        this.timeline = new TimelineMax({ paused: true });
        this.timeline
          .fromTo(this.leftContainer, 0.2, { y: this.height }, { y: 0, ease: Power2.easeIn }, 'start')
          .fromTo(this.mid, 0.2, { x: '-50%', y: '-150%' }, { x: '-50%', y: '-50%', ease: Power2.easeIn }, 'start+=.2')
          .fromTo(
            this.rightContainer,
            0.2,
            { y: this.height },
            { y: 0, ease: Power2.easeIn, onComplete: this.onCoverComplete.bind(this) },
            'start+=.4'
          )
          .to(
            this.leftContainer,
            0.2,
            {
              y: -this.height,
              ease: Power2.easeIn,
              onStart: this.onLeftPillarStart.bind(this),
              onComplete: this.onLeftPillarComplete.bind(this)
            },
            'start+=.85'
          )
          .to(this.mid, 0.3, { x: '-50%', y: '200%', ease: Power2.easeIn }, 'start+=1.15')
          .to(
            this.rightContainer,
            0.3,
            { y: -this.height, ease: Power2.easeIn, onComplete: this.onComplete.bind(this) },
            'start+=1.35'
          );

        this.dispatchEvent(new CustomEvent('ready'));
      },
      enumerable: true
    },

    play: {
      value: function() {
        this.timeline.play();
      }
    },

    onComplete: {
      value: function() {
        this.dispatchEvent(new CustomEvent('complete'));
      }
    },

    onCoverComplete: {
      value: function() {
        this.dispatchEvent(new CustomEvent('coverComplete'));
      }
    },

    onLeftPillarComplete: {
      value: function() {
        this.dispatchEvent(new CustomEvent('leftPillarComplete'));
      }
    },

    onLeftPillarStart: {
      value: function() {
        this.dispatchEvent(new CustomEvent('leftPillarStart'));
      }
    },

    progress: {
      value: function(value, suppressEvents) {
        this.timeline.progress(value, suppressEvents);
        this.timeline.pause();
      }
    },

    preview: {
      value: function() {
        this.addEventListener('ready', this.play);
      }
    }
  });

  FlushedRibbonComponent.prototype.constructor = FlushedRibbonComponent;
  Object.setPrototypeOf(FlushedRibbonComponent, HTMLElement);
  customElements.define(COMPONENT_NAME, FlushedRibbonComponent);
})();
