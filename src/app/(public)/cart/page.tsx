"use client";

import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Cart is Empty</h1>
        <p className="mt-4 text-muted-foreground">It seems you haven't added any artifacts to your cart yet.</p>
        <Button asChild className="mt-8">
          <Link href="/shop">Explore Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section aria-labelledby="cart-heading" className="lg:col-span-7">
          <h2 id="cart-heading" className="sr-only">Items in your shopping cart</h2>
          <ul role="list" className="divide-y divide-border border-b border-t border-border">
            {items.map((item) => (
              <li key={item.product.id} className="flex py-6 sm:py-10">
                <div className="flex-shrink-0 relative h-24 w-24 rounded-md border border-border bg-muted overflow-hidden sm:h-32 sm:w-32">
                  {item.product.thumbnail && (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.name}
                      fill
                      className="object-cover object-center"
                    />
                  )}
                </div>

                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-sm">
                          <Link href={`/products/${item.product.slug}`} className="font-medium text-foreground hover:text-primary">
                            {item.product.name}
                          </Link>
                        </h3>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.product.status === 'PRE_ORDER' ? 'Pre-Order' : 'In Stock'}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{formatPrice(item.product.price, item.product.currency)}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 sm:pr-9">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="rounded-md border p-1 hover:bg-muted"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="rounded-md border p-1 hover:bg-muted"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="absolute right-0 top-0">
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="-m-2 inline-flex p-2 text-muted-foreground hover:text-destructive"
                        >
                          <span className="sr-only">Remove</span>
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section aria-labelledby="summary-heading" className="mt-16 rounded-2xl bg-card border border-border px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
          <h2 id="summary-heading" className="text-lg font-medium text-foreground">Order summary</h2>
          <dl className="mt-6 space-y-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <dt>Subtotal</dt>
              <dd className="font-medium text-foreground">{formatPrice(getTotal())}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4">
              <dt className="flex items-center text-sm">
                <span>Shipping estimate</span>
              </dt>
              <dd className="font-medium text-foreground">Calculated at checkout</dd>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-4 text-base font-medium text-foreground">
              <dt>Order total</dt>
              <dd>{formatPrice(getTotal())}</dd>
            </div>
          </dl>

          <div className="mt-6">
            <Button asChild className="w-full" size="lg">
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
