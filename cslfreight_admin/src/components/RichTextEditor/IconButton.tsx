import { ReactNode } from "react"
import { Toggle } from "../ui/toggle"

interface Props {
    children: ReactNode,
    active?: boolean,
    onClick?(): void 
}

const IconButton = ({children, active, onClick}: Props) => {
  return (
    <Toggle
      className="w-4 h-4"
      pressed= {active}
      onClick={onClick}>
        {active}
        {children}
    </Toggle>
  )
}

export default IconButton
