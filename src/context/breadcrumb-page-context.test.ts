import { createComponent, createRoot } from "solid-js";
import { describe, expect, it } from "vitest";

import type { BreadcrumbType } from "~/types/common";

import { BreadcrumbPageProvider, useBreadcrumbPageContext } from "./breadcrumb-page-context";

describe("BreadcrumbPageContext (Dual-Scenario)", () => {
  describe("Positive Scenarios (Happy Path)", () => {
    it("[POS-01] nilai awal data breadcrumb harus berupa array kosong atau initialData", () => {
      createRoot((dispose) => {
        let contextValue: ReturnType<typeof useBreadcrumbPageContext> | undefined;

        const Consumer = () => {
          contextValue = useBreadcrumbPageContext();
          return null;
        };

        createComponent(BreadcrumbPageProvider, {
          get children() {
            return createComponent(Consumer, {});
          },
        });

        expect(contextValue).toBeDefined();
        expect(contextValue?.data).toEqual([]);

        dispose();
      });
    });

    it("[POS-02] setData harus memperbarui state breadcrumb secara tepat", () => {
      createRoot((dispose) => {
        let contextValue: ReturnType<typeof useBreadcrumbPageContext> | undefined;

        const Consumer = () => {
          contextValue = useBreadcrumbPageContext();
          return null;
        };

        createComponent(BreadcrumbPageProvider, {
          get children() {
            return createComponent(Consumer, {});
          },
        });

        const newBreadcrumb: Array<BreadcrumbType> = [
          { title: "Home", path: "/" },
          { title: "Dashboard", path: "/app/dashboard" },
        ];

        contextValue?.setData(newBreadcrumb);

        expect(contextValue?.data).toHaveLength(2);
        expect(contextValue?.data[0].title).toBe("Home");
        expect(contextValue?.data[1].path).toBe("/app/dashboard");

        dispose();
      });
    });
  });

  describe("Negative Scenarios (Unhappy Path & Boundary)", () => {
    it("[NEG-01] memanggil useBreadcrumbPageContext di luar provider harus melempar exception", () => {
      createRoot((dispose) => {
        expect(() => useBreadcrumbPageContext()).toThrowError(
          "useBreadcrumbPageContext must be used within a BreadcrumbPageProvider",
        );
        dispose();
      });
    });

    it("[NEG-02] breadcrumb dengan path undefined harus dapat disimpan tanpa error", () => {
      createRoot((dispose) => {
        let contextValue: ReturnType<typeof useBreadcrumbPageContext> | undefined;

        const Consumer = () => {
          contextValue = useBreadcrumbPageContext();
          return null;
        };

        createComponent(BreadcrumbPageProvider, {
          get children() {
            return createComponent(Consumer, {});
          },
        });

        const items: Array<BreadcrumbType> = [{ title: "Current Page (No Link)" }];
        contextValue?.setData(items);

        expect(contextValue?.data[0].title).toBe("Current Page (No Link)");
        expect(contextValue?.data[0].path).toBeUndefined();

        dispose();
      });
    });
  });
});
