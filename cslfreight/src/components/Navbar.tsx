import { useEffect, useState } from 'react'
import logo from '../assets/csl DONE.png'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import Marquee from 'react-fast-marquee'
import { useQuery } from '@tanstack/react-query'
import { MarqueAnnouncementType } from '@/lib/types'
import { axios_instance } from '@/api/axios'

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [show, setShow] = useState(false)

  const marqueeAnnouncements = useQuery<MarqueAnnouncementType[]>({
      queryKey: ["announcements", "marquee"],
      queryFn: async() => await axios_instance.get(`/settings/marque`).then(res => {
        return res.data
      })
  })

  useEffect(() => {
    if (marqueeAnnouncements.data && marqueeAnnouncements.data.length > 0) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [marqueeAnnouncements.data])

  const handleShow = ()=>{
    setShow(!show)
  }

  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <nav className="sticky top-0 z-50 pb-3 backdrop-blur-lg border-b border-neutral-100/80">
      <div className={`${show ? "block" : "hidden"} bg-gray-800 relative`}>
        <div className='container px-4 py-4 mx-auto '>
          <Marquee className="text-gray-100 text-sm space-x-16">
            {marqueeAnnouncements.data?.map((marquee, idx) => (
              <span
                key={idx}
                className={`flex items-center ${idx > 0 ? "ml-4" : ""}`}
              >
                {idx > 0 && <span className="mx-4 text-gray-400">|</span>}
                {marquee.announcement}
              </span>
            ))}
          </Marquee>
          <button onClick={handleShow} className='absolute z-10 text-white right-4 top-4'>
            <X  className='w-4 h-4'/>
          </button>
        </div>
      </div>
      <div className="container mt-3 px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <Link to={"/"} className="flex items-center flex-shrink-0">
            <img src={logo} alt="logo" className='h-16 w-16 mr-2' />
            <span className="text-xl tracking-tight">CSL Freight</span>
          </Link>
          <ul className="hidden lg:flex space-x-6">
            <li>
              <Link to={"/"} className='text-neutral-500'>Home</Link>
            </li>
            <li>
              <Link to={"/about"} className='text-neutral-500'>About</Link>
            </li>
            <li>
              <Link to={"/address"} className='text-neutral-500'>Shipping Address</Link>
            </li>
            <li>
              <Link to={"/container-loadings"} className='text-neutral-500'>Container Loadings</Link>
            </li>
            <li>
              <a href="https://forms.gle/PLCL6KGaXaFbKkoT8" target="_blank" className="text-neutral-500" >Cars/Motors</a>
            </li>
            <li>
              <a href="https://rmbdeals.com" target="_blank" className="text-neutral-500" >Buy RMB</a>
            </li>
          </ul>
          <div className="hidden lg:flex justify-center items-center space-x-3">
            {/* <a href="https://forms.gle/cMHhPURSKERJ2BhM6" target="_blank" className="py-2 px-3 rounded-md text-blue-700 border border-blue-700 hover:text-white hover:border-white hover:bg-blue-700" >Register</a> */}
            <Link to={"/login"} className="py-2 px-3 rounded-md text-blue-700 border border-blue-700 hover:text-white hover:border-white hover:bg-blue-700" >Login</Link>
            <Link to={"/contact"} className='text-white bg-blue-700 py-2 px-3 rounded-md hover:text-blue-700 hover:bg-white border border-blue-700'>
              Contact Us
            </Link>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
        {mobileDrawerOpen && 
          <div className="fixed right-0 z-20 w-full bg-white backdrop-blur-lg p-6 flex flex-col justify-center items-center lg:hidden">
            <ul className='flex items-center flex-col'>
              <li className='py-4'>
                <Link to={"/"} onClick={toggleNavbar} className='text-neutral-500'>Home</Link>
              </li>
              
              <li className='py-4'>
                <Link to={"/about"} onClick={toggleNavbar} className='text-neutral-500'>About</Link>
              </li>
              <li className='py-4'>
                <Link to={"/address"} onClick={toggleNavbar} className='text-neutral-500'>Shipping Address</Link>
              </li>
              <li className='py-4'>
                <Link to={"/container-loadings"} onClick={toggleNavbar} className='text-neutral-500'>Container Loadings</Link>
              </li>
              <li className='py-4'>
                <a href="https://forms.gle/PLCL6KGaXaFbKkoT8" onClick={toggleNavbar} target="_blank" className="text-neutral-500" >Cars/Motors</a>
              </li>
              <li className='py-4'>
                <a href="https://rmbdeals.com" onClick={toggleNavbar} target="_blank" className="text-neutral-500" >Buy RMB</a>
              </li>
            </ul>
            <div className="flex flex-col gap-6 mt-2">
              <Link className='text-white bg-blue-700 py-2 px-3 rounded-md' to={"/login"}>Login</Link>
              <Link to={"/contact"} onClick={toggleNavbar} className='text-white bg-blue-700 py-2 px-3 rounded-md'>
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
