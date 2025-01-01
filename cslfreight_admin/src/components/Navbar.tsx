import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from './ui/button'
import { LogOut, Menu, User } from 'lucide-react'
import useAuth from '@/hooks/useAuth'
import { useResolvedPath } from "react-router-dom"


interface NavbarProps{
  toggleNavbar: () => void
}

const Navbar = ({toggleNavbar}:NavbarProps) => {
  const {setAuth} = useAuth()
  // const path = useResolvedPath().pathname.split("/")[1]
  const path = useResolvedPath().pathname.split("/")[1].toLocaleUpperCase()

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-100/80">
      <div className="lg:container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className='flex items-center gap-4'>
            <div className="hidden md:flex flex-col justify-end">
              <button onClick={toggleNavbar}><Menu className='text-muted-foreground' /></button>
            </div>
            <h2 className="text-xl tracking-tight text-muted-foreground">{path}</h2>
          </div>

          <div className="flex items-center">
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className='w-10 h-10 rounded-full'><User className="h-6 w-6 text-muted-foreground" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{
                            setAuth(undefined)
                        }}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
          </div>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
