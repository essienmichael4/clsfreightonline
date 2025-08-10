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

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth />}>
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
          </Route>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
