import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegCircleUser } from "react-icons/fa6";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const UserPanel = () => {
  const user = useSelector((state) => state?.user?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include",
    });

    const data = await fetchData.json();

    if (data.success) {
      toast.success(data.message);
      dispatch(setUserDetails(null));
      setSidebarOpen(false);
      navigate("/");
    } else if (data.error) {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="flex justify-between items-center md:hidden bg-white p-4 shadow">
        <p className="text-lg font-semibold">User Panel</p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-2xl"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white w-full md:w-64 shadow-md p-4 md:block transition-transform duration-300 z-20 ${
          sidebarOpen ? "block" : "hidden"
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
          <p className="text-sm text-gray-500">User</p>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 space-y-2">
           <div
           className=" px-4 py-2 mt-4 rounded text-red-800 font-semibold text-lg shadow-sm cursor-default select-none"
           >
             Your Information
           </div>
          <Link
            to="order"
            className="block px-4 py-2 rounded hover:bg-gray-100 transition"
            onClick={() => setSidebarOpen(false)}
          >
            Your Orders
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default UserPanel;
