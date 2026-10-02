import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { z } from "zod";
import { useTranslation } from "../i18n/useTranslation";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
  const { t } = useTranslation();

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="max-w-2xl mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {t.contact.badge}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tighter text-white mt-2">
          {t.contact.title}
        </h1>

        <p className="text-zinc-400 mt-3 sm:mt-4 text-base sm:text-lg leading-relaxed">
          {t.contact.description}
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Kontakt informacije */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <Mail size={22} />
            </div>

            <h2 className="font-semibold text-base sm:text-lg mt-4 text-white">
              {t.contact.emailTitle}
            </h2>

            <p className="font-mono text-xs sm:text-sm text-emerald-400 mt-1">
              {t.contact.emailVal}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-500/30 bg-sky-950/40 text-sky-400">
              <MapPin size={22} />
            </div>

            <h2 className="font-semibold text-base sm:text-lg mt-4 text-white">
              {t.contact.locationTitle}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {t.contact.locationVal}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 sm:p-6 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-950/40 text-violet-400">
              <Clock size={22} />
            </div>

            <h2 className="font-semibold text-base sm:text-lg mt-4 text-white">
              {t.contact.hoursTitle}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              {t.contact.hoursVal}
            </p>
          </div>
        </div>

        {/* Forma */}
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-zinc-900/70 p-5 sm:p-7 md:p-8 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
              <MessageSquare size={20} />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white">{t.contact.formTitle}</h2>
          </div>

          {submitted && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="font-semibold text-emerald-300 text-sm sm:text-base">
                  {t.contact.successTitle}
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  {t.contact.successDesc}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Ime */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">
                {t.contact.nameLabel}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.contact.namePlaceholder}
                className={`w-full rounded-xl border bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base text-white outline-none transition placeholder:text-zinc-600 ${
                  errors.name
                    ? "border-red-500/80"
                    : "border-white/10 focus:border-emerald-400 focus:shadow-[0_0_20px_-5px_rgba(52,211,153,0.2)]"
                }`}
              />

              {errors.name && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2">
                {t.contact.emailLabel}
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.contact.emailPlaceholder}
                className={`w-full rounded-xl border bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base text-white outline-none transition placeholder:text-zinc-600 ${
                  errors.email
                    ? "border-red-500/80"
                    : "border-white/10 focus:border-emerald-400 focus:shadow-[0_0_20px_-5px_rgba(52,211,153,0.2)]"
                }`}
              />

              {errors.email && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5">{errors.email}</p>
              )}
            </div>

            {/* Poruka */}
            <div>
              <label
                htmlFor="message"
                className="block text-xs sm:text-sm font-medium text-zinc-300 mb-1.5 sm:mb-2"
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
                className={`w-full resize-none rounded-xl border bg-zinc-950/80 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base text-white outline-none transition placeholder:text-zinc-600 ${
                  errors.message
                    ? "border-red-500/80"
                    : "border-white/10 focus:border-emerald-400 focus:shadow-[0_0_20px_-5px_rgba(52,211,153,0.2)]"
                }`}
              />

              {errors.message && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="tactile-press w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition text-sm sm:text-base cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {t.contact.sendBtn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
