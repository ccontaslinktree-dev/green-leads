import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useRef, type MouseEvent } from 'react';
import { initializeTracking, trackEvent } from '@/lib/office-tracking';
import { fishingOffer, fishingPlans, type FishingPlanId } from '@/data/pescador-offer';
import { MiniVsl } from '@/components/pescador/MiniVsl';
import { SocialProof } from '@/components/pescador/SocialProof';
import { fishingMiniVsl } from '@/data/pescador-proof';
export const Route = createFileRoute('/')({ component: FishingPage });
function CheckoutButton({plan}:{plan:FishingPlanId}) {
 const entry = fishingPlans[plan];
 const ready = typeof entry.checkoutUrl === 'string' && entry.checkoutUrl.startsWith('https://pay.hotmart.com/');
 const checkout=()=>{
  if(!ready||!entry.checkoutUrl)return;
  const url=new URL(entry.checkoutUrl);
  new URLSearchParams(window.location.search).forEach((v,k)=>{if(!k.startsWith('__lovable_')&&!url.searchParams.has(k))url.searchParams.set(k,v);});
  trackEvent('InitiateCheckout',{content_name:entry.name,plan_id:plan,currency:'USD',value:entry.priceUSD});
  window.location.assign(url.toString());
 };
 return <button className={`button checkout ${plan==='basico'?'secondary':''}`} disabled={!ready} onClick={checkout}>QUIERO EL PAQUETE {plan==='completo'?'COMPLETO':'BÁSICO'}</button>;
}
function VisualGuides(){
 const guides=[
  {src:'peces-y-carnadas',alt:'Guía visual de lobina, trucha arcoíris y carpa con opciones de carnadas y señuelos',title:'CONOCE EL PEZ. ELIGE TU CARNADA.'},
  {src:'agua-y-senuelos',alt:'Guía visual para ajustar el señuelo según agua clara, agua turbia y poca luz',title:'LEE EL AGUA. CAMBIA CON UN MOTIVO.'},
  {src:'tipos-de-linea',alt:'Comparación visual de monofilamento, línea trenzada y fluorocarbono',title:'ENTIENDE LA LÍNEA QUE ESTÁS USANDO.'},
 ];
 return <section className="section visual-guides" aria-labelledby="visual-guides-title"><div className="wrap"><div className="center"><span className="eyebrow">ASÍ APRENDES DENTRO DEL MANUAL</span><h2 id="visual-guides-title">DEJA DE ADIVINAR.<br/><em>MIRA QUÉ CAMBIAR.</em></h2><p className="intro">Peces, carnadas y equipo: aprende a conectar cada decisión antes de lanzar.</p></div><div className="visual-guides-grid">{guides.map(g=><figure key={g.src}><img src={`/pescador/guias-visuales/${g.src}.webp`} alt={g.alt} width="1024" height="1536" loading="lazy" decoding="async"/><figcaption>{g.title}</figcaption></figure>)}</div><div className="center visual-guides-action"><p>Son ejemplos de lo que estudias. En el Completo tienes <strong>500 enseñanzas en 10 categorías.</strong></p><a className="button" href="#planes">QUIERO APRENDER A ELEGIR MEJOR</a></div></div></section>;
}
function FishingPage(){
 const prompt=useRef<HTMLDialogElement>(null);
 useEffect(()=>{initializeTracking();trackEvent('ViewContent',{content_name:fishingOffer.name,currency:'USD',value:fishingPlans.completo.priceUSD});},[]);
 useEffect(()=>{
  let seen=false;try{seen=sessionStorage.getItem('pescador-preparacion')==='shown';}catch{}
  if(seen)return;let stopped=false;let timer:ReturnType<typeof setTimeout>;
  const show=()=>{if(stopped)return;if(document.hidden||Array.from(document.querySelectorAll('video[data-mini-vsl]')).some(v=>!(v as HTMLVideoElement).paused)){timer=setTimeout(show,1000);return;}prompt.current?.showModal();try{sessionStorage.setItem('pescador-preparacion','shown');}catch{}};
  timer=setTimeout(show,5000);return()=>{stopped=true;clearTimeout(timer);};
 },[]);
 const closePrompt=()=>prompt.current?.close();
 const continueReading=()=>{closePrompt();const el=document.getElementById('preparacion');el?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});el?.focus({preventScroll:true});};
 const trackPlanScroll=(e:MouseEvent<HTMLDivElement>)=>{if((e.target as HTMLElement).closest('a[href="#planes"]'))trackEvent('ClickParaOferta',{content_name:fishingOffer.name});};
 return <div className="fishing-page" onClick={trackPlanScroll}>

<div className="topbar">500 ENSEÑANZAS PARA TU PRÓXIMA SALIDA <span>COMPLETO US$ 4,50</span></div>
<main>
<section className="hero"><div className="wrap center"><div className="brand"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M25 5v20a10 10 0 1 1-20 0v-7l7 7M25 5h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>PESCADOR PRÁCTICO</div><span className="eyebrow">PARA PRINCIPIANTES E INTERMEDIOS · ESPAÑOL LATAM</span><h1>¿BUSCAS PECES MÁS GRANDES?<br/>EMPIEZA POR TU PREPARACIÓN.</h1><MiniVsl/><p className="hero-sub"><strong>Aprende qué carnada elegir, qué nudo usar y cómo hacerlo.</strong> 500 enseñanzas organizadas para preparar mejor tu equipo y tu próxima pesca.</p>{!fishingMiniVsl.src&&<><img className="hero-image" src="/pescador/plataforma.webp" width="1536" height="1024" alt="Vista ilustrativa de la plataforma de pesca organizada por categorías en tablet y celular" fetchPriority="high"/><p className="caption light">Vista ilustrativa de la organización por categorías. Acceso digital; no incluye dispositivos ni equipo de pesca.</p></>}<div className="trust"><span>Consulta en tu celular</span><span>Ejemplos para aplicar</span><span>Categorías para cada duda</span></div></div></section>

<section className="section pain" id="preparacion" tabIndex={-1}><div className="wrap center"><span className="eyebrow">TU PRÓXIMA SALIDA EMPIEZA AQUÍ</span><h2>¿OTRA CARNADA?<br/><em>PRIMERO ENTIENDE QUÉ ESTÁ FALLANDO.</em></h2><p className="intro">Deja de cambiar todo al azar. Aprende qué pez buscas, qué presentar y cómo preparar tu equipo.</p><a className="button button-lime" href="#planes">QUIERO DEJAR DE IMPROVISAR</a></div></section>

<VisualGuides />

<section className="section soft compact-bonuses"><div className="wrap center"><span className="eyebrow">EL COMPLETO VA MÁS ALLÁ</span><h2>DEL NUDO AL CORTE.<br/><em>TODO EN SU CATEGORÍA.</em></h2><p className="intro">500 enseñanzas de equipo, nudos, peces, carnadas, lectura del agua, lanzamiento, captura, limpieza y conservación.</p><div className="bonus-pills"><span>+ Guía de peces y carnadas</span><span>+ Fichas rápidas de consulta</span><span>+ Plan y bitácora</span></div><p className="complete-upgrade">Por <strong>US$ 0,50 más que el Básico</strong>, llevas 200 enseñanzas adicionales y los 3 bonos.</p></div></section>

<SocialProof />

<section className="section platform-delivery" aria-labelledby="platform-delivery-title"><div className="wrap"><div className="center"><span className="eyebrow">ESTO RECIBES EN EL COMPLETO</span><h2 id="platform-delivery-title">BASTA DE CONSEJOS SUELTOS.<br/><em>APRENDE QUÉ HACER CUANDO ESTÁS FRENTE AL AGUA.</em></h2><p className="intro"><strong>500 enseñanzas visuales en 10 categorías.</strong> Abre desde tu celular, encuentra tu duda y aprende qué revisar antes de volver a lanzar.</p></div><div className="platform-delivery-grid"><article><h3>Prepara tu equipo.</h3><p>Cañas, carretes, líneas, nudos y montajes. Entiende qué usar y cómo revisar tus uniones.</p></article><article><h3>Deja de elegir la carnada a ciegas.</h3><p>Conoce al pez que buscas, observa el agua y aprende qué presentación puedes probar.</p></article><article><h3>Corrige lo que pasa después del lance.</h3><p>Presentación, picada, combate y manejo. Aprende qué observar cuando algo falla.</p></article><article><h3>Ve más allá de la captura.</h3><p>Limpieza, cortes, conservación y diagnóstico. Revisa tus decisiones para preparar la siguiente salida.</p></article></div><div className="center platform-delivery-action"><p><strong>No necesitas seguir buscando todo por separado.</strong><br/>Entra en la categoría que necesitas y empieza por ahí.</p><a className="button" href="#planes">QUIERO LAS 500 ENSEÑANZAS</a></div></div></section>

<section className="section offer" id="planes"><div className="wrap"><div className="center"><span className="eyebrow">ELIGE TU PUNTO DE PARTIDA</span><h2>TU PRÓXIMA SALIDA.<br/><em>CON UN PLAN, NO A CIEGAS.</em></h2></div><div className="plans"><article className="plan main-plan"><span className="plan-tag">MAYOR ALCANCE · SOLO US$ 0,50 MÁS</span><h3>Paquete Completo</h3><p className="plan-desc">Deja de saltar entre consejos sueltos. Aprende desde el nudo hasta la limpieza de tu captura.</p><div className="plan-count"><strong>500</strong><span>ENSEÑANZAS · 10 CATEGORÍAS</span></div><ul><li>500 enseñanzas con ejemplos</li><li>Contenido organizado en 10 categorías</li><li>Lanzamiento, captura y manejo</li><li>Limpieza, filetes, rodajas y conservación</li><li>Guía de 12 fichas regionales de peces</li><li>12 fichas rápidas de consulta</li><li>Plan y bitácora editable</li></ul><strong className="price">US$ 4,50</strong><p className="caption">Pago único en dólares estadounidenses.</p><CheckoutButton plan="completo" /></article><article className="plan"><h3>Paquete Básico</h3><p className="plan-desc">Empieza por las bases: equipo, nudos, montajes, peces, carnadas y lectura del agua.</p><div className="plan-count"><strong>300</strong><span>ENSEÑANZAS · 6 CATEGORÍAS</span></div><ul><li>300 enseñanzas con ejemplos</li><li>Cañas, carretes y líneas</li><li>Nudos, montajes y anzuelos</li><li>Peces, carnadas y señuelos</li><li>Lectura del agua y condiciones</li></ul><p className="not-included">No incluye los 4 temas adicionales ni los 3 materiales de apoyo del Completo.</p><strong className="price">US$ 4,00</strong><p className="caption">Pago único en dólares estadounidenses.</p><CheckoutButton plan="basico" /></article></div>{!fishingPlans.completo.checkoutUrl || !fishingPlans.basico.checkoutUrl ? <p id="checkout-status" className="caption center">El acceso de compra se habilitará próximamente.</p> : null}</div></section>

<section className="section compact-faq"><div className="wrap faq"><h2>ANTES DE EMPEZAR.</h2><details><summary>¿Qué recibo en cada plan?</summary><p>Básico: 300 enseñanzas en 6 categorías. Completo: 500 enseñanzas en 10 categorías y los 3 bonos. Todo el contenido está en español.</p></details><details><summary>¿Cómo accedo?</summary><p>Tras confirmar el pago recibirás las instrucciones de acceso. El contenido está organizado por categorías para consultarlo desde tu celular. No se envía equipo físico.</p></details><details><summary>¿Sirve para mi lugar de pesca?</summary><p>Aprendes bases para adaptar al lugar. Las especies, carnadas permitidas y condiciones varían: compruébalas localmente. Las capturas dependen también del ambiente y la práctica.</p></details></div></section>
<footer><div className="wrap"><strong>MANUAL DEL PESCADOR PRÁCTICO</strong><p>Material educativo independiente de consulta. No sustituye identificación local, demostraciones prácticas ni las indicaciones de fabricantes y autoridades. Verifica permisos, restricciones y avisos sanitarios de tu localidad.</p><p>Las ilustraciones son orientativas. El contenido se organiza por categorías.</p></div></footer>

</main>
<dialog ref={prompt} className="reading-prompt" aria-labelledby="prompt-title" onClick={e=>{if(e.target===e.currentTarget)closePrompt();}}><button type="button" className="prompt-close" aria-label="Cerrar aviso" onClick={closePrompt}>×</button><span className="eyebrow">ANTES DE TU PRÓXIMA SALIDA</span><h2 id="prompt-title">¿QUIERES IR POR<br/><em>PECES MÁS GRANDES?</em></h2><p>Empieza por entender el pez, la carnada y la unión que estás preparando. Descubre cómo organizar ese aprendizaje antes de tu próxima salida.</p><button className="button" type="button" onClick={continueReading}>QUIERO PREPARAR MEJOR MI SALIDA</button></dialog>
</div>;
}
