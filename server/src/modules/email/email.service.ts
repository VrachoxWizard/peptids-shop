import { env } from "../../config/env";
import type { Hub3PaymentSlip } from "../payments/hub3";

export interface SendOrderEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  shippingFee: number;
  currency: string;
  items: Array<{
    name: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
  }>;
  shippingAddress: {
    recipientName: string;
    streetAddress: string;
    city: string;
    postalCode: string;
    country: string;
    companyName?: string | null;
    companyOib?: string | null;
    deliveryInstructions?: string | null;
  };
  paymentDetails?: Hub3PaymentSlip | null;
}

export class EmailService {
  async sendOrderConfirmation(payload: SendOrderEmailPayload): Promise<boolean> {
    const paymentInstructions = this.formatPaymentInstructions(payload);

    const itemsHtml = payload.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; font-weight: 500;">${i.name}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-family: monospace;">${i.quantity}x</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace;">${i.unitPrice.toFixed(2)} ${payload.currency}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-family: monospace; font-weight: bold;">${i.totalPrice.toFixed(2)} ${payload.currency}</td>
        </tr>`,
      )
      .join("");

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b; line-height: 1.6;">
        <div style="background-color: #0f172a; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: -0.5px;">PeptideLab</h1>
          <p style="color: #38bdf8; margin: 4px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Laboratorijski Peptidi Visoke Čistoće (≥98%)</p>
        </div>

        <div style="padding: 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="font-size: 18px; color: #0f172a; margin-top: 0;">Zahvaljujemo na narudžbi, ${payload.customerName}!</h2>
          <p style="font-size: 14px; color: #64748b;">Vaša narudžba <strong>${payload.orderNumber}</strong> je uspješno zaprimljena i nalazi se u sustavu.</p>

          <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Stavke narudžbe</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead>
                <tr style="background-color: #f1f5f9; color: #64748b; text-align: left;">
                  <th style="padding: 8px 12px;">Spoj</th>
                  <th style="padding: 8px 12px; text-align: center;">Kol.</th>
                  <th style="padding: 8px 12px; text-align: right;">Cijena</th>
                  <th style="padding: 8px 12px; text-align: right;">Ukupno</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 8px 12px; text-align: right; color: #64748b;">Međuzbroj:</td>
                  <td style="padding: 8px 12px; text-align: right; font-family: monospace;">${payload.subtotal.toFixed(2)} ${payload.currency}</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding: 8px 12px; text-align: right; color: #64748b;">Dostava:</td>
                  <td style="padding: 8px 12px; text-align: right; font-family: monospace;">${payload.shippingFee.toFixed(2)} ${payload.currency}</td>
                </tr>
                <tr style="font-size: 15px; font-weight: bold; border-top: 2px solid #cbd5e1;">
                  <td colspan="3" style="padding: 10px 12px; text-align: right; color: #0f172a;">Za platiti:</td>
                  <td style="padding: 10px 12px; text-align: right; font-family: monospace; color: #0f172a;">${payload.total.toFixed(2)} ${payload.currency}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px;">
            <h3 style="margin: 0 0 8px; font-size: 14px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Adresa dostave</h3>
            <p style="margin: 2px 0;"><strong>${payload.shippingAddress.recipientName}</strong></p>
            <p style="margin: 2px 0;">${payload.shippingAddress.streetAddress}</p>
            <p style="margin: 2px 0;">${payload.shippingAddress.postalCode} ${payload.shippingAddress.city}, ${payload.shippingAddress.country}</p>
            <p style="margin: 2px 0; color: #64748b;">Kontakt telefon: ${payload.customerPhone}</p>
            ${payload.shippingAddress.companyName ? `<p style="margin: 2px 0; color: #0369a1;">R1 račun: ${payload.shippingAddress.companyName} (OIB: ${payload.shippingAddress.companyOib})</p>` : ""}
          </div>

          ${paymentInstructions}

          <div style="margin-top: 24px; padding: 12px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 8px; font-size: 11px; color: #991b1b; text-align: center;">
            <strong>ZAKONSKO UPOZORENJE (RUO):</strong> Svi proizvodi PeptideLab isporučuju se isključivo za in vitro istraživačku, laboratorijsku i znanstvenu upotrebu (Research Use Only). Proizvodi nisu namijenjeni za ljudsku upotrebu, konzumaciju niti medicinski tretman.
          </div>
        </div>

        <div style="padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
          PeptideLab Hrvatska • Zagreb • Sigurna i diskretna dostava u roku od 24/48h
        </div>
      </div>
    `;

    return this.sendViaResend({
      to: payload.customerEmail,
      subject: `Potvrda narudžbe [${payload.orderNumber}] - PeptideLab`,
      html: htmlBody,
    });
  }

  async sendMerchantAlert(payload: SendOrderEmailPayload): Promise<boolean> {
    if (!env.STORE_OWNER_EMAIL) return false;

    const htmlBody = `
      <div style="font-family: sans-serif; font-size: 14px; color: #0f172a;">
        <h2>Nova narudžba: ${payload.orderNumber}</h2>
        <p><strong>Iznos:</strong> ${payload.total.toFixed(2)} ${payload.currency} (${payload.paymentMethod.toUpperCase()})</p>
        <p><strong>Kupac:</strong> ${payload.customerName} (${payload.customerPhone}, ${payload.customerEmail})</p>
        <p><strong>Dostava:</strong> ${payload.shippingAddress.streetAddress}, ${payload.shippingAddress.postalCode} ${payload.shippingAddress.city}</p>
        <p><strong>Broj stavki:</strong> ${payload.items.length}</p>
      </div>
    `;

    return this.sendViaResend({
      to: env.STORE_OWNER_EMAIL,
      subject: `[NOVA NARUDŽBA] ${payload.orderNumber} - ${payload.total.toFixed(2)} EUR`,
      html: htmlBody,
    });
  }

  private formatPaymentInstructions(payload: SendOrderEmailPayload): string {
    if (payload.paymentMethod === "transfer" && payload.paymentDetails) {
      const p = payload.paymentDetails;
      return `
        <div style="margin: 20px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: bold;">Upute za plaćanje virmanom / HUB3 uplatnicom:</h3>
          <p style="margin: 4px 0;"><strong>Primatelj:</strong> ${p.receiverName}</p>
          <p style="margin: 4px 0;"><strong>IBAN primatelja:</strong> <span style="font-family: monospace; font-weight: bold;">${p.receiverIban}</span></p>
          <p style="margin: 4px 0;"><strong>Model i poziv na broj:</strong> <span style="font-family: monospace;">${p.model} ${p.referenceNumber}</span></p>
          <p style="margin: 4px 0;"><strong>Opis plaćanja:</strong> ${p.description}</p>
          <p style="margin: 4px 0;"><strong>Iznos:</strong> <span style="font-family: monospace; font-weight: bold;">${p.amountFormatted}</span></p>
        </div>
      `;
    }

    if (payload.paymentMethod === "keks") {
      return `
        <div style="margin: 20px 0; padding: 16px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; font-size: 13px;">
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #166534; font-weight: bold;">Plaćanje Keks Pay aplikacijom:</h3>
          <p style="margin: 4px 0;">Sredstva možete uplatiti putem Keks Pay aplikacije na broj narudžbe <strong>${payload.orderNumber}</strong> ili skeniranjem Keks koda trgovca.</p>
        </div>
      `;
    }

    return `
      <div style="margin: 20px 0; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px;">
        <h3 style="margin: 0 0 8px; font-size: 14px; color: #0f172a; font-weight: bold;">Plaćanje pouzećem (gotovinom ili karticom kuriru):</h3>
        <p style="margin: 4px 0;">Iznos od <strong>${payload.total.toFixed(2)} ${payload.currency}</strong> plaćate izravno GLS dostavljaču pri preuzimanju paketa.</p>
      </div>
    `;
  }

  private async sendViaResend(params: {
    to: string;
    subject: string;
    html: string;
  }): Promise<boolean> {
    if (!env.RESEND_API_KEY) {
      // Kada API ključ nije postavljen (npr. lokalni razvoj / testovi), simuliraj slanje bez greške
      return true;
    }

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM,
          to: [params.to],
          subject: params.subject,
          html: params.html,
        }),
      });

      return res.ok;
    } catch {
      return false;
    }
  }
}

export const emailService = new EmailService();
