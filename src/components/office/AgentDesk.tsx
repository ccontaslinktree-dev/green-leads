import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
  Search,
  PenTool,
  LayoutTemplate,
  Clapperboard,
  PackageCheck,
  ArrowRight,
  Check,
  Command,
  Sparkles,
} from "lucide-react";
const agents = [
  {
    name: "Otto",
    role: "Mineração",
    icon: Search,
    title: "Comece com sinais de mercado.",
    description:
      "Organize referências, compare abordagens e transforme a pesquisa em hipóteses de oferta para analisar e testar.",
    outputs: [
      "Pesquisa de nichos e referências",
      "Organização dos sinais encontrados",
      "Hipóteses de oferta e próximos testes",
    ],
    next: "Do mercado para a sua ideia de oferta",
    color: "mint",
  },
  {
    name: "Davi",
    role: "Copy",
    icon: PenTool,
    title: "Dê uma mensagem clara à sua oferta.",
    description:
      "Transforme o que você quer vender em argumentos, headlines e textos alinhados ao público que deseja alcançar.",
    outputs: [
      "Headlines e ângulos de comunicação",
      "Argumentos e respostas a objeções",
      "Textos para páginas e anúncios",
    ],
    next: "Da ideia para uma mensagem de venda",
    color: "rose",
  },
  {
    name: "Nina",
    role: "Páginas",
    icon: LayoutTemplate,
    title: "Tire a página de vendas do rascunho.",
    description:
      "Organize as seções, a apresentação da entrega e o caminho até a oferta. Revise a estrutura e avance com uma direção definida.",
    outputs: [
      "Estrutura da página de vendas",
      "Hierarquia da oferta e dos benefícios",
      "Orientações para construir e publicar",
    ],
    next: "Da mensagem para a sua estrutura",
    color: "amber",
  },
  {
    name: "Bia",
    role: "Criativos",
    icon: Clapperboard,
    title: "Chegue ao criativo com uma direção.",
    description:
      "Desenvolva ganchos, roteiros e uma proposta visual para os anúncios. A execução depende dos recursos e ferramentas que você conectar.",
    outputs: [
      "Ganchos e variações de roteiro",
      "Direção visual para os anúncios",
      "Apoio à produção com ferramentas de IA",
    ],
    next: "Da oferta para ideias de criativos",
    color: "blue",
  },
  {
    name: "Ema",
    role: "Entregáveis",
    icon: PackageCheck,
    title: "Organize o que o cliente vai receber.",
    description:
      "Defina a estrutura do material, os módulos e o próximo passo de produção. Você revisa e confirma o que realmente será entregue.",
    outputs: [
      "Estrutura do produto digital",
      "Organização de módulos e materiais",
      "Checklist da entrega para revisão",
    ],
    next: "Da promessa para uma entrega organizada",
    color: "violet",
  },
];
export function AgentDesk() {
  const [active, setActive] = useState(0);
  const stage = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const agent = agents[active];
  const Icon = agent.icon;
  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % agents.length;
    else if (event.key === "ArrowLeft") next = (index + agents.length - 1) % agents.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = agents.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (
      !stage.current ||
      !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches
    )
      return;
    const b = event.currentTarget.getBoundingClientRect();
    stage.current.style.setProperty(
      "--rx",
      `${((event.clientY - b.top) / b.height - 0.5) * -3}deg`,
    );
    stage.current.style.setProperty("--ry", `${((event.clientX - b.left) / b.width - 0.5) * 3}deg`);
  }
  return (
    <div
      className="agent-desk"
      ref={stage}
      onPointerMove={tilt}
      onPointerLeave={() => {
        stage.current?.style.setProperty("--rx", "0deg");
        stage.current?.style.setProperty("--ry", "0deg");
      }}
    >
      <div className="agent-desk__toolbar">
        <span className="window-dots">
          <i />
          <i />
          <i />
        </span>
        <span>
          <Command size={15} /> escritório / funções
        </span>
        <span className="agent-desk__demo">Visão ilustrativa</span>
      </div>
      <div className="agent-desk__tabs" role="tablist" aria-label="Conheça as funções dos agentes">
        {agents.map((a, i) => {
          const I = a.icon;
          return (
            <button
              key={a.name}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`agent-tab-${i}`}
              aria-controls={`agent-panel-${i}`}
              aria-selected={active === i}
              tabIndex={active === i ? 0 : -1}
              onKeyDown={(e) => keyboard(e, i)}
              onClick={() => setActive(i)}
              className={`agent-tab ${active === i ? "is-active" : ""}`}
            >
              <span className={`agent-icon agent-icon--${a.color}`}>
                <I size={20} />
              </span>
              <span>
                <strong>{a.name}</strong>
                <small>{a.role}</small>
              </span>
            </button>
          );
        })}
      </div>
      <div
        key={active}
        role="tabpanel"
        tabIndex={0}
        id={`agent-panel-${active}`}
        aria-labelledby={`agent-tab-${active}`}
        className="agent-panel"
      >
        <div className="agent-panel__copy">
          <span className={`agent-icon agent-icon--large agent-icon--${agent.color}`}>
            <Icon size={28} />
          </span>
          <p className="eyebrow">SUA ÁREA DE {agent.role.toUpperCase()}</p>
          <h3>{agent.title}</h3>
          <p>{agent.description}</p>
          <span className="agent-panel__next">
            <Sparkles size={18} /> {agent.next}
          </span>
        </div>
        <div className="agent-panel__output">
          <div className="output-heading">
            <span>O que você pode construir</span>
            <span>0{active + 1}</span>
          </div>
          {agent.outputs.map((o, i) => (
            <div key={o} className="output-card" style={{ animationDelay: `${i * 75}ms` }}>
              <span>
                <Check size={18} />
              </span>
              <strong>{o}</strong>
              <ArrowRight size={18} />
            </div>
          ))}
          <p>Você orienta. A IA apoia a execução. Você revisa.</p>
        </div>
      </div>
    </div>
  );
}
