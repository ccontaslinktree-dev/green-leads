import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, Check, Clock3, FileText, Gift, GraduationCap, ListChecks, Smartphone, Target, X } from 'lucide-react';
import { initializeTracking, trackEvent } from '@/lib/office-tracking';
import { paesOffer, paesPlans, type PaesPlan } from '@/data/paes-offer';

export const Route = createFileRoute('/')({ component: PaesPage });

function KitLink({ light = false, children = 'QUIERO UN REPASO CON DIRECCIÓN' }: { light?: boolean; children?: React.ReactNode }) {
 return <a className={`paes-button ${light ? 'paes-button-light' : ''}`} href="#kit" onClick={() => trackEvent('ClickParaOferta', { content_name: paesOffer.name })}>{children}</a>;
}
function ExamClock() {
 const [days, setDays] = useState<number | null>(null);
 useEffect(() => { const tick = () => setDays(Math.ceil((Date.parse('2026-11-30T00:00:00-03:00') - Date.now()) / 86400000)); tick(); const id = setInterval(tick, 60000); return () => clearInterval(id); }, []);
 return <div className="paes-clock"><Clock3 size={20} aria-hidden="true"/><span>{days === null ? 'PAES REGULAR: 30 NOVIEMBRE AL 2 DICIEMBRE 2026' : days > 0 ? `QUEDAN ${days} DÍAS PARA LA PRIMERA JORNADA · 30 NOV – 2 DIC` : days >= -2 ? 'PAES REGULAR EN CURSO · 30 NOV – 2 DIC' : 'PAES REGULAR 2026 FINALIZADA · REVISA LAS PRÓXIMAS FECHAS OFICIALES'}</span></div>;
}
const clp = (n: number) => new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(n);
function OfferTimer() {
 const [left, setLeft] = useState<number | null>(null);
 useEffect(() => {
  const key = 'paes-offer-deadline'; let end = Number(localStorage.getItem(key));
  if (!end || end < Date.now()) { end = Date.now() + 15 * 60000; localStorage.setItem(key, String(end)); }
  const tick = () => setLeft(Math.max(0, end - Date.now())); tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
 }, []);
 const mm = left === null ? '15' : String(Math.floor(left / 60000)).padStart(2, '0'); const ss = left === null ? '00' : String(Math.floor(left / 1000) % 60).padStart(2, '0');
 return <div className="paes-timer"><span>⚠️ EL PRECIO DE LANZAMIENTO TERMINA EN</span><b>{mm}:{ss}</b><small>Quedan pocos cupos a este valor</small></div>;
}
function PaesPage() {
 useEffect(() => { initializeTracking(); trackEvent('ViewContent', { content_name: paesOffer.name }); }, []);
 const checkout = (plan: PaesPlan) => {
  const url = new URL(plan.checkoutUrl); new URLSearchParams(window.location.search).forEach((v,k) => { if (!k.startsWith('__lovable_') && !url.searchParams.has(k)) url.searchParams.set(k,v); });
  trackEvent('InitiateCheckout', { content_name: plan.name, currency: 'CLP', value: plan.priceCLP }); window.location.assign(url.toString());
 };
 return <main className="paes-page">
  <ExamClock />
  <section className="paes-hero">
   <div className="paes-wrap paes-center">
    <div className="paes-wordmark"><BookOpen size={21} aria-hidden="true"/> PAES EN FOCO</div>
    <span className="paes-tag">ÚLTIMOS DÍAS · M1 + COMPETENCIA LECTORA</span>
    <h1>FALTAN POCOS DÍAS. ¿SIGUES PERDIDO<br className="desktop-break"/> ENTRE APUNTES SUELTOS?</h1>
    <p className="paes-hero-sub">PARA DE ESTUDIAR SIN DIRECCIÓN.<br/>DETECTA TUS ERRORES ANTES DEL DÍA DE LA PRUEBA.</p>
    <img className="paes-hero-mockup" src="/paes/kit-mockup.webp" width="1280" height="853" alt="Mockup ilustrativo del kit: guías de M1 y Competencia Lectora, actividades extra, plan y cuaderno de errores" fetchPriority="high"/>
    <p className="paes-caption paes-caption-light">Imagen ilustrativa. Kit 100% digital con acceso inmediato después de la compra.</p>
    <p className="paes-hero-copy">Deja de saltar entre apuntes y videos. Refuerza <strong>Matemática M1 y Competencia Lectora</strong> con ejemplos resueltos, práctica explicada y una ruta clara para organizar tu repaso.</p>
    <div className="paes-trust"><span><Smartphone size={18}/> En tu celular</span><span><FileText size={18}/> Práctica explicada</span><span><Clock3 size={18}/> Acceso inmediato</span></div>
    <KitLink light>QUIERO CONTROLAR MI REPASO AHORA</KitLink>
    <p className="paes-caption paes-caption-light">Enfocado en M1 + Lectora. No incluye M2, Ciencias ni Historia.</p>
   </div>
  </section>

  <section className="paes-section paes-pain"><div className="paes-wrap paes-center"><span className="paes-eyebrow">CADA DÍA SIN DIRECCIÓN TE CUESTA CARO</span><h2>IDENTIFICA TUS ERRORES AHORA<br/><em>O SE REPETIRÁN EN LA PRUEBA.</em></h2><p className="paes-intro">¿Horas estudiando y todavía no sabes qué reforzar? Encuentra el tema que te cuesta, practica y entiende el procedimiento antes de volver a intentarlo.</p><div className="paes-process">{[['01','Detecta','Encuentra exactamente el tema que te está bajando el puntaje.'],['02','Practica','Resuelve primero, revisa la explicación y entiende por qué fallaste.'],['03','Refuerza','Anota el error y repítelo hasta que deje de ser un problema.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><KitLink light>QUIERO ORGANIZAR MIS ÚLTIMOS DÍAS</KitLink></div></section>

  <section className="paes-section"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">¿TE IDENTIFICAS?</span><h2>SI NO QUIERES LLEGAR<br/><em>A LA PRUEBA ADIVINANDO.</em></h2></div><div className="paes-audience">{[[GraduationCap,'Rindes por primera vez','No sabes por dónde empezar y el tiempo se te está acabando. Necesitas una ruta, ya.'],[Target,'Vuelves a rendir la PAES','No puedes darte el lujo de repetir los mismos errores. Esta vez tiene que ser distinto.'],[BookOpen,'Ya estudias en un preuniversitario','Quieres práctica extra con dirección para los últimos días. Es un apoyo: no reemplaza tus clases ni el temario.'],[ListChecks,'Acompañas a un estudiante','Como apoderado, quieres verlo estudiar con un plan claro y no perdido entre pestañas.']].map(([Icon,title,body])=>{const I=Icon as typeof BookOpen;return <article key={String(title)}><I size={27} aria-hidden="true"/><h3>{String(title)}</h3><p>{String(body)}</p></article>})}</div></div></section>

  <section className="paes-section paes-soft" id="bonos"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">SOLO EN EL PAQUETE COMPLETO</span><h2>MARCAR LA ALTERNATIVA<br/><em>NO BASTA. HAY QUE CORREGIR.</em></h2><p className="paes-intro">Estos bonos vienen únicamente con el Paquete Completo. Son los que convierten la práctica en avance real.</p></div><div className="paes-bonuses paes-bonuses-compact">
   <article className="paes-bonus paes-bonus-featured"><div className="paes-bonus-icon" aria-hidden="true"><Gift size={32}/></div><div><span className="paes-eyebrow">BONO 1</span><h3>100 actividades extra</h3><p>50 de M1 y 50 de Lectora, con soluciones explicadas. Práctica de verdad para atacar tus puntos débiles por tema.</p></div></article>
   <article className="paes-bonus"><div className="paes-bonus-icon" aria-hidden="true"><ListChecks size={32}/></div><div><span className="paes-eyebrow">BONO 2</span><h3>Plan de repaso</h3><p>Sabe qué hacer cada día hasta la prueba. Sin improvisar, sin perder ni una tarde.</p></div></article>
   <article className="paes-bonus"><div className="paes-bonus-icon" aria-hidden="true"><FileText size={32}/></div><div><span className="paes-eyebrow">BONO 3</span><h3>Cuaderno de errores</h3><p>Registra cada error y elimínalo antes de que te cueste puntos el día de la prueba.</p></div></article>
  </div></div></section>

  <section className="paes-section paes-offer" id="kit"><div className="paes-wrap paes-center"><span className="paes-eyebrow">ELIGE AHORA. EL TIEMPO NO ESPERA.</span><h2>ASEGURA TU REPASO<br/><em>ANTES DE QUE SUBA EL PRECIO.</em></h2><OfferTimer /><div className="paes-plans">
   <div className="paes-offer-card paes-plan-main"><span className="paes-launch">MÁS ELEGIDO · RECOMENDADO</span><h3>Paquete Completo</h3><p>Todo lo que necesitas para llegar a la prueba sabiendo qué hacer cada día. Guías + los 3 bonos.</p><ul>{['Guía de repaso Matemática M1','Guía de Competencia Lectora','BONO: 100 actividades extra con soluciones','BONO: Plan de repaso día a día','BONO: Cuaderno de errores','Acceso inmediato · Estudia desde tu celular'].map(t=><li key={t}><Check size={20}/><span>{t}</span></li>)}</ul><div className="paes-availability"><Clock3 size={23}/><div><strong>Valor normal: <s>{clp(paesPlans.completo.anchorCLP)}</s></strong><p>Menos que un completo en la esquina. Un preuniversitario cuesta cientos de miles; aquí tienes una ruta clara por el precio de una bebida.</p></div></div><strong className="paes-price">{clp(paesPlans.completo.priceCLP)}</strong><p className="paes-plan-save">Ahorras {clp(paesPlans.completo.anchorCLP - paesPlans.completo.priceCLP)} hoy · pago único</p><button className="paes-button" onClick={() => checkout(paesPlans.completo)}>SÍ, QUIERO EL PAQUETE COMPLETO</button><p className="paes-caption">Precio de lanzamiento por tiempo limitado. Material independiente de apoyo; no garantiza puntaje.</p></div>
   <div className="paes-offer-card paes-plan-basic"><h3>Paquete Básico</h3><p>Solo las guías. Sin bonos, sin plan de repaso, sin cuaderno de errores.</p><ul>{['Guía de repaso Matemática M1','Guía de Competencia Lectora','Consulta desde tu celular o imprime'].map(t=><li key={t}><Check size={20}/><span>{t}</span></li>)}{['Sin 100 actividades extra','Sin plan de repaso','Sin cuaderno de errores'].map(t=><li key={t} className="paes-plan-no"><X size={20}/><span>{t}</span></li>)}</ul><p className="paes-plan-anchor">Valor normal: <s>{clp(paesPlans.basico.anchorCLP)}</s></p><strong className="paes-price">{clp(paesPlans.basico.priceCLP)}</strong><button className="paes-button paes-button-ghost" onClick={() => checkout(paesPlans.basico)}>QUIERO SOLO EL BÁSICO</button></div>
  </div></div></section>

  <section className="paes-section"><div className="paes-wrap paes-faq"><div className="paes-center"><span className="paes-eyebrow">CLARIDAD ANTES DE DECIDIR</span><h2>PREGUNTAS FRECUENTES</h2></div>{[
   ['¿Cuál es la diferencia entre los paquetes?','El Básico trae solo las guías de M1 y Lectora. El Completo trae las guías más los 3 bonos: 100 actividades extra, plan de repaso y cuaderno de errores. Por solo $1.000 más, el Completo es la opción que recomendamos.'],
   ['¿Cómo recibo el material?','Después de confirmar el pago, recibes por correo las instrucciones de acceso al kit digital y puedes empezar tu repaso.'],
   ['¿Incluye todas las pruebas PAES?','No. El enfoque es Matemática M1 y Competencia Lectora. No contempla M2, Ciencias ni Historia y Ciencias Sociales.'],
   ['¿Es material oficial de DEMRE?','No. Es material independiente de apoyo, con ejercicios autorales. Revisa siempre los temarios, requisitos y calendarios en las páginas oficiales.'],
   ['¿Garantiza un puntaje o el ingreso a una carrera?','No. Ningún material honesto puede prometer eso. Es un apoyo para estudiar con dirección; el resultado depende de tu preparación y de los requisitos del proceso de admisión.'],
   ['¿Puedo verlo en el celular o imprimirlo?','Sí. Recibes archivos PDF descargables para consultar desde tu celular, tablet o computador. También puedes imprimir las páginas que necesites. No se envía un producto físico.'],
  ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<KitLink>QUIERO ASEGURAR MI PAQUETE AHORA</KitLink></div></section>
  <footer className="paes-footer"><div className="paes-wrap"><strong>PAES EN FOCO</strong><p>Material independiente de apoyo al estudio. Sin afiliación ni respaldo de DEMRE, Universidad de Chile o el Ministerio de Educación. No reemplaza el temario oficial ni garantiza puntaje.</p><p>PAES Regular 2026, proceso de Admisión 2027: 30 de noviembre, 1 y 2 de diciembre de 2026. Consulta los canales oficiales antes de organizar tu rendición.</p><nav aria-label="Fuentes oficiales"><a href="https://www.mineduc.cl/comienza-la-inscripcion-a-la-paes-regular-2026-admision-2027/" target="_blank" rel="noopener">Calendario oficial</a><a href="https://acceso-sup.mineduc.cl/acceso-buscador/material-de-preparacion-paes" target="_blank" rel="noopener">Temarios y recursos</a></nav><small>© {new Date().getFullYear()} PAES en Foco. Todos los derechos reservados.</small></div></footer>

 </main>;
}
