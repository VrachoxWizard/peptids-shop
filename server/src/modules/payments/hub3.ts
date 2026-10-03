import { env } from "../../config/env";

export interface Hub3PaymentSlipData {
  orderNumber: string;
  amount: number;
  customerName: string;
  customerStreet: string;
  customerCity: string;
}

export interface Hub3SlipResponse {
  formattedBarcodePayload: string;
  receiverName: string;
  receiverIban: string;
  model: string;
  referenceNumber: string;
  purposeCode: string;
  description: string;
  amountFormatted: string;
}

export type Hub3PaymentSlip = Hub3SlipResponse;

/**
 * Generira standardni hrvatski HUB3 string payload za 2D crtični kod (SEPA uplatnica).
 * Format propisuje Hrvatska udruga banaka (HUB30 specifikacija).
 */
export function generateHub3Payload(data: Hub3PaymentSlipData): Hub3SlipResponse {
  // Iznos u centima formatiran s vodećim nulama do 15 mjesta
  const cents = Math.round(data.amount * 100);
  const amountStr = cents.toString().padStart(15, "0");
  
  // Poziv na broj (npr. HR00 ORD-2026-0001 ili numerički derivat)
  const cleanOrderRef = data.orderNumber.replace(/[^a-zA-Z0-9-]/g, "");
  const referenceNumber = cleanOrderRef;
  const purposeCode = "GDSV"; // Purchase of Goods and Services
  const description = `Narudzba ${data.orderNumber} PeptideLab`;

  // Standardizirani HUB30 multiline format
  const payloadLines = [
    "HRVHUB30",
    "EUR",
    amountStr,
    data.customerName.slice(0, 30),
    data.customerStreet.slice(0, 27),
    data.customerCity.slice(0, 27),
    env.COMPANY_NAME.slice(0, 25),
    env.COMPANY_STREET.slice(0, 25),
    env.COMPANY_CITY.slice(0, 21),
    env.COMPANY_IBAN,
    env.COMPANY_MODEL,
    referenceNumber.slice(0, 22),
    purposeCode,
    description.slice(0, 35),
  ];

  return {
    formattedBarcodePayload: payloadLines.join("\n"),
    receiverName: env.COMPANY_NAME,
    receiverIban: env.COMPANY_IBAN,
    model: env.COMPANY_MODEL,
    referenceNumber,
    purposeCode,
    description,
    amountFormatted: `${data.amount.toFixed(2)} EUR`,
  };
}
