"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { ProductStatus } from "@/types/status";
import { db, storage } from "@/lib/firebase/client";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Button } from "@/components/ui/Button";

interface ProductFormProps {
  initialData?: Product;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [formData, setFormData] = useState<Partial<Product>>(initialData || {
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    price: 0,
    compareAtPrice: 0,
    currency: "USD",
    status: "COMING_SOON",
    categoryId: "uncategorized",
    images: [],
    thumbnail: "",
    stock: 0,
    sku: "",
    featured: false,
    isActive: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(Array.from(e.target.files));
    }
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return formData.images || [];
    setUploadingImages(true);
    const urls: string[] = [];
    
    for (const file of imageFiles) {
      const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    
    setUploadingImages(false);
    return [...(formData.images || []), ...urls];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = await uploadImages();
      
      const productData = {
        ...formData,
        images: imageUrls,
        thumbnail: formData.thumbnail || imageUrls[0] || "",
        updatedAt: serverTimestamp(),
      };

      if (initialData?.id) {
        await updateDoc(doc(db, "products", initialData.id), productData);
      } else {
        productData.createdAt = serverTimestamp() as any;
        await addDoc(collection(db, "products"), productData);
      }
      
      router.push("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Name</label>
            <input 
              required
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input 
              required
              name="slug" 
              value={formData.slug} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2 bg-background"
            >
              <option value="COMING_SOON">Coming Soon</option>
              <option value="PROTOTYPE">Prototype</option>
              <option value="PRE_ORDER">Pre-Order</option>
              <option value="AVAILABLE">Available</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input 
                type="number"
                required
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                className="w-full rounded-md border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Compare-at Price</label>
              <input 
                type="number"
                name="compareAtPrice" 
                value={formData.compareAtPrice} 
                onChange={handleChange} 
                className="w-full rounded-md border px-3 py-2" 
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Short Description</label>
            <textarea 
              name="shortDescription" 
              value={formData.shortDescription} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2 min-h-[80px]" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Description</label>
            <textarea 
              required
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className="w-full rounded-md border px-3 py-2 min-h-[120px]" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input 
                type="number"
                name="stock" 
                value={formData.stock} 
                onChange={handleChange} 
                className="w-full rounded-md border px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">SKU</label>
              <input 
                name="sku" 
                value={formData.sku} 
                onChange={handleChange} 
                className="w-full rounded-md border px-3 py-2" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium">Images</h3>
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*"
            onChange={handleImageChange}
            className="w-full" 
          />
        </div>
        {formData.images && formData.images.length > 0 && (
          <div className="flex gap-4 overflow-x-auto py-2">
            {formData.images.map((url, i) => (
              <img key={i} src={url} alt="Product" className="h-24 w-24 object-cover rounded-md border" />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="featured" 
            id="featured"
            checked={formData.featured} 
            onChange={handleChange} 
            className="rounded border-gray-300" 
          />
          <label htmlFor="featured" className="text-sm font-medium">Featured Product</label>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            name="isActive" 
            id="isActive"
            checked={formData.isActive} 
            onChange={handleChange} 
            className="rounded border-gray-300" 
          />
          <label htmlFor="isActive" className="text-sm font-medium">Active (Visible)</label>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit" disabled={loading || uploadingImages}>
          {loading || uploadingImages ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </form>
  );
}
