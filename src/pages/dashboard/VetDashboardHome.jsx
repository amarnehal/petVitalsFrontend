import React from 'react'
import VetDashboardLayout from '../../components/VetDashboardComponents/VetLayout'
import TestingUi from "../../components/TestingUI"
import { Link } from 'react-router-dom'
import GetUsersAndPet from '../../components/GetUsersAndPet'

const VetDashboardHome = () => {
  return (
    <div>
       <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-3 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5063A9] to-purple-600">
           Welcome to Dashboard:
        </span>
      </h2>
      <p className='text-lg font-medium text-gray-700 text-center mt-1' >Manage your appointments, view pet records, and more.</p>
      <div className='py-2'>
         <GetUsersAndPet/>
      </div>
     
    </div>
  )
}

export default VetDashboardHome