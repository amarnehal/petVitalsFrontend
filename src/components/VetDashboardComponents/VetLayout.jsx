import React, { Children, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet } from "react-router-dom";
import LogOutBtn from "../Header/LogOutBtn";
import Footer from "../Footer/Footer";

const VetDashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const auth = useSelector((state) => state.auth);


  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out
        transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }  // Make sure it moves out of view when closed
        lg:translate-x-0 lg:static lg:inset-auto bg-[#164E63] shadow-lg overflow-y-auto`}
      >
        <div className="relative h-full">
          <div className="relative z-10 p-6 text-white h-full">
            <div className="text-2xl font-bold mb-10 text-center">
              🧑‍⚕️ Welcome -{auth ? auth.userData?.userName : Doctor}
            </div>
            <nav className="space-y-4">
              <Link
                to="/dashboard"
                className="block px-4 py-2 rounded hover:bg-white/20 transition"
              >
                Dashboard
              </Link>
              <Link
                to="/dashboard/vet-profile"
                className="block px-4 py-2 rounded hover:bg-white/20 transition"
              >
                Profile
              </Link>
              <Link
                to="./register-pet-owner"
                className="block px-4 py-2 rounded hover:bg-white/20 transition"
              >
                Registration User & Pet
              </Link>
              <LogOutBtn />
            </nav>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        } p-6 overflow-auto bg-gray-50`}
      >
        {/* Header */}
        <header className="bg-red shadow px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            className="lg:hidden text-[#5063A9] focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* <div className="flex items-center space-x-3 w-full">
          <span className="font-medium">Dr. John Doe</span>
        </div> */}
        </header>

        {/* Content Area */}
        <main className="flex-1 p-2 overflow-auto ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VetDashboardLayout;
