import { useRef, useState } from 'react';
import { fishingMiniVsl } from '@/data/pescador-proof';
import { trackEvent } from '@/lib/office-tracking';
export function MiniVsl() {
 const video=useRef<HTMLVideoElement>(null);
 const marks=useRef(new Set<string>());
 const [started,setStarted]=useState(false);
 const [pending,setPending]=useState(false);
 const [error,setError]=useState(false);
 if(!fishingMiniVsl.src)return null;
 const once=(name:string)=>{if(marks.current.has(name))return;marks.current.add(name);trackEvent(name,{video:'mini-vsl-pescador'});};
 const play=async()=>{const player=video.current;if(!player)return;setPending(true);setError(false);if(player.ended)player.currentTime=0;player.muted=false;try{await player.play();}catch{setError(true);}finally{setPending(false);}};
 return <div className="fishing-mini-vsl"><div className="fishing-mini-vsl-media"><video ref={video} data-mini-vsl controls playsInline preload="none" poster={fishingMiniVsl.poster} src={fishingMiniVsl.src} width={576} height={1024} style={{aspectRatio:fishingMiniVsl.aspectRatio}} aria-label="Conoce el Manual del Pescador Práctico" onPlay={()=>{setStarted(true);once('VSL_Play');}} onPlaying={()=>setError(false)} onError={()=>{setError(true);setPending(false);setStarted(false);}} onTimeUpdate={e=>{const v=e.currentTarget;if(!Number.isFinite(v.duration)||v.duration<=0)return;for(const mark of [25,50,75])if(v.currentTime/v.duration>=mark/100)once(`VSL_${mark}`);}} onEnded={()=>{once('VSL_Complete');setStarted(false);}}/>{(!started||error)&&<button className="fishing-vsl-start" type="button" onClick={()=>void play()} disabled={pending} aria-label={error?'Reintentar video con sonido':'Ver presentación con sonido'}><span className="fishing-vsl-play" aria-hidden="true">▶</span><strong>{pending?'INICIANDO…':error?'VOLVER A INTENTAR':'VER CON SONIDO'}</strong><span>1 MINUTO PARA PREPARAR MEJOR TU PESCA</span></button>}</div>{error?<p role="alert">No se pudo reproducir. Revisa tu conexión y vuelve a intentar.</p>:<p>Activa el sonido y descubre qué revisar antes de tu próxima salida.</p>}</div>;
}
