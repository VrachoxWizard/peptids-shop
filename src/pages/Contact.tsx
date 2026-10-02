import { useState } from "react";
import {
  CheckCircle2,
  FlaskConical,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Ime mora imati barem 2 znaka."),

  email: z.string().email("Unesi ispravnu email adresu."),

  message: z.string().min(10, "Poruka mora imati barem 10 znakova."),
});

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Contact() {
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

    const result = contactSchema.safeParse(formData);

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
        <p className="text-emerald-400 font-medium text-xs sm:text-sm tracking-wider">
          KONTAKT
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-1.5 sm:mt-2">
          Javi nam se
        </h1>

        <p className="text-zinc-400 mt-3 sm:mt-4 text-base sm:text-lg">
          Imaš pitanje o demo projektu, katalogu ili funkcionalnostima
          aplikacije? Pošalji poruku.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
        {/* Kontakt informacije */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <Mail size={24} className="text-emerald-400" />

            <h2 className="font-semibold text-base sm:text-lg mt-3 sm:mt-4">
              Email
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 sm:mt-2">
              info@peptidelab.demo
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <MapPin size={24} className="text-emerald-400" />

            <h2 className="font-semibold text-base sm:text-lg mt-3 sm:mt-4">
              Lokacija
            </h2>

            <p className="text-xs sm:text-sm text-zinc-500 mt-1.5 sm:mt-2">
              Zagreb, Hrvatska
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
            <FlaskConical size={24} className="text-emerald-400" />

            <h2 className="font-semibold text-base sm:text-lg mt-3 sm:mt-4">
              PeptideLab
            </h2>

            <p className="text-xs sm:text-sm leading-6 text-zinc-500 mt-1.5 sm:mt-2">
              Demo frontend projekt s fiktivnim istraživačkim proizvodima.
            </p>
          </div>
        </div>

        {/* Forma */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <MessageSquare size={24} className="text-emerald-400" />

            <h2 className="text-xl sm:text-2xl font-bold">Pošalji poruku</h2>
          </div>

          {submitted && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-3.5 sm:p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-emerald-400"
              />

              <div>
                <p className="font-semibold text-emerald-400 text-sm sm:text-base">
                  Poruka je zaprimljena
                </p>

                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Ovo je demo forma pa se poruka trenutno ne šalje na pravi
                  server.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Ime */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Ime
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Tvoje ime"
                className={`w-full rounded-xl border bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base outline-none transition placeholder:text-zinc-600 ${
                  errors.name
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-emerald-400"
                }`}
              />

              {errors.name && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ime@email.com"
                className={`w-full rounded-xl border bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base outline-none transition placeholder:text-zinc-600 ${
                  errors.email
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-emerald-400"
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
                className="block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2"
              >
                Poruka
              </label>

              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Napiši poruku..."
                className={`w-full resize-none rounded-xl border bg-zinc-950 px-3.5 sm:px-4 py-2.5 sm:py-3 text-base outline-none transition placeholder:text-zinc-600 ${
                  errors.message
                    ? "border-red-500"
                    : "border-zinc-700 focus:border-emerald-400"
                }`}
              />

              {errors.message && (
                <p className="text-xs sm:text-sm text-red-400 mt-1.5">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-zinc-950 hover:bg-emerald-300 transition text-sm sm:text-base cursor-pointer"
            >
              Pošalji poruku
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
