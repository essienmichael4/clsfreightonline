import ClientPayments from "./_compenents/ClientPayments"

const Payments = () => {
  return (
    <div className="container mx-auto">
        <div className="mt-12">
            <div className="px-4 mt-10 rounded-lg">
                <h2 className="font-bold text-3xl sm:font-normal  tracking-wide">Payment Info</h2>
                <p className="text-xs md:w-1/2 text-muted-foreground">
                    Please confirm your payments with CSL accounts officer on Call/WhatsApp via <span className="text-nowrap">(+233) 244 699 112</span> only.
                    You can also send payment slips to the front desk of CSL Freight at Tabora Junction.
                </p>
            </div>
            <div className="px-4 mt-4">
                <div>
                    <h4 className="text-sm font-bold">My Payment Summary</h4>
                </div>
                <ClientPayments />
            </div>

            <div className="flex flex-wrap mt-5 px-4 md:px-0">
                    <div className="w-full md:w-1/2 lg:w-1/3 sm:px-4 py-2 mb-8">
                        <div className="border h-full p-4 border-gray-300 rounded-md">
                            <p className="font-bold mt-2 text-lg">Bank: GCB Bank</p>
                            <p className="text-sm mt-3">Branch Name: Accra North </p>
                            <p className="text-sm mt-3">Account Number: 1391180001895 </p>
                            <p className="test-sm my-3">Account Name: CLIXMA TRADING</p>
                            <hr />
                            <p className="font-bold mt-4 text-lg">Bank: Ecobank Ghana</p>
                            <p className="text-sm mt-3">Branch Name: Ring Road </p>
                            <p className="text-sm mt-3">Account Number: 1441004848212 </p>
                            <p className="test-sm mt-3">Account Name: CLIXMA TRADING</p>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 lg:w-1/3 sm:px-4 py-2 mb-8">
                        <div className="border h-full border-gray-300 p-4 rounded-md">
                            <p className="font-bold mt-2 text-lg">BLU PAY DETAILS</p>
                            <p className="text-xs uppercase ">For all Ghanaian Mobile Money Acconuts</p>
                            <p className="test-sm mt-3">USSD Code: Dail *789*3*411#</p>
                            <p className="test-sm mt-3">Account Name: CLIXMA TRADING</p>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/3 sm:px-4 py-2 mb-8">
                        <div className="border h-full border-gray-300 p-4 rounded-md">
                            <p className="font-bold uppercase mt-2 text-lg">USD Dollar Physical Payments</p>
                            <p className="text-xs uppercase ">For those paying with USD, please take note of the following.</p>
                            <div className="mt-3 flex flex-col gap-2">
                                <p className="text-sm">- We only accept USD50 or USD100 notes</p>
                                <p className="text-sm">- We only accept from series 2013 and above</p>
                                <p className="text-sm">- USD notes must not have oil, dust and any form of dents.</p>
                            </div>
                        </div>
                    </div>
                </div>
        </div>

    </div>
  )
}

export default Payments
