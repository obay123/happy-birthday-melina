// Visit counter (GoatCounter).
// Open the site once with #obai at the end of the link on each of your own
// devices; from then on that device's visits show up as "OBAI" in the dashboard.
(function(){
  const CODE='obai';
  let me=false;
  try{
    if(location.hash==='#obai'){localStorage.setItem('gc_me','1');history.replaceState(null,'',location.pathname+location.search);}
    if(location.hash==='#not-obai'){localStorage.removeItem('gc_me');history.replaceState(null,'',location.pathname+location.search);}
    me=localStorage.getItem('gc_me')==='1';
  }catch(e){}
  const tag=me?'OBAI ':'';

  window.goatcounter={path:p=>me?'/obai-visit':p,title:(me?'OBAI visit':'Visit')};
  window.trackEvent=name=>{
    try{window.goatcounter.count&&window.goatcounter.count({path:tag+name,title:tag+name,event:true});}catch(e){}
  };

  if(CODE==='GOATCOUNTER_CODE'||/^localhost$|^127\./.test(location.hostname))return;
  const s=document.createElement('script');
  s.async=true;s.src='https://gc.zgo.at/count.js';
  s.dataset.goatcounter='https://'+CODE+'.goatcounter.com/count';
  document.head.appendChild(s);
})();
