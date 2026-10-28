import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clapperboard,
  LayoutTemplate,
  Search,
  Pause,
  Play,
  X,
  Maximize2,
} from "lucide-react";

const proofs = [
  {
    n: 10,
    title: "Vendas em real e dólar",
    detail: "Registros da operação",
    width: 599,
    height: 1034,
  },
  {
    n: 1,
    title: "Vendas e comissões em dólar",
    detail: "Notificações Hotmart",
    width: 568,
    height: 1600,
  },
  {
    n: 9,
    title: "Notificações de vendas em dólar",
    detail: "Registros em diferentes plataformas",
    width: 770,
    height: 732,
  },
  { n: 2, title: "Recebimentos em dólar", detail: "Notificações Hotmart", width: 798, height: 799 },
  { n: 3, title: "Vendas e comissões", detail: "Notificações Hotmart", width: 524, height: 1600 },
  {
    n: 4,
    title: "Registros de vendas em dólar",
    detail: "Notificações Hotmart",
    width: 666,
    height: 1600,
  },
  {
    n: 5,
    title: "Recebimentos em dólar",
    detail: "Notificações da operação",
    width: 358,
    height: 1280,
  },
  { n: 6, title: "Comissões em dólar", detail: "Notificações Hotmart", width: 778, height: 1149 },
  {
    n: 7,
    title: "Movimentações em reais",
    detail: "Pagamentos aprovados e pendentes",
    width: 462,
    height: 1600,
  },
  {
    n: 8,
    title: "Mais registros em dólar",
    detail: "Notificações Hotmart",
    width: 532,
    height: 1600,
  },
];
const source = (n: number) => `/images/resultados/resultado-${String(n).padStart(2, "0")}.webp`;

export function VslProof({ onWatch }: { onWatch: () => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let position = el.scrollLeft;
    let visible = true;
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    observer.observe(el);
    function tick(time: number) {
      if (previous && visible && !document.hidden && !paused && !hovered && !media.matches && el) {
        position += Math.min(time - previous, 50) * 0.04;
        const half = el.scrollWidth / 2;
        if (position >= half) position -= half;
        el.scrollLeft = position;
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [paused, hovered]);

  const open = (index: number) => {
    setPaused(true);
    setSelected(index);
    lastFocus.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
  };
  const close = () => {
    if (dialog.current?.open) dialog.current.close();
    lastFocus.current?.focus({ preventScroll: true });
  };
  const move = (direction: number) => {
    setPaused(true);
    scroller.current?.scrollBy({
      left: direction * 285,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };

  return (
    <>
      <section className="vsl-pains" aria-labelledby="pains-title">
        <p className="vsl-eyebrow">SUA OPERAÇÃO NÃO PRECISA CONSUMIR TODAS AS SUAS HORAS</p>
        <h2 id="pains-title">
          Você quer vender. <span>Mas está preso fazendo tudo sozinho?</span>
        </h2>
        <div className="vsl-pain-grid">
          <article>
            <Clapperboard aria-hidden="true" size={25} />
            <h3>Cansado de perder horas criando anúncios?</h3>
            <p>Você muda o gancho, refaz o roteiro e continua sem clareza sobre o que testar.</p>
          </article>
          <article>
            <Search aria-hidden="true" size={25} />
            <h3>Cansado de passar noites procurando ofertas?</h3>
            <p>Dezenas de abas abertas, muitas referências e a dúvida sobre qual caminho seguir.</p>
          </article>
          <article>
            <LayoutTemplate aria-hidden="true" size={25} />
            <h3>Não sabe criar uma página pensada para converter?</h3>
            <p>
              A oferta fica parada enquanto você tenta organizar a copy, as seções e os argumentos.
            </p>
          </article>
        </div>
        <div className="vsl-structure">
          <h3>
            Da pesquisa ao criativo: <span>uma estrutura para suas ofertas em real ou dólar.</span>
          </h3>
          <p>
            Organize pesquisa, copy, páginas, criativos e entregáveis com o guia e o prompt do
            Escritório IA. Tenha mais direção para construir sua oferta, planejar seus testes e
            decidir onde faz sentido investir seu orçamento.
          </p>
          <button onClick={onWatch}>
            QUERO VER COMO FUNCIONA <Play size={16} aria-hidden="true" />
          </button>
        </div>
      </section>
      <section className="vsl-proof" aria-labelledby="proof-title">
        <p className="vsl-eyebrow">REGISTROS DA MINHA OPERAÇÃO</p>
        <h2 id="proof-title">
          Vendas em dólar e em real. <span>Veja os registros.</span>
        </h2>
        <p className="vsl-proof-lead">
          Resultados que obtive na minha operação com apoio dessas ferramentas. Arraste para
          explorar ou toque em um print para ampliar.
        </p>
        <div className="vsl-proof-controls">
          <span>10 prints da operação</span>
          <div>
            <button onClick={() => move(-1)} aria-label="Ver resultados anteriores">
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => setPaused(!paused)}
              aria-label={
                paused ? "Retomar movimento dos resultados" : "Pausar movimento dos resultados"
              }
              aria-pressed={paused}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button onClick={() => move(1)} aria-label="Ver próximos resultados">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div
          className="vsl-proof-scroll"
          ref={scroller}
          role="region"
          aria-label="Carrossel de resultados pessoais"
          tabIndex={0}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onPointerDown={() => setPaused(true)}
          onWheel={() => setPaused(true)}
          onFocus={() => setPaused(true)}
        >
          <div className="vsl-proof-track">
            {[0, 1].map((copy) => (
              <div className="vsl-proof-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {proofs.map((proof, index) => (
                  <figure className="vsl-proof-card" key={proof.n}>
                    <button
                      className="vsl-proof-image"
                      onClick={() => open(index)}
                      tabIndex={copy === 1 ? -1 : 0}
                      aria-label={`Ampliar print: ${proof.title}, registro ${index + 1}`}
                    >
                      <img
                        src={source(proof.n)}
                        width={proof.width}
                        height={proof.height}
                        loading="lazy"
                        decoding="async"
                        alt={`Registro pessoal: ${proof.title}. ${proof.detail}.`}
                      />
                      <span>
                        <Maximize2 size={14} /> Ampliar
                      </span>
                    </button>
                    <figcaption>
                      <strong>{proof.title}</strong>
                      <span>{proof.detail}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="vsl-proof-note">
          Resultados pessoais do produtor. As notificações mostram vendas e comissões, não lucro
          líquido. Seus resultados dependem da oferta, da execução e dos testes.
        </p>
        <dialog
          className="vsl-proof-dialog"
          ref={dialog}
          aria-label="Print de resultado ampliado"
          onCancel={close}
          onClose={() => lastFocus.current?.focus({ preventScroll: true })}
        >
          <button className="vsl-proof-close" onClick={close} aria-label="Fechar print ampliado">
            <X size={24} />
          </button>
          <img
            src={source(proofs[selected].n)}
            alt={`${proofs[selected].title}. ${proofs[selected].detail}.`}
            width={proofs[selected].width}
            height={proofs[selected].height}
          />
          <p>
            {proofs[selected].title} · {proofs[selected].detail}
          </p>
        </dialog>
      </section>
    </>
  );
}
