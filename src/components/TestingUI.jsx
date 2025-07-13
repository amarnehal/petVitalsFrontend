import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getUserAndPetInfo } from "../store/petSlice";

const dummyData = [
  {
    _id: "user1",
    name: "Alice Johnson",
    email: "alice@example.com",
    pets: [
      { _id: "pet1", name: "Buddy", age: 3 },
      { _id: "pet2", name: "Mittens", age: 5 },
    ],
  },
  {
    _id: "user2",
    name: "David Smith",
    email: "david@example.com",
    pets: [{ _id: "pet3", name: "Rex", age: 2 }],
  },
  {
    _id: "user3",
    name: "Emma Watson",
    email: "emma@example.com",
    pets: [],
  },
];

const GetUsersAndPet = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.vet.userData) || dummyData;

  useEffect(() => {
    const fetchAllUsersandPets = async () => {
      setError(null);
      try {
        // Simulate API call delay with dummy data
        await new Promise((res) => setTimeout(res, 800));
        dispatch(getUserAndPetInfo(dummyData)); // pretend we got it from the API
      } catch (error) {
        setError("Failed to fetch user and pet data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsersandPets();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }


return (
  <div className="min-h-screen bg-[#EAE6F0] from-gray-50 to-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-16 tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5063A9] to-purple-600">
          Users & Their Beloved Pets
        </span>
      </h1>
      
      {/* Conditional Rendering */}
      {userData && userData.length === 0 ? (
        <h2 className="text-center text-2xl font-semibold text-gray-700 italic">
          No Pet and Owner Exists
        </h2>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {(userData || []).map((user) => (
            <div
              key={user._id}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group"
            >
              {/* Gradient Header with Dynamic Image */}
              <div
                className="h-40 bg-cover bg-center relative"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1534361960057-370686dd9fe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white tracking-tight">Owner: {user.name}</h2>
                  <p className="text-sm text-gray-200 opacity-90">Email: {user.email}</p>
                </div>
              </div>

              {/* Pet Information */}
              <div className="px-6 py-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pets</h3>
                {user.pets.length > 0 ? (
                  user.pets.map((pet) => (
                    <div
                      key={pet._id}
                      className="bg-red-50 p-4 mb-3 rounded-lg shadow-sm transition-all duration-300 hover:bg-indigo-50 hover:shadow-lg"
                    >
                      <p className="text-md font-medium text-gray-800">🐕{pet.name}</p>
                      <p className="text-sm text-gray-600">Age: {pet.age} years</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center bg-gray-50 p-6 mb-3 rounded-lg shadow-sm border-dashed border-2 border-gray-300 transition-all duration-300">
                    <p className="text-center text-gray-600 text-xl font-medium italic">
                      🐾 No Pets Yet 🐾
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button (Fixed at Bottom) */}
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-gradient-to-r from-[#5063A9] to-purple-600">
                <Link
                  to={`/dashboard/pet/${user._id}`}
                  className="w-full block text-center py-2 px-3 text-white rounded-lg hover:opacity-80 transition-all duration-100 ease-in-out font-medium"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


};

export default GetUsersAndPet;
