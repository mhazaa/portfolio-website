const loadImg = (src) => {
  const img = new Image();
  img.src = src;
  return img;
}

const headerImgs = [
  loadImg('assets/imgs/1.svg'),
  loadImg('assets/imgs/2.svg'),
  loadImg('assets/imgs/3.svg'),
  loadImg('assets/imgs/glow1.svg'),
  loadImg('assets/imgs/glow2.svg'),
  loadImg('assets/imgs/glow3.svg'),
  loadImg('assets/imgs/glow4.svg'),
  loadImg('assets/imgs/glow5.svg')
]

const headerImgsLoaded = [];

const portfolioImgs = [
  loadImg('case-studies/shapeshifter/assets/poster.jpg'),
  loadImg('case-studies/cosmic-chat/assets/poster.jpg'),
  loadImg('case-studies/3dportfolio/assets/poster.jpg'),
  loadImg('case-studies/tinyearth/assets/poster.jpg'),
  loadImg('case-studies/anxiety-catalogue/assets/poster.jpg'),
  loadImg('case-studies/perennial/assets/poster.jpg'),
  loadImg('case-studies/soundbox/assets/poster.jpg'),
  loadImg('case-studies/sonata/assets/poster.jpg'),
  loadImg('case-studies/forest-enchanter/assets/poster.jpg')
]

const hammer = new Hammer(document.body);
hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });

const canvasON = true;

class Slider {
  constructor () {
    this.slide = -1;
    this.slides = document.querySelectorAll('.slide');
    this.titles = document.querySelectorAll('.title');
    this.nav = document.querySelector('#nav');
    this.header = document.querySelector('#header');
    this.about = document.querySelector('#about');
    this.aboutButton = document.querySelector('#aboutButton');
    this.navButtons = [];

    this.slides.forEach((slide) => {
      const div = document.createElement('div');
      this.nav.appendChild(div);
      this.navButtons.push(div);
    });

    this.input();
  }

  selectNav (slide) {
    this.navButtons[slide].classList.add('selectedNav');
  }

  unselectNav (slide) {
    this.navButtons[slide].classList.remove('selectedNav');
  }

  hideSlide (slide) {
    this.slides[slide].classList.remove('showSlide');
    portfolioPosters[slide].deactivate();
    this.titles[slide].classList.remove('showTitle');
    this.unselectNav(slide);
  }

  showSlide (slide) {
    this.slides[slide].classList.add('showSlide');
    portfolioPosters[slide].activate();
    this.titles[slide].classList.add('showTitle');
    this.selectNav(slide);
  }

  slideDown () {
    if (this.slide == this.slides.length-1) return;

    if (this.slide >- 1) this.hideSlide(this.slide);
    this.slide++;

    if (this.slide == 0) {
      this.header.style.opacity = 0;
      this.nav.classList.add('showNav');

      trees1.rollCurtain = 0;
      trees2.rollCurtain = 0;
      trees3.rollCurtain = 0;

      portfolioPosters[this.slide].changeHideSpeed('slow');
      curtain.show('fast');
      blackCurtain.show('slow');
    }

    if (this.slide == -1) {
      this.header.style.opacity = 1;
      this.about.style.opacity = 0;
      this.about.style.zIndex = 1;

      trees1.rollCurtain = 1;
      trees2.rollCurtain = 1;
      trees3.rollCurtain = 1;
    }

    if (this.slide < 0) {
      return;
    } else if (this.slide==0) {
      this.showSlide(this.slide);
    } else {
      this.showSlide(this.slide);
    }
  }

  slideUp () {
    if(this.slide < -1) return;

    if (this.slide > -1) this.hideSlide(this.slide);
    this.slide--;

    if (this.slide == -1) {
      this.header.style.opacity = 1;
      this.nav.classList.remove('showNav');

      trees1.rollCurtain = 1;
      trees2.rollCurtain = 1;
      trees3.rollCurtain = 1;

      portfolioPosters[0].changeHideSpeed('fast');
      curtain.hide('fast');
      blackCurtain.hide('fastest');
    }

    if (this.slide == -2) {
      this.header.style.opacity = 0;
      this.about.style.opacity = 1
      this.about.style.zIndex = 3;

      trees1.rollCurtain = 2;
      trees2.rollCurtain = 2;
      trees3.rollCurtain = 2;
    }

    if (this.slide > -1) this.showSlide(this.slide);
  }

  input () {
    this.aboutButton.addEventListener('click', () => this.slideUp());

    document.addEventListener('keyup', e => {
      const keyCode = e.keyCode;
      if (keyCode == 38) this.slideUp();
      if(keyCode == 40) this.slideDown();
    });

    hammer.on('swipeup', () => this.slideDown());
    hammer.on('swipedown', () => this.slideUp());

    const throttle = 1000;
    let time = -1;

    window.addEventListener('wheel', (e) => {
      var now = Date.now();
      if (time !== -1 && now - time < throttle) return;
      time = now;

      if (event.deltaY < 0){
        this.slideUp();
      } else if (e.deltaY > 0){
        this.slideDown();
      }
    });

    this.navButtons.forEach((navButton, i) => {
      navButton.addEventListener('click', () => {
        this.hideSlide(this.slide);
        this.slide = i;
        this.showSlide(this.slide);
      });
    });
  }
};

const slider = new Slider();

/* header */

//canvas
const lerp = (a, b, f) => {
  return a + f * (b - a);
}

const minWidth = 1000;
const allComponents = [];
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const resizeCanvas = () => {
  (window.innerWidth<minWidth) ? canvas.width = minWidth : canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener('resize', () => {
  resizeCanvas();
  allComponents.forEach(component => component.resize());
});

var mouseX = 0;

window.addEventListener('mousemove', e => {
  mouseX = e.clientX-window.innerWidth/2;
});

class BackgroundBox {
  constructor (color) {
    allComponents.push(this);
    this.color = color;
    this.y = canvas.height;
  }

  resize () {
    this.y = canvas.height;
  }

  update(){
    this.y = trees1.y + trees1.h;
  }

  draw () {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(0, this.y, canvas.width, canvas.height-this.y);
    ctx.restore();
  }
}

class Curtain {
  constructor (color, visible) {
    allComponents.push(this);
    this.color = color;
    this.visible = visible;
    this.w = canvas.width;
    this.h = canvas.height;

    this.slowSpeed = [0.04, 0.020];
    this.fastSpeed = [0.1, 0.05];
    this.fastestSpeed = [0.2, 0.1];

    this.points = [
      {x: -this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: -this.w, y: this.h},
      {x: -this.w, y: this.h}
    ]

    if (this.visible) {
      this.points[2].y = 0;
      this.points[3].y = 0;
    }
  }

  resize () {
    this.w = canvas.width;
    this.h = canvas.height;

    this.points = [
      {x: -this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: this.w, y: this.h},
      {x: -this.w, y: this.h},
      {x: -this.w, y: this.h}
    ]
  }

  hide (speed = 'slow') {
    if (!this.visible) return;
    this.visible = false;
    if (speed === 'slow') speed = this.slowSpeed;
    if (speed === 'fast') speed = this.fastSpeed;
    if (speed === 'fastest') speed = this.fastestSpeed;

    this.update = () => {
      this.points[2].y = lerp(this.points[2].y, this.h, speed[0]);
      this.points[3].y = lerp(this.points[3].y, this.h, speed[1]);
    }
  }

  show (speed = 'slow') {
    if (this.visible) return;
    this.visible = true;
    if (speed === 'slow') speed = this.slowSpeed;
    if (speed === 'fast') speed = this.fastSpeed;
    if (speed === 'fastest') speed = this.fastestSpeed;

    this.update = () => {
      this.points[2].y = lerp(this.points[2].y, 0, speed[0]);
      this.points[3].y = lerp(this.points[3].y, 0, speed[1]);
    }
  }

  update () {
  }

  draw () {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    this.points.forEach((point, i) => {
      (i==0) ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.fill();
    ctx.restore();
  }
}

class Element {
  constructor (img, x, y, w, z) {
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
    allComponents.push(this);
    this.img.onload = () => {
      this.ratio = this.img.width/this.img.height;
      this.resize();
      headerImgsLoaded.push(true);
    }
  }

  resize () {
    this.w = canvas.width*this.wPer;
    this.h = this.w/this.ratio;
    this.x = canvas.width*this.xPer;
    this.y = canvas.height-this.h-canvas.width*this.yPer;
    this.initialY = this.y;
    this.hidingY = 0-this.h*1.15;
  }

  followMouse () {
    if (this.targetX == mouseX) return;
    this.targetX = lerp(this.targetX, mouseX/this.z, 0.03);
  }
}

class Glow extends Element {
  constructor (img, x, y, w, z, direction) {
    super(img, x, y, w, z);
    this.direction = direction;
    this.rotate = 0;
  }

  update () {
    if (!canvasON) return;
    //following the mouse
    this.followMouse();
    //rotation
    (this.direction==0) ? this.rotate +=0.003 : this.rotate -=0.003;
  }

  draw () {
    ctx.save();
    ctx.translate((this.x+this.targetX)+this.w/2, this.y+this.h/2);
    ctx.rotate(this.rotate);
    ctx.translate(-(this.x+this.targetX)-this.w/2, -this.y-this.h/2);
    ctx.drawImage(this.img, this.x+this.targetX, this.y, this.w, this.h);
    ctx.restore();
  }
}

class Tree extends Element {
  constructor (img, x, y, w, z) {
    super(img, x, y, w, z);
    this.opacity = 1;
    this.rollCurtain = 1;
  }

  scaleAnimation(direction){
    this.scaletype = 0;
    (direction == 0) ? this.scale = 1 : this.scale = 1.15;
  }

  update () {
    if(this.rollCurtain==0){ //into slides
      this.y = lerp(this.y, this.hidingY, 0.3/this.z);
    } else if(this.rollCurtain==1){ //back to initial
      this.y = lerp(this.y, this.initialY, 0.6/this.z);
    } else if(this.rollCurtain==2){
      this.y = lerp(this.y, canvas.height, 0.3/this.z);
    }

    if (!canvasON) return;
    //following the mouse
    this.followMouse();
    //animation
    (this.scaletype==0) ? this.scale +=0.0005 : this.scale -=0.0005;

    if(this.scale >= 1.15){
      this.scaletype=1;
    } else if(this.scale<=1){
      this.scaletype=0;
    }
  }

  draw () {
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
  constructor (container, img) {
    this.container = container;
    this.active = false;
    this.canvas = this.container.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.img = img;

    this.fastHideSpeed = [0.6, 1.4];
    this.slowHideSpeed = [0.3, 0.7];
    this.hideSpeed = this.slowHideSpeed;
    this.showSpeed = [0.1, 0.05];

    this.img.onload = () => {
      this.img.aspectRatio = this.img.width/this.img.height;
      this.resize();
      allComponents.push(this);
    }

    this.mouseHovering = false;
    this.input();
  }

  resize () {
    this.canvas.width = this.container.offsetWidth;
    this.canvas.height = this.container.offsetHeight;
    this.w = this.canvas.width;
    this.h = this.canvas.height;
    this.x = this.w/2;
    this.y = this.h/2;

    if(window.innerWidth <= 800){
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

  input () {
    window.addEventListener('resize', () => this.resize());
    this.container.addEventListener('mousemove', () => this.mouseHovering = true);
    this.container.addEventListener('mouseout', () => this.mouseHovering = false);
  }

  activate () {
    this.active = true;
  }

  deactivate () {
    this.active = false;
  }

  changeHideSpeed (speed) {
    if (speed === 'slow') this.hideSpeed = this.slowHideSpeed;
    if (speed === 'fast') this.hideSpeed = this.fastHideSpeed;
  }

  hide () {
    this.points[0].y = lerp(this.points[0].y, 0, this.hideSpeed[0]);
    this.points[1].y = lerp(this.points[1].y, 0, this.hideSpeed[1]);
    this.points[2].y = lerp(this.points[2].y, 0, this.hideSpeed[1]);
    this.points[3].y = lerp(this.points[3].y, 0, this.hideSpeed[0]);
    this.points[4].y = lerp(this.points[4].y, 0, this.hideSpeed[0]);
  }

  show () {
    this.points[0].y = lerp(this.points[0].y, this.initialPoints[0].y, this.showSpeed[0]);
    this.points[1].y = lerp(this.points[1].y, this.initialPoints[1].y, this.showSpeed[1]);
    this.points[2].y = lerp(this.points[2].y, this.initialPoints[2].y, this.showSpeed[0]);
    this.points[3].y = lerp(this.points[3].y, this.initialPoints[3].y, this.showSpeed[1]);
    this.points[4].y = lerp(this.points[4].y, this.initialPoints[4].y, this.showSpeed[0]);
  }

  resetAllPoints () {
    for (var i=0; i<this.initialPoints.length; i++) {
      this.points[i].x = lerp(this.points[i].x, this.initialPoints[i].x, 0.1);
      this.points[i].y = lerp(this.points[i].y, this.initialPoints[i].y, 0.05);
    }
  }

  onHover () {
    this.points[0].y = lerp(this.points[0].y, this.initialPoints[0].y-60, 0.08);
    this.points[1].y = lerp(this.points[1].y, this.initialPoints[1].y-60, 0.08);
    this.points[2].y = lerp(this.points[2].y, this.initialPoints[2].y+60, 0.08);
    this.points[3].y = lerp(this.points[3].y, this.initialPoints[3].y+60, 0.08);
    this.points[4].y = this.points[0].y;
  }

  update () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if(this.active){
      (this.mouseHovering) ? this.onHover() : this.show();
    } else {
      this.hide();
    }
  }

  draw () {
    this.ctx.save();
    this.ctx.beginPath();
    this.points.forEach((point, i) => {
      (i==0)
        ? this.ctx.moveTo(this.x + point.x, this.y + point.y)
        : this.ctx.lineTo(this.x + point.x, this.y + point.y);
    });
    this.ctx.closePath();
    this.ctx.clip();
    this.ctx.drawImage(this.img, this.imgX, 0, this.imgW, this.imgH);
    this.ctx.restore();
  }
}


const glow5 = new Glow(headerImgs[7], -0.5, -0.3, 1.3, 10, 0);
const glow4 = new Glow(headerImgs[6], 0.05, -0.1, 0.85, 10, 1);
const glow3 = new Glow(headerImgs[5], 0, -0.2, 0.95, 10, 0);
const glow2 = new Glow(headerImgs[4], 0.2, 0.05, 0.5, 10, 1);
const glow1 = new Glow(headerImgs[3], 0.25, 0.13, 0.4, 10, 0);
const trees3 = new Tree(headerImgs[2], -0.1, 0, 1.2, 8);
const trees2 = new Tree(headerImgs[1], -0.1, 0, 1.2, 6);
const trees1 = new Tree(headerImgs[0], -0.1, 0, 1.2, 4);
const backgroundBox = new BackgroundBox('#720e5f');

trees1.scaleAnimation(0);
trees2.scaleAnimation(1);
trees3.scaleAnimation(0);

const curtain = new Curtain('#25051f', false);
const blackCurtain = new Curtain('#0e020c', false);

const portfolioPosters = [];
const posters = document.querySelectorAll('.poster');

posters.forEach((poster, i) => {
  portfolioPosters.push(
    new PortfolioPoster(poster, portfolioImgs[i])
  );
});

const loop = function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  allComponents.forEach(component => {
    component.update();
    component.draw();
  });

  window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);
