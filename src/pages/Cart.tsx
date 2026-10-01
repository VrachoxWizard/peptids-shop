import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

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

  if (items.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <ShoppingCart size={50} className="mx-auto text-zinc-600" />

          <h1 className="text-3xl font-bold mt-6">Košarica je prazna</h1>

          <p className="text-zinc-400 mt-3">
            Dodaj neki demo proizvod iz kataloga.
          </p>

          <Link
            to="/proizvodi"
            className="inline-block mt-8 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 hover:bg-emerald-300 transition"
          >
            Pogledaj proizvode
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-emerald-400 font-medium">KOŠARICA</p>

          <h1 className="text-4xl font-bold mt-2">Vaši proizvodi</h1>
        </div>

        <button
          onClick={clearCart}
          className="text-sm text-zinc-500 hover:text-red-400 transition"
        >
          Isprazni košaricu
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
          >
            <div className="h-24 w-20 shrink-0 rounded-xl bg-zinc-800 flex items-center justify-center">
              <span className="text-xs font-bold text-emerald-400">LAB</span>
            </div>

            <div className="flex-1">
              <Link
                to={`/proizvod/${item.slug}`}
                className="text-lg font-semibold hover:text-emerald-400 transition"
              >
                {item.name}
              </Link>

              <p className="text-sm text-zinc-500 mt-1">{item.amount}</p>

              <p className="font-semibold mt-2">{item.price.toFixed(2)} €</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseItem(item.id)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
              >
                <Minus size={16} />
              </button>

              <span className="w-8 text-center font-semibold">
                {item.quantity}
              </span>

              <button
                onClick={() => increaseItem(item.id)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800 transition"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="sm:w-28 sm:text-right font-bold">
              {(item.price * item.quantity).toFixed(2)} €
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-zinc-500 hover:text-red-400 transition"
              aria-label="Ukloni proizvod"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 border-t border-zinc-800 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-zinc-400 text-lg">Ukupno</span>

          <span className="text-3xl font-bold">{total.toFixed(2)} €</span>
        </div>

        <p className="text-xs text-zinc-600 mt-4 text-right">
          Demo košarica — kupnja nije omogućena.
        </p>
      </div>
    </main>
  );
}
