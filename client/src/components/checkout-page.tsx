"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ContentContainer, PageShell } from "@/components/templates/page-shell";
import { useCart } from "@/components/providers/cart-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { formatPrice } from "@/lib/services/products";
import { resolveImage } from "@/lib/images";

import Script from "next/script";
import toast from "react-hot-toast";

export function CheckoutPageView() {
  const { cart, clearCart } = useCart();
  const { user, loading, firebaseUser } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isBuyNow = searchParams.get("buyNow") === "1";
  
  const [items, setItems] = useState<any[]>([]);
  const [summary, setSummary] = useState({ subtotal: 0, discount: 0, shipping: 0, total: 0 });
  
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.mobile || "",
  });
  
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/checkout" + (isBuyNow ? "?buyNow=1" : ""));
    }
  }, [user, loading, router, isBuyNow]);

  useEffect(() => {
    if (isBuyNow) {
      const storedItem = sessionStorage.getItem("buyNowItem");
      if (storedItem) {
        try {
          const item = JSON.parse(storedItem);
          setItems([item]);
          setSummary({
            subtotal: item.price,
            discount: 0,
            shipping: 0, 
            total: item.price
          });
        } catch (err) {
          console.error("Failed to parse buyNowItem", err);
        }
      }
    } else {
      setItems(cart.items);
      setSummary({
        subtotal: cart.summary.subtotal,
        discount: cart.summary.discount,
        shipping: cart.summary.shipping ?? 0,
        total: cart.summary.total,
      });
    }
  }, [isBuyNow, cart]);

  const handlePayment = async () => {
    if (!user || !firebaseUser) return toast.error("Please login first");
    if (!address.firstName || !address.phone || !address.address) {
      return toast.error("Please fill required address fields");
    }
    if (items.length === 0) return toast.error("Cart is empty");

    setIsProcessing(true);

    try {
      const token = await firebaseUser.getIdToken(true);
      
      const payload = {
        customerName: `${address.firstName} ${address.lastName}`.trim(),
        customerEmail: user.email || "no-email@example.com",
        customerMobile: address.phone,
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          colorIndex: item.colorIndex || 0,
          addons: item.addons || [],
          bottomSize: item.bottomSize,
          quantity: item.quantity || 1,
          unitPrice: item.price,
        })),
        discount: summary.discount,
      };

      // 1. Create Razorpay order on backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/create-razorpay-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create order");

      // 2. Open Razorpay modal
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Trilokini",
        description: "Order Payment",
        order_id: data.razorpayOrderId,
        handler: async function (response: any) {
          try {
            toast.loading("Verifying payment...", { id: "payment-verification" });
            const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: data.orderId,
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message || "Payment verification failed");

            toast.success("Order placed successfully!", { id: "payment-verification" });
            
            if (isBuyNow) sessionStorage.removeItem("buyNowItem");
            else clearCart();
            
            router.push("/account");
          } catch (err: any) {
            toast.error(err.message, { id: "payment-verification" });
            setIsProcessing(false);
          }
        },
        prefill: {
          name: payload.customerName,
          email: payload.customerEmail,
          contact: payload.customerMobile,
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error(response.error.description || "Payment failed");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  return (
    <PageShell>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <ContentContainer className="py-6 lg:py-10">
        <h1 className="mb-6 text-[18px] font-semibold uppercase tracking-[0.9px]">CHECKOUT</h1>
        
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column - Forms */}
          <div className="space-y-8">
            <section>
              <h2 className="mb-4 border-b border-black/20 pb-2 text-[14px] font-semibold uppercase tracking-[0.7px]">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="First name *" value={address.firstName} onChange={(e) => setAddress({ ...address, firstName: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
                <input type="text" placeholder="Last name" value={address.lastName} onChange={(e) => setAddress({ ...address, lastName: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
                <input type="text" placeholder="Address *" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} className="col-span-1 w-full border border-black/20 p-3 text-[13px] outline-none sm:col-span-2" />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={address.apartment} onChange={(e) => setAddress({ ...address, apartment: e.target.value })} className="col-span-1 w-full border border-black/20 p-3 text-[13px] outline-none sm:col-span-2" />
                <input type="text" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
                <input type="text" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
                <input type="text" placeholder="PIN code" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
                <input type="tel" placeholder="Phone *" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full border border-black/20 p-3 text-[13px] outline-none" />
              </div>
            </section>

            <button type="button" onClick={handlePayment} disabled={isProcessing} className="h-12 w-full bg-black text-[14px] font-semibold tracking-[0.7px] text-white hover:bg-gray-900 transition-colors disabled:opacity-50">
              {isProcessing ? "PROCESSING..." : "PAY SECURELY VIA RAZORPAY"}
            </button>
          </div>

          {/* Right Column - Summary */}
          <aside className="bg-gray-50 p-6 h-fit sticky top-24">
            <h2 className="mb-6 text-[14px] font-semibold uppercase tracking-[0.7px]">ORDER SUMMARY</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="flex gap-4">
                  <div className="relative size-[64px] shrink-0 bg-white border border-black/10">
                    <Image src={resolveImage(item.imageUrl)} alt={item.title} fill className="object-cover" />
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-black/60 text-[10px] text-white">
                      {item.quantity || 1}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 text-[12px]">
                    <p className="font-semibold">{item.designerName}</p>
                    <p className="mt-0.5 text-gray truncate">{item.title}</p>
                    <p className="mt-1 text-[10px]">Size: {item.size}</p>
                  </div>
                  <div className="text-right text-[12px] font-semibold">
                    {formatPrice(item.price)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/20 pt-4 space-y-2 text-[13px]">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(summary.subtotal)}</span></div>
              {summary.discount > 0 && <div className="flex justify-between text-sale"><span>Discount</span><span>(-) {formatPrice(summary.discount)}</span></div>}
              <div className="flex justify-between"><span>Shipping</span><span>{summary.shipping === 0 ? "Free" : formatPrice(summary.shipping)}</span></div>
            </div>

            <div className="mt-4 border-t border-black/20 pt-4 flex justify-between items-center text-[16px] font-semibold">
              <span>Total</span>
              <span>{formatPrice(summary.total)}</span>
            </div>
            
            <Link href="/cart" className="mt-6 inline-block text-[12px] text-gray underline">
              Return to Cart
            </Link>
          </aside>
        </div>
      </ContentContainer>
    </PageShell>
  );
}
