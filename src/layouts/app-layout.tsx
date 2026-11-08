import { createSignal, type JSX, splitProps } from "solid-js";

import { APP_CONFIG } from "~/config/app";

import { cn } from "~/lib/utils";

export interface AppLayoutProps {
  children: JSX.Element;
  class?: string;
  headerSlot?: JSX.Element;
  sidebarSlot?: JSX.Element;
}

export default function AppLayout(props: AppLayoutProps) {
  const [local, others] = splitProps(props, ["children", "class", "headerSlot", "sidebarSlot"]);
  const [sidebarOpen, setSidebarOpen] = createSignal(true);

  return (
    <div class={cn("flex min-h-screen flex-col bg-background text-foreground", local.class)} {...others}>
      {/* Top Header Shell */}
      <header class="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface-primary px-4 sm:px-6">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-secondary text-muted-foreground hover:bg-surface-tertiary focus:outline-none"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle Sidebar"
          >
            <span class="text-sm font-bold">☰</span>
          </button>
          <span class="text-base font-semibold tracking-tight text-foreground">{APP_CONFIG.APP_NAME}</span>
        </div>
        <div class="flex items-center gap-4">{local.headerSlot}</div>
      </header>

      {/* Main Body with Sidebar & Content Viewport */}
      <div class="flex flex-1 overflow-hidden">
        {/* Sidebar Container */}
        <aside
          class={cn(
            "flex flex-col border-r border-border bg-surface-secondary transition-all duration-300 ease-in-out",
            sidebarOpen() ? "w-64" : "w-0 overflow-hidden border-none sm:w-16",
          )}
        >
          {local.sidebarSlot}
        </aside>

        {/* Primary Content Viewport */}
        <main class="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">{local.children}</main>
      </div>
    </div>
  );
}
