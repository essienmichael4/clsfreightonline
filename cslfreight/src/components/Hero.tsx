import { useState } from "react"
import hero from "../assets/hero.jpg"
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
        setTag("")
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
      return prevTags.filter((_, i)=> i != index)
    })
  }

  return (
    <div className="flex flex-col items-center">
        <h1 className="font-bold text-3xl sm:font-normal sm:text-6xl lg:text-7xl text-center tracking-wide relative">
            Your Trusted <span className="text-blue-700 bg-clip-text relative">Partner</span> For Your <span className="text-blue-700 bg-clip-text relative">Freight</span> Forwarding Services
        </h1>
        
        <TrackingNumbersTags 
          handleChange={handleChange} 
          tag={tag} 
          tags={tags} 
          handleKeyDown={handleKeyDown}
          removeTag={removeTag}
        />
        
        <div className="flex justify-center mt-10 mb-4">
            <img src={hero} alt="" className="rounded-lg w-full mx-2"/>
        </div>
    </div>
  )
}

export default Hero
