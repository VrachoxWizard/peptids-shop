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

  it("clears cart and displays order success confirmation when checkout form is filled and submitted", async () => {
    useCartStore.getState().addItem(products[0], 1);
    render(
      <MemoryRouter>
        <Cart />
      </MemoryRouter>
    );

    // Popuni formu za dostavu
    fireEvent.change(screen.getByPlaceholderText(/dr\. ivan horvat/i), {
      target: { value: "Dr. Marko Maric" },
    });
    fireEvent.change(screen.getByPlaceholderText(/ivan\.horvat@lab\.hr/i), {
      target: { value: "marko.maric@institut.hr" },
    });
    fireEvent.change(screen.getByPlaceholderText(/\+385 91 234 5678/i), {
      target: { value: "+385 91 555 4321" },
    });
    fireEvent.change(screen.getByPlaceholderText(/ilica 120/i), {
      target: { value: "Vukovarska 78" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^zagreb$/i), {
      target: { value: "Zagreb" },
    });
    fireEvent.change(screen.getByPlaceholderText(/10000/i), {
      target: { value: "10000" },
    });

    // Označi RUO zakonsku izjavu
    const ruoCheckbox = screen.getByRole("checkbox", {
      name: /potvrđujem da naručene spojeve/i,
    });
    fireEvent.click(ruoCheckbox);

    const checkoutBtn = screen.getByRole("button", { name: /dovrši narudžbu/i });
    fireEvent.click(checkoutBtn);

    // Prikaz ekrana potvrde narudžbe
    expect(await screen.findByText(/narudžba zaprimljena!/i)).toBeInTheDocument();

    // Košarica mora biti ispražnjena
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
