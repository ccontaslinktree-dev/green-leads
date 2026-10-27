import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Layers3, LockKeyhole, Play, Volume2 } from "lucide-react";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";
import vslUrl from "../../WhatsApp Video 2026-10-27 at 19.19.43.mp4?url";
import "@/components/office/vsl.css";

export const Route = createFileRoute("/")({ component: VslPage });

function VslPage() {
  const video = useRef<HTMLVideoElement>(null);
  const offer = useRef<HTMLElement>(null);
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

  const startVideo = () => {
    const player = video.current;
    if (!player) return;
    setError(false);
    // Assign only on user interaction: the initial page never downloads the MP4.
    if (!player.getAttribute("src")) player.src = vslUrl;
    player.controls = true;
    setStarted(true);
    void player.play().catch(() => {
      // Keep native controls available if the browser needs another tap.
      setError(true);
    });
  };

  const completeVideo = () => {
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
          <div className={`vsl-player${started ? " vsl-player--started" : ""}`}>
            <video
              ref={video}
              preload="none"
              playsInline
              controls={started}
              aria-label="VSL original: conheça o Escritório IA"
              onPlay={() => {
                setError(false);
                trackOnce("VSL_Play");
              }}
              onTimeUpdate={(event) => {
                const player = event.currentTarget;
                if (!Number.isFinite(player.duration) || player.duration <= 0) return;
                for (const percent of [25, 50, 75]) {
                  if (player.currentTime / player.duration >= percent / 100)
                    trackOnce(`VSL_${percent}`);
                }
              }}
              onEnded={completeVideo}
              onError={() => setError(true)}
            />
            {!started && (
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
                <span className="vsl-play-text">CLIQUE PARA ASSISTIR</span>
                <span className="vsl-preview-meta">
                  <Volume2 size={16} aria-hidden="true" /> Com som · 2min32s
                </span>
              </button>
            )}
          </div>
          {error && (
            <p className="vsl-error" role="alert">
              Não foi possível iniciar o vídeo.{" "}
              <button onClick={startVideo}>Tentar novamente</button> ou{" "}
              <a href={vslUrl}>abrir o vídeo diretamente</a>.
            </p>
          )}
          <p className="vsl-retention">
            <strong>Continue até o final.</strong> Esses minutos podem ajudar você a evitar mais um
            teste no improviso.
          </p>
          <div className="vsl-offer-region" aria-live="polite">
            {finished ? (
              <section
                ref={offer}
                id="oferta"
                className="vsl-offer"
                aria-labelledby="vsl-offer-title"
              >
                <span className="vsl-eyebrow">AGORA É A SUA VEZ</span>
                <h2 id="vsl-offer-title">Monte seu Escritório IA.</h2>
                <p>
                  Receba o e-book com o prompt completo e as orientações para organizar cinco
                  funções no ChatGPT ou Claude: pesquisa, copy, páginas, criativos e entregáveis.
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
                  E-book em PDF + prompt. Use com sua própria conta de IA.
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
