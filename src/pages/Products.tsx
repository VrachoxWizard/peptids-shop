import ProductCard from "../components/product/ProductCard";
import { products } from "../data/products";

export default function Products() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <p className="text-emerald-400 font-medium">KATALOG</p>

        <h1 className="text-4xl font-bold mt-2">Istraživački proizvodi</h1>

        <p className="text-zinc-400 mt-3">
          Demo proizvodi prikazani isključivo za razvoj korisničkog sučelja.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
