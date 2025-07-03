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
            </div>
            <div className="p-2 w-full lg:w-1/2 space-y-4">
                <div className="">
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">How much do you charge?</AccordionTrigger>
                            <AccordionContent >
                                We charge according to your type of goods, volumes and weight. Kindly contact our customer care for further assistance with the WhatsApp button on this site. Thank you.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">Where are your warehouses located?</AccordionTrigger>
                            <AccordionContent>
                                Our China warehouse is located in Guangdong province. We have warehouses in Accra, Kumasi and Sunyani in Ghana, West Africa.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">How can I get in touch?</AccordionTrigger>
                            <AccordionContent>
                                You can call or WhatsApp 0244699112 or visit our office at Tabora Junction (google map: CSL FREIGHT FORWARDING).
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="md:py-8">
                            <AccordionTrigger className="md:text-xl">I am not in Accra, how do I get my packages when they arrive?</AccordionTrigger>
                            <AccordionContent>
                            All containers are first offloaded in Accra. Packages in Kumasi, Sunyani & Koforidua will be sent to our warehouses in these locations. 
                            If you are not in any of these areas, your packages will be sent to your cargo station for free.
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
