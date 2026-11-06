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
  var pk=(window.YPA_PICKS&&window.YPA_PICKS())||[];
  var body='Name: '+n+'\nEmail: '+m+'\nFirst job: '+u+'\n'+(pk.length?'My 3 jobs: '+pk.join(', ')+'\n':'');
  window.location.href='mailto:hello@aiagentops.nl?subject='+encodeURIComponent('Your Personal Assistant setup reservation (€49.99 + VAT setup): '+n)+'&body='+encodeURIComponent('I would like to reserve Your Personal Assistant.\n\n'+body);
});
})();

/* ===== v7: job circles open a chat that plays the job ===== */
(function(){
"use strict";
var d=document, RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var JOBS={"school": {"title": "Kids' school", "subs": ["School mail read", "Forms & deadlines", "Parents' evening booked"], "c1": "#ffc25a", "c2": "#ff6a3d", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2 9.5 12 4.5l10 5-10 5-10-5z\"/><path d=\"M6 11.6V16c0 1.6 2.7 3.2 6 3.2s6-1.6 6-3.2v-4.4\"/><path d=\"M22 9.5v5.5\"/></svg>", "chat": [{"f": "u", "at": "20:41", "t": "Can you keep on top of Mila's school mail? I keep missing things 😅"}, {"f": "a", "at": "20:41", "t": "On it. I'll read every school mail, pull out what needs you, and put the dates in your calendar."}, {"f": "a", "at": "20:52", "t": "Done ✅ School mail read. 6 new this week: 1 needs you, 2 are dates, 3 are just newsletters.", "s": 1}, {"f": "a", "at": "20:53", "t": "Done ✅ The trip consent form is due Thursday. Everything is filled in, you just sign. Swimming kit reminder set for Wednesday 07:30.", "s": 2}, {"f": "a", "at": "20:54", "t": "Parents' evening: Tuesday 18:40 or Thursday 19:10 are free in your calendar. Which one?"}, {"f": "u", "at": "20:55", "t": "Tuesday"}, {"f": "a", "at": "20:55", "t": "Done ✅ Booked Tuesday 18:40 with Mila's teacher. It's in your calendar.", "s": 3}]}, "shop": {"title": "Shopping", "subs": ["List built", "Order placed", "Delivery tracked"], "c1": "#ff7ac6", "c2": "#d6247f", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M2.5 4h2.3l2.4 11.2h10.9l2.2-8.2H6\"/><circle cx=\"9.2\" cy=\"19.6\" r=\"1.5\"/><circle cx=\"16.8\" cy=\"19.6\" r=\"1.5\"/></svg>", "chat": [{"f": "u", "at": "18:05", "t": "We're out of basics again. Can you sort the weekly shop?"}, {"f": "a", "at": "18:05", "t": "On it. I'll start from last week's order and what you've told me."}, {"f": "a", "at": "18:07", "t": "Done ✅ List built: milk, eggs, bread, rice, bananas, nappies size 4, dish soap and 9 more. Anything to add?", "s": 1}, {"f": "u", "at": "18:08", "t": "Add strawberries 🍓"}, {"f": "a", "at": "18:09", "t": "Total €64.20, delivery tomorrow 08:00–09:00. Shall I place it?"}, {"f": "u", "at": "18:09", "t": "Yes"}, {"f": "a", "at": "18:10", "t": "Done ✅ Order placed, strawberries in.", "s": 2}, {"d": "Next morning"}, {"f": "a", "at": "08:24", "t": "Done ✅ Delivered at 08:21. The dish soap was out of stock, so it came off the bill. It's on next week's list.", "s": 3}]}, "remind": {"title": "Reminders", "subs": ["Set from one message", "Nudged on time", "Followed up till done"], "c1": "#b18cff", "c2": "#6d28d9", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M6 16.5v-5.2a6 6 0 0 1 12 0v5.2l1.8 1.8H4.2z\"/><path d=\"M10 21a2.2 2.2 0 0 0 4 0\"/></svg>", "chat": [{"f": "u", "at": "22:14", "t": "Remind me to renew my passport, pay the window cleaner Friday and call mum on Sunday"}, {"f": "a", "at": "22:14", "t": "Got it, three reminders."}, {"f": "a", "at": "22:15", "t": "Done ✅ Set: window cleaner Friday 09:00, call mum Sunday 11:00. Your passport expires in March, so I'll start you on it next week.", "s": 1}, {"d": "Friday"}, {"f": "a", "at": "09:00", "t": "⏰ Window cleaner today, €25."}, {"f": "u", "at": "09:12", "t": "Paid"}, {"f": "a", "at": "09:12", "t": "Done ✅ Ticked off. Nudged right on time.", "s": 2}, {"d": "Sunday"}, {"f": "a", "at": "13:00", "t": "Done ✅ You snoozed “call mum” at 11:00, so here it is again. It stays on top until you tick it.", "s": 3}]}, "cal": {"title": "Calendar", "subs": ["Clashes spotted", "Invites sorted", "Morning agenda"], "c1": "#5aa2ff", "c2": "#2446d8", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"3\"/><path d=\"M3 10h18M8 3v4M16 3v4\"/><path d=\"m9 15.2 2 2 4-4\"/></svg>", "chat": [{"f": "u", "at": "21:30", "t": "My calendar is a mess this week. Help?"}, {"f": "a", "at": "21:30", "t": "Looking at all your calendars now."}, {"f": "a", "at": "21:32", "t": "Done ✅ 2 clashes found: the dentist overlaps your team call on Wednesday, and football pickup overlaps your 17:30 on Thursday.", "s": 1}, {"f": "u", "at": "21:33", "t": "Move the team call, and ask Sam to do pickup"}, {"f": "a", "at": "21:36", "t": "Done ✅ Team call moved to 15:00 (accepted). Sam said yes to pickup. 2 old invites declined, school assembly accepted.", "s": 2}, {"d": "Next morning"}, {"f": "a", "at": "07:00", "t": "Done ✅ Good morning. Today: 09:30 stand-up, 12:00 lunch with Eva, 15:00 team call. Heads-up 30 min before each.", "s": 3}]}, "travel": {"title": "Travel plans", "subs": ["Options compared", "Trip planned day by day", "Check-in & reminders"], "c1": "#3ee6f0", "c2": "#0e7490", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"currentColor\" stroke=\"none\" aria-hidden=\"true\"><path d=\"M21 15.5v-1.8l-8-5V3.6a1.5 1.5 0 0 0-3 0v5.1l-8 5v1.8l8-2.4v5.2l-2.2 1.6v1.4l3.7-1 3.7 1v-1.4L13 18.3v-5.2z\"/></svg>", "chat": [{"f": "u", "at": "19:12", "t": "Long weekend in Lisbon in May for the 4 of us, under €1,200 total?"}, {"f": "a", "at": "19:12", "t": "On it. Comparing dates, flights and places to stay."}, {"f": "a", "at": "19:31", "t": "Done ✅ Best fit: Fri 8 – Mon 11 May. Flights and a 2-bedroom flat in Alfama come to €1,140 for four. Two cheaper options if you'd rather.", "s": 1}, {"f": "u", "at": "19:40", "t": "Go with that one"}, {"f": "a", "at": "19:46", "t": "Done ✅ Booked on your OK. Day by day: tram 28 and the castle on Saturday, Cascais beach on Sunday, dinner booked Saturday 19:30.", "s": 2}, {"f": "a", "at": "19:47", "t": "Done ✅ Check-in opens Wednesday 10:00. I'll do it and send the boarding passes. Passport check reminder set for 1 May.", "s": 3}]}, "tickets": {"title": "Ticket booking", "subs": ["Best seats found", "Booked on your OK", "Tickets in your phone"], "c1": "#ff6b7f", "c2": "#be123c", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3.5 7h17v3.2a1.9 1.9 0 0 0 0 3.6V17h-17v-3.2a1.9 1.9 0 0 0 0-3.6z\"/><path d=\"M14.5 7.5v9\" stroke-dasharray=\"1.6 1.8\"/></svg>", "chat": [{"f": "u", "at": "12:30", "t": "Tickets for the kids' musical on Saturday? 2 adults, 2 kids, not too far back"}, {"f": "a", "at": "12:30", "t": "Checking both shows."}, {"f": "a", "at": "12:34", "t": "Done ✅ 14:00 show: row 7, four seats together, €38 each. The 19:00 only has split seats.", "s": 1}, {"f": "u", "at": "12:35", "t": "Book the 14:00"}, {"f": "a", "at": "12:38", "t": "Done ✅ Booked: row 7, seats 12–15. €152 in total, paid on your OK.", "s": 2}, {"f": "a", "at": "12:39", "t": "Done ✅ Here are your 4 tickets 🎟️ They're in your mail too. Reminder Saturday 13:15 to leave, parking is next door.", "s": 3}]}, "appts": {"title": "Appointments", "subs": ["Slot found", "Booked on your OK", "Chased till confirmed"], "c1": "#46e3a6", "c2": "#047857", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7.5v9M7.5 12h9\"/></svg>", "chat": [{"f": "u", "at": "08:10", "t": "Car needs a service, and I need a dentist check-up. Both next week if possible"}, {"f": "a", "at": "08:10", "t": "On it. I'll call both and find slots that fit your calendar."}, {"f": "a", "at": "08:41", "t": "Done ✅ Garage: Tuesday 08:00 drop-off, ready by 17:00. Dentist: Thursday 16:20. Both fit your calendar.", "s": 1}, {"f": "u", "at": "08:45", "t": "Book both"}, {"f": "a", "at": "08:52", "t": "Done ✅ Both booked and in your calendar.", "s": 2}, {"f": "a", "at": "14:05", "t": "Done ✅ The garage hadn't sent a confirmation, so I called again. Confirmed: service plus brake check, €189. Dentist reminder Thursday 15:50.", "s": 3}]}, "home": {"title": "Bills & renewals", "subs": ["Bills checked", "Renewals flagged early", "Cancelled on your OK"], "c1": "#ffd75e", "c2": "#d97706", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M3 11.2 12 4l9 7.2\"/><path d=\"M5.5 9.6V20h13V9.6\"/><path d=\"M10 20v-5.5h4V20\"/></svg>", "chat": [{"f": "u", "at": "20:00", "t": "Can you keep an eye on our bills and renewals? I always notice too late"}, {"f": "a", "at": "20:00", "t": "On it. I'll read your bill and contract mail and keep one list."}, {"f": "a", "at": "20:14", "t": "Done ✅ Bills checked: energy, water, internet and insurance match last month. One change: the phone bill went up €6.", "s": 1}, {"f": "a", "at": "20:15", "t": "Done ✅ Heads-up: your streaming subscription renews on the 14th for €13.99. Cancel by the 13th to stop the debit. The gym contract auto-renews in 3 weeks.", "s": 2}, {"f": "u", "at": "20:20", "t": "Cancel the streaming one"}, {"f": "a", "at": "20:26", "t": "Done ✅ Cancelled. The confirmation mail is saved and it stops on the 14th. Nothing else was touched.", "s": 3}]}, "jobs": {"title": "Job hunting", "subs": ["Roles found daily", "CV tailored per job", "Applied & replies tracked"], "c1": "#8f9bff", "c2": "#4338ca", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"7\" width=\"18\" height=\"13\" rx=\"2.5\"/><path d=\"M8.5 7V5.4A1.9 1.9 0 0 1 10.4 3.5h3.2a1.9 1.9 0 0 1 1.9 1.9V7\"/><path d=\"M3 12.5h18\"/></svg>", "chat": [{"f": "u", "at": "07:45", "t": "I'm looking for a new job. Project manager, Utrecht or remote"}, {"f": "a", "at": "07:45", "t": "On it. I'll search every morning and tailor your CV for each role."}, {"f": "a", "at": "08:20", "t": "Done ✅ 9 new roles this morning, 4 match what you want, with the reasons.", "s": 1}, {"f": "a", "at": "08:34", "t": "Done ✅ Your CV rewritten for each of the 4. Truthful to your experience, with the words each ad asks for.", "s": 2}, {"f": "u", "at": "08:40", "t": "Send them"}, {"f": "a", "at": "08:52", "t": "4 applications sent ✉️"}, {"f": "a", "at": "10:12", "t": "Done ✅ First reply is in: an interview request for Thursday. Two times are held in your calendar, pick one.", "s": 3}]}, "gifts": {"title": "Birthdays & gifts", "subs": ["Dates remembered", "Gift ideas picked", "Ordered & delivered"], "c1": "#ff86e0", "c2": "#a21caf", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"3\" y=\"8\" width=\"18\" height=\"4.2\" rx=\"1\"/><path d=\"M5 12.2V21h14v-8.8M12 8v13\"/><path d=\"M12 8C10.6 4.2 7.4 3.4 7 5.6 6.6 7.8 10 8 12 8zm0 0c1.4-3.8 4.6-4.6 5-2.4.4 2.2-3 2.4-5 2.4z\"/></svg>", "chat": [{"f": "u", "at": "21:05", "t": "My sister's birthday is on the 20th. I always remember on the day itself 🙈"}, {"f": "a", "at": "21:05", "t": "Not this year."}, {"f": "a", "at": "21:06", "t": "Done ✅ Saved: 20 June, with a heads-up 10 days before so there's time to send something.", "s": 1}, {"d": "10 June"}, {"f": "a", "at": "09:00", "t": "🎁 10 days to go. Three ideas under €40: a pottery class voucher, a tea set in her favourite colour, a photo book of your trip."}, {"f": "u", "at": "09:20", "t": "Pottery class!"}, {"f": "a", "at": "09:21", "t": "Done ✅ Gift picked: pottery class for two, €38.", "s": 2}, {"f": "a", "at": "09:27", "t": "Done ✅ Ordered on your OK. It lands in her mail on the morning of the 20th with your note: “Happy birthday, sis! Make me a mug 😄”", "s": 3}]}, "repair": {"title": "Home repairs", "subs": ["Tradespeople found", "Quotes compared", "Visit booked"], "c1": "#ffa25a", "c2": "#c2410c", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M14.6 6.1a4.3 4.3 0 0 0-5.5 5.5L3.3 17.4a1.6 1.6 0 0 0 0 2.3l1 1a1.6 1.6 0 0 0 2.3 0l5.8-5.8a4.3 4.3 0 0 0 5.5-5.5l-2.6 2.6-2.5-.6-.6-2.5z\"/></svg>", "chat": [{"f": "u", "at": "17:20", "t": "The bathroom tap leaks and the boiler makes a noise. Can you get someone?"}, {"f": "a", "at": "17:20", "t": "On it. I'll find local plumbers with good reviews and ask for quotes."}, {"f": "a", "at": "17:58", "t": "Done ✅ Called 4 local plumbers. 3 can come this week.", "s": 1}, {"f": "a", "at": "18:30", "t": "Done ✅ Quotes in: €85, €110 and €140 for the tap and a boiler check. The €110 one includes parts and a 1-year guarantee. That's my pick.", "s": 2}, {"f": "u", "at": "18:34", "t": "Go with that one"}, {"f": "a", "at": "18:40", "t": "Done ✅ Booked for Wednesday 09:00–11:00. I told them about the noise and where the boiler is. Reminder set for Tuesday evening.", "s": 3}]}, "calls": {"title": "Calls for you", "subs": ["Right number found", "Called in Dutch or English", "Summary sent"], "c1": "#b8f15a", "c2": "#3f8f12", "icon": "<svg class=\"ic\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M21.5 16.6v3a2 2 0 0 1-2.2 2A19.6 19.6 0 0 1 2.4 4.7 2 2 0 0 1 4.4 2.5h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.4 10.3a16 16 0 0 0 5.3 5.3l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z\"/></svg>", "chat": [{"f": "u", "at": "10:02", "t": "Can you call the furniture shop? Our table was due last week"}, {"f": "a", "at": "10:02", "t": "Calling them now."}, {"f": "a", "at": "10:03", "t": "Done ✅ Found the order mail and the shop's customer line.", "s": 1}, {"f": "a", "at": "10:11", "t": "Done ✅ Called in Dutch. The table is in their warehouse and goes out on Friday.", "s": 2}, {"f": "a", "at": "10:12", "t": "Done ✅ Summary: delivery Friday 12:00–16:00, they text 30 min before. It's in your calendar, and I'll call again Friday 10:00 if no text comes.", "s": 3}]}};
var modal=d.getElementById('chat-modal'); if(!modal) return;
var sheet=modal.querySelector('.chat-sheet'), log=d.getElementById('chat-log'), steps=d.getElementById('chat-job'),
    status=modal.querySelector('.chat-status'), pickBtn=d.getElementById('chat-pick'), replay=d.getElementById('chat-replay');
var timers=[], cur=null, opener=null, picks=[];

/* chat sound: code-made pops, chimes, dings and a light music bed (starts only on a tap) */
var SND=(function(){
  var AC=window.AudioContext||window.webkitAudioContext, ctx=null, master=null, sfx=null, mus=null, noiseBuf=null;
  var on=true; try{ on=localStorage.getItem('ypa-sound')!=='0'; }catch(e){}
  var playing=false, sched=null, nextT=0, step=0, tickT=null, stopT=null;
  var BPM=110, E8=60/BPM/2;
  var PROG=[[60,64,67],[55,59,62],[57,60,64],[53,57,60]]; /* C G Am F */
  function hz(n){ return 440*Math.pow(2,(n-69)/12); }
  function init(){
    if(!AC) return false;
    if(!ctx){
      try{ ctx=new AC(); }catch(e){ AC=null; return false; }
      master=ctx.createGain(); master.gain.value=0.9; master.connect(ctx.destination);
      sfx=ctx.createGain(); sfx.gain.value=1.0; sfx.connect(master);
      mus=ctx.createGain(); mus.gain.value=0; mus.connect(master);
      noiseBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
      var ch=noiseBuf.getChannelData(0); for(var i=0;i<ch.length;i++) ch[i]=Math.random()*2-1;
    }
    if(ctx.state==='suspended'&&ctx.resume) ctx.resume();
    return true;
  }
  function env(g,t,a,peak,dec){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+dec); }
  function tone(type,f,t,a,peak,dec,dest,f2){
    var o=ctx.createOscillator(), g=ctx.createGain(); o.type=type; o.frequency.setValueAtTime(f,t);
    if(f2) o.frequency.exponentialRampToValueAtTime(f2,t+a+dec*0.6);
    env(g,t,a,peak,dec); o.connect(g); g.connect(dest); o.start(t); o.stop(t+a+dec+0.05);
  }
  function noise(t,dur,peak,hp,dest){
    var s=ctx.createBufferSource(), f=ctx.createBiquadFilter(), g=ctx.createGain();
    s.buffer=noiseBuf; f.type='highpass'; f.frequency.value=hp; env(g,t,0.003,peak,dur);
    s.connect(f); f.connect(g); g.connect(dest); s.start(t,Math.random()*0.5); s.stop(t+dur+0.05);
  }
  function ok(){ return on&&ctx&&ctx.state!=='closed'; }
  function pop(){ if(!ok()) return; var t=ctx.currentTime+0.01; tone('sine',620,t,0.004,0.6,0.09,sfx,240); noise(t,0.025,0.05,2500,sfx); }
  function chime(){ if(!ok()) return; var t=ctx.currentTime+0.01; tone('sine',hz(81),t,0.006,0.22,0.35,sfx); tone('sine',hz(88),t+0.09,0.006,0.2,0.45,sfx); tone('triangle',hz(93),t+0.09,0.006,0.05,0.3,sfx); }
  function ding(){ if(!ok()) return; var t=ctx.currentTime+0.18; tone('sine',hz(96),t,0.004,0.32,0.7,sfx); tone('sine',hz(103),t,0.004,0.1,0.5,sfx); tone('triangle',hz(84),t,0.004,0.08,0.4,sfx); }
  function typing(start){
    if(tickT){ clearInterval(tickT); tickT=null; }
    if(!start||!ok()) return;
    tickT=setInterval(function(){ if(ok()) noise(ctx.currentTime+0.01,0.012,0.035,4000,sfx); },190);
  }
  function bar(t,ci){
    var c=PROG[ci%4];
    /* warm pad: two detuned voices per note through a soft low-pass */
    var lp=ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1400; lp.Q.value=0.3;
    var pg=ctx.createGain(), L=E8*8; pg.gain.setValueAtTime(0.0001,t); pg.gain.linearRampToValueAtTime(0.16,t+0.35); pg.gain.setValueAtTime(0.16,t+L-0.25); pg.gain.linearRampToValueAtTime(0.0001,t+L+0.15);
    lp.connect(pg); pg.connect(mus);
    c.concat([c[0]-12]).forEach(function(n){ [-5,5].forEach(function(dt){ var o=ctx.createOscillator(); o.type='triangle'; o.frequency.value=hz(n); o.detune.value=dt; o.connect(lp); o.start(t); o.stop(t+L+0.2); }); });
  }
  function eighth(t,k,ci){
    var c=PROG[ci%4], pat=[0,1,2,1,0,2,1,2], n=c[pat[k%8]]+12;
    tone('triangle',hz(n),t,0.004,0.18,0.28,mus);           /* plucked arpeggio */
    tone('sine',hz(n+12),t,0.003,0.04,0.12,mus);
    noise(t,k%2?0.05:0.03,k%2?0.10:0.05,6500,mus);           /* shaker, accent off-beats */
    if(k===0||k===4) tone('sine',hz(c[0]-24),t,0.01,0.22,0.35,mus); /* soft low pulse */
  }
  function run(){
    while(nextT<ctx.currentTime+0.15){
      var ci=Math.floor(step/8), k=step%8;
      if(k===0) bar(nextT,ci);
      eighth(nextT,k,ci);
      nextT+=E8; step++;
    }
  }
  function musicStart(){
    if(!init()||!on) return;
    if(stopT){ clearTimeout(stopT); stopT=null; }
    var t=ctx.currentTime; mus.gain.cancelScheduledValues(t); mus.gain.setValueAtTime(mus.gain.value,t); mus.gain.linearRampToValueAtTime(0.035,t+0.8); /* bed sits ~20 dB under the chat sounds */
    if(playing) return; playing=true; step=0; nextT=t+0.08; run(); sched=setInterval(run,40);
  }
  function musicStop(fast){
    typing(false); if(!ctx||!playing) return;
    var t=ctx.currentTime, f=fast?0.08:0.5; mus.gain.cancelScheduledValues(t); mus.gain.setValueAtTime(mus.gain.value,t); mus.gain.linearRampToValueAtTime(0,t+f);
    stopT=setTimeout(function(){ clearInterval(sched); sched=null; playing=false; stopT=null; },f*1000+60);
  }
  function set(v){ on=!!v; try{ localStorage.setItem('ypa-sound',on?'1':'0'); }catch(e){} if(on){ init(); } else { musicStop(true); } }
  return {init:init,pop:pop,chime:chime,ding:ding,typing:typing,start:musicStart,stop:musicStop,set:set,isOn:function(){return on;},state:function(){return {on:on,playing:playing,ctx:ctx?ctx.state:null,music:mus?mus.gain.value:null};}};
})();
var sndBtn=d.getElementById('chat-snd');
function syncSnd(){ if(!sndBtn) return; var o=SND.isOn(); sndBtn.textContent=o?'🔊':'🔇'; sndBtn.setAttribute('aria-pressed',o?'true':'false'); sndBtn.setAttribute('aria-label',o?'Sound on. Tap to mute':'Sound off. Tap to turn on'); }
if(sndBtn){ syncSnd(); sndBtn.addEventListener('click',function(){ SND.set(!SND.isOn()); syncSnd(); if(SND.isOn()&&!modal.hidden) SND.start(); }); }
window.YPA_SND=SND;
function clear(){ timers.forEach(clearTimeout); timers=[]; if(window.YPA_SND) SND.typing(false); }
function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function scroll(){ log.scrollTop=log.scrollHeight; }
function bubble(m){
  var b=d.createElement('div');
  if(m.d){ b.className='chat-day'; b.textContent=m.d; }
  else { b.className='cb '+m.f+(m.s?' done':''); b.innerHTML=esc(m.t)+'<time>'+esc(m.at)+'</time>'; }
  log.appendChild(b); scroll();
  if(!m.d&&!RM){ if(m.f==='u') SND.pop(); else SND.chime(); if(m.s) SND.ding(); }
  if(m.s){ var c=steps.querySelector('[data-step="'+m.s+'"]'); if(c) c.classList.add('done'); }
}
function play(id){
  clear(); var j=JOBS[id]; if(!j) return;
  log.innerHTML=''; status.textContent='online';
  steps.innerHTML='<span class="cj"><i>'+j.icon+'</i>'+esc(j.title)+'</span>'+j.subs.map(function(s,k){return '<span class="cs" data-step="'+(k+1)+'">'+(k+1)+'. '+esc(s)+'</span>';}).join('');
  if(RM){ j.chat.forEach(bubble); return; }
  var t=350;
  j.chat.forEach(function(m){
    if(m.d){ timers.push(setTimeout(function(){bubble(m);},t)); t+=500; return; }
    if(m.f==='a'){
      var typ;
      timers.push(setTimeout(function(){ typ=d.createElement('div'); typ.className='cb a typing'; typ.innerHTML='<span></span><span></span><span></span>'; log.appendChild(typ); scroll(); status.textContent='typing…'; SND.typing(true); },t));
      t+=Math.min(1900,700+m.t.length*9);
      timers.push(setTimeout(function(){ if(typ&&typ.parentNode) typ.parentNode.removeChild(typ); status.textContent='online'; SND.typing(false); bubble(m); },t));
      t+=650;
    } else {
      t+=450; timers.push(setTimeout(function(){bubble(m);},t)); t+=750;
    }
  });
}
function syncPick(){
  if(!cur) return; var on=picks.indexOf(cur)>-1;
  pickBtn.setAttribute('aria-pressed',on?'true':'false');
  pickBtn.textContent = on ? '✓ In my 3 jobs' : (picks.length>=3 ? 'You have 3 jobs picked' : '+ Add to my 3 jobs');
  pickBtn.disabled = !on && picks.length>=3;
}
function renderPicks(){
  [].forEach.call(d.querySelectorAll('.jc'),function(li){ var b=li.querySelector('.orbit'); li.classList.toggle('picked',picks.indexOf(b.getAttribute('data-job'))>-1); });
  var names=picks.map(function(p){return JOBS[p].title;});
  var line=d.getElementById('picks-line'), pf=d.getElementById('picks-form');
  if(line){ line.hidden=!picks.length; line.innerHTML=picks.length? 'Your picks ('+picks.length+' of 3): <b>'+esc(names.join(' · '))+'</b> · <a href="#join">Reserve</a>' : ''; }
  if(pf){ pf.hidden=!picks.length; pf.textContent=picks.length? 'Your 3 jobs: '+names.join(', ') : ''; }
  var sel=d.getElementById('f-use');
  if(sel&&picks.length){ [].forEach.call(sel.options,function(o){ if(o.text===JOBS[picks[0]].title) sel.value=o.value; }); }
}
function open(id,btn){
  cur=id; opener=btn||null; var j=JOBS[id];
  sheet.style.setProperty('--c1',j.c1); sheet.style.setProperty('--c2',j.c2);
  modal.hidden=false; d.body.classList.add('chat-open');
  SND.init(); SND.start(); syncSnd();
  syncPick(); play(id);
  setTimeout(function(){ var x=modal.querySelector('.chat-x'); if(x) x.focus(); },30);
}
function close(){
  if(modal.hidden) return; clear(); SND.stop(); modal.hidden=true; d.body.classList.remove('chat-open'); cur=null;
  if(opener&&opener.focus) opener.focus();
}
[].forEach.call(d.querySelectorAll('.orbit[data-job]'),function(b){
  b.addEventListener('click',function(){ open(b.getAttribute('data-job'),b); });
});
[].forEach.call(modal.querySelectorAll('[data-close]'),function(x){ x.addEventListener('click',close); });
d.addEventListener('keydown',function(e){
  if(modal.hidden) return;
  if(e.key==='Escape'||e.key==='Esc'){ e.preventDefault(); close(); return; }
  if(e.key==='Tab'){ var f=[].slice.call(sheet.querySelectorAll('button:not([disabled])')); if(!f.length) return;
    var first=f[0], last=f[f.length-1];
    if(e.shiftKey&&d.activeElement===first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey&&d.activeElement===last){ e.preventDefault(); first.focus(); } }
});
replay.addEventListener('click',function(){ if(cur) play(cur); });
pickBtn.addEventListener('click',function(){
  if(!cur) return; var i=picks.indexOf(cur);
  if(i>-1) picks.splice(i,1); else if(picks.length<3) picks.push(cur);
  syncPick(); renderPicks();
});
/* settle entrance delays once landed, so hover reacts at once */
[].forEach.call(d.querySelectorAll('.jc'),function(li){
  var mo=new MutationObserver(function(){ if(li.classList.contains('in')){ setTimeout(function(){li.classList.add('settled');},1800); mo.disconnect(); } });
  mo.observe(li,{attributes:true,attributeFilter:['class']});
});
window.YPA_PICKS=function(){ return picks.map(function(p){return JOBS[p].title;}); };
window.YPA_OPEN=open; window.YPA_CLOSE=close;
})();

/* v10: hero showcase video, lazy-loaded, muted autoplay, tap to unmute */
(function(){
  var v=document.getElementById('hero-video'), b=document.getElementById('hero-video-snd');
  if(!v) return;
  var loaded=false;
  function load(){ if(loaded) return; loaded=true; v.src=v.getAttribute('data-src'); v.load(); }
  function play(){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); }
  if('IntersectionObserver' in window){
    var vio=new IntersectionObserver(function(ents){ ents.forEach(function(en){
      if(en.isIntersecting){ load(); play(); } else if(loaded){ v.pause(); }
    }); },{rootMargin:'200px 0px'});
    vio.observe(v);
  } else { load(); play(); }
  function sync(){ var on=!v.muted;
    b.setAttribute('aria-pressed',on?'true':'false');
    b.setAttribute('aria-label',on?'Video sound is on. Tap to mute':'Video sound is off. Tap to turn it on');
    b.querySelector('.hv-i').textContent=on?'🔇':'🔊';
    b.querySelector('.hv-t').textContent=on?'Mute':'Tap for sound';
    b.classList.toggle('on',on); }
  if(b){ b.addEventListener('click',function(){ load(); v.muted=!v.muted; if(!v.muted){ v.volume=1; } play(); sync(); }); sync(); }
})();
