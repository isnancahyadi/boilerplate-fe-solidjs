import { describe, expect, it, vi } from "vitest";

import { downloadFile } from "./file";

describe("file utility - downloadFile", () => {
  it("positif: membuat elemen anchor dan memicu trigger download blob di DOM", () => {
    // Mock URL methods
    const createObjectURLMock = vi.fn().mockReturnValue("blob:mock-url");
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    // Spy document append/remove
    const clickSpy = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue({
      set href(_val: string) {},
      set download(_val: string) {},
      style: {},
      click: clickSpy,
    } as unknown as HTMLAnchorElement);

    const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation(() => null as never);

    const blob = new Blob(["test-content"], { type: "text/plain" });
    downloadFile(blob, "test.txt");

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
  });

  it("negatif: tidak melempar error saat dijalankan di lingkungan non-DOM (SSR safety)", () => {
    const originalWindow = global.window;
    // @ts-expect-error simulating SSR
    delete global.window;

    expect(() => {
      downloadFile(new Blob(["ssr"]), "ssr.txt");
    }).not.toThrow();

    global.window = originalWindow;
  });
});
