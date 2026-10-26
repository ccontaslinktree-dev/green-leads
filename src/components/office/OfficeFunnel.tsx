import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Layers3, Search, PenTool, PackageCheck } from "lucide-react";
import { VideoDemo } from "@/components/office/VideoDemo";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";

export function OfficeFunnel({ step = 0 }: { step?: number }) {
  const [leaving, setLeaving] = useState(false);
  const [ready, setReady] = useState(false);
  const moving = useRef(false);
  const navigate = useNavigate();
  const labels = ["Conheça", "Seu escritório", "Mineração", "Seu acesso"];
  function advance(next: number) {
    if (moving.current) return;
    moving.current = true;
    trackEvent("Funnel_Advance", { local: `${step + 1}_para_${next + 1}` });
    setLeaving(true);

    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 160;
    setTimeout(() => {
      const query = Object.fromEntries(new URLSearchParams(window.location.search));
      void navigate({ to: "/", search: { ...query, fase: next + 1 } });
    }, delay);
  }
  const main = useRef<HTMLElement>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  useEffect(() => {
    moving.current = false;
    setLeaving(false);
    setReady(true);
    setCheckout(getCheckoutUrl());
    initializeTracking();
    trackEvent("Funnel_Step", { local: String(step + 1) });
    main.current?.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
    const offer = document.getElementById("oferta");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent("ViewContent", {
            content_name: officeOffer.name,
            value: officeOffer.price,
            currency: "BRL",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (offer) observer.observe(offer);
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.1 },
    );
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      main.current?.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("will-reveal");
        reveal.observe(el);
      });
    }
    return () => {
      observer.disconnect();
      reveal.disconnect();
    };
  }, [step]);
  useEffect(() => {
    function restore(event: PageTransitionEvent) {
      if (!event.persisted) return;
      moving.current = false;
      setLeaving(false);
      setReady(true);
      trackEvent("PageView");
      trackEvent("Funnel_Step", { local: String(step + 1) });
    }
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, [step]);
  async function purchase(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!checkout) return;
    trackEvent("InitiateCheckout", {
      content_name: officeOffer.name,
      value: officeOffer.price,
      currency: "BRL",
    });
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    await new Promise((resolve) => setTimeout(resolve, 150));
    window.location.assign(checkout);
  }
  return (
    <div className="office-page office-page--compact office-funnel quiz-shell">
      <header className="site-header wrap">
        <div className="brand" aria-label="Escritório IA">
          <span className="brand-symbol">
            <Layers3 size={23} />
          </span>
          escritório<span className="brand-ia">IA</span>
        </div>
        <span className="quiz-header-label">SEU PRÓXIMO PASSO</span>
      </header>
      <nav className="funnel-nav wrap story" aria-label="Etapas da apresentação">
        <div className="funnel-nav__line">
          {step > 0 ? (
            <button onClick={() => advance(step - 1)} disabled={!ready || leaving}>
              ← Voltar
            </button>
          ) : (
            <span>CONHEÇA O ESCRITÓRIO IA</span>
          )}
          <span>
            Etapa {step + 1} de 4 · {labels[step]}
          </span>
        </div>
        <div
          className="funnel-rail"
          role="progressbar"
          aria-label="Progresso da apresentação"
          aria-valuemin={1}
          aria-valuemax={4}
          aria-valuenow={step + 1}
        >
          <span style={{ width: `${(step + 1) * 25}%` }} />
        </div>
      </nav>
      <main
        key={step}
        ref={main}
        tabIndex={-1}
        className={leaving ? "funnel-screen is-leaving" : "funnel-screen"}
      >
        {step === 0 && (
          <section className="screen-card screen-video" id="inicio">
            <h1>
              Pare de travar na ideia.
              <br />
              <span>Veja a IA em ação.</span>
            </h1>
            <p>Conheça o prompt que organiza seu escritório de agentes no Claude.</p>
            <VideoDemo
              {...officeOffer.videos.presentation}
              variant="hero"
              onContinue={() => advance(1)}
              continueLabel="Conhecer meu escritório"
            />
            <span className="screen-note">Toque para assistir com som.</span>
          </section>
        )}
        {step === 1 && (
          <section className="screen-card screen-benefits">
            <h1>
              Da ideia à execução.
              <br />
              <span>Com direção.</span>
            </h1>
            <p>Cinco funções conectadas. Você orienta, a IA apoia e você revisa.</p>
            <img
              className="screen-art"
              src="/images/escritorio-ia.webp"
              width="1200"
              height="800"
              alt="Cinco funções de agentes conectadas"
              loading="lazy"
            />
            <ul className="screen-delivery">
              <li>
                <Search size={21} />
                <span>
                  <strong>Pesquisa de ofertas</strong>Referências e ângulos.
                </span>
              </li>
              <li>
                <PenTool size={21} />
                <span>
                  <strong>Copy e páginas</strong>Estruture sua mensagem.
                </span>
              </li>
              <li>
                <PackageCheck size={21} />
                <span>
                  <strong>Criativos e entregáveis</strong>Planeje o próximo passo.
                </span>
              </li>
            </ul>
          </section>
        )}
        {step === 2 && (
          <section className="screen-card screen-video" id="mineracao">
            <h1>
              Não sabe o que vender?
              <br />
              <span>Comece pela pesquisa.</span>
            </h1>
            <p>Veja uma das funções mais valiosas: organizar referências de ofertas para testar.</p>
            <VideoDemo
              {...officeOffer.videos.mining}
              variant="mining"
              onContinue={() => advance(3)}
              continueLabel="Ver meu acesso completo"
            />
            <span className="screen-note">Você analisa os sinais e decide o teste.</span>
          </section>
        )}
        {step === 3 && (
          <section className="screen-card screen-offer" id="oferta">
            <span className="screen-batch">LOTE LIMITADO A 50 ACESSOS</span>
            <h1>
              Sua próxima oferta
              <br />
              <span>merece sair do papel.</span>
            </h1>
            <article className="screen-package">
              <h2>
                <Layers3 size={22} />
                Prompt Escritório IA
              </h2>
              <ul>
                <li>
                  <Check size={18} />
                  Pesquisa de ofertas
                </li>
                <li>
                  <Check size={18} />
                  Copy, páginas e criativos
                </li>
                <li>
                  <Check size={18} />
                  Entregáveis organizados
                </li>
              </ul>
              <strong className="screen-price">{formatPrice(officeOffer.price)}</strong>
              <p>Pagamento único pelo prompt.</p>
            </article>
            <p className="screen-disclosure">
              Use sua conta do Claude. Assinaturas e ferramentas externas são separadas. Vendas não
              são garantidas.
            </p>
          </section>
        )}
      </main>
      <footer className="quiz-actions">
        {step < 3 ? (
          <button className="cta" disabled={!ready || leaving} onClick={() => advance(step + 1)}>
            CONTINUAR
            <ArrowUpRight size={21} />
          </button>
        ) : checkout ? (
          <a href={checkout} onClick={purchase} className="cta cta--purchase">
            Quero meu Escritório IA
            <ArrowUpRight size={21} />
          </a>
        ) : (
          <button className="cta cta--purchase" disabled>
            Acesso em breve
            <ArrowUpRight size={21} />
          </button>
        )}
      </footer>
    </div>
  );
}
