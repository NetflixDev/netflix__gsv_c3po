
/* wc-netflix-brand-logo:NetflixLogoComponent.js, VERSION: 6.0.0, Published: 2019/09/10 17:37:26 $*/
/* wc-netflix-brand-logo:NetflixLogoComponent__759f.js, VERSION: 3.0.4, Published: 2018/07/05 10:23:05 $*/
!(function() {
	var COMPONENT_NAME = 'netflix-brand-logo'
	var svg

	function createGradient(svg, id, stops, p) {
		var isGradient = false
		var svgNS = svg.namespaceURI
		var s = []

		if (id.indexOf('url(') > -1) {
			isGradient = true
		}
		id = id.replace('url(#', '').replace(')', '')

		if (isGradient) {
			var grad = document.createElementNS(svgNS, 'linearGradient')
			grad.setAttribute('id', id)
			grad.setAttribute('gradientUnits', 'userSpaceOnUse')
			grad.setAttribute('spreadMethod', 'pad')
			grad.setAttribute('x1', p.x1 || 0)
			grad.setAttribute('y1', p.y1 || 0)
			grad.setAttribute('x2', p.x2 || 0)
			grad.setAttribute('y2', p.y2 || 0)
		}

		for (var i = 0; i < stops.length; i++) {
			var attrs = stops[i]
			var stop = document.createElementNS(svgNS, 'stop')
			for (var attr in attrs) {
				if (attrs.hasOwnProperty(attr)) stop.setAttribute(attr, attrs[attr])
			}
			if (isGradient) grad.appendChild(stop)
			s.push(stop)
		}

		if (isGradient) {
			var defs = svg.querySelector('defs') || svg.insertBefore(document.createElementNS(svgNS, 'defs'), svg.firstChild)
			defs.appendChild(grad)
		}

		return s
	}

	function drawPath(path, fill, gradient) {
		var p = document.createElementNS('http://www.w3.org/2000/svg', 'path')

		p.setAttributeNS(null, 'd', path)
		p.setAttribute('fill', fill)

		if (gradient) {
			var stops = []
			stops.push({ offset: '0%', 'stop-color': gradient.stop1 || '#B60009' })
			if (gradient.stop3) {
				stops.push({ offset: '50%', 'stop-color': gradient.stop2 || '#540001' })
				stops.push({ offset: '100%', 'stop-color': gradient.stop3 || '#B60009' })
			} else {
				stops.push({ offset: '100%', 'stop-color': gradient.stop2 || '#540001' })
			}
			p.gradient = createGradient(svg, fill, stops, gradient)
		}
		return p
	}

	;(function() {
		var LogoComponent = function() {
			var self = Utils.reflectConstruct(HTMLElement, [], this.constructor)
			self._attached = false
			self._hasInited = false
			return self
		}

		LogoComponent.prototype = Object.create(HTMLElement.prototype)

		/* 
    Component methods defined individually on prototype instead of passing in a properties object
    to the Object.create function to avoid an issue with uploading to DoubleClick

    When using the properties object to define the component prototype and use of "undefined" in any
    of its methods, "undefined" gets transformed to "void 0" by some compilers to save space

    However, DoubleClick rejects bundled JS due to how some compilers transform the properties object-based
    prototype definition when "void 0" appears in it. So defining prototype methods individually prevents
    this upload issue
    */

		LogoComponent.prototype.disconnectedCallback = function() {
			this._attached = false
		}

		LogoComponent.prototype.connectedCallback = function() {
			this._attached = true

			if (this._hasInited) {
				return
			}

			this._hasInited = true

			var comps = document.querySelectorAll(COMPONENT_NAME)

			for (var i = 0; i < comps.length; i++) {
				if (typeof comps[i].uid === undefined) {
					comps[i].uid = i
				} else {
					continue
				}
			}

			Utils.createStyle.call(
				this,
				COMPONENT_NAME,
				'',
				'position:absolute;  pointer-events:none;',
				'svg',
				'-webkit-backface-visibility:hidden;backface-visibility:hidden;-webkit-transform-origin:top left;transform-origin:top left;'
			)

			this.lowBranding = this.hasAttribute('lowBranding') || false
			this.color = this.getAttribute('color') || '#E50914'
			this.animDuration = this.getAttribute('duration') || 1.375
			svg = this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
			this.svg.setAttribute('width', '936px')
			this.svg.setAttribute('height', '254px')
			this.svg.setAttribute('viewBox', '0 0 936 254')

			this.resize()

			if (this.lowBranding) {
				this.n_leftShape = drawPath('M 45 2 L 0 2 0 235 Q 17 231 45 232 L 45 2 Z', 'url(#n_leftGrad' + this.uid + ')', {
					x1: '-48',
					y1: '-141',
					x2: '-38',
					y2: '-144'
				})
				this.n_leftShape.to = 'M 37 2 L 0 2 0 254 Q 19 251 40 249 L 37 2 Z'

				this.n_rightShape = drawPath('M 127 2 L 83 2 83 219 127 235 127 2 Z', 'url(#n_rightGrad' + this.uid + ')', {
					x1: '104',
					y1: '140',
					x2: '84',
					y2: '146'
				})
				this.n_rightShape.to = 'M 128 2 L 90 2 89 242 128 238 129 2 Z'
			} else {
				this.n_leftShape = drawPath('M 45 2 L 0 2 0 235 Q 17 231 45 232 L 45 2 Z', this.color, {
					x1: '-48',
					y1: '-141',
					x2: '-38',
					y2: '-144'
				})
				this.n_leftShape.to = 'M 37 2 L 0 2 0 254 Q 19 251 40 249 L 37 2 Z'

				this.n_rightShape = drawPath('M 127 2 L 83 2 83 219 127 235 127 2 Z', this.color, {
					x1: '104',
					y1: '140',
					x2: '84',
					y2: '146'
				})
				this.n_rightShape.to = 'M 128 2 L 90 2 89 242 128 238 129 2 Z'
			}

			//Define svg shapes
			// N

			this.n_midShape = drawPath('M 45 2 L 0 2 81 232 Q 110 231 127 236 L 45 2 Z', this.color)
			this.n_midShape.to = 'M 37 2 L 0 2 85 243 123 239 37 2 Z'

			//E
			this.e_topShape = drawPath('M 274 41 L 274 1 167 1 167 41 274 41 Z', this.color)
			this.e_topShape.to = 'M 167 41 L 167 1 167 1 167 41 167 41 Z'

			this.e_mainShape = drawPath('M 206 3 L 167 3 167 227 206 227 206 3 Z', this.color, {
				x1: '190',
				y1: '65',
				x2: '190',
				y2: '24',
				stop1: this.color
			})
			this.e_mainShape.to = 'M 206 3 L 206 3 167 3 167 3 206 3 Z'

			this.e_bottomShape = drawPath('M 274 186 L 167 188 167 227 274 225 274 186 Z', this.color, {
				x1: '232',
				y1: '204',
				x2: '197',
				y2: '205',
				stop1: this.color
			})
			this.e_bottomShape.to = 'M 167 188 L 167 188 167 227 167 227 167 188 Z'

			this.e_midShape = drawPath('M 182 134 L 257 134 257 94 182 94 182 134 Z', this.color)
			this.e_midShape.to = 'M 182 94 L 182 94 182 134 182 134 182 94 Z'

			//T
			this.t_midShape = drawPath('M 381 8 L 341 8 341 224 381 222 381 8 Z', this.color, {
				x1: '366',
				y1: '69',
				x2: '366',
				y2: '29',
				stop1: this.color
			})
			this.t_midShape.to = 'M 381 8 L 381 8 341 8 341 8 381 8 Z'

			this.t_topShape = drawPath('M 423 41 L 423 1 300 1 300 41 423 41 Z', this.color)
			this.t_topShape.to = 'M 300 41 L 300 1 300 1 300 41 300 41 '

			//F
			this.f_topShape = drawPath('M 558 41 L 558 1 448 1 448 41 558 41 Z', this.color)
			this.f_topShape.to = 'M 448 41 L 448 1 448 1 448 41 448 41 Z'

			this.f_midShape = drawPath('M 541 132 L 541 92 466 92 466 132 541 132 Z', this.color)
			this.f_midShape.to = 'M 466 132 L 466 92 466 92 466 132 466 132 Z'

			this.f_mainShape = drawPath('M 488 18 L 448 18 448 222 488 222 488 18 Z', this.color, {
				x1: '472',
				y1: '69',
				x2: '472',
				y2: '28',
				stop1: this.color
			})
			this.f_mainShape.to = 'M 488 18 L 448 18 448 18 488 18 488 18 Z'

			//L
			this.l_bottomShape = drawPath('M 691 231 L 691 192 584 184 584 223 691 231 Z', this.color)
			this.l_bottomShape.to = 'M 584.1 223.1 L 584.1 184.1 584 184 584 223 584.1 223.1 Z'
			this.l_mainShape = drawPath('M 624 0 L 584 0 584 223 624 223 624 0 Z', this.color, {
				x1: '599',
				y1: '158',
				x2: '599',
				y2: '201',
				stop1: this.color
			})
			this.l_mainShape.to = 'M 624 0 L 584 0 584 0 624 0 624 0 Z'

			//I
			this.i_mainShape = drawPath('M 763 0 L 723 0 723 230 763 233 763 0 Z', this.color)
			this.i_mainShape.to = 'M 763 0 L 723 0 723 0 763 0 763 0 Z'

			//X
			this.x_frontShape = drawPath('M 791 236 L 791 236 831 241 831 241 791 236 Z', this.color)
			this.x_frontShape.to = 'M 935 1 L 893 1 791 236 831 241 935 1 Z'

			this.x_backShape = drawPath('M 891 248 L 934 254 837 0 794 0 891 248 Z', this.color, {
				x1: '946',
				y1: '-104',
				x2: '1011',
				y2: '-64',
				stop1: this.color
			})
			this.x_backShape.to = 'M 827 0 L 784 0 791 0 833 0 827 0 Z'

			var arr = [
				'n_leftShape',
				'n_rightShape',
				'n_midShape',
				'e_bottomShape',
				'e_midShape',
				'e_mainShape',
				'e_topShape',
				't_midShape',
				't_topShape',
				'f_midShape',
				'f_mainShape',
				'f_topShape',
				'l_mainShape',
				'l_bottomShape',
				'i_mainShape',
				'x_backShape',
				'x_frontShape'
			]

			for (var i = 0; i < arr.length; i++) {
				this.svg.appendChild(this[arr[i]])
			}

			this.appendChild(this.svg)

			function forceRerendering() {
				var points = [0.3, 0.45, 0.6, 0.75, 0.9, 0.98]
				points.forEach(
					function(time, index) {
						TweenLite.delayedCall(
							time * this.animDuration,
							function() {
								var r = index % 2 ? 0.01 : 0
								TweenLite.set(this, { rotation: r })
							}.bind(this)
						)
					}.bind(this)
				)
			}

			// Create SVG animation timeline
			this.timeline = new TimelineMax({
				paused: true,
				onComplete: this.onPlayComplete.bind(this),
				onStart: forceRerendering.bind(this),
				onReverseComplete: this.onReverseComplete.bind(this)
			})

			var left = Number(window.getComputedStyle(this, 'left').left.replace('px', ''))
			this.timeline
				.add('start')
				.to(this.n_leftShape, 1.3, { morphSVG: this.n_leftShape.to, ease: Quad.easeOut }, 'start+=.2')
				.to(this.n_leftShape.gradient, 1.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.2')
				.to(this.n_rightShape, 1.3, { morphSVG: this.n_rightShape.to, ease: Quad.easeOut }, 'start+=.2')
				.to(this.n_rightShape.gradient, 1.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.2')
				.to(this.n_midShape, 1.3, { morphSVG: this.n_midShape.to, ease: Quad.easeOut }, 'start+=.2')
				.fromTo(this.e_topShape, 0.15, { morphSVG: this.e_topShape.to }, { morphSVG: this.e_topShape, ease: Quad.easeOut }, 'start+=.425')
				.fromTo(this.e_mainShape, 0.15, { morphSVG: this.e_mainShape.to }, { morphSVG: this.e_mainShape, ease: Quad.easeOut }, 'start+=.45')
				.to(this.e_mainShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.6')
				.fromTo(this.e_midShape, 0.15, { morphSVG: this.e_midShape.to }, { morphSVG: this.e_midShape, ease: Quad.easeOut }, 'start+=.55')
				.fromTo(
					this.e_bottomShape,
					0.15,
					{ morphSVG: this.e_bottomShape.to },
					{ morphSVG: this.e_bottomShape.to, ease: Quad.easeOut },
					'start+=.575'
				)
				.to(this.e_bottomShape, 0.15, { morphSVG: 'M 274 187 L 167 194 167 233 274 226 274 187 Z', ease: Quad.easeOut }, 'start+=.585')
				.to(this.e_bottomShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.595')
				.fromTo(this.t_topShape, 0.15, { morphSVG: this.t_topShape.to }, { morphSVG: this.t_topShape, ease: Quad.easeOut }, 'start+=.575')
				.fromTo(this.t_midShape, 0.15, { morphSVG: this.t_midShape.to }, { morphSVG: this.t_midShape, ease: Quad.easeOut }, 'start+=.6')
				.to(this.t_midShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.75')
				.fromTo(this.f_topShape, 0.15, { morphSVG: this.f_topShape.to }, { morphSVG: this.f_topShape, ease: Quad.easeOut }, 'start+=.625')
				.fromTo(this.f_mainShape, 0.2, { morphSVG: this.f_mainShape.to }, { morphSVG: this.f_mainShape, ease: Quad.easeOut }, 'start+=.675')
				.fromTo(this.f_midShape, 0.15, { morphSVG: this.f_midShape.to }, { morphSVG: this.f_midShape, ease: Quad.easeOut }, 'start+=.775')
				.to(this.f_mainShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=.9')
				.fromTo(
					this.l_mainShape,
					0.15,
					{ morphSVG: this.l_mainShape.to },
					{ morphSVG: this.l_mainShape, ease: Quad.easeOut },
					'start+=.725'
				)
				.fromTo(
					this.l_bottomShape,
					0.15,
					{ morphSVG: this.l_bottomShape.to },
					{ morphSVG: this.l_bottomShape, ease: Quad.easeOut },
					'start+=.85'
				)
				.to(this.l_bottomShape, 0.3, { morphSVG: 'M 691 228 L 691 189 584 184 584 223 691 228 Z', ease: Quad.easeOut }, 'start+=1')
				.to(this.l_mainShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=1.025')
				.fromTo(
					this.i_mainShape,
					0.15,
					{ morphSVG: this.i_mainShape.to },
					{ morphSVG: this.i_mainShape, ease: Quad.easeOut },
					'start+=.875'
				)
				.fromTo(
					this.x_backShape,
					0.3,
					{ morphSVG: this.x_backShape.to },
					{ morphSVG: { shape: this.x_backShape, shapeIndex: 2 }, ease: Quad.easeOut },
					'start+=.925'
				)
				.to(
					this.x_frontShape,
					0.3,
					{ morphSVG: { shape: 'M 935 1 L 893 1 790 237 831 241 935 1 Z', shapeIndex: 3 }, ease: Quad.easeOut },
					'start+=1.025'
				)
				.to(this.x_backShape.gradient, 0.3, { stopColor: this.color, ease: Linear.easeNone }, 'start+=1.025')

			this.dispatchEvent(new CustomEvent('ready'))
		}

		LogoComponent.prototype.attributeChangedCallback = function() {
			var width = this.getAttribute('width')
			width = parseInt(width, 10)

			if (this.size && this.size.w !== width) {
				this.resize()
			}
		}

		LogoComponent.prototype.resize = function(s) {
			var width
			var height
			var scale

			if (s) {
				width = s.w
				height = s.h
				scale = width / 936
			} else {
				if (this.lowBranding) {
					width = Number(this.getAttribute('width') || this.offsetWidth || 100)
					height = Number((254 / 127) * width)
					scale = width / 127
				} else {
					width = Number(this.getAttribute('width') || this.offsetWidth || 100)
					height = Number((254 / 936) * width)
					scale = width / 936
				}
			}

			this.size = { w: width, h: height }

			TweenLite.set(this, { width: width, height: height })
			this.svg.setAttribute('style', 'transform: scale(' + scale + ');' + '-webkit-transform: scale(' + scale + ');')
		}

		LogoComponent.prototype.play = function() {
			if (!this.lowBranding) this.timeline.duration(this.animDuration).play()
		}

		LogoComponent.prototype.reset = function() {
			if (!this.lowBranding) this.timeline.seek(0)
		}

		LogoComponent.prototype.reverse = function() {
			if (!this.lowBranding) {
				var currentState = 'visible'
				var stylesheet = document.getElementById('netflix-brand-logo-component-stylesheet')

				this.timeline.eventCallback('onUpdate', function() {
					if (stylesheet) stylesheet.innerHTML = ''
					currentState = currentState === 'visible' ? 'hidden' : 'visible'
					Utils.createStyle.call(
						this,
						COMPONENT_NAME,
						'',
						'position:absolute;  pointer-events:none;',
						'svg',
						'-webkit-backface-visibility:' +
							currentState +
							';backface-visibility:' +
							currentState +
							';-webkit-transform-origin:top left;transform-origin:top left;'
					)
				})

				this.timeline.reverse()
			}
		}

		LogoComponent.prototype.progress = function(t) {
			if (!this.lowBranding) {
				this.timeline.progress(t)
				this.timeline.pause()
			}
		}

		LogoComponent.prototype.onPlayComplete = function() {
			this.dispatchEvent(new CustomEvent('playComplete'))
		}

		LogoComponent.prototype.onReverseComplete = function() {
			this.dispatchEvent(new CustomEvent('reverseComplete'))
		}

		LogoComponent.prototype.preview = function() {
			// this.play();
			this.addEventListener(
				'ready',
				function() {
					this.play()
					setTimeout(this.reverse.bind(this), 3000)
				}.bind(this)
			)
		}

		LogoComponent.prototype.constructor = LogoComponent
		Object.setPrototypeOf(LogoComponent, HTMLElement)
		customElements.define(COMPONENT_NAME, LogoComponent)
	})()
})()
