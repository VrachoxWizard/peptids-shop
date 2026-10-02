import { ArrowLeft, ShoppingCart } from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";
import ProductVisual from "../components/product/ProductVisual";

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
          className="mt-6 inline-block text-emerald-400 hover:text-emerald-300"
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
        className="mb-10 inline-flex items-center gap-2 text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Povratak na proizvode
      </Link>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl border border-zinc-800">
          <ProductVisual
            name={product.name}
            category={product.category}
            amount={product.amount}
            large
          />
        </div>

        <div className="flex flex-col justify-center">
          <span className="text-sm font-medium uppercase tracking-wider text-emerald-400">
            {product.category}
          </span>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-lg leading-8 text-zinc-400">
            {product.description}
          </p>

          <div className="mt-8 space-y-4 border-t border-zinc-800 pt-8">
            <div className="flex justify-between">
              <span className="text-zinc-500">Količina</span>

              <span>{product.amount}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Kategorija</span>

              <span>{product.category}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">Namjena</span>

              <span>Demo / istraživački katalog</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="block text-sm text-zinc-500">Cijena</span>

              <span className="text-4xl font-bold">
                {product.price.toFixed(2)}
                <span className="ml-1 text-lg font-normal text-zinc-500">
                  €
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-95"
            >
              <ShoppingCart size={18} />
              Dodaj u demo košaricu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
