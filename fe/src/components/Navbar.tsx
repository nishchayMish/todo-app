import { Link } from "react-router-dom";

const Navbar = () => { 
  return (
    <nav className="flex items-center justify-between px-8 md:px-16 py-5 bg-white border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">
          TodoFlow
        </h1>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition">
            Login
          </Link>

          <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition">
            Sign Up
          </Link>
        </div>
    </nav>
  )
}

export default Navbar