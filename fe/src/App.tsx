import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import VerifyEmail from "./pages/VerifyEmail"
import Todos from "./pages/Todos"
import ProtectedRoute from "./routes/ProtectedRoute"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyEmail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/todos" element={<Todos />}/>
      </Route>
    </Routes>
  )
}

export default App