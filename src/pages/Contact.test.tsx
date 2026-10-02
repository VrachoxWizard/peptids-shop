import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Contact from "./Contact";
import { translations } from "../i18n/translations";

describe("Contact Page", () => {
  it("renders contact info and form", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByText(translations.hr.contact.title)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(translations.hr.contact.namePlaceholder)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: translations.hr.contact.sendBtn })).toBeInTheDocument();
  });

  it("displays validation errors when submitting invalid empty form", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole("button", { name: translations.hr.contact.sendBtn });
    fireEvent.click(submitBtn);

    expect(screen.getByText(translations.hr.contact.valName)).toBeInTheDocument();
    expect(screen.getByText(translations.hr.contact.valEmail)).toBeInTheDocument();
    expect(screen.getByText(translations.hr.contact.valMessage)).toBeInTheDocument();
  });

  it("submits successfully with valid data", () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
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

    expect(screen.getByText(translations.hr.contact.successTitle)).toBeInTheDocument();
  });
});
