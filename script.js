function loadImg(src){
  var img = new Image();
  img.src = src;
  return img;
}

var headerImgs = [
  loadImg('assets/imgs/1.svg'),
  loadImg('assets/imgs/2.svg'),
  loadImg('assets/imgs/3.svg'),
  loadImg('assets/imgs/glow1.svg'),
  loadImg('assets/imgs/glow2.svg'),
  loadImg('assets/imgs/glow3.svg'),
  loadImg('assets/imgs/glow4.svg'),
  loadImg('assets/imgs/glow5.svg')
]
var headerImgsLoaded = [];

var portfolioImgs = [
  loadImg('case-studies/cosmicchat/assets/poster.jpg'),
  loadImg('case-studies/tinyearth/assets/poster.jpg'),
  loadImg('case-studies/anxietycatalogue/assets/poster.jpg'),
  loadImg('case-studies/brightnet/assets/poster.jpg'),
  loadImg('case-studies/perennial/assets/poster.jpg'),
  loadImg('case-studies/soundbox/assets/poster.jpg'),
  loadImg('case-studies/sonata/assets/poster.jpg'),
  loadImg('case-studies/forrestenchanter/assets/poster.jpg')
]

var hammer = new Hammer(document.body);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

var canvasON = true;

class Slider {
  constructor(){
    this.slide = -1;
    this.slides = document.querySelectorAll('.slide');
    this.titles = document.querySelectorAll('.title');
    this.nav = document.querySelector('#nav');
    this.header = document.querySelector('#header');
    this.about = document.querySelector('#about');
    this.aboutButton = document.querySelector('#aboutButton');

    var that = this;
    this.slides.forEach(function(slide){
      var div = document.createElement('div');
      that.nav.appendChild(div);
    });
    this.navButtons = this.nav.querySelectorAll('div');

    this.input();
  }
  selectNav(slide){
    this.navButtons[slide].classList.add('selectedNav');
  }
  unselectNav(slide){
    this.navButtons[slide].classList.remove('selectedNav');
  }
  hideSlide(slide){
    this.slides[slide].classList.remove('showSlide');
    portfolioPosters[slide].active = false;
    this.titles[slide].style.display = 'none';
    this.unselectNav(slide);
  }
  showSlide(slide){
    this.slides[slide].classList.add('showSlide');
    portfolioPosters[slide].active = true;
    this.titles[slide].style.display = 'block';
    this.selectNav(slide);
  }
  slideDown(){
    if(this.slide==this.slides.length-1) return;

    if(this.slide>-1) this.hideSlide(this.slide);
    this.slide++;

    if(this.slide==0){
      this.header.style.opacity = 0;
      this.nav.classList.add('showNav');

      trees1.rollCurtain = 0;
      trees2.rollCurtain = 0;
      trees3.rollCurtain = 0;

      curtain.show();
    }

    if(this.slide==-1){
      this.header.style.opacity = 1;
      this.about.style.opacity = 0;
      this.about.style.zIndex = 1;

      trees1.rollCurtain = 1;
      trees2.rollCurtain = 1;
      trees3.rollCurtain = 1;
    }


    if(this.slide<0){
      return;
    } else if(this.slide==0){
      var that = this;
      that.showSlide(that.slide);
    } else {
      this.showSlide(this.slide);
    }
  }
  slideUp(){
    if(this.slide<-1) return;

    if(this.slide>-1) this.hideSlide(this.slide);
    this.slide--;

    if(this.slide==-1){
      this.header.style.opacity = 1;
      this.nav.classList.remove('showNav');

      trees1.rollCurtain = 1;
      trees2.rollCurtain = 1;
      trees3.rollCurtain = 1;

      curtain.hide();
    }

    if(this.slide==-2){
      this.header.style.opacity = 0;
      this.about.style.opacity = 1
      this.about.style.zIndex = 3;

      trees1.rollCurtain = 2;
      trees2.rollCurtain = 2;
      trees3.rollCurtain = 2;
    }

    if(this.slide>-1) this.showSlide(this.slide);
  }
  input(){
    var that = this;

    this.aboutButton.addEventListener('click', function(){
      that.slideUp();
    });

    document.addEventListener('keyup', function(e){
      var keyCode = e.keyCode;
      if(keyCode==38){
        that.slideUp();
      }
      if(keyCode==40){
        that.slideDown();
      }
    });

    hammer.on('swipeup', function(e){
      that.slideDown();
    });
    hammer.on('swipedown', function(e){
      that.slideUp();
    });

    var throttle = 750;
    var time = -1;

    window.addEventListener('wheel', function(e){
      var now = Date.now();
      if (time !== -1 && now - time < throttle) return;
      time = now;

      if (event.deltaY<0){
        that.slideUp();
      } else if (e.deltaY>0){
        that.slideDown();
      }
    });

    for(var i=0; i<this.navButtons.length; i++){
      (function(i){
        that.navButtons[i].addEventListener('click', function(){
          that.hideSlide(that.slide);
          that.slide = i;
          that.showSlide(that.slide);
        });
      })(i);
    }
  }
}
var slider = new Slider();

/* header */

//canvas
function lerp(start, end, amt){
  return (1-amt)*start+amt*end
}

var minWidth = 1000;
var allComponents = [];
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

function resizeCanvas(){
  if(window.innerWidth<minWidth){
    canvas.width = minWidth;
  } else {
    canvas.width = window.innerWidth;
  }
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', function(){
  resizeCanvas();
  for(var i=0; i<allComponents.length; i++){
    allComponents[i].resize();
  }
});

var mouseX = 0;
window.addEventListener('mousemove', function(e){
  mouseX = e.clientX-window.innerWidth/2;
});

class BackgroundBox {
  constructor(color){
    allComponents.push(this);
    this.color = color;
    this.y = canvas.height;
  }
  resize(){
    this.y = canvas.height;
  }
  update(){
    this.y = trees1.y+trees1.h;
  }
  draw(){
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.y, canvas.width, canvas.height-this.y);
    ctx.restore();
  }
}

class Curtain {
  constructor(color){
    allComponents.push(this);
    this.color = color;
    this.w = canvas.width;
    this.h = canvas.height;

    this.points = [
      {x: -this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: this.w, y: 0},
      {x: -this.w, y: 0},
      {x: -this.w, y: this.h}
    ]
  }
  resize(){
    this.w = canvas.width;
    this.h = canvas.height;

    this.points = [
      {x: -this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: this.w, y: 0},
      {x: -this.w, y: 0},
      {x: -this.w, y: this.h}
    ]
  }
  hide(){
    this.update = function(){
      this.points[2].y = lerp(this.points[2].y, this.h, 0.1);
      this.points[3].y = lerp(this.points[3].y, this.h, 0.05);
    }
  }
  show(){
    this.update = function(){
      this.points[2].y = lerp(this.points[2].y, 0, 0.1);
      this.points[3].y = lerp(this.points[3].y, 0, 0.05);
    }
  }
  update(){
  }
  draw(){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    for(var i=0; i<this.points.length; i++){
      if(i==0){
        ctx.moveTo(this.points[i].x, this.points[i].y);
      } else {
        ctx.lineTo(this.points[i].x, this.points[i].y);
      }
    }
    ctx.fill();
    ctx.restore();
  }
}

class Element {
  constructor(img, x, y, w, z){
    this.img = img;
    this.xPer = x;
    this.yPer = y;
    this.wPer = w;
    this.x = 0;
    this.targetX = 0;
    this.y = 0;
    this.initialY = 0;
    this.hidingY = 0;
    this.w = 0;
    this.h = 0;
    this.z = z;
    var that = this;
    allComponents.push(this);
    this.img.onload = function(){
      that.ratio = that.img.width/that.img.height;
      that.resize();
      headerImgsLoaded.push(true);
      if(headerImgsLoaded.length==headerImgs.length){
        curtain.hide();
      }
    }
  }
  resize(){
    this.w = canvas.width*this.wPer;
    this.h = this.w/this.ratio;
    this.x = canvas.width*this.xPer;
    this.y = canvas.height-this.h-canvas.width*this.yPer;
    this.initialY = this.y;
    this.hidingY = 0-this.h*1.15;
  }
  followMouse(){
    if(this.targetX == mouseX) return;
    this.targetX = lerp(this.targetX, mouseX/this.z, 0.03);
  }
}

class Glow extends Element {
  constructor(img, x, y, w, z, direction){
    super(img, x, y, w, z);
    this.direction = direction;
    this.rotate = 0;
  }
  update(){
    if(!canvasON) return;
    //following the mouse
    this.followMouse();
    //rotation
    if(this.direction==0) this.rotate +=0.003;
    else this.rotate -=0.003;
  }
  draw(){
    ctx.save();
    ctx.translate((this.x+this.targetX)+this.w/2, this.y+this.h/2);
    ctx.rotate(this.rotate);
    ctx.translate(-(this.x+this.targetX)-this.w/2, -this.y-this.h/2);
    ctx.drawImage(this.img, this.x+this.targetX, this.y, this.w, this.h);
    ctx.restore();
  }
}

class Tree extends Element {
  constructor(img, x, y, w, z){
    super(img, x, y, w, z);
    this.opacity = 1;
    this.rollCurtain = 1;
  }
  scaleAnimation(direction){
    this.scaletype = 0;
    if(direction == 0) this.scale = 1;
    else this.scale = 1.15;
  }
  update(){
    if(this.rollCurtain==0){ //into slides
      this.y = lerp(this.y, this.hidingY, 0.3/this.z);
    } else if(this.rollCurtain==1){ //back to initial
      this.y = lerp(this.y, this.initialY, 0.6/this.z);
    } else if(this.rollCurtain==2){
      this.y = lerp(this.y, canvas.height, 0.3/this.z);
    }

    if(!canvasON) return;
    //following the mouse
    this.followMouse();
    //animation
    if(this.scaletype==0){
      this.scale +=0.0005;
    } else {
      this.scale -=0.0005;
    }
    if(this.scale >= 1.15){
      this.scaletype=1;
    } else if(this.scale<=1){
      this.scaletype=0;
    }
  }
  draw(){
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(canvas.width/2, this.y+this.h/2);
    ctx.scale(this.scale, this.scale);
    ctx.translate(-canvas.width/2, -this.y-this.h/2);
    ctx.drawImage(this.img, this.x+this.targetX, this.y, this.w, this.h);
    ctx.restore();
  }
}

class PortfolioPoster {
  constructor(container, img){
    this.container = container;
    this.active = false;
    this.canvas = this.container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.img = img;

    var that = this;
    this.img.onload = function(){
      that.img.aspectRatio = that.img.width/that.img.height;
      that.resize();
      allComponents.push(that);
    }

    this.mouseHovering = false;
    this.input();
  }
  resize(){
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.x = this.w/2;
    this.y = this.h/2;

    if(window.innerWidth<=800){
      this.imgH = this.h;
      this.imgW = this.h*this.img.aspectRatio;
      this.imgX = -(this.imgW-this.w)/2;
    } else {
      this.imgH = this.h;
      this.imgW = this.w;
      this.imgX = 0;
    }

    this.initialPoints = [
      {x: -this.w/2, y: this.h/2},
      {x: this.w/2, y: this.h/2},
      {x: this.w/2, y: -this.h/2},
      {x: -this.w/2, y: -this.h/2},
      {x: -this.w/2, y: this.h/2}
    ]

    this.points = [
      {x: -this.w/2, y: this.h/2},
      {x: this.w/2, y: this.h/2},
      {x: this.w/2, y: this.h/2},
      {x: -this.w/2, y: this.h/2},
      {x: -this.w/2, y: this.h/2}
    ]
  }
  input(){
    var that = this;
    window.addEventListener('resize', function(){
      that.resize();
    });
    this.container.addEventListener('mousemove', function(){
      that.mouseHovering = true;
    });
    this.container.addEventListener('mouseout', function(){
      that.mouseHovering = false;
    });
  }
  hide(){
    this.points[0].y = lerp(this.points[0].y, 0, 0.3);
    this.points[1].y = lerp(this.points[1].y, 0, 0.7);
    this.points[2].y = lerp(this.points[2].y, 0, 0.7);
    this.points[3].y = lerp(this.points[3].y, 0, 0.3);
    this.points[4].y = lerp(this.points[4].y, 0, 0.3);
  }
  show(){
    this.points[0].y = lerp(this.points[0].y, this.initialPoints[0].y, 0.1);
    this.points[1].y = lerp(this.points[1].y, this.initialPoints[1].y, 0.05);
    this.points[2].y = lerp(this.points[2].y, this.initialPoints[2].y, 0.1);
    this.points[3].y = lerp(this.points[3].y, this.initialPoints[3].y, 0.05);
    this.points[4].y = lerp(this.points[4].y, this.initialPoints[4].y, 0.1);
  }
  resetAllPoints(){
    for(var i=0; i<this.initialPoints.length; i++){
      this.points[i].x = lerp(this.points[i].x, this.initialPoints[i].x, 0.1);
      this.points[i].y = lerp(this.points[i].y, this.initialPoints[i].y, 0.05);
    }
  }
  onHover(){
    this.points[0].y = lerp(this.points[0].y, this.initialPoints[0].y-60, 0.08);
    this.points[1].y = lerp(this.points[1].y, this.initialPoints[1].y-60, 0.08);
    this.points[2].y = lerp(this.points[2].y, this.initialPoints[2].y+60, 0.08);
    this.points[3].y = lerp(this.points[3].y, this.initialPoints[3].y+60, 0.08);
    this.points[4].y = this.points[0].y;
  }
  update(){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if(this.active){
      if(this.mouseHovering){
        this.onHover();
      } else {
        this.show();
      }
    } else {
      this.hide();
    }
  }
  draw(){
    this.ctx.save();
    this.ctx.beginPath();
    for(var i=0; i<this.points.length; i++){
      if(i==0){
        this.ctx.moveTo(this.x+this.points[i].x, this.y+this.points[i].y);
      } else {
        this.ctx.lineTo(this.x+this.points[i].x, this.y+this.points[i].y);
      }
    }
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(this.img, this.imgX, 0, this.imgW, this.imgH);
    this.ctx.restore();
  }
}


var glow5 = new Glow(headerImgs[7], -0.5, -0.3, 1.3, 10, 0);
var glow4 = new Glow(headerImgs[6], 0.05, -0.1, 0.85, 10, 1);
var glow3 = new Glow(headerImgs[5], 0, -0.2, 0.95, 10, 0);
var glow2 = new Glow(headerImgs[4], 0.2, 0.05, 0.5, 10, 1);
var glow1 = new Glow(headerImgs[3], 0.25, 0.13, 0.4, 10, 0);
var trees3 = new Tree(headerImgs[2], -0.1, 0, 1.2, 8);
var trees2 = new Tree(headerImgs[1], -0.1, 0, 1.2, 6);
var trees1 = new Tree(headerImgs[0], -0.1, 0, 1.2, 4);
var backgroundBox = new BackgroundBox('#720e5f');

trees1.scaleAnimation(0);
trees2.scaleAnimation(1);
trees3.scaleAnimation(0);

var curtain = new Curtain('#25051f');

var portfolioPosters = [];
var posters = document.querySelectorAll('.poster');
for(var i=0; i<posters.length; i++){
  portfolioPosters.push(
    new PortfolioPoster(posters[i], portfolioImgs[i])
  );
}

//var highlighter = new Highlighter();

var loop = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  allComponents.forEach(function(component){
    component.update();
    component.draw();
  });
  window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);
