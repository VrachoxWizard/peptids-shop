import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "./Footer";

describe("Footer Trust Elements", () => {
  it("renders Croatian courier and payment badges", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );
    expect(screen.getByText(/GLS/i)).toBeInTheDocument();
    expect(screen.getByText(/DPD/i)).toBeInTheDocument();
    expect(screen.getByText(/Keks Pay/i)).toBeInTheDocument();
  });

  it("renders discrete admin portal link in footer", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const adminLink = screen.getByRole("link", { name: /admin/i });
    expect(adminLink).toBeInTheDocument();
    expect(adminLink).toHaveAttribute("href", "/admin");
  });
});
