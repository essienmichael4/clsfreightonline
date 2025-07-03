import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import useAxiosToken from "@/hooks/useAxiosToken"
import { Client } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Link } from "react-router-dom"
import EditClientDialog from "./_components/EditClient"
import { Edit, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const emptyData: any[]= []

const Clients = () => {
  const axios_instance_token = useAxiosToken()
  const [filtering, setFiltering] = useState("")
  
  const clientsQuery = useQuery<Client[]>({
      queryKey: ["clients"],
      queryFn: async() => await axios_instance_token.get(`/users/clients`).then(res => {
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
          <EditClientDialog client={row.original} trigger={<button><Edit className="w-4 h-4 text-emerald-400"/></button>} />
          {/* <DeleteUser user={row.original} trigger={<button><Trash2 className="w-4 h-4 text-rose-400" /></button>} /> */}
      </span>
    </div>
  }]

  const table = useReactTable({
    data: clientsQuery.data || emptyData,
    columns,
    getCoreRowModel: getCoreRowModel(), 
    initialState: {
      pagination: {
        pageSize: 20
      }
    },
    state:{
      globalFilter: filtering
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

    return (
      <>
        <div className="container px-4 mx-auto">
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-bold">All Clients</h3>
              <div className="w-full sm:w-[320px]">
                <div className="flex w-full border h-full items-center px-2 py-2 gap-2 rounded-md focus-within:border-gray-500">
                  <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
                  <input type="text" placeholder="Plur 890987645368" onChange={e => setFiltering(e.target.value)} className="outline-none text-sm w-full"/>
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
                <div className="flex items-center justify-end space-x-2 py-4">
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
                </div>
            </div>
        </div>
      </>
    )
}

export default Clients
