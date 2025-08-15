// app/housemanagement/page.jsx
'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaUpload, FaTriangleExclamation, FaTimes, FaEdit, FaTrash, FaExclamationTriangle, FaSpinner, FaSearch, FaUserTie, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useSession } from 'next-auth/react'; 

// Simple Spinner Component (CSS-based)
const Spinner = ({ size = 'w-5 h-5', color = 'text-white' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function HouseManagementPage() {
  const [imageInputType, setImageInputType] = useState('url');
  const [selectedImages, setSelectedImages] = useState([]); 
  const fileInputRef = useRef(null);

  // State to hold all form data for adding/editing
  const [formData, setFormData] = useState({
    _id: null,
    img: '',
    propertyname: '',
    price: '',
    location: '',
    features: {
      bedrooms: '',
      bathrooms: '',
      size: '',
    },
    viewdetails: 'View Details',
    description: '',
    propertytype: '',
    isFeatured: false,
    coordinates: { lat: '', lng: '' },
    agentName: '',
    agentContactEmail: '',
    agentContactPhone: '',
  });

  // State for loading and feedback messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State to hold all house listings fetched from the database
  const [houseListings, setHouseListings] = useState([]);
  const [isEditing, setIsEditing] = useState(false); 

  // New states for the custom delete confirmation pop-up
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [listingToDeleteId, setListingToDeleteId] = useState(null);

  // --- NextAuth.js Integration ---
  const { data: session, status: sessionStatus } = useSession();
  // Determine if the user is an admin
  const isAdmin = sessionStatus === 'authenticated' && session?.user?.role === 'admin';
  const authCheckLoading = sessionStatus === 'loading'; 


  // State for search feature
  const [searchTerm, setSearchTerm] = useState('');

  // Filter house listings based on search term
  const filteredHouseListings = useMemo(() => {
    if (!searchTerm) {
      return houseListings;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return houseListings.filter(listing =>
      listing.propertyname.toLowerCase().includes(lowercasedSearchTerm) ||
      listing.location.toLowerCase().includes(lowercasedSearchTerm) ||
      (listing.propertytype && listing.propertytype.toLowerCase().includes(lowercasedSearchTerm)) ||
      (listing.features?.bedrooms && listing.features.bedrooms.toLowerCase().includes(lowercasedSearchTerm)) ||
      (listing.features?.bathrooms && listing.features.bathrooms.toLowerCase().includes(lowercasedSearchTerm)) ||
      (listing.features?.size && listing.features.size.toLowerCase().includes(lowercasedSearchTerm)) ||
      (listing.description && listing.description.toLowerCase().includes(lowercasedSearchTerm)) ||
      (listing.agentName && listing.agentName.toLowerCase().includes(lowercasedSearchTerm)) || // Search agent name
      (listing.agentContactEmail && listing.agentContactEmail.toLowerCase().includes(lowercasedSearchTerm)) || // Search agent email
      (listing.agentContactPhone && listing.agentContactPhone.toLowerCase().includes(lowercasedSearchTerm)) // Search agent phone
    );
  }, [houseListings, searchTerm]);


  // Function to fetch all house listings
  const fetchHouseListings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/list');
      if (!res.ok) {
        throw new Error('Failed to fetch house listings');
      }
      const data = await res.json();
      setHouseListings(data);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError(err.message || 'Error fetching listings.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch listings when the component mounts or admin status changes
  useEffect(() => {
    // Only fetch listings if the user is an admin and auth check is complete
    if (!authCheckLoading && isAdmin) {
      fetchHouseListings();
    } else if (!authCheckLoading && !isAdmin) {
      // If not admin, ensure listings are cleared and no loading state is stuck
      setHouseListings([]);
      setLoading(false);
    }
  }, [fetchHouseListings, isAdmin, authCheckLoading]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [name]: value,
      },
    }));
  };

  const handleCoordinatesChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [name]: parseFloat(value) || '', 
      },
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file)
    }));
    setSelectedImages(prevImages => [...prevImages, ...newImages]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setSelectedImages(prevImages => {
      const updatedImages = prevImages.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prevImages[indexToRemove].preview);
      return updatedImages;
    });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      img: '',
      propertyname: '',
      price: '',
      location: '',
      features: {
        bedrooms: '',
        bathrooms: '',
        size: '',
      },
      viewdetails: 'View Details',
      description: '',
      propertytype: '',
      isFeatured: false,
      coordinates: { lat: '', lng: '' },
      agentName: '', 
      agentContactEmail: '',
      agentContactPhone: '',
    });
    setSelectedImages([]);
    setImageInputType('url');
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleEditClick = (post) => {
    if (!isAdmin) { // Check for admin role
      setError('You must be an administrator to edit a listing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setIsEditing(true);
    setError('');
    setSuccess('');

    setFormData({
      _id: post._id,
      propertyname: post.propertyname,
      price: post.price,
      location: post.location,
      features: {
        bedrooms: post.features?.bedrooms || '',
        bathrooms: post.features?.bathrooms || '',
        size: post.features?.size || '',
      },
      viewdetails: post.viewdetails,
      description: post.description || '',
      propertytype: post.propertytype || '',
      isFeatured: post.isFeatured || false,
      coordinates: {
        lat: post.coordinates?.lat || '',
        lng: post.coordinates?.lng || '',
      },
      img: Array.isArray(post.img) ? '' : post.img || '',
      agentName: post.agentName || '', 
      agentContactEmail: post.agentContactEmail || '',
      agentContactPhone: post.agentContactPhone || '',
    });

    if (Array.isArray(post.img) && post.img.length > 0) {
      setSelectedImages(post.img.map(url => ({ file: null, preview: url })));
      setImageInputType('file');
    } else if (post.img) {
      setImageInputType('url');
    } else {
      setImageInputType('url');
      setSelectedImages([]);
    }

    // Smooth scroll to the top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id) => {
    if (!isAdmin) { // Check for admin role
      setError('You must be an administrator to delete a listing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setListingToDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    setShowDeleteConfirm(false); // Close the popup

    try {
      const res = await fetch(`/api/list?id=${listingToDeleteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete the listing.');
      }

      setSuccess('House listing deleted successfully!');
      fetchHouseListings();
    } catch (err) {
      console.error("Delete Error:", err);
      setError(err.message || 'An unknown error occurred during deletion.');
    } finally {
      setLoading(false);
      setListingToDeleteId(null); // Clear the ID after deletion attempt
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setListingToDeleteId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) { // Check for admin role
      setError(`You must be an administrator to ${isEditing ? 'update' : 'add'} a listing.`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const submissionData = new FormData();

    submissionData.append("propertyname", formData.propertyname);
    submissionData.append("price", formData.price);
    submissionData.append("location", formData.location);
    submissionData.append("viewdetails", formData.viewdetails);
    submissionData.append("features", JSON.stringify(formData.features));
    submissionData.append("description", formData.description);
    submissionData.append("propertytype", formData.propertytype);
    submissionData.append("isFeatured", formData.isFeatured);
    submissionData.append("coordinates", JSON.stringify(formData.coordinates));
    submissionData.append("agentName", formData.agentName);
    submissionData.append("agentContactEmail", formData.agentContactEmail);
    submissionData.append("agentContactPhone", formData.agentContactPhone);


    if (imageInputType === 'file') {
      selectedImages.forEach((img, index) => {
        if (img.file) {
          submissionData.append(`image_file_${index}`, img.file);
        } else {
          submissionData.append(`existing_img_${index}`, img.preview);
        }
      });
    } else {
      submissionData.append("img", formData.img);
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/list?id=${formData._id}` : '/api/list';

    try {
      const response = await fetch(url, {
        method: method,
        body: submissionData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} the listing. Please try again.`);
      }

      setSuccess(`House listing ${isEditing ? 'updated' : 'added'} successfully!`);
      resetForm();
      fetchHouseListings();
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-8">{isEditing ? 'Edit House Listing' : 'Add a New House Listing'}</h1>

      {authCheckLoading ? (
        <div className="flex justify-center items-center h-48">
          <Spinner size="w-8 h-8" color="text-blue-500" />
          <p className="ml-3 text-lg text-gray-600">Checking authentication...</p>
        </div>
      ) : !isAdmin ? ( // Check if NOT admin
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8 h-dvh flex flex-col items-center justify-center" role="alert">
          <FaExclamationTriangle className="text-8xl text-red-500 mb-4" /> 
          <h2 className="font-bold text-xl text-center mt-4">Access Denied!</h2> 
          <p className="text-center mt-2">You must be an ADMINISTRATOR to manage house listings.</p> 
          <p className="text-center mt-2">Please contact your system administrator for assistance.</p>
        </div>

      ) : ( // Render form and table if admin
        <>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md mb-12">
            {/* Basic Info */}
            <div>
              <label htmlFor="propertyname" className="block text-sm font-medium text-gray-700">Property Name</label>
              <input type="text" name="propertyname" id="propertyname" value={formData.propertyname} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (e.g., KES 45,000)</label>
              <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (e.g., Kilimani, Nairobi)</label>
              <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>

            {/* Property Type */}
            <div>
              <label htmlFor="propertytype" className="block text-sm font-medium text-gray-700">Property Type</label>
              <select name="propertytype" id="propertytype" value={formData.propertytype} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Studio">Studio</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"></textarea>
            </div>

            {/* Features */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-2">Features</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm">Bedrooms (e.g., 2 Beds)</label>
                  <input type="text" name="bedrooms" id="bedrooms" value={formData.features.bedrooms} onChange={handleFeatureChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-sm">Bathrooms (e.g., 1 Bath)</label>
                  <input type="text" name="bathrooms" id="bathrooms" value={formData.features.bathrooms} onChange={handleFeatureChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm">Size (e.g., 850 sqft)</label>
                  <input type="text" name="size" id="size" value={formData.features.size} onChange={handleFeatureChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>
            </fieldset>

            {/* Coordinates */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-2">Coordinates (Latitude & Longitude)</legend>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-sm">Latitude</label>
                  <input type="number" step="any" name="lat" id="lat" value={formData.coordinates.lat} onChange={handleCoordinatesChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="lng" className="block text-sm">Longitude</label>
                  <input type="number" step="any" name="lng" id="lng" value={formData.coordinates.lng} onChange={handleCoordinatesChange} required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>
            </fieldset>

            {/* Agent Details */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
              <legend className="text-sm font-medium text-gray-700 px-2">Agent Details (Optional)</legend>
              <div className="space-y-4">
                <div>
                  <label htmlFor="agentName" className="block text-sm">Agent Name</label>
                  <input type="text" name="agentName" id="agentName" value={formData.agentName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="agentContactEmail" className="block text-sm">Agent Email</label>
                  <input type="email" name="agentContactEmail" id="agentContactEmail" value={formData.agentContactEmail} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="agentContactPhone" className="block text-sm">Agent Phone</label>
                  <input type="tel" name="agentContactPhone" id="agentContactPhone" value={formData.agentContactPhone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>
            </fieldset>

            {/* Is Featured Checkbox */}
            <div className="flex items-center">
              <input type="checkbox" name="isFeatured" id="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="isFeatured" className="ml-2 block text-sm font-medium text-gray-700">Mark as Featured Property</label>
            </div>

            {/* --- IMAGE INPUT SECTION --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Image(s)</label>
              <div className="m-2 flex rounded-md border border-gray-300 max-w-fit">
                <button type="button" onClick={() => {
                  setImageInputType('url');
                  setSelectedImages([]);
                  if (formData._id) setFormData(prev => ({ ...prev, img: '' }));
                }} className={`px-4 py-2 rounded-l-md ${imageInputType === 'url' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>URL</button>
                <button type="button" onClick={() => {
                  setImageInputType('file');
                  setFormData(prev => ({ ...prev, img: '' }));
                }} className={`px-4 py-2 rounded-r-md ${imageInputType === 'file' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}>Upload</button>
              </div>

              {imageInputType === 'url' ? (
                <div className="mt-4">
                  <label htmlFor="img" className="sr-only">Image URL</label>
                  <input type="text" name="img" id="img" value={formData.img} onChange={handleChange} placeholder="https://example.com/image.png" className="w-full border border-gray-300 rounded-md p-2" />
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-4">
                  {selectedImages.map((img, index) => (
                    <div key={img.preview || `new-${index}`} className="relative w-40 h-40 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                      <img src={img.preview} alt={`Property Preview ${index + 1}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}

                  <label
                    htmlFor="image_file"
                    className="cursor-pointer w-40 h-40 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-all"
                  >
                    <FaUpload className="text-4xl mb-2" />
                    <p className="text-sm font-semibold">Add Image(s)</p>
                    <input
                      type="file"
                      name="image_file"
                      id="image_file"
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      className="sr-only"
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              )}
            </div>


            {success && <p className="text-green-600 bg-green-100 p-3 rounded-md">{success}</p>}
            {error && <p className="text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}

            <div className="flex gap-4">
                <button type="submit" disabled={loading || !isAdmin} className="flex-1 bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-semibold flex items-center justify-center">
                {loading ? <Spinner /> : (isEditing ? 'Update Listing' : 'Add Listing')}
                </button>
                {isEditing && (
                    <button
                        type="button"
                        onClick={resetForm}
                        disabled={loading || !isAdmin}
                        className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md hover:bg-gray-400 disabled:bg-gray-200 font-semibold"
                    >
                        Cancel Edit
                    </button>
                )}
            </div>
          </form>

          {/* House Listings Management Table */}
          <h2 className="text-3xl font-bold text-center mb-6">Manage Existing Listings</h2>

          {/* Search Bar */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by name, location, type, features, description, or agent details..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>


          {loading && houseListings.length === 0 ? (
            <div className="flex justify-center items-center h-32">
              <Spinner size="w-8 h-8" color="text-blue-500" />
              <p className="ml-3 text-lg text-gray-600">Loading listings...</p>
            </div>
          ) : error && houseListings.length === 0 && !loading ? (
            <p className="text-center text-red-600">Error: {error}</p>
          ) : filteredHouseListings.length === 0 && !loading && !error && searchTerm ? (
            <p className="text-center text-gray-600">No listings found matching "{searchTerm}".</p>
          ) : filteredHouseListings.length === 0 && !loading && !error && !searchTerm ? (
            <p className="text-center text-gray-600">No listings found. Add one above!</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coordinates</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Phone</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHouseListings.map((post) => (
                    <tr key={post._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Array.isArray(post.img) && post.img.length > 0 ? (
                          <img src={post.img[0]} alt={post.propertyname} className="h-12 w-12 object-cover rounded-md" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-xs">No Image</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.propertyname}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.propertytype}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.isFeatured ? <p className="text-green-600">&#10003;</p> : <p className="text-red-600">&#10007;</p>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.coordinates ? `${post.coordinates.lat?.toFixed(4) || ''}, ${post.coordinates.lng?.toFixed(4) || ''}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {post.features?.bedrooms} | {post.features?.bathrooms} | {post.features?.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.agentName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.agentContactEmail || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.agentContactPhone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(post)}
                          className={`text-blue-600 hover:text-blue-900 mr-3 ${!isAdmin && 'opacity-50 cursor-not-allowed'}`}
                          aria-label={`Edit ${post.propertyname}`}
                          disabled={!isAdmin}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(post._id)}
                          className={`text-red-600 hover:text-red-900 ${!isAdmin && 'opacity-50 cursor-not-allowed'}`}
                          aria-label={`Delete ${post.propertyname}`}
                          disabled={!isAdmin}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Custom Delete Confirmation Pop-up */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-500 text-white rounded-t-lg">
              <h3 className="text-lg font-bold flex items-center">
                <FaExclamationTriangle className="mr-2 text-xl" /> Delete Listing
              </h3>
              <button onClick={cancelDelete} className="text-white hover:text-gray-100">
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 text-md mb-6">Are you sure you want to delete this listing?</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Okay
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}