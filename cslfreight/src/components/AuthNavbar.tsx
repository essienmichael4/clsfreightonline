import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import logo from '../assets/logo.webp'
import { Badge, CalculatorIcon, FileArchive, LogOut, Menu, User, X } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { GetTierBadgeClass } from "@/lib/helper"

const AuthNavbar = () => {
  const {auth, dispatch} = useAuth()
  const navigate = useNavigate()
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  
  const toggleNavbar = ()=>{
    setMobileDrawerOpen(!mobileDrawerOpen)
  }

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [width, setWidth] = useState<number>(0)
  const [length, setLength] = useState<number>(0)
  const [height, setHeight] = useState<number>(0)
  const [rate, setRate] = useState<number>(0)
  const [total, setTotal] = useState<number>(0)
  const handleCalculate = () => {
      if(width <= 0) return
      if(length <= 0) return
      if(height <= 0) return
      if(rate <= 0) return
      const weight = width * length * height
      setTotal(weight * rate)
  }

  const onCalculateClick = () => {
      setIsOpen(!isOpen)
  }

  return (
    <>
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
            <div className="flex items-center gap-2 relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className={`w-4 h-4 rounded-full ${GetTierBadgeClass(auth?.membershipTier?.priority)}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{auth?.membershipTier?.name ?? "Associate"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
                    <DropdownMenuItem onClick={()=>{navigate(`../attachments/${auth!.id}`)}}>
                        <FileArchive className="mr-2 h-4 w-4" />
                        <span>My Attachments</span>
                        <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onCalculateClick}>
                        <CalculatorIcon className="mr-2 h-4 w-4" />
                        <span>Calculate Fees</span>
                        <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{
                      dispatch({type:"REMOVE_AUTH",payload: undefined})
                    }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              <div className="md:hidden flex flex-col justify-end">
                <button onClick={toggleNavbar}>{mobileDrawerOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button>
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
      <div className={`${isOpen ? "block" : "hidden"} z-20 sm:w-[300px] sm:left-auto bg-white/75 fixed bottom-40 left-4 right-4 backdrop-blur-lg lg:bottom-48 lg:right-8 border border-orange-500 rounded-md`}>
          <div className="p-4 bg-orange-500 text-white relative">
              Calculate shipping fee 
              <button onClick={onCalculateClick} className="absolute right-2 top-2"><X /></button>
          </div>
          <div className="text-center my-2 ">
              <span className="text-xs">Est. shipping fee (USD)</span>
              <p className="text-3xl">$ {total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:3})}</p>
          </div>
          <div className="px-2 flex flex-wrap">
              <div className="w-1/2">
                  <div className="flex px-1 flex-col">
                      <label htmlFor="" className="text-xs">Length (m)</label>
                      <input type="number" onChange={(e)=>{
                          setLength(Number(e.target.value))
                          }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                  </div>
              </div>
              <div className="w-1/2">
                  <div className="flex px-1 flex-col">
                      <label htmlFor="" className="text-xs">Width (m)</label>
                      <input type="number" onChange={(e)=>{
                          setWidth(Number(e.target.value))
                          }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                  </div>
              </div>
              <div className="w-1/2 mt-2">
                  <div className="flex px-1 flex-col">
                      <label htmlFor="" className="text-xs">Height (m)</label>
                      <input type="number" onChange={(e)=>{
                          setHeight(Number(e.target.value))
                          }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                  </div>
              </div>
              <div className="w-1/2 mt-2">
                  <div className="flex px-1 flex-col">
                      <label htmlFor="" className="text-xs">CBM Rate</label>
                      <input type="number" onChange={(e)=>{
                          setRate(Number(e.target.value))
                          }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                  </div>
              </div>
          </div>
          <div className="px-3 mt-2 flex w-full">
              <button onClick={handleCalculate} className="py-3 w-full mb-2 text-xs text-white bg-orange-500 rounded-md">Calculate</button>
          </div>
      </div>
      {/* <div className="fixed bottom-24 right-4 lg:bottom-28 lg:right-8 rounded-full">
        <button onClick={onCalculateClick} className="p-3 text-orange-500 border-orange-500 border-2 rounded-full">
          <CalculatorIcon />
        </button>
      </div> */}
    </>
  )
}

export default AuthNavbar
