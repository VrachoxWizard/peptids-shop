import { useState } from "react";
import { toast } from "sonner";

import OrderSuccessView, {
  type PaymentMethod,
} from "../components/cart/OrderSuccessView";
import EmptyCartView from "../components/cart/EmptyCartView";
import CartItemRow from "../components/cart/CartItemRow";
import CartSummarySidebar from "../components/cart/CartSummarySidebar";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { products } from "../data/products";
import { getLocalizedProduct } from "../types/product";
import { calculateShipping } from "../config/shop";

export default function Cart() {
  const { t, language } = useTranslation();
  useDocumentTitle(t.cart.title);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [completedOrder, setCompletedOrder] = useState<{
    total: number;
    paymentMethod: PaymentMethod;
  } | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  function handleRemove(id: number, name: string) {
    removeItem(id);
    toast.success(t.cart.removedToast, {
      description: name,
    });
  }

  function handleClearCart() {
    clearCart();
    toast.success(t.cart.clearedToast);
  }

  function handleCheckout() {
    const finalTotal = total;
    const method = paymentMethod;
    setCompletedOrder({ total: finalTotal, paymentMethod: method });
    clearCart();
    toast.success(
      method === "cod"
        ? t.cart.orderSuccessCodDesc
        : t.cart.orderSuccessSecureDesc,
    );
  }

  if (completedOrder) {
    return (
      <OrderSuccessView
        tCart={t.cart}
        tPayments={t.payments}
        tTrustBar={t.trustBar}
        order={completedOrder}
        onContinueShopping={() => setCompletedOrder(null)}
      />
    );
  }

  if (items.length === 0) {
    return <EmptyCartView tCart={t.cart} />;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-16 text-slate-900">
      {/* Header */}
      <div className="mb-8 sm:mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-700">
            {t.cart.badge}
          </p>
          <h1 className="font-serif mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-slate-950">
            {t.cart.title}
          </h1>
        </div>

        <button
          type="button"
          onClick={handleClearCart}
          className="text-xs sm:text-sm text-slate-500 transition hover:text-red-600 font-medium"
        >
          {t.cart.clearCart}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Products list */}
        <div className="space-y-4">
          {items.map((item) => {
            const rawProduct = products.find((p) => p.id === item.id);
            const localizedProduct = rawProduct
              ? getLocalizedProduct(rawProduct, language)
              : item;

            return (
              <CartItemRow
                key={item.id}
                item={item}
                rawProduct={rawProduct}
                localizedProduct={localizedProduct}
                tCart={t.cart}
                onIncrease={increaseItem}
                onDecrease={decreaseItem}
                onRemove={handleRemove}
              />
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <CartSummarySidebar
          tCart={t.cart}
          tPayments={t.payments}
          tTrustBar={t.trustBar}
          language={language}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={setPaymentMethod}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  );
}
