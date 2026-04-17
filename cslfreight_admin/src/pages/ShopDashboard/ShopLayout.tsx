import { NavLink, Outlet, useLocation } from "react-router-dom"
import { LayoutDashboard, Package2, BarChart2, Settings, Search, Bell, HelpCircle, LogOut } from "lucide-react"

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: "Dashboard", to: "/shop-dashboard" },
  { icon: <Package2 size={18} />, label: "Products", to: "/shop-dashboard/products" },
  { icon: <BarChart2 size={18} />, label: "Analytics", to: "/shop-dashboard/analytics" },
  { icon: <Settings size={18} />, label: "Settings", to: "/shop-dashboard/settings" },
]

const pageLabels: Record<string, string> = {
  "/shop-dashboard": "Overview",
  "/shop-dashboard/products": "Products",
  "/shop-dashboard/analytics": "Analytics",
  "/shop-dashboard/settings": "Settings",
}

const ShopLayout = () => {
  const location = useLocation()
  const pageLabel = pageLabels[location.pathname] ?? "Overview"

  return (
    <div className="flex min-h-screen bg-[#f5faff] text-[#171c20] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen flex flex-col py-8 w-64 bg-[#f5faff] z-50">
        <div className="px-8 mb-10">
          <h1 className="text-xl font-bold tracking-tighter text-[#00668a]">CslFreight</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1">Admin Console</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.to === "/shop-dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-8 py-3 text-sm transition-colors ${
                  isActive
                    ? "text-[#00668a] font-bold border-r-4 border-[#34b7f1]"
                    : "text-slate-500 hover:bg-[#f0f4f9]"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[#bdc8d0]/10 pt-4">
          <a href="#" className="flex items-center gap-3 px-8 py-3 text-slate-500 hover:bg-[#f0f4f9] transition-colors text-sm">
            <HelpCircle size={18} />
            <span>Support</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-8 py-3 text-slate-500 hover:bg-[#f0f4f9] transition-colors text-sm">
            <LogOut size={18} />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="flex justify-between items-center px-8 h-16 w-full bg-[#f5faff]/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#00668a] uppercase tracking-widest">Shop Admin</span>
            <span className="text-[#bdc8d0] text-lg">/</span>
            <span className="text-sm font-semibold text-[#171c20]">{pageLabel}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <input
                className="bg-[#f0f4f9] border-none rounded-full py-1.5 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#34b7f1] w-64 text-[#171c20] transition-all"
                placeholder="Search curated records..."
                type="text"
              />
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <button className="hover:text-[#00668a] transition-colors">
                <Bell size={20} />
              </button>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-[#34b7f1]/20 bg-[#eaeef3] flex items-center justify-center text-xs font-bold text-[#00668a]">
                A
              </div>
            </div>
          </div>
        </header>

        <Outlet />

        {/* Footer */}
        <footer className="mt-auto p-10 flex justify-between items-center opacity-40">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
            © 2024 CslFreight / Shop Admin v4.0
          </p>
          <div className="flex gap-4">
            <div className="h-1.5 w-1.5 rounded-full bg-[#00668a]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#34b7f1]" />
            <div className="h-1.5 w-1.5 rounded-full bg-[#3c6379]" />
          </div>
        </footer>
      </main>
    </div>
  )
}

export default ShopLayout
