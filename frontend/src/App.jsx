import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Signup from './components/Signup'
import Login from './components/Login'
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element={<Navbar/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>} />
    </Routes>  
    </>
  )
}

export default App






// form Validation

