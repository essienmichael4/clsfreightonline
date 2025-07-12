import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Whatsapp from './components/Whatsapp'
import Search from './pages/Search'
import Address from './pages/Address'
import Terms from './pages/Terms'
import Calculator from './components/Calculator'
import NotFound from './pages/NotFound/NotFound'
import Loading from './pages/Loading'
import RequireAuth from './components/RequireAuth'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Dashboard from './pages/Dashboard/Dashboard'
import Packages from './pages/Packages/Packages'
import AuthLayout from './components/AuthLayout'
import PackageDetails from './pages/Packages/PackageDetails'
import Profile from './pages/Profile/Profile'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import PasswordReset from './pages/PasswordReset/PasswordReset'
import ClientAnnouncement from './components/ClientAnnouncement'

function App() {

  return (
    <>
      <Routes>
        <Route element={<Whatsapp />}>
        <Route element={<Calculator />}>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/about' element={<About />} />
          <Route path='/search' element={<Search />} />
          <Route path='/address' element={<Address />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/container-loadings' element={<Loading />} />
          <Route path='*' element={<NotFound />} />
        </Route>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<PasswordReset />} />
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route element={<ClientAnnouncement />}>
              <Route path='/our-policies' element={<Terms />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/shipping-address" element={<Address />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/profile/:id" element={<Profile />} />
            </Route>
          </Route>
        </Route>
        </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
