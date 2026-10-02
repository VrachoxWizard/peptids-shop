import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CroatiaTrustBadges from "./CroatiaTrustBadges";

describe("CroatiaTrustBadges Component", () => {
  it("renders 4 pillars of Croatian buyer trust", () => {
    render(<CroatiaTrustBadges />);
    expect(screen.getByTestId("trust-badge-cod")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-delivery")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-discrete")).toBeInTheDocument();
    expect(screen.getByTestId("trust-badge-support")).toBeInTheDocument();
  });
});
