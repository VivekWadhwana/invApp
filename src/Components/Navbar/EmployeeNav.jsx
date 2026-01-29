import React from "react";
import { Link }  from "react-router-dom";
import inventoryLogo from "../images/inventory_logo.png";
import userLogo from "../images/user_Logo.png";


function EmployeeNav({handleLogout}) {
  function userDropdown() {
    const dropdown = document.getElementById("user-dropdown");
    dropdown.classList.toggle("hidden");

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!dropdown.contains(event.target) && !event.target.closest('#nav-user')) {
        dropdown.classList.add("hidden");
        document.removeEventListener('click', handleClickOutside);
      }
    };

    if (!dropdown.classList.contains("hidden")) {
      document.addEventListener('click', handleClickOutside);
    }
  }

  function toggleSearchbar() {
    const searchbar = document.getElementById('searchbar');
    const searchLogo = document.getElementById("search_logo");

    searchbar.classList.remove("hidden");
    searchLogo.classList.add("rotate-90");
    searchbar.focus();

      setTimeout(() => {
        if(searchbar.value == ""){
          searchbar.classList.add("hidden");
          searchLogo.classList.remove("rotate-90");
        }
      }, 4000);

  }


  return (
    <>

    <nav className="bg-amber-500 text-white p-5 flex h-17 fixed top-0 left-0 right-0 w-full z-50">

        <div id="nav-logo" className="left-0 mr-30 ml-15"> 
            <Link to="/employee"><img src={inventoryLogo} alt="Inventory Logo" className="h-6 mt-1 scale-500 hover:scale-475   cursor-pointer " /></Link>

        </div>
        
        <div id="nav-links">
            <ul className="flex gap-15 mt-1 text-[18px] font-bold text-gray-600">
                <li><Link to="/employee/home" className="block hover:text-indigo-700 hover:scale-110 transition-all duration-200">Home</Link></li>
                <li><Link to="/employee/products" className="block hover:text-indigo-700 hover:scale-110 transition-all duration-200">Products</Link></li>
                <li><Link to="/employee/inventory" className="block hover:text-indigo-700 hover:scale-110 transition-all duration-200">Inventory</Link></li>
                <li><Link to="/employee/history" className="block hover:text-indigo-700 hover:scale-110 transition-all duration-200">History</Link></li>
            </ul>            
        </div>
        <div className="right-0 ml-auto mr-5">
          <div className="flex items-center max-h-7 ">
            <input id="searchbar" type="text" placeholder="Search" className="bg-gray-200 hidden  text-gray-700 px-4 h-10 rounded-md focus:outline-none focus:bg-white  "  />
            <svg className="h-7 ml-2 cursor-pointer" onMouseEnter={toggleSearchbar} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <div id="nav-user" className="right-0 ml-10 mr-5 relative">
          <div className="cursor-pointer relative">
            <img src={userLogo} alt="User" className="h-7 scale-200 hover:scale-220 cursor-pointer" onClick={userDropdown} />
            <div id="user-dropdown" className="absolute -right-4 top-full font-semibold mt-2 w-32 text-center bg-amber-600 rounded-md shadow-lg hidden z-50">
              <ul>
                <li><Link to="/profile" className="block px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-400 ">Profile</Link></li>
                <li><Link to="/settings" className="block px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-400">Settings</Link></li>
                <li><span  className="block px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-400" onClick={handleLogout}>Logout</span></li>
              </ul>
            </div>
          </div>
        </div>
    </nav>
    
    </>
  );
}

export default EmployeeNav;