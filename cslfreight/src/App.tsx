import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import Whatsapp from './components/Whatsapp'
import Search from './pages/Search'
import Address from './pages/Address'
import Terms from './pages/Terms'
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
import Attachments from './pages/Attachments/Attachments'
import Payments from './pages/Payments/Payments'
import Invoices from './pages/Invoice/Invoices'
import InvoiceDetails from './pages/Invoice/InvoiceDetails'
import RequestForm from './pages/Deliveries/RequestForm'
import DeliveryTracking from './pages/Deliveries/DeliveryTracking'
import Deliveries from './pages/Deliveries/Deliveries'
import DeliveryEdit from './pages/Deliveries/DeliveryEdit'
import Videos from './pages/Video/Videos'
import VideoPlayer from './pages/Video/VideoPlayer'
import { useEffect } from 'react'
import DeleteAccount from './pages/DeleteAccount/DeleteAccount'
import CookiesPolicy from './pages/Policies/CookiesPolicy'
import PrivacyPolicy from './pages/Policies/PrivacyPolicy'
import TermsOfUse from './pages/Policies/TermsOfUse'
import PolicyLayout from './components/PolicyLayout'
import Shop from './pages/Shop/shop'
import ProductDetails from './pages/Product/productDetails'

async function loadPreline() {
  return import('preline/dist/index.js');
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const initPreline = async () => {
      await loadPreline();

      if (
        window.HSStaticMethods &&
        typeof window.HSStaticMethods.autoInit === 'function'
      ) {
        window.HSStaticMethods.autoInit();
      }
    };

    initPreline();
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route element={<Whatsapp />}>
          <Route element={<Layout />}>
            <Route path='/' element={<Home />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
            <Route path='/search' element={<Search />} />
            <Route path='/address' element={<Address />} />
            <Route path='/terms' element={<Terms />} />
            <Route path='/container-loadings' element={<Loading />} />
            <Route path='/shop' element={<Shop />} />
            <Route path='/product/:productId' element={<ProductDetails />} />
            <Route path='/delete-account' element={<DeleteAccount />} />
            <Route path='*' element={<NotFound />} />
            <Route element={<PolicyLayout />}>
              <Route path='terms-of-use' element={<TermsOfUse />} />
              <Route path='cookies-policy' element={<CookiesPolicy />} />
              <Route path='privacy-policy' element={<PrivacyPolicy />} />
            </Route>
          </Route>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<PasswordReset />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route element={<AuthLayout />}>
            <Route element={<ClientAnnouncement />}>
              <Route path='/our-policies' element={<Terms />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/deliveries" element={<Deliveries />} />
              <Route path="/deliveries/create" element={<RequestForm />} />
              <Route path="/deliveries/:id" element={<DeliveryTracking />} />
               <Route path="/deliveries/:id/edit" element={<DeliveryEdit />} />
              <Route path="/shipping-address" element={<Address />} />
              <Route path="/packages/:id" element={<PackageDetails />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/attachments/:id" element={<Attachments />} />
              <Route path="/invoices/" element={<Invoices />} />
              <Route path="/invoices/:id" element={<InvoiceDetails />} />
              <Route path='/videos' element={<Videos />} />
              <Route path='/videos/:id' element={<VideoPlayer />} />
            </Route>
          </Route>
        </Route>
        {/* </Route> */}
      </Routes>
    </>
  )
}

export default App
