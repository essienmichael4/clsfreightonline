import logo from '../assets/logo.webp'
import { Badge, LayoutDashboard, Package, PiggyBank, ReceiptText, Settings, Ship, User, Users, Video } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

interface SideNavProps{
    isToggled: boolean
}

const SideNav = ({isToggled}:SideNavProps) => {
  return (
    <nav className={`fixed ${isToggled === true ? 'lg:w-[4rem] md:w-[220px] ' : 'lg:w-[220px]'} w-[4rem] top-0 bottom-0 z-50 py-3 backdrop-blur-lg border-r border-neutral-100/80 overflow-hidden transition-all ease-in-out duration-500`}>
      <div className="px-4 mx-auto relative text-sm">
        <div className="flex flex-col items-start">
          <Link to={"/"} className="flex items-center flex-shrink-0 mb-8">
            <img src={logo} alt="logo" className='h-10 w-10 mr-4' />
            <span className="text-xl tracking-tight text-nowrap">CSL Freight</span>
          </Link>
            <NavLink to={"/dashboard"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <LayoutDashboard className='h-4 w-4 mr-6' />
                <span className=''>Dashboard {isToggled}</span>
            </NavLink>
            <NavLink to={"/packages"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Package className='h-4 w-4 mr-6' />
                <span className=''>Packages</span>
            </NavLink>
            <NavLink to={"/loadings"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Ship className='h-4 w-4 mr-6' />
                <span className=''>Loadings</span>
            </NavLink>
            <NavLink to={"/clients"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <User className='h-4 w-4 mr-6' />
                <span className=''>Clients</span>
            </NavLink>
            <NavLink to={"/payments"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <PiggyBank className='h-4 w-4 mr-6' />
                <span className=''>Payments</span>
            </NavLink>
            <NavLink to={"/invoices"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <ReceiptText className='h-4 w-4 mr-6' />
                <span className=''>Invoices</span>
            </NavLink>
            <NavLink to={"/users"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Users className='h-4 w-4 mr-6' />
                <span className=''>Users</span>
            </NavLink>
            <NavLink to={"/memberships"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Badge className='h-4 w-4 mr-6' />
                <span className=''>Memberships</span>
            </NavLink>
            <NavLink to={"/settings"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Settings className='h-4 w-4 mr-6' />
                <span className=''>Settings</span>
            </NavLink>
            <NavLink to={"/videos"} className='pl-2 py-2 flex items-center flex-shrink-0 mb-2 text-muted-foreground'>
                <Video className='h-4 w-4 mr-6' />
                <span className=''>Videos</span>
            </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default SideNav
