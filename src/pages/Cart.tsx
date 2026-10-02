import { Minus, Plus, ShoppingCart, Trash2, Truck } from "lucide-react";

import { Link } from "react-router-dom";
import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { useCartStore } from "../store/cartStore";

export default function Cart() {
  const items = useCartStore((state) => state.items);

  const removeItem = useCartStore((state) => state.removeItem);

  const increaseItem = useCartStore((state) => state.increaseItem);

  const decreaseItem = useCartStore((state) => state.decreaseItem);

  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal >= 100 ? 0 : 4.9;

  const total = subtotal + shipping;

  const remainingForFreeShipping = Math.max(0, 100 - subtotal);

  function handleRemove(id: number, name: string) {
    removeItem(id);

    toast.success("Proizvod uklonjen iz košarice", {
      description: name,
    });
  }

  function handleClearCart() {
    clearCart();

    toast.success("Košarica je ispražnjena");
  }

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center">
          <ShoppingCart size={48} className="mx-auto text-zinc-600" />

          <h1 className="mt-6 text-2xl sm:text-3xl font-bold">Košarica je prazna</h1>

          <p className="mt-3 text-zinc-400">Dodaj neki proizvod iz kataloga.</p>

          <Link
            to="/proizvodi"
            className="mt-8 inline-block rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            Pogledaj proizvode
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-medium text-emerald-400 text-xs sm:text-sm">KOŠARICA</p>

          <h1 className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-bold">Vaši proizvodi</h1>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs sm:text-sm text-zinc-500 transition hover:text-red-400"
        >
          Isprazni košaricu
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Products */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5"
            >
              {/* Desktop layout: sm and above */}
              <div className="hidden sm:flex sm:items-center gap-6">
                {/* Product visual */}
                <Link
                  to={`/proizvod/${item.slug}`}
                  className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-800"
                >
                  <ProductVisual
                    name={item.name}
                    category={item.category}
                    amount={item.amount}
                    thumbnail
                  />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/proizvod/${item.slug}`}
                    className="truncate block text-lg font-semibold transition hover:text-emerald-400"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1 text-sm text-zinc-500">{item.category}</p>

                  <p className="mt-1 text-sm text-zinc-500">{item.amount}</p>

                  <p className="mt-2 font-semibold">
                    {item.price.toFixed(2)} €
                    <span className="ml-1 text-sm font-normal text-zinc-500">
                      / kom
                    </span>
                  </p>
                </div>

                {/* Quantity */}
                <div>
                  <p className="mb-2 text-center text-xs text-zinc-500">
                    Količina
                  </p>

                  <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                    <button
                      type="button"
                      onClick={() => decreaseItem(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                      aria-label="Smanji količinu"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="w-10 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseItem(item.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                      aria-label="Povećaj količinu"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Item total */}
                <div className="w-28 text-right">
                  <p className="text-xs text-zinc-500">Ukupno</p>

                  <p className="mt-1 text-lg font-bold">
                    {(item.price * item.quantity).toFixed(2)} €
                  </p>
                </div>

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(item.id, item.name)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Ukloni proizvod"
                >
                  <Trash2 size={19} />
                </button>
              </div>

              {/* Mobile layout: below sm */}
              <div className="flex sm:hidden flex-col gap-4">
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <Link
                    to={`/proizvod/${item.slug}`}
                    className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-800"
                  >
                    <ProductVisual
                      name={item.name}
                      category={item.category}
                      amount={item.amount}
                      thumbnail
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/proizvod/${item.slug}`}
                      className="text-base font-semibold leading-snug line-clamp-1 transition hover:text-emerald-400"
                    >
                      {item.name}
                    </Link>

                    <p className="mt-0.5 text-xs text-zinc-500">{item.category} · {item.amount}</p>

                    <p className="mt-1.5 text-sm font-semibold">
                      {item.price.toFixed(2)} €
                      <span className="ml-1 text-xs font-normal text-zinc-500">/ kom</span>
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.name)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Ukloni proizvod"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Mobile Stepper + Total row */}
                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <div className="flex items-center rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                    <button
                      type="button"
                      onClick={() => decreaseItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                      aria-label="Smanji količinu"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="w-9 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseItem(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                      aria-label="Povećaj količinu"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] uppercase tracking-wider text-zinc-500">Ukupno</span>
                    <span className="text-base font-bold text-white">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-zinc-800 bg-zinc-900 p-4 sm:p-6 lg:sticky lg:top-24">
          <h2 className="text-lg sm:text-xl font-bold">Sažetak košarice</h2>

          {/* Free shipping info */}
          <div className="mt-4 sm:mt-5 rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 sm:p-4">
            <div className="flex gap-3">
              <Truck size={20} className="shrink-0 text-emerald-400" />

              <div>
                {shipping === 0 ? (
                  <>
                    <p className="text-sm font-semibold text-emerald-400">
                      Besplatna demo dostava
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Dosegnut je prag od 100 €.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold">
                      Još {remainingForFreeShipping.toFixed(2)} € do besplatne
                      dostave
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Besplatna dostava iznad 100 €.
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Međuzbroj</span>

              <span>{subtotal.toFixed(2)} €</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-zinc-500">Dostava</span>

              <span>
                {shipping === 0 ? "Besplatno" : `${shipping.toFixed(2)} €`}
              </span>
            </div>

            <div className="border-t border-zinc-800 pt-3.5 sm:pt-4">
              <div className="flex items-end justify-between">
                <span className="font-semibold">Ukupno</span>

                <span className="text-2xl sm:text-3xl font-bold">{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-zinc-600">
            Demo prikaz. Stvarna kupnja, plaćanje i dostava nisu omogućeni.
          </p>

          <Link
            to="/proizvodi"
            className="mt-6 flex w-full items-center justify-center rounded-xl border border-zinc-700 px-4 py-3 text-sm font-semibold transition hover:bg-zinc-800"
          >
            Nastavi pregled proizvoda
          </Link>
        </aside>
      </div>
    </main>
  );
}
