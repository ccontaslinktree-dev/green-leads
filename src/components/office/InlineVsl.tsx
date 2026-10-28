import { useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { trackEvent } from "@/lib/office-tracking";

type Props = { src: string; title: string; duration: string; trackingName: string };
export function InlineVsl({ src, title, duration, trackingName }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const marks = useRef(new Set<string>());
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const trackOnce = (name: string) => {
    if (marks.current.has(name)) return;
    marks.current.add(name);
    trackEvent(name, { video: trackingName });
  };
  const play = () => {
    const player = video.current;
    if (!player) return;
    if (!player.getAttribute("src")) player.src = src;
    if (player.error) player.load();
    if (player.ended) player.currentTime = 0;
    player.muted = false;
    setStarted(true);
    setEnded(false);
    setError(false);
    void player.play().catch(() => setError(true));
  };
  const toggle = () => {
    if (playing) video.current?.pause();
    else play();
  };
  return (
    <div className="vsl-player inline-vsl">
      <div className="inline-vsl-media">
        <video
          ref={video}
          playsInline
          preload="none"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noremoteplayback"
          aria-label={title}
          onClick={toggle}
          onPlay={() => trackOnce("VSL_Play")}
          onPlaying={() => {
            setPlaying(true);
            setError(false);
          }}
          onPause={() => setPlaying(false)}
          onError={() => {
            setError(true);
            setPlaying(false);
          }}
          onTimeUpdate={(event) => {
            const player = event.currentTarget;
            if (!Number.isFinite(player.duration) || player.duration <= 0) return;
            const percent = (player.currentTime / player.duration) * 100;
            setProgress(percent);
            for (const mark of [25, 50, 75]) if (percent >= mark) trackOnce(`VSL_${mark}`);
          }}
          onEnded={() => {
            setPlaying(false);
            setEnded(true);
            setProgress(100);
            trackOnce("VSL_Complete");
          }}
        />
        {!started ? (
          <button className="vsl-play" onClick={play} aria-label={`Assistir: ${title}`}>
            <span className="vsl-preview-label">VEJA A ESTRUTURA EM AÇÃO</span>
            <span className="vsl-preview-title">
              Menos noites no improviso.
              <br />
              <strong>Mais direção para executar.</strong>
            </span>
            <span className="vsl-play-icon">
              <Play size={30} fill="currentColor" aria-hidden="true" />
            </span>
            <span className="vsl-play-text">CLIQUE PARA ASSISTIR</span>
            <span className="vsl-preview-meta">
              <Volume2 size={16} aria-hidden="true" /> Com som · {duration}
            </span>
          </button>
        ) : (
          (!playing || error) && (
            <button
              className="inline-vsl-resume"
              onClick={play}
              aria-label={ended ? `Rever: ${title}` : `Continuar: ${title}`}
            >
              <Play size={28} fill="currentColor" aria-hidden="true" />
              <strong>
                {error ? "TENTAR NOVAMENTE" : ended ? "ASSISTIR NOVAMENTE" : "CONTINUAR ASSISTINDO"}
              </strong>
            </button>
          )
        )}
      </div>
      {started && (
        <div className="inline-vsl-footer">
          <button
            onClick={toggle}
            aria-label={playing ? `Pausar: ${title}` : `Continuar: ${title}`}
          >
            {playing ? <Pause size={17} /> : <Play size={17} />}
            <span>{playing ? "Pausar" : "Continuar"}</span>
          </button>
          <div
            className="inline-vsl-progress"
            role="progressbar"
            aria-label={`Progresso: ${title}`}
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
      {error && (
        <p className="inline-vsl-error" role="alert">
          Não foi possível reproduzir. Toque em tentar novamente.
        </p>
      )}
    </div>
  );
}
