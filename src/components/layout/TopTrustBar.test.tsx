import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import TopTrustBar from "./TopTrustBar";

describe("TopTrustBar Component", () => {
  it("renders key trust indicators", () => {
    render(<TopTrustBar />);
    expect(screen.getByText(/24-48h/i)).toBeInTheDocument();
    expect(screen.getByText(/pouzećem/i)).toBeInTheDocument();
  });
});
