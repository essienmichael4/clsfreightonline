import Footer from "@/components/Footer"
import team from "@/assets/team.jpg"
import user1 from "@/assets/profile-pictures/user1.webp"
import user2 from "@/assets/profile-pictures/user2.webp"
import user3 from "@/assets/profile-pictures/user3.webp"
import global from "@/assets/global.webp"
import growth from "@/assets/growth.webp"
import quality from "@/assets/quality.webp"
import mteam from "@/assets/mteam.jpg"
import oteam from "@/assets/oteam.webp"
import customercare from "@/assets/customercare.webp"
import large from "@/assets/large.webp"
import customized from "@/assets/customized.webp"
import delivery from "@/assets/delivery.webp"

const About = () => {
  return (
    <>
      <div className="container mx-auto">
        <div className="mt-12">
          <div className="px-6 flex flex-wrap mt-10 rounded-lg justify-center items-center">
            <div className="p-2 w-full lg:w-1/2 space-y-4 md:pr-32">
              <h2 className="text-center lg:text-start text-3xl sm:text-5xl lg:text-6xl tracking-wide mb-10">
                Who Are We?
              </h2>
              <p className="mt-10 text-center lg:text-start text-neutral-500">We are committed to providing efficient and reliable freight forwarding services. Our team ensures that your goods are handled with care from origin to destination. Let us help you navigate the complexities of international shipping.</p>
              <p className="mb-6 text-center lg:text-start text-neutral-500">Our delighted clients are at the heart of our success and their satisfaction drives us to deliver exceptional logistics solutions tailored to their unique needs.</p>
              <div className="flex items-center justify-center lg:justify-start mt-8">
                <img src={user1} alt='image of testator' className='w-12 h-12 rounded-full mr-3 border border-neutral-500'/>
                <img src={user2} alt='image of testator' className='w-12 h-12 rounded-full mr-3 border border-neutral-500'/>
                <img src={user3} alt='image of testator' className='w-12 h-12 rounded-full mr-3 border border-neutral-500'/>
                <p className="w-28 text-sm text-neutral-500">800+ happy clients</p>
              </div>
              <p className="text-neutral-500 text-center lg:text-start">Great experience with CSL Freight.  Reliable and efficient service.</p>
            </div>
            <div className="p-2 w-full h-full lg:w-1/2">
                <img src={team} alt="" className="rounded-lg h-full"/>
            </div>
          </div>
        </div>  
        <div className="mt-12">
          <div className="text-center lg:w-2/3 mx-auto">
            <span className="text-blue-700 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase bg-neutral-100/80">Our Journey</span>
            <h2 className="text-3xl sm:text-5xl  mt-10 tracking-wide">
              Connecting China and Ghana Through Reliable Logistics Solutions
            </h2>
          </div>
          <div className="flex flex-wrap mt-12">
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={growth} alt="" className="rounded-lg aspect-video"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Establishment and Growth</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  CSL FREIGHT FORWARDING was founded in 2005 logistics company in China. Over the years, we have expanded our operations and built a strong reputation for excellence in freight forwarding services to Rwanda, Liberia, Nigeria, Sierre Leone and now Ghana in 2020.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={quality} alt="" className="rounded-lg aspect-video"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Commitment to Quality</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  We are committed to providing efficient and cost-effective shipping solutions while maintaining the highest standards of quality and reliability. Our dedication to customer satisfaction sets us apart in the industry.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={global} alt="" className="rounded-lg aspect-video"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Global Reach</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  With a global network of partners and agents, we have the capability to handle shipments of any size and complexity, ensuring seamless transportation from China to Ghana and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="text-center lg:w-2/3 mx-auto">
            <span className="text-blue-700 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase bg-neutral-100/80">Our Team Members</span>
            <h2 className="text-3xl sm:text-5xl  mt-10 tracking-wide">
            Dedicated Professionals Driving Our Success
            </h2>
          </div>
          <div className="flex flex-wrap mt-12">
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={mteam} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Management Team</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  Our experienced management team brings a wealth of knowledge and expertise in logistics and supply chain management, guiding the company towards continued growth and success.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={oteam} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Operations Staff</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  Our skilled operations staff ensures the smooth handling and transportation of goods, providing reliable and efficient service to our valued clients.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={customercare} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Customer Support</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  Our friendly and knowledgeable customer support team is dedicated to meeting the unique needs of each client, providing personalized assistance and ensuring a seamless shipping experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div className="text-center lg:w-2/3 mx-auto">
            <span className="text-blue-700 rounded-full h-6 text-sm font-medium px-2 py-1 uppercase bg-neutral-100/80">Our Achievements</span>
            <h2 className="text-3xl sm:text-5xl  mt-10 tracking-wide">
            Delivering Excellence In Every Project
            </h2>
          </div>
          <div className="flex flex-wrap mt-12">
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={large} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Large-Scale & Small Scale Shipments</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  We have successfully handled large-scale shipments of industrial equipment and machinery from China to Ghana, demonstrating our capability to manage complex logistics challenges.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={delivery} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Timely Deliveries in 40 - 45 days on Average</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  Our track record of timely deliveries has earned us the trust of our clients, ensuring that their cargo arrives in Ghana on schedule, every time.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 p-2">
              <img src={customized} alt="" className="rounded-lg aspect-auto"/>
              <div className="mt-4 text-left">
                <h3 className="text-2xl mb-2">Customized Solutions</h3>
                <div className="text-neutral-500">
                  <p className="mb-3">
                  We have developed customized shipping solutions for diverse industries, including electronics, automotive, and consumer goods, tailoring our services to meet specific requirements and exceed expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default About
