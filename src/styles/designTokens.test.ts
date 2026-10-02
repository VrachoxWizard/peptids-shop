import { describe, it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

describe("Pharma Trust Blue Design Tokens", () => {
  it("should have design-tokens.css generated with primary color #0284c7", () => {
    const filePath = path.resolve(currentDir, "./design-tokens.css");
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, "utf-8");
    expect(content).toContain("--colors-primary");
    expect(content.toLowerCase()).toContain("#0284c7");
  });

  it("should include design tokens in index.css", () => {
    const indexPath = path.resolve(currentDir, "../index.css");
    const content = fs.readFileSync(indexPath, "utf-8");
    expect(content).toContain("design-tokens.css");
  });
});
