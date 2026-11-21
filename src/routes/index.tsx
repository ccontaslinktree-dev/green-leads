import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BookOpen, Check, CheckCircle2, Clock3, Download, FileText, Gift, GraduationCap, ListChecks, Smartphone, Target, X } from 'lucide-react';
import { initializeTracking, trackEvent } from '@/lib/office-tracking';
import { paesOffer } from '@/data/paes-offer';

export const Route = createFileRoute('/')({ component: PaesPage });
const sample = '/paes/muestra-visual.pdf';
const pages = [
 { title:'Porcentajes que puedes ver', desc:'Diagrama y cálculo paso a paso.', src:'/paes/visual/corte-03.webp' },
 { title:'Geometría, sin confusiones', desc:'Área y perímetro con un ejemplo visual.', src:'/paes/visual/corte-07.webp' },
 { title:'Gráficos con explicación', desc:'Lee los datos y entiende el promedio.', src:'/paes/visual/corte-08.webp' },
 { title:'Ahora te toca practicar', desc:'Ejercicios de M1 para resolver tú.', src:'/paes/visual/corte-11.webp' },
 { title:'Entiende cada solución', desc:'Procedimiento y errores que revisar.', src:'/paes/visual/corte-13.webp' },
 { title:'Lectura con contexto', desc:'Texto original y apoyo visual.', src:'/paes/visual/corte-09.webp' },
];
function KitLink({ light = false, children = 'QUIERO VER EL KIT' }: { light?: boolean; children?: React.ReactNode }) {
 return <a className={`paes-button ${light ? 'paes-button-light' : ''}`} href="#kit" onClick={() => trackEvent('ClickParaOferta', { content_name: paesOffer.name })}>{children}</a>;
}
function ExamClock() {
 const [days, setDays] = useState<number | null>(null);
 useEffect(() => { const tick = () => setDays(Math.ceil((Date.parse('2026-11-30T00:00:00-03:00') - Date.now()) / 86400000)); tick(); const id = setInterval(tick, 60000); return () => clearInterval(id); }, []);
 return <div className="paes-clock"><Clock3 size={20} aria-hidden="true"/><span>{days === null ? 'PAES REGULAR: 30 NOVIEMBRE AL 2 DICIEMBRE 2026' : days > 0 ? `QUEDAN ${days} DÍAS PARA LA PRIMERA JORNADA · 30 NOV – 2 DIC` : days >= -2 ? 'PAES REGULAR EN CURSO · 30 NOV – 2 DIC' : 'PAES REGULAR 2026 FINALIZADA · REVISA LAS PRÓXIMAS FECHAS OFICIALES'}</span></div>;
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
 const checkout = () => {
  if (!paesOffer.checkoutUrl || paesOffer.status !== 'ready') return;
  const url = new URL(paesOffer.checkoutUrl); new URLSearchParams(window.location.search).forEach((v,k) => { if (!k.startsWith('__lovable_') && !url.searchParams.has(k)) url.searchParams.set(k,v); });
  trackEvent('InitiateCheckout', { content_name: paesOffer.name, currency: 'CLP', value: paesOffer.priceCLP ?? 0 }); window.location.assign(url.toString());
 };
 return <main className="paes-page">
  <ExamClock />
  <section className="paes-hero">
   <div className="paes-wrap paes-center">
    <div className="paes-wordmark"><BookOpen size={21} aria-hidden="true"/> PAES EN FOCO</div>
    <span className="paes-tag">PRELANZAMIENTO · M1 + COMPETENCIA LECTORA</span>
    <h1>REPASA SIN PERDERTE<br className="desktop-break"/> ENTRE APUNTES SUELTOS.</h1>
    <p className="paes-hero-sub">IDENTIFICA LO QUE TE CUESTA.<br/>PRACTICA. REVISA. VUELVE A INTENTAR.</p>
    <img className="paes-hero-mockup" src="/paes/kit-mockup.webp" width="1280" height="853" alt="Mockup ilustrativo del kit en preparación: guías de M1 y Competencia Lectora, actividades extra, plan y cuaderno de errores" fetchPriority="high"/>
    <p className="paes-caption paes-caption-light">Mockup ilustrativo. Kit digital en preparación; la muestra de 16 páginas ya está disponible.</p>
    <p className="paes-hero-copy">Un kit de repaso visual para ordenar tus últimos días de estudio. <strong>Matemática M1 y Competencia Lectora</strong>, con práctica explicada y una ruta que puedas consultar desde tu celular.</p>
    <div className="paes-trust"><span><Smartphone size={18}/> Digital</span><span><FileText size={18}/> Muestra real</span><span><Download size={18}/> PDF descargable</span></div>
    <KitLink light>QUIERO CONOCER LOS MATERIALES</KitLink>
    <p className="paes-caption paes-caption-light">M1 + Lectora. No incluye M2, Ciencias ni Historia.</p>
   </div>
  </section>

  <section className="paes-section paes-samples" id="muestra">
   <div className="paes-wrap paes-center"><span className="paes-eyebrow">ABRE LA MUESTRA ANTES DE DECIDIR</span><h2>ASÍ SE VE EL REPASO<br/><em>POR DENTRO.</em></h2><p className="paes-intro">Cortes reales del nuevo PDF: ejercicios, gráficos y ejemplos resueltos. Las fichas pasan automáticamente; toca una para verla más grande.</p></div>
   <div className="paes-marquee" role="region" aria-label="Carrusel automático de páginas de muestra"><div className="paes-track">{[0,1].map(copy => <div className="paes-track-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>{pages.map(({title,desc,src},i) => <button type="button" key={title} className="paes-sample" tabIndex={copy===1?-1:0} onClick={() => setActivePage(i)} aria-label={`Ampliar: ${title}`}><img src={src} width="804" height="1059" alt={copy===0?title:''} loading="eager" fetchPriority="low" decoding="async"/><strong>{title}</strong><span>{desc}</span></button>)}</div>)}</div></div>
   <div className="paes-wrap paes-center"><a className="paes-textlink" href={sample} target="_blank" rel="noopener">Abrir la muestra gratuita de 16 páginas <Download size={18}/></a></div>
  </section>

  <section className="paes-section paes-print" aria-labelledby="print-title"><div className="paes-wrap paes-print-grid">
   <figure className="paes-print-figure"><img src="/paes/apostila-en-manos.webp" width="1280" height="853" alt="Imagen ilustrativa de una mujer sosteniendo la muestra PAES en Foco impresa y encuadernada" loading="lazy" decoding="async"/><figcaption>Imagen ilustrativa generada con IA. El material se entrega en PDF; la impresión y la encuadernación no están incluidas.</figcaption></figure>
   <div className="paes-print-copy"><span className="paes-eyebrow">EN TU CELULAR O EN PAPEL</span><h2 id="print-title">ASÍ PUEDE VERSE<br/><em>TU REPASO IMPRESO.</em></h2><p>Abre la muestra en tu celular o imprime las páginas que quieras trabajar. Diagramas, explicaciones y espacio para volver sobre tus errores.</p><a className="paes-textlink" href={sample} target="_blank" rel="noopener">Abrir la muestra de 16 páginas <Download size={18}/></a></div>
  </div></section>

  <section className="paes-section paes-soft" id="materiales"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">DOS ÁREAS. UNA FORMA DE REPASAR.</span><h2>MENOS BÚSQUEDA.<br/><em>MÁS PRÁCTICA CON SENTIDO.</em></h2></div>
   <div className="paes-material-grid">{[
    { image:'03',title:'Matemática M1',label:'GUÍA PREVISTA DEL KIT',body:'Organización por ejes para identificar qué necesitas reforzar y practicar con procedimientos explicados.',list:['Números y álgebra','Geometría, datos y probabilidad','Ejercicios con explicación del proceso'] },
    { image:'09',title:'Competencia Lectora',label:'GUÍA PREVISTA DEL KIT',body:'Una ruta para leer con intención, buscar evidencia y revisar por qué una alternativa responde al texto.',list:['Localizar información','Interpretar el sentido del texto','Evaluar con evidencia'] },
   ].map(m=><article className="paes-material" key={m.title}><div className="paes-paper"><img src={`/paes/visual/pagina-${m.image}.webp`} width="780" height="1105" alt={`Página de muestra de ${m.title}`} loading="lazy" decoding="async"/></div><div className="paes-material-copy"><span className="paes-eyebrow">{m.label}</span><h3>{m.title}</h3><p>{m.body}</p><ul>{m.list.map(t=><li key={t}><CheckCircle2 size={19}/><span>{t}</span></li>)}</ul></div></article>)}
   </div><div className="paes-center"><KitLink /></div>
  </div></section>

  <section className="paes-section paes-pain"><div className="paes-wrap paes-center"><span className="paes-eyebrow">EL TIEMPO QUE QUEDA TAMBIÉN CUENTA</span><h2>ABRIR MÁS PESTAÑAS<br/><em>NO ORDENA TU REPASO.</em></h2><p className="paes-intro">Un video por aquí. Un PDF por allá. Y al final del día, la misma duda: “¿qué debería practicar ahora?”. Cambia la búsqueda sin rumbo por una tarea concreta.</p><div className="paes-process">{[['01','Detecta','Identifica el tema o la habilidad que necesitas trabajar.'],['02','Practica','Resuelve primero y revisa después la explicación.'],['03','Refuerza','Anota el error y vuelve a intentarlo sin mirar.']].map(([n,t,d])=><article key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div><KitLink light>QUIERO UN REPASO MÁS ORGANIZADO</KitLink></div></section>

  <section className="paes-section"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">¿TE IDENTIFICAS?</span><h2>PARA QUIEN QUIERE<br/><em>APROVECHAR SU REPASO.</em></h2></div><div className="paes-audience">{[[GraduationCap,'Rindes por primera vez','Quieres ordenar M1 y Lectora sin saltar entre materiales que no sabes cómo usar.'],[Target,'Vuelves a rendir la PAES','Quieres identificar errores y reforzar lo que todavía te cuesta.'],[BookOpen,'Ya estudias en un preuniversitario','Buscas un apoyo de consulta y práctica; no reemplaza tus clases ni el temario.'],[ListChecks,'Acompañas a un estudiante','Como apoderado, quieres ver una rutina clara y tareas concretas de repaso.']].map(([Icon,title,body])=>{const I=Icon as typeof BookOpen;return <article key={String(title)}><I size={27} aria-hidden="true"/><h3>{String(title)}</h3><p>{String(body)}</p></article>})}</div></div></section>

  <section className="paes-section paes-soft" id="bonos"><div className="paes-wrap"><div className="paes-center"><span className="paes-eyebrow">COMPLEMENTOS QUE TIENEN UNA FUNCIÓN</span><h2>EL REPASO NO TERMINA<br/><em>AL MARCAR UNA RESPUESTA.</em></h2><p className="paes-intro">Esta es la propuesta de bonos del kit. Los contenidos completos están en preparación.</p></div><div className="paes-bonuses">
   <article className="paes-bonus paes-bonus-featured"><div className="paes-bonus-cover"><span>BONO PREVISTO</span><b>100</b><strong>ACTIVIDADES<br/>EXTRA</strong><BookOpen size={60} aria-hidden="true"/></div><div><span className="paes-eyebrow">EN PREPARACIÓN</span><h3>100 actividades extra</h3><p>Propuesta: 50 de M1 y 50 de Lectura, con soluciones explicadas. Práctica adicional para reforzar por tema, no para acumular páginas.</p></div></article>
   <article className="paes-bonus"><img src="/paes/visual/pagina-15.webp" width="780" height="1105" alt="Ejemplo de calendario de repaso de 7 días" loading="lazy" decoding="async"/><div><span className="paes-eyebrow">EJEMPLO EN LA MUESTRA</span><h3>Plan de repaso</h3><p>Una guía para repartir tus tareas y adaptar la semana a tus dificultades.</p></div></article>
   <article className="paes-bonus"><img src="/paes/visual/pagina-16.webp" width="780" height="1105" alt="Plantilla de registro de errores incluida en la muestra" loading="lazy" decoding="async"/><div><span className="paes-eyebrow">PLANTILLA EN LA MUESTRA</span><h3>Cuaderno de errores</h3><p>Registra qué falló, cómo se resuelve y cuándo volver a intentarlo.</p></div></article>
  </div></div></section>

  <section className="paes-section paes-offer" id="kit"><div className="paes-wrap paes-center"><span className="paes-eyebrow">CONOCE EL ALCANCE ANTES DE ELEGIR</span><h2>KIT DE REPASO<br/><em>M1 + LECTORA.</em></h2><div className="paes-offer-card"><span className="paes-launch">PRELANZAMIENTO</span><h3>PAES en Foco</h3><p>La propuesta reúne dos guías y tres complementos para ordenar tu práctica.</p><ul>{['Guía de repaso Matemática M1','Guía de Competencia Lectora','Bono previsto: 100 actividades extra','Plan de repaso y cuaderno de errores','Formato digital para consultar e imprimir'].map(t=><li key={t}><Check size={20}/><span>{t}</span></li>)}</ul><div className="paes-availability"><Clock3 size={23}/><div><strong>Kit completo en preparación</strong><p>El precio y la fecha de entrega se publicarán cuando el material esté listo.</p></div></div>{paesOffer.status === 'ready' && paesOffer.checkoutUrl ? <><strong className="paes-price">{new Intl.NumberFormat('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0}).format(paesOffer.priceCLP ?? 0)}</strong><button className="paes-button" onClick={checkout}>QUIERO MI KIT</button></> : <button className="paes-button paes-disabled" disabled>COMPRA AÚN NO DISPONIBLE</button>}<a className="paes-textlink" href={sample} target="_blank" rel="noopener">Mientras tanto, abre la muestra gratis <Download size={17}/></a><p className="paes-caption">La muestra no es el kit completo ni un ensayo oficial. No se cobra ni se solicita información personal para abrirla.</p></div></div></section>

  <section className="paes-section"><div className="paes-wrap paes-faq"><div className="paes-center"><span className="paes-eyebrow">CLARIDAD ANTES DE DECIDIR</span><h2>PREGUNTAS FRECUENTES</h2></div>{[
   ['¿Qué incluye la muestra gratuita?','Dieciséis páginas con diagramas de M1, ejemplos introductorios resueltos, ocho ejercicios de matemática con soluciones comentadas, un texto original con tres preguntas explicadas, un plan de repaso y una plantilla de errores.'],
   ['¿El kit ya se puede comprar?','Todavía no. Está en preparación. La muestra gratuita sí está disponible; el precio y las condiciones se anunciarán antes de abrir las compras.'],
   ['¿Incluye todas las pruebas PAES?','No. El alcance previsto es Matemática M1 y Competencia Lectora. No contempla M2, Ciencias ni Historia y Ciencias Sociales.'],
   ['¿Es material oficial de DEMRE?','No. Es una propuesta independiente. La muestra contiene ejercicios autorales introductorios. Revisa siempre los temarios, requisitos y calendarios en las páginas oficiales.'],
   ['¿Garantiza un puntaje o el ingreso a una carrera?','No. Es un apoyo para estudiar y practicar. El resultado depende de tu preparación y de los requisitos del proceso de admisión.'],
   ['¿Puedo verlo en el celular o imprimirlo?','Sí. La muestra es un PDF descargable. Puedes abrirla en el celular, tablet o computador e imprimir las páginas que necesites.'],
  ].map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<KitLink>VER EL KIT Y SU DISPONIBILIDAD</KitLink></div></section>
  <footer className="paes-footer"><div className="paes-wrap"><strong>PAES EN FOCO</strong><p>Material independiente de apoyo al estudio. Sin afiliación ni respaldo de DEMRE, Universidad de Chile o el Ministerio de Educación. Mockup ilustrativo; kit completo en preparación.</p><p>PAES Regular 2026, proceso de Admisión 2027: 30 de noviembre, 1 y 2 de diciembre de 2026. Consulta los canales oficiales antes de organizar tu rendición.</p><nav aria-label="Fuentes oficiales"><a href="https://www.mineduc.cl/comienza-la-inscripcion-a-la-paes-regular-2026-admision-2027/" target="_blank" rel="noopener">Calendario oficial</a><a href="https://acceso-sup.mineduc.cl/acceso-buscador/material-de-preparacion-paes" target="_blank" rel="noopener">Temarios y recursos</a></nav><small>© {new Date().getFullYear()} PAES en Foco. La compra del kit aún no está habilitada.</small></div></footer>
  {activePage !== null && <dialog id="sample-dialog" className="paes-dialog" onCancel={()=>setActivePage(null)} onClick={e=>{if(e.target===e.currentTarget)setActivePage(null)}}><div className="paes-dialog-head"><strong>{pages[activePage].title}</strong><button type="button" onClick={()=>setActivePage(null)} aria-label="Cerrar página ampliada" autoFocus><X/></button></div><img src={pages[activePage].src} width="804" height="1059" alt={pages[activePage].title}/><a href={sample} target="_blank" rel="noopener">Abrir PDF con zoom</a></dialog>}
 </main>;
}
