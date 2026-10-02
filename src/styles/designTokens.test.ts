import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

describe("Swiss Pharma Light Design Tokens", () => {
  it("should have light theme tokens defined in design-tokens.css", () => {
    const filePath = path.resolve(currentDir, "./design-tokens.css");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("--color-bg-base: #ffffff");
    expect(content).toContain("--color-text-primary: #09090b");
    expect(content).toContain("--color-accent-pharma: #0284c7");
    expect(content).toContain("--color-border-hairline");
  });

  it("should configure display serif and sans fonts in index.css", () => {
    const indexPath = path.resolve(currentDir, "../index.css");
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain("Playfair Display");
    expect(content).toContain("swiss-pharma");
  });
});
