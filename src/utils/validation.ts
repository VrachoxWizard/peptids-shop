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
