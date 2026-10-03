import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./Admin";
import * as adminApi from "../services/adminApi";

describe("AdminPage CMS", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("prikazuje formu za administratorsku prijavu kada korisnik nije autentificiran", () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("PeptideLab Kontrolni Panel")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Unesite ADMIN_API_KEY..."),
    ).toBeInTheDocument();
  });

  it("uspješno prikazuje nadzornu ploču s tabovima nakon prijave", async () => {
    vi.spyOn(adminApi, "fetchAdminStats").mockResolvedValue({
      totalOrders: 12,
      totalRevenue: 1540,
      pendingFulfillment: 3,
      currency: "EUR",
    });

    vi.spyOn(adminApi, "fetchAdminOrders").mockResolvedValue({
      orders: [
        {
          id: "11111111-1111-1111-1111-111111111111",
          orderNumber: "ORD-2026-TEST01",
          customerName: "Dr. Ivan Horvat",
          customerEmail: "ivan@institut.hr",
          customerPhone: "+385912345678",
          total: 120,
          currency: "EUR",
          status: "CONFIRMED",
          paymentMethod: "transfer",
          paymentStatus: "PENDING",
          createdAt: "2026-10-03T10:00:00Z",
        },
      ],
      total: 1,
    });

    vi.spyOn(adminApi, "fetchAdminProducts").mockResolvedValue([
      {
        id: 1,
        slug: "bpc-157",
        nameHr: "BPC-157 5mg",
        category: "Regeneracija",
        descriptionHr: "Visoko pročišćeni pentadekapeptid",
        amount: "5mg",
        price: 49,
        featured: true,
        isActive: true,
        stockQuantity: 150,
        currentBatch: {
          id: 1,
          batchNumber: "BPC-2026-01",
          stockQuantity: 150,
          isReleased: true,
        },
      },
    ]);

    vi.spyOn(adminApi, "fetchAdminInquiries").mockResolvedValue([
      {
        id: 1,
        name: "Marko Marić",
        email: "marko@example.com",
        message: "Imate li CoA certifikat za BPC-157?",
        status: "NEW",
        createdAt: "2026-10-03T09:00:00Z",
      },
    ]);

    sessionStorage.setItem("peptidelab_admin_key", "valid_key");

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("PeptideLab CMS")).toBeInTheDocument();
    });

    // Provjeri tabove
    expect(screen.getByRole("button", { name: /Narudžbe/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Katalog & Skladište/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Kontakt upiti/i })).toBeInTheDocument();

    // Provjeri narudžbu
    expect(screen.getByText("ORD-2026-TEST01")).toBeInTheDocument();

    // Prebaci na tab "Katalog & Skladište"
    fireEvent.click(screen.getByRole("button", { name: /Katalog & Skladište/i }));

    await waitFor(() => {
      expect(screen.getByText("Dodaj novi artikl")).toBeInTheDocument();
      expect(screen.getByText("BPC-157 5mg")).toBeInTheDocument();
      expect(screen.getByText("150 kom na stanju")).toBeInTheDocument();
    });

    // Prebaci na tab "Kontakt upiti"
    fireEvent.click(screen.getByRole("button", { name: /Kontakt upiti/i }));

    await waitFor(() => {
      expect(screen.getByText("Marko Marić")).toBeInTheDocument();
      expect(screen.getByText("Imate li CoA certifikat za BPC-157?")).toBeInTheDocument();
    });
  });
});
