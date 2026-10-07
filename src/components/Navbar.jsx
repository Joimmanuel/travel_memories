import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

export default function Navbar() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">✦</span>
        <span>Travel Memories</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">Gallery</Link>
        {isAdmin ? (
          <>
            <Link to="/admin">Admin</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <Link to="/login" className="btn-login">Admin Login</Link>
        )}
      </div>
    </nav>
  )
}
