import { useState } from "react";
import { toast } from "sonner";

import OrderSuccessView, {
  type PaymentMethod,
} from "../components/cart/OrderSuccessView";
import EmptyCartView from "../components/cart/EmptyCartView";
import CartItemRow from "../components/cart/CartItemRow";
import CartSummarySidebar from "../components/cart/CartSummarySidebar";
import CheckoutForm, {
  type CheckoutFormData,
  type CheckoutFormErrors,
} from "../components/cart/CheckoutForm";
import { useCartStore } from "../store/cartStore";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useTranslation } from "../i18n/useTranslation";
import { products } from "../data/products";
import { getLocalizedProduct } from "../types/product";
import { calculateShipping } from "../config/shop";
import { submitOrder, type Hub3PaymentSlip } from "../services/orderApi";
import { validateCheckoutForm } from "../utils/validation";

export default function Cart() {
  const { t, language } = useTranslation();
  useDocumentTitle(t.cart.title);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CheckoutFormData>({
    recipientName: "",
    customerEmail: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "HR",
    needR1: false,
    companyName: "",
    companyOib: "",
    deliveryInstructions: "",
    ruoAccepted: false,
  });

  const [formErrors, setFormErrors] = useState<CheckoutFormErrors>({});

  const [completedOrder, setCompletedOrder] = useState<{
    orderNumber?: string;
    total: number;
    paymentMethod: PaymentMethod;
    paymentDetails?: Hub3PaymentSlip | null;
  } | null>(null);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  function handleFormFieldChange<K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K],
  ) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Očisti grešku za to polje
    if (formErrors[field]) {
      setFormErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  }

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

  async function handleCheckout() {
    const validation = validateCheckoutForm(formData, language);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      toast.error(
        language === "hr"
          ? "Molimo ispunite sve obavezne podatke za dostavu i potvrdite RUO izjavu."
          : "Please complete all required shipping fields and confirm the RUO declaration.",
      );
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        customerEmail: formData.customerEmail,
        shippingAddress: {
          recipientName: formData.recipientName,
          streetAddress: formData.streetAddress,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phoneNumber: formData.phoneNumber,
          companyName: formData.needR1 ? formData.companyName : undefined,
          companyOib: formData.needR1 ? formData.companyOib : undefined,
          deliveryInstructions: formData.deliveryInstructions || undefined,
        },
        paymentMethod,
        ruoDeclarationAccepted: true as const,
        notes: formData.deliveryInstructions,
      };

      const response = await submitOrder(orderPayload);

      setCompletedOrder({
        orderNumber: response.orderNumber,
        total: response.total || total,
        paymentMethod: response.paymentMethod,
        paymentDetails: response.paymentDetails,
      });

      clearCart();

      toast.success(
        paymentMethod === "cod"
          ? t.cart.orderSuccessCodDesc
          : paymentMethod === "transfer"
          ? "Narudžba zaprimljena! Podaci za uplatu su generirani."
          : "Narudžba zaprimljena! Upute za Keks Pay su prikazane.",
      );
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Došlo je do greške pri obradi narudžbe.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
          className="text-xs sm:text-sm text-slate-500 transition hover:text-red-600 font-medium cursor-pointer"
        >
          {t.cart.clearCart}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px] items-start">
        {/* Left Column: Products list + Delivery details */}
        <div className="space-y-6">
          {/* Products list */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
              {language === "hr" ? "Pregled stavki u košarici" : "Selected Cart Items"}
            </h2>
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

          {/* Forma za dostavu i RUO suglasnost */}
          <div className="pt-2">
            <CheckoutForm
              formData={formData}
              errors={formErrors}
              onChange={handleFormFieldChange}
              language={language}
            />
          </div>
        </div>

        {/* Right Column: Summary Sidebar */}
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
          isSubmitting={isSubmitting}
        />
      </div>
    </main>
  );
}
