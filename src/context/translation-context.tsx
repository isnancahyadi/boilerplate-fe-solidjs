import * as i18n from "@solid-primitives/i18n";
import {
  type Accessor,
  createComponent,
  createContext,
  createMemo,
  createSignal,
  type JSX,
  useContext,
} from "solid-js";

import { Cookies } from "~/config/cookies";

import type en from "~/locales/en";

import locales from "~/locales";

export type RawDictionary = typeof en;
export type Locale = keyof typeof locales;
export type Dictionary = i18n.Flatten<RawDictionary>;

export interface TranslationState {
  t: i18n.Translator<Dictionary>;
  locale: Accessor<Locale>;
  setLocale(value: Locale): void;
}

export const TranslationContext = createContext<TranslationState>();

export const useTranslation = (): TranslationState => {
  const context = useContext(TranslationContext);
  if (!context?.t) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};

export interface TranslationProviderProps {
  children: JSX.Element;
  initialLocale?: Locale;
}

export function TranslationProvider(props: TranslationProviderProps) {
  const defaultLocale = props.initialLocale || (Cookies.get<string>("lang") as Locale) || "en";
  const [locale, setLocale] = createSignal<Locale>(defaultLocale);

  const dict = createMemo(() => i18n.flatten(locales[locale()]));
  const rawTranslator = i18n.translator(dict, i18n.resolveTemplate);
  const t: i18n.Translator<Dictionary> = (key, ...args) => rawTranslator(key, ...args) ?? String(key);

  const state: TranslationState = {
    locale() {
      return locale();
    },
    setLocale(value: Locale) {
      setLocale(value);
      Cookies.set("lang", value);
    },
    t,
  };

  return createComponent(TranslationContext.Provider, {
    value: state,
    get children() {
      return props.children;
    },
  });
}
