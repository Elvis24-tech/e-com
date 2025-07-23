// src/pages/EditAnimalPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimalDetail, updateAnimal } from '../api/apiService'; // Corrected import
import Input from '../components/common/Input';       // Assuming styled Input component
import Button from '../components/common/Button';     // Assuming styled Button component

function EditAnimalPage() {
  const { id } = useParams(); // Get animal ID from URL parameters
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [breed, setBreed] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // State for the file input
  const [currentImageUrl, setCurrentImageUrl] = useState(''); // To display the current image
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadAnimalData = async () => {
      try {
        const response = await fetchAnimalDetail(id); // Use imported API function
        const animalData = response.data;
        setName(animalData.name);
        setAnimalType(animalData.animal_type);
        setBreed(animalData.breed);
        setPrice(animalData.price);
        setCurrentImageUrl(animalData.image); // Store current image URL for display
      } catch (err) {
        setError('Could not load animal data for editing.');
        console.error('Error fetching animal for edit:', err);
      }
    };
    loadAnimalData();
  }, [id]); // Re-fetch if the animal ID in the URL changes

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Set new image
      setCurrentImageUrl(URL.createObjectURL(e.target.files[0])); // Show a preview of the new image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic validation
    if (!name || !animalType || !breed || !price) {
      setError('Please fill in all required fields.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    // Prepare data for the backend. Use FormData for image uploads.
    const formData = new FormData();
    formData.append('name', name);
    formData.append('animal_type', animalType);
    formData.append('breed', breed);
    formData.append('price', price);
    if (image) { // Only append the image if a new file was selected
      formData.append('image', image);
    }

    try {
      await updateAnimal(id, formData); // Call backend API to update the animal
      setSuccessMessage('Animal updated successfully!');
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate(`/animals/${id}`); // Redirect to the animal detail page
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        let backendErrors = '';
        for (const field in err.response.data) {
          backendErrors += `${field}: ${err.response.data[field].join(', ')}\n`;
        }
        setError(backendErrors || 'Failed to update animal.');
      } else {
        setError('Failed to update animal. Please try again later.');
      }
      console.error('Update animal error:', err.response || err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Edit Animal</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-4">
        {/* Image Preview and Upload */}
        <div className="flex flex-col md:flex-row gap-8 mb-6">
          <div className="md:w-1/3">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Animal Image</label>
            <div className="relative">
              <input type="file" id="image" onChange={handleFileChange} className="sr-only" />
              {/* Custom styled file input button */}
              <label htmlFor="image" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-md border border-gray-300 cursor-pointer text-center transition duration-300">
                {image ? 'Change Image' : 'Upload Image'}
              </label>
              {/* Display the currently selected file name or the existing image preview */}
              {!image && currentImageUrl && (
                <img src={currentImageUrl} alt="Current Animal" className="mt-2 w-full h-32 object-cover rounded-md border border-gray-300" />
              )}
              {image && ( // Show preview of the new image
                 <img src={currentImageUrl} alt="New Animal Preview" className="mt-2 w-full h-32 object-cover rounded-md border border-gray-300" />
              )}
            </div>
          </div>

          {/* Animal Details Fields */}
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input name="name" label="Animal Name" value={name} onChange={(e) => setName(e.target.value)} error={error.name} />
            </div>
            <div>
              <Input name="animalType" label="Animal Type" value={animalType} onChange={(e) => setAnimalType(e.target.value)} error={error.animalType} />
            </div>
            <div>
              <Input name="breed" label="Breed" value={breed} onChange={(e) => setBreed(e.target.value)} error={error.breed} />
            </div>
            <div>
              <Input name="price" label="Price (Ksh)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} error={error.price} />
            </div>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition duration-300">
          Update Animal
        </button>
      </form>
    </div>
  );
}

export default EditAnimalPage;