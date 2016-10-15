var NS = {
	SVG: "http://www.w3.org/2000/svg",
	xlink: "http://www.w3.org/1999/xlink"
};

var Bubbles = {
	bubbles: [],
	MAX_BUBBLES: 25,
	FRAME_DELAY: 50,

	init: function () {
		for (var i=0; i < Bubbles.MAX_BUBBLES; i++) {
			Bubbles.bubbles[i] = new Bubbles.Bubble();
		}
		
		setTimeout(Bubbles.step, Bubbles.FRAME_DELAY);
	},

	step: function () {
		Bubbles.bubbles.each(function (x) {
			x.step();
		});

		setTimeout(Bubbles.step, Bubbles.FRAME_DELAY);
	},

	Bubble: function () {

		this.randomize = function () {
			this.x = Math.random()*800;
			this.y = Math.random()*600;
			this.vx = Math.random() - 0.5;
			this.vx = this.vx * Math.abs(this.vx);

			this.size = 1.2 * Math.pow(Math.random(), 2) + 0.2;
			this.wobble_phase = Math.random() * 2 * 3.14159265;
			this.wobble_amount = Math.random() * 0.05;
		}	

		this.moveTo = function (x, y, wscale, hscale) {
			this.elem.transform.baseVal.clear();
			var trans=document.rootElement.createSVGTransform();
			trans.setTranslate(x, y);
			this.elem.transform.baseVal.appendItem(trans);

			var scale=document.rootElement.createSVGTransform();
			scale.setScale(wscale, hscale);
			this.elem.transform.baseVal.appendItem(scale);

			this.elem.transform.baseVal.consolidate();
		};


		this.step = function () {
			var speed = 50/(Bubbles.FRAME_DELAY * (this.size + 1));	//smaller bubbles animate faster
			var volumefactor = 1200.0 / (this.y + 1200.0);		//volume increases as the pressure decreases
			this.vx += speed * (0.05 * (Math.random()-0.5) - 0.01 * this.vx); //biased random walk in x velocity
			this.x += this.vx * 1.5;
			this.y -= speed * volumefactor;				//velocity is modified by the volume (displacement)
			if (this.y < -50*this.size)
			{
				this.randomize();
				this.y = 600 + 50*this.size;
			}
			this.wobble_phase += 0.2 * speed;
			var wobble = 1 + this.wobble_amount * Math.sin(this.wobble_phase);
			this.moveTo(this.x, this.y, this.size * Math.pow(volumefactor, 0.33) * wobble, this.size * Math.pow(volumefactor, 0.33) / wobble); //dimension is the cube root of the volume
		};

		this.randomize();
		this.elem = $(document.createElementNS(NS.SVG, 'use'));
		this.elem.setAttributeNS(NS.xlink, 'href', '#bubble');
	
		document.rootElement.appendChild(this.elem);
	}
};

Event.observe(window, 'load', Bubbles.init);

