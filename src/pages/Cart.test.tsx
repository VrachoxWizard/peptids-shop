import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Cart from "./Cart";
import { useCartStore } from "../store/cartStore";
import { products } from "../data/products";

describe("Cart Component", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders empty state when cart has no items", () => {
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByText(/košarica je prazna/i)).toBeInTheDocument();
  });

  it("renders payment reassurance options (pouzeće, keks pay, kartice)", () => {
    useCartStore.getState().addItem(products[0], 1);
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );
    expect(screen.getByText(/pouzećem/i)).toBeInTheDocument();
    expect(screen.getByText(/keks pay/i)).toBeInTheDocument();
    expect(screen.getByText(/diskrecija/i)).toBeInTheDocument();
  });

  it("clears cart and displays order success confirmation when checkout button is clicked", () => {
    useCartStore.getState().addItem(products[0], 1);
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    const checkoutBtn = screen.getByRole("button", { name: /dovrši narudžbu/i });
    fireEvent.click(checkoutBtn);

    // Cart state must now be empty
    expect(useCartStore.getState().items).toHaveLength(0);

    // Confirmation screen should be displayed
    expect(screen.getByText(/narudžba zaprimljena!/i)).toBeInTheDocument();
  });
});
