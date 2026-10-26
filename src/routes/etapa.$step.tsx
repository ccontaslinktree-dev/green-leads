import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/etapa/$step")({
  beforeLoad: ({ location }) => {
    throw redirect({ to: "/", search: location.search });
  },
});
