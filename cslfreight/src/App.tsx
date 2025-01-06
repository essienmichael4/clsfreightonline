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
            <Route path='*' element={<NotFound />} />
          </Route>
        </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
