import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { z } from "zod";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
  const { t } = useTranslation();
  useDocumentTitle(t.contact.title);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSubmitted(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const schema = z.object({
      name: z.string().min(2, t.contact.valName),
      email: z.string().email(t.contact.valEmail),
      message: z.string().min(10, t.contact.valMessage),
    });

    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors: FormErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FormData;
        newErrors[field] = issue.message;
      });

      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-slate-900">
      {/* Header */}
      <div className="max-w-2xl mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">
          <span>{t.contact.badge}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-950 mt-2">
          {t.contact.title}
        </h1>

        <p className="text-slate-600 mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed">
          {t.contact.description}
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Kontakt informacije */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
              <Mail size={20} />
            </div>

            <h2 className="font-serif font-bold text-base sm:text-lg mt-4 text-slate-900">
              {t.contact.emailTitle}
            </h2>

            <p className="font-mono text-xs sm:text-sm text-sky-800 font-medium mt-1">
              {t.contact.emailVal}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
              <MapPin size={20} />
            </div>

            <h2 className="font-serif font-bold text-base sm:text-lg mt-4 text-slate-900">
              {t.contact.locationTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t.contact.locationVal}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700">
              <Clock size={20} />
            </div>

            <h2 className="font-serif font-bold text-base sm:text-lg mt-4 text-slate-900">
              {t.contact.hoursTitle}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {t.contact.hoursVal}
            </p>
          </div>
        </div>

        {/* Forma */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 sm:p-7 md:p-8 shadow-xs">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-sky-100 bg-sky-50 text-sky-700">
              <MessageSquare size={18} />
            </div>

            <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">{t.contact.formTitle}</h2>
          </div>

          {submitted && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <CheckCircle2
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600"
              />

              <div>
                <p className="font-semibold text-emerald-900 text-sm sm:text-base">
                  {t.contact.successTitle}
                </p>

                <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                  {t.contact.successDesc}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ime */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 font-medium">
                {t.contact.nameLabel}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
                  errors.name
                    ? "border-red-400"
                    : "border-slate-300 focus:border-sky-700"
                }`}
              />

              {errors.name && (
                <p className="text-xs text-red-600 mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 font-medium">
                {t.contact.emailLabel}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
                  errors.email
                    ? "border-red-400"
                    : "border-slate-300 focus:border-sky-700"
                }`}
              />

              {errors.email && (
                <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Poruka */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 font-medium"
              >
                {t.contact.messageLabel}
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder={t.contact.messagePlaceholder}
                className={`w-full resize-none rounded-lg border bg-white px-3.5 py-2.5 text-sm sm:text-base text-slate-900 outline-none transition placeholder:text-slate-400 shadow-xs ${
                  errors.message
                    ? "border-red-400"
                    : "border-slate-300 focus:border-sky-700"
                }`}
              />

              {errors.message && (
                <p className="text-xs text-red-600 mt-1.5">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="tactile-press w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-slate-950 px-6 py-3 font-semibold text-white hover:bg-slate-800 transition text-sm cursor-pointer shadow-sm"
            >
              {t.contact.sendBtn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
