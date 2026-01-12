import { Outlet } from "react-router-dom"
import PolicyHeader from "./PolicyHeader"
import Footer from "./Footer"

const PolicyLayout = () => {
  return (
    <>
        <PolicyHeader />
        <section className="container mx-auto px-4">
            <Outlet />
        </section>
        <Footer />
    </>
  )
}

export default PolicyLayout
