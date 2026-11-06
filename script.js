(function(){
'use strict';
var RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
var DEFAULT='Maya', NAME=DEFAULT;
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}

/* ---------- name ---------- */
var STRIP;
try{STRIP=new RegExp("[^\\p{L}\\p{M}'\u2019 -]","gu");}catch(e){STRIP=/[<>"&\d_=+*\/\\@#$%^(){}\[\];:!?.,|~`]/g;}
function clean(s){s=String(s||'').replace(STRIP,'').replace(/\s+/g,' ').replace(/^[\s'\u2019-]+/,'').slice(0,18).trim();
  return s?s.charAt(0).toUpperCase()+s.slice(1):'';}
function poss(n){return n+'\u2019s';}
function slug(n){return (n.replace(/[^A-Za-z\u00C0-\u024F]+/g,'_').replace(/^_|_$/g,'')||'My');}
function setName(n){NAME=n||DEFAULT;
  $$('[data-name]').forEach(function(e){e.textContent=NAME;});
  $$('[data-poss]').forEach(function(e){e.textContent=poss(NAME);});
  $$('.js-cv').forEach(function(e){e.textContent=slug(NAME)+'_CV_tailored.pdf';});
}
var box=$('#namebox'), inp=$('#n-in'), wlName=$('#f-name'), wlTouched=false, flashT;
function fromUrl(){try{var q=new URLSearchParams(location.search).get('name');return q?clean(q):'';}catch(e){return '';}}
var start=fromUrl();
if(!start){try{start=clean(localStorage.getItem('ns_name'));}catch(e){}}
if(start&&inp){inp.value=start;box.classList.add('has');}
setName(start);
if(wlName){wlName.addEventListener('input',function(){wlTouched=true;}); if(start&&!wlName.value)wlName.value=start;}
if(inp){
  inp.addEventListener('input',function(){
    var n=clean(inp.value); setName(n); box.classList.toggle('has',!!n);
    try{n?localStorage.setItem('ns_name',n):localStorage.removeItem('ns_name');}catch(e){}
    if(wlName&&!wlTouched)wlName.value=n;
    if(!RM){document.body.classList.add('flash');clearTimeout(flashT);flashT=setTimeout(function(){document.body.classList.remove('flash');},500);}
  });
  box.addEventListener('submit',function(e){e.preventDefault();inp.blur();var w=$('#watch');if(w)w.scrollIntoView({behavior:RM?'auto':'smooth'});});
}

/* ---------- tiny animation runner ---------- */
function typeSteps(el,text,speed,chunk){var out=[];chunk=chunk||2;
  for(var i=chunk;i<text.length+chunk;i+=chunk){(function(k){out.push([speed,function(){el.textContent=text.slice(0,k);}]);})(Math.min(i,text.length));}
  return out;}
function countTo(el,to,dur,r,id){
  if(RM){el.textContent=to;return;}
  var from=parseInt(el.textContent,10)||0,t0=performance.now();
  (function f(t){if(r.run!==id)return;var p=Math.min(1,(t-t0)/dur);p=1-Math.pow(1-p,3);
    el.textContent=Math.round(from+(to-from)*p);if(p<1)requestAnimationFrame(f);})(t0);}

function Runner(el,def){this.el=el;this.def=def;this.run=0;this.timer=null;this.visible=false;this.active=false;}
Runner.prototype.start=function(){
  var self=this,id=++this.run,el=this.el,def=this.def;clearTimeout(this.timer);this.active=true;
  def.reset(el);var steps=def.steps(el,this,id);
  if(RM){steps.forEach(function(s){s[1]();});this.active=false;return;}
  var i=0;
  (function next(){
    if(id!==self.run)return;
    if(i>=steps.length){self.timer=setTimeout(function(){if(id!==self.run)return;if(self.visible)self.start();else self.active=false;},def.hold||3000);return;}
    var s=steps[i++];self.timer=setTimeout(function(){if(id!==self.run)return;s[1]();next();},s[0]);
  })();
};
Runner.prototype.stop=function(){this.run++;clearTimeout(this.timer);this.active=false;};

function on(e){e&&e.classList.add('on');}
var D={};

D.chat={hold:4500,
  reset:function(el){$$('[data-s]',el).forEach(function(e){e.classList.remove('on','gone');});},
  steps:function(el){var s=$$('[data-s]',el);return [
    [300,function(){on(s[0]);}],[1100,function(){on(s[1]);}],[1100,function(){on(s[2]);}],
    [1000,function(){on(s[3]);}],[1300,function(){s[3].classList.add('gone');on(s[4]);}],
    [1000,function(){on(s[5]);}]];}};

D.tasks={hold:3200,
  reset:function(el){$$('.tasks li',el).forEach(function(e){e.classList.remove('done','busy','wait');});$('.js-bar',el).style.width='0';$('.js-done',el).textContent='0';},
  steps:function(el){var li=$$('.tasks li',el),bar=$('.js-bar',el),c=$('.js-done',el),out=[];
    li.forEach(function(e,i){
      if(i<li.length-1){
        out.push([i?250:400,function(){e.classList.add('busy');}]);
        out.push([650,function(){e.classList.remove('busy');e.classList.add('done');c.textContent=i+1;bar.style.width=((i+1)/li.length*100)+'%';}]);
      }else{
        out.push([300,function(){e.classList.add('busy');}]);
        out.push([700,function(){e.classList.remove('busy');e.classList.add('wait');bar.style.width='90%';}]);
      }});
    return out;}};

D.dash={hold:5000,
  reset:function(el){el.classList.remove('go');$$('.js-c',el).forEach(function(e){e.textContent='0';});},
  steps:function(el,r,id){return [[250,function(){el.classList.add('go');
    $$('.js-c',el).forEach(function(e){countTo(e,parseInt(e.getAttribute('data-to'),10),1500,r,id);});}]];}};

D.inbox={hold:4500,
  reset:function(el){$$('.mails li',el).forEach(function(e){e.classList.remove('scan','on','filed');});
    $('.js-mails',el).textContent='0';$('.summary',el).classList.remove('on');var d=$('.draft',el);d.classList.remove('on','ready');$('.js-type',el).textContent='';},
  steps:function(el,r,id){var li=$$('.mails li:not(.more)',el),more=$('.mails .more',el),cnt=$('.js-mails',el),out=[];
    li.forEach(function(e,i){
      out.push([i?200:400,function(){if(i)li[i-1].classList.remove('scan');e.classList.add('scan');}]);
      out.push([450,function(){e.classList.add('on');if(e.classList.contains('promo'))e.classList.add('filed');cnt.textContent=i+1;}]);
    });
    out.push([300,function(){li[li.length-1].classList.remove('scan');on(more);countTo(cnt,14,900,r,id);}]);
    out.push([900,function(){on($('.summary',el));}]);
    out.push([800,function(){on($('.draft',el));}]);
    var txt='Hi Jordan,\nThanks for reaching out \u2014 Thursday after 14:00 works for me. Happy to send my CV before the call.\nBest, '+NAME;
    out=out.concat(typeSteps($('.js-type',el),txt,32,2));
    out.push([300,function(){$('.draft',el).classList.add('ready');}]);
    return out;}};

D.book={hold:3800,
  reset:function(el){$$('.cal i',el).forEach(function(e){e.classList.remove('look','pick');});$('.toast',el).classList.remove('on');},
  steps:function(el){var cells=$$('.cal i',el),out=[],prev=null;
    for(var i=0;i<cells.length;i++){(function(c){out.push([prev?230:500,(function(p){return function(){if(p)p.classList.remove('look');c.classList.add('look');};})(prev)]);})(cells[i]);
      prev=cells[i];if(cells[i].classList.contains('target'))break;}
    out.push([500,function(){prev.classList.remove('look');prev.classList.add('pick');}]);
    out.push([500,function(){on($('.toast',el));}]);
    return out;}};

D.apply={hold:3600,
  reset:function(el){['.js-f1','.js-f2','.js-f3'].forEach(function(s){$(s,el).textContent='';});$('.cvchip',el).classList.remove('on');
    $('.appform',el).classList.remove('dim');$('.submit',el).classList.remove('press');$('.sent',el).classList.remove('on');},
  steps:function(el){var mail=(NAME.toLowerCase().replace(/[^a-z]/g,'')||'me')+'@example.com';
    var out=[[400,function(){}]];
    out=out.concat(typeSteps($('.js-f1',el),NAME,60,1));
    out=out.concat(typeSteps($('.js-f2',el),mail,35,2));
    out.push([300,function(){on($('.cvchip',el));}]);
    out.push([1000,function(){}]);
    out=out.concat(typeSteps($('.js-f3',el),'Answered truthfully from profile',28,2));
    out.push([400,function(){$('.submit',el).classList.add('press');}]);
    out.push([220,function(){$('.submit',el).classList.remove('press');$('.appform',el).classList.add('dim');}]);
    out.push([250,function(){on($('.sent',el));}]);
    return out;}};

D.remind={hold:4200,
  reset:function(el){$('.js-clock',el).textContent='12:57';$$('.notif',el).forEach(function(e){e.classList.remove('on');});},
  steps:function(el){var c=$('.js-clock',el);return [
    [800,function(){c.textContent='12:58';}],[800,function(){c.textContent='12:59';}],[800,function(){c.textContent='13:00';}],
    [250,function(){on($('.n1',el));}],[1600,function(){on($('.n2',el));}]];}};

D.timeline={hold:2600,
  reset:function(el){$$('.tl li',el).forEach(function(e){e.classList.remove('now','done');});},
  steps:function(el){var li=$$('.tl li',el),out=[];
    li.forEach(function(e,i){out.push([i?950:400,function(){if(i){li[i-1].classList.remove('now');li[i-1].classList.add('done');}e.classList.add('now');}]);});
    out.push([950,function(){var l=li[li.length-1];l.classList.remove('now');l.classList.add('done');}]);
    return out;}};

var runners=[];
$$('[data-demo]').forEach(function(el){var d=D[el.getAttribute('data-demo')];if(d)runners.push(new Runner(el,d));});
if(RM||!('IntersectionObserver' in window)){runners.forEach(function(r){r.visible=true;r.start();});}
else{
  var io=new IntersectionObserver(function(ents){ents.forEach(function(en){
    var r=en.target.__r;if(!r)return;r.visible=en.isIntersecting;
    if(en.isIntersecting&&!r.active)r.start();
    else if(!en.isIntersecting&&r.active)r.stop();
  });},{threshold:0.25});
  runners.forEach(function(r){r.el.__r=r;io.observe(r.el);});
  document.addEventListener('visibilitychange',function(){if(document.hidden)runners.forEach(function(r){r.stop();});
    else runners.forEach(function(r){if(r.visible)r.start();});});
}

/* ---------- waitlist (unchanged behaviour: opens a mail to hello@aiagentops.nl) ---------- */
var f=document.getElementById('wl'); if(!f) return;
f.addEventListener('submit',function(e){
  e.preventDefault();
  var n=f.elements.name.value.trim(), m=f.elements.email.value.trim(), u=f.elements.first.value;
  var body='Name: '+n+'\nEmail: '+m+'\nFirst thing for my agent: '+u+'\n';
  window.location.href='mailto:hello@aiagentops.nl?subject='+encodeURIComponent('MyOwnAgent setup reservation (€299): '+n)+'&body='+encodeURIComponent(body);
});
})();
