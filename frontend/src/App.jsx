import { Route, Routes } from "react-router-dom";
import "./App.css";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import AddNote from "./components/AddNote";
import EditNote from "./pages/EditNote";
import ProtectedRoute from "./middleware/ProtectedRoute";
import ModalComponent from "./components/Modal";
import Profile from "./pages/Profile";
import Notes from "./pages/Notes";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Error from "./pages/Error";
import ProtectedRouteAdmin from "./middleware/ProtectedRouteAdmin";
import Chat from './pages/Chat'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/modal" element={<ModalComponent />} />
        <Route path="*" element={<Error/>}/>
        <Route path="/chat" element={<Chat/>} />

        <Route
          path="/admin"
          element={
            <ProtectedRouteAdmin>
              <Admin />
            </ProtectedRouteAdmin>
          }
        />

        <Route
          path="/addNote"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute>
              <EditNote />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
