(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&c(l)}).observe(document,{childList:!0,subtree:!0});function s(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(e){if(e.ep)return;e.ep=!0;const n=s(e);fetch(e.href,n)}})();document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("navbar"),o=document.getElementById("menuToggle"),s=document.querySelector(".nav-links"),c=document.querySelectorAll(".nav-link"),e=document.getElementById("contactForm");window.addEventListener("scroll",()=>{window.scrollY>50?t.classList.add("scrolled"):t.classList.remove("scrolled")}),o.addEventListener("click",()=>{o.classList.toggle("active"),s.classList.toggle("active")}),c.forEach(i=>{i.addEventListener("click",()=>{c.forEach(r=>r.classList.remove("active")),i.classList.add("active"),o.classList.remove("active"),s.classList.remove("active")})});const n={threshold:.1,rootMargin:"0px 0px -50px 0px"},l=new IntersectionObserver(i=>{i.forEach(r=>{r.isIntersecting&&r.target.classList.add("active")})},n);document.querySelectorAll(".section-header, .service-card, .client-card, .story-card").forEach(i=>{i.classList.add("reveal"),l.observe(i)});const m=document.querySelectorAll("section[id]");window.addEventListener("scroll",()=>{const i=window.pageYOffset;m.forEach(r=>{const a=r.offsetHeight,g=r.offsetTop-100,v=r.getAttribute("id");i>g&&i<=g+a&&c.forEach(f=>{f.classList.remove("active"),f.getAttribute("href")===`#${v}`&&f.classList.add("active")})})}),e&&e.addEventListener("submit",i=>{i.preventDefault();const r=document.getElementById("name").value,a=document.getElementById("email").value,g=document.getElementById("message").value,v=`mailto:mahakbalar@example.com?subject=New Inquiry from ${encodeURIComponent(r)}&body=${encodeURIComponent(g)}%0D%0A%0D%0AFrom: ${encodeURIComponent(a)}`;window.location.href=v,e.reset()}),document.querySelectorAll('a[href^="#"]').forEach(i=>{i.addEventListener("click",function(r){r.preventDefault();const a=document.querySelector(this.getAttribute("href"));a&&a.scrollIntoView({behavior:"smooth",block:"start"})})})});async function y(){try{const o=await(await fetch("/data/clients.json")).json(),s=document.getElementById("clientsGrid");if(!s)return;o.forEach(e=>{const n=document.createElement("div");n.className="client-card reveal";const l=e.impact.map(g=>`<li>${g}</li>`).join(""),d=e.images||(e.image?[e.image]:[]),m=d[0],i=d.length-1,r=i>0?`<div class="image-badge">+${i}</div>`:"",a=m?`
        <div class="image-container">
          <img 
            src="/img/${m}" 
            alt="${e.name}" 
            class="client-image" 
            data-all-images='${JSON.stringify(d)}'
            data-client-name="${e.name}"
          >
          ${r}
        </div>
      `:"";n.innerHTML=`
        <div class="client-header">
          <h3 class="client-name">${e.name}</h3>
          <p class="client-handle">${e.handle}</p>
        </div>
        <span class="client-role">${e.role}</span>
        <p class="client-description">${e.description}</p>
        <div class="client-impact">
          <h4>Impact</h4>
          <ul>
            ${l}
          </ul>
        </div>
        <div class="client-media">
          ${a}
        </div>
      `,s.appendChild(n)}),document.addEventListener("click",e=>{if(e.target.classList.contains("client-image")){const n=JSON.parse(e.target.dataset.allImages),l=e.target.dataset.clientName;L(n,l,0)}});const c=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&n.target.classList.add("active")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".client-card").forEach(e=>{c.observe(e)})}catch(t){console.error("Error loading clients:",t)}}function L(t,o,s=0){const c=document.getElementById("imageLightbox");c&&c.remove();const e=document.createElement("div");e.id="imageLightbox",e.className="lightbox",e.innerHTML=`
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" id="lightboxClose">&times;</button>
      ${t.length>1?`
        <button class="lightbox-nav lightbox-prev" id="lightboxPrev">&#10094;</button>
        <button class="lightbox-nav lightbox-next" id="lightboxNext">&#10095;</button>
        <div class="image-counter" id="imageCounter"></div>
      `:""}
      <div class="lightbox-gallery" id="lightboxGallery"></div>
    </div>
  `,document.body.appendChild(e),e.dataset.allImages=JSON.stringify(t),e.dataset.currentIndex=s,e.dataset.totalImages=t.length,b(s,t),e.classList.add("active");const n=document.getElementById("lightboxClose");n.onclick=d=>{d.stopPropagation(),u()};const l=e.querySelector(".lightbox-overlay");if(l.onclick=()=>{u()},e.onclick=d=>{d.target===e&&u()},t.length>1){const d=document.getElementById("lightboxPrev"),m=document.getElementById("lightboxNext");d.onclick=a=>{a.stopPropagation(),h(-1,t,e)},m.onclick=a=>{a.stopPropagation(),h(1,t,e)};let i=0,r=0;e.addEventListener("touchstart",a=>{i=a.changedTouches[0].screenX},!1),e.addEventListener("touchend",a=>{r=a.changedTouches[0].screenX,E(i,r,t,e)},!1)}document.removeEventListener("keydown",p),document.addEventListener("keydown",p)}function b(t,o){const s=document.getElementById("imageLightbox"),c=document.getElementById("lightboxGallery");c.innerHTML=`<img src="/img/${o[t]}" alt="Image ${t+1}" class="gallery-image fullscreen-image">`;const e=document.getElementById("imageCounter");e&&(e.textContent=`${t+1} / ${o.length}`),s.dataset.currentIndex=t}function h(t,o,s){let c=parseInt(s.dataset.currentIndex);c+=t,c<0?c=o.length-1:c>=o.length&&(c=0),b(c,o)}function E(t,o,s,c){const n=t-o;Math.abs(n)>50&&(n>0?h(1,s,c):h(-1,s,c))}function p(t){const o=document.getElementById("imageLightbox");if(!(!o||!o.classList.contains("active"))){if(t.key==="Escape")u();else if(t.key==="ArrowLeft"){JSON.parse(o.dataset.allImages);const s=document.getElementById("lightboxPrev");s&&s.click()}else if(t.key==="ArrowRight"){JSON.parse(o.dataset.allImages);const s=document.getElementById("lightboxNext");s&&s.click()}}}function u(){const t=document.getElementById("imageLightbox");t&&t.classList.remove("active")}document.addEventListener("DOMContentLoaded",y);async function x(){try{const o=await(await fetch("/data/stories.json")).json(),s=document.getElementById("storiesGrid");if(!s)return;o.forEach(e=>{const n=document.createElement("div");n.className="story-card reveal",n.innerHTML=`
        <p class="story-text">"${e.text}"</p>
        <p class="story-client">— ${e.client}</p>
      `,s.appendChild(n)});const c=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&n.target.classList.add("active")})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});document.querySelectorAll(".story-card").forEach(e=>{c.observe(e)})}catch(t){console.error("Error loading stories:",t)}}document.addEventListener("DOMContentLoaded",x);
