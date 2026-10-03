import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import OrderTracking from "./OrderTracking";
import * as orderApi from "../services/orderApi";

describe("OrderTracking Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders order tracking input form", () => {
    render(
      <MemoryRouter initialEntries={["/prati-posiljku"]}>
        <Routes>
          <Route path="/prati-posiljku" element={<OrderTracking />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: /praćenje narudžbe/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/ORD-2026-XXXXXX/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /provjeri status/i }),
    ).toBeInTheDocument();
  });

  it("displays tracked order details when found", async () => {
    const mockOrder: orderApi.TrackedOrder = {
      orderNumber: "ORD-2026-123456",
      status: "SHIPPED",
      paymentMethod: "cod",
      paymentStatus: "PENDING",
      subtotal: 49.9,
      shippingFee: 4.9,
      total: 54.8,
      currency: "EUR",
      createdAt: new Date().toISOString(),
      items: [
        {
          name: "BPC-157 Arginatna sol",
          unitPrice: 49.9,
          quantity: 1,
          totalPrice: 49.9,
        },
      ],
      trackingNumber: "GLS987654321HR",
      shippingCarrier: "GLS",
      shipping: {
        recipientName: "M*** B***",
        city: "Zagreb",
        country: "Hrvatska",
      },
    };

    vi.spyOn(orderApi, "trackOrder").mockResolvedValue(mockOrder);

    render(
      <MemoryRouter initialEntries={["/prati-posiljku"]}>
        <Routes>
          <Route path="/prati-posiljku" element={<OrderTracking />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/ORD-2026-XXXXXX/i);
    fireEvent.change(input, { target: { value: "ORD-2026-123456" } });

    const submitBtn = screen.getByRole("button", { name: /provjeri status/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("ORD-2026-123456")).toBeInTheDocument();
    });

    expect(screen.getByText(/GLS987654321HR/)).toBeInTheDocument();
    expect(screen.getByText(/BPC-157 Arginatna sol/)).toBeInTheDocument();
  });

  it("displays error message when order is not found", async () => {
    vi.spyOn(orderApi, "trackOrder").mockRejectedValue(
      new Error("Narudžba s navedenim brojem nije pronađena."),
    );

    render(
      <MemoryRouter initialEntries={["/prati-posiljku"]}>
        <Routes>
          <Route path="/prati-posiljku" element={<OrderTracking />} />
        </Routes>
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/ORD-2026-XXXXXX/i);
    fireEvent.change(input, { target: { value: "ORD-NEPOSTOJECA" } });

    const submitBtn = screen.getByRole("button", { name: /provjeri status/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/narudžba s navedenim brojem nije pronađena/i),
      ).toBeInTheDocument();
    });
  });
});
