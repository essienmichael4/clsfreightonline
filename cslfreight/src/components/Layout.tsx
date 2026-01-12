import { Outlet, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Navbar from "./Navbar"

const COOKIE_KEY = "csl_cookie_consent"

const Layout = () => {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY)
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem(COOKIE_KEY, "accepted")
    setShowBanner(false)
  }

  return (
    <>
      <Navbar />
      <Outlet />

      {showBanner && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white border-t shadow-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              We use cookies to improve your experience and comply with applicable
              data protection laws. Read our
              <Link
                to="/cookies-policy"
                className="text-cyan-700 ml-1 underline"
              >
                Cookies Policy
              </Link>.
            </p>

            <div className="flex gap-2">
              {/* <Link
                to="/cookie-settings"
                className="px-4 py-2 text-xs border rounded"
              >
                Manage
              </Link> */}
              <button
                onClick={acceptCookies}
                className="px-4 py-2 text-xs bg-cyan-700 text-white rounded"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Layout

