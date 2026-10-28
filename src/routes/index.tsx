import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { officeOffer, formatPrice, getCheckoutUrl } from "@/data/office-offer";
import { initializeTracking, trackEvent } from "@/lib/office-tracking";
import vslUrl from "../../WhatsApp Video 2026-10-27 at 19.19.43.mp4?url";
import { InlineVsl } from "@/components/office/InlineVsl";
import { VslProof } from "@/components/office/VslProof";
import "@/components/office/vsl.css";

export const Route = createFileRoute("/")({ component: VslPage });
function VslPage() {
  const presentation = useRef<HTMLElement>(null);
  const offer = useRef<HTMLElement>(null);
  const offerViewed = useRef(false);
  useEffect(() => {
    initializeTracking();
    const el = offer.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (offerViewed.current || !entries.some((entry) => entry.isIntersecting)) return;
        offerViewed.current = true;
        trackEvent("ViewContent", {
          content_name: officeOffer.name,
          value: officeOffer.price,
          currency: "BRL",
        });
        observer.disconnect();
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const showPresentation = () =>
    presentation.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  return (
    <div className="vsl-page">
      <header className="vsl-brand" aria-label="Escritório IA">
        <Layers3 size={22} aria-hidden="true" />
        <span>
          escritório<strong>IA</strong>
        </span>
        <span className="vsl-header-tag">UM PROMPT. CINCO FUNÇÕES.</span>
      </header>
      <main className="vsl-main">
        <div className="vsl-intro">
          <p className="vsl-eyebrow">PARA INFOPRODUTORES E GESTORES DE TRÁFEGO</p>
          <h1>
            Pare de carregar sua operação nas costas.{" "}
            <em>Monte seu escritório de IA com um único prompt.</em>
          </h1>
          <p className="vsl-lead">
            Imagine transformar suas ideias em uma oferta estruturada, com apoio para pesquisar,
            escrever a copy, planejar a página e criar seus anúncios. Veja como começar no Claude ou
            ChatGPT — e ter mais tempo para estratégia, testes e decisões.
          </p>
        </div>
        <section
          ref={presentation}
          id="apresentacao"
          className="vsl-watch"
          aria-label="Vídeo de apresentação do Escritório IA"
        >
          <p className="vsl-scarcity">CONDIÇÃO DE LANÇAMENTO · LOTE DE 50 ACESSOS</p>
          <InlineVsl
            src={vslUrl}
            title="Conheça o Escritório IA"
            duration="2min32s"
            trackingName="vsl_original"
          />
          <p className="vsl-retention">
            <strong>Veja a estrutura por dentro.</strong> Dê o play e continue explorando a página
            no seu ritmo.
          </p>
        </section>
        <VslProof onWatch={showPresentation} />
        <section className="vsl-ai-proof" aria-labelledby="ai-proof-title">
          <span className="vsl-eyebrow">
            <Sparkles size={16} aria-hidden="true" /> VOCÊ ESTÁ VENDO A IA EM AÇÃO
          </span>
          <h2 id="ai-proof-title">Esta estrutura foi criada com inteligência artificial.</h2>
          <p className="vsl-ai-question">Ainda tem dúvida de que funciona?</p>
          <p>
            A página, a copy e os criativos que você viu foram construídos com apoio de IA e revisão
            humana. Agora imagine usar esse processo para organizar sua próxima oferta, em vez de
            passar noites tentando montar tudo sozinho.
          </p>
          <p>
            <strong>O próximo passo é seu:</strong> tenha o guia e o prompt para começar a
            estruturar seu próprio Escritório IA.
          </p>
        </section>
        <section ref={offer} id="oferta" className="vsl-offer" aria-labelledby="vsl-offer-title">
          <span className="vsl-eyebrow">DA IDEIA À ESTRUTURA. COMECE A SUA.</span>
          <h2 id="vsl-offer-title">
            Sua próxima oferta pode começar com uma estrutura pronta para orientar a execução.
          </h2>
          <p>
            Receba o guia com o prompt completo e as orientações para organizar cinco funções no
            ChatGPT ou Claude: pesquisa, copy, páginas, criativos e entregáveis.
          </p>
          <ul className="vsl-offer-benefits">
            <li>Um prompt completo para organizar cinco funções de IA.</li>
            <li>Guia para começar na sua própria conta do Claude ou ChatGPT.</li>
            <li>Mais clareza para sair da ideia e planejar sua próxima oferta.</li>
          </ul>
          <div className="vsl-offer-urgency">
            <strong>R$ 9,99 por tempo limitado. O preço vai aumentar em breve.</strong>
            <span>
              São apenas 50 acessos neste lote. Aproveite a condição de lançamento enquanto estiver
              disponível.
            </span>
          </div>
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
            QUERO MONTAR MEU ESCRITÓRIO IA <ArrowRight size={19} aria-hidden="true" />
          </a>
          <p className="vsl-purchase-note">
            Guia em PDF + prompt. Use com sua própria conta de IA.
          </p>
          <div className="vsl-extra-demo">
            <div>
              <span className="vsl-eyebrow">VEJA MAIS ANTES DE DECIDIR</span>
              <h3>Conheça a estrutura por dentro.</h3>
              <p>
                Assista também à apresentação complementar e veja a organização das funções na
                prática.
              </p>
            </div>
            <InlineVsl
              src={officeOffer.videos.presentation.src}
              title={officeOffer.videos.presentation.title}
              duration={officeOffer.videos.presentation.duration}
              trackingName="apresentacao_complementar"
            />
          </div>
        </section>
      </main>
      <footer className="vsl-footer">
        Escritório IA · Organização para a sua operação digital.
      </footer>
    </div>
  );
}
