"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts, getProductsByStatus } from "@/lib/firebase/firestore";
import { Product } from "@/types/product";

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [prototypes, setPrototypes] = useState<Product[]>([]);
  const [preOrders, setPreOrders] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [fProducts, pProducts, poProducts] = await Promise.all([
          getFeaturedProducts(4),
          getProductsByStatus('PROTOTYPE', 4),
          getProductsByStatus('PRE_ORDER', 4),
        ]);
        setFeatured(fProducts);
        setPrototypes(pProducts);
        setPreOrders(poProducts);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-background px-4 py-24 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.05]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 flex max-w-4xl flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="mr-2 h-4 w-4" />
            <span className="tracking-tight">The Future of Tech is Here</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tighter sm:text-7xl">
            Engineer the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">Impossible.</span>
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Explore our curated selection of bleeding-edge prototypes, exclusive pre-orders, and premium technological artifacts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" asChild>
              <Link href="/shop">
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/prototypes">View Prototypes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <ProductSection 
        title="Featured Artifacts" 
        description="Our most sought-after technological achievements."
        products={featured} 
        loading={loading}
        viewAllLink="/shop"
      />

      {/* Prototypes */}
      <ProductSection 
        title="In Development: Prototypes" 
        description="Get an exclusive look at the bleeding edge of our R&D."
        products={prototypes} 
        loading={loading}
        viewAllLink="/prototypes"
      />

      {/* Pre-Orders */}
      <ProductSection 
        title="Reserve Yours: Pre-Orders" 
        description="Secure your access before they launch."
        products={preOrders} 
        loading={loading}
        viewAllLink="/pre-orders"
      />
    </div>
  );
}

function ProductSection({ title, description, products, loading, viewAllLink }: { title: string, description: string, products: Product[], loading: boolean, viewAllLink: string }) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-border/50">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" asChild className="hidden md:inline-flex shrink-0">
          <Link href={viewAllLink}>View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-muted rounded-2xl h-96 w-full" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-muted/30 rounded-3xl border border-dashed border-border">
          <Sparkles className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold tracking-tight">Accessing Archives</h3>
          <p className="mt-2 text-muted-foreground">New artifacts will appear here soon.</p>
        </div>
      )}
      
      <Button variant="outline" asChild className="w-full mt-8 md:hidden">
        <Link href={viewAllLink}>View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </section>
  );
}

