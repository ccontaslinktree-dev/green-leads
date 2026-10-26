import { useRef, useState } from "react";
import { Play, Volume2, RotateCcw, ArrowUpRight } from "lucide-react";
type Props = {
  src: string;
  poster: string;
  title: string;
  duration: string;
  variant?: "hero" | "mining";
};
export function VideoDemo({ src, poster, title, duration, variant = "hero" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  function pauseOthers() {
    document.querySelectorAll("video").forEach((other) => {
      if (other !== videoRef.current) other.pause();
    });
  }
  async function play() {
    const video = videoRef.current;
    if (!video) return;
    setFailed(false);
    pauseOthers();
    video.muted = false;
    setStarted(true);
    try {
      await video.play();
    } catch {
      // Keep native controls available if a browser blocks the initial play request.
      setStarted(true);
    }
  }
  return (
    <div className={`video-demo video-demo--${variant}`}>
      <div className="video-demo__bar">
        <span className="video-demo__dot" />
        <span>{variant === "hero" ? "DEMONSTRAÇÃO REAL" : "MINERAÇÃO NA PRÁTICA"}</span>
        <span className="video-demo__length">{duration}</span>
      </div>
      <div className="video-demo__screen">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls={started}
          preload="none"
          playsInline
          aria-label={title}
          onPlay={pauseOthers}
          onError={() => {
            setFailed(true);
            setStarted(false);
          }}
        />
        {!started && !failed && (
          <button className="video-demo__cover" onClick={play} aria-label={`Assistir: ${title}`}>
            <span className="video-demo__play">
              <Play fill="currentColor" size={28} />
            </span>
            <span className="video-demo__cover-title">
              {variant === "hero" ? (
                <>
                  Um escritório de IA.
                  <br />
                  Veja funcionando.
                </>
              ) : (
                <>
                  Como encontrar
                  <br />a próxima oportunidade.
                </>
              )}
            </span>
            <span className="video-demo__watch">
              Assistir com som <Volume2 size={17} />
            </span>
          </button>
        )}
        {failed && (
          <div className="video-demo__error" role="alert">
            <p>Não foi possível carregar o vídeo.</p>
            <button onClick={play}>
              <RotateCcw size={18} /> Tentar novamente
            </button>
          </div>
        )}
      </div>
      <div className="video-demo__caption">
        <Volume2 size={16} />
        <span>{title}</span>
        <ArrowUpRight size={17} />
      </div>
    </div>
  );
}
