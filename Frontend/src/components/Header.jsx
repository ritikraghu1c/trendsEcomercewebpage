import React, { useContext, useState, useEffect } from 'react';
import Logo from './Logo';
import { GrSearch } from "react-icons/gr";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { setUserDetails } from '../store/userSlice';
import ROLE from '../common/role';
import Context from '../context';

const Header = () => {
  const reduxUser = useSelector(state => state?.user?.user);
  const dispatch = useDispatch();
  const [localUser, setLocalUser] = useState(reduxUser);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const context = useContext(Context);
  const navigate = useNavigate();
  const searchInput = useLocation();
  const URLSearch = new URLSearchParams(searchInput?.search);
  const searchQuery = URLSearch.getAll("q")?.[0] || "";
  const [search, setSearch] = useState(searchQuery);

  // Sync Redux user to local state
  useEffect(() => {
    if (reduxUser) {
      setLocalUser(reduxUser);
      localStorage.setItem('user', JSON.stringify(reduxUser));
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) setLocalUser(storedUser);
    }
  }, [reduxUser]);

  const handleLogout = async () => {
    try {
      const fetchData = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: 'include'
      });
      const data = await fetchData.json();
      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(null));
        localStorage.removeItem('user');
        setMenuDisplay(false);
        setLocalUser(null);
        navigate("/");
      } else if (data.error) {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Logout failed, please try again.");
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (value.trim()) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

  const handleProfileClick = () => {
    if (!localUser?._id) {
      navigate("/login");
    } else {
      setMenuDisplay(prev => !prev);
    }
  };

  return (
    <>
      <header className='h-16 shadow-md bg-white fixed w-full z-50' style={{ paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
        <div className='h-full container mx-auto flex items-center px-4 justify-between'>
          <div>
            <Link to={"/"}>
              <Logo w={90} h={50} />
            </Link>
          </div>

          {/* Desktop Search */}
          <div className='hidden lg:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow pl-2'>
            <input
              type='text'
              placeholder='search product here...'
              className='w-full outline-none'
              onChange={(e) => handleSearch(e.target.value)}
              value={search}
            />
            <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
              <GrSearch />
            </div>
          </div>

          <div className='flex items-center gap-7'>
            {/* Profile Icon - Always visible */}
            <div className='relative flex justify-center cursor-pointer' onClick={handleProfileClick}>
              {localUser?.profilePic ? (
                <img
                  src={localUser?.profilePic}
                  className='w-10 h-10 rounded-full'
                  alt={localUser?.name}
                />
              ) : (
                <FaRegCircleUser className='text-3xl' />
              )}

              {/* Dropdown only if logged in */}
              {localUser?._id && menuDisplay && (
                <div className='absolute bg-white mt-12 right-0 h-fit p-2 shadow-lg rounded z-50' style={{ minWidth: '150px' }}>
                  <nav>
                    {localUser?.role === ROLE.ADMIN ? (
                      <Link
                        to={"/admin-panel/all-products"}
                        className='whitespace-nowrap block hover:bg-slate-100 p-2'
                        onClick={() => setMenuDisplay(false)}
                      >
                        Admin Panel
                      </Link>
                    ) : (
                      <Link
                        to={"/user-panel"}
                        className='whitespace-nowrap block hover:bg-slate-100 p-2'
                        onClick={() => setMenuDisplay(false)}
                      >
                        Account Details
                      </Link>
                    )}
                  </nav>
                </div>
              )}
            </div>

            {/* Cart - Only if logged in */}
            {localUser?._id && (
              <Link to={"/cart"} className='text-2xl relative'>
                <span><FaShoppingCart /></span>
                <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                  <p className='text-sm'>{context?.cartProductCount || 0}</p>
                </div>
              </Link>
            )}

            {/* Login / Logout */}
            <div>
              {localUser?._id ? (
                <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
              ) : (
                <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Button */}
      <div className='lg:hidden fixed bottom-4 right-4 z-50'>
        <button
          onClick={() => setShowMobileSearch(prev => !prev)}
          className='bg-red-600 text-white p-3 rounded-full shadow-md text-xl'
        >
          <GrSearch />
        </button>
      </div>

      {/* Bottom Mobile Search Bar */}
      {showMobileSearch && (
        <div className='lg:hidden fixed bottom-0 left-0 w-full bg-white z-50 border-t flex items-center px-4 py-2 gap-2'>
          <input
            type='text'
            className='flex-1 border rounded-full px-4 py-2 outline-none'
            placeholder='Search product here...'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
          />
          <button
            className='bg-red-600 text-white px-4 py-2 rounded-full'
            onClick={() => setShowMobileSearch(false)}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Header;
