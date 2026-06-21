
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Home'
import IconRecall from './IconRecall'
import CssPropertyChain from './CssPropertyChain'
import Bughunter from './Bughunter'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/iconrecall' element={<IconRecall/>} />
      <Route path='/csspropertychain' element={<CssPropertyChain/>} />
      <Route path='/bughunter' element={<Bughunter/>} />
     </Routes> 
    </>
  )
}

export default App
