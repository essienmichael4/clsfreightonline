import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';
import { axios_instance } from '@/api/axios';
import { StoreProduct } from '@/lib/types';


const PLACEHOLDER = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWn1cm5iKDwoz3BjeIreWCA3-YvwJs0O6CQyreUydBR6Gi1xGPojRKEZEUFz_WcsSGW2fqkXobRC1NvAtS6ep6jHrbEXNCkVA7skge5JJzODWxF48abq91w3kXnU0Lq-qVBvIBInvZ7SIikCDo6qnmv8RxVzfvF9KqrDu0DA6BZTEQE2d2_pu_qLwnkqFVXpZTfD1sOMHWEVa9AuQSyZO3gx-UdlloBdcnkqwPY4LIlMg-avqQghY1Yeg0iV9-izaBDa7L6mDCD7cF';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [apiProduct, setApiProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    axios_instance.get(`/stores/${productId}`)
      .then(res => {
        console.log("Product detail response:", res.data);
        const data = res.data?.data ?? res.data;
        setApiProduct(data);
      })
      .catch(err => {
        console.error("Product detail error:", err?.response?.status, err?.response?.data ?? err.message);
        setApiProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    axios_instance.get('/stores/products')
      .then(res => {
        const data = res.data?.data ?? res.data;
        const all: StoreProduct[] = Array.isArray(data) ? data : [];
        setRelatedProducts(all.filter(p => p.productId !== productId && String(p.id) !== productId));
      })
      .catch(() => setRelatedProducts([]));
  }, [productId]);

  const product = {
    id: apiProduct?.id ?? productId,
    series: apiProduct?.category ?? 'Collection',
    name: apiProduct?.name ?? 'Loading...',
    price: apiProduct?.price ?? 0,
    image: apiProduct?.imageUrls?.[0] ?? PLACEHOLDER,
    detailImage1: apiProduct?.imageUrls?.[1] ?? undefined,
    detailImage2: apiProduct?.imageUrls?.[2] ?? undefined,
    description: apiProduct?.description ?? '',
    tags: [] as string[],
  };


  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the following product:\n\nProduct: ${product.name}\nPrice: GHS ${Number(product.price).toFixed(2)}\n\nCould you provide more details?`;
    window.open(`https://api.whatsapp.com/send/?phone=233503333889&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`, '_blank');
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground font-body min-h-screen">
      <main className="pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-12 flex items-center gap-2 text-muted-foreground opacity-60 text-sm">
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/')}>
            Home
          </span>
          <ChevronRight size={16} />
          <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/shop')}>
            Shop
          </span>
          <ChevronRight size={16} />
          <span className="text-foreground font-semibold">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Product Image Gallery */}
          <div className="lg:col-span-7 grid grid-cols-6 gap-4">
            {/* Main Image */}
            <div className="col-span-6 rounded-xl overflow-hidden aspect-[4/3] bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Detail Images (render only when present) */}
            {product.detailImage1 && (
              <div className="col-span-3 rounded-lg overflow-hidden aspect-square bg-muted">
                <img
                  src={product.detailImage1}
                  alt="Product detail 1"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {product.detailImage2 && (
              <div className="col-span-3 rounded-lg overflow-hidden aspect-square bg-muted">
                <img
                  src={product.detailImage2}
                  alt="Product detail 2"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          {/* Product Content */}
          <div className="lg:col-span-5 flex flex-col gap-8 sticky top-32">
            {/* Product Info */}
            <div>
              <span className="text-primary font-semibold tracking-widest text-xs uppercase mb-4 block">
                {product.series}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground -tracking-tight leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-light text-muted-foreground">GHS {Number(product.price).toFixed(2)}</p>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Interactive Elements */}
            <div className="pt-6 space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-col gap-4">
                <Button
                  onClick={handleWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20ba5c] text-white py-5 rounded-lg font-bold tracking-wide flex justify-center items-center gap-3 w-full"
                >
                  <MessageCircle size={20} />
                  Chat on WhatsApp
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex justify-between items-end mb-12">
              <div className="max-w-xl">
                <span className="text-primary font-bold text-sm tracking-widest uppercase">
                  The Curated Collection
                </span>
                <h2 className="text-3xl font-bold mt-2">Related Products</h2>
              </div>
              <button
                onClick={() => navigate('/shop')}
                className="text-primary font-semibold flex items-center gap-2 hover:gap-4 transition-all duration-300"
              >
                View All <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => navigate(`/product/${item.productId ?? item.id}`)}
                >
                  <div className="w-full h-64 overflow-hidden rounded-lg bg-muted mb-4 relative">
                    <img
                      src={item.imageUrls?.[0] ?? PLACEHOLDER}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  {item.category && (
                    <p className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1">
                      {item.category}
                    </p>
                  )}
                  <h3 className="text-sm font-bold group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">GHS {Number(item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
