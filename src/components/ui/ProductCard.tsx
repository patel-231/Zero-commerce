import Link from "next/link";
import { Product } from "@/types/product";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./Button";
import { Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  
  const handlePrimaryAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.status === 'AVAILABLE' || product.status === 'PRE_ORDER') {
      addItem(product, 1);
    }
  };

  const getPrimaryButtonText = () => {
    switch (product.status) {
      case 'AVAILABLE': return 'Add to Cart';
      case 'PRE_ORDER': return 'Pre-Order Now';
      case 'COMING_SOON': return 'Notify Me';
      case 'OUT_OF_STOCK': return 'Notify Me';
      case 'PROTOTYPE': return 'View Details';
      case 'DISCONTINUED': return 'View Details';
      default: return 'View Details';
    }
  };

  const isBuyable = product.status === 'AVAILABLE' || product.status === 'PRE_ORDER';

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-secondary-foreground">
            No image
          </div>
        )}
        <div className="absolute top-4 left-4 z-10">
          <StatusBadge status={product.status} />
        </div>
        <button 
          className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background hover:text-red-500 transition-colors shadow-sm"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Implement Wishlist toggle
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-1">{product.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.shortDescription || product.description}
        </p>
        
        <div className="mt-4 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">
              {formatPrice(product.price, product.currency)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice, product.currency)}
              </span>
            )}
          </div>
          
          <Button 
            variant={isBuyable ? "default" : "secondary"} 
            size="sm"
            onClick={handlePrimaryAction}
          >
            {getPrimaryButtonText()}
          </Button>
        </div>
      </div>
    </Link>
  );
}
