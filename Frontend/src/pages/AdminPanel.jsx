import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminPanel = () => {
  const user = useSelector(state => state?.user?.user)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (user && user.role !== ROLE.ADMIN) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="flex justify-between items-center md:hidden bg-white p-4 shadow">
        <p className="text-lg font-semibold">Admin Panel</p>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white w-full md:w-64 shadow-md p-4 md:block transition-transform duration-300 z-20 ${
          sidebarOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="text-5xl">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <FaRegCircleUser />
            )}
          </div>
          <p className="text-base font-semibold mt-2">{user?.name}</p>
          <p className="text-sm text-gray-500">{user?.role}</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-2">
          <Link
            to="all-users"
            className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(false)}
          >
            All Users
          </Link>
          <Link
            to="all-products"
            className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(false)}
          >
            All Products
          </Link>
          <Link
            to="all-orders"
            className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(false)}
          >
            All Orders
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPanel
