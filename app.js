/* ===== CONFIGURACIÓN: edita solo este bloque ===== */
const CONFIG = {
  whatsappNumber: "527713651318", // 52 + 10 dígitos. Verifica que sea el correcto.
  telDisplay: "+52 771 365 1318",
  mapsQuery: "Av. San Javier, Privadas Santa Matilde, Acayuca, Hidalgo, México",
  // Para precisión exacta: en Google Maps > Compartir > Insertar un mapa, copia solo la URL del src y pégala aquí.
  mapsEmbedUrl: "",
  /* Testimonios REALES: agrega objetos {texto:"...", nombre:"..."}. Vacío = se muestra una invitación en lugar de reseñas. */
  testimonios: []
};
const $=s=>document.querySelector(s);
$("#year").textContent=new Date().getFullYear();

/* UTMs en sesión */
const KEYS=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid"];
try{const p=new URLSearchParams(location.search);KEYS.forEach(k=>{if(p.get(k))sessionStorage.setItem(k,p.get(k))})}catch(e){}
const utms=()=>{const o={};try{KEYS.forEach(k=>{const v=sessionStorage.getItem(k);if(v)o[k]=v})}catch(e){}return o};
window.dataLayer=window.dataLayer||[];
const track=(event,d={})=>window.dataLayer.push({event,...d});
track("landing_view");
document.addEventListener("click",e=>{const t=e.target.closest("[data-track]");if(t)track(t.dataset.track)});

/* Menú */
const burger=$("#burger"),menu=$("#menu");
burger.addEventListener("click",()=>{const o=menu.classList.toggle("open");burger.setAttribute("aria-expanded",o)});
menu.addEventListener("click",e=>{if(e.target.tagName==="A"){menu.classList.remove("open");burger.setAttribute("aria-expanded","false")}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")menu.classList.remove("open")});

/* WhatsApp y mapa */
const wa=`https://wa.me/${CONFIG.whatsappNumber}`;
$("#telLink").textContent=CONFIG.telDisplay;
["#telLink","#waFooter","#waDirect"].forEach(id=>{const a=$(id);a.href=wa+"?text="+encodeURIComponent("Hola, me gustaría agendar una cita para un tatuaje.");a.target="_blank";a.rel="noopener"});
$("#map").src=CONFIG.mapsEmbedUrl||`https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&output=embed`;

/* Testimonios: solo reales */
const t=$("#testi");
if(CONFIG.testimonios.length){
  t.className="testi";
  CONFIG.testimonios.forEach(x=>{const b=document.createElement("blockquote");const p=document.createElement("p");p.textContent="“"+x.texto+"”";const c=document.createElement("cite");c.textContent=x.nombre;b.append(p,c);t.append(b)});
}else{
  t.innerHTML='<p class="empty">Pronto compartiremos aquí las opiniones de quienes ya se tatuaron con nosotros. ¿Ya te tatuaste en Malafama? Cuéntanos cómo te fue por WhatsApp.</p>';
}

/* Carrusel animado */
const track_=$("#track"),slides=[...track_.children],dots=$("#dots"),pauseBtn=$("#pause");
let idx=0,timer=null,paused=matchMedia("(prefers-reduced-motion:reduce)").matches;
slides.forEach((_,i)=>{const b=document.createElement("button");b.setAttribute("aria-label","Ir a la imagen "+(i+1));b.onclick=()=>go(i);dots.append(b)});
function go(i){idx=(i+slides.length)%slides.length;const s=slides[idx];track_.scrollTo({left:s.offsetLeft-(track_.clientWidth-s.clientWidth)/2,behavior:"smooth"});mark()}
function mark(){[...dots.children].forEach((d,i)=>d.setAttribute("aria-current",i===idx));slides.forEach((s,i)=>s.classList.toggle("active",i===idx))}
function nearest(){const c=track_.scrollLeft+track_.clientWidth/2;let best=0,bd=1e9;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft+s.clientWidth/2-c);if(d<bd){bd=d;best=i}});idx=best;mark()}
let st;track_.addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(nearest,80)});
document.querySelector(".prev").onclick=()=>go(idx-1);
document.querySelector(".next").onclick=()=>go(idx+1);
function play(){stop();if(!paused)timer=setInterval(()=>go(idx+1),3500)}
function stop(){clearInterval(timer)}
pauseBtn.onclick=()=>{paused=!paused;pauseBtn.setAttribute("aria-pressed",paused);pauseBtn.textContent=paused?"Reanudar animación":"Pausar animación";paused?stop():play()};
const car=document.querySelector(".car");
["mouseenter","focusin","touchstart"].forEach(e=>car.addEventListener(e,stop,{passive:true}));
["mouseleave","focusout"].forEach(e=>car.addEventListener(e,play));
document.addEventListener("visibilitychange",()=>document.hidden?stop():play());
track_.addEventListener("keydown",e=>{if(e.key==="ArrowRight")go(idx+1);if(e.key==="ArrowLeft")go(idx-1)});
if(paused){pauseBtn.textContent="Reanudar animación";pauseBtn.setAttribute("aria-pressed","true")}
mark();play();

/* Formulario */
const form=$("#leadForm");
function setErr(id,m){const f=$("#"+id);$("#e-"+id).textContent=m||"";f.setAttribute("aria-invalid",m?"true":"false")}
function telMX(v){let d=v.replace(/\D/g,"");if(d.startsWith("521")&&d.length===13)d=d.slice(3);else if(d.startsWith("52")&&d.length===12)d=d.slice(2);return /^\d{10}$/.test(d)?d:null}
form.addEventListener("submit",e=>{
  e.preventDefault();$("#status").classList.remove("show");
  const f=Object.fromEntries(new FormData(form));let ok=true;const tel=telMX(f.whatsapp||"");
  if(!(f.nombre||"").trim()){setErr("nombre","Escribe tu nombre.");ok=false}else setErr("nombre");
  if(!tel){setErr("whatsapp","Ingresa un número de 10 dígitos.");ok=false}else setErr("whatsapp");
  if(!f.estilo){setErr("estilo","Selecciona una opción.");ok=false}else setErr("estilo");
  if((f.idea||"").trim().length<10){setErr("idea","Cuéntanos un poco más (mínimo 10 caracteres).");ok=false}else setErr("idea");
  if(!$("#edad").checked){setErr("edad","Confirma que eres mayor de edad.");ok=false}else setErr("edad");
  if(!$("#consent").checked){setErr("consent","Debes aceptar el Aviso de Privacidad.");ok=false}else setErr("consent");
  if(!ok){form.querySelector("[aria-invalid=true]").focus();return}
  const u=utms(),origen=Object.keys(u).length?"\nOrigen: "+Object.entries(u).map(([k,v])=>k+"="+v).join(", "):"";
  const msg=`Hola, quiero agendar una cita.\n\nNombre: ${f.nombre.trim()}\nWhatsApp: ${tel}\nEstilo: ${f.estilo}\nZona: ${(f.zona||"").trim()||"Por definir"}\nTamaño: ${(f.tamano||"").trim()||"Por definir"}\nIdea: ${f.idea.trim()}\nFecha: ${f.fecha}${origen}`;
  track("whatsapp_click",{source:"form"});
  window.open(wa+"?text="+encodeURIComponent(msg),"_blank","noopener");
  const s=$("#status");s.textContent="Abrimos WhatsApp con tu mensaje. Envíalo desde ahí para que lo recibamos.";s.classList.add("show");
});
