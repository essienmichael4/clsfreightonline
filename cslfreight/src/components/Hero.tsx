import { useState } from "react"
import hero from "../assets/hero.jpg"
// import docked from "../assets/docked.jpg"
import { Search } from "lucide-react"
import TrackingNumbersTags from "./TrackingNumbersTags"

const Hero = () => {
  const [tag, setTag] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const newTag = tag.trim()
    if(tags.length > 9) return

    if((e.key==="," || e.key === "Enter" || e.key === "Tab") && newTag.length && !tags.includes(newTag)){
        e.preventDefault()
        setTag(prev => "")
        setTags(prev => [...prev, newTag])
    }else if(e.key === "Backspace" && !newTag.length && tags.length){
        e.preventDefault()
        const tagsCopy = [...tags]
        const lastTag:string = tagsCopy.pop() || ""
        setTags(tagsCopy)
        setTag(lastTag)
    }
  }

  const removeTag = (index:number) =>{
    setTags(prevTags => {
      return prevTags.filter((tag,i)=> i != index)
    })
  }

  return (
    <div className="flex flex-col items-center">
        {/* <p className="mb-8 text-[#FF9D00] text-sm font-bold">WE’VE GOT YOU COVERED</p> */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide relative">
            Your Trusted <span className="text-blue-700 bg-clip-text relative">Partner</span> For Your <span className="text-blue-700 bg-clip-text relative">Freight</span> Forwarding Services
        </h1>
        
        <TrackingNumbersTags 
          handleChange={handleChange} 
          tag={tag} 
          tags={tags} 
          handleKeyDown={handleKeyDown}
          removeTag={removeTag}
        />
        {/* <div className="w-full rounded-md mt-16 flex justify-center items-center h-12">
          <div className="flex w-full sm:w-2/3 md:w-2/4 border h-full items-center px-3 gap-3 rounded-s-md focus-within:border-gray-500">
            <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Plur 890987645368" className="outline-none w-full"/>
          </div>
          <button className="text-white bg-blue-700 h-full px-6 rounded-e-md">Track</button>
        </div> */}
        
        <div className="flex justify-center mt-10 mb-4">
            <img src={hero} alt="" className="rounded-lg w-full mx-2"/>
        </div>
    </div>
  )
}

export default Hero
