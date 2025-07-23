// src/pages/CreateAnimalPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAnimal } from '../api/apiService'; // Corrected import
import Input from '../components/common/Input';       // Assuming styled Input component
import Button from '../components/common/Button';     // Assuming styled Button component
  // Assuming Spinner component exists

function CreateAnimalPage() {
  const [name, setName] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [breed, setBreed] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null); // State for the file input
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Store the selected file
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic client-side validation
    if (!name || !animalType || !breed || !price) {
      setError('Please fill in all required fields.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Price must be a positive number.');
      return;
    }

    // Prepare data for the backend. FormData is essential for file uploads.
    const formData = new FormData();
    formData.append('name', name);
    formData.append('animal_type', animalType);
    formData.append('breed', breed);
    formData.append('price', price);
    if (image) {
      formData.append('image', image); // Append the file if selected
    }

    try {
      await createAnimal(formData); // Call backend API
      setSuccessMessage('Animal added successfully!');
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate('/animals'); // Redirect to the animal list page
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        let backendErrors = '';
        for (const field in err.response.data) {
          backendErrors += `${field}: ${err.response.data[field].join(', ')}\n`;
        }
        setError(backendErrors || 'Failed to add animal. Please check the details.');
      } else {
        setError('Failed to add animal. Please try again later.');
      }
      console.error('Create animal error:', err.response || err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Animal</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-xl border border-gray-200 space-y-4">
        {/* Image Upload Section */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">Animal Image</label>
          <div className="flex items-center space-x-4">
            <input type="file" id="image" onChange={handleFileChange} className="sr-only" />
            {/* Custom styled file input button */}
            <label htmlFor="image" className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg shadow-md border border-gray-300 cursor-pointer text-center transition duration-300">
              {image ? 'Change Image' : 'Upload Image'}
            </label>
            {image && <p className="text-xs text-gray-500 truncate w-full max-w-xs">Selected: {image.name}</p>}
          </div>
        </div>
        
        {/* Animal Details Fields */}
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
        
        <Button type="submit" variant="primary" className="w-full flex justify-center py-3 px-4 rounded-md shadow-md transition duration-300">
          Add Animal
        </Button>
      </form>
    </div>
  );
}

export default CreateAnimalPage;