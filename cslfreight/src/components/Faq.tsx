// import { Link } from "react-router-dom"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

const Faqs = () => {
  return (
    <div className='mt-4 px-2 lg:px-0'>
        <div className="lg:px-6 py-8 flex flex-wrap mt-10 rounded-lg justify-center">
            <div className="p-2 w-full lg:w-1/2 space-y-4">
                <h3 className='text-3xl lg:text-5xl font-semibold lg:w-2/5'>FAQ's</h3>
                <div className="w-full lg:w-[80%]">
                    <p className="text-neutral-500">Find answers to some of the most common questions we receive from our customers. If you don’t find what you need, feel free to contact us directly.</p>
                </div>
                {/* <div className="mt-8">
                    <Link to={"/contact"} className="mt-4 py-2 px-4 bg-blue-700 rounded-lg text-white">Contact Us</Link>
                </div> */}
            </div>
            <div className="p-2 w-full lg:w-1/2 space-y-4">
                <div className="">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">How much do you charge?</AccordionTrigger>
                            <AccordionContent >
                            Apart from special goods, all normal packages starts at $190 Per CBM
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">Where are your warehouses located?</AccordionTrigger>
                            <AccordionContent>
                            We have Warehouses in Lapaz Nyamekye, Ghana, and Guangzhou, China.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">How can I get in touch?</AccordionTrigger>
                            <AccordionContent>
                            You can visit our Head Office at 18 Nii Okaiman West Road, Tabora Junction Bus Stop, Ghana or place a call with the button at the top section of this website.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">I am not in Accra, how do I get my packages when they arrive?</AccordionTrigger>
                            <AccordionContent>
                            Our 3 Main Direct Delivery Zones are Accra / Tema, Kumasi, and Sunyani. We will send your packages to various cargo stations for free for all other areas.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Faqs
