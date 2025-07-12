import Footer from "@/components/Footer"
import { Clock } from "lucide-react"

const Terms = () => {
  return (<>
    <div className="container mx-auto">
        <div className="mt-12">
            <div className="px-6 mt-10 rounded-lg">
                <h2 className="font-bold text-3xl sm:font-normal sm:text-6xl tracking-wide">Our Terms & conditions</h2>
                <p className="flex items-center text-sm gap-2 text-gray-500"><Clock className="w-4 h-4"/>Last updated: 2 January 2025</p>

                <div className="mt-8">
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 01</h4>
                        <p> Provisional invoices are issued after loading in China, we will re-issue new invoices once packages arrive and
                        are rechecked in Ghana for confirmation.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 02</h4>
                        <p>Dangerous and inflammable goods like charcoal, and gunpowder cannot be shipped via our shared shipping model.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 03</h4>
                        <p>Our minimum CBM is pegged at 0.01cbm and you are billed per consolidated LCL invoice. For FCL, please reach out to our admin for arrangements.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 04</h4>
                        <p>Please note that your shipping fees do not include delivery to your destination 
                            - office or home but is offered on optional basis subjected to our terms and conditions.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 05</h4>
                        <p>You are liable to pay USD 5 per day/package as warehousing fees after 7 days of cargo 
                            arrival for pickup or delivery or pay at a declared flat rate as a consideration to customers.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 06</h4>
                        <p>Perishables such as food products and items with very short shelf life are NOT suitable for this model.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 07</h4>
                        <p>You shall pay at least 50% deposit of your total invoice 7 days after loading and full payment on container/vessel arrival at Tema port before customs clearance is completed. This is to make funds available for timely shipment & clearance for your own benefit.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 08</h4>
                        <p>All fragile items must be covered and protected in styrofoam, wooden pallets and frame or get damaged at your own risk.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 09</h4>
                        <p> Small packages have higher risks of getting lost. We cannot replace or refund for all such packages below
                        0.05cbm.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 10</h4>
                        <p>For packages above 0.05cbm, we will refund the full cost of item but not exceeding 2 times the shipping costs.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 11</h4>
                        <p>Our departure timelines are subject to cargo /ship or airplane availability.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 12</h4>
                        <p>Vessel lines or Ship transit times may change without prior notice.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 13</h4>
                        <p>Cargo may require inspection by customs and other regulatory bodies at their instance and time.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 14</h4>
                        <p>We are committed to ensuring that your packages get to you safely and timely.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 15</h4>
                        <p> Measurements will be re-taken at the warehouse in Ghana to confirm CBM before payments are made.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 16</h4>
                        <p>Full payment of actual shipping fees with corresponding CBM is done in Ghana before pickup.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 17</h4>
                        <p> Shipping rates for contraband or dangerous cargo and packages without MSDS are different from normal
                        goods and are shipped in separate container loadings.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 18</h4>
                        <p>Your goods will be security checked and if narcotics, ammunition, or banned substances are detected, persons will both be reported to relevant authorities without prior notice.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 19</h4>
                        <p>You can only make payment into the assigned accounts attached to your invoice.</p>
                    </div>
                    <div className="mt-4 gap-4 flex flex-col p-4 md:w-3/4">
                        <h4 className="text-3xl text-gray-500"># 20</h4>
                        <p>Please note that all payments are in US Dollar rate with Ghana Cedi equivalent at the time of payment.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
    </>
  )
}

export default Terms