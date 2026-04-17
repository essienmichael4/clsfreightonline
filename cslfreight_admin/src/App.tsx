import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Login/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Packages from './pages/Package/Packages'
import RequireAuth from './components/RequireAuth'
import Users from './pages/User/Users'
import Package from './pages/Package/Package'
import UserProfile from './pages/User/User'
import NotFound from './pages/NotFound/NotFound'
import Loading from './pages/Loading/Loading'
import Settings from './pages/Settings/Settings'
import Clients from './pages/Client/Clients'
import ClientDetails from './pages/Client/ClientDetails'
import Membership from './pages/Membership/Membership'
import Payments from './pages/Paymen/Payments'
import Invoices from './pages/Invoices/Invoices'
import Invoice from './pages/Invoices/Invoice'
import Create from './pages/Invoices/Create'
import EditInvoice from './pages/Invoices/EditInvoice'
import Videos from './pages/Video/Videos'
import VideoDetails from './pages/Video/VideoDetails'
import Deliveries from './pages/Deliveries/Deliveries'
import DeliveryDetails from './pages/Deliveries/DeliveryDetails'
import VideoPlayer from './pages/Video/VideoPlayer'
import VideoSearch from './pages/Video/VideoSearch'
import EditVideo from './pages/Video/EditVideo'
import ShopDashboard from './pages/ShopDashboard/shopDashboard'
import ShopLayout from './pages/ShopDashboard/ShopLayout'
import ShopProducts from './pages/ShopDashboard/ShopProducts'
import ShopAnalytics from './pages/ShopDashboard/ShopAnalytics'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth />}>
         <Route path='/shop-dashboard' element={<ShopLayout />}>
            <Route index element={<ShopDashboard />} />
            <Route path='products' element={<ShopProducts />} />
            <Route path='analytics' element={<ShopAnalytics />} />
          </Route>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/packages' element={<Packages />} />
            <Route path='/packages/:id' element={<Package />} />
            <Route path='/loadings' element={<Loading />} />
            <Route path='/loadings/:id' element={<Package />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/:id' element={<UserProfile />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/clients/:id' element={<ClientDetails />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/memberships' element={<Membership />} />
            <Route path='/payments' element={<Payments />} />
            <Route path='/invoices' element={<Invoices />} />
            <Route path='/invoices/create' element={<Create />} />
            <Route path='/invoices/edit/:id' element={<EditInvoice />} />
            <Route path='/invoices/:id' element={<Invoice />} />
            <Route path='/videos' element={<Videos />} />
            <Route path='/videos/results' element={<VideoSearch />} />
            <Route path='/videos/:id' element={<VideoPlayer />} />
            <Route path='/videos/:id/edit' element={<EditVideo />} />
            <Route path='/video-details' element={<VideoDetails />} />
            <Route path='/deliveries' element={<Deliveries />} />
            <Route path='/deliveries/:id' element={<DeliveryDetails />} />
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
