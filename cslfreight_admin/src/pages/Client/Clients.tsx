import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Client } from "@/lib/types"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import EditClientDialog from "./_components/EditClient"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Search } from "lucide-react"
import { useState } from "react"
import { useClients } from "@/hooks/useClients"
import { useDebounce } from "use-debounce"

const emptyData: any[]= []

const Clients = () => {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState("")
  const [debouncedValue] = useDebounce(search, 500)
  
  const clientsQuery = useClients(page, limit, debouncedValue)

  const columns:ColumnDef<Client>[] =[{
      accessorKey: "id",
      header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
      cell:({row}) => <div>
        <Link to={`./${row.original.id}`}>
            <span className='text-gray-400'>#</span>{row.original.id}
        </Link>
      </div>
    },{
        accessorKey: "shippingMark",
        header:({column})=>(<DataTableColumnHeader column={column} title='Shipping Mark' />),
        cell:({row}) => <div>
            <span className='text-gray-500'>{row.original.shippingMark}</span>
        </div>
    },{
        accessorKey: "email",
        header:({column})=>(<DataTableColumnHeader column={column} title='Email' />),
        cell:({row}) => <div>
            <span className='text-gray-500'>{row.original.email}</span>
        </div>
    },{
        accessorKey: "phone",
        header:({column})=>(<DataTableColumnHeader column={column} title='Phone' />),
        cell:({row}) => <div>
            <span className='text-gray-500'>+{row.original.phone || "-"}</span>
        </div>
    },{
        accessorKey: "createdAt",
        header:({column})=>(<DataTableColumnHeader column={column} title='Day Created' />),
        cell:({row}) => <div className='text-muted-foreground text-nowrap'>
            {new Date(row.original.createdAt as string).toDateString()}
        </div>
    },{
    accessorKey: "actions",
    header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
    cell:({row}) => <div>
      <span className="flex gap-2 items-center">
          <EditClientDialog page={page} limit={limit} search={debouncedValue} client={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
          {/* <DeleteUser user={row.original} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} /> */}
      </span>
    </div>
  }]

  const table = useReactTable({
    data: clientsQuery.data?.data || emptyData,
    columns,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(), 
    state:{
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      }
    },
    pageCount: clientsQuery.data?.meta?.pageCount,
    getPaginationRowModel: getPaginationRowModel(),
  })

    return (
      <>
        <div className="container px-4 mx-auto">
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-bold">All Clients</h3>
              <div className="w-full sm:w-[320px]">
                <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                  <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Plur 890987645368" 
                    onChange={e => {
                      setSearch(e.target.value)
                      setPage(1)
                      }
                    } className="outline-none text-sm w-full"/>
                </div>
              </div>
            </div>

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
                        <span className="ml-1">of {clientsQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(clientsQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(clientsQuery.data?.meta.pageCount))}
                        disabled={page === Number(clientsQuery.data?.meta.pageCount)}>
                        <ChevronsRight size={20} />
                      </button>
                  </div>

                  {/* <div className="flex space-x-2">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    Previous
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    Next
                    </Button>
                  </div> */}
                </div>
            </div>
        </div>
      </>
    )
}

export default Clients
