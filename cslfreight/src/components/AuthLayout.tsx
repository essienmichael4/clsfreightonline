import { Outlet } from "react-router-dom"
import AuthNavbar from "./AuthNavbar"

const AuthLayout = () => {
  return (
    <>
        <AuthNavbar />
        <Outlet />
    </>
  )
}

export default AuthLayout
