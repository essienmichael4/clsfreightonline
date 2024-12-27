import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div className='py-8 bg-gradient-to-r from-blue-500 to-blue-800 mt-20 px-4'>
        <div className='container mx-auto text-white'>
            <div className='flex flex-col md:flex-row md:justify-between items-start'>
                <div >
                    <div className='flex'>
                        <h2 className='text-2xl md:text-4xl pr-2 md:pr-4 '>CSL Freight Forwarding</h2>
                    </div>
                    <div className="mt-8 space-y-2">
                        <p>contact@rmbdeals.com</p>
                        <p>(+233) 244 699 112</p>
                    </div>
                    <div className="mt-8 italic flex flex-col gap-2">
                        <p>First Storey Building on the Right</p>
                        <p>Tabora Junction Bus Stop - Alaji Road</p>
                        <p>Accra, Ghana</p>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                    <div className='flex'>
                        <h2 className='text-2xl md:text-xl pr-2 md:pr-4 '>Our Services</h2>
                    </div>
                    <div className="mt-2 space-y-2">
                        <p className="text-sm">Air Freight</p>
                        <p className="text-sm">Ocean Freight</p>
                        <p className="text-sm">Land Express</p>
                    </div>
                    <div className='flex mt-4'>
                        <h3 className='text-2xl md:text-xl pr-2 md:pr-4 '>Quick Links</h3>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Link className="text-sm" to={"/about"}>About</Link>
                        <Link className="text-sm" to={"/contact"}>Contact</Link>
                    </div>
                </div>
                <div className="flex flex-col gap-2 mt-8 md:mt-0">
                    <div className='flex'>
                        <h3 className='text-2xl md:text-xl pr-2 md:pr-4 '>Affiliated Links</h3>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <a href="https://rmbdeals.com" target="_blank" className="text-sm" >rmbdeals.com</a>
                    </div>                    
                    <div className='flex mt-8'>
                        <h3 className='text-2xl md:text-xl pr-2 md:pr-4 '>Channels</h3>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {/* <a href="https://rmbdeals.com" target="_blank" className="text-sm" >rmbdeals.com</a> */}
                    </div>                    
                </div>
            </div>
            <div className='mt-8 flex items-center justify-between border-t pt-4 flex-col sm:flex-row gap-4'>
                <p className="text-xs">© 2024 New Edge Group. All rights reserved</p>
                <div className='flex gap-8 '>
                    <p className="text-xs">Privacy Policy</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer
