import './App.css'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Contact from './pages/Contact'
import About from './pages/About'
import RequireAuth from './components/RequireAuth'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route path='/contact' element={<Contact />} />
            <Route path='/about' element={<About />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
