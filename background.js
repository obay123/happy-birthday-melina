(function(){
  const c=document.getElementById('bg'),x=c.getContext('2d');
  let w,h,stars=[],petals=[],shots=[];
  const R=Math.random;
  function size(){
    const d=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);
    stars=Array.from({length:Math.floor(w*h/5500)},()=>({x:R()*w,y:R()*h*.75,r:.4+R()*1.5,s:R()*6,f:.5+R()*2}));
    petals=Array.from({length:Math.min(26,Math.floor(w/22))},()=>newPetal(true));
  }
  function newPetal(any){return{x:R()*w,y:any?R()*h:-20,s:7+R()*9,vy:.5+R()*.9,vx:.3+R()*.8,a:R()*6,va:(R()-.5)*.03,f:R()*6,ff:.02+R()*.03,h:330+R()*20};}
  function petal(p){
    x.save();x.translate(p.x,p.y);x.rotate(p.a);x.scale(Math.cos(p.f),1);
    const g=x.createLinearGradient(0,-p.s,0,p.s);g.addColorStop(0,`hsl(${p.h},100%,92%)`);g.addColorStop(1,`hsl(${p.h},85%,72%)`);
    x.fillStyle=g;x.shadowColor='rgba(255,150,200,.7)';x.shadowBlur=8;
    x.beginPath();x.moveTo(0,-p.s);x.bezierCurveTo(p.s,-p.s*.6,p.s*.9,p.s*.6,0,p.s);x.bezierCurveTo(-p.s*.9,p.s*.6,-p.s,-p.s*.6,0,-p.s);
    x.fill();x.restore();
  }
  let last=0;
  function draw(t){
    x.clearRect(0,0,w,h);
    const P=window.PX||{x:0,y:0},sx=-P.x*24,sy=-P.y*16;
    for(const s of stars){
      const a=.35+.65*Math.abs(Math.sin(t/1000*s.f+s.s));
      x.fillStyle=`rgba(255,250,235,${a})`;x.beginPath();x.arc(s.x+sx,s.y+sy,s.r,0,7);x.fill();
    }
    if(t-last>3500+R()*3000){last=t;shots.push({x:R()*w*.8+w*.2,y:R()*h*.3,l:0});}
    shots=shots.filter(s=>s.l<1);
    for(const s of shots){
      s.l+=.018;const px=s.x-s.l*260,py=s.y+s.l*140;
      const g=x.createLinearGradient(px,py,px+90,py-49);g.addColorStop(0,'rgba(255,255,255,'+(1-s.l)+')');g.addColorStop(1,'rgba(255,255,255,0)');
      x.strokeStyle=g;x.lineWidth=2.4;x.lineCap='round';x.beginPath();x.moveTo(px,py);x.lineTo(px+90,py-49);x.stroke();
    }
    for(const p of petals){
      p.y+=p.vy;p.x+=p.vx+Math.sin(t/900+p.f)*.6;p.a+=p.va;p.f+=p.ff;
      if(p.y>h+20||p.x>w+30)Object.assign(p,newPetal(false),{x:R()*w-w*.2});
      x.save();x.translate(-P.x*70,-P.y*40);petal(p);x.restore();
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',size);size();requestAnimationFrame(draw);
})();
