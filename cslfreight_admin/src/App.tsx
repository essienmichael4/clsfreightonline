import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Packages from './pages/Packages'
import RequireAuth from './components/RequireAuth'
import Users from './pages/Users'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/packages' element={<Packages />} />
            <Route path='/users' element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
