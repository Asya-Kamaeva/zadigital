const body = document.body;
const hamburger = document.querySelector(".hamburger");
const navItems = document.querySelectorAll('.nav__item');
const navItems2 = Array.prototype.slice.call(navItems); //для IE
const nav = document.querySelector(".nav");
const header = document.querySelector(".header");
const scrollUp = document.querySelector(".scroll-up");
const video = document.getElementById('video-btn');
const overlay = document.getElementById('overlay');
const closeOverlay = document.getElementById('close-overlay');


// hamburger menu

hamburger.addEventListener('click', function () {
    nav.classList.toggle("nav_active");
    hamburger.classList.toggle("hamburger_active");
    if(nav.classList.contains('nav_active')){
      body.style.overflow="hidden";
    }else{
      body.style.overflow="auto";
    }
  });

navItems2.forEach(function(navItem, index) {
    navItem.addEventListener('click', function(){
        if (widthBrowther <= 768){
            nav.classList.toggle("nav_active");
        hamburger.classList.toggle("hamburger_active");
        if(nav.classList.contains('nav_active')){
            body.style.overflow="hidden";
        }else{
            body.style.overflow="auto";
            }
        }
                
    });
});

//scroll-up

window.addEventListener('scroll', function(){
    
    if (this.pageYOffset > 110){
        scrollUp.style.cssText = 'display:flex; opacity: 1;';
    } else{
        scrollUp.style.cssText = 'display:none; opacity: 0;'
    }


});

//header fixed

function scrollDetect(){
    let lastScroll = 0;

  window.onscroll = function() {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop; // Get Current Scroll Value

      if (currentScroll > 0 && lastScroll <= currentScroll || pageYOffset ==0){
        lastScroll = currentScroll;
        header.classList.remove("header__fix");
      }else{
        lastScroll = currentScroll;
        header.classList.add("header__fix");
      }
  };
};

scrollDetect();

//slider

const left = document.querySelectorAll(".slider__control_prev")[0];
const right = document.querySelectorAll(".slider__control_next")[0];
const items = document.querySelectorAll(".slider__item");

function swipingRight(){
   
    let flag = 0;
    items.forEach(function(item){
        if (item.classList.contains("slider__active") && flag==0){
            item.classList.remove("slider__active");
            flag = 1;
            if (item.nextElementSibling){
                item.nextElementSibling.classList.add("slider__active");
            }else{
                items[0].classList.add("slider__active");
            }
        }
    }) 
};

setInterval(swipingRight, 6000);

right.addEventListener("click", swipingRight);

left.addEventListener("click", function (e) {
    let flag = 0;
    items.forEach(function(item){
        if (item.classList.contains("slider__active") && flag==0){
            item.classList.remove("slider__active");
            flag = 1;
            if (item.previousElementSibling){
                item.previousElementSibling.classList.add("slider__active");
            }else{
                items[items.length-1].classList.add("slider__active");
            }
        }
    })
});



//overlay (video)

video.addEventListener('click', function(e){
    e.preventDefault();
    overlay.style.display="flex";
    body.style.overflow="hidden";

});
closeOverlay.addEventListener('click', function(e){
    e.preventDefault();
    overlay.style.display="none";
    body.style.overflow="initial";

})

//sim slider

function Sim(sldrId) {

	let id = document.getElementById(sldrId);
	if(id) {
		this.sldrRoot = id
	}
	else {
		this.sldrRoot = document.querySelector('.sim-slider')
	};

	// Carousel objects
	this.sldrList = this.sldrRoot.querySelector('.reviews__list');
	this.sldrElements = this.sldrList.querySelectorAll('.reviews__item_hidden');
	this.sldrElemFirst = this.sldrList.querySelector('.reviews__item_hidden');
	// this.leftArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-left');
	// this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
	this.indicatorDots = this.sldrRoot.querySelector('ul.reviews__dots');

	// Initialization
	this.options = Sim.defaults;
	Sim.initialize(this)
};

Sim.defaults = {

	// Default options for the carousel
	loop: true,     // Бесконечное зацикливание слайдера
	auto: true,     // Автоматическое пролистывание
	interval: 5000, // Интервал между пролистыванием элементов (мс)
	arrows: false,   // Пролистывание стрелками
	dots: true      // Индикаторные точки
};

Sim.prototype.elemPrev = function(num) {
	num = num || 1;

	let prevElement = this.currentElement;
	this.currentElement -= num;
	if(this.currentElement < 0) this.currentElement = this.elemCount-1;

	if(!this.options.loop) {
		if(this.currentElement == 0) {
			this.leftArrow.style.display = 'none'
		};
		this.rightArrow.style.display = 'block'
	};
	
	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.elemNext = function(num) {
	num = num || 1;
	
	let prevElement = this.currentElement;
	this.currentElement += num;
	if(this.currentElement >= this.elemCount) this.currentElement = 0;

	if(!this.options.loop) {
		if(this.currentElement == this.elemCount-1) {
			this.rightArrow.style.display = 'none'
		};
		this.leftArrow.style.display = 'block'
	};

	this.sldrElements[this.currentElement].style.opacity = '1';
	this.sldrElements[prevElement].style.opacity = '0';

	if(this.options.dots) {
		this.dotOn(prevElement); this.dotOff(this.currentElement)
	}
};

Sim.prototype.dotOn = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; width: 10px; height: 10px; cursor:pointer;'
};

Sim.prototype.dotOff = function(num) {
	this.indicatorDotsAll[num].style.cssText = 'background-color:#ff4d03; width: 30px; height: 8px; cursor:default;'
};

Sim.initialize = function(that) {

	// Constants
	that.elemCount = that.sldrElements.length; // Количество элементов

	// Variables
	that.currentElement = 0;
	let bgTime = getTime();

	// Functions
	function getTime() {
		return new Date().getTime();
	};
	function setAutoScroll() {
		that.autoScroll = setInterval(function() {
			let fnTime = getTime();
			if(fnTime - bgTime + 10 > that.options.interval) {
				bgTime = fnTime; that.elemNext()
			}
		}, that.options.interval)
	};

	// Start initialization
	if(that.elemCount <= 1) {   // Отключить навигацию
		that.options.auto = false; that.options.arrows = false; that.options.dots = false;
		that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	};
	if(that.elemCount >= 1) {   // показать первый элемент
		that.sldrElemFirst.style.opacity = '1';
	};

	if(!that.options.loop) {
		that.leftArrow.style.display = 'none';  // отключить левую стрелку
		that.options.auto = false; // отключить автопркрутку
	}
	else if(that.options.auto) {   // инициализация автопрокруки
		setAutoScroll();
		// Остановка прокрутки при наведении мыши на элемент
		that.sldrList.addEventListener('mouseenter', function() {clearInterval(that.autoScroll)}, false);
		that.sldrList.addEventListener('mouseleave', setAutoScroll, false)
	};

	// if(that.options.arrows) {  // инициализация стрелок
	// 	that.leftArrow.addEventListener('click', function() {
	// 		let fnTime = getTime();
	// 		if(fnTime - bgTime > 1000) {
	// 			bgTime = fnTime; that.elemPrev()
	// 		}
	// 	}, false);
	// 	that.rightArrow.addEventListener('click', function() {
	// 		let fnTime = getTime();
	// 		if(fnTime - bgTime > 1000) {
	// 			bgTime = fnTime; that.elemNext()
	// 		}
	// 	}, false)
	// }
	// else {
	// 	that.leftArrow.style.display = 'none'; that.rightArrow.style.display = 'none'
	// };

	if(that.options.dots) {  // инициализация индикаторных точек
		let sum = '', diffNum;
		for(let i=0; i<that.elemCount; i++) {
			sum += '<span class="reviews__dot"></span>'
		};
		that.indicatorDots.innerHTML = sum;
		that.indicatorDotsAll = that.sldrRoot.querySelectorAll('.reviews__dot');
		// Назначаем точкам обработчик события 'click'
		for(let n=0; n<that.elemCount; n++) {
			that.indicatorDotsAll[n].addEventListener('click', function() {
				diffNum = Math.abs(n - that.currentElement);
				if(n < that.currentElement) {
					bgTime = getTime(); that.elemPrev(diffNum)
				}
				else if(n > that.currentElement) {
					bgTime = getTime(); that.elemNext(diffNum)
				}
				// Если n == that.currentElement ничего не делаем
			}, false)
		};
		that.dotOff(0);  // точка[0] выключена, остальные включены
		for(let i=1; i<that.elemCount; i++) {
			that.dotOn(i)
		}
	}
};

new Sim();

//num animation

const time = 3000;
const step = 1;

// const num = document.querySelectorAll('.statistics__number');
// const numArray = [];
// for(let key in num){
//     numArray.push(num[key]);
// }

let a = document.querySelector("#num1");
let b = document.querySelector("#num2");
let c = document.querySelector("#num3");

let arr = [];
arr.push(a, b, c);
let arrNum = [];
let arrTime = [];

arr.forEach(function (item) {
    let num = item.innerHTML;
    arrNum.push(num);
    let t = Math.round(time/(num/step));
    arrTime.push(t);
    
});

for (i=0; i<arr.length; i++) {
    n = 0;
    let interval = setInterval(() => {
    n = n + step;
    if (n == arrNum[i]) {
        clearInterval(interval);
      }
      arrNum[i]=n;
    }, arrTime[i]);
};



// function outNum(num, elem) {
//   let e = document.querySelector(elem);
//   n = 0;
//   let t = Math.round(time / (num / step));
//   let interval = setInterval(() => {
//     n = n + step;
//     if (n == num) {
//       clearInterval(interval);
//     }
//     e.innerHTML=n;
//   }, t);
// }
// outNum(12, "#num1");
// outNum(1450, "#num2");
// outNum(100, "#num3");






