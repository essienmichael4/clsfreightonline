import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { axios_instance_token } from '@/api/axios'
import { Client } from '@/lib/types'

interface Props {
    onChange: (value: string)=>void
}

const ShippingMark = ({onChange}:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const clientsQuery =  useQuery<Client[]>({
        queryKey: ["clients"],
        queryFn: async() => await axios_instance_token.get("/users/clients/shipping-marks").then(res => res.data)
    })

    const selectedShippingMark = clientsQuery.data?.find((client:Client)=> client.shippingMark === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedShippingMark ? (
                        <StatusRow shippingMark={selectedShippingMark.shippingMark} />
                    ) : (
                        "Select shipping mark"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='wi[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search shipping marks'/>
                    <CommandGroup>
                        <CommandList>
                            {clientsQuery?.data && 
                                clientsQuery.data.map((client:Client) => {
                                    return (
                                        <CommandItem key={client.id} onSelect={()=>{
                                            setValue(client.shippingMark)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow shippingMark={client.shippingMark} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===client.shippingMark && "opacity-100")} />
                                        </CommandItem>
                                    )
                                })}
                        </CommandList>
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

function StatusRow({shippingMark}:{shippingMark:string}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{shippingMark}</span>
        </div>
    )
}

export default ShippingMark
