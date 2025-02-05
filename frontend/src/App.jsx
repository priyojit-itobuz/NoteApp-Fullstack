import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import VerifyEmail from './pages/VerifyEmail'
import AddNote from './components/AddNote'
import Home from './components/Home'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/addNote' element={<AddNote/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/verify/:token' element={<VerifyEmail />} />
      <Route path='/login' element={<Login/>} />
    </Routes>  
    </>
  )
}

export default App






// form Validation

