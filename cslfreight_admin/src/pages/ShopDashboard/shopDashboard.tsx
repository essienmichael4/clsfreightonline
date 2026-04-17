import { Package2, TrendingUp, MousePointerClick, ChevronDown } from "lucide-react"

const analyticsProducts = [
  {
    name: "The Lunar Vessel",
    sku: "LV-2024-001",
    category: "Art",
    clicks: "8,241",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIcmeiEyD87Ar56iHQP2sdtSkCVgEf5HuxfwMUTDlTLk2CZtzaNA3h5Ek_XtQAHtvegXobwwKsCZ7tJ9T8koA1Dh4wvI7jwT8R-MblBaODNZdC78IM8ravhO4kdUB39R7t2q9Uev9NBgawAiZz0ZQc4ZgkvSdHahR9Hy4GGeGU3wdqsn101LyhiafA7C5fJjaqhENjvleFdSOyt-_WLNGftnA0dW8hzTZAtWfBcWQim7gTZu0gsW7-9haaM9oCSQUB89LfZOwIfpQY",
  },
  {
    name: "Nebula Desk Lamp",
    sku: "NL-449-B",
    category: "Lighting",
    clicks: "4,102",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4L4nrn-Mwdu7Wita5fGbkEqbZkRVTx8-ZeY5jtijzuRBHf1Nz5ynWOTRe00aCyrD-tKIyCFMTGvPoWpkTtQUOFlivoJjKhd0gh-irrTEVrODYjUBTNEBIklEnBLXrn_b48MK4Qs6TWdmuObymof5osS3gcmWNp5g2T3cTvT-l-wc-4atZE6vU9DuflV4ZbXJzPP0yIz12h3aVgosfhQpq3ayBdF9a_21CG5F7GdP0fPuyDCMUjwoQww596DiUrYLY2rsggDRdTjKG",
  },
  {
    name: "Ethereal Silk Chair",
    sku: "EC-012-S",
    category: "Furniture",
    clicks: "2,894",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZEeeZjYt5YCMLUjF2bM-7wjr9YOGeUWZ5qOqhVfa6--B_INPsjprD0DKhZ4HPLS4Ca3cp9JAo8p3On41gfkwo8_XgV8waY_RxAETuGiDpwVKiQl1Na9NFHKDchBK-vWv9hE__CZGzA91VXhoKx1seGtD4g8t2foU1KLuYAbHWsKNP9euMiaP8K1uLKpnmUGcsCxu3WOx-N7sR9Q3x_2jlED1zdzac7pYD3lve770EOsME-lMRJ2_P_27F9jDlFXVDw23crrWjDR2M",
  },
  {
    name: "Obsidian Coffee Table",
    sku: "OT-990-BLK",
    category: "Furniture",
    clicks: "1,244",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBEvHKpgycuA2gjY-pL-LjupkthjzfLdVH40I_NmGhoGM8ZqjU88EXDzHi-_HU-Kw33gl_DsKmJaMoI5KxdLic8CNfCMbgWGJ2n4pF12DrnZNasL13G4urdUBo4w2Csq2Cx3hP41SONbwB_bEwO8M2zz546SmC_cCDdEQ0SaL7SyPdHfR5OYkMqjTzzUmS4r5U64lp8ibM2uQeBif3Zo_taxcMjCXapD6TZvXtR9J-ayh5xivc3Evh2-oMyn6fb9lgXKzFtmqnPM2-Q",
  },
]

const ShopDashboard = () => {
  return (
    <div className="p-10 space-y-12">
      {/* Quick Stats */}
      <section>
        <div className="flex items-baseline gap-4 mb-8">
          <h2 className="text-4xl font-extrabold tracking-tighter text-[#171c20] font-['Manrope',sans-serif]">Quick Stats</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-[#bdc8d0]/30 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Package2 size={64} />
            </div>
            <p className="text-[#00668a] text-xs font-bold uppercase tracking-widest mb-2">Total Products</p>
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#171c20] font-['Manrope',sans-serif]">1,284</h3>
            <p className="text-xs text-[#3c6379] mt-4 flex items-center gap-1">
              <TrendingUp size={14} />
              +12% from last month
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <MousePointerClick size={64} />
            </div>
            <p className="text-[#00668a] text-xs font-bold uppercase tracking-widest mb-2">Total Clicks</p>
            <h3 className="text-4xl font-extrabold tracking-tighter text-[#171c20] font-['Manrope',sans-serif]">42.5k</h3>
            <p className="text-xs text-[#3c6379] mt-4 flex items-center gap-1">
              <TrendingUp size={14} />
              Real-time engagement
            </p>
          </div>

          <div className="bg-[#f0f4f9] p-8 rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <p className="text-[#00668a] text-xs font-bold uppercase tracking-widest mb-2">Most Viewed Item</p>
              <h3 className="text-2xl font-extrabold tracking-tight text-[#171c20] font-['Manrope',sans-serif]">The Lunar Vessel</h3>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  alt="The Lunar Vessel"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoqkmn_92KmGxRM3p4T_qiJnyfotWdEtPAOxBdTaz4PPOuL_bc5ZyGd3tL2qQAjQFk3Hsve-OD-HA54PTKsrtjw0zX5Jwdp9oHYIPqCZwzUIVQhoREcyLq2fRWotgDIpzVThfHKDIaHbPs26Rzx9-K2_cTEwv02UlpLmVeC3iKOuO4Zet-UEuMOE3asCVFwfJgn2wqYFFh9_wIGi4oO4wS9M7VIQHI5Jk2BNw2sLMVCqWSCXVDJARY37uYd5gDC8GZ0RB-JH_9O33t"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-[#171c20]">8.2k Views</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Art &amp; Collectibles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Analytics Table */}
      <section>
        <div className="bg-white rounded-xl border border-[#bdc8d0]/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#bdc8d0]/10 flex justify-between items-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#171c20] font-['Manrope',sans-serif]">Product Analytics</h2>
            <button className="text-xs font-bold uppercase tracking-widest text-[#00668a] hover:text-[#34b7f1] transition-colors">
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f0f4f9]">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Product Name</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">SKU</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Category</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379] text-right">Click Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bdc8d0]/10">
                {analyticsProducts.map((product) => (
                  <tr key={product.sku} className="hover:bg-[#f0f4f9] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#d6dadf] flex-shrink-0">
                          <img alt={product.name} className="w-full h-full object-cover" src={product.img} />
                        </div>
                        <span className="text-sm font-bold text-[#171c20]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-slate-500 font-medium">{product.sku}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 bg-[#bde5ff] text-[#40677d] rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-[#171c20] text-right">{product.clicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-white text-center">
            <button className="flex items-center gap-2 mx-auto text-xs font-bold text-slate-400 hover:text-[#00668a] transition-colors">
              <ChevronDown size={16} />
              Load More Insights
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShopDashboard
