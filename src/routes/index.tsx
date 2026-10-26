import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Layers3,
  Plus,
  Search,
  PenTool,
  PackageCheck,
} from "lucide-react";
import { VideoDemo } from "@/components/office/VideoDemo";
import { CountUp } from "@/components/office/CountUp";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";

export const Route = createFileRoute("/")({ component: Index });

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

function OfferLink({ children, local }: { children: ReactNode; local: string }) {
  return (
    <a className="cta" href="#oferta" onClick={() => trackEvent("ClickParaOferta", { local })}>
      {children}
      <ArrowDown size={21} aria-hidden="true" />
    </a>
  );
}

function Index() {
  const main = useRef<HTMLElement>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  useEffect(() => {
    setCheckout(getCheckoutUrl());
    initializeTracking();
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
  }, []);
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
    <div className="office-page office-page--compact">
      <header className="site-header wrap">
        <a href="#inicio" className="brand" aria-label="Escritório IA, início">
          <span className="brand-symbol">
            <Layers3 size={23} />
          </span>
          escritório<span className="brand-ia">IA</span>
        </a>
        <span className="header-edition">
          EDIÇÃO LIMITADA <strong>50 acessos</strong>
        </span>
      </header>
      <main ref={main}>
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
          <VideoDemo {...officeOffer.videos.presentation} variant="hero" />
          <p className="section-caption">Assista com som. Conheça o fluxo antes de começar.</p>
        </section>
        <section className="desire-section">
          <div className="wrap story reveal">
            <span className="eyebrow">DA IDEIA À SUA PRÓXIMA AÇÃO</span>
            <h2>
              Menos tarefas soltas.
              <br />
              <span>
                Mais direção
                <br />
                para executar.
              </span>
            </h2>
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
            <OfferLink local="apos-beneficios">Quero conhecer o prompt completo</OfferLink>
          </div>
        </section>
        <section id="mineracao" className="wrap story compact-mining reveal">
          <span className="eyebrow">COMECE PELA OFERTA</span>
          <h2>
            Ainda não sabe
            <br />o que vender?
            <br />
            <span>Veja por onde começar.</span>
          </h2>
          <p>
            Assista ao agente organizar referências e oportunidades. Transforme a pesquisa em uma
            hipótese de oferta para analisar e testar.
          </p>
          <VideoDemo {...officeOffer.videos.mining} variant="mining" />
          <p className="section-caption">
            Sinais de mercado ajudam a pesquisar. A validação continua com você.
          </p>
        </section>
        <section id="oferta" className="offer-section wrap story compact-offer">
          <div className="reveal">
            <span className="eyebrow">LOTE LIMITADO A 50 ACESSOS</span>
            <h2>
              Seu próximo passo
              <br />
              <span>
                pode começar
                <br />
                com um prompt.
              </span>
            </h2>
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
      </main>
      <footer className="site-footer wrap">
        <div className="brand">
          <Layers3 size={22} />
          escritório<span className="brand-ia">IA</span>
        </div>
        <p>
          Produto independente. Sem afiliação com a Anthropic ou o Claude. Não há garantia de vendas
          ou faturamento.
        </p>
        <span>© 2026 Escritório IA.</span>
      </footer>
    </div>
  );
}
