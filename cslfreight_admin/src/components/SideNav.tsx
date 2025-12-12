import logo from '../assets/csl DONE.png'
import {LayoutDashboard, Package, Truck, Ship, User, Users, Badge, PiggyBank, ReceiptText, Settings, Video} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'

interface SideNavProps {
  isToggled: boolean
}

const SideNav = ({ isToggled }: SideNavProps) => {
  const menuGroups = [
    {
      label: 'Overview',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { name: 'Packages', icon: Package, path: '/packages' },
        { name: 'Pickup/Deliveries', icon: Truck, path: '/deliveries' },
        { name: 'Loadings', icon: Ship, path: '/loadings' },
      ],
    },
    {
      label: 'Clients & Memberships',
      items: [
        { name: 'Clients', icon: User, path: '/clients' },
        { name: 'Memberships', icon: Badge, path: '/memberships' },
      ],
    },
    {
      label: 'Finance',
      items: [
        { name: 'Payments', icon: PiggyBank, path: '/payments' },
        { name: 'Invoices', icon: ReceiptText, path: '/invoices' },
      ],
    },
    {
      label: 'Administration',
      items: [
        { name: 'Users', icon: Users, path: '/users' },
        { name: 'Settings', icon: Settings, path: '/settings' },
      ],
    },
    {
      label: 'Media',
      items: [{ name: 'Videos', icon: Video, path: '/videos' }],
    },
  ]

  return (
    <nav
      className={`fixed top-0 bottom-0 z-50 py-4 border-r border-neutral-200/80 bg-white/70 dark:bg-neutral-900/50 backdrop-blur-lg transition-all duration-500 ease-in-out overflow-y-auto
        ${isToggled ? 'lg:w-[4rem] w-[4rem]' : 'lg:w-[220px] w-[220px]'}
      `}
    >
      <div className="px-4 mx-auto text-sm">
        {/* LOGO */}
        <Link
          to="/"
          className="flex items-center mb-8 px-2 py-1 hover:opacity-90 transition-opacity"
        >
          <img src={logo} alt="logo" className="h-12 w-28 mr-3" />
          {!isToggled && (
            <span className="text-md font-semibold tracking-tight">
              {/* CSL Freight */}
            </span>
          )}
        </Link>

        {/* NAVIGATION GROUPS */}
        <div className="flex flex-col space-y-2">
          {menuGroups.map((group, i) => (
            <div key={group.label}>
              {!isToggled && (
                <p className="uppercase text-[11px] font-medium text-neutral-500 mb-2 px-2">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center py-2 px-2 mb-1 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0 mr-4" />
                    {!isToggled && <span>{item.name}</span>}
                  </NavLink>
                ))}
              </div>
              {i < menuGroups.length - 1 && (
                <Separator className="my-2 opacity-40" />
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default SideNav
