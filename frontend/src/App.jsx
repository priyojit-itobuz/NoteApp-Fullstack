import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
import VerifyEmail from './pages/VerifyEmail'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Navbar/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/verify/:token' element={<VerifyEmail />} />
      <Route path='/login' element={<Login/>} />
    </Routes>  
    </>
  )
}

export default App






// form Validation

