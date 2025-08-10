import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePayments } from "@/hooks/usePayments"
import { Payment } from "@/lib/types"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2 } from "lucide-react"
import { useState } from "react"
import EditPayment from "./EditPayment"
import DeletePayment from "./DeletePayment"

const emptyData: any[]= []

const AllPayments = () => {
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    
    const paymentQuery = usePayments(page, limit)

    const columns:ColumnDef<Payment>[] =[{
        accessorKey: "id",
        header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
        cell:({row}) => <div className="text-xs">
            {/* <Link to={`./${row.original.id}`}> */}
                <span className='text-gray-400'>#</span>{row.original.id}
            {/* </Link> */}
        </div>
        },{
            accessorKey: "name",
            header:({column})=>(<DataTableColumnHeader column={column} title='Name' />),
            cell:({row}) => <div className="flex flex-col gap-2 text-xs">
                <span>{row.original.client?.shippingMark}</span>
            </div>
        },{
            accessorKey: "paidShippingRate",
            header:({column})=>(<DataTableColumnHeader column={column} title='Paid Shipping' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.paidShippingRate}</span>
            </div>
        },{
            accessorKey: "paymentMethod",
            header:({column})=>(<DataTableColumnHeader column={column} title='Payment Method' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.paymentMethod}</span>
            </div>
        },{
            accessorKey: "reference",
            header:({column})=>(<DataTableColumnHeader column={column} title='Payment Reference' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.reference}</span>
            </div>
        },{
            accessorKey: "addedBy",
            header:({column})=>(<DataTableColumnHeader column={column} title='Added By' />),
            cell:({row}) => <div className="text-xs">
                <span className='text-gray-500'>{row.original.user?.name}</span>
            </div>
        },{
        accessorKey: "ids",
        header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
        cell:({row}) => <div>
            <span className="flex gap-2 items-center"  >
                <EditPayment page={page} limit={limit} payment={row.original}  trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
                <DeletePayment page={page} limit={limit} payment={row.original}  trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} /> 
            </span> 
        </div>
        }
    ]

    const table = useReactTable({
        data: paymentQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(), 
    })

    const content = paymentQuery.isLoading ? <Skeleton>
      <div className="sm:h-72 md:h-80 lg:h-96 w-full">

      </div>
    </Skeleton> : paymentQuery.data?.data && paymentQuery.data?.data.length > 0 ? <>
        <div className="my-8 p-2 md:px-0 rounded-2xl">
            <div className="w-full rounded-md  bg-white/75">
                <Table>
                    <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                            <TableHead key={header.id}>
                                {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                    )}
                            </TableHead>
                            )
                        })}
                        </TableRow>
                    ))}
                    </TableHeader>
                    <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => (
                            <TableCell className='py-6' key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                            ))}
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                        </TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4 mt-4">
                  <div>
                    <span className="mr-2">Items per page</span>
                    <select 
                      className="border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2"
                      value={limit}
                      onChange={e=> {setLimit(Number(e.target.value))}} >

                      {[10,20,50,100].map((pageSize)=>(
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-2">
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(1)}
                        disabled={page === 1}>
                        <ChevronsLeft size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page - 1)}
                        disabled={page === 1}>
                        <ChevronLeft size={20} />
                      </button>

                      <span className="flex items-center">
                        <input 
                          className="w-16 p-2 rounded-md border border-gray-300 text-center"
                          min={1}
                          max={table.getPageCount()}
                          type="number"
                          value={table.getState().pagination.pageIndex + 1}
                          onChange={e=> {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            setPage(page)
                          }}
                        />
                        <span className="ml-1">of {paymentQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(paymentQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(paymentQuery.data?.meta.pageCount))}
                        disabled={page === Number(paymentQuery.data?.meta.pageCount)}>
                        <ChevronsRight size={20} />
                      </button>
                  </div>
            </div>
        </div>
    </>: <div className='bg-gray-100 rounded-lg h-[300px] flex flex-col items-center justify-center'>
        No payments added yet...
        <p className="text-sm text-center text-muted-foreground">Try adding one.</p>
    </div>

    return (
        <div className="mt-4">{content}</div>
    )
}

export default AllPayments
