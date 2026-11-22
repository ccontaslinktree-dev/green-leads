import { useEffect, useRef, useState } from 'react';
import { Clock3, X } from 'lucide-react';
import { paesPlans } from '@/data/paes-offer';

const pages = [
  { title: 'Porcentajes paso a paso', desc: 'Cálculo, representación y ejemplo resuelto.', image: 'porcentajes' },
  { title: 'Parábolas, raíces y vértice', desc: 'Relaciona la fórmula con su gráfico.', image: 'parabolas' },
  { title: 'Geometría con números claros', desc: 'Pitágoras explicado con un diagrama.', image: 'pitagoras' },
  { title: 'Interpreta los gráficos', desc: 'Mediana, cuartiles y datos con contexto.', image: 'graficos' },
  { title: 'Comprueba el procedimiento', desc: 'Resoluciones del bono de 100 actividades.', image: 'resoluciones' },
  { title: 'Lectora con evidencia', desc: 'Revisa por qué una respuesta se sostiene.', image: 'lectora' },
];
const asset = (name: string, full = false) => `/paes/entregaveis/${name}${full ? '-ampliado' : ''}.webp`;

export function MaterialCarousel() {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (active === null || !dialog.current) return;
    dialog.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = old; trigger.current?.focus(); };
  }, [active]);
  const close = () => { dialog.current?.close(); setActive(null); };
  return <section className="paes-section paes-samples" id="muestra" aria-labelledby="material-preview-title">
    <div className="paes-wrap paes-center">
      <span className="paes-eyebrow">ASÍ SE VE TU REPASO POR DENTRO</span>
      <h2 id="material-preview-title">MENOS IMPROVISACIÓN.<br/><em>MÁS PRÁCTICA CON SENTIDO.</em></h2>
      <p className="paes-intro">Cálculos, gráficos y respuestas explicadas del material real. Toca una página para verla en grande.</p>
    </div>
    <div className="paes-marquee" role="region" aria-label="Carrusel automático de los entregables">
      <div className="paes-track">{[0, 1].map(copy => <div className="paes-track-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {pages.map((page, index) => <button type="button" className="paes-sample" key={page.image} tabIndex={copy === 1 ? -1 : 0} aria-label={`Ampliar: ${page.title}`} onClick={event => { trigger.current = event.currentTarget; setActive(index); }}>
          <img src={asset(page.image)} width="804" height="1056" loading="lazy" decoding="async" alt={copy === 0 ? page.title : ''}/>
          <strong>{page.title}</strong><span>{page.desc}</span>
        </button>)}
      </div>)}</div>
    </div>
    {active !== null && <dialog ref={dialog} className="paes-dialog" aria-label={pages[active].title} onCancel={event => { event.preventDefault(); close(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="paes-dialog-head"><strong>{pages[active].title}</strong><button type="button" aria-label="Cerrar página ampliada" onClick={close} autoFocus><X/></button></div>
      <img src={asset(pages[active].image, true)} width="1200" height="1700" alt={pages[active].title}/>
    </dialog>}
  </section>;
}

const valuation = [
  ['Guía visual de Matemática M1', 15],
  ['Guía de Competencia Lectora', 12],
  ['100 actividades con soluciones', 12],
  ['Plan de repaso de 7 y 14 días', 6],
  ['Cuaderno de errores', 5],
] as const;

export function ValueBreakdown({ formatPrice }: { formatPrice: (n: number) => string }) {
  const total = valuation.reduce((sum, [, value]) => sum + value, 0);
  return <section className="paes-section paes-value" aria-labelledby="value-title">
    <div className="paes-wrap paes-value-wrap">
      <div className="paes-center"><span className="paes-eyebrow">MIRA TODO LO QUE REÚNE EL COMPLETO</span><h2 id="value-title">CINCO HERRAMIENTAS.<br/><em>UN SOLO ACCESO.</em></h2></div>
      <div className="paes-value-card">
        <p className="paes-value-label">VALORACIÓN ESTIMADA DEL CONTENIDO</p>
        <dl>{valuation.map(([name, value]) => <div className="paes-value-row" key={name}><dt>{name}</dt><dd>{formatPrice(value)}</dd></div>)}</dl>
        <div className="paes-value-total"><span>Referencia estimada del conjunto</span><strong>{formatPrice(total)}</strong></div>
        <p className="paes-value-disclosure">Es una estimación de valor, no un precio anterior ni una tarifa de venta por separado.</p>
        <div className="paes-value-offer"><span>TU ACCESO AL PAQUETE COMPLETO</span><strong>{formatPrice(paesPlans.completo.priceUSD)}</strong><p>Pago único. Las dos guías + los tres bonos.</p></div>
        <p className="paes-value-upgrade">Por {formatPrice(paesPlans.completo.priceUSD - paesPlans.basico.priceUSD)} más que el Básico, también llevas las 100 actividades, el plan y el cuaderno de errores.</p>
      </div>
    </div>
  </section>;
}

export function PreparationPrompt() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const key = 'paes-preparation-prompt-v1';
    try { if (sessionStorage.getItem(key)) return; } catch { /* Still works when storage is unavailable. */ }
    const remaining = Math.ceil((Date.parse('2026-11-30T00:00:00-03:00') - Date.now()) / 86400000);
    if (remaining < -2) return;
    setDays(remaining);
    let timer: ReturnType<typeof setTimeout>;
    const show = () => {
      if (document.hidden || document.querySelector('dialog[open]')) { timer = setTimeout(show, 1000); return; }
      if (!dialog.current) return;
      dialog.current.showModal();
      try { sessionStorage.setItem(key, 'shown'); } catch { /* Session-only frequency control is optional. */ }
    };
    timer = setTimeout(show, 5000);
    return () => clearTimeout(timer);
  }, []);
  const close = () => dialog.current?.close();
  const continueReading = () => {
    close();
    const target = document.getElementById('preparacion');
    target?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    target?.focus({ preventScroll: true });
  };
  return <dialog ref={dialog} className="paes-preparation-prompt" aria-labelledby="preparation-prompt-title" aria-describedby="preparation-prompt-copy" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <button type="button" className="paes-prompt-close" aria-label="Cerrar aviso y seguir leyendo" onClick={close}><X/></button>
    <span className="paes-prompt-deadline"><Clock3 size={19}/>{days !== null && days > 0 ? `FALTAN ${days} DÍAS PARA LA PRIMERA JORNADA` : 'LA PAES REGULAR ESTÁ EN CURSO'}</span>
    <h2 id="preparation-prompt-title">LA PAES SE ACERCA.<br/><em>¿TE SIENTES PREPARADO?</em></h2>
    <p id="preparation-prompt-copy">Si todavía dudas frente a un ejercicio o no sabes qué repasar, este es el momento de detectarlo. El tiempo que queda antes de la prueba no vuelve.</p>
    <p className="paes-prompt-support">Sigue leyendo y descubre cómo organizar tu repaso de M1 y Competencia Lectora.</p>
    <button type="button" className="paes-button" onClick={continueReading}>QUIERO REVISAR MI PREPARACIÓN</button>
    <span className="paes-prompt-date">PAES Regular: 30 de noviembre, 1 y 2 de diciembre de 2026.</span>
  </dialog>;
}
