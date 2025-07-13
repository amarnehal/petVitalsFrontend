import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogOutBtn from "./LogOutBtn";
import Container from "../container/Container";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isUserAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !isUserAuthenticated },
    { name: "SignUp", slug: "/signup", active: !isUserAuthenticated },
    { name: "Add Pet", slug: "/create-pet", active: isUserAuthenticated },
  ];

  return (
    <header className="bg-[#5063A9] shadow-lg py-4">
      <Container>
        <div className="flex justify-between items-center">
          {/* Logo or Brand */}
          <div className="text-white font-bold text-2xl">MyApp</div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6">
            <ul className="flex items-center space-x-6">
              {navItems.map((item) =>
                item.active ? (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.slug)}
                      className="text-white hover:text-yellow-400 font-medium cursor-pointer"
                    >
                      {item.name}
                    </button>
                  </li>
                ) : null
              )}
              {isUserAuthenticated && (
                <li>
                  <LogOutBtn />
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${isMenuOpen ? "block" : "hidden"}`}>
          <ul className="space-y-4 py-4 mt-4 bg-[#88BDBC] rounded-lg">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="block w-full text-white text-center hover:text-yellow-400 py-2 cursor-pointer"
                  >
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {isUserAuthenticated && (
              <li>
                <LogOutBtn />
              </li>
            )}
          </ul>
        </div>
      </Container>
    </header>
  );
};

export default Header;
