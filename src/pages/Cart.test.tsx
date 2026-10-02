import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";
import { useCartStore } from "../store/cartStore";
import { products } from "../data/products";

describe("Cart Component Trust Enhancements", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
    useCartStore.getState().addItem(products[0], 1);
  });

  it("renders payment reassurance options (pouzeće, keks pay, kartice)", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByText(/pouzećem/i)).toBeInTheDocument();
    expect(screen.getByText(/keks pay/i)).toBeInTheDocument();
    expect(screen.getByText(/diskrecija/i)).toBeInTheDocument();
  });
});
