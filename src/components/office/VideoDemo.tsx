import { useEffect, useRef, useState } from "react";
import { ArrowDown, Play, RotateCcw, Volume2, X } from "lucide-react";
import { trackEvent } from "@/lib/office-tracking";

type Props = {
  src: string;
  poster: string;
  title: string;
  duration: string;
  variant?: "hero" | "mining";
};
export function VideoDemo({ src, poster, title, duration, variant = "hero" }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const originalOverflow = useRef("");
  const watchdog = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const marks = useRef(new Set<string>());
  const [open, setOpen] = useState(false);
  const [ended, setEnded] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  function clearWatchdog() {
    clearTimeout(watchdog.current);
  }
  function waiting() {
    clearWatchdog();
    watchdog.current = setTimeout(() => setFailed(true), 8000);
  }
  function milestone(name: string) {
    if (marks.current.has(name)) return;
    marks.current.add(name);
    trackEvent(name, { video: variant === "hero" ? "apresentacao" : "mineracao" });
  }
  async function start() {
    const player = video.current;
    if (!player) return;
    setBlocked(false);
    setFailed(false);
    document.querySelectorAll("video").forEach((other) => {
      if (other !== player) other.pause();
    });
    player.muted = false;
    waiting();
    try {
      await player.play();
    } catch {
      clearWatchdog();
      setBlocked(true);
    }
  }
  function launch() {
    previousFocus.current = document.activeElement as HTMLElement;
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setEnded(false);
    setOpen(true);
    setProgress(0);
    const player = video.current;
    if (player) {
      // Attach only after the gesture. No video bytes are requested on page load.
      if (!player.getAttribute("src")) player.src = src;
      else player.currentTime = 0;
    }
    dialog.current?.showModal();
    void start();
  }
  function cleanup() {
    clearWatchdog();
    video.current?.pause();
    document.body.style.overflow = originalOverflow.current;
    setOpen(false);
    previousFocus.current?.focus({ preventScroll: true });
  }
  function close() {
    dialog.current?.close();
    cleanup();
  }
  function goToOffer() {
    close();
    trackEvent("ClickParaOferta", { local: `final-vsl-${variant}` });
    document.getElementById("oferta")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  useEffect(() => {
    if (!open) return;
    function visibility() {
      if (!document.hidden && video.current?.paused && !video.current.ended && !failed && !blocked)
        void start();
    }
    document.addEventListener("visibilitychange", visibility);
    return () => document.removeEventListener("visibilitychange", visibility);
    // Playback resumes only when this dedicated player is open and the tab returns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, failed, blocked]);
  useEffect(
    () => () => {
      clearTimeout(watchdog.current);
      if (dialog.current?.open) document.body.style.overflow = originalOverflow.current;
    },
    [],
  );
  return (
    <div className={`video-demo video-demo--${variant}`}>
      <button className="video-cover" onClick={launch} aria-label={`Assistir: ${title}`}>
        <img src={poster} width="576" height="1024" alt="" loading="lazy" decoding="async" />
        <span className="video-cover__shade" />
        <span className="video-cover__duration">DEMONSTRAÇÃO REAL · {duration}</span>
        <span className="video-cover__center">
          <span className="play-disc">
            <Play size={30} fill="currentColor" />
          </span>
          <strong>
            {variant === "hero" ? (
              <>
                Seu escritório.
                <br />
                Em ação.
              </>
            ) : (
              <>
                Da pesquisa
                <br />à oportunidade.
              </>
            )}
          </strong>
          <span>
            Toque para assistir <Volume2 size={18} />
          </span>
        </span>
      </button>
      <dialog
        ref={dialog}
        className="vsl-dialog"
        aria-label={title}
        aria-modal="true"
        onCancel={cleanup}
        onClose={cleanup}
        onContextMenu={(event) => event.preventDefault()}
      >
        <button className="vsl-close" onClick={close} aria-label="Fechar vídeo">
          <X size={20} />
          <span>Fechar</span>
        </button>
        <video
          ref={video}
          className="vsl-video"
          preload="none"
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          aria-label={title}
          onPlaying={() => {
            clearWatchdog();
            setBlocked(false);
            setFailed(false);
            milestone("VSL_Play");
          }}
          onWaiting={waiting}
          onStalled={waiting}
          onError={() => {
            clearWatchdog();
            setFailed(true);
          }}
          onTimeUpdate={() => {
            const v = video.current;
            if (!v || !Number.isFinite(v.duration) || !v.duration) return;
            const p = v.currentTime / v.duration;
            setProgress(p * 100);
            [25, 50, 75].forEach((mark) => {
              if (p >= mark / 100) milestone(`VSL_${mark}`);
            });
          }}
          onEnded={() => {
            clearWatchdog();
            setProgress(100);
            setEnded(true);
            milestone("VSL_Complete");
          }}
        />
        {(blocked || failed) && !ended && (
          <div className="vsl-fallback" role="status">
            <p>
              {failed ? "A conexão interrompeu o vídeo." : "Toque para iniciar o vídeo com som."}
            </p>
            <button
              className="cta"
              onClick={() => {
                if (failed) video.current?.load();
                void start();
              }}
            >
              {failed ? <RotateCcw size={20} /> : <Volume2 size={20} />}
              {failed ? "Tentar novamente" : "Assistir com som"}
            </button>
          </div>
        )}
        {ended && (
          <div className="vsl-end">
            <span className="eyebrow">AGORA VOCÊ CONHECE O FLUXO</span>
            <h2>
              Uma ideia com direção
              <br />
              já tem um próximo passo.
            </h2>
            <p>Confira o que está incluído no prompt completo.</p>
            <button className="cta" onClick={goToOffer}>
              Ver o acesso
              <ArrowDown size={22} />
            </button>
            <button className="vsl-return" onClick={close}>
              Continuar lendo a página
            </button>
          </div>
        )}
        <div
          className="vsl-progress"
          role="progressbar"
          aria-label="Progresso do vídeo"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </dialog>
    </div>
  );
}
