import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ImageOff,
} from 'lucide-react';
import Footer from '@/components/Footer';
import { axios_instance } from '@/api/axios';
import { StoreProduct } from '@/lib/types';

const Shop = () => {
  const navigate = useNavigate();

  const [apiProducts, setApiProducts] = useState<StoreProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    axios_instance.get('/stores/products', { params: { status: 'active' } })
      .then(res => {
        const data = res.data?.data ?? res.data;
        const arr = Array.isArray(data) ? data : [];
        console.log("Shop products:", arr.map((p: any) => ({ id: p.id, name: p.name, status: p.status })));
        setApiProducts(arr);
      })
      .catch(() => setApiProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <main className="pb-20">
        {/* More to Love Section */}
        <section className="mt-8 px-8 md:px-16">
          {/* Section Header */}
          <div className="flex flex-col items-center text-center mb-10">
            {/* <span className="text-xs font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">CLS Freight Online</span> */}
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground uppercase mb-3">
              Pre-Order Marketplace
            </h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="block h-px w-12 bg-red-500 opacity-60" />
              <span className="block h-1.5 w-1.5 rounded-full bg-red-500" />
              <span className="block h-px w-12 bg-red-500 opacity-60" />
            </div>
            <h5 className="text-sm md:text-base font-medium text-muted-foreground max-w-md leading-relaxed">
              All-Inclusive Deals &mdash; <span className="text-foreground font-semibold">Costs + Shipping + Customs Duties</span>
            </h5>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {loadingProducts ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-border">
                  <div className="w-full aspect-square bg-muted" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-full" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))
            ) : apiProducts.length > 0 ? (
              apiProducts.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => navigate(`/product/${item.productId ?? item.id}`)}
              >
                <div className="relative w-full aspect-square overflow-hidden bg-muted">
                  {item.imageUrls?.[0] ? (
                    <img
                      src={item.imageUrls[0]}
                      alt={item.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground/30">
                      <ImageOff size={32} strokeWidth={1.5} />
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute bottom-2 right-2 bg-white text-foreground p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>
                <div className="p-3 space-y-1">
                  <p className="text-xs text-foreground font-medium leading-snug line-clamp-2">{item.name}</p>
                  <span className="text-sm font-bold text-red-500">GHS {Number(item.price).toFixed(2)}</span>
                </div>
              </div>
            ))
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
