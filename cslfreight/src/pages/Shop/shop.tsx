import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
} from 'lucide-react';
import Footer from '@/components/Footer';
import { axios_instance } from '@/api/axios';
import { StoreProduct } from '@/lib/types';



interface FeaturedCollection {
  id: number;
  title: string;
  image: string;
  featured?: boolean;
}

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

  const featuredCollections: FeaturedCollection[] = [
    {
      id: 1,
      title: 'Premium Shipping Solutions',
      image: '/banner-main.jpg',
      featured: true,
    },
    {
      id: 2,
      title: 'Sculptural Form',
      image: '/banner-2.jpg',
    },
    {
      id: 3,
      title: 'Deep Archive',
      image: '/banner-3.jpg',
    },
  ];

  const PLACEHOLDER_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo';









  const categories = [...new Set(apiProducts.map(p => p.category ?? 'GENERAL'))]
    .sort()
    .filter(cat => cat !== 'GENERAL');



  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <main className="pb-20">
        {/* Editorial Grid Section */}
        <section className="px-8 md:px-16 space-y-32">
          {/* Bento Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
            {/* Featured Large Card */}
            <div className="md:col-span-7 relative group overflow-hidden rounded-lg bg-muted">
              <img
                src={featuredCollections[0].image}
                alt={featuredCollections[0].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent"></div>
              <div className="absolute bottom-8 left-8 text-card">
                <span className="bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-2 inline-block">
                  Featured
                </span>
                <h3 className="text-4xl font-bold">
                  {featuredCollections[0].title}
                </h3>
              </div>
            </div>

            {/* Right Side Grid */}
            <div className="md:col-span-5 grid grid-rows-2 gap-6">
              {featuredCollections.slice(1).map(collection => (
                <div
                  key={collection.id}
                  className="relative group overflow-hidden rounded-lg bg-muted cursor-pointer"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors"></div>
                  <div className="absolute bottom-6 left-6 text-card">
                    <h3 className="text-2xl font-headline font-bold">
                      {collection.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shop by Category Section */}
          <div>
            <h2 className="text-2xl font-bold text-center mb-8">Shop by category</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Featured Banner */}
              <div className="lg:col-span-3 bg-sky-200 rounded-xl overflow-hidden relative min-h-[420px] flex flex-col justify-between p-8">
                <div className="z-10 relative">
                  <p className="text-2xl font-bold italic font-serif">CSL Freight</p>
                  <p className="text-sm mt-1 text-foreground/70">Your shipping choice</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="mt-4 bg-foreground text-background px-5 py-2 rounded-md text-sm font-bold hover:bg-foreground/80 transition-colors"
                  >
                    Shop now
                  </button>
                </div>
                {/* Product thumbnails at bottom */}
                <div className="flex gap-3 mt-6 z-10 relative">
                  {apiProducts.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex-1 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate(`/product/${item.productId ?? item.id}`)}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={item.imageUrls?.[0] ?? PLACEHOLDER_IMAGE}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold">GHS {Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Category Grid */}
              <div className="grid grid-cols-2 gap-3 auto-rows-[140px]">
                {categories.slice(0, 6).map((cat) => {
                  const firstProduct = apiProducts.find(p => p.category === cat);
                  const img = firstProduct?.imageUrls?.[0] ?? PLACEHOLDER_IMAGE;
                  return (
                    <div
                      key={cat}
                      className="bg-muted rounded-xl flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden relative group h-full"
                      onClick={() => navigate(`/shop?category=${encodeURIComponent(cat)}`)}
                    >
                      <p className="text-sm font-bold text-foreground z-10 relative max-w-[55%] leading-snug">{cat}</p>
                      <img
                        src={img}
                        alt={cat}
                        className="h-20 w-20 object-cover rounded-md group-hover:scale-105 transition-transform duration-500 flex-shrink-0"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* More to Love Section */}
        <section className="mt-20 px-8 md:px-16">
          <h2 className="text-2xl font-bold text-center mb-8">More to love</h2>
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
