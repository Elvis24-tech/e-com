// src/components/AnimalCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // For programmatic navigation
import { deleteAnimal } from '../../api/apiService'; // Import the delete animal API function
import Button from '../common/Button';          // Assuming styled Button component

const AnimalCard = ({ animal, onEdit }) => { // Receives animal data and an onEdit handler
  const userRole = localStorage.getItem('userRole'); // Get user role for conditional rendering
  const navigate = useNavigate(); // Hook for navigation

  // Use a fallback image if the animal has no image or the image URL fails to load
  const fallbackImage = '/images/placeholder_animal.png'; // Ensure this image exists in public/images/
  const animalImageUrl = animal.image ? animal.image : fallbackImage;

  // Handler to navigate to the animal's detail page
  const handleViewDetails = () => {
    navigate(`/animals/${animal.id}`);
  };

  // Handler to call the edit function passed from the parent
  const handleEdit = () => {
    if (onEdit) onEdit(animal); // Pass the animal object to the parent handler
  };

  // Handler to delete an animal (seller action)
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this animal listing?')) {
      try {
        await deleteAnimal(animal.id); // Call the API to delete the animal
        alert('Animal deleted successfully!');
        window.location.reload(); // Refresh the page to reflect the deletion
      } catch (err) {
        console.error('Failed to delete animal:', err);
        alert('Failed to delete animal. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl relative">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={animalImageUrl}
          alt={animal.name || 'Farm Animal'}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }} // Fallback to placeholder image on error
        />
        {/* Status Badge (e.g., Sold) - visible only if sold */}
        {animal.is_sold && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg shadow-md">
            Sold
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{animal.name}</h3>
        <p className="text-gray-600 text-sm mb-1 flex items-center">
          <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 00-14.848-6.037A1.052 1.052 0 008 6.037c0-.172.037-.343.101-.503.75-.75 1.755-1.355 2.916-1.755C12.288 4.026 13.846 4 15 4s3.111.026 4.379 1.084C17.05 7.722 18 9.239 18 11c0 2.761-2.239 5-5 5z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {animal.animal_type}
        </p>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
           <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16l2-2 2 2m0-8l-2-2-2 2M7 13h3m3-3h3"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4h16v16H4z"></path></svg>
          {animal.breed}
        </p>
        <p className="text-gray-800 font-bold text-2xl mt-3">Ksh {animal.price}</p>

        <div className="mt-6 flex space-x-4">
          {/* Button to view details */}
          <button onClick={handleViewDetails} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300">
            View Details
          </button>
          
          {/* Edit Button - visible only for Farmers */}
          {userRole === 'FARMER' && (
            <button onClick={handleEdit} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300">
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimalCard;