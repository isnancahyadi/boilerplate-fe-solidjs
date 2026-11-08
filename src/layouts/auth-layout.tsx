import { Title } from "@solidjs/meta";
import { type JSX, splitProps } from "solid-js";

import { APP_CONFIG } from "~/config/app";

import { cn } from "~/lib/utils";

export interface AuthLayoutProps {
  children: JSX.Element;
  title?: string;
  class?: string;
}

export default function AuthLayout(props: AuthLayoutProps) {
  const [local, others] = splitProps(props, ["children", "title", "class"]);
  const fullTitle = () => (local.title ? `${local.title} — ${APP_CONFIG.APP_NAME}` : APP_CONFIG.APP_NAME);

  return (
    <>
      <Title>{fullTitle()}</Title>
      <main
        class={cn(
          "flex min-h-screen w-full items-center justify-center bg-surface-primary p-4 sm:p-6 lg:p-8",
          local.class,
        )}
        {...others}
      >
        <div class="flex w-full max-w-md flex-col items-center gap-6">
          {/* Brand Header */}
          <div class="flex flex-col items-center text-center">
            <h1 class="text-2xl font-bold tracking-tight text-foreground">{APP_CONFIG.APP_NAME}</h1>
            <p class="mt-1 text-sm text-muted-foreground">Sign in to access your dashboard</p>
          </div>

          {/* Form Card Container */}
          <div class="w-full rounded-xl border border-border bg-surface-elevated p-6 shadow-sm sm:p-8">
            {local.children}
          </div>
        </div>
      </main>
    </>
  );
}
