/**
 * name: fSlider
 * version: 0.0.1
 * desc: jQuery plugin,
 * A very simple slider, easy to install, easy to use.
 *
 * Author: Frédéric Faltin <f@ffaltin.com>
 * License: GPLv3
 */
(function($) {
	$.fn.fSlider = function(params) {
		params = $.extend({
			current: 0,
			slideClass: 'fslide',
			autoSlide: true,
			time: 5000,
			bottomControls: true,
			onInit: function(){},
			onComplete: function(){}
		},params);
		this.children().addClass(params.slideClass);
		var 
			// get the ClassName
			slides = $('.'+params.slideClass),
			// get the width of each slide
			slideWidth= slides.width(),
			// nbre of slides
			numberOfSlides= slides.length,
			// globalize
			$this = this,
			setTimer
		;
		$this.currentPosition = params.current;
		$this.previousPosition = params.current;
		// add slides into the global slider
		slides.wrapAll('<section id="slidesContainer" />');
		$('#slidesContainer').css('overflow', 'hidden').after('<nav id="fControls" />');
		slides.wrapAll('<section id="slideInner"></section>')
			.css({
			'float' : 'left',
			'width' : slideWidth
			})
			.each(function(i){
				if (params.bottomControls) {
					$('<a href="#'+i+'" class="'+(i==$this.currentPosition?'current':'')+'"><span>'+i+'</span></a>').appendTo('#fControls');
				}
			})
		;
		// style the globalSlider
		$('#slideInner').css('width', slideWidth * numberOfSlides);
		// 
		if (params.bottomControls) {
			$('#fControls a')
				.on('click', function(e){
					e.preventDefault();
					// kill the timeout
					clearTimeout(setTimer);
					// init motion with the callbacks before and complete
					init($(this).index());
				})
			;
		}
		// prevent and kill timeout when you click on the slide
		slides.on({
			click: function(){
				// kill timeout
				clearTimeout(setTimer);
			}
		});
		// init motion, it provides the motion and callbacks
		function init(index) {
			$('#fControls a').removeClass('current');
			$('#fControls a:nth-child('+(index+1)+')').addClass('current');
			$this.previousPosition = $this.currentPosition;
			$this.currentPosition = index;
			params.onInit.call();
			$('#slideInner').animate({
				'marginLeft' : slideWidth*(-$this.currentPosition)
			},function(){
				params.onComplete.call();
				// reload the time from the beginning
				$this.nextSlide();
			});
		}
		// change to the next Slide
		$this.nextSlide = function(time) {
			// timerize
			setTimer = setTimeout(function(){
				// if we are on the last position, rewind to the first, else, go next
				init(($this.currentPosition == numberOfSlides-1)?0:$this.currentPosition+1);
			},time || params.time);
		}
		$this.killTimer = function(){
			clearTimeout(setTimer);
		}
		// go to the currntPosition
		if ($this.currentPosition != 0) {
			init($this.currentPosition);
		}
		if (params.autoSlide) {
			// init autoslide
			$this.nextSlide();
		}
		// do the jquery chain
		return $this;
	};
})(jQuery);