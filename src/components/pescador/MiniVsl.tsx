import { useRef } from 'react';
import { fishingMiniVsl } from '@/data/pescador-proof';
import { trackEvent } from '@/lib/office-tracking';
export function MiniVsl() {
 const marks=useRef(new Set<string>());
 if(!fishingMiniVsl.src)return null;
 const once=(name:string)=>{if(marks.current.has(name))return;marks.current.add(name);trackEvent(name,{video:'mini-vsl-pescador'});};
 return <div className="fishing-mini-vsl"><video data-mini-vsl controls playsInline preload="none" poster={fishingMiniVsl.poster} src={fishingMiniVsl.src} style={{aspectRatio:fishingMiniVsl.aspectRatio}} aria-label="Conoce el Manual del Pescador Práctico" onPlay={()=>once('VSL_Play')} onTimeUpdate={e=>{const v=e.currentTarget;if(!Number.isFinite(v.duration)||v.duration<=0)return;for(const mark of [25,50,75])if(v.currentTime/v.duration>=mark/100)once(`VSL_${mark}`);}} onEnded={()=>once('VSL_Complete')}/><p>Activa el sonido y descubre qué revisar antes de tu próxima salida.</p></div>;
}
