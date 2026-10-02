import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

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

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

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
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <ShoppingCart size={50} className="mx-auto text-zinc-600" />

          <h1 className="mt-6 text-3xl font-bold">Košarica je prazna</h1>

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
    <main className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between gap-6">
        <div>
          <p className="font-medium text-emerald-400">KOŠARICA</p>

          <h1 className="mt-2 text-4xl font-bold">Vaši proizvodi</h1>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-sm text-zinc-500 transition hover:text-red-400"
        >
          Isprazni košaricu
        </button>
      </div>

      {/* Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              {/* Product visual */}
              <Link
                to={`/proizvod/${item.slug}`}
                className="w-full overflow-hidden rounded-xl border border-zinc-800 sm:w-28 sm:shrink-0"
              >
                <ProductVisual
                  name={item.name}
                  category={item.category}
                  amount={item.amount}
                />
              </Link>

              {/* Info */}
              <div className="flex-1">
                <Link
                  to={`/proizvod/${item.slug}`}
                  className="text-lg font-semibold transition hover:text-emerald-400"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-sm text-zinc-500">{item.category}</p>

                <p className="mt-1 text-sm text-zinc-500">{item.amount}</p>

                <p className="mt-3 font-semibold">
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
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                    aria-label="Smanji količinu"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseItem(item.id)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-zinc-800"
                    aria-label="Povećaj količinu"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Item total */}
              <div className="sm:w-28 sm:text-right">
                <p className="text-xs text-zinc-500">Ukupno</p>

                <p className="mt-1 text-lg font-bold">
                  {(item.price * item.quantity).toFixed(2)} €
                </p>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={() => handleRemove(item.id, item.name)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-red-500/10 hover:text-red-400"
                aria-label="Ukloni proizvod"
              >
                <Trash2 size={19} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg text-zinc-400">Ukupno</span>

          <span className="text-3xl font-bold">{total.toFixed(2)} €</span>
        </div>

        <p className="mt-4 text-right text-xs text-zinc-600">
          Demo košarica — stvarna kupnja nije omogućena.
        </p>
      </div>
    </main>
  );
}
