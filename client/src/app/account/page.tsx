"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/templates/page-shell";
import { PageHeader } from "@/components/page-chrome";
import { useAuth } from "@/components/providers/auth-provider";

export default function AccountPage() {
  const { user, loading, signOut, openAuth, firebaseUser } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (loading) return;
    if (user) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop) {
      openAuth("login");
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [user, loading, openAuth, router]);

  useEffect(() => {
    if (!user || !firebaseUser) return;
    const fetchOrders = async () => {
       try {
         const token = await firebaseUser.getIdToken();
         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/orders?mobile=${encodeURIComponent(user.mobile || "")}&email=${encodeURIComponent(user.email || "")}`, {
           headers: { Authorization: `Bearer ${token}` }
         });
         if (res.ok) {
           setOrders(await res.json());
         }
       } catch (err) {
         console.error(err);
       }
    };
    fetchOrders();
  }, [user, firebaseUser]);

  if (!user) return null;

  return (
    <FormPageLayout>
      <PageHeader title="MY ACCOUNT" subtitle="Manage your profile and view order history." />
      <div className="grid md:grid-cols-2 gap-10">
        <form className="space-y-4 h-fit" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-[14px] font-semibold uppercase">Profile Settings</h2>
          <label className="block text-[13px] font-semibold">Full Name<input defaultValue={user.fullName || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
          <label className="block text-[13px] font-semibold">Email<input type="email" defaultValue={user.email || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
          <label className="block text-[13px] font-semibold">Mobile<input type="tel" defaultValue={user.mobile || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
          <button type="submit" className="h-11 w-full border border-black bg-black text-[13px] font-semibold text-white">SAVE CHANGES</button>
          <button type="button" onClick={() => signOut()} className="h-11 w-full border border-black bg-white text-[13px] font-semibold">LOG OUT</button>
        </form>

        <div className="space-y-4">
          <h2 className="text-[14px] font-semibold uppercase">Order History</h2>
          {orders.length === 0 ? (
            <p className="text-[13px] text-gray">No orders placed yet.</p>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
              {orders.map((order) => (
                <div key={order._id} className="border border-black/20 p-4 space-y-2">
                  <div className="flex justify-between text-[13px] font-semibold">
                    <span>{order.orderNumber}</span>
                    <span>₹{order.total?.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-[12px] text-gray flex justify-between">
                    <span>{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                    <span className="uppercase text-black">{order.status}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-black/10 text-[12px]">
                    {order.items?.map((item: any, i: number) => (
                      <p key={i}>- {item.quantity}x {item.productTitle} ({item.size})</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </FormPageLayout>
  );
}
