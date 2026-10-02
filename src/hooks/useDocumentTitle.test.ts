import { describe, it, expect, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  const defaultTitle = document.title;

  afterEach(() => {
    document.title = defaultTitle;
  });

  it("sets custom title with brand suffix", () => {
    renderHook(() => useDocumentTitle("Katalog"));
    expect(document.title).toBe("Katalog | PeptideLab");
  });

  it("sets base title when title is omitted or empty", () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe("PeptideLab | Istraživački biokemijski spojevi");
  });
});
