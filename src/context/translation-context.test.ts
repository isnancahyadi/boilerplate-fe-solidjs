import { createComponent, createRoot } from "solid-js";
import { beforeEach, describe, expect, it } from "vitest";

import { Cookies } from "~/config/cookies";

import { TranslationProvider, useTranslation } from "./translation-context";

describe("TranslationContext (Dual-Scenario)", () => {
  beforeEach(() => {
    Cookies.remove("lang");
  });

  describe("Positive Scenarios (Happy Path)", () => {
    it("[POS-01] harus menyediakan terjemahan default bahasa Inggris (en)", () => {
      createRoot((dispose) => {
        let translationState: ReturnType<typeof useTranslation> | undefined;

        const Consumer = () => {
          translationState = useTranslation();
          return null;
        };

        createComponent(TranslationProvider, {
          initialLocale: "en",
          get children() {
            return createComponent(Consumer, {});
          },
        });

        expect(translationState).toBeDefined();
        expect(translationState?.locale()).toBe("en");
        expect(translationState?.t("button.create")).toBe("Create");
        expect(translationState?.t("button.delete")).toBe("Delete");

        dispose();
      });
    });

    it("[POS-02] setLocale harus mengubah bahasa secara reaktif dan menyimpan cookie", () => {
      createRoot((dispose) => {
        let translationState: ReturnType<typeof useTranslation> | undefined;

        const Consumer = () => {
          translationState = useTranslation();
          return null;
        };

        createComponent(TranslationProvider, {
          initialLocale: "en",
          get children() {
            return createComponent(Consumer, {});
          },
        });

        expect(translationState?.t("button.create")).toBe("Create");

        // Ubah bahasa ke Bahasa Indonesia
        translationState?.setLocale("id");

        expect(translationState?.locale()).toBe("id");
        expect(translationState?.t("button.create")).toBe("Tambah");
        expect(Cookies.get<string>("lang")).toBe("id");

        dispose();
      });
    });
  });

  describe("Negative Scenarios (Unhappy Path & Boundary)", () => {
    it("[NEG-01] key terjemahan yang tidak terdaftar tidak boleh crash dan mengembalikan fallback", () => {
      createRoot((dispose) => {
        let translationState: ReturnType<typeof useTranslation> | undefined;

        const Consumer = () => {
          translationState = useTranslation();
          return null;
        };

        createComponent(TranslationProvider, {
          initialLocale: "en",
          get children() {
            return createComponent(Consumer, {});
          },
        });

        const fallback = translationState?.t("unknown.nonExistentKey" as unknown as "button.create");
        expect(typeof fallback).toBe("string");

        dispose();
      });
    });

    it("[NEG-02] memanggil useTranslation di luar provider harus melempar exception informatif", () => {
      createRoot((dispose) => {
        expect(() => useTranslation()).toThrowError("useTranslation must be used within a TranslationProvider");
        dispose();
      });
    });
  });
});
