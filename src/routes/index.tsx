import { createFileRoute } from '@tanstack/react-router';
import { useEffect, type MouseEvent } from 'react';
import { initializeTracking, trackEvent } from '@/lib/office-tracking';
import { fishingOffer, fishingPlans, type FishingPlanId } from '@/data/pescador-offer';
import { AtlasCarousel } from '@/components/pescador/AtlasCarousel';
import { SocialProof } from '@/components/pescador/SocialProof';
import { LiveBuyers } from '@/components/pescador/LiveBuyers';
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
function FishingPage(){
 useEffect(()=>{initializeTracking();trackEvent('ViewContent',{content_name:fishingOffer.name,currency:'USD',value:fishingPlans.completo.priceUSD});},[]);
 const trackPlanScroll=(e:MouseEvent<HTMLDivElement>)=>{if((e.target as HTMLElement).closest('a[href="#planes"]'))trackEvent('ClickParaOferta',{content_name:fishingOffer.name});};
 return <div className="fishing-page" onClick={trackPlanScroll}>

<div className="topbar"><b className="topbar-dot" aria-hidden="true"/>⚠ SOLO HOY: ESTA OFERTA ESTÁ EN EL AIRE <span>¡MAÑANA PUEDE SALIR!</span></div>
<main>
<section className="hero"><div className="wrap center"><div className="brand"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M25 5v20a10 10 0 1 1-20 0v-7l7 7M25 5h8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>PESCADOR PRÁCTICO</div><span className="eyebrow">PARA PRINCIPIANTES E INTERMEDIOS · ESPAÑOL LATAM</span><h1>¿BUSCAS PECES MÁS GRANDES?<br/>EMPIEZA POR TU PREPARACIÓN.</h1><AtlasCarousel/><p className="hero-sub"><strong>Aprende qué carnada elegir, qué nudo usar y cómo hacerlo.</strong> 500 enseñanzas organizadas para preparar mejor tu equipo y tu próxima pesca.</p><div className="trust"><span>Consulta en tu celular</span><span>Ejemplos para aplicar</span><span>Categorías para cada duda</span></div></div></section>

<section className="section pain" id="preparacion" tabIndex={-1}><div className="wrap center"><span className="eyebrow">TU PRÓXIMA SALIDA EMPIEZA AQUÍ</span><h2>¿OTRA CARNADA?<br/><em>PRIMERO ENTIENDE QUÉ ESTÁ FALLANDO.</em></h2><p className="intro">Deja de cambiar todo al azar. Aprende qué pez buscas, qué presentar y cómo preparar tu equipo.</p><a className="button button-lime" href="#planes">QUIERO DEJAR DE IMPROVISAR</a></div></section>



<section className="section soft compact-bonuses"><div className="wrap center"><span className="eyebrow">EL COMPLETO VA MÁS ALLÁ</span><h2>DEL NUDO AL CORTE.<br/><em>TODO EN SU CATEGORÍA.</em></h2><p className="intro">500 enseñanzas de equipo, nudos, peces, carnadas, lectura del agua, lanzamiento, captura, limpieza y conservación.</p><div className="bonus-pills"><span>+ Guía de peces y carnadas</span><span>+ Fichas rápidas de consulta</span><span>+ Plan y bitácora</span><span>+ Atlas de 50 fichas visuales</span></div><p className="complete-upgrade">Por <strong>US$ 0,50 más que el Básico</strong>, llevas <strong>450 enseñanzas adicionales</strong>, los 3 bonos y el Atlas de 50 fichas visuales.</p></div></section>

<SocialProof />

<section className="section platform-delivery" aria-labelledby="platform-delivery-title"><div className="wrap"><div className="center"><span className="eyebrow">ESTO RECIBES EN EL COMPLETO</span><h2 id="platform-delivery-title">BASTA DE CONSEJOS SUELTOS.<br/><em>APRENDE QUÉ HACER CUANDO ESTÁS FRENTE AL AGUA.</em></h2><p className="intro"><strong>500 enseñanzas visuales en 10 categorías.</strong> Abre desde tu celular, encuentra tu duda y aprende qué revisar antes de volver a lanzar.</p></div><div className="platform-delivery-grid"><article><h3>Prepara tu equipo.</h3><p>Cañas, carretes, líneas, nudos y montajes. Entiende qué usar y cómo revisar tus uniones.</p></article><article><h3>Deja de elegir la carnada a ciegas.</h3><p>Conoce al pez que buscas, observa el agua y aprende qué presentación puedes probar.</p></article><article><h3>Corrige lo que pasa después del lance.</h3><p>Presentación, picada, combate y manejo. Aprende qué observar cuando algo falla.</p></article><article><h3>Ve más allá de la captura.</h3><p>Limpieza, cortes, conservación y diagnóstico. Revisa tus decisiones para preparar la siguiente salida.</p></article></div><div className="center platform-delivery-action"><p><strong>No necesitas seguir buscando todo por separado.</strong><br/>Entra en la categoría que necesitas y empieza por ahí.</p><a className="button" href="#planes">QUIERO LAS 500 ENSEÑANZAS</a></div></div></section>

<section className="section offer" id="planes"><div className="wrap"><div className="center"><span className="eyebrow">ELIGE TU PUNTO DE PARTIDA</span><h2>TU PRÓXIMA SALIDA.<br/><em>CON UN PLAN, NO A CIEGAS.</em></h2></div><div className="plans"><article className="plan main-plan"><span className="plan-tag">POR US$ 0,50 MÁS · 10 VECES MÁS ENSEÑANZAS</span><h3>Paquete Completo</h3><p className="plan-desc">Deja de saltar entre consejos sueltos. Aprende desde el nudo hasta la limpieza de tu captura.</p><div className="plan-count"><strong>500</strong><span>ENSEÑANZAS · 10 CATEGORÍAS</span></div><ul><li>500 enseñanzas con ejemplos</li><li>Contenido organizado en 10 categorías</li><li>Lanzamiento, captura y manejo</li><li>Limpieza, filetes, rodajas y conservación</li><li>Guía de 12 fichas regionales de peces</li><li>12 fichas rápidas de consulta</li><li>Plan y bitácora editable</li><li className="atlas-included">NUEVO: Atlas de 50 fichas visuales, como las del inicio</li></ul><div className="upgrade-highlight"><strong>500 enseñanzas + 3 bonos + Atlas visual</strong><span>Todo el recorrido. Solo US$ 0,50 más.</span></div><strong className="price">US$ 4,50</strong><p className="caption">Pago único en dólares estadounidenses.</p><CheckoutButton plan="completo" /></article><article className="plan"><h3>Paquete Básico</h3><p className="plan-desc">Tu punto de partida para conocer y cuidar el equipo. Un solo tema, con alcance inicial.</p><div className="plan-count"><strong>50</strong><span>ENSEÑANZAS · SOLO EQUIPO</span></div><ul><li>50 enseñanzas sobre equipo</li><li>Cañas, carretes y compatibilidad</li><li>Selección de líneas y cuidado del conjunto</li></ul><p className="not-included">No incluye nudos, montajes, peces, carnadas, lectura del agua, lanzamiento, captura, limpieza ni diagnóstico. Tampoco incluye bonos ni el Atlas visual.</p><strong className="price">US$ 4,00</strong><p className="caption">Pago único en dólares estadounidenses.</p><CheckoutButton plan="basico" /></article></div>{!fishingPlans.completo.checkoutUrl || !fishingPlans.basico.checkoutUrl ? <p id="checkout-status" className="caption center">El acceso de compra se habilitará próximamente.</p> : null}</div></section>

<section className="section compact-faq"><div className="wrap faq"><h2>ANTES DE EMPEZAR.</h2><details><summary>¿Qué recibo en cada plan?</summary><p>Básico: 50 enseñanzas de equipo. Completo: 500 enseñanzas en 10 categorías, los 3 bonos y el Atlas adicional de 50 fichas visuales. Todo el contenido está en español.</p></details><details><summary>¿Cómo accedo?</summary><p>Tras confirmar el pago recibirás las instrucciones de acceso. El contenido está organizado por categorías para consultarlo desde tu celular. No se envía equipo físico.</p></details><details><summary>¿Sirve para mi lugar de pesca?</summary><p>Aprendes bases para adaptar al lugar. Las especies, carnadas permitidas y condiciones varían: compruébalas localmente. Las capturas dependen también del ambiente y la práctica.</p></details></div></section>
<footer><div className="wrap"><strong>MANUAL DEL PESCADOR PRÁCTICO</strong><p>Material educativo independiente de consulta. No sustituye identificación local, demostraciones prácticas ni las indicaciones de fabricantes y autoridades. Verifica permisos, restricciones y avisos sanitarios de tu localidad.</p><p>Las ilustraciones son orientativas. El contenido se organiza por categorías.</p></div></footer>

</main>
<LiveBuyers/>
</div>;
}
