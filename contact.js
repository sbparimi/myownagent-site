(function(){
"use strict";
var TO='hello@aiagentops.nl';
var f=document.getElementById('cf'); if(!f) return;
var EM=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
var rules=[
  ['name','e-name',function(v){return v?'':'Please enter your name.';}],
  ['email','e-mail',function(v){return !v?'Please enter your email.':(EM.test(v)?'':'Please enter a valid email address.');}],
  ['topic','e-topic',function(v){return v?'':'Please choose a topic.';}],
  ['subject','e-subj',function(v){return v?'':'Please add a subject.';}],
  ['message','e-msg',function(v){return v?'':'Please write your message.';}]
];
function check(){
  var first=null;
  rules.forEach(function(r){
    var el=f.elements[r[0]], msg=r[2](el.value.trim()), out=document.getElementById(r[1]);
    out.textContent=msg; el.setAttribute('aria-invalid',msg?'true':'false');
    if(msg&&!first) first=el;
  });
  return first;
}
rules.forEach(function(r){ f.elements[r[0]].addEventListener('input',function(){ if(f.dataset.tried) check(); }); f.elements[r[0]].addEventListener('change',function(){ if(f.dataset.tried) check(); }); });
f.addEventListener('submit',function(e){
  e.preventDefault(); f.dataset.tried='1';
  var bad=check(); if(bad){ bad.focus(); return; }
  var v=function(n){return f.elements[n].value.trim();};
  var subject='['+v('topic')+'] '+v('subject')+' \u2013 '+v('name');
  var body='Name: '+v('name')+'\nEmail: '+v('email')+'\nTopic: '+v('topic')+'\n\n'+v('message')+'\n';
  var url='mailto:'+TO+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  f.dataset.mailto=url;
  window.location.href=url;
});
})();
