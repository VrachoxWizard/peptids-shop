import { useState } from "react";

import { ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { toast } from "sonner";

import ProductVisual from "../components/product/ProductVisual";
import { products } from "../data/products";
import { useCartStore } from "../store/cartStore";

export default function ProductDetails() {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);

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

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => Math.min(99, current + 1));
  }

  function handleAddToCart() {
    addItem(product, quantity);

    toast.success("Proizvod dodan u košaricu", {
      description: `${product.name} × ${quantity}`,
      action: {
        label: "Otvori košaricu",

        onClick: () => navigate("/kosarica"),
      },
    });

    setQuantity(1);
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
        {/* Product visual */}
        <div className="overflow-hidden rounded-3xl border border-zinc-800">
          <ProductVisual
            name={product.name}
            category={product.category}
            amount={product.amount}
            large
          />
        </div>

        {/* Product info */}
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
              <span className="text-zinc-500">Količina pakiranja</span>

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

          {/* Price */}
          <div className="mt-10">
            <span className="block text-sm text-zinc-500">Cijena</span>

            <span className="text-4xl font-bold">
              {product.price.toFixed(2)}

              <span className="ml-1 text-lg font-normal text-zinc-500">€</span>
            </span>
          </div>

          {/* Quantity */}
          <div className="mt-8">
            <span className="mb-3 block text-sm font-medium text-zinc-400">
              Količina
            </span>

            <div className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900 p-1">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity === 1}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Smanji količinu"
              >
                <Minus size={18} />
              </button>

              <span className="w-14 text-center text-lg font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity === 99}
                className="flex h-11 w-11 items-center justify-center rounded-lg transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Povećaj količinu"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">
            <span className="text-zinc-500">Ukupno</span>

            <span className="text-2xl font-bold">
              {(product.price * quantity).toFixed(2)} €
            </span>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-6 py-4 font-semibold text-zinc-950 transition hover:bg-emerald-300 active:scale-[0.99]"
          >
            <ShoppingCart size={19} />
            Dodaj {quantity} u košaricu
          </button>
        </div>
      </div>
    </main>
  );
}
