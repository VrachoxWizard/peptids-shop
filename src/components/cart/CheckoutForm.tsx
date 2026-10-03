import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import FormFieldInput from "./FormFieldInput";

export interface CheckoutFormData {
  recipientName: string;
  customerEmail: string;
  phoneNumber: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  country: string;
  needR1: boolean;
  companyName: string;
  companyOib: string;
  deliveryInstructions: string;
  ruoAccepted: boolean;
}

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormData, string>>;

interface CheckoutFormProps {
  formData: CheckoutFormData;
  errors: CheckoutFormErrors;
  onChange: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  language: "hr" | "en";
}

export default function CheckoutForm({
  formData,
  errors,
  onChange,
  language,
}: CheckoutFormProps) {
  const [showR1, setShowR1] = useState(formData.needR1);

  function handleR1Toggle(checked: boolean) {
    setShowR1(checked);
    onChange("needR1", checked);
    if (!checked) {
      onChange("companyName", "");
      onChange("companyOib", "");
    }
  }

  const isHr = language === "hr";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
          <MapPin size={18} />
        </div>
        <div>
          <h2 className="font-serif text-lg sm:text-xl font-bold text-slate-950">
            {isHr ? "Podaci za dostavu i naručitelja" : "Shipping & Customer Information"}
          </h2>
          <p className="text-xs text-slate-500">
            {isHr
              ? "Isporuka se vrši ekspresno u RH (GLS / DPD / Paketomati)"
              : "Express delivery within Croatia & EU region"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormFieldInput
          label={isHr ? "Ime i prezime *" : "Full Name *"}
          value={formData.recipientName}
          onChange={(val) => onChange("recipientName", val)}
          placeholder={isHr ? "Dr. Ivan Horvat" : "John Doe"}
          error={errors.recipientName}
          icon={<User size={15} />}
        />

        <FormFieldInput
          label={isHr ? "Email adresa za potvrdu *" : "Email Address *"}
          type="email"
          value={formData.customerEmail}
          onChange={(val) => onChange("customerEmail", val)}
          placeholder="ivan.horvat@lab.hr"
          error={errors.customerEmail}
          icon={<Mail size={15} />}
        />

        <FormFieldInput
          className="sm:col-span-2"
          label={isHr ? "Broj mobitela (za SMS najavu kurira) *" : "Phone Number (for SMS delivery) *"}
          type="tel"
          value={formData.phoneNumber}
          onChange={(val) => onChange("phoneNumber", val)}
          placeholder="+385 91 234 5678"
          error={errors.phoneNumber}
          helperText={
            isHr
              ? "Kurir šalje SMS s vremenskim okvirom dostave i poveznicom za preusmjeravanje."
              : "Used strictly for courier notification and delivery scheduling."
          }
          icon={<Phone size={15} />}
        />

        <FormFieldInput
          className="sm:col-span-2"
          label={isHr ? "Ulica i kućni broj *" : "Street Address *"}
          value={formData.streetAddress}
          onChange={(val) => onChange("streetAddress", val)}
          placeholder={isHr ? "Ilica 120, Stan 4B" : "Main Street 12"}
          error={errors.streetAddress}
        />

        <FormFieldInput
          label={isHr ? "Grad *" : "City *"}
          value={formData.city}
          onChange={(val) => onChange("city", val)}
          placeholder={isHr ? "Zagreb" : "Zagreb"}
          error={errors.city}
        />

        <FormFieldInput
          label={isHr ? "Poštanski broj *" : "Postal Code *"}
          value={formData.postalCode}
          onChange={(val) => onChange("postalCode", val)}
          placeholder="10000"
          error={errors.postalCode}
        />

        <FormFieldInput
          className="sm:col-span-2"
          label={isHr ? "Država" : "Country"}
          value={isHr ? "Hrvatska (Isporuka 24–48h)" : "Croatia (Delivery 24–48h)"}
          onChange={() => {}}
          readOnly
        />
      </div>

      {/* R1 Račun Toggle */}
      <div className="border-t border-slate-200 pt-4">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs sm:text-sm font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={showR1}
            onChange={(e) => handleR1Toggle(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-700 focus:ring-sky-600"
          />
          <Building2 size={16} className="text-slate-500" />
          <span>{isHr ? "Trebam R1 račun za tvrtku ili institut" : "Request Business/Institute Invoice (R1)"}</span>
        </label>

        {showR1 && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 rounded-lg border border-slate-200 bg-slate-50/70 p-3.5">
            <FormFieldInput
              label={isHr ? "Naziv pravne osobe *" : "Company Name *"}
              value={formData.companyName}
              onChange={(val) => onChange("companyName", val)}
              placeholder={isHr ? "Institut za biotehnologiju d.o.o." : "Biotech Institute Ltd."}
              error={errors.companyName}
            />

            <FormFieldInput
              label={isHr ? "OIB / Porezni broj *" : "Tax ID / VAT number *"}
              value={formData.companyOib}
              onChange={(val) => onChange("companyOib", val)}
              placeholder="12345678901"
              error={errors.companyOib}
            />
          </div>
        )}
      </div>

      {/* Napomena za kurira */}
      <FormFieldInput
        label={isHr ? "Napomena za dostavu / Paketomat (opcionalno)" : "Delivery Note / Parcel Locker ID (optional)"}
        value={formData.deliveryInstructions}
        onChange={(val) => onChange("deliveryInstructions", val)}
        placeholder={isHr ? "Npr. Ostaviti u paketomatu Dubrava ili kod susjeda" : "e.g., Leave at locker or reception"}
      />

      {/* RUO (Research Use Only) Zakonska Potvrda */}
      <div
        className={`rounded-xl border p-4 transition ${
          errors.ruoAccepted ? "border-red-400 bg-red-50/60" : "border-amber-200 bg-amber-50/50"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 shrink-0 text-amber-700">
            <AlertTriangle size={18} />
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-900">
              {isHr ? "Regulatorna Izjava (Research Use Only - RUO)" : "Regulatory Compliance (RUO)"}
            </span>

            <label className="mt-2 flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.ruoAccepted}
                onChange={(e) => onChange("ruoAccepted", e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-amber-400 text-sky-800 focus:ring-sky-700 shrink-0"
              />
              <span className="text-xs text-slate-800 leading-relaxed font-medium">
                {isHr
                  ? "Potvrđujem da naručene spojeve i peptide kupujem isključivo za laboratorijska in-vitro istraživanja, analitičku kalibraciju i znanstveni rad. Upoznat sam da spojevi nisu namijenjeni za ljudsku konzumaciju niti medicinsku upotrebu."
                  : "I certify that all purchased compounds are intended strictly for in-vitro laboratory research and analytical calibration, and not for human or veterinary administration."}
              </span>
            </label>

            {errors.ruoAccepted && (
              <p className="text-xs text-red-600 font-semibold mt-1.5">
                {errors.ruoAccepted}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
