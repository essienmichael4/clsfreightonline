import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Client, Data } from "@/lib/types"
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import useAxiosToken from "@/hooks/useAxiosToken"

interface Props {
    name?: string
}

const emptyData: any[]= []

const Members = ({name}: Props) => {
    const axios_instance_token = useAxiosToken()
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)
    
    const membershipQuery = useQuery<Data>({
        queryKey: ["memberships", name, page, limit],
        queryFn: async() => await axios_instance_token.get(`/users/memberships`, {
            params: {name, page, take: limit}
        }).then(res => {
            console.log(res.data);
            
            return res.data
        })
    })

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
            accessorKey: "totalShippingRate",
            header:({column})=>(<DataTableColumnHeader column={column} title='Total Shipping' />),
            cell:({row}) => <div>
                <span className='text-gray-500'>+{row.original.totalShippingRate || "-"}</span>
            </div>
        },{
        accessorKey: "membershipTier",
        header:({column})=>(<DataTableColumnHeader column={column} title='Membership Type' />),
        cell:({row}) => <div>
        <span className={`
            ${!row.original.membershipTier?.priority || row.original.membershipTier?.priority === 1 && "bg-[#ffdbb7] text-[#cd7f32]"}
            ${row.original.membershipTier?.priority === 2 && "bg-[#f1f1f1] text-[#c0c0c0]"}
            ${row.original.membershipTier?.priority === 3 && "bg-amber-100 text-amber-600"}
            ${row.original.membershipTier?.priority === 4 && "bg-emerald-100 text-emerald-600"}
            ${row.original.membershipTier?.priority === 5 && "bg-cyan-100 text-cyan-600"}
             flex gap-2 items-center px-5 py-2 rounded-lg`}>
            <div className={`
                ${!row.original.membershipTier?.priority || row.original.membershipTier?.priority === 1 && "bg-[#cd7f32]"}
                ${row.original.membershipTier?.priority === 2 && "bg-[#c0c0c0]"}
                ${row.original.membershipTier?.priority === 3 && "bg-amber-600"}
                ${row.original.membershipTier?.priority === 4 && "bg-emerald-600"}
                ${row.original.membershipTier?.priority === 5 && "bg-cyan-600"}
                w-2 h-2 rounded-full`}>
            </div>{row.original.membershipTier?.name}
        </span>
        </div>
    }]

    const table = useReactTable({
        data: membershipQuery.data?.data || emptyData,
        columns,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(), 
        state:{
        pagination: {
            pageIndex: page - 1,
            pageSize: limit,
        }
        },
        pageCount: membershipQuery.data?.meta?.pageCount,
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
      <>
        <div className="container px-4 mx-auto">
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
                        <span className="ml-1">of {membershipQuery.data?.meta.pageCount}</span>
                      </span>

                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(page + 1)}
                        disabled={ page === Number(membershipQuery.data?.meta.pageCount) }>
                        <ChevronRight size={20} />
                      </button>
                      <button
                        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                        onClick={()=>setPage(Number(membershipQuery.data?.meta.pageCount))}
                        disabled={page === Number(membershipQuery.data?.meta.pageCount)}>
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

export default Members
