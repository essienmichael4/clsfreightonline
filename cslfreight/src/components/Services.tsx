import ocean from "../assets/ocean.jpg"
import land from "../assets/land.jpg"
import air from "../assets/air.jpg"
import { Link } from "react-router-dom"

const Services = () => {
  return (
    <>
        <div className="mt-20 px-6 relative min-h-[800px]">
            <div className="text-center">
                <span className="text-blue-700 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase bg-neutral-100/80">Our Services</span>
                <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 tracking-wide">
                    Enjoy Cost-Efficient Transportation For Your Goods
                </h2>
            </div>
            <div className="flex flex-col items-center text-center mt-10">
                <div className="flex flex-wrap ">
                    <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                        <img src={ocean} alt="" className="rounded-lg aspect-video hover:aspect-auto"/>
                        <div className="mt-4 text-left">
                            <h3 className="text-2xl mb-2">Ocean Freight</h3>
                            <div className="text-neutral-500">
                                <p className="mb-3">
                                    Fast and efficient air freight services for time-sensitive shipments
                                </p>
                                <Link to={"/contact"} className='text-white  bg-blue-700 py-2 px-3 rounded-md'>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                        <img src={air} alt="" className="rounded-lg aspect-video hover:aspect-auto"/>
                        <div className="mt-4 text-left">
                            <h3 className="text-2xl mb-2">Air Freight</h3>
                            <div className="text-neutral-500">
                                <p className="mb-3">
                                    Reliable and cost-effective ocean freight services for large shipments
                                </p>
                                <Link to={"/contact"} className='text-white  bg-blue-700 py-2 px-3 rounded-md'>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                        <img src={land} alt="" className="rounded-lg aspect-video hover:aspect-auto"/>
                        <div className="mt-4 text-left">
                            <h3 className="text-2xl mb-2">Customs Clearance</h3>
                            <div className="text-neutral-500">
                                <p className="mb-3">
                                    Expert assistance with customs clearance to ensure smooth and timely delivery.
                                </p>
                                <Link to={"/contact"} className='text-white  bg-blue-700 py-2 px-3 rounded-md'>
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-20">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-10 tracking-wide">
                    Our Workflow Emphasizes Efficiency
                </h2>
            </div>
            <div className="flex flex-wrap mt-12">
                <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                    <div className="bg-[#21525A] h-full p-8 rounded-lg text-white">
                        <h4 className="mb-16 text-3xl">#1</h4>
                        <div  className="flex flex-col">
                            <p className="text-4xl mb-4">Precision In Delivery</p>
                            <p>Our commitment to delivery ensures that your cargo arrive on time every time.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                    <div className="bg-[#B9D038] h-full p-8 rounded-lg">
                        <h4 className="mb-16 text-3xl">#2</h4>
                        <div className="flex flex-col">
                            <p className="text-4xl mb-4">Tailored Solution Every Time</p>
                            <p>Our customer centric approach means personalized solutions for your unique cargo.</p>
                        </div>
                    </div>
                </div>
                <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
                    <div className="bg-gray-300 h-full p-8 rounded-lg">
                        <h4 className="mb-16 text-3xl">#3</h4>
                        <div className="flex flex-col">
                            <p className="text-4xl mb-4">Cutting Edge Technology</p>
                            <p>Our advanced tracking system provides real-time visibility into you shipment, ensuring you are in control</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Services
