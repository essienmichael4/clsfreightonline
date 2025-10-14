'use client'

import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
    onChange: (value: "Public" | "Unlisted" | "Private" | "Scheduled")=>void
}

const PremierePicker = ({onChange}:Props) => {
    const stat:("Public" | "Unlisted" | "Private" | "Scheduled")[] = ["Public" , "Unlisted" , "Private" , "Scheduled"]
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState<"Public" | "Unlisted" | "Private" | "Scheduled">("Private")

    useEffect(()=>{
        if(!value) return
        onChange(value)
    }, [onChange, value])

    

    const selectedCategory = stat.find((status:"Public" | "Unlisted" | "Private" | "Scheduled")=> status === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button variant={"outline"} role='combobox' aria-expanded={open} className='w-full text-xs justify-between'>
                {selectedCategory ? (
                    <StatusRow status={selectedCategory} />
                ) : (
                    "Select premiere"
                )}
                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50'/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
            <Command onSubmit={e=> e.preventDefault()}>
                <CommandInput placeholder='Search premiere'/>
                <CommandGroup>
                    <CommandList>
                        {stat.map((status:"Public" | "Unlisted" | "Private" | "Scheduled") => {                              
                                return (
                                    <CommandItem key={status} onSelect={()=>{
                                        setValue(status)
                                        setOpen(prev=>!prev)
                                    }}>
                                    <StatusRow status={status} />
                                    <Check className={cn("mr-2 w-4 h-4 opacity-0", value===status && "opacity-100")} />
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

function StatusRow({status}:{status:"Public" | "Unlisted" | "Private" | "Scheduled"}){
    return (
        <div className="flex items-center gap-2 text-xs">
            <span>{status}</span>
        </div>
    )
}

export default PremierePicker
