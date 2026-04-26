"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { vendorsAPI, productsAPI } from "@/lib/api";
import ProductDetailPage from "@/app/product/[id]/page";

export default function VendorProductClient({ lang = "en", vendorSlug, productSlug, dict }) {
  const p = dict?.product || {};
  const [productId, setProductId] = useState(null);
  const [error, setError]         = useState(false);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!vendorSlug || !productSlug) {
      setError(true);
      setLoading(false);
      return;
    }

    vendorsAPI.getBySlug(vendorSlug)
      .then(vRes => {
        const vendorId = vRes?.data?.id;
        if (!vendorId) throw new Error("vendor not found");
        return productsAPI.getBySlug(vendorId, productSlug);
      })
      .then(pRes => {
        const id = pRes?.data?.id;
        if (id) setProductId(id);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [vendorSlug, productSlug, lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-9 h-9 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-surface-400">{p.loading || "Loading product…"}</p>
        </div>
      </div>
    );
  }

  if (error || !productId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <Search size={40} className="text-surface-300 mx-auto mb-4" />
          <p className="text-lg font-semibold text-surface-700 mb-2">{p.notFound || "Product not found"}</p>
          <p className="text-sm text-surface-400">{p.notFoundDesc || "This product may have been removed or doesn't exist."}</p>
        </div>
      </div>
    );
  }

  return <ProductDetailPage productId={productId} lang={lang} dict={dict} />;
}
