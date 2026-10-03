import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Contact from "./Contact";
import { translations } from "../i18n/translations";
import * as inquiryApi from "../services/inquiryApi";

describe("Contact Page", () => {
  it("renders contact info and form", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );

    expect(screen.getByText(translations.hr.contact.title)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(translations.hr.contact.namePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: translations.hr.contact.sendBtn })).toBeInTheDocument();
  });

  it("displays validation errors when submitting invalid empty form", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );

    const submitBtn = screen.getByRole("button", { name: translations.hr.contact.sendBtn });
    fireEvent.click(submitBtn);

    expect(screen.getByText(translations.hr.contact.valName)).toBeInTheDocument();
    expect(screen.getByText(translations.hr.contact.valEmail)).toBeInTheDocument();
    expect(screen.getByText(translations.hr.contact.valMessage)).toBeInTheDocument();
  });

  it("submits successfully with valid data", async () => {
    vi.spyOn(inquiryApi, "submitInquiry").mockResolvedValueOnce({
      id: 1,
      status: "NEW",
      createdAt: new Date().toISOString(),
    });

    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(translations.hr.contact.namePlaceholder), {
      target: { value: "Dr. Ana Horvat" },
    });
    fireEvent.change(screen.getByPlaceholderText(translations.hr.contact.emailPlaceholder), {
      target: { value: "ana.horvat@institut.hr" },
    });
    fireEvent.change(screen.getByPlaceholderText(translations.hr.contact.messagePlaceholder), {
      target: { value: "Trebamo specifikaciju HPLC analize za seriju 2026." },
    });

    const submitBtn = screen.getByRole("button", { name: translations.hr.contact.sendBtn });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(translations.hr.contact.successTitle)).toBeInTheDocument();
  });
});
