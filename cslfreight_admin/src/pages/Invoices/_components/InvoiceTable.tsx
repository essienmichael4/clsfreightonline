import type { Package } from "@/lib/types"

interface Props {
  selected: Package[],
  total: number,
  rate: number,
  totalCbm: number,
  totalQty: number
}

const InvoiceTable = ({ selected, rate, total, totalCbm, totalQty }: Props) => {

  return (
    <div className="mt-6 rounded-lg overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead className="border-b">
          <tr>
            <th className="text-xs px-2 py-4 text-left">Loading Date</th>
            <th className="text-xs px-2 py-4 text-left">Description</th>
            <th className="text-xs px-2 py-4 text-left">Tracking No.</th>
            <th className="text-xs px-2 py-4 text-right">Qty/Ctns</th>
            <th className="text-xs px-2 py-4 text-right">CBM</th>
            <th className="text-xs px-2 py-4 text-right">Rate</th>
            <th className="text-xs px-2 py-4 text-right">Price (USD)</th>
          </tr>
        </thead>
        <tbody>
          {selected.map((row) => (
            <tr key={row.id}>
              <td className="px-2 py-4 text-xs">{new Date(row.loaded as string).toDateString()}</td>
              <td className="px-2 py-4 text-xs">{row.package}</td>
              <td className="px-2 py-4 text-xs">{row.trackingNumber}</td>
              <td className="px-2 py-4 text-right text-xs">{row.quantity}</td>
              <td className="px-2 py-4 text-right text-xs">{row.cbm}</td>
              <td className="px-2 py-4 text-right text-xs"></td>
              <td className="px-2 py-4 text-right text-xs">{(Number(row.cbm) * Number(row.packageType?.rate)).toFixed(2)}</td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-semibold">
            <td className="p-2 text-left text-xs">Tax</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
          </tr>
          <tr className="bg-gray-50 font-semibold">
            <td className="p-2 text-left text-xs">Subtotal</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-left">{}</td>
            <td className="p-2 text-right text-xs">{totalQty}</td>
            <td className="p-2 text-right text-xs">{totalCbm}</td>
            <td className="p-2 text-right text-xs">{rate}</td>
            <td className="p-2 text-right text-xs">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default InvoiceTable

