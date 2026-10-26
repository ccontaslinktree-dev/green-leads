import { createFileRoute } from "@tanstack/react-router";
import { OfficeFunnel } from "@/components/office/OfficeFunnel";
export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    ...search,
    fase: [1, 2, 3, 4].includes(Number(search.fase)) ? Number(search.fase) : 1,
  }),
  component: QuizPresentation,
});
function QuizPresentation() {
  const { fase } = Route.useSearch();
  return <OfficeFunnel step={fase - 1} />;
}
