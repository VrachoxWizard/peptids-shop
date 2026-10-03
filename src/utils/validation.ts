import type {
  CheckoutFormData,
  CheckoutFormErrors,
} from "../components/cart/CheckoutForm";

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  // Standard RFC 5322 compliant regex simplified for web forms
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormData, string>>;

export type ContactValidationMessages = {
  valName: string;
  valEmail: string;
  valMessage: string;
};

export function validateContactForm(
  data: ContactFormData,
  messages: ContactValidationMessages,
): { isValid: boolean; errors: ContactFormErrors } {
  const errors: ContactFormErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = messages.valName;
  }

  if (!isValidEmail(data.email)) {
    errors.email = messages.valEmail;
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.message = messages.valMessage;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCheckoutForm(
  data: CheckoutFormData,
  language: "hr" | "en",
): { isValid: boolean; errors: CheckoutFormErrors } {
  const errors: CheckoutFormErrors = {};
  const isHr = language === "hr";

  if (!data.recipientName.trim() || data.recipientName.trim().length < 2) {
    errors.recipientName = isHr
      ? "Ime i prezime moraju imati barem 2 znaka."
      : "Name must be at least 2 characters.";
  }

  if (!isValidEmail(data.customerEmail)) {
    errors.customerEmail = isHr
      ? "Unesite valjanu email adresu."
      : "Please enter a valid email address.";
  }

  if (!data.phoneNumber.trim() || data.phoneNumber.trim().length < 6) {
    errors.phoneNumber = isHr
      ? "Broj mobitela je obavezan radi SMS najave dostave."
      : "Phone number is required for SMS delivery scheduling.";
  }

  if (!data.streetAddress.trim() || data.streetAddress.trim().length < 3) {
    errors.streetAddress = isHr
      ? "Ulica i kućni broj su obavezni."
      : "Street address is required.";
  }

  if (!data.city.trim() || data.city.trim().length < 2) {
    errors.city = isHr ? "Grad je obavezan." : "City is required.";
  }

  if (!data.postalCode.trim() || data.postalCode.trim().length < 4) {
    errors.postalCode = isHr
      ? "Poštanski broj je obavezan."
      : "Postal code is required.";
  }

  if (data.needR1) {
    if (!data.companyName.trim()) {
      errors.companyName = isHr
        ? "Naziv tvrtke je obavezan."
        : "Company name is required.";
    }
    if (!data.companyOib.trim() || data.companyOib.trim().length < 8) {
      errors.companyOib = isHr
        ? "Unesite valjani OIB / porezni broj."
        : "Invalid Tax ID.";
    }
  }

  if (!data.ruoAccepted) {
    errors.ruoAccepted = isHr
      ? "Obavezno je potvrditi izjavu o laboratorijskoj namjeni (RUO)."
      : "You must confirm the laboratory research declaration (RUO).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
