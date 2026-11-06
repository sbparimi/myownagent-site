(function(){
"use strict";
var d=document, RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
d.documentElement.classList.add('js');
/* nav background after scrolling */
var nav=d.getElementById('nav');
function onScroll(){ if(nav) nav.classList.toggle('solid', window.scrollY>40); }
window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* reveal on scroll */
var els=[].slice.call(d.querySelectorAll('.reveal'));
if(RM||!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); }
else{
  var io=new IntersectionObserver(function(ents){ents.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e,i){ e.style.transitionDelay=(Math.min(i%4,3)*70)+'ms'; io.observe(e); });
}

/* hero chat plays in a loop */
var chat=d.getElementById('hero-chat');
if(chat){
  var items=[].slice.call(chat.querySelectorAll('[data-s]')), st=d.querySelector('.js-status');
  if(RM){ items.forEach(function(e){ if(!e.classList.contains('typing')) e.classList.add('on'); }); }
  else{
    var delays=[600,1500,1300,1500,1400], timers=[];
    var play=function(){
      items.forEach(function(e){e.classList.remove('on');});
      var t=0;
      items.forEach(function(e,i){
        t+=delays[i]||1200;
        timers.push(setTimeout(function(){
          if(i>0&&items[i-1].classList.contains('typing')) items[i-1].classList.remove('on');
          e.classList.add('on');
          if(st) st.textContent = e.classList.contains('typing') ? 'typing…' : 'online';
        },t));
      });
      timers.push(setTimeout(play,t+5200));
    };
    play();
  }
}

/* reservation (opens a mail to hello@aiagentops.nl) */
var f=d.getElementById('wl'); if(!f) return;
f.addEventListener('submit',function(e){
  e.preventDefault();
  var n=f.elements.name.value.trim(), m=f.elements.email.value.trim(), u=f.elements.first.value;
  var body='Name: '+n+'\nEmail: '+m+'\nFirst thing for my agent: '+u+'\n';
  window.location.href='mailto:hello@aiagentops.nl?subject='+encodeURIComponent('MyOwnAgent setup reservation (€299 + VAT): '+n)+'&body='+encodeURIComponent(body);
});
})();
