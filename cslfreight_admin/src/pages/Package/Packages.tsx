import { Link, Outlet, useLocation } from "react-router-dom"

const Packages = () => {
    const location = useLocation();
  
    return (
        <>
            <div className="container px-4 mx-auto">
                <div className="flex flex-wrap gap-4 mt-4">
                    <Link
                        to="/packages"
                        className={`text-xs ${location.pathname === "/packages" ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                    >
                        Packages
                    </Link>
                    <Link
                        to="/packages/status/dates"
                        className={`text-xs ${location.pathname.includes("/packages/status/dates") ? "text-blue-600 font-semibold" : "text-gray-500"}`}
                    >
                        Status & Dates
                    </Link> 
                </div>
                <Outlet />
            </div>
        </>
    )
}

export default Packages
