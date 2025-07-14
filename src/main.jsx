import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';  // 
import { store, persistor } from './store/store.js'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedLayout from "./components/ProtectedLayout.jsx"
import LogInPage from './pages/LogInPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import HomePage from './pages/HomePage.jsx'
import App from "./App.jsx"
import RegisterPetAndUserPage from './pages/RegisterPetAndUserPage.jsx'
import VetDashboardHome from './pages/dashboard/VetDashboardHome.jsx'
import GetUsersAndPet from './components/GetUsersAndPet.jsx'
import VetDashboardLayout from './components/VetDashboardComponents/VetLayout.jsx'
import PetMedicalPage from './pages/PetMedicalPage.jsx'
import UpdatePetMedicalPage from './pages/UpdatePetMedicalPage.jsx'
import CreatePetMedicalPage from './pages/CreatePetMedicalPage.jsx'
import VetProfilePage from './pages/dashboard/VetProfilePage.jsx'
import VetMedicalInfoPage from './pages/dashboard/VetMedicalInfoPage.jsx'
import UpdateVetPage from './pages/dashboard/UpdateVetPage.jsx'
import UpdateVetMedicalInfoPage from './pages/dashboard/UpdateVetMedicalInfoPage.jsx';
import NotFoundPage from "./components/NotFound.jsx"

// Router configuration using createBrowserRouter for react-router-dom v7.x
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFoundPage />, 
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LogInPage /> },
      { path: "/signup", element: <SignUpPage /> },
    ],
  },
 {
  path: "/dashboard",
  element: <ProtectedLayout authentication={true} />,  // ✅ Protected layout
  children: [
    {
      path: "",
      element: <VetDashboardLayout />,  // Dashboard layout with <Outlet />
      children: [
        { index: true, element: <VetDashboardHome /> },
        { path: "users-and-pets", element: <GetUsersAndPet /> },
        { path: "register-pet-owner", element: <RegisterPetAndUserPage /> },
        { path: "update-pet-medical/:id", element: <UpdatePetMedicalPage /> },
        { path: "create-pet-medical/:id", element: <CreatePetMedicalPage /> },
        { path: "vet-profile", element: <VetProfilePage /> },
        { path: "vet-medicalInfo", element: <VetMedicalInfoPage /> },
        { path: "pet/:id", element: <PetMedicalPage /> },
        { path: "update/vet-base-profile", element: <UpdateVetPage /> },
        {path:"update/vet-info-profile", element:<UpdateVetMedicalInfoPage/>},
        { path: "*", element: <NotFoundPage /> }
      ],
    },
  ],
}
]);

// Rendering the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>  
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);