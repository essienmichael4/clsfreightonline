import { Outlet } from "react-router-dom"
import { CalculatorIcon, X } from "lucide-react"
import { useState } from "react"

const Calculator = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [width, setWidth] = useState<number>(0)
    const [length, setLength] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)
    const [rate, setRate] = useState<number>(0)
    const [total, setTotal] = useState<number>(0)
    const handleCalculate = () => {
        if(width <= 0) return
        if(length <= 0) return
        if(height <= 0) return
        if(rate <= 0) return
        const weight = width * length * height
        setTotal(weight * rate)
    }

    const onCalculateClick = () => {
        setIsOpen(!isOpen)
    }

  return (
    <>
        <Outlet />
        <div className={`${isOpen ? "block" : "hidden"} z-20 sm:w-[300px] sm:left-auto bg-white/75 fixed bottom-40 left-4 right-4 backdrop-blur-lg lg:bottom-48 lg:right-8 border border-orange-500 rounded-md`}>
            <div className="p-4 bg-orange-500 text-white relative">
                Calculate shipping fee 
                <button onClick={onCalculateClick} className="absolute right-2 top-2"><X /></button>
            </div>
            <div className="text-center my-2 ">
                <span className="text-xs">Est. shipping fee (USD)</span>
                <p className="text-3xl">$ {total.toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:3})}</p>
            </div>
            <div className="px-2 flex flex-wrap">
                <div className="w-1/2">
                    <div className="flex px-1 flex-col">
                        <label htmlFor="" className="text-xs">Length (m)</label>
                        <input type="number" onChange={(e)=>{
                            setLength(Number(e.target.value))
                            }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                    </div>
                </div>
                <div className="w-1/2">
                    <div className="flex px-1 flex-col">
                        <label htmlFor="" className="text-xs">Width (m)</label>
                        <input type="number" onChange={(e)=>{
                            setWidth(Number(e.target.value))
                            }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                    </div>
                </div>
                <div className="w-1/2 mt-2">
                    <div className="flex px-1 flex-col">
                        <label htmlFor="" className="text-xs">Height (m)</label>
                        <input type="number" onChange={(e)=>{
                            setHeight(Number(e.target.value))
                            }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                    </div>
                </div>
                <div className="w-1/2 mt-2">
                    <div className="flex px-1 flex-col">
                        <label htmlFor="" className="text-xs">CBM Rate</label>
                        <input type="number" onChange={(e)=>{
                            setRate(Number(e.target.value))
                            }} className="border px-2 py-2 text-xs rounded-md bg-white"  />
                    </div>
                </div>
            </div>
            <div className="px-3 mt-2 flex w-full">
                <button onClick={handleCalculate} className="py-3 w-full mb-2 text-xs text-white bg-orange-500 rounded-md">Calculate</button>
            </div>
        </div>
        <div className="fixed bottom-24 right-4 lg:bottom-28 lg:right-8 rounded-full">
          <button onClick={onCalculateClick} className="p-3 text-orange-500 border-orange-500 border-2 rounded-full">
            <CalculatorIcon />
          </button>
        </div>
    </>
  )
}

export default Calculator
