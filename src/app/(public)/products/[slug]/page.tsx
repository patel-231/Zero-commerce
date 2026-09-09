"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/lib/firebase/firestore";
import { Product } from "@/types/product";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import Image from "next/image";
import { Heart, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        const p = await getProductBySlug(slug);
        if (p) {
          setProduct(p);
          if (p.images && p.images.length > 0) {
            setActiveImage(p.images[0]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    if (slug) loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="animate-pulse flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 aspect-square bg-muted rounded-2xl" />
          <div className="w-full md:w-1/2 space-y-4">
            <div className="h-10 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/4" />
            <div className="h-32 bg-muted rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Artifact Not Found</h1>
        <p className="mt-4 text-muted-foreground">The requested product could not be located in our archives.</p>
        <Button asChild className="mt-8">
          <Link href="/shop">Return to Shop</Link>
        </Button>
      </div>
    );
  }

  const isBuyable = product.status === 'AVAILABLE' || product.status === 'PRE_ORDER';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to collection
      </Link>

      <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12 xl:gap-x-16">
        {/* Image gallery */}
        <div className="flex flex-col-reverse">
          <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(image)}
                  className={`relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${activeImage === image ? 'ring-2 ring-primary' : 'ring-transparent'}`}
                >
                  <span className="absolute inset-0 overflow-hidden rounded-md bg-muted">
                    <Image src={image} alt="" fill className="object-cover object-center" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="aspect-square w-full relative overflow-hidden rounded-2xl bg-muted border border-border">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                className="object-cover object-center"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">No image available</div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="mt-10 px-4 sm:px-0 lg:mt-0">
          <div className="mb-4">
            <StatusBadge status={product.status} />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
          
          <div className="mt-3 flex items-end gap-4">
            <p className="text-3xl font-semibold tracking-tight text-foreground">
              {formatPrice(product.price, product.currency)}
            </p>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <p className="text-xl text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </p>
            )}
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-muted-foreground">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="mt-10 flex">
            {isBuyable ? (
              <Button onClick={() => addItem(product, 1)} size="lg" className="flex-1 rounded-full">
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.status === 'PRE_ORDER' ? 'Pre-Order Now' : 'Add to Cart'}
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="flex-1 rounded-full">
                Notify Me When Available
              </Button>
            )}
            <Button variant="outline" size="icon" className="ml-4 flex-shrink-0 rounded-full h-11 w-11">
              <Heart className="h-5 w-5" />
            </Button>
          </div>

          {/* Details */}
          <div className="mt-10 border-t border-border pt-8">
            <h3 className="text-sm font-medium text-foreground">Specifications</h3>
            <div className="mt-4 prose prose-sm text-muted-foreground">
              <ul role="list">
                <li>SKU: {product.sku || 'N/A'}</li>
                <li>Stock Status: {product.stock > 0 ? `${product.stock} units available` : 'Out of stock'}</li>
                <li>Category: {product.categoryId}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
