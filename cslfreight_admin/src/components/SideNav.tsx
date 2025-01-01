import logo from '../assets/logo.webp'
import { LayoutDashboard, Package, Users } from 'lucide-react'
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
            <NavLink to={"/dashboard"} className='pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground'>
                <LayoutDashboard className='h-6 w-6 mr-6' />
                <span className=''>Dashboard {isToggled}</span>
            </NavLink>
            <NavLink to={"/packages"} className='pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground'>
                <Package className='h-6 w-6 mr-6' />
                <span className=''>Packages</span>
            </NavLink>
            <NavLink to={"/users"} className='pl-1 py-2 flex items-center flex-shrink-0 mb-4 text-muted-foreground'>
                <Users className='h-6 w-6 mr-6' />
                <span className=''>Users</span>
            </NavLink>
            
          
          {/* <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
          </div> */}
        </div>
        {/* {mobileDrawerOpen && 
          <div className="fixed right-0 z-20 w-full bg-white backdrop-blur-lg p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              <li className='py-4'>
                <Link to={"/"}>Home</Link>
              </li>
              <li className='py-4'>
                <Link to={"/gallery"}>Services</Link>
              </li>
              <li className='py-4'>
                <Link to={"/gallery"}>About</Link>
              </li>
            </ul>
            <div className=" flex space-x-6">
            <p className='py-2 px-3 rounded-md border '>
            (+233) 24 366 0662
            </p>
            <Link to={"/contact"} className='text-white bg-blue-700 py-2 px-3 rounded-md'>
              Contact Us
            </Link>
            </div>
          </div>
        } */}
      </div>

    </nav>
  )
}

export default SideNav
