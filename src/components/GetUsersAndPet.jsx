import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import vetService from "../services/vet";
import { getUserAndPetInfo } from "../store/petSlice";

const GetUsersAndPet = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const dispatch = useDispatch();
  const petAndUserInfo = useSelector((state) => state.pet.petAndUserInfo);
  const petDetails = petAndUserInfo?.petDetails || [];

  useEffect(() => {
    const fetchAllUsersandPets = async () => {
      setError(null);
      try {
        const userData = await vetService.getAllUsersAndPets();
        if (userData?.data) {
          dispatch(getUserAndPetInfo(userData.data.petDetails));
        } else {
          setError("No data received.");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch pet and owner details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsersandPets();
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);  // Reset to page 1 on new search
  };

  const filteredPets = petDetails.filter((pet) => {
    const petName = pet?.name?.toLowerCase() || "";
    const ownerName = pet?.owner?.userName?.toLowerCase() || "";
    return (
      petName.includes(searchTerm.toLowerCase()) ||
      ownerName.includes(searchTerm.toLowerCase())
    );
  });

  const totalPets = petDetails.length;
  const totalFilteredPets = filteredPets.length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-500 animate-pulse">Loading...</div>
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
    <div className="min-h-screen from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <h1 className="text-2xl font-extrabold text-center text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5063A9] to-purple-600">
            Users & Their Beloved Pets
          </span>
        </h1> */}

        <div className="mb-4 text-center">
          <p className="text-gray-700 text-lg font-semibold">
            Total Pets: {totalPets} {searchTerm && `(Matching: ${totalFilteredPets})`}
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by pet name or owner name..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>

        {currentPets.length === 0 ? (
          <h2 className="text-center text-2xl font-semibold text-gray-700 italic">
            No Pet and Owner Exists
          </h2>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {currentPets.map((pet) => (
              <div
                key={pet._id}
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl group"
              >
                <div
                  className="h-40 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1534361960057-370686dd9fe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`,
                  }}
                >
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                      Owner: {pet?.owner?.userName || "N/A"}
                    </h2>
                    <p className="text-xs text-gray-200 opacity-90 truncate">
                      📧 {pet?.owner?.email || "No Email"}
                    </p>
                    <p className="text-xs text-gray-200 opacity-90 truncate">
                      📞 {pet?.owner?.phoneNumber || "No Phone"}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-6 bg-[#F3F0F8]">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">🐾 Pet Info</h3>

                  <div className="bg-white p-4 rounded-lg shadow-sm hover:bg-indigo-50 hover:shadow-lg transition-all duration-300">
                    <p className="text-md font-medium text-gray-800">
                      Name: {pet?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Age: {pet?.age !== undefined ? `${pet.age} years` : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Gender: {pet?.gender || "N/A"}
                    </p>
                    <p className="mb-4 text-sm text-gray-600">
                      Type: {pet?.petType || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-5 absolute bottom-0 left-0 right-0 px-1 py-1 bg-gradient-to-r from-[#5063A9] to-purple-600">
                  <Link
                    to={`/dashboard/pet/${pet._id}`}
                    className="block text-center py-2 px-4 text-white font-medium rounded-lg hover:opacity-80 transition duration-150 ease-in-out"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-indigo-500 hover:text-white transition`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetUsersAndPet;
