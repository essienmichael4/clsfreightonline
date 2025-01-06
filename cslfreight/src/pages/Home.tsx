import Faqs from "@/components/Faq"
import Services from "../components/Services"
import Hero from "../components/Hero"
import Footer from "@/components/Footer"
import Testimonials from "@/components/Testimonials"
import Announcement from "@/components/Announcement"

const Home = () => {
  return (
    <>
        {/* <Navbar /> */}
        <div className="container mx-auto">
            <Announcement />
            <div className='mx-auto px-6 max-w-7xl pt-12'>
                <Hero />
            </div>
        </div>
        <div className='mx-auto max-w-7xl '>
            <Services />
            <Testimonials />
        </div>
        <div className="container mx-auto">
            <div className='mx-auto px-6 max-w-7xl '>
                {/* <Process /> */}
                <Faqs />
            </div>
        </div>
        <Footer />
    </>
  )
}

export default Home
