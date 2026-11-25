import { useRef, useState } from 'react';

const cards = [
 { id: '06', title: 'Revisa tu línea antes de lanzar', topic: 'LÍNEAS' },
 { id: '13', title: 'Asienta el nudo con control', topic: 'NUDOS' },
 { id: '23', title: 'Corrige la presentación del señuelo', topic: 'CARNADAS Y SEÑUELOS' },
 { id: '28', title: 'Encuentra pausas en la corriente', topic: 'LECTURA DEL AGUA' },
 { id: '31', title: 'Relaciona el pez con su cobertura', topic: 'PECES' },
 { id: '48', title: 'Distingue filetes y rodajas', topic: 'LIMPIEZA Y CORTES' },
];
export function AtlasCarousel() {
 const [paused, setPaused] = useState(false);
 const [selected, setSelected] = useState<(typeof cards)[number] | null>(null);
 const dialog = useRef<HTMLDialogElement>(null);
 const open = (card: (typeof cards)[number]) => { setSelected(card); dialog.current?.showModal(); };
 return <div className="atlas-showcase">
  <p className="atlas-label">MIRA LO QUE APRENDES. DEJA DE IMPROVISAR.</p>
  <div className="atlas-viewport" aria-label="Ejemplos reales del Atlas visual incluido en el Completo">
   <div className="atlas-track" style={{ animationPlayState: paused || selected ? 'paused' : undefined }}>
    {[false, true].map(duplicate => <div className="atlas-group" key={String(duplicate)} aria-hidden={duplicate || undefined}>
     {cards.map((card, index) => <button className="atlas-card" type="button" key={card.id} tabIndex={duplicate ? -1 : 0} onClick={() => open(card)} aria-label={`Ampliar ficha: ${card.title}`}>
      <img src={`/pescador/atlas/ficha-${card.id}.webp`} width="800" height="1200" alt={duplicate ? '' : card.title} loading={!duplicate && index < 2 ? 'eager' : 'lazy'} fetchPriority={!duplicate && index === 0 ? 'high' : 'auto'} decoding="async"/>
      <span className="atlas-card-topic">{card.topic}</span><strong>{card.title}</strong><span className="atlas-enlarge">Toca para ampliar</span>
     </button>)}
    </div>)}
   </div>
  </div>
  <div className="atlas-controls"><p><strong>Contenido real del Atlas de 50 fichas.</strong><br/>Un extra incluido en el Paquete Completo.</p><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused}>{paused ? 'Reanudar recorrido' : 'Pausar recorrido'}</button></div>
  <dialog ref={dialog} className="preview-dialog atlas-dialog" aria-label="Ficha visual ampliada" onClose={() => setSelected(null)} onClick={e => {if (e.target === e.currentTarget) dialog.current?.close();}}>
   <div><strong>{selected?.title}</strong><button type="button" aria-label="Cerrar ficha" onClick={() => dialog.current?.close()}>×</button></div>
   {selected && <img src={`/pescador/atlas/ficha-${selected.id}.webp`} width="800" height="1200" alt={selected.title}/>}
  </dialog>
 </div>;
}
