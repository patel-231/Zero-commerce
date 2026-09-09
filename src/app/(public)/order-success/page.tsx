"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <div className="rounded-full bg-green-100 p-3 mb-6">
        <CheckCircle2 className="h-12 w-12 text-green-600" />
      </div>
      
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Order Placed Successfully</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Thank you for your order. We are preparing it for shipment.
      </p>
      
      {orderId && (
        <div className="mt-8 bg-muted/50 rounded-2xl p-6 border border-border w-full">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">Order Reference</p>
          <p className="text-xl font-mono">{orderId}</p>
        </div>
      )}

      <div className="mt-12 flex gap-4">
        <Button asChild size="lg">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
