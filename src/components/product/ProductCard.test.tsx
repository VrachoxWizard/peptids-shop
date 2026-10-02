import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";

describe("ProductCard Component", () => {
  it("renders Croatian trust badge for local stock & delivery", () => {
    render(
      <MemoryRouter>
        <ProductCard product={products[0]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/24[-–]48h/i)).toBeInTheDocument();
  });
});
