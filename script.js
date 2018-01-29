  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  if (isFirefox) {
		slowAnimation();
	}

	document.onkeydown = function(e) {
		var code = e.which || e.keyCode;
		if (code >= 37 && code <= 40) {
			return false;
		}
	}
	
	function layout(){
		var documentWidth = window.innerWidth ||
                      document.documentElement.clientWidth ||
                      document.body.clientWidth ||
                      document.body.offsetWidth,
		header = document.getElementById('header'),
		logo = document.getElementById('logo'),
		glow = document.getElementById('glowWrap'),
		minWidth = 1000,
		maxWidth = 1300;
		
		logo.style.height = logo.offsetWidth/6.9444 + 'px';
		glow.style.height = glow.offsetWidth*1.016 + 'px';
		glow.style.bottom = -glow.offsetWidth/5 + 'px';
		
		//vertical
		if (documentWidth > maxWidth) {
			header.style.bottom = -(documentWidth-maxWidth)/3 + 'px';	
		}
		else if (documentWidth < maxWidth && documentWidth > minWidth){
			header.style.bottom = 0;
		}
		//horizontal
		else if (documentWidth < minWidth) {
			header.style.left = (documentWidth - minWidth)/2 + 'px';
		}
		if (documentWidth > minWidth) {
			header.style.left = 0;
		}
	}
	layout();
	window.onresize = layout;
	
	var slider = {
		main: document.getElementById('main'),
		navFull: document.getElementById('nav'),
		nav: document.getElementsByClassName('navBtn'),
		arrow: document.getElementById('arrow'),
		title: document.getElementById('title'),
		frontTrees: document.getElementById('frontTrees'),
		gradient: document.getElementById('gradient'),
		selectedNav: null,
		NumberofWorks: 5,
		mainTransitionTime: 1000,
		mainPos: 0,

		swiping: function swiping(){
			function move(){
				this.main.style.transform = 'translateY(' + this.mainPos + '%)';
				this.main.style.webkitTransform = 'translateY(' + this.mainPos + '%)';
			}
			move.apply(this);
			
			function highlightNav(){	
				for (var i=0; i<this.nav.length; i++) {
					this.nav[i].style.opacity = '0.4';
				}
				
				this.selectedNav = -this.mainPos/100;
				this.nav[this.selectedNav].style.opacity = '0.6';
			}
			highlightNav.apply(this);
		},	
		slideDown: function slideDown(){
			if (this.mainPos>-this.NumberofWorks*100) {
				this.mainPos -= 100;
				this.swiping();
				if (this.mainPos == -100) {
					this.introAnimation();
				}
			}
		},
		slideUp: function slideUp(){
			if (this.mainPos != 0) {
				this.mainPos += 100;
				this.swiping();
				if (this.mainPos == 0) {
					this.abortIntroAnimation();
				}
			}
		},
		introAnimation: function introAnimation(){
			this.frontTrees.classList.add('introAnimation');
			this.gradient.classList.add('introAnimation');	
			this.title.classList.add('hideTitle');
			this.navFull.style.opacity = 1;
			this.arrow.style.opacity = 0;
		},	
		abortIntroAnimation: function abortIntroAnimation(){
			this.frontTrees.classList.remove('introAnimation');
			this.gradient.classList.remove('introAnimation');
			this.title.classList.remove('hideTitle');
			this.navFull.style.opacity = 0;
			this.arrow.style.opacity = 0.8;
		},
		//events that trigger swiping:
		navigationMenu: function navigationMenu(){
			for (var i=0; i<this.nav.length; i++) {
				(function(i){
					slider.nav[i].addEventListener('click', function(){	
							slider.mainPos = -(i)*100;
							slider.swiping();

							if (slider.mainPos == 0) {
								slider.abortIntroAnimation();
							}
					});
				}(i));
			}
		},
		arrowButtons: function arrowButtons(){
			this.arrow.onclick = function(){
				slider.slideDown();
			}
		},	
		keyboardKeys: function keyboardKeys(){
			document.onkeyup = function(e){		
				e.preventDefault();
				var code = e.which || e.keyCode;

				if (code == 40) {
					slider.slideDown();
				}

				else if (code == 38) {
					slider.slideUp();
				}
			}
		},
		touch: function touch(){
			document.addEventListener('touchstart', handleTouchStart, false); 
			document.addEventListener('touchmove', handleTouchMove, false);
			var xDown = null;                                     
			var yDown = null;                                               
			function handleTouchStart(evt) {                     
				xDown = evt.touches[0].clientX;                             
				yDown = evt.touches[0].clientY;              
			};                                                
			function handleTouchMove(evt) {
				if ( ! xDown || ! yDown ) {
					return;
				}
			
				var xUp = evt.touches[0].clientX;                                    
				var yUp = evt.touches[0].clientY;
				var xDiff = xDown - xUp;
				var yDiff = yDown - yUp;
			
				if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
					if ( xDiff > 0 ) {
						/* left swipe */ 
					} else {
						/* right swipe */
					}                       
				} else {
					if ( yDiff > 0 ) {
						slider.slideDown();
					}
					else if ( yDiff < 0 ) {
						slider.slideUp();
					}                                                                 
				}
				/* reset values */
				xDown = null;
				yDown = null;                                             
			};
		},
		mouse: function mouse(){
			var pause = true; //pause before scrolling next with the wheel
			var supportsWheel = false; //the flag that determines whether the wheel event is supported.
			function wheelScroll (e) {
				/* Check whether the wheel event is supported. */
				if (e.type == "wheel") supportsWheel = true;
				else if (supportsWheel) return;
				//e.deltaY > 0 or < 0 determines directions
				if (pause) {
					if (e.deltaY > 0) {
						slider.slideDown();
					}
					if (e.deltaY < 0) {
						slider.slideUp();
					}
					pause = false;
					setTimeout(function(){
						pause = true;
					},slider.mainTransitionTime/4);
				}
			}
			document.addEventListener('wheel', wheelScroll);
			document.addEventListener('mousewheel', wheelScroll);
			document.addEventListener('DOMMouseScroll', wheelScroll);
		}
	}
	slider.navigationMenu();
	slider.arrowButtons();
	slider.keyboardKeys();
	slider.touch();
	slider.mouse();
	
	function slowAnimation(){
		var zoomin = document.getElementsByClassName('zoomin'),
			zoomout = document.getElementsByClassName('zoomout'),
			rotateSun = document.getElementsByClassName('rotateSun'),
			glow = document.getElementById('glowWrap').getElementsByTagName('img');
			
		document.getElementById('main').style.transition = 'transform 0.7s';
		document.getElementById('frontTrees').style.transition = 'transform 0.7s';
		document.getElementById('gradient').style.transition = 'transform 0.7s';
		
		for(var i=0; i<zoomin.length; i++){
			zoomin[i].classList.remove('zoomin');
		}
		for(var i=0; i<zoomout.length; i++){
			zoomout[i].classList.remove('zoomout');
		}
		rotateSun[0].classList.remove('rotateSun');
		glow[1].classList.remove('zoomin');
		glow[2].classList.remove('zoomout');
	}
