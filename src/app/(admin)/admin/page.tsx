"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, count } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Clock, 
  Tag 
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    availableProducts: 0,
    comingSoon: 0,
    prototypes: 0,
    preOrders: 0,
    outOfStock: 0,
    totalOrders: 0,
    revenue: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const productsRef = collection(db, "products");
        const productsSnap = await getDocs(productsRef);
        
        let available = 0;
        let comingSoon = 0;
        let prototypes = 0;
        let preOrders = 0;
        let outOfStock = 0;
        
        productsSnap.forEach(doc => {
          const data = doc.data();
          if (data.status === 'AVAILABLE') available++;
          if (data.status === 'COMING_SOON') comingSoon++;
          if (data.status === 'PROTOTYPE') prototypes++;
          if (data.status === 'PRE_ORDER') preOrders++;
          if (data.status === 'OUT_OF_STOCK') outOfStock++;
        });

        // Orders mockup for stats since we might not have them yet
        const ordersRef = collection(db, "orders");
        const ordersSnap = await getDocs(ordersRef);
        let revenue = 0;
        ordersSnap.forEach(doc => {
          revenue += doc.data().total || 0;
        });

        setStats({
          totalProducts: productsSnap.size,
          availableProducts: available,
          comingSoon,
          prototypes,
          preOrders,
          outOfStock,
          totalOrders: ordersSnap.size,
          revenue,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { name: "Total Products", value: stats.totalProducts, icon: Package },
    { name: "Available", value: stats.availableProducts, icon: Tag },
    { name: "Coming Soon", value: stats.comingSoon, icon: Clock },
    { name: "Prototypes", value: stats.prototypes, icon: Package },
    { name: "Pre-Orders", value: stats.preOrders, icon: ShoppingCart },
    { name: "Out of Stock", value: stats.outOfStock, icon: Package },
    { name: "Total Orders", value: stats.totalOrders, icon: ShoppingCart },
    { name: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store's performance.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.name} className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-3">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
