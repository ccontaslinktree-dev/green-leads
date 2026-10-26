import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Copy,
  Layers3,
  Plus,
  Command,
  Search,
  PenTool,
  LayoutTemplate,
  Clapperboard,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { AgentDesk } from "@/components/office/AgentDesk";
import { VideoDemo } from "@/components/office/VideoDemo";
import { CountUp } from "@/components/office/CountUp";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";

export const Route = createFileRoute("/")({ component: Index });

const questions = [
  [
    "O que eu recebo por R$ 9,99?",
    "O prompt completo do Escritório IA, para colar no Claude e organizar cinco funções: mineração de ofertas, copy, páginas, criativos e entregáveis. Você recebe o prompt, não uma licença de software ou uma equipe humana.",
  ],
  [
    "Preciso saber programar?",
    "Para começar a conversa com os agentes, não. Você cola o prompt, explica seu objetivo e revisa as respostas. Publicar páginas, gerar vídeos e conectar ferramentas pode exigir configurações adicionais.",
  ],
  [
    "O Claude e as ferramentas estão incluídos?",
    "Não. Você utiliza sua própria conta do Claude. Assinaturas, limites, integrações e eventuais custos de ferramentas externas são separados.",
  ],
  [
    "Ele cria os vídeos sozinho?",
    "O prompt ajuda a organizar ganchos, roteiros, direção visual e o fluxo de produção. Geração, edição e exportação dependem das ferramentas e integrações disponíveis na sua conta. Assista às demonstrações para entender o processo.",
  ],
  [
    "Por que apenas 50 acessos?",
    "Este lote foi definido para 50 acessos ao prompt. O número é o limite do lote, não um contador de vagas restantes ou de vendas em tempo real.",
  ],
  [
    "Isso garante que vou vender?",
    "Não. O prompt organiza a pesquisa e a produção. Seu resultado depende da oferta, da execução, da divulgação, dos testes e das decisões que você tomar.",
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
    <div className="office-page">
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
        <section id="inicio" className="hero wrap story">
          <span className="eyebrow">
            <span className="status-dot" /> UM PROMPT PARA USAR NO CLAUDE
          </span>
          <h1>
            Pare de travar na ideia.
            <br />
            <span className="word-entry">
              Coloque a IA
              <br className="mobile-break" /> para trabalhar
              <br className="desktop-break" /> com você.
            </span>
          </h1>
          <p className="hero-lead">
            Uma oferta na cabeça. Mil tarefas pela frente.
            <br />
            <strong>Você não precisa começar todas do zero.</strong>
          </p>
          <p>
            Organize seu escritório de agentes de IA para pesquisar ofertas, escrever a copy,
            estruturar páginas e planejar criativos.
          </p>
          <figure className="hero-art">
            <img
              src="/images/escritorio-ia.webp"
              width="1200"
              height="800"
              fetchPriority="high"
              alt="Ilustração 3D de cinco áreas de um escritório de IA conectadas: pesquisa, textos, páginas, vídeos e entregáveis"
            />
            <figcaption>
              <span className="status-dot" /> Você dá a direção. Cada função tem seu lugar.
            </figcaption>
          </figure>
          <div className="numbers" aria-label="O que compõe a oferta">
            <div>
              <CountUp value={1} />
              <span>prompt completo</span>
            </div>
            <div>
              <CountUp value={5} />
              <span>funções de agentes</span>
            </div>
            <div>
              <CountUp value={50} />
              <span>acessos neste lote</span>
            </div>
          </div>
        </section>
        <section className="pain-band">
          <div className="wrap story reveal">
            <span className="eyebrow">O PROBLEMA NÃO É FALTA DE IDEIA</span>
            <h2>
              Você pesquisa.
              <br />
              Salva. Abre outra aba.
              <br />
              <em>E nada vai para a rua.</em>
            </h2>
            <p>
              Quem quer começar uma renda extra com infoprodutos conhece esse ciclo. A oferta não
              está definida. A copy fica pela metade. O criativo fica para amanhã.
            </p>
            <p className="strong-line">Está faltando uma sequência para executar.</p>
            <div className="workflow" aria-label="Da ideia à execução">
              {[
                [Search, "Pesquisar"],
                [PenTool, "Escrever"],
                [LayoutTemplate, "Estruturar"],
                [Clapperboard, "Criar"],
                [PackageCheck, "Organizar"],
              ].map(([Icon, label], i) => {
                const I = Icon as typeof Search;
                return (
                  <div key={String(label)} style={{ "--step": i } as React.CSSProperties}>
                    <span>0{i + 1}</span>
                    <I size={24} />
                    <strong>{String(label)}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="wrap story agents-section">
          <div className="reveal">
            <span className="eyebrow">MENOS CONVERSAS SOLTAS. MAIS DIREÇÃO.</span>
            <h2>
              Um escritório com
              <br />
              <span>
                cinco funções.
                <br />
                Você no comando.
              </span>
            </h2>
            <p>
              Em vez de abrir uma conversa sem saber o que pedir, comece com funções definidas.
              Toque em cada agente e veja onde ele entra na sua operação.
            </p>
          </div>
          <div className="reveal">
            <AgentDesk />
          </div>
          <p className="section-caption">
            Representação das funções. O prompt é usado dentro da sua conta do Claude.
          </p>
        </section>
        <section id="demonstracao" className="vsl-section">
          <div className="wrap story reveal">
            <span className="eyebrow">AGORA, VEJA NA PRÁTICA</span>
            <h2>
              Chega de imaginar.
              <br />
              <span>
                Veja o escritório
                <br />
                funcionando.
              </span>
            </h2>
            <p>
              Em pouco mais de um minuto, entenda como as etapas se conectam. Da pesquisa ao que
              você precisa produzir para tirar a oferta do papel.
            </p>
            <VideoDemo {...officeOffer.videos.presentation} variant="hero" />
            <p className="section-caption">Toque para assistir com som, em uma tela dedicada.</p>
          </div>
        </section>
        <section className="wrap story mining-section">
          <div className="reveal">
            <span className="eyebrow">SUA OPERAÇÃO COMEÇA PELA OFERTA</span>
            <h2>
              Não sabe o que vender?
              <br />
              <span>
                Comece pela pesquisa.
                <br />
                Não pelo chute.
              </span>
            </h2>
            <p>
              Veja o agente organizar referências e oportunidades. Você compara os sinais, analisa
              os ângulos e escolhe uma hipótese para testar.
            </p>
            <VideoDemo {...officeOffer.videos.mining} variant="mining" />
            <p className="section-caption">
              Anúncios ativos indicam atividade no mercado. Não comprovam faturamento.
            </p>
          </div>
          <OfferLink local="apos-demonstracoes">Ver o prompt completo</OfferLink>
        </section>
        <section className="how-section">
          <div className="wrap story">
            <div className="reveal">
              <span className="eyebrow">UM COMEÇO MAIS SIMPLES</span>
              <h2>
                Copie. Cole.
                <br />
                <span>Comece a orientar.</span>
              </h2>
              <p>
                Você não precisa montar todas as instruções do zero. Começa com a estrutura e dá o
                contexto do seu negócio.
              </p>
            </div>
            <div className="how-steps reveal">
              <article>
                <span className="step-number">01</span>
                <Copy size={25} />
                <div>
                  <h3>Copie o prompt</h3>
                  <p>Sua instrução para organizar as cinco funções.</p>
                </div>
              </article>
              <article>
                <span className="step-number">02</span>
                <Command size={25} />
                <div>
                  <h3>Cole no Claude</h3>
                  <p>Use sua conta e siga a sequência do prompt.</p>
                </div>
              </article>
              <article>
                <span className="step-number">03</span>
                <ArrowUpRight size={25} />
                <div>
                  <h3>Dê a direção</h3>
                  <p>Explique seu objetivo. Peça, revise e avance.</p>
                </div>
              </article>
            </div>
            <div className="ai-note reveal">
              <Sparkles size={26} />
              <p>
                <strong>Esta página também foi construída com apoio de IA.</strong> Design, código e
                estrutura, com direção e revisão humana. Um exemplo do potencial da tecnologia, não
                uma promessa de resultado automático do prompt.
              </p>
            </div>
          </div>
        </section>
        <section id="oferta" className="offer-section wrap story">
          <div className="reveal">
            <span className="eyebrow">LOTE LIMITADO A 50 ACESSOS</span>
            <h2>
              Sua próxima oferta
              <br />
              <span>
                não precisa ficar
                <br />
                só na sua cabeça.
              </span>
            </h2>
            <p>
              Tenha um ponto de partida para conectar pesquisa, criação e organização. O prompt
              completo, em um único acesso.
            </p>
          </div>
          <div className="offer-package reveal">
            <img
              src="/images/prompt-escritorio.webp"
              alt="Representação do pacote digital Escritório IA"
              width="1000"
              height="667"
              loading="lazy"
              decoding="async"
            />
            <article className="offer-card">
              <div className="offer-label">
                <Layers3 size={20} /> ESCRITÓRIO IA <span>50 ACESSOS NO LOTE</span>
              </div>
              <h3>
                O prompt do seu
                <br />
                escritório de agentes.
              </h3>
              <ul className="offer-list">
                {[
                  "Prompt completo para colar no Claude",
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
                <span>O seu ponto de partida por</span>
                <strong>{formatPrice(officeOffer.price)}</strong>
                <span>Pagamento único pelo prompt.</span>
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
                <strong>Serão apenas 50 acessos neste lote.</strong> Não é uma oferta aberta sem
                limite.
              </p>
              <p className="offer-disclosure">
                O produto é o prompt. Sua conta do Claude, assinaturas e ferramentas externas são
                separadas. A execução e a revisão continuam com você.
              </p>
            </article>
          </div>
        </section>
        <section className="faq-section wrap story reveal">
          <span className="eyebrow">ANTES DE COMEÇAR</span>
          <h2>
            O próximo passo,
            <br />
            <span>sem dúvidas.</span>
          </h2>
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
