import { useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Layers3, Plus, Search, PenTool, PackageCheck } from "lucide-react";
import { VideoDemo } from "@/components/office/VideoDemo";
import { CountUp } from "@/components/office/CountUp";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";

const questions = [
  [
    "O que eu recebo e como começo?",
    "Você recebe o prompt completo. Copie, cole na sua conta do Claude e dê o contexto do seu projeto para organizar as cinco funções de agentes.",
  ],
  [
    "O Claude e as ferramentas estão incluídos?",
    "Não. Você usa sua própria conta do Claude. Assinaturas, integrações e geração ou exportação de vídeos com ferramentas externas são separadas.",
  ],
  [
    "Isso garante renda ou vendas?",
    "Não. O prompt organiza pesquisa e produção. O resultado depende da oferta, da execução, da divulgação e dos seus testes e decisões.",
  ],
];

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
          <section id="inicio" className="hero wrap story compact-hero">
            <span className="eyebrow">
              <span className="status-dot" /> SEU ESCRITÓRIO DE IA, NO CLAUDE
            </span>
            <h1>
              Pare de travar na ideia.
              <br />
              <span>
                Veja seu escritório
                <br />
                de IA em ação.
              </span>
            </h1>
            <p className="compact-lead">
              Um prompt para organizar pesquisa, copy, páginas e criativos.{" "}
              <strong>Veja como as etapas se conectam.</strong>
            </p>
            <VideoDemo
              {...officeOffer.videos.presentation}
              variant="hero"
              onContinue={() => advance(1)}
              continueLabel="Conhecer meu escritório"
            />
            <p className="section-caption">Assista com som. Conheça o fluxo antes de começar.</p>
          </section>
        )}
        {step === 1 && (
          <section className="desire-section">
            <div className="wrap story reveal">
              <span className="eyebrow">DA IDEIA À SUA PRÓXIMA AÇÃO</span>
              <h1 className="funnel-title">
                Menos tarefas soltas.
                <br />
                <span>
                  Mais direção
                  <br />
                  para executar.
                </span>
              </h1>
              <p>
                Chega de começar cada conversa do zero. Dê seu objetivo aos agentes e avance da
                pesquisa à estrutura da sua oferta.
              </p>
              <figure className="desire-art">
                <img
                  src="/images/escritorio-ia.webp"
                  width="1200"
                  height="800"
                  loading="lazy"
                  decoding="async"
                  alt="Representação de cinco funções conectadas: pesquisa, copy, páginas, criativos e entregáveis"
                />
                <figcaption>
                  <CountUp value={5} />
                  <span>
                    funções conectadas.
                    <br />
                    <strong>Você no comando.</strong>
                  </span>
                </figcaption>
              </figure>
              <div className="desire-benefits">
                <p>
                  <Search size={22} />
                  <span>
                    <strong>Pesquise com direção.</strong> Compare referências e ângulos de oferta.
                  </span>
                </p>
                <p>
                  <PenTool size={22} />
                  <span>
                    <strong>Tire a criação do rascunho.</strong> Organize copy, página e roteiros.
                  </span>
                </p>
                <p>
                  <PackageCheck size={22} />
                  <span>
                    <strong>Saiba o próximo passo.</strong> Estruture a entrega, revise e avance.
                  </span>
                </p>
              </div>
            </div>
          </section>
        )}
        {step === 2 && (
          <section id="mineracao" className="wrap story compact-mining reveal">
            <span className="eyebrow">COMECE PELA OFERTA</span>
            <h1 className="funnel-title">
              Escolher a oferta
              <br />
              muda o começo.
              <br />
              <span>Veja essa função em ação.</span>
            </h1>
            <p>
              Assista ao agente organizar referências e oportunidades. Transforme a pesquisa em uma
              hipótese de oferta para analisar e testar.
            </p>
            <VideoDemo
              {...officeOffer.videos.mining}
              variant="mining"
              onContinue={() => advance(3)}
              continueLabel="Ver meu acesso completo"
            />
            <p className="section-caption">
              Sinais de mercado ajudam a pesquisar. A validação continua com você.
            </p>
          </section>
        )}
        {step === 3 && (
          <section id="oferta" className="offer-section wrap story compact-offer">
            <div className="reveal">
              <span className="eyebrow">LOTE LIMITADO A 50 ACESSOS</span>
              <h1 className="funnel-title">
                Seu próximo passo
                <br />
                <span>
                  pode começar
                  <br />
                  com um prompt.
                </span>
              </h1>
              <p>
                Copie. Cole no Claude. Dê a direção.
                <br />
                <strong>Uma estrutura para sair da ideia e começar a executar.</strong>
              </p>
            </div>
            <div className="offer-package reveal">
              <img
                src="/images/prompt-escritorio.webp"
                width="1000"
                height="667"
                loading="lazy"
                decoding="async"
                alt="Pacote digital ilustrativo do prompt Escritório IA"
              />
              <article className="offer-card">
                <div className="offer-label">
                  <Layers3 size={20} /> ESCRITÓRIO IA <span>50 ACESSOS NO LOTE</span>
                </div>
                <h3>
                  O prompt completo
                  <br />
                  do seu escritório de IA.
                </h3>
                <ul className="offer-list">
                  {[
                    "Prompt pronto para colar no Claude",
                    "Mineração e pesquisa de ofertas",
                    "Copy e estrutura de páginas de vendas",
                    "Ganchos, roteiros e direção de criativos",
                    "Organização dos entregáveis",
                  ].map((item) => (
                    <li key={item}>
                      <Check size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="offer-price">
                  <span>Seu acesso ao prompt completo</span>
                  <strong>{formatPrice(officeOffer.price)}</strong>
                  <span>Pagamento único. Sem mensalidade do produto.</span>
                </div>
                {checkout ? (
                  <a href={checkout} onClick={purchase} className="cta cta--purchase">
                    Quero meu Escritório IA
                    <ArrowUpRight size={22} />
                  </a>
                ) : (
                  <>
                    <button className="cta cta--purchase" disabled>
                      Acesso em breve
                      <ArrowUpRight size={22} />
                    </button>
                    <p className="offer-opening">
                      As vendas ainda não abriram. O acesso será disponibilizado aqui.
                    </p>
                  </>
                )}
                <p className="offer-limit">
                  <strong>Apenas 50 acessos neste lote.</strong> Um ponto de partida para quem quer
                  organizar a própria operação.
                </p>
                <p className="offer-disclosure">
                  Você recebe o prompt para usar na sua conta do Claude. Assinaturas, integrações e
                  ferramentas externas são separadas. Você orienta, revisa e valida os materiais.
                </p>
              </article>
            </div>
            <div className="compact-questions reveal">
              <div className="faq-list">
                {questions.map(([q, a]) => (
                  <details key={q}>
                    <summary>
                      {q}
                      <Plus size={22} />
                    </summary>
                    <p>{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      {step < 3 && (
        <footer className="quiz-actions">
          <button className="cta" disabled={!ready || leaving} onClick={() => advance(step + 1)}>
            {step === 0
              ? "CONTINUAR · VER MEU ESCRITÓRIO"
              : step === 1
                ? "CONTINUAR · VER A MINERAÇÃO"
                : "CONTINUAR · VER MEU ACESSO"}
            <ArrowUpRight size={21} />
          </button>
        </footer>
      )}
    </div>
  );
}
