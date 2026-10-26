import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  ArrowRight,
  Check,
  Copy,
  Layers3,
  Sparkles,
  Search,
  PenTool,
  Clapperboard,
  LayoutTemplate,
  Command,
  CircleCheck,
  Plus,
  Laptop,
  PackageCheck,
} from "lucide-react";
import { AgentDesk } from "@/components/office/AgentDesk";
import { VideoDemo } from "@/components/office/VideoDemo";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";

export const Route = createFileRoute("/")({ component: Index });

const questions = [
  [
    "O que eu recebo por R$ 9,99?",
    "Você recebe um e-book em PDF com o prompt completo do Escritório IA e instruções para usar no ChatGPT ou no Claude e estruturar as funções de pesquisa de ofertas, copy, páginas, criativos e entregáveis. O produto é o e-book com o prompt, não uma licença de uma plataforma pronta.",
  ],
  [
    "Preciso ser infoprodutor ou saber programar?",
    "Você pode estar começando ou já ter uma operação. Para iniciar a conversa com os agentes, não precisa escrever código: precisa seguir o prompt, explicar seu objetivo e revisar as respostas. Algumas etapas de execução podem exigir configuração de ferramentas.",
  ],
  [
    "As contas de IA e outras ferramentas estão incluídas?",
    "Não. Você utiliza sua própria conta do ChatGPT ou Claude. Planos, limites de uso, assinaturas e eventuais ferramentas externas são separados e dependem dos recursos que você escolher usar.",
  ],
  [
    "O agente entrega vídeos prontos automaticamente?",
    "Ele pode ajudar nos ganchos, roteiros, direção visual e fluxo de produção. A geração e a exportação de vídeos dependem das ferramentas e integrações que você disponibilizar. Confira a demonstração para entender o fluxo mostrado.",
  ],
  [
    "Isso garante renda extra ou vendas?",
    "Não existe garantia de faturamento. O prompt ajuda a organizar a pesquisa e a produção. As vendas dependem da oferta, da qualidade da execução, da divulgação, dos testes e das decisões que você tomar.",
  ],
];

function OfferLink({
  children,
  className = "",
  arrow = "right",
}: {
  children: ReactNode;
  className?: string;
  arrow?: "right" | "down";
}) {
  return (
    <a
      href="#oferta"
      className={`cta ${className}`}
      onClick={() => trackEvent("ClickParaOferta", { local: String(children) })}
    >
      {children}
      {arrow === "down" ? <ArrowDown size={20} /> : <ArrowUpRight size={21} />}
    </a>
  );
}

function Index() {
  const main = useRef<HTMLElement>(null);
  const [checkout, setCheckout] = useState<string | null>(null);
  useEffect(() => {
    initializeTracking();
    setCheckout(getCheckoutUrl());
    if (!window.IntersectionObserver) return;
    const offer = document.getElementById("oferta");
    const offerObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          trackEvent("ViewContent", {
            content_name: officeOffer.name,
            value: officeOffer.price,
            currency: "BRL",
          });
          offerObserver.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (offer) offerObserver.observe(offer);

    if (!main.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return () => offerObserver.disconnect();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    main.current.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
      el.classList.add("will-reveal");
      observer.observe(el);
    });
    return () => {
      observer.disconnect();
      offerObserver.disconnect();
    };
  }, []);
  return (
    <div className="office-page">
      <header className="site-header wrap">
        <a href="#inicio" aria-label="Escritório IA, início" className="brand">
          <span className="brand-symbol">
            <Layers3 size={23} />
          </span>
          <span>
            escritório<span className="brand-ia">IA</span>
          </span>
        </a>
        <span className="header-note">
          <span /> UM PROMPT. UMA NOVA FORMA DE EXECUTAR.
        </span>
        <span className="header-price">
          Seu ponto de partida <strong>{formatPrice(officeOffer.price)}</strong>
        </span>
      </header>
      <main ref={main}>
        <section id="inicio" className="hero wrap">
          <div className="hero__copy">
            <div className="kicker">
              <span className="tiny-orbit" /> SUA OPERAÇÃO DE INFOPRODUTOS COMEÇA AQUI
            </div>
            <h1>
              Pare de fazer tudo sozinho.
              <br />
              <span>Monte seu escritório de agentes de IA.</span>
            </h1>
            <p className="hero__lead">
              Quer uma renda extra com infoprodutos, mas trava na hora de escolher a oferta,
              escrever a copy ou criar a página?
            </p>
            <p className="hero__body">
              Cole um prompt no <strong>ChatGPT ou Claude</strong> e estruture agentes para
              organizar a mineração, a copy, as páginas e os criativos. Você ganha uma direção para
              sair da ideia e começar a executar.
            </p>
            <div className="hero__capabilities">
              <span>
                <Search size={17} /> Ofertas
              </span>
              <span>
                <PenTool size={17} /> Copy
              </span>
              <span>
                <LayoutTemplate size={17} /> Páginas
              </span>
              <span>
                <Clapperboard size={17} /> Criativos
              </span>
            </div>
            <div className="hero__action">
              <OfferLink arrow="down">Quero conhecer o acesso</OfferLink>
              <span>
                O prompt completo por <strong>{formatPrice(officeOffer.price)}</strong>.<br />
                Contas de IA e ferramentas são separadas.
              </span>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <span className="float-label float-label--top">
              <Sparkles size={18} /> Da ideia à execução
            </span>
            <VideoDemo {...officeOffer.videos.presentation} />
            <span className="float-label float-label--bottom">
              <CircleCheck size={18} /> Veja o fluxo real no vídeo
            </span>
          </div>
        </section>
        <section
          className="pain-strip wrap reveal"
          aria-label="Os gargalos que você pode organizar"
        >
          <div>
            <span className="section-index">01 / O QUE ESTÁ TE TRAVANDO</span>
            <h2>
              A ideia existe.
              <br />A execução fica para depois.
            </h2>
          </div>
          <div className="pain-item">
            <span>01</span>
            <p>
              Você abre várias abas.
              <br />
              <strong>E continua sem escolher uma oferta.</strong>
            </p>
          </div>
          <div className="pain-item">
            <span>02</span>
            <p>
              A pesquisa vira um rascunho.
              <br />
              <strong>A página e o criativo não saem.</strong>
            </p>
          </div>
          <div className="pain-item">
            <span>03</span>
            <p>
              Tudo depende de você.
              <br />
              <strong>Cada etapa começa do zero.</strong>
            </p>
          </div>
        </section>
        <section id="mineracao" className="mining-section">
          <div className="wrap mining-grid">
            <div className="mining-copy reveal">
              <div className="kicker kicker--dark">
                <span className="tiny-orbit" /> COMECE PELA OFERTA
              </div>
              <h2>
                Tá difícil minerar uma oferta com sinais reais de demanda?
                <br />
                <em>Veja este vídeo.</em>
              </h2>
              <p>
                Antes da página bonita, vem a decisão que sustenta a operação:{" "}
                <strong>o que vender, para quem e com qual abordagem.</strong>
              </p>
              <p>
                Veja como o agente organiza referências e oportunidades de mercado para você
                analisar. Uma pesquisa com direção, em vez de mais uma lista de ideias esquecidas.
              </p>
              <ol className="mining-steps">
                <li>
                  <span>1</span>
                  <div>
                    <strong>Encontre referências</strong>
                    <p>Comece por sinais de mercado e ofertas em circulação.</p>
                  </div>
                </li>
                <li>
                  <span>2</span>
                  <div>
                    <strong>Organize as oportunidades</strong>
                    <p>Compare as propostas e entenda os possíveis ângulos.</p>
                  </div>
                </li>
                <li>
                  <span>3</span>
                  <div>
                    <strong>Escolha o que vale testar</strong>
                    <p>Avance com uma hipótese e próximos passos claros.</p>
                  </div>
                </li>
              </ol>
              <p className="evidence-note">
                Anúncios ativos são sinais de mercado, não comprovantes de faturamento. A decisão e
                a validação continuam com você.
              </p>
            </div>
            <div className="mining-video reveal">
              <VideoDemo {...officeOffer.videos.mining} variant="mining" />
            </div>
          </div>
        </section>
        <section id="agentes" className="agents-section wrap">
          <div className="section-top reveal">
            <div>
              <span className="section-index">02 / CADA AGENTE TEM UMA FUNÇÃO</span>
              <h2>
                Uma equipe organizada.
                <br />
                <span>Você no comando.</span>
              </h2>
            </div>
            <p>
              Do primeiro sinal de mercado à estrutura da sua oferta. Conheça as funções e visualize
              o que pode construir com cada agente.
            </p>
          </div>
          <div className="office-art reveal">
            <img
              src="/images/escritorio-ia.webp"
              alt="Ilustração 3D de um escritório com áreas de pesquisa, copy, páginas, vídeo e entregáveis"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <div className="office-art__tag">
              <Command size={16} />
              <span>Sua direção conecta as etapas.</span>
            </div>
          </div>
          <div className="reveal">
            <AgentDesk />
          </div>
          <div className="agents-bottom reveal">
            <p>
              Chega de abrir uma conversa nova sem saber o que pedir.
              <br />
              <strong>Comece com funções e objetivos definidos.</strong>
            </p>
            <OfferLink>Ver o que vem no acesso</OfferLink>
          </div>
        </section>
        <section className="how-section">
          <div className="wrap">
            <div className="section-top reveal">
              <div>
                <span className="section-index">03 / DA IDEIA AO PRIMEIRO PASSO</span>
                <h2>
                  Copie. Cole.
                  <br />
                  <span>Dê a direção.</span>
                </h2>
              </div>
              <p>
                O ponto de partida é um prompt. O que você faz com ele começa nas orientações que dá
                aos agentes.
              </p>
            </div>
            <div className="how-grid reveal">
              <article>
                <span className="how-number">01</span>
                <Copy size={30} />
                <h3>Copie o prompt</h3>
                <p>Tenha a instrução que estrutura as funções do seu escritório de IA.</p>
              </article>
              <article>
                <span className="how-number">02</span>
                <Command size={30} />
                <h3>Cole no ChatGPT ou Claude</h3>
                <p>Use sua conta e siga as orientações para iniciar a organização dos agentes.</p>
              </article>
              <article>
                <span className="how-number">03</span>
                <ArrowUpRight size={30} />
                <h3>Comece a orientar</h3>
                <p>
                  Explique o nicho, peça a pesquisa e avance na oferta, na copy e nos criativos.
                </p>
              </article>
            </div>
            <div className="ai-proof reveal">
              <div className="ai-proof__symbol">
                <Sparkles size={35} />
              </div>
              <div>
                <span className="section-index">VOCÊ JÁ ESTÁ VENDO UMA PARTE DO POTENCIAL</span>
                <h3>Sim, esta página foi criada com inteligência artificial.</h3>
                <p>
                  Design, código e estrutura desenvolvidos com apoio de IA. É uma demonstração do
                  que a tecnologia pode ajudar a construir quando existe uma direção clara e revisão
                  humana.
                </p>
              </div>
              <span className="ai-proof__tag">
                DO CONCEITO AO CÓDIGO <Check size={16} />
              </span>
            </div>
          </div>
        </section>
        <section id="oferta" className="offer-section wrap">
          <div className="offer-intro reveal">
            <span className="section-index">04 / SEU PONTO DE PARTIDA</span>
            <h2>
              Sua próxima oferta merece
              <br />
              <span>sair do papel.</span>
            </h2>
            <p>
              Organize o que hoje está espalhado em abas, ideias e tarefas. Comece pelo prompt do
              seu escritório de IA.
            </p>
          </div>
          <div className="offer-grid reveal">
            <div className="offer-art">
              <img
                src="/images/prompt-escritorio.webp"
                alt="Representação ilustrativa do prompt Escritório IA conectado a pesquisa, textos e criativos"
                width="1000"
                height="667"
                loading="lazy"
                decoding="async"
              />
              <div className="offer-art__caption">
                <PackageCheck size={23} />
                <div>
                  <strong>Escritório IA</strong>
                  <span>Um prompt para estruturar sua operação.</span>
                </div>
              </div>
            </div>
            <article className="offer-card">
              <div className="offer-card__label">
                <Sparkles size={17} /> E-BOOK + PROMPT COMPLETO
              </div>
              <h3>Escritório de Agentes de IA</h3>
              <p className="offer-description">
                <strong>Lote limitado a 50 acessos.</strong>
                <br />
                Sua estrutura para pesquisar, organizar e começar a criar.
              </p>
              <ul className="offer-list">
                {[
                  "E-book em PDF com o prompt completo",
                  "Guia de ferramentas e skills para ChatGPT ou Claude",
                  "Funções de mineração e pesquisa de ofertas",
                  "Apoio para copy e páginas de venda",
                  "Ganchos, roteiros e direção de criativos",
                  "Organização da estrutura dos entregáveis",
                ].map((item) => (
                  <li key={item}>
                    <Check size={19} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="offer-price">
                <span>Seu acesso ao prompt por</span>
                <strong>{formatPrice(officeOffer.price)}</strong>
                <small>Pagamento único pelo prompt. Sem mensalidade do produto.</small>
              </div>
              {checkout ? (
                <a
                  className="cta cta--purchase"
                  href={checkout}
                  onClick={(event) => {
                    event.preventDefault();
                    trackEvent("InitiateCheckout", {
                      content_name: officeOffer.name,
                      value: officeOffer.price,
                      currency: "BRL",
                    });
                    window.setTimeout(() => window.location.assign(checkout), 150);
                  }}
                >
                  Quero meu escritório de IA <ArrowUpRight size={23} />
                </a>
              ) : (
                <>
                  <button className="cta cta--purchase cta--soon" disabled>
                    Acesso em breve <ArrowRight size={21} />
                  </button>
                  <p className="offer-opening">
                    Você poderá garantir seu acesso aqui quando as vendas abrirem.
                  </p>
                </>
              )}
              <div className="offer-disclosure">
                <Laptop size={19} />
                <p>
                  Você usa sua própria conta do ChatGPT ou Claude. Assinaturas, integrações e
                  ferramentas externas não estão incluídas.
                </p>
              </div>
            </article>
          </div>
        </section>
        <section className="faq-section wrap reveal">
          <div>
            <span className="section-index">ANTES DE COMEÇAR</span>
            <h2>
              Sem dúvida
              <br />
              no próximo passo.
            </h2>
            <p>Entenda o que você está adquirindo e o que depende da sua execução.</p>
          </div>
          <div className="faq-list">
            {questions.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <Plus size={21} />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <footer className="site-footer wrap">
        <div className="brand">
          <span className="brand-symbol">
            <Layers3 size={21} />
          </span>
          <span>
            escritório<span className="brand-ia">IA</span>
          </span>
        </div>
        <p>Uma direção clara para a sua próxima operação.</p>
        <div>
          <span>© 2026 Escritório IA.</span>
          <small>
            Produto independente. Sem afiliação com OpenAI ou Anthropic. Resultados dependem da
            execução e não são garantidos.
          </small>
        </div>
      </footer>
    </div>
  );
}
