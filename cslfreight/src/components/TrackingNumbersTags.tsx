import { Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ITrackingNumbersTagsProps{
    tag:string,
    tags:string[],
    handleChange:(e: React.ChangeEvent<HTMLInputElement>)=>void,
    handleKeyDown:(e: React.KeyboardEvent<HTMLInputElement>)=>void,
    removeTag:(index:number)=>void
}

const TrackingNumbersTags = ({handleChange, tag, tags, handleKeyDown, removeTag} :ITrackingNumbersTagsProps) => {
  const navigate = useNavigate()
  const handleSearch = ()=>{
    

    if(tag && tags.length < 9){
      tags.push(tag.trim())
    }

    if(tags.length === 0) return

    navigate("/search", {state:tags})
  }

  return (
    <div className="w-full  flex flex-col px-1 gap-1 mt-16 items-center rounded-lg">
      <div className="flex gap-1">
        {tags.map(( tag, index )=>(
            <div key={index} className="px-2 flex gap-1 items-center text-xs py-1 bg-gray-200 rounded-full">
                {tag} <button onClick={()=>removeTag(index)} className="bg-gray-700 h-4 w-4 rounded-full text-xs text-white flex items-center justify-center">
                  x
                </button>
            </div>
        ) )}
      </div>
      <div className="w-full rounded-md flex justify-center items-center h-12">
        <div className="flex w-full sm:w-2/3 md:w-2/4 border h-full items-center px-3 gap-3 rounded-s-md focus-within:border-gray-500">
          <Search className="h-5 w-5 text-gray-400 pointer-events-none" />
          <input type="text" onChange={handleChange}
            onKeyDown={handleKeyDown}
            value={tag} placeholder="Plur 890987645368" className="outline-none w-full"/>
        </div>
        <button className="text-white bg-blue-700 h-full px-6 rounded-e-md" onClick={handleSearch}>Track</button>
      </div>
      <p className="text-xs text-start">Enter your full tracking number or numbers in the input above to track seperated by , or enter or tab. (Max of 10 tracking numbers)</p>
    </div>
  )
}

export default TrackingNumbersTags
