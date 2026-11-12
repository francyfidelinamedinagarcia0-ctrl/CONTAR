document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("#header");
  const progress = document.querySelector(".scroll-progress");
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  const heroLayers = [...document.querySelectorAll(".hero-layer")];
  const marqueeRows = [...document.querySelectorAll("[data-marquee]")];
  const parallaxStrip = document.querySelector(".parallax-strip");
  const team = document.querySelector(".team");
  const teamBg = document.querySelector("[data-team-bg]");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Menú */
  const closeMenu = () => {
    nav?.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  };
  menu?.addEventListener("click", () => {
    const open = !nav.classList.contains("open");
    nav.classList.toggle("open", open);
    menu.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(a => a.addEventListener("click", closeMenu));

  /* Reveal */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }
    });
  }, {threshold:.12});
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* Parallax fluido de la portada.
     Importante: las seis capas usan exactamente los PNG alineados
     que entregó la usuaria. No se redibuja texto ni se superpone
     otra portada, evitando el desenfoque. La segunda copia de letra
     se conserva como recurso pero no se apila. */
  let targetPX=0,targetPY=0,currentPX=0,currentPY=0;
  window.addEventListener("pointermove", e => {
    if(reduce) return;
    targetPX = (e.clientX / innerWidth - .5) * 2;
    targetPY = (e.clientY / innerHeight - .5) * 2;
  }, {passive:true});

  function frame(){
    currentPX += (targetPX-currentPX)*0.06;
    currentPY += (targetPY-currentPY)*0.06;

    const hero = document.querySelector(".hero");
    const r = hero.getBoundingClientRect();
    const view = innerHeight;
    const progressHero = Math.max(-1,Math.min(1,(r.top + r.height/2 - view/2)/Math.max(view,r.height)));
    const t = performance.now()/1000;

    /* Parallax por scroll: cada capa baja scrollY * velocidad (data-depth) */
    const sc = window.scrollY;
    heroLayers.forEach(layer => {
      const d = parseFloat(layer.dataset.depth || "0.1");
      layer.style.setProperty("--x", "0px");
      layer.style.setProperty("--y", (sc * d).toFixed(2)+"px");
      layer.style.setProperty("--s", "1.02");
    });

    if(parallaxStrip && marqueeRows.length){
      const sr = parallaxStrip.getBoundingClientRect();
      const sp = Math.max(-1,Math.min(1,(sr.top+sr.height/2-view/2)/Math.max(view,sr.height)));
      marqueeRows.forEach(row=>{
        const speed = parseFloat(row.dataset.speed || "1");
        row.style.setProperty("--mx", (-sp * 130 * speed).toFixed(2)+"px");
      });
    }

    if(team && teamBg){
      const tr=team.getBoundingClientRect();
      const tp=Math.max(-1,Math.min(1,(tr.top+tr.height/2-view/2)/Math.max(view,tr.height)));
      const tx=currentPX*7, ty=-tp*24+currentPY*4;
      teamBg.style.transform=`translate3d(${tx.toFixed(2)}px,${ty.toFixed(2)}px,0) scale(1.08)`;
    }
    requestAnimationFrame(frame);
  }
  if(reduce){
    heroLayers.forEach(l=>{l.style.setProperty("--x","0px");l.style.setProperty("--y","0px");l.style.setProperty("--s","1.01")});
    marqueeRows.forEach(row=>row.style.setProperty("--mx","0px"));
  } else requestAnimationFrame(frame);

  /* UI de scroll */
  function ui(){
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.width=(max>0?(scrollY/max)*100:0)+"%";
    header?.classList.toggle("scrolled",scrollY>35);
  }
  addEventListener("scroll",ui,{passive:true}); ui();

  /* Navegación activa */
  const links=[...document.querySelectorAll(".nav a:not(.nav-cta)")];
  const sections=[...document.querySelectorAll("main section[id]")];
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      links.forEach(l=>l.classList.toggle("active",l.getAttribute("href")==="#"+e.target.id));
    });
  },{rootMargin:"-40% 0px -50% 0px"});
  sections.forEach(s=>io.observe(s));

  /* Microinteracción tarjetas */
  if(!reduce){
    document.querySelectorAll(".service-card,.process-card").forEach(card=>{
      card.addEventListener("pointermove",e=>{
        const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(900px) rotateX(${(-y*2.5).toFixed(2)}deg) rotateY(${(x*2.5).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener("pointerleave",()=>card.style.transform="");
    });
  }
});
