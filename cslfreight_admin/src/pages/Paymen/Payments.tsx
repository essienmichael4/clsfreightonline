import { Plus } from "lucide-react"
import CreatePaymentDialog from "./_components/CreatePayment"
import AllPayments from "./_components/AllPayments"

const Payments = () => {
  return (
    <>
        <div className="container px-4 mx-auto">
            <div className="mt-6 flex items-center justify-between">
                <h3 className="font-bold">Payments</h3>
                <div>
                <CreatePaymentDialog trigger={
                    <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                    <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add Payment</span>
                    </button>}
                />
                </div>
            </div>
            <AllPayments />
        </div>
    </>
  )
}

export default Payments
