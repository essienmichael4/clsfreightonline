import { TrendingUp, TrendingDown, MousePointerClick, Package2, Eye, ShoppingCart } from "lucide-react"

const topProducts = [
  { rank: 1, name: "The Lunar Vessel", category: "Art", clicks: 8241, views: 12400, revenue: "$34,522" },
  { rank: 2, name: "Nebula Desk Lamp", category: "Lighting", clicks: 4102, views: 7800, revenue: "$15,987" },
  { rank: 3, name: "Ethereal Silk Chair", category: "Furniture", clicks: 2894, views: 5300, revenue: "$37,401" },
  { rank: 4, name: "Obsidian Coffee Table", category: "Furniture", clicks: 1244, views: 2100, revenue: "$26,124" },
]

const categoryStats = [
  { name: "Furniture", percentage: 48, color: "#00668a" },
  { name: "Art", percentage: 27, color: "#34b7f1" },
  { name: "Lighting", percentage: 15, color: "#3c6379" },
  { name: "Decor", percentage: 10, color: "#bdc8d0" },
]

const statCards = [
  { label: "Total Revenue", value: "$114,034", change: "+18.2%", up: true, icon: <ShoppingCart size={32} /> },
  { label: "Total Clicks", value: "42.5k", change: "+9.4%", up: true, icon: <MousePointerClick size={32} /> },
  { label: "Total Views", value: "27.6k", change: "-2.1%", up: false, icon: <Eye size={32} /> },
  { label: "Active Listings", value: "1,284", change: "+12%", up: true, icon: <Package2 size={32} /> },
]

const ShopAnalytics = () => {
  return (
    <div className="p-10 space-y-10">
      {/* Header */}
      <div className="flex items-baseline gap-4">
        <h2 className="text-4xl font-extrabold tracking-tighter text-[#171c20] font-['Manrope',sans-serif]">Analytics</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-[#bdc8d0]/30 to-transparent" />
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Last 30 days</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {card.icon}
            </div>
            <p className="text-[#00668a] text-xs font-bold uppercase tracking-widest mb-2">{card.label}</p>
            <h3 className="text-3xl font-extrabold tracking-tighter text-[#171c20] font-['Manrope',sans-serif]">{card.value}</h3>
            <p className={`text-xs mt-3 flex items-center gap-1 font-semibold ${card.up ? "text-emerald-600" : "text-red-500"}`}>
              {card.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {card.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#bdc8d0]/10 p-8">
          <h3 className="text-xl font-extrabold tracking-tight text-[#171c20] mb-6 font-['Manrope',sans-serif]">By Category</h3>
          <div className="space-y-5">
            {categoryStats.map((cat) => (
              <div key={cat.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm font-semibold text-[#171c20]">{cat.name}</span>
                  <span className="text-xs font-bold text-[#3c6379]">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-[#f0f4f9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#bdc8d0]/10 overflow-hidden">
          <div className="px-8 py-6 border-b border-[#bdc8d0]/10">
            <h3 className="text-xl font-extrabold tracking-tight text-[#171c20] font-['Manrope',sans-serif]">Top Performing Products</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f0f4f9]">
                <tr>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">#</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Product</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Clicks</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379]">Views</th>
                  <th className="px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-[#3c6379] text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bdc8d0]/10">
                {topProducts.map((p) => (
                  <tr key={p.rank} className="hover:bg-[#f0f4f9] transition-colors">
                    <td className="px-8 py-5 text-sm font-bold text-[#bdc8d0]">#{p.rank}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-[#171c20]">{p.name}</p>
                      <span className="px-2 py-0.5 bg-[#bde5ff] text-[#40677d] rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#171c20]">{p.clicks.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#171c20]">{p.views.toLocaleString()}</td>
                    <td className="px-8 py-5 text-sm font-bold text-[#00668a] text-right">{p.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShopAnalytics
