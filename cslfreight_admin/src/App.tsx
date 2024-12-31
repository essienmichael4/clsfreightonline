import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Login/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Packages from './pages/Package/Packages'
import RequireAuth from './components/RequireAuth'
import Users from './pages/Users'
import Package from './pages/Package/Package'

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
            <Route path='/users' element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
