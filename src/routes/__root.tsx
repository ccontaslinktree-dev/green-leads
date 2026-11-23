import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o cambió de dirección.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          No se pudo cargar la página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Intenta actualizar la página o volver al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Intentar de nuevo
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Manual del Pescador Práctico | Plataforma de Pesca" },
      { name: "description", content: "¿Buscas peces más grandes? Aprende a elegir carnadas, preparar nudos y comprender tu equipo. 500 enseñanzas de pesca organizadas para principiantes e intermedios." },
      { name: "author", content: "Manual del Pescador Práctico" },
      { property: "og:title", content: "¿Buscas peces más grandes? | Pescador Práctico" },
      { property: "og:description", content: "Carnada, nudo y técnica: aprende qué elegir y cómo hacerlo. Explora 500 enseñanzas de pesca organizadas por categorías." },
      { property: "og:image", content: "https://manual-pescador-practico.lovable.app/pescador/compartir-pesca.webp" },
      { property: "og:image:width", content: "1280" },
      { property: "og:image:height", content: "853" },
      { property: "og:image:alt", content: "Manual del Pescador Práctico: plataforma de pesca organizada por categorías" },
      { property: "og:url", content: "https://manual-pescador-practico.lovable.app/" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "es_419" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Manual del Pescador Práctico | 500 enseñanzas" },
      { name: "twitter:description", content: "Carnadas, nudos y técnicas para preparar mejor tu próxima pesca." },
      { name: "twitter:image", content: "https://manual-pescador-practico.lovable.app/pescador/compartir-pesca.webp" },
    ],
    links: [
      { rel: "canonical", href: "https://manual-pescador-practico.lovable.app/" },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      {
        rel: "preload",
        href: "/fonts/sora.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es-419">
      <head>
        <HeadContent />
        <script
          id="microsoft-clarity"
          type="text/javascript"
          dangerouslySetInnerHTML={{ __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","zhfuj3cqdk");` }}
        />
        <script
          src="https://cdn.utmify.com.br/scripts/utms/latest.js"
          data-utmify-prevent-subids=""
          async
          defer
        />
      </head>
      <body>
        {children}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1670040038036599&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
