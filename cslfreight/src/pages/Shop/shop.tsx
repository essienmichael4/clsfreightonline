import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
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



  const PLACEHOLDER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo';








  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <main className="pb-20">
        {/* More to Love Section */}
        <section className="mt-20 px-8 md:px-16">
          {/* <h2 className="text-2xl font-bold text-center mb-8">More to love</h2> */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingProducts ? (
              Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse rounded-xl overflow-hidden border border-border">
                  <div className="w-full h-44 bg-muted" />
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
                <div className="relative w-full h-44 overflow-hidden bg-muted">
                  <img
                    src={item.imageUrls?.[0] ?? PLACEHOLDER_IMAGE}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
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
