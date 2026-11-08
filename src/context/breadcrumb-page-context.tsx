import { createComponent, createContext, type JSX, useContext } from "solid-js";
import { createStore, type SetStoreFunction } from "solid-js/store";

import type { BreadcrumbType } from "~/types/common";

export interface BreadcrumbPageContextType {
  data: Array<BreadcrumbType>;
  setData: SetStoreFunction<Array<BreadcrumbType>>;
}

export const BreadcrumbPageContext = createContext<BreadcrumbPageContextType>();

export interface BreadcrumbPageProviderProps {
  children: JSX.Element;
  initialData?: Array<BreadcrumbType>;
}

export function BreadcrumbPageProvider(props: BreadcrumbPageProviderProps) {
  const [data, setData] = createStore<Array<BreadcrumbType>>(props.initialData || []);

  return createComponent(BreadcrumbPageContext.Provider, {
    value: { data, setData },
    get children() {
      return props.children;
    },
  });
}

export function useBreadcrumbPageContext(): BreadcrumbPageContextType {
  const context = useContext(BreadcrumbPageContext);

  if (!context) {
    throw new Error("useBreadcrumbPageContext must be used within a BreadcrumbPageProvider");
  }

  return context;
}
