import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./ProductDetails";
import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";

describe("ProductDetails Page", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("renders product info when product is found by slug", () => {
    render(
      <MemoryRouter initialEntries={[`/proizvod/${products[0].slug}`]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(products[0].name);
    expect(screen.getByText(products[0].description)).toBeInTheDocument();
  });

  it("increases and decreases quantity with stepper buttons", () => {
    render(
      <MemoryRouter initialEntries={[`/proizvod/${products[0].slug}`]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const plusBtn = screen.getByRole("button", { name: /povećaj količinu/i });
    const minusBtn = screen.getByRole("button", { name: /smanji količinu/i });

    // Initial quantity is 1
    expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();

    fireEvent.click(plusBtn);
    expect(screen.getByText("2", { selector: "span" })).toBeInTheDocument();

    fireEvent.click(minusBtn);
    expect(screen.getByText("1", { selector: "span" })).toBeInTheDocument();
  });

  it("adds specified quantity to cart", () => {
    render(
      <MemoryRouter initialEntries={[`/proizvod/${products[0].slug}`]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const plusBtn = screen.getByRole("button", { name: /povećaj količinu/i });
    fireEvent.click(plusBtn); // quantity = 2

    const addBtn = screen.getByRole("button", { name: /dodaj u košaricu/i });
    fireEvent.click(addBtn);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(products[0].id);
    expect(items[0].quantity).toBe(2);
  });

  it("renders stock badge when product is loaded", () => {
    render(
      <MemoryRouter initialEntries={[`/proizvod/${products[0].slug}`]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/dostupno odmah/i)).toBeInTheDocument();
  });

  it("opens Certificate of Analysis modal when clicking View CoA button", () => {
    render(
      <MemoryRouter initialEntries={[`/proizvod/${products[0].slug}`]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const coaBtn = screen.getByRole("button", { name: /pregledaj coa/i });
    fireEvent.click(coaBtn);

    expect(
      screen.getByRole("heading", { name: /certifikat analize \(coa\)/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/rezultati analitičkog ispitivanja/i)).toBeInTheDocument();
    expect(screen.getByText(/rp-hplc chromatogram/i)).toBeInTheDocument();
  });

  it("renders not found state when slug does not match any product", async () => {
    render(
      <MemoryRouter initialEntries={["/proizvod/nepostojeci-proizvod"]}>
        <Routes>
          <Route path="/proizvod/:slug" element={<ProductDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText(/proizvod nije pronađen/i)).toBeInTheDocument();
  });
});
