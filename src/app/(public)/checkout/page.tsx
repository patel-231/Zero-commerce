"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        customerInformation: formData,
        items: items.map(i => ({
          productId: i.product.id,
          name: i.product.name,
          price: i.product.price,
          quantity: i.quantity,
          status: i.product.status
        })),
        subtotal: getTotal(),
        total: getTotal(),
        currency: "USD",
        paymentStatus: "PENDING", // This architecture supports a PaymentProvider later
        orderStatus: "PENDING",
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // Normally here you'd redirect to Stripe/Razorpay
      // For this implementation, we simulate success and go to order-success
      
      clearCart();
      router.push(`/order-success?id=${docRef.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">You need items in your cart to checkout.</p>
        <Button onClick={() => router.push("/shop")} className="mt-8">Return to Shop</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16">
        <form onSubmit={handleCheckout} className="lg:col-span-7 space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email address</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">Shipping Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Address</label>
                <input required name="address" value={formData.address} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input required name="city" value={formData.city} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">State / Province</label>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal code</label>
                <input required name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select required name="country" value={formData.country} onChange={handleChange} className="w-full rounded-md border px-3 py-2 bg-background">
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="IN">India</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </section>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Confirm Order"}
          </Button>
        </form>

        <section className="mt-16 lg:col-span-5 lg:mt-0">
          <div className="bg-muted/50 rounded-2xl p-6 border border-border sticky top-24">
            <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
            
            <ul className="divide-y divide-border border-t border-b border-border py-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex py-4">
                  <div className="h-16 w-16 relative bg-card rounded-md border overflow-hidden">
                    {item.product.thumbnail && <Image src={item.product.thumbnail} alt="" fill className="object-cover" />}
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-sm font-medium text-foreground">
                      <h3>{item.product.name}</h3>
                      <p>{formatPrice(item.product.price, item.product.currency)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">Qty {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>
            
            <dl className="space-y-4 pt-6 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-foreground">{formatPrice(getTotal())}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="font-medium text-foreground">Free</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-4 text-base font-medium text-foreground">
                <dt>Total</dt>
                <dd>{formatPrice(getTotal())}</dd>
              </div>
            </dl>
          </div>
        </section>
      </div>
    </div>
  );
}
