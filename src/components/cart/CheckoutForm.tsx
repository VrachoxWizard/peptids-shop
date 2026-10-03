import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  MapPin,
  Phone,
  User,
} from "lucide-react";

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
  onChange: (field: keyof CheckoutFormData, value: any) => void;
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
        {/* Ime i prezime */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Ime i prezime *" : "Full Name *"}
          </label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={formData.recipientName}
              onChange={(e) => onChange("recipientName", e.target.value)}
              placeholder={isHr ? "Dr. Ivan Horvat" : "John Doe"}
              className={`w-full rounded-lg border bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
                errors.recipientName ? "border-red-400" : "border-slate-300 focus:border-sky-700"
              }`}
            />
          </div>
          {errors.recipientName && (
            <p className="text-xs text-red-600 mt-1">{errors.recipientName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Email adresa za potvrdu *" : "Email Address *"}
          </label>
          <input
            type="email"
            value={formData.customerEmail}
            onChange={(e) => onChange("customerEmail", e.target.value)}
            placeholder="ivan.horvat@lab.hr"
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
              errors.customerEmail ? "border-red-400" : "border-slate-300 focus:border-sky-700"
            }`}
          />
          {errors.customerEmail && (
            <p className="text-xs text-red-600 mt-1">{errors.customerEmail}</p>
          )}
        </div>

        {/* Broj mobitela */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Broj mobitela (za SMS najavu kurira) *" : "Phone Number (for SMS delivery) *"}
          </label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => onChange("phoneNumber", e.target.value)}
              placeholder="+385 91 234 5678"
              className={`w-full rounded-lg border bg-white pl-9 pr-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
                errors.phoneNumber ? "border-red-400" : "border-slate-300 focus:border-sky-700"
              }`}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isHr
              ? "Kurir šalje SMS s vremenskim okvirom dostave i poveznicom za preusmjeravanje."
              : "Used strictly for courier notification and delivery scheduling."}
          </p>
          {errors.phoneNumber && (
            <p className="text-xs text-red-600 mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Ulica i kućni broj */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Ulica i kućni broj *" : "Street Address *"}
          </label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
            placeholder={isHr ? "Ilica 120, Stan 4B" : "Main Street 12"}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
              errors.streetAddress ? "border-red-400" : "border-slate-300 focus:border-sky-700"
            }`}
          />
          {errors.streetAddress && (
            <p className="text-xs text-red-600 mt-1">{errors.streetAddress}</p>
          )}
        </div>

        {/* Grad */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Grad *" : "City *"}
          </label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder={isHr ? "Zagreb" : "Zagreb"}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
              errors.city ? "border-red-400" : "border-slate-300 focus:border-sky-700"
            }`}
          />
          {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
        </div>

        {/* Poštanski broj */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Poštanski broj *" : "Postal Code *"}
          </label>
          <input
            type="text"
            value={formData.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            placeholder="10000"
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
              errors.postalCode ? "border-red-400" : "border-slate-300 focus:border-sky-700"
            }`}
          />
          {errors.postalCode && (
            <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>
          )}
        </div>

        {/* Država */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {isHr ? "Država" : "Country"}
          </label>
          <input
            type="text"
            readOnly
            value={isHr ? "Hrvatska (Isporuka 24–48h)" : "Croatia (Delivery 24–48h)"}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-600 cursor-not-allowed"
          />
        </div>
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
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isHr ? "Naziv pravne osobe *" : "Company Name *"}
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => onChange("companyName", e.target.value)}
                placeholder={isHr ? "Institut za biotehnologiju d.o.o." : "Biotech Institute Ltd."}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-900 outline-none"
              />
              {errors.companyName && (
                <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                {isHr ? "OIB / Porezni broj *" : "Tax ID / VAT number *"}
              </label>
              <input
                type="text"
                value={formData.companyOib}
                onChange={(e) => onChange("companyOib", e.target.value)}
                placeholder="12345678901"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm text-slate-900 outline-none"
              />
              {errors.companyOib && (
                <p className="text-xs text-red-600 mt-1">{errors.companyOib}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Napomena za kurira */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">
          {isHr ? "Napomena za dostavu / Paketomat (opcionalno)" : "Delivery Note / Parcel Locker ID (optional)"}
        </label>
        <input
          type="text"
          value={formData.deliveryInstructions}
          onChange={(e) => onChange("deliveryInstructions", e.target.value)}
          placeholder={isHr ? "Npr. Ostaviti u paketomatu Dubrava ili kod susjeda" : "e.g., Leave at locker or reception"}
          className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {/* RUO (Research Use Only) Zakonska Potvrda */}
      <div className={`rounded-xl border p-4 transition ${
        errors.ruoAccepted ? "border-red-400 bg-red-50/60" : "border-amber-200 bg-amber-50/50"
      }`}>
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
