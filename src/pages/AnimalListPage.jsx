// src/pages/AnimalListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAnimals } from '../api/apiService'; // Corrected import
import AnimalCard from '../components/common/AnimalCard'; // Component to display individual animal
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function AnimalListPage() {
  const [animals, setAnimals] = useState([]); // State to hold the list of animals
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [error, setError] = useState(null);     // State for any errors during fetching
  const [filters, setFilters] = useState({ type: '', breed: '' }); // State for filter inputs
  const navigate = useNavigate(); // Hook for programmatic navigation

  const userRole = localStorage.getItem('userRole'); // Get user role for conditional rendering

  useEffect(() => {
    const loadAnimals = async () => {
      setLoading(true); // Start loading
      setError(null);   // Clear previous errors
      try {
        // Fetch animals, passing current filters to the API
        const response = await fetchAnimals(filters); 
        setAnimals(response.data); // Update animals state with fetched data
      } catch (err) {
        setError('Failed to load animals. Please check your connection or try again later.');
        console.error('Error fetching animals:', err);
      } finally {
        setLoading(false); // Stop loading, whether successful or not
      }
    };
    loadAnimals();
  }, [filters]); // Re-fetch animals whenever the filters state changes

  // Handler for changes in the filter input fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({ ...prevFilters, [name]: value })); // Update filters state
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Farm Animals</h1>

      {/* Filter/Search Bar */}
      <div className="flex flex-wrap justify-center gap-4 mb-8 p-6 bg-white shadow-xl rounded-lg border border-gray-200">
        <input
          type="text"
          name="type"
          placeholder="Filter by Type (e.g., Cow)"
          value={filters.type}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm w-full md:w-auto"
        />
        <input
          type="text"
          name="breed"
          placeholder="Filter by Breed"
          value={filters.breed}
          onChange={handleFilterChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm w-full md:w-auto"
        />
        {/* Add a button to apply filters if you don't want instant filtering */}
      </div>

      {/* Add Animal Button (Seller Only) */}
      {userRole === 'FARMER' && (
        <div className="text-center mb-8">
          <Link to="/animals/new" className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300">
            Add New Animal
          </Link>
        </div>
      )}

      {/* Animal Grid Display */}
      {loading && <div className="text-center p-8"><Spinner /> Loading animals...</div>}
      {error && <p className="text-center p-8 text-red-500">{error}</p>}
      {!loading && !error && animals.length === 0 && (
        <div className="text-center p-8 text-gray-500">No animals found matching your criteria.</div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {animals.map(animal => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AnimalListPage;