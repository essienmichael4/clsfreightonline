import { DataTableColumnHeader } from "@/components/DataTable/ColumnHeader"
import useAxiosToken from "@/hooks/useAxiosToken"
import { User } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Edit, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"
import AddUser from "./AddUser"

const emptyData: any[]= []

const Users = () => {
  const axios_instance_token = useAxiosToken()
  const usersQuery = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async() => await axios_instance_token.get(`/users`).then(res => {
      return res.data
    })
})

const columns:ColumnDef<User>[] =[{
    accessorKey: "id",
    header:({column})=>(<DataTableColumnHeader column={column} title='ID' />),
    cell:({row}) => <div>
        <Link to={`./${row.original.id}`}>
            <span className='text-gray-400'>#</span>{row.original.id}
        </Link>
    </div>
},{
    accessorKey: "name",
    header:({column})=>(<DataTableColumnHeader column={column} title='Name' />),
    cell:({row}) => <div>
        <p className='-mb-1 font-medium'>{row.original.name}</p>
        <span className='-mt-2 text-xs text-gray-300'>{row.original.email}</span>
    </div>
},{
    accessorKey: "createdAt",
    header:({column})=>(<DataTableColumnHeader column={column} title='Day Created' />),
    cell:({row}) => <div>
        <span 
            > {row.original.createdAt} </span> 
    </div>
},{
  accessorKey: "updatedAt",
  header:({column})=>(<DataTableColumnHeader column={column} title='Actions' />),
  cell:({}) => <div>
      <span 
        className="flex gap-2 items-center"  ><Edit className="w-4 h-4 text-emerald-400"/> <Trash2 className="w-4 h-4 text-rose-400" /> </span> 
  </div>
}]

  const table = useReactTable({
      data: usersQuery.data || emptyData,
      columns,
      getCoreRowModel: getCoreRowModel(),  
  })
  return (
    <>
      <div className="container px-4 mx-auto">
        <div className="mt-4 flex items-center justify-between">
          <h3>All Users</h3>
          <div>
            <AddUser trigger={
              <button className="py-2 px-2 md:px-4 flex items-center rounded-md bg-gradient-to-r from-blue-500 to-blue-800 text-white">
                <Plus className="w-4 h-4 mr-2 text-white"/> <span className="text-xs md:text-sm">Add User</span>
              </button>
              } /> 
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
          </div>
      </div>
    </>
  )
}

export default Users
