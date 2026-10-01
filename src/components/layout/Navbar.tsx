import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

export default function Navbar() {
  const items = useCartStore((state) => state.items);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">
          PEPTIDE<span className="text-emerald-400">LAB</span>
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-zinc-300 hover:text-white transition">
            Početna
          </Link>

          <Link
            to="/proizvodi"
            className="text-zinc-300 hover:text-white transition"
          >
            Proizvodi
          </Link>

          <Link
            to="/kontakt"
            className="text-zinc-300 hover:text-white transition"
          >
            Kontakt
          </Link>

          <Link
            to="/kosarica"
            className="relative flex items-center gap-2 text-zinc-300 hover:text-white transition"
          >
            <ShoppingCart size={18} />

            <span>Košarica</span>

            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-400 px-1 text-xs font-bold text-zinc-950">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}
