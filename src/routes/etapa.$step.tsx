import { createFileRoute, notFound } from "@tanstack/react-router";
import { OfficeFunnel } from "@/components/office/OfficeFunnel";
const steps: Record<string, number> = { beneficios: 1, mineracao: 2, oferta: 3 };
export const Route = createFileRoute("/etapa/$step")({
  beforeLoad: ({ params }) => {
    if (!Object.hasOwn(steps, params.step)) throw notFound();
  },
  component: FunnelStep,
});
function FunnelStep() {
  const { step } = Route.useParams();
  return <OfficeFunnel key={step} step={steps[step]} />;
}
