import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import logo from '../assets/logo.webp'
import { LogOut, Menu, User, X } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

const AuthNavbar = () => {
  const {auth, dispatch} = useAuth()
  const navigate = useNavigate()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  
  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-100/80">
      <div className="lg:container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-4'>
             <Link to={"/dashboard"} className="flex items-center flex-shrink-0">
                <img src={logo} alt="logo" className='h-10 w-10 mr-2' />
                <span className="text-xl tracking-tight">CSL Freight</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-4">
            <NavLink to={"/dashboard"} className={({isActive})=> isActive ? "font-medium border-b-4 border-black" : 'text-muted-foreground pb-2'}>Dashboard</NavLink>
            <NavLink to={"/packages"} className={({isActive})=> isActive ? "font-medium border-b-4 border-black" : "text-muted-foreground pb-2"}>Packages</NavLink>
            <NavLink to={"/our-policies"} className={({isActive})=> isActive ? "font-medium border-b-4 border-black" : "text-muted-foreground pb-2"}>Our Policies</NavLink>
            <NavLink to={"/shipping-address"} className={({isActive})=> isActive ? "font-medium border-b-4 border-black" : "text-muted-foreground pb-2"}>Shipping Address</NavLink>
            <li className="list-none">
              <a href="https://rmbdeals.com" target="_blank" className="text-neutral-500" >Buy RMB</a>
            </li>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="outline" className='w-10 h-10 rounded-full'><User className="h-6 w-6 text-muted-foreground" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={()=>{navigate(`../profile/${auth!.id}`)}}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={()=>{
                    dispatch({type:"REMOVE_AUTH",payload: undefined})
                  }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
            </DropdownMenu>
            <div className="md:hidden flex flex-col justify-end">
              <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X /> : <Menu />}</button>
            </div>
          </div>
        </div>
        {mobileDrawerOpen && 
          <div className="fixed right-0 z-20 w-full bg-white backdrop-blur-lg p-6 md:hidden flex flex-col justify-center items-center lg:hidden">
            <ul className='flex items-center flex-col'>
              <li className='py-4'>
                <Link to={"/dashboard"} onClick={toggleNavbar} className='text-neutral-500'>Dashboard</Link>
              </li>
              
              <li className='py-4'>
                <Link to={"/packages"} onClick={toggleNavbar} className='text-neutral-500'>Packages</Link>
              </li>
              <li className='py-4'>
                <Link to={"/our-policies"} onClick={toggleNavbar} className='text-neutral-500'>Our Policies</Link>
              </li>
              <li className='py-4'>
                <Link to={"/shipping-address"} onClick={toggleNavbar} className='text-neutral-500'>Shipping Address</Link>
              </li>
              <li className='py-4'>
                <a href="https://rmbdeals.com" onClick={toggleNavbar} target="_blank" className="text-neutral-500" >Buy RMB</a>
              </li>
            </ul>
          </div>
        }
      </div>

    </nav>
  )
}

export default AuthNavbar
