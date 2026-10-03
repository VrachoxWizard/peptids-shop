import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AdminPage from "./Admin";

describe("Admin Dashboard Page", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders login authentication view when unauthenticated", () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("PeptideLab Kontrolni Panel"),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Unesite ADMIN_API_KEY..."),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Prijavi se u sustav" }),
    ).toBeInTheDocument();
  });
});
