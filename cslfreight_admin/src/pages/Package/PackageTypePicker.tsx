import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { axios_instance_token } from '@/api/axios'
import { PackageTypeAndRate } from '@/lib/types'

interface Props {
    onChange: (value: string)=>void,
    defaultValue?: string
}

const PackageTypePicker = ({onChange, defaultValue}:Props) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<string>("")

    useEffect(() => {
        if (defaultValue) {
            setValue(defaultValue);
        }
    }, [defaultValue]);

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    const packageTypeQuery =  useQuery<PackageTypeAndRate[]>({
        queryKey: ["packages", "type"],
        queryFn: async() => await axios_instance_token.get("/packages/shipping-rates").then(res => res.data)
    })

    const selectedPackageType = packageTypeQuery.data?.find((packageType:PackageTypeAndRate)=> packageType.description === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                    {selectedPackageType ? (
                        <StatusRow packageType={selectedPackageType.description} />
                    ) : (
                        "Select package type"
                    )}
                    <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className='wi[200px] p-0'>
                <Command onSubmit={e=> e.preventDefault()}>
                    <CommandInput placeholder='Search shipping marks'/>
                    <CommandGroup>
                        <CommandList>
                            {packageTypeQuery?.data && 
                                packageTypeQuery.data.map((packageType:PackageTypeAndRate) => {
                                    return (
                                        <CommandItem key={packageType.id} onSelect={()=>{
                                            setValue(packageType.description)
                                            setOpen(prev=>!prev)
                                        }}>
                                        <StatusRow packageType={packageType.description} />
                                        <Check className={cn("mr-2 w-4 h-4 opacity-0", value===packageType.description && "opacity-100")} />
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

function StatusRow({packageType}:{packageType:string}){
    return (
        <div className="flex items-center gap-2 text-xs">
            {/* <span role='img'>{category.icon}</span> */}
            <span>{packageType}</span>
        </div>
    )
}

export default PackageTypePicker
