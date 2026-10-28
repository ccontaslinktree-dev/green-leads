import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Layers3, LockKeyhole, Play, Volume2, X, Pause } from "lucide-react";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";
import vslUrl from "../../WhatsApp Video 2026-10-27 at 19.19.43.mp4?url";
import "@/components/office/vsl.css";
import { VslProof } from "@/components/office/VslProof";

export const Route = createFileRoute("/")({ component: VslPage });

function VslPage() {
  const video = useRef<HTMLVideoElement>(null);
  const offer = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const watched = useRef(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const tracked = useRef(new Set<string>());
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    initializeTracking();
  }, []);

  const trackOnce = (name: string) => {
    if (tracked.current.has(name)) return;
    tracked.current.add(name);
    trackEvent(name, { content_name: officeOffer.name, video: "vsl_original" });
  };

  const closePlayer = () => {
    video.current?.pause();
    if (document.fullscreenElement === dialog.current)
      void document.exitFullscreen().catch(() => {});
    if (dialog.current?.open) dialog.current.close();
    document.body.style.overflow = "";
    previousFocus.current?.focus();
  };

  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  const resumeVideo = () => {
    const player = video.current;
    if (!player) return;
    setError(false);
    void player.play().catch(() => setError(true));
  };

  const startVideo = () => {
    const player = video.current;
    if (!player) return;
    setError(false);
    // Assign only on user interaction: the initial page never downloads the MP4.
    if (!player.getAttribute("src")) player.src = vslUrl;
    player.controls = false;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    if (!dialog.current?.open) dialog.current?.showModal();
    // Full-viewport dialog remains available where the Fullscreen API is unsupported.
    if (dialog.current?.requestFullscreen && !document.fullscreenElement)
      void dialog.current.requestFullscreen().catch(() => {});
    setStarted(true);
    resumeVideo();
  };

  const completeVideo = () => {
    const player = video.current;
    if (!player || !Number.isFinite(player.duration)) return;
    if (watched.current < player.duration - 0.8) {
      player.currentTime = watched.current;
      return;
    }
    closePlayer();
    trackOnce("VSL_Complete");
    setFinished(true);
    if (!tracked.current.has("ViewContent")) {
      tracked.current.add("ViewContent");
      trackEvent("ViewContent", {
        content_name: officeOffer.name,
        value: officeOffer.price,
        currency: "BRL",
      });
    }
  };

  useEffect(() => {
    if (finished)
      offer.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
  }, [finished]);

  return (
    <div className="vsl-page">
      <header className="vsl-brand" aria-label="Escritório IA">
        <Layers3 size={22} aria-hidden="true" />
        <span>
          escritório<strong>IA</strong>
        </span>
      </header>
      <main className="vsl-main">
        <div className="vsl-intro">
          <p className="vsl-eyebrow">PARA INFOPRODUTORES E GESTORES DE TRÁFEGO</p>
          <h1>
            Mais uma noite procurando ofertas e <em>colocando seu orçamento em risco?</em>
          </h1>
          <p className="vsl-lead">
            Antes de gastar no próximo teste, assista a estes poucos minutos. Descubra como usar a
            IA para organizar sua pesquisa e parar de começar tudo do zero.
          </p>
        </div>
        <section className="vsl-watch" aria-label="Vídeo de apresentação do Escritório IA">
          <p className="vsl-scarcity">LOTE LIMITADO A 50 ACESSOS</p>
          <div className={`vsl-player${finished ? " vsl-player--complete" : ""}`}>
            <dialog
              ref={dialog}
              className="vsl-cinema"
              aria-label="Assista até o final para liberar a oferta"
              onCancel={closePlayer}
              onClose={closePlayer}
            >
              <div className="vsl-cinema-header">
                <span>ASSISTA ATÉ O FINAL PARA LIBERAR A OFERTA</span>
                <button onClick={closePlayer} aria-label="Fechar vídeo">
                  <X size={22} />
                </button>
              </div>
              <video
                ref={video}
                preload="none"
                playsInline
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                controlsList="nodownload noplaybackrate noremoteplayback"
                onContextMenu={(event) => event.preventDefault()}
                onClick={() => {
                  if (playing) video.current?.pause();
                  else resumeVideo();
                }}
                onPause={() => setPlaying(false)}
                onPlaying={() => setPlaying(true)}
                onSeeking={(event) => {
                  if (event.currentTarget.currentTime > watched.current + 0.8)
                    event.currentTarget.currentTime = watched.current;
                }}
                onRateChange={(event) => {
                  if (event.currentTarget.playbackRate !== 1) event.currentTarget.playbackRate = 1;
                }}
                aria-label="VSL original: conheça o Escritório IA"
                onPlay={() => {
                  setError(false);
                  trackOnce("VSL_Play");
                }}
                onTimeUpdate={(event) => {
                  const player = event.currentTarget;
                  if (!Number.isFinite(player.duration) || player.duration <= 0) return;
                  if (player.currentTime > watched.current + 1.5) {
                    player.currentTime = watched.current;
                    return;
                  }
                  watched.current = Math.max(watched.current, player.currentTime);
                  setProgress((watched.current / player.duration) * 100);
                  for (const percent of [25, 50, 75]) {
                    if (player.currentTime / player.duration >= percent / 100)
                      trackOnce(`VSL_${percent}`);
                  }
                }}
                onEnded={completeVideo}
                onError={() => setError(true)}
              />
              {(!playing || error) && (
                <button className="vsl-resume" onClick={resumeVideo}>
                  <Play size={30} fill="currentColor" />
                  <strong>{error ? "TENTAR NOVAMENTE" : "CONTINUAR ASSISTINDO"}</strong>
                  <span>Assista até o final para liberar a oferta.</span>
                </button>
              )}
              <div className="vsl-cinema-footer">
                <button
                  onClick={() => {
                    if (playing) video.current?.pause();
                    else resumeVideo();
                  }}
                  aria-label={playing ? "Pausar vídeo" : "Continuar vídeo"}
                >
                  {playing ? <Pause size={16} /> : <Play size={16} />}{" "}
                  {playing ? "Pausar" : "Continuar"}
                </button>
                <div
                  className="vsl-watch-progress"
                  role="progressbar"
                  aria-label="Vídeo assistido"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <span style={{ width: `${progress}%` }} />
                </div>
                <span>Oferta liberada ao concluir · 50 acessos</span>
              </div>
            </dialog>
            {(!started || !finished) && (
              <button
                className="vsl-play"
                onClick={startVideo}
                aria-label="Assistir ao vídeo com som"
              >
                <span className="vsl-preview-label">VEJA POR DENTRO</span>
                <span className="vsl-preview-title">
                  Suas próximas ofertas
                  <br />
                  <strong>começam com direção.</strong>
                </span>
                <span className="vsl-play-icon">
                  <Play size={30} fill="currentColor" aria-hidden="true" />
                </span>
                <span className="vsl-play-text">
                  {started ? "CONTINUAR ASSISTINDO" : "CLIQUE PARA ASSISTIR"}
                </span>
                <span className="vsl-preview-meta">
                  <Volume2 size={16} aria-hidden="true" /> Com som · 2min32s
                </span>
              </button>
            )}
          </div>
          {error && (
            <p className="vsl-error" role="alert">
              Não foi possível iniciar o vídeo.{" "}
              <button onClick={startVideo}>Tentar novamente</button>.
            </p>
          )}
          <VslProof onWatch={startVideo} />
          <p className="vsl-retention">
            <strong>Assista até o final para liberar a oferta.</strong> A apresentação mostra o
            funcionamento do prompt antes da compra.
          </p>
          <div className="vsl-offer-region" aria-live="polite">
            {finished ? (
              <section
                ref={offer}
                id="oferta"
                className="vsl-offer"
                aria-labelledby="vsl-offer-title"
              >
                <span className="vsl-eyebrow">OFERTA LIBERADA · LOTE DE 50 ACESSOS</span>
                <h2 id="vsl-offer-title">Monte seu Escritório IA.</h2>
                <p>
                  Receba o guia com o prompt completo e as orientações para organizar cinco funções
                  no ChatGPT ou Claude: pesquisa, copy, páginas, criativos e entregáveis.
                </p>
                <div className="vsl-price">
                  <strong>{formatPrice(officeOffer.price)}</strong>
                  <span>Pagamento único</span>
                </div>
                <a
                  className="vsl-buy"
                  href={officeOffer.checkoutUrl ?? undefined}
                  onClick={(event) => {
                    const url = getCheckoutUrl();
                    if (!url) {
                      event.preventDefault();
                      return;
                    }
                    event.currentTarget.href = url;
                    trackEvent("InitiateCheckout", {
                      content_name: officeOffer.name,
                      value: officeOffer.price,
                      currency: "BRL",
                    });
                  }}
                >
                  QUERO MEU PROMPT DE IA <ArrowRight size={19} aria-hidden="true" />
                </a>
                <p className="vsl-purchase-note">
                  Guia em PDF + prompt. Use com sua própria conta de IA.
                </p>
              </section>
            ) : (
              <p className="vsl-wait">
                <LockKeyhole size={16} aria-hidden="true" />
                <span>
                  Ao final do vídeo, você poderá garantir o prompt por{" "}
                  <strong>{formatPrice(officeOffer.price)}.</strong>
                </span>
              </p>
            )}
          </div>
        </section>
      </main>
      <footer className="vsl-footer">
        Escritório IA · Organização para a sua operação digital.
      </footer>
    </div>
  );
}
