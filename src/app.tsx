import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import { isServer } from "solid-js/web";

import "~/assets/styles/index.css";
import { BreadcrumbPageProvider } from "~/context/breadcrumb-page-context";
import { TranslationProvider } from "~/context/translation-context";

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        enabled: !isServer,
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });

  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <QueryClientProvider client={queryClient}>
            <TranslationProvider>
              <BreadcrumbPageProvider>
                <Title>SolidStart Frontend Boilerplate</Title>
                <Suspense>{props.children}</Suspense>
              </BreadcrumbPageProvider>
            </TranslationProvider>
          </QueryClientProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
