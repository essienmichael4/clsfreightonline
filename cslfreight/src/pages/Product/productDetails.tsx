import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  ChevronRight,
  ShoppingBag,
  User,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

interface RelatedProduct {
  id: number;
  title: string;
  image: string;
  price?: number;
  category?: string;
  description?: string;
  layout: 'large' | 'split' | 'small' | 'cta';
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  // Scroll to top on component mount or when productId changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  // Sample product data - in real app, fetch from API based on productId
  const product = {
    id: productId || 1,
    series: 'Handcrafted Series 01',
    name: 'The Lunar Vessel',
    price: 480,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWn1cm5iKDwoz3BjeIreWCA3-YvwJs0O6CQyreUydBR6Gi1xGPojRKEZEUFz_WcsSGW2fqkXobRC1NvAtS6ep6jHrbEXNCkVA7skge5JJzODWxF48abq91w3kXnU0Lq-qVBvIBInvZ7SIikCDo6qnmv8RxVzfvF9KqrDu0DA6BZTEQE2d2_pu_qLwnkqFVXpZTfD1sOMHWEVa9AuQSyZO3gx-UdlloBdcnkqwPY4LIlMg-avqQghY1Yeg0iV9-izaBDa7L6mDCD7cF',
    detailImage1:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBwDuP9L-j2JsJIFMN7aU1SKGq3-JKF-Dc9DthgYAoEdq6m1aLfJHGiYBeqEe2l4UToPTHLGWH6oEtw8a1Eh7_e3hxNQcccv2QmN1lHWSOQk0-Irn5GaVpT1aG4Mw9iswezkgul6FU8mVNRw7IAqnaJ3ittp4uzbwEm0PxvsraPTjgfhyqkSMoJbRbC-MmJ78WIqF38usPLWH9T5Kt6gaYadqvVYs9nutCQsoA2qyZ4MLGPDm9q16PxTF_HUAyKYl5bmO0aLmqi4Iwi',
    detailImage2:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCQh0H-PP9NzNXzR0KUvV_8BHA-ZXlmv1bNTsc0yQUYPxvulOBFVpXfAnFmwrO0oEKjV_SM3Uhun_LcnM5rCNs2nzVMQYp4xuAj40AcNJLE5AqcMbvRegpFXsuesww8EmgEyQvj1wBQakgaaLePtXWw-8LxJ2Ni2QoQt3nUdBkvP2Zfif9BHTq8OTXT2lIlUlMWP8cdilHMQG7tT_o6VY6MIBoky69UVJbYGaewTMSaW8XN5PmCG6dq_9pss3xWm2kDgD5cs9qgiAU',
    description:
      'A celebration of imperfection and the passage of time. Each Lunar Vessel is wheel-thrown from raw obsidian clay and finished with a reactive glaze that mimics the lunar surface. No two pieces are identical, offering a unique narrative for your interior space.',
    tags: ['Limited Edition', 'Eco-Conscious Packaging'],
    textures: [
      { name: 'Dark Matte', color: '#1c2024' },
      { name: 'Light Grey', color: '#d6dadf' },
      { name: 'Off White', color: '#f0f4f9' },
    ],
    dimensions: 'H: 24cm × W: 18cm',
    materials: 'Obsidian Clay, Matte Glaze',
  };

  const relatedProducts: RelatedProduct[] = [
    {
      id: 2,
      title: 'Horizon Bowls',
      category: 'Kitchen Series',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCMXknsdrtRKFE9RdI43jdGbKe-3jI25zPd1gCu3wqeI0CWgl9YrMekEnPbI9b-zjhExx2KNt-QirMsun3lM-RIrWS9lJB_1AMve1s13uTYVb5iXnWDcUeGoz-mikbhfTyns9QngUYEuBlFiTfpaxoQGVUNQ-jL6CnxtyKIcWUa0xARSViXP1O_5lEDtLvfVIOUszHlULJ-IJHlzXRM9jn4qtlUCn9oPtYxujGSvBA_rON5DAlJsnUazxzvBSDgD6m5YyqtVvp9f7Vk',
      price: 210,
      layout: 'large',
    },
    {
      id: 3,
      title: 'Flow Pitcher',
      category: 'New Arrival',
      description: 'Sculptural utility for modern dining.',
      price: 185,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAiKIcHIIhZYqAxOJb9fxYDoXUeJDX7MkitAL2oJbwGHNypFaOKnNKwX_XMJjMk31gUhTgRJMz9C_7juYxTFU9CaJANfVk8ZFnNLyNL-v3Qe6XoK-iQUKczSONJRNmL0-hI41PEu2ZbZbmejcdMuK1u8xNn2c62kr-sbWn1bXytP-MDiphDKcRCkyr-37Y3pIoVOAVl7-o3dEJfnzY5Ykey2DJKxH30b-wgBqmEzAiLBe73NGjkugPZzXr5yyQ9srqpK_2wbGwOAsog',
      layout: 'split',
    },
    {
      id: 4,
      title: 'Echo Incense',
      price: 45,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAp2TC8KLuvzvXGvtX9p9aUHq-miUe5nI4yAqp4Kw-qejxERHi1IEsrsTIrFHfgzKLJy8FyFbbGxz5qR7ZwTB24vWdWTjsexxqq7tQjjR51d5PdVdGauNNJztUvlcLM9ROHwf8nbIJRbeZAWEohDdZ93SFQNFqMkiIRFUz6hgBriiUwomst5g7NMNr-gviGu7bNX6Q3RL161fGn3vHTbIpGVQPNVfBFZioLeV8YGapxUI3lGNcut9XXZHez29OyoqTzXcdDESaHHdE5',
      layout: 'small',
    },
  ];

  const handleWhatsApp = () => {
    const message = `I'm interested in ${product.name} (${product.series})`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRelatedProduct = (id: number) => {
    if (id !== parseInt(productId || '1')) {
      navigate(`/product/${id}`);
    }
  };

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
            <div className="col-span-6 rounded-xl overflow-hidden aspect-[4/5] bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detail Images */}
            <div className="col-span-3 rounded-lg overflow-hidden aspect-square bg-muted">
              <img
                src={product.detailImage1}
                alt="Product detail 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-3 rounded-lg overflow-hidden aspect-square bg-muted translate-y-8">
              <img
                src={product.detailImage2}
                alt="Product detail 2"
                className="w-full h-full object-cover"
              />
            </div>
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
              <p className="text-2xl font-light text-muted-foreground">${product.price.toFixed(2)}</p>
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
        <section className="mt-32">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <span className="text-primary font-bold text-sm tracking-widest uppercase">
                The Curated Collection
              </span>
              <h2 className="text-3xl font-bold mt-2">Related Products</h2>
            </div>
            <a
              href="#"
              className="text-primary font-semibold flex items-center gap-2 hover:gap-4 transition-all duration-300"
            >
              View All <ChevronRight size={20} />
            </a>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[800px]">
            {relatedProducts.map((item, index) => {
              if (item.layout === 'large') {
                return (
                  <div
                    key={item.id}
                    className="md:col-span-2 md:row-span-2 bg-muted rounded-lg overflow-hidden group relative cursor-pointer"
                    onClick={() => handleRelatedProduct(item.id)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
                      {item.category && (
                        <span className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-white text-2xl font-bold">{item.title}</h3>
                      {item.price && (
                        <p className="text-white/80 text-sm mt-2">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                );
              }

              if (item.layout === 'split') {
                return (
                  <div
                    key={item.id}
                    className="md:col-span-2 md:row-span-1 bg-card rounded-lg overflow-hidden group relative flex cursor-pointer"
                    onClick={() => handleRelatedProduct(item.id)}
                  >
                    <div className="w-1/2 p-8 flex flex-col justify-center">
                      {item.category && (
                        <span className="text-orange-600 font-bold text-xs uppercase tracking-widest mb-1">
                          {item.category}
                        </span>
                      )}
                      <h3 className="text-foreground text-xl font-bold">{item.title}</h3>
                      {item.description && (
                        <p className="text-muted-foreground text-sm mt-2">{item.description}</p>
                      )}
                      {item.price && (
                        <p className="text-primary font-bold mt-4">
                          ${item.price.toFixed(2)}
                        </p>
                      )}
                    </div>
                    <div className="w-1/2 bg-muted overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  </div>
                );
              }

              if (item.layout === 'small') {
                return (
                  <div
                    key={item.id}
                    className="md:col-span-1 md:row-span-1 bg-muted rounded-lg overflow-hidden group relative cursor-pointer"
                    onClick={() => handleRelatedProduct(item.id)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 hover:bg-black/20 transition-all p-6 flex flex-col justify-end">
                      <h3 className="text-white font-bold">{item.title}</h3>
                      {item.price && (
                        <p className="text-white/90 text-xs">${item.price.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                );
              }

            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;
