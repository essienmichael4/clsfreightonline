import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Package,
  ShoppingBag,
  ChevronDown,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  badgeColor?: 'primary' | 'secondary' | 'tertiary';
  featured?: boolean;
}

interface FeaturedCollection {
  id: number;
  title: string;
  image: string;
  featured?: boolean;
}

const Shop = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000]);

  // Sample featured collections for the bento grid
  const featuredCollections: FeaturedCollection[] = [
    {
      id: 1,
      title: 'Premium Shipping Solutions',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrVbnZTesi23vMZCNUw8OyyLftcmfv6TbXBXK1CwmmWHQjMXrgltInxtCNwd7XxFbTFyMA-PQZ070B75bTvdI7Ny77ngL5og23MzQMq3k8EZ4ZCMSMtHEFQeLramVGcNSj3H0jEtoKl8hscRWzHPcqX4CUy8jAJC6a33Xt3Tk_NbVr7U-FA4sannHxQLALDmrp34R5ltZGvxwhTNkjD1HyQ7zOem2_vhuN4D7h9V02zR_Lejz3wUOlx-PbLqDjH5FSgwmYHOsAAOU',
      featured: true,
    },
    {
      id: 2,
      title: 'Sculptural Form',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ki6e_24_m9Bk_nP0Ev-MOEB95jSGTlLSwnpvRp0MZQlrJDd-rUJU6gOfYoeNP6w31ua44wqNpWJMiSvRDTBjXneIEaA04ctVkgPul6Yn16G23pIg8-K8B_zJ1jvwD-ioVXeO5679vzXq7su_clbImJjXklW2x-JC0GIv6O-yMFgTdj9DpWlFzSck1NjYm8MM79js-zY6vbdB4Ql8agoHfMfFc-KygiBF3UjPAB1C63T8YeQ7vUw4dJGkeCfCCXU_Ew40_VA-a09u',
    },
    {
      id: 3,
      title: 'Deep Archive',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC7WmBz9eie9Vx32vZXEl8gWAj341o3drcFQU5pgDpvOZ3f1-Bv5TN_Jq4101H5AC85TsEIQY39uC4rJ8fR7tMz99idqNfn3mYxw-_qY6bOSoT1Xs-13XCFQ0dNOJUgM4tMsgW0arIlAL3yFYqEjd6G33wzR1fHTHi9EcT9fwN0twd06Yg3MBVLCvx5buH-h3cmSYt7363xTHoJJ-s5bL5qJu4GJu-xdJX61Rfo9KIL0nZLtI1C8PvIDPEWL68RYotF7VqVVVN6UeeW',
    },
  ];

  // Sample products
  const products: Product[] = [
    {
      id: 2,
      name: 'Azure Gaze Print',
      category: "CURATOR'S PICK",
      price: 850,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
      badgeColor: 'primary',
    },
    {
      id: 3,
      name: 'Neural Interface v2',
      category: 'EDITION 04',
      price: 1120,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
    },
    {
      id: 4,
      name: 'Pulse Dynamics',
      category: 'COLLECTION 02',
      price: 1650,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
    },
    {
      id: 5,
      name: 'Luminous Core',
      category: 'ARCHIVE 03',
      price: 2100,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
      badge: 'RARE',
      badgeColor: 'tertiary',
    },
    {
      id: 6,
      name: 'Ethereal Canvas',
      category: "CURATOR'S PICK",
      price: 980,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
    },
    {
      id: 7,
      name: 'Void Sculpture',
      category: 'EDITION 04',
      price: 1340,
      badge: 'NEW',
      badgeColor: 'secondary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
    },
    {
      id: 8,
      name: 'Obsidian Flow',
      category: 'COLLECTION 02',
      price: 760,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrVbnZTesi23vMZCNUw8OyyLftcmfv6TbXBXK1CwmmWHQjMXrgltInxtCNwd7XxFbTFyMA-PQZ070B75bTvdI7Ny77ngL5og23MzQMq3k8EZ4ZCMSMtHEFQeLramVGcNSj3H0jEtoKl8hscRWzHPcqX4CUy8jAJC6a33Xt3Tk_NbVr7U-FA4sannHxQLALDmrp34R5ltZGvxwhTNkjD1HyQ7zOem2_vhuN4D7h9V02zR_Lejz3wUOlx-PbLqDjH5FSgwmYHOsAAOU',
    },
    {
      id: 9,
      name: 'Dusk Horizon',
      category: 'ARCHIVE 03',
      price: 1890,
      badge: 'LIMITED',
      badgeColor: 'primary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7WmBz9eie9Vx32vZXEl8gWAj341o3drcFQU5pgDpvOZ3f1-Bv5TN_Jq4101H5AC85TsEIQY39uC4rJ8fR7tMz99idqNfn3mYxw-_qY6bOSoT1Xs-13XCFQ0dNOJUgM4tMsgW0arIlAL3yFYqEjd6G33wzR1fHTHi9EcT9fwN0twd06Yg3MBVLCvx5buH-h3cmSYt7363xTHoJJ-s5bL5qJu4GJu-xdJX61Rfo9KIL0nZLtI1C8PvIDPEWL68RYotF7VqVVVN6UeeW',
    },
    {
      id: 10,
      name: 'Ceramic Drift',
      category: "CURATOR'S PICK",
      price: 620,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGTw4Yvcf253gEjKkqLUuoEti-zt6ncPp5yr4YwthhTitJpe1ejsWcTkgOMuL5CMNcypvwjmcORFf3MWZ9L6Q0TzqoMIVxkOU0a3zGXjdnedekj9FgQ9WkYXmadRkjE5Y8-HNWw7iAGaIPyw1WDQP0UxunGi3v9Qmahr4gLBdJzQtW8C7oNba2Z15Y2PV6o9mMRn_iZzW2vuQqwlloO2ouLnlaVmb-RoL4np97Ws3WFT4Xwz1A349vtEORBC8wy2yLGLtZaMYWnX-V',
    },
    {
      id: 11,
      name: 'Terrain Study',
      category: 'EDITION 04',
      price: 2450,
      badge: 'RARE',
      badgeColor: 'tertiary',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ki6e_24_m9Bk_nP0Ev-MOEB95jSGTlLSwnpvRp0MZQlrJDd-rUJU6gOfYoeNP6w31ua44wqNpWJMiSvRDTBjXneIEaA04ctVkgPul6Yn16G23pIg8-K8B_zJ1jvwD-ioVXeO5679vzXq7su_clbImJjXklW2x-JC0GIv6O-yMFgTdj9DpWlFzSck1NjYm8MM79js-zY6vbdB4Ql8agoHfMfFc-KygiBF3UjPAB1C63T8YeQ7vUw4dJGkeCfCCXU_Ew40_VA-a09u',
    },
    {
      id: 12,
      name: 'Flux Matter',
      category: 'COLLECTION 02',
      price: 530,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
    },
  ];

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    setCartItems(prev => prev + 1);
    // Add toast notification here if needed
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 3000]);
  };

  // Get unique categories from products
  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))].sort();
  }, [products]);

  // Filter products based on selected filters
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [selectedCategories, priceRange]);

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'tertiary':
        return 'bg-accent text-accent-foreground';
      case 'primary':
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Featured Banner */}
              <div className="bg-sky-200 rounded-xl overflow-hidden relative min-h-[420px] flex flex-col justify-between p-8">
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
                  {[
                    {
                      id: 2,
                      price: 850,
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
                    },
                    {
                      id: 3,
                      price: 1120,
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
                    },
                    {
                      id: 4,
                      price: 1650,
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex-1 bg-white rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleProductClick(item.id)}
                    >
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={item.img} alt="product" className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-bold">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Category Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Women's Clothing",
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ki6e_24_m9Bk_nP0Ev-MOEB95jSGTlLSwnpvRp0MZQlrJDd-rUJU6gOfYoeNP6w31ua44wqNpWJMiSvRDTBjXneIEaA04ctVkgPul6Yn16G23pIg8-K8B_zJ1jvwD-ioVXeO5679vzXq7su_clbImJjXklW2x-JC0GIv6O-yMFgTdj9DpWlFzSck1NjYm8MM79js-zY6vbdB4Ql8agoHfMfFc-KygiBF3UjPAB1C63T8YeQ7vUw4dJGkeCfCCXU_Ew40_VA-a09u',
                  },
                  {
                    label: "Men's Clothing",
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
                  },
                  {
                    label: 'Toys & Games',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
                  },
                  {
                    label: 'Furniture',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGTw4Yvcf253gEjKkqLUuoEti-zt6ncPp5yr4YwthhTitJpe1ejsWcTkgOMuL5CMNcypvwjmcORFf3MWZ9L6Q0TzqoMIVxkOU0a3zGXjdnedekj9FgQ9WkYXmadRkjE5Y8-HNWw7iAGaIPyw1WDQP0UxunGi3v9Qmahr4gLBdJzQtW8C7oNba2Z15Y2PV6o9mMRn_iZzW2vuQqwlloO2ouLnlaVmb-RoL4np97Ws3WFT4Xwz1A349vtEORBC8wy2yLGLtZaMYWnX-V',
                  },
                  {
                    label: 'Beauty & Health',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrVbnZTesi23vMZCNUw8OyyLftcmfv6TbXBXK1CwmmWHQjMXrgltInxtCNwd7XxFbTFyMA-PQZ070B75bTvdI7Ny77ngL5og23MzQMq3k8EZ4ZCMSMtHEFQeLramVGcNSj3H0jEtoKl8hscRWzHPcqX4CUy8jAJC6a33Xt3Tk_NbVr7U-FA4sannHxQLALDmrp34R5ltZGvxwhTNkjD1HyQ7zOem2_vhuN4D7h9V02zR_Lejz3wUOlx-PbLqDjH5FSgwmYHOsAAOU',
                  },
                  {
                    label: 'Shoes',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7WmBz9eie9Vx32vZXEl8gWAj341o3drcFQU5pgDpvOZ3f1-Bv5TN_Jq4101H5AC85TsEIQY39uC4rJ8fR7tMz99idqNfn3mYxw-_qY6bOSoT1Xs-13XCFQ0dNOJUgM4tMsgW0arIlAL3yFYqEjd6G33wzR1fHTHi9EcT9fwN0twd06Yg3MBVLCvx5buH-h3cmSYt7363xTHoJJ-s5bL5qJu4GJu-xdJX61Rfo9KIL0nZLtI1C8PvIDPEWL68RYotF7VqVVVN6UeeW',
                  },
                ].map((cat) => (
                  <div
                    key={cat.label}
                    className="bg-muted rounded-xl flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-muted/70 transition-colors overflow-hidden relative group"
                    onClick={() => handleCategoryToggle(cat.label)}
                  >
                    <p className="text-sm font-bold text-foreground z-10 relative max-w-[55%] leading-snug">{cat.label}</p>
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="h-24 w-24 object-cover object-top rounded-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="flex justify-between items-baseline border-b border-border pb-6">
            <h2 className="text-3xl font-bold tracking-tight">
              Active Collections
            </h2>
            <span className="text-sm text-muted-foreground opacity-60">
              {filteredProducts.length} ITEMS AVAILABLE
            </span>
          </div>

          {/* Products with Sidebar Filter */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-muted/50 to-background border border-border rounded-xl p-6 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Filters</h3>
                </div>
                  {/* Category Filter */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground tracking-wide uppercase">Category</h4>
                      <p className="text-xs text-muted-foreground mt-1">Filter by collection type</p>
                    </div>
                    <div className="space-y-3 pl-1">
                      {categories.map(category => (
                        <label key={category} className="flex items-center gap-3 cursor-pointer group/item">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryToggle(category)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded-md transition-all ${
                              selectedCategories.includes(category)
                                ? 'bg-primary border-primary'
                                : 'border-border bg-background group-hover/item:border-primary/50'
                            }`}>
                              {selectedCategories.includes(category) && (
                                <svg className="w-3 h-3 text-primary-foreground ml-1 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-foreground font-medium group-hover/item:text-primary transition-colors">{category}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            ({products.filter(p => p.category === category).length})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-border via-border to-transparent" />

                  {/* Price Range Filter */}
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground tracking-wide uppercase">Price Range</h4>
                      <p className="text-xs text-muted-foreground mt-1">Set your budget constraints</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3 items-center">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase mb-2 block">Min</label>
                          <input
                            type="number"
                            min="0"
                            max="3000"
                            value={priceRange[0]}
                            onChange={(e) =>
                              handlePriceChange([Number(e.target.value), priceRange[1]])
                            }
                            placeholder="$0"
                            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="text-muted-foreground font-bold mt-6">—</div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase mb-2 block">Max</label>
                          <input
                            type="number"
                            min="0"
                            max="3000"
                            value={priceRange[1]}
                            onChange={(e) =>
                              handlePriceChange([priceRange[0], Number(e.target.value)])
                            }
                            placeholder="$3000"
                            className="w-full px-3 py-2.5 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div className="bg-primary/5 rounded-lg px-4 py-3 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">
                          ${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                {/* Clear Filters Button */}
                {(selectedCategories.length > 0 || priceRange[0] !== 0 || priceRange[1] !== 3000) && (
                  <div className="pt-4 border-t border-border">
                    <button
                      onClick={handleClearFilters}
                      className="w-full px-4 py-2.5 border border-border text-foreground font-medium rounded-lg hover:bg-muted hover:border-primary/30 transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <X size={16} />
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-10">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="w-full h-72 overflow-hidden rounded-lg bg-muted mb-4 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {product.badge && (
                        <div className="absolute top-4 right-4">
                          <span className={`${getBadgeColor(product.badgeColor)} px-3 py-1 rounded-full text-[10px] font-bold tracking-tighter`}>
                            {product.badge}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={e => handleAddToCart(e, product.id)}
                        className="absolute bottom-4 right-4 bg-primary text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-75"
                      >
                        <ShoppingBag size={20} />
                      </button>
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-primary text-[10px] font-bold tracking-widest uppercase mb-1">
                          {product.category}
                        </p>
                        <h4 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                      </div>
                      <span className="font-medium text-muted-foreground">${product.price}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-16">
                  <p className="text-muted-foreground text-lg">
                    No products found matching your filters.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="text-primary hover:text-primary/80 transition-colors font-semibold mt-4"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>
        </section>

        {/* Promotional Editorial Section */}
        <section className="mt-40 px-8 md:px-16">
          <div className="bg-muted rounded-lg p-8 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>

            <div className="relative z-10 md:w-1/2">
              <h2 className="text-5xl font-extrabold tracking-tighter mb-8 text-foreground">
                Expert Consultation.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10">
                Our logistics experts are ready to assist you in optimizing your shipping solutions. Connect instantly with a specialist to discuss bulk shipments or custom logistics plans.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-bold flex items-center gap-3 h-auto">
                <MessageCircle size={20} />
                WhatsApp Specialist
              </Button>
            </div>

            <div className="md:w-1/2 relative">
              <div className="aspect-square bg-card rounded-lg p-4 rotate-3 hover:rotate-0 transition-transform duration-500 shadow-lg">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGTw4Yvcf253gEjKkqLUuoEti-zt6ncPp5yr4YwthhTitJpe1ejsWcTkgOMuL5CMNcypvwjmcORFf3MWZ9L6Q0TzqoMIVxkOU0a3zGXjdnedekj9FgQ9WkYXmadRkjE5Y8-HNWw7iAGaIPyw1WDQP0UxunGi3v9Qmahr4gLBdJzQtW8C7oNba2Z15Y2PV6o9mMRn_iZzW2vuQqwlloO2ouLnlaVmb-RoL4np97Ws3WFT4Xwz1A349vtEORBC8wy2yLGLtZaMYWnX-V"
                  alt="Logistics Center"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* More to Love Section */}
        <section className="mt-20 px-8 md:px-16">
          <h2 className="text-2xl font-bold text-center mb-8">More to love</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              {
                id: 101,
                name: '46pc Drive Socket Set 1/4 inch Ratchet Wrench',
                price: 226.72,
                originalPrice: 851.25,
                discount: 73,
                sold: '2,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
              },
              {
                id: 102,
                name: 'Wireless Bluetooth Earphones Neckband',
                price: 12.31,
                originalPrice: 54.51,
                discount: 77,
                sold: '5,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
              },
              {
                id: 103,
                name: 'Luxury Matte Armor Phone Case',
                price: 44.63,
                originalPrice: 137.36,
                discount: 67,
                sold: '100K+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrVbnZTesi23vMZCNUw8OyyLftcmfv6TbXBXK1CwmmWHQjMXrgltInxtCNwd7XxFbTFyMA-PQZ070B75bTvdI7Ny77ngL5og23MzQMq3k8EZ4ZCMSMtHEFQeLramVGcNSj3H0jEtoKl8hscRWzHPcqX4CUy8jAJC6a33Xt3Tk_NbVr7U-FA4sannHxQLALDmrp34R5ltZGvxwhTNkjD1HyQ7zOem2_vhuN4D7h9V02zR_Lejz3wUOlx-PbLqDjH5FSgwmYHOsAAOU',
              },
              {
                id: 104,
                name: 'DIY Lash Extension Kit Clusters',
                price: 27.34,
                originalPrice: 152.22,
                discount: 82,
                sold: '10,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
              },
              {
                id: 105,
                name: 'Smart Watch Series 11 Fitness Tracker',
                price: 12.86,
                originalPrice: 127.7,
                discount: 89,
                sold: '3,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7WmBz9eie9Vx32vZXEl8gWAj341o3drcFQU5pgDpvOZ3f1-Bv5TN_Jq4101H5AC85TsEIQY39uC4rJ8fR7tMz99idqNfn3mYxw-_qY6bOSoT1Xs-13XCFQ0dNOJUgM4tMsgW0arIlAL3yFYqEjd6G33wzR1fHTHi9EcT9fwN0twd06Yg3MBVLCvx5buH-h3cmSYt7363xTHoJJ-s5bL5qJu4GJu-xdJX61Rfo9KIL0nZLtI1C8PvIDPEWL68RYotF7VqVVVN6UeeW',
              },
              {
                id: 106,
                name: 'Pressure Gauge Industrial G33 G36 Series',
                price: 72.75,
                originalPrice: null,
                discount: null,
                sold: '16',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGTw4Yvcf253gEjKkqLUuoEti-zt6ncPp5yr4YwthhTitJpe1ejsWcTkgOMuL5CMNcypvwjmcORFf3MWZ9L6Q0TzqoMIVxkOU0a3zGXjdnedekj9FgQ9WkYXmadRkjE5Y8-HNWw7iAGaIPyw1WDQP0UxunGi3v9Qmahr4gLBdJzQtW8C7oNba2Z15Y2PV6o9mMRn_iZzW2vuQqwlloO2ouLnlaVmb-RoL4np97Ws3WFT4Xwz1A349vtEORBC8wy2yLGLtZaMYWnX-V',
              },
              {
                id: 107,
                name: 'T9 Vintage Men\'s Electric Hair Clipper',
                price: 49.33,
                originalPrice: 210.0,
                discount: 76,
                sold: '8,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4Ki6e_24_m9Bk_nP0Ev-MOEB95jSGTlLSwnpvRp0MZQlrJDd-rUJU6gOfYoeNP6w31ua44wqNpWJMiSvRDTBjXneIEaA04ctVkgPul6Yn16G23pIg8-K8B_zJ1jvwD-ioVXeO5679vzXq7su_clbImJjXklW2x-JC0GIv6O-yMFgTdj9DpWlFzSck1NjYm8MM79js-zY6vbdB4Ql8agoHfMfFc-KygiBF3UjPAB1C63T8YeQ7vUw4dJGkeCfCCXU_Ew40_VA-a09u',
              },
              {
                id: 108,
                name: '3 Pairs Universal Fashion Glasses Clear Lens',
                price: 38.45,
                originalPrice: 96.12,
                discount: 60,
                sold: '4,500+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdIAwGRcj9eqo5DrNYL_A72Mz5OD82R64obWjXZg9UfO7gUTM3aMNQsuml6flJ6KBL2w_fUDjs_VUzKHc_eaGqrpsi9MQB3e75no3xdom2lXXivvmr5hWqa5Ua3PCRBLEZMfQ-zhpmwrrZGtEHR0awqcQ8GO1O_p7bbI2AlXbVrBhn5wSPFA7_6hz5LUh-JX_zL_HojnhDi8Iubmmo-8xlQxxXWo1IaevznC3INqc5IHoRilNKVUd0uwB6W-AY2Ma0DKxK4A4PJtWo',
              },
              {
                id: 109,
                name: 'Multifunctional Portable Wireless Headphones P47',
                price: 19.04,
                originalPrice: 63.47,
                discount: 70,
                sold: '20,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLENsU6L6OvuCEVA_ZlmmHRT_HqdsSEfCCh1CAZXTC0zWFdsKQimSg65B7_VVeKNJjG71SD8EQP3gRymFpbfM4XJBA3mSJ-cz-GFHyEb15TzI_qKR7V3pDNcxvxBT33k7_kFBrQa3Bya-kTNBOPplh-O6YQN1np8wxx7stEStChuBQ9IEjpp8_fV9SSHGEdMk9nQKCmmcoj-GGXLPnpe62Vtt0AVXgxtmjBSlUVS-0V4t_e5a7f_OFfn5zQUZE9Z4E5bYRw3B-V9Hq',
              },
              {
                id: 110,
                name: 'Smartwatch Men Women Wristband Heart Rate',
                price: 44.62,
                originalPrice: 185.92,
                discount: 76,
                sold: '6,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZrVbnZTesi23vMZCNUw8OyyLftcmfv6TbXBXK1CwmmWHQjMXrgltInxtCNwd7XxFbTFyMA-PQZ070B75bTvdI7Ny77ngL5og23MzQMq3k8EZ4ZCMSMtHEFQeLramVGcNSj3H0jEtoKl8hscRWzHPcqX4CUy8jAJC6a33Xt3Tk_NbVr7U-FA4sannHxQLALDmrp34R5ltZGvxwhTNkjD1HyQ7zOem2_vhuN4D7h9V02zR_Lejz3wUOlx-PbLqDjH5FSgwmYHOsAAOU',
              },
              {
                id: 111,
                name: 'iPhone 17 Lip Glosses Plum Moisturizing Set',
                price: 19.04,
                originalPrice: 79.35,
                discount: 76,
                sold: '9,000+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgwqGC6Ba3NybrV9pHeR8nxZB4AapWjrZyxAoxrUe52Iw82UL2ReHmmwxL2r2VYZ0fdNYPXLKfsxjkM9SkjixFrVuCvgrOhIblxKirveZt9TVSxXS5bFFU4dxM5JgBOCCrzGF7H1qRcagsEchAUH4mCljPUzKhal6tzPgdwoYXhZC8UkpNxrrPOIoimIyj4MsmaYIkaFT0GMEc7zkaib1dJZ2UdTutrGkTPiuq2ggCosmESIL4NNcYAOZDjQ09KFtpfLbGj2DUFrhL',
              },
              {
                id: 112,
                name: 'New Ultra Slim Laptop 14.1" 16GB RAM',
                price: 1109.04,
                originalPrice: null,
                discount: null,
                sold: '200+',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC7WmBz9eie9Vx32vZXEl8gWAj341o3drcFQU5pgDpvOZ3f1-Bv5TN_Jq4101H5AC85TsEIQY39uC4rJ8fR7tMz99idqNfn3mYxw-_qY6bOSoT1Xs-13XCFQ0dNOJUgM4tMsgW0arIlAL3yFYqEjd6G33wzR1fHTHi9EcT9fwN0twd06Yg3MBVLCvx5buH-h3cmSYt7363xTHoJJ-s5bL5qJu4GJu-xdJX61Rfo9KIL0nZLtI1C8PvIDPEWL68RYotF7VqVVVN6UeeW',
              },
            ].map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer bg-background border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => handleProductClick(item.id)}
              >
                {/* Image */}
                <div className="relative w-full h-44 overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={(e) => { e.stopPropagation(); setCartItems(prev => prev + 1); }}
                    className="absolute bottom-2 right-2 bg-white text-foreground p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ShoppingBag size={16} />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3 space-y-1">
                  <p className="text-xs text-foreground font-medium leading-snug line-clamp-2">{item.name}</p>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-sm font-bold text-red-500">${item.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
