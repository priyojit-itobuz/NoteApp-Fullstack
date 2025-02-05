import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import AddNote from './components/AddNote'
import Home from './pages/Home'
import EditNote from './pages/EditNote'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/addNote' element={<AddNote/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/verify/:token' element={<VerifyEmail />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/edit/:id' element={<EditNote/>}/>
    </Routes>  
    </>
  )
}

export default App






// form Validation

