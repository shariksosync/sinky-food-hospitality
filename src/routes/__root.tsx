import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SinkyApp } from "../sinky/SinkyApp";

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 text-ink">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl font-bold text-forest">
          This page encountered an issue
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Something went wrong while rendering. Please try refreshing or return to the homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full bg-forest px-5 py-2.5 text-xs font-semibold text-cream hover:bg-forest-deep transition"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-full border border-line bg-card px-5 py-2.5 text-xs font-semibold text-ink hover:bg-sage transition"
          >
            Go to Homepage
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
      { title: "Sinky Industries — Premium Food & Beverage Solutions" },
      {
        name: "description",
        content:
          "Sinky Industries Private Limited — Manufacturing, processing, and supply of premium food products, packaged beverages, and customized culinary solutions for residential and commercial hospitality.",
      },
      { name: "author", content: "Sinky Industries Private Limited" },
      { property: "og:title", content: "Sinky Industries — Premium Food & Beverage Solutions" },
      {
        property: "og:description",
        content:
          "Premium food products, packaged beverages, and customized culinary solutions for residential and commercial hospitality projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: SinkyApp,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
