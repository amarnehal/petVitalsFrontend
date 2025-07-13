import "tailwindcss";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import { Outlet } from "react-router-dom"; // To render child routes
import authService from "./services/auth";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Toaster } from "react-hot-toast";


function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user profile after app mounts
    authService
      .getUserProfile()
      .then((session) => {
        if (session?.data?.user) {
          dispatch(
            login({
              userData: session.data.user,
              role: session.data.user.role,
            })
          );
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false)); // Stop loading after the data is fetched
  }, []);

  if (loading) {
    return (
      <>
       <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 border-4 border-red-500 border-dashed rounded-full animate-spin" />
          <p className="text-sm text-gray-600">Loading, please wait...</p>
        </div>
      </div>
      </>
    );
  }

  // Render the actual app after loading
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Outlet /> {/* This will render child routes */}
      </main>
      <Footer />
    </>
  );
}

export default App;
