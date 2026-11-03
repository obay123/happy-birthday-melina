// Cursor trail, custom cursor and parallax.
(function(){
  const root=document.documentElement;
  const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
  const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared, smoothed mouse position (-0.5..0.5) for parallax.
  const P=window.PX={x:0,y:0,tx:0,ty:0};
  let mx=innerWidth/2,my=innerHeight/2;

  /* ---------- Custom cursor (mouse only) ---------- */
  let dot,ring,rx=mx,ry=my;
  if(fine){
    root.classList.add('has-cursor');
    dot=document.createElement('div');dot.className='cur-dot';
    ring=document.createElement('div');ring.className='cur-ring';
    document.body.append(ring,dot);
    const hot='a,button,.polaroid,.card-wrap,.stack';
    document.addEventListener('pointerover',e=>{if(e.target.closest(hot))ring.classList.add('hot');});
    document.addEventListener('pointerout',e=>{if(e.target.closest(hot)&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest(hot)))ring.classList.remove('hot');});
    addEventListener('pointerdown',()=>ring.classList.add('down'));
    addEventListener('pointerup',()=>ring.classList.remove('down'));
    document.addEventListener('mouseleave',()=>root.classList.add('cur-out'));
    document.addEventListener('mouseenter',()=>root.classList.remove('cur-out'));
  }

  /* ---------- Trail ---------- */
  const c=document.createElement('canvas');c.className='trail';document.body.append(c);
  const x=c.getContext('2d');let w,h,parts=[];
  function size(){const d=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);}
  size();addEventListener('resize',size);
  const cols=['#ffd27a','#fff4c9','#ff9ccc','#7fe7ff'];
  function spawn(px,py,n,burst){
    if(calm)return;
    for(let i=0;i<n&&parts.length<320;i++){
      const heart=Math.random()<.3,a=Math.random()*Math.PI*2,sp=burst?1.5+Math.random()*3.5:Math.random()*.9;
      parts.push({x:px+(Math.random()-.5)*6,y:py+(Math.random()-.5)*6,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-(burst?1:.25),
        s:heart?6+Math.random()*5:4+Math.random()*6,r:Math.random()*6,vr:(Math.random()-.5)*.15,
        life:1,decay:.012+Math.random()*.014,heart,col:heart?(Math.random()<.5?'#ff7eb6':'#ff9ccc'):cols[Math.random()*cols.length|0]});
    }
  }
  function star(p){
    const s=p.s;x.beginPath();
    for(let i=0;i<8;i++){const rr=i%2?s*.32:s,a=i*Math.PI/4;x.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}
    x.closePath();x.fill();
  }
  function heart(p){
    const s=p.s/10;x.scale(s,s);x.beginPath();
    x.moveTo(0,3);x.bezierCurveTo(-10,-4,-5,-11,0,-5);x.bezierCurveTo(5,-11,10,-4,0,3);x.fill();
  }
  let lx=null,ly=null;
  function move(px,py){
    if(lx!==null){const d=Math.hypot(px-lx,py-ly);spawn(px,py,Math.min(4,Math.floor(d/9)+(d>2?1:0)));}
    lx=px;ly=py;
  }
  addEventListener('pointermove',e=>{
    mx=e.clientX;my=e.clientY;
    P.tx=mx/innerWidth-.5;P.ty=my/innerHeight-.5;
    root.classList.remove('cur-out');
    move(mx,my);
  },{passive:true});
  addEventListener('touchmove',e=>{const t=e.touches[0];if(t)move(t.clientX,t.clientY);},{passive:true});
  addEventListener('touchend',()=>{lx=ly=null;},{passive:true});
  addEventListener('pointerdown',e=>spawn(e.clientX,e.clientY,16,true));

  /* ---------- Parallax (scroll for everyone) ---------- */
  function onScroll(){root.style.setProperty('--sy',Math.min(scrollY/innerHeight,4).toFixed(3));}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  /* ---------- One animation loop ---------- */
  function loop(){
    // ease the parallax values so layers glide
    P.x+=(P.tx-P.x)*.06;P.y+=(P.ty-P.y)*.06;
    root.style.setProperty('--mx',P.x.toFixed(4));
    root.style.setProperty('--my',P.y.toFixed(4));

    if(fine){
      rx+=(mx-rx)*.18;ry+=(my-ry)*.18;
      dot.style.transform=`translate(${mx}px,${my}px)`;
      ring.style.transform=`translate(${rx}px,${ry}px)`;
    }

    x.clearRect(0,0,w,h);
    parts=parts.filter(p=>p.life>0);
    for(const p of parts){
      p.x+=p.vx;p.y+=p.vy;p.vy+=.03;p.vx*=.97;p.r+=p.vr;p.life-=p.decay;
      x.save();x.globalAlpha=Math.max(p.life,0);x.translate(p.x,p.y);x.rotate(p.heart?0:p.r);
      x.fillStyle=p.col;x.shadowColor=p.col;x.shadowBlur=10;
      const k=.4+.6*p.life;x.scale(k,k);
      p.heart?heart(p):star(p);
      x.restore();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
