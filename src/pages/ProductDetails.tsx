import { ArrowLeft, FlaskConical, ShoppingCart } from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const addItem = useCartStore((state) => state.addItem);

  const product = products.find((product) => product.slug === slug);

  if (!product) {
    return (
      <main className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold">Proizvod nije pronađen</h1>

        <Link
          to="/proizvodi"
          className="inline-block mt-6 text-emerald-400 hover:text-emerald-300"
        >
          ← Povratak na proizvode
        </Link>
      </main>
    );
  }

  function handleAddToCart() {
    addItem(product);

    toast.success("Proizvod dodan u košaricu", {
      description: product.name,
      action: {
        label: "Otvori košaricu",
        onClick: () => navigate("/kosarica"),
      },
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      <Link
        to="/proizvodi"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition mb-10"
      >
        <ArrowLeft size={18} />
        Povratak na proizvode
      </Link>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="aspect-square rounded-3xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
          <div className="w-40 h-56 rounded-xl border border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center">
            <FlaskConical size={40} className="text-emerald-400" />

            <span className="mt-4 text-sm font-bold text-emerald-400">
              RESEARCH LAB
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-emerald-400 text-sm font-medium">
            {product.category}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            {product.name}
          </h1>

          <p className="text-zinc-400 text-lg mt-5">{product.description}</p>

          <div className="border-t border-zinc-800 mt-8 pt-8 space-y-4">
            <div className="flex justify-between">
              <span className="text-zinc-500">Količina</span>

              <span>{product.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Namjena</span>

              <span>Istraživačka uporaba</span>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between gap-6">
            <span className="text-3xl font-bold">
              {product.price.toFixed(2)} €
            </span>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-semibold px-6 py-3 rounded-xl transition"
            >
              <ShoppingCart size={18} />
              Dodaj u demo košaricu
            </button>
          </div>

          <p className="text-xs text-zinc-600 mt-6">
            Demo proizvod prikazan isključivo za razvoj korisničkog sučelja.
          </p>
        </div>
      </div>
    </main>
  );
}
