import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Products from "./Products";
import { translations } from "../i18n/translations";

describe("Products Page", () => {
  it("renders catalog title, search input, and product cards", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/pretraži prema nazivu/i)).toBeInTheDocument();
    expect(screen.getByText(/bpc-157/i)).toBeInTheDocument();
  });

  it("filters products by category dropdown", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const categorySelect = screen.getByLabelText(translations.hr.catalog.categoryLabel);
    fireEvent.change(categorySelect, { target: { value: "Peptidi" } });

    expect(screen.getByText(/bpc-157/i)).toBeInTheDocument();
  });

  it("resets filters when reset button is clicked", () => {
    render(
      <MemoryRouter>
        <Products />
      </MemoryRouter>
    );

    const categorySelect = screen.getByLabelText(translations.hr.catalog.categoryLabel);
    fireEvent.change(categorySelect, { target: { value: "Peptidi" } });

    const resetBtn = screen.getByRole("button", { name: translations.hr.catalog.resetFilters });
    fireEvent.click(resetBtn);

    expect(categorySelect).toHaveValue("Sve");
  });
});
