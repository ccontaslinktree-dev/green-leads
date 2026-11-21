import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, Check, CheckCircle2, Clock3, Download, FileText, Gift, GraduationCap, ListChecks, Smartphone, Target, X } from 'lucide-react';
import { initializeTracking, trackEvent } from '@/lib/office-tracking';
import { paesOffer, paesPlans, type PaesPlan } from '@/data/paes-offer';

export const Route = createFileRoute('/')({ component: PaesPage });
const sample = '/paes/muestra-visual.pdf';
const pages = [
 { title:'Porcentajes sin adivinar', desc:'Diagrama y cálculo paso a paso, sin trucos.', src:'/paes/visual/corte-03.webp' },
 { title:'Geometría que por fin se entiende', desc:'Área y perímetro con un ejemplo visual.', src:'/paes/visual/corte-07.webp' },
 { title:'Gráficos que no te van a botar', desc:'Lee los datos y domina el promedio.', src:'/paes/visual/corte-08.webp' },
 { title:'Práctica con dirección', desc:'Ejercicios de M1 para resolver tú.', src:'/paes/visual/corte-11.webp' },
 { title:'Descubre dónde fallas', desc:'Procedimiento y errores que no puedes repetir.', src:'/paes/visual/corte-13.webp' },
 { title:'Lectora sin caer en trampas', desc:'Texto original y alternativas explicadas.', src:'/paes/visual/corte-09.webp' },
];
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
 const [activePage, setActivePage] = useState<number | null>(null);
 useEffect(() => { initializeTracking(); trackEvent('ViewContent', { content_name: paesOffer.name }); }, []);
 useEffect(() => {
  if (activePage === null) return;
  const previous = document.activeElement as HTMLElement | null;
  const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setActivePage(null); };
  document.addEventListener('keydown', close); const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
  const dialog = document.getElementById('sample-dialog') as HTMLDialogElement | null; if (dialog && !dialog.open) dialog.showModal();
  return () => { document.removeEventListener('keydown', close); document.body.style.overflow = old; previous?.focus(); };
 }, [activePage]);
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
    <p className="paes-hero-copy">Cada día que pasas saltando entre videos y PDFs es un día que no vuelve. Este kit te dice qué reforzar en <strong>Matemática M1 y Competencia Lectora</strong>, con práctica explicada y una ruta clara que llevas en tu celular.</p>
    <div className="paes-trust"><span><Smartphone size={18}/> Digital</span><span><FileText size={18}/> Muestra real</span><span><Download size={18}/> PDF descargable</span></div>
    <KitLink light>QUIERO CONTROLAR MI REPASO AHORA</KitLink>
    <p className="paes-caption paes-caption-light">Enfocado en M1 + Lectora. No incluye M2, Ciencias ni Historia.</p>
   </div>
  </section>

  <section className="paes-section paes-samples" id="muestra">
   <div className="paes-wrap paes-center"><span className="paes-eyebrow">MIRA LO QUE TE ESTÁS PERDIENDO</span><h2>ESTO ES ESTUDIAR<br/><em>CON DIRECCIÓN.</em></h2><p className="paes-intro">Páginas reales del material: ejercicios, gráficos y ejemplos resueltos paso a paso. Nada de teoría eterna. Toca una ficha para verla en grande.</p></div>
   <div className="paes-marquee" role="region" aria-label="Carrusel automático de páginas de muestra"><div className="paes-track">{[0,1].map(copy => <div className="paes-track-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{pages.map(({title,desc,src},i) => <button type="button" key={title} className="paes-sample" tabIndex={copy===1?-1:0} onClick={() => setActivePage(i)} aria-label={`Ampliar: ${title}`}><img src={src} width="804" height="1059" alt={copy===0?title:''} loading="eager" fetchPriority="low" decoding="async"/><strong>{title}</strong><span>{desc}</span></button>)}</div>)}</div></div>
   <div className="paes-wrap paes-center"><a className="paes-textlink" href={sample} target="_blank" rel="noopener">Abrir la muestra ahora (16 páginas gratis) <Download size={18}/></a></div>
  </section>

  <section className="paes-section paes-print" aria-labelledby="print-title"><div className="paes-wrap paes-print-grid">
   <figure className="paes-print-figure"><img src="/paes/apostila-en-manos.webp" width="1280" height="853" alt="Imagen ilustrativa de una mujer sosteniendo la muestra PAES en Foco impresa y encuadernada" loading="lazy" decoding="async"/><figcaption>Imagen ilustrativa. El material se entrega en PDF; la impresión y la encuadernación no están incluidas.</figcaption></figure>
   <div className="paes-print-copy"><span className="paes-eyebrow">ESTUDIA DONDE ESTÉS</span><h2 id="print-title">SIN EXCUSAS:<br/><em>EN EL CELULAR O EN PAPEL.</em></h2><p>En la micro, en la casa o en la biblioteca. Imprime solo lo que necesitas atacar y anota tus errores en el mismo papel hasta que dejen de repetirse.</p><a className="paes-textlink" href={sample} target="_blank" rel="noopener">Abrir la muestra ahora <Download size={18}/></a></div>
  </div></section>

  <section className="paes-section paes-soft" id="materiales"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">DOS PRUEBAS. CERO TIEMPO PERDIDO.</span><h2>DEJA DE BUSCAR.<br/><em>EMPIEZA A PRACTICAR LO QUE IMPORTA.</em></h2></div>
   <div className="paes-material-grid">{[
    { image:'03',title:'Matemática M1',label:'INCLUIDO EN EL KIT',body:'Organizado por ejes para que veas en minutos qué te está costando puntaje y lo practiques con procedimientos explicados.',list:['Números y álgebra','Geometría, datos y probabilidad','Ejercicios con el proceso explicado'] },
    { image:'09',title:'Competencia Lectora',label:'INCLUIDO EN EL KIT',body:'Aprende a leer con intención, encontrar la evidencia y dejar de caer en las alternativas trampa.',list:['Localizar información','Interpretar el sentido del texto','Evaluar con evidencia'] },
   ].map(m=><article className="paes-material" key={m.title}><div className="paes-paper"><img src={`/paes/visual/pagina-${m.image}.webp`} width="780" height="1105" alt={`Página de muestra de ${m.title}`} loading="lazy" decoding="async"/></div><div className="paes-material-copy"><span className="paes-eyebrow">{m.label}</span><h3>{m.title}</h3><p>{m.body}</p><ul>{m.list.map(t=><li key={t}><CheckCircle2 size={19}/><span>{t}</span></li>)}</ul></div></article>)}
   </div><div className="paes-center"><KitLink /></div>
  </div></section>

  <section className="paes-section paes-pain"><div className="paes-wrap paes-center"><span className="paes-eyebrow">CADA DÍA SIN DIRECCIÓN TE CUESTA CARO</span><h2>IDENTIFICA TUS ERRORES AHORA<br/><em>O SE REPETIRÁN EN LA PRUEBA.</em></h2><p className="paes-intro">Un video por aquí. Un PDF por allá. Horas frente a la pantalla y la misma duda de siempre: “¿qué debería practicar?”. Mientras tanto, los mismos errores siguen ahí esperando el día de la prueba. Para ya.</p><div className="paes-process">{[['01','Detecta','Encuentra exactamente el tema que te está bajando el puntaje.'],['02','Practica','Resuelve primero, revisa la explicación y entiende por qué fallaste.'],['03','Refuerza','Anota el error y repítelo hasta que deje de ser un problema.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><KitLink light>QUIERO ORGANIZAR MIS ÚLTIMOS DÍAS</KitLink></div></section>

  <section className="paes-section"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">¿TE IDENTIFICAS?</span><h2>SI NO QUIERES LLEGAR<br/><em>A LA PRUEBA ADIVINANDO.</em></h2></div><div className="paes-audience">{[[GraduationCap,'Rindes por primera vez','No sabes por dónde empezar y el tiempo se te está acabando. Necesitas una ruta, ya.'],[Target,'Vuelves a rendir la PAES','No puedes darte el lujo de repetir los mismos errores. Esta vez tiene que ser distinto.'],[BookOpen,'Ya estudias en un preuniversitario','Quieres práctica extra con dirección para los últimos días. Es un apoyo: no reemplaza tus clases ni el temario.'],[ListChecks,'Acompañas a un estudiante','Como apoderado, quieres verlo estudiar con un plan claro y no perdido entre pestañas.']].map(([Icon,title,body])=>{const I=Icon as typeof BookOpen;return <article key={String(title)}><I size={27} aria-hidden="true"/><h3>{String(title)}</h3><p>{String(body)}</p></article>})}</div></div></section>

  <section className="paes-section paes-soft" id="bonos"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">SOLO EN EL PAQUETE COMPLETO</span><h2>MARCAR LA ALTERNATIVA<br/><em>NO BASTA. HAY QUE CORREGIR.</em></h2><p className="paes-intro">Estos bonos vienen únicamente con el Paquete Completo. Son los que convierten la práctica en avance real.</p></div><div className="paes-bonuses">
   <article className="paes-bonus paes-bonus-featured"><div className="paes-bonus-cover"><span>BONO</span><b>100</b><strong>ACTIVIDADES<br/>EXTRA</strong><BookOpen size={60} aria-hidden="true"/></div><div><span className="paes-eyebrow">BONO 1</span><h3>100 actividades extra</h3><p>50 de M1 y 50 de Lectora, con soluciones explicadas. Práctica de verdad para atacar tus puntos débiles por tema.</p></div></article>
   <article className="paes-bonus"><img src="/paes/visual/pagina-15.webp" width="780" height="1105" alt="Ejemplo de calendario de repaso de 7 días" loading="lazy" decoding="async"/><div><span className="paes-eyebrow">BONO 2</span><h3>Plan de repaso</h3><p>Sabe qué hacer cada día hasta la prueba. Sin improvisar, sin perder ni una tarde.</p></div></article>
   <article className="paes-bonus"><img src="/paes/visual/pagina-16.webp" width="780" height="1105" alt="Plantilla de registro de errores incluida en la muestra" loading="lazy" decoding="async"/><div><span className="paes-eyebrow">BONO 3</span><h3>Cuaderno de errores</h3><p>Registra cada error y elimínalo antes de que te cueste puntos el día de la prueba.</p></div></article>
  </div></div></section>

  <section className="paes-section paes-offer" id="kit"><div className="paes-wrap paes-center"><span className="paes-eyebrow">ELIGE AHORA. EL TIEMPO NO ESPERA.</span><h2>ASEGURA TU REPASO<br/><em>ANTES DE QUE SUBA EL PRECIO.</em></h2><OfferTimer /><div className="paes-plans">
   <div className="paes-offer-card paes-plan-main"><span className="paes-launch">MÁS ELEGIDO · RECOMENDADO</span><h3>Paquete Completo</h3><p>Todo lo que necesitas para llegar a la prueba sabiendo qué hacer cada día. Guías + los 3 bonos.</p><ul>{['Guía de repaso Matemática M1','Guía de Competencia Lectora','BONO: 100 actividades extra con soluciones','BONO: Plan de repaso día a día','BONO: Cuaderno de errores','Acceso inmediato · PDF para celular e impresión'].map(t=><li key={t}><Check size={20}/><span>{t}</span></li>)}</ul><div className="paes-availability"><Clock3 size={23}/><div><strong>Valor normal: <s>{clp(paesPlans.completo.anchorCLP)}</s></strong><p>Menos que un completo en la esquina. Un preuniversitario cuesta cientos de miles; aquí tienes una ruta clara por el precio de una bebida.</p></div></div><strong className="paes-price">{clp(paesPlans.completo.priceCLP)}</strong><p className="paes-plan-save">Ahorras {clp(paesPlans.completo.anchorCLP - paesPlans.completo.priceCLP)} hoy · pago único</p><button className="paes-button" onClick={() => checkout(paesPlans.completo)}>SÍ, QUIERO EL PAQUETE COMPLETO</button><p className="paes-caption">Precio de lanzamiento por tiempo limitado. Material independiente de apoyo; no garantiza puntaje.</p></div>
   <div className="paes-offer-card paes-plan-basic"><h3>Paquete Básico</h3><p>Solo las guías. Sin bonos, sin plan de repaso, sin cuaderno de errores.</p><ul>{['Guía de repaso Matemática M1','Guía de Competencia Lectora','PDF para celular e impresión'].map(t=><li key={t}><Check size={20}/><span>{t}</span></li>)}{['Sin 100 actividades extra','Sin plan de repaso','Sin cuaderno de errores'].map(t=><li key={t} className="paes-plan-no"><X size={20}/><span>{t}</span></li>)}</ul><p className="paes-plan-anchor">Valor normal: <s>{clp(paesPlans.basico.anchorCLP)}</s></p><strong className="paes-price">{clp(paesPlans.basico.priceCLP)}</strong><button className="paes-button paes-button-ghost" onClick={() => checkout(paesPlans.basico)}>QUIERO SOLO EL BÁSICO</button></div>
  </div><a className="paes-textlink" href={sample} target="_blank" rel="noopener">¿Aún dudas? Abre la muestra gratis ahora <Download size={17}/></a></div></section>

  <section className="paes-section"><div className="paes-wrap paes-faq"><div className="paes-center"><span className="paes-eyebrow">CLARIDAD ANTES DE DECIDIR</span><h2>PREGUNTAS FRECUENTES</h2></div>{[
   ['¿Qué incluye la muestra gratuita?','Dieciséis páginas con diagramas de M1, ejemplos introductorios resueltos, ocho ejercicios de matemática con soluciones comentadas, un texto original con tres preguntas explicadas, un plan de repaso y una plantilla de errores.'],
   ['¿Cuál es la diferencia entre los paquetes?','El Básico trae solo las guías de M1 y Lectora. El Completo trae las guías más los 3 bonos: 100 actividades extra, plan de repaso y cuaderno de errores. Por solo $1.000 más, el Completo es la opción que recomendamos.'],
   ['¿Cómo recibo el material?','Después de confirmar el pago, recibes el acceso en tu correo. Es un PDF digital: puedes empezar a estudiar el mismo día.'],
   ['¿Incluye todas las pruebas PAES?','No. El enfoque es Matemática M1 y Competencia Lectora. No contempla M2, Ciencias ni Historia y Ciencias Sociales.'],
   ['¿Es material oficial de DEMRE?','No. Es material independiente de apoyo, con ejercicios autorales. Revisa siempre los temarios, requisitos y calendarios en las páginas oficiales.'],
   ['¿Garantiza un puntaje o el ingreso a una carrera?','No. Ningún material honesto puede prometer eso. Es un apoyo para estudiar con dirección; el resultado depende de tu preparación y de los requisitos del proceso de admisión.'],
   ['¿Puedo verlo en el celular o imprimirlo?','Sí. La muestra es un PDF descargable. Puedes abrirla en el celular, tablet o computador e imprimir las páginas que necesites.'],
  ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<KitLink>QUIERO ASEGURAR MI PAQUETE AHORA</KitLink></div></section>
  <footer className="paes-footer"><div className="paes-wrap"><strong>PAES EN FOCO</strong><p>Material independiente de apoyo al estudio. Sin afiliación ni respaldo de DEMRE, Universidad de Chile o el Ministerio de Educación. No reemplaza el temario oficial ni garantiza puntaje.</p><p>PAES Regular 2026, proceso de Admisión 2027: 30 de noviembre, 1 y 2 de diciembre de 2026. Consulta los canales oficiales antes de organizar tu rendición.</p><nav aria-label="Fuentes oficiales"><a href="https://www.mineduc.cl/comienza-la-inscripcion-a-la-paes-regular-2026-admision-2027/" target="_blank" rel="noopener">Calendario oficial</a><a href="https://acceso-sup.mineduc.cl/acceso-buscador/material-de-preparacion-paes" target="_blank" rel="noopener">Temarios y recursos</a></nav><small>© {new Date().getFullYear()} PAES en Foco. Todos los derechos reservados.</small></div></footer>
  {activePage !== null && <dialog id="sample-dialog" className="paes-dialog" onCancel={()=>setActivePage(null)} onClick={e=>{if(e.target===e.currentTarget)setActivePage(null)}}><div className="paes-dialog-head"><strong>{pages[activePage].title}</strong><button type="button" onClick={()=>setActivePage(null)} aria-label="Cerrar página ampliada" autoFocus><X/></button></div><img src={pages[activePage].src} width="804" height="1059" alt={pages[activePage].title}/><a href={sample} target="_blank" rel="noopener">Abrir PDF con zoom</a></dialog>}
 </main>;
}
