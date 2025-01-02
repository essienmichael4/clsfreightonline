import { useState } from 'react'
import logo from '../assets/logo.webp'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-100/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="flex items-center flex-shrink-0">
            <img src={logo} alt="logo" className='h-10 w-10 mr-2' />
            <span className="text-xl tracking-tight">CSL Freight</span>
          </Link>
          <ul className="hidden lg:flex space-x-12">
            <li>
              <Link to={"/"} className='text-neutral-500'>Home</Link>
            </li>
            {/* <li>
              <Link to={"/"} className='text-neutral-500'>Services</Link>
            </li> */}
            <li>
              <Link to={"/about"} className='text-neutral-500'>About</Link>
            </li>
            <li>
              <a href="https://rmbdeals.com" target="_blank" className="text-neutral-500" >Buy RMB</a>
            </li>
          </ul>
          <div className="hidden lg:flex justify-center items-center space-x-4">
            <p>(+233) 552 902 556</p>
            <Link to={"/contact"} className='text-white bg-blue-700 py-2 px-3 rounded-md'>
              Contact Us
            </Link>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {mobileDrawerOpen && 
          <div className="fixed right-0 z-20 w-full bg-white backdrop-blur-lg p-12 flex flex-col justify-center items-center lg:hidden">
            <ul>
              <li className='py-4'>
                <Link to={"/"}>Home</Link>
              </li>
              
              <li className='py-4'>
                <Link to={"/about"}>About</Link>
              </li>
              <li>
                <a href="https://rmbdeals.com" target="_blank" className="text-neutral-500" >Buy RMB</a>
              </li>
            </ul>
            <div className=" flex flex-col items-center">
            <p className='py-2 px-3 rounded-md border '>
            (+233) 552 902 556
            </p>
            <Link to={"/contact"} className='text-white bg-blue-700 py-2 px-3 rounded-md'>
              Contact Us
            </Link>
            </div>
          </div>
        }
      </div>

    </nav>
  )
}

export default Navbar
