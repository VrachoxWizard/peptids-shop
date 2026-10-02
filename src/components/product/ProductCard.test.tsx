import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "../../data/products";
import { useCartStore } from "../../store/cartStore";

describe("ProductCard Component", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders Croatian trust badge for local stock & delivery", () => {
    render(
      <MemoryRouter>
        <ProductCard product={products[0]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/24[-–]48h/i)).toBeInTheDocument();
  });

  it("displays product details and price", () => {
    render(
      <MemoryRouter>
        <ProductCard product={products[0]} />
      </MemoryRouter>
    );
    expect(screen.getByText(products[0].name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`${products[0].price.toFixed(2)}`, "i"))).toBeInTheDocument();
  });

  it("adds item to cart on button click and provides tactile feedback", () => {
    render(
      <MemoryRouter>
        <ProductCard product={products[0]} />
      </MemoryRouter>
    );

    const addBtn = screen.getByRole("button", { name: /dodaj/i });
    fireEvent.click(addBtn);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(products[0].id);

    // Shows tactile "Dodano" confirmation
    expect(screen.getByText(/dodano/i)).toBeInTheDocument();
  });
});
