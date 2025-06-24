import React, { useState, useEffect, useRef } from 'react';
import { Camera, ChevronDown, Settings, Upload, Edit, Trash2, Package, DollarSign, Users, Star, Clock, Plus, Menu, ShoppingCart, User, Heart, Search, Gavel, AlertCircle, Loader2 } from 'lucide-react';



const AuctionRequest = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showAuctionRequestForm, setShowAuctionRequestForm] = useState(false);

  const [auctionFormData, setAuctionFormData] = useState({
    title: '',
    category: '',
    startingBid: '',
    description: '',
    materials: '',
    dimensions: '',
    notes: '',
    duration: '7',
    images: [],
  });

  const [auctionRequests, setAuctionRequests] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [error, setError] = useState(null);
  const [categoriesError, setCategoriesError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Helper function to get the auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found in localStorage. Please log in.');
    }
    return token;
  };

  const fetchArtistAuctionRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in to view auction requests.');
      }

      const response = await fetch('http://localhost:3000/auctionRequest/my-requests', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
          },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch auction requests');
      }
      const data = await response.json();
      setAuctionRequests(data);
    } catch (err) {
      console.error('Error fetching auction requests:', err);
      setError(err.message || 'Failed to load auction requests.');
    } finally {
      setLoading(false);
    }
  };

 const fetchCategories = async () => {
    setLoadingCategories(true);
    setCategoriesError(null);
    try {
      const response = await fetch('http://localhost:3000/category/all');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch categories.');
      }
      const data = await response.json();
      setCategoriesList(data.categories || []); // Assuming response is { categories: [...] }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategoriesError(err.message || 'Failed to load categories.');
    } finally {
      setLoadingCategories(false);
    }
  };


 useEffect(() => {
    fetchArtistAuctionRequests(); 
    fetchCategories();            
  }, []); 

  // --- Handle Form Input Changes ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuctionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + auctionFormData.images.length > 5) {
        setError('You can only upload a maximum of 5 images.');
        return;
    }
    setAuctionFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setError(null);
  };

  const handleRemoveImage = (index) => {
    setAuctionFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // --- Handle Auction Request Submission ---
  const handleAuctionRequestSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Basic validation
    if (!auctionFormData.title || !auctionFormData.description || !auctionFormData.startingBid ||
        !auctionFormData.category || !auctionFormData.materials || !auctionFormData.dimensions ||
        auctionFormData.images.length < 1 || auctionFormData.images.length > 5) {
      setError('Please provide all required fields and between 1 to 5 images.');
      setLoading(false);
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found. Please log in before submitting an auction request.');
      }

      // Step 1: Create Product
      const productFormData = new FormData();
      productFormData.append('name', auctionFormData.title);
      productFormData.append('description', auctionFormData.description);
      productFormData.append('price', auctionFormData.startingBid);
      productFormData.append('categoryName', auctionFormData.category);
      productFormData.append('quantity', 1);
      productFormData.append('dimension', auctionFormData.dimensions); 
      productFormData.append('material', auctionFormData.materials);   

      auctionFormData.images.forEach((file) => {
        productFormData.append('image', file); 
      });

      const productResponse = await fetch('http://localhost:3000/product/create', {
        method: 'POST',
        body: productFormData,
        headers: {
            'Authorization': `Bearer ${token}`
        },
      });

      if (!productResponse.ok) {
        const errorData = await productResponse.json();
        throw new Error(errorData.message || 'Failed to create product.');
      }
      const productResult = await productResponse.json();
      const productId = productResult.product.productId;

      // Step 2: Create Auction Request
      const auctionRequestPayload = {
        productId: productId,
        startingPrice: parseFloat(auctionFormData.startingBid),
        Duration: parseInt(auctionFormData.duration),
        notes: auctionFormData.notes,
      };

      const auctionResponse = await fetch('http://localhost:3000/auctionRequest/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(auctionRequestPayload),
      });

      if (!auctionResponse.ok) {
        const errorData = await auctionResponse.json();
        throw new Error(errorData.message || 'Failed to create auction request.');
      }

      setSuccessMessage('Auction request submitted successfully!');
      // Reset form fields
      setAuctionFormData({
        title: '',
        category: '',
        startingBid: '',
        description: '',
        materials: '',
        dimensions: '',
        notes: '',
        duration: '7',
        images: [],
      });
      setShowAuctionRequestForm(false);

      // Re-fetch auction requests to update the list
      fetchArtistAuctionRequests(); // Call the now globally defined function

    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  // Maps backend status to frontend display
  const getStatusClasses = (status) => {
    switch (status && status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scheduled': return 'bg-green-100 text-green-800';
      case 'ended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


    return (
        <>
        <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-black">Auction Requests</h2>
                        <button
                          onClick={() => setShowAuctionRequestForm(true)}
                          className="inline-flex items-center gap-2 bg-coral hover:bg-coral/90 text-cream px-4 py-2 rounded-md font-medium transition-colors"
                        >
                          <Gavel className="h-4 w-4" />
                          Request Auction
                        </button>
                      </div>

                    {successMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success!</strong>
                            <span className="block sm:inline"> {successMessage}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage(null)}>
                                <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 1 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </span>
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error!</strong>
                            <span className="block sm:inline"> {error}</span>
                            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 1 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 1 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                            </span>
                        </div>
                    )}

                      {showAuctionRequestForm && (
                        <div className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
                          <h3 className="text-xl font-semibold text-black mb-6">Request New Auction</h3>
                          <form onSubmit={handleAuctionRequestSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-xl border border-[#f9d2d9]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="title" className="block font-semibold text-sm text-[#7a162e] mb-2">Item Title</label>
                                <input
                                  id="title"
                                  name="title"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  placeholder="Auction item name"
                                  value={auctionFormData.title}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                                <label htmlFor="category" className="block font-semibold text-sm text-[#7a162e] mb-2">Category</label>
                                <select
                                  id="category"
                                  name="category"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg bg-white shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  value={auctionFormData.category}
                                  onChange={handleInputChange}
                                  disabled={loadingCategories}
                                >
                                  <option value="">
                                    {loadingCategories ? 'Loading categories...' : 'Select category'}
                                  </option>
                                  {categoriesError && (
                                    <option value="" disabled>Error loading categories</option>
                                  )}
                                  {categoriesList.map((cat) => (
                                    <option key={cat.categoryId} value={cat.name}>
                                      {cat.name}
                                    </option>
                                  ))}
                                </select>
                                {categoriesError && (
                                  <p className="text-sm text-red-500 mt-1">{categoriesError}</p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label htmlFor="description" className="block font-semibold text-sm text-[#7a162e] mb-2">Description</label>
                              <textarea
                                id="description"
                                name="description"
                                className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                rows={4}
                                placeholder="Detailed description of your item, including craftsmanship details..."
                                value={auctionFormData.description}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <div>
                                <label htmlFor="startingBid" className="block font-semibold text-sm text-[#7a162e] mb-2">Starting Bid (L.E)</label>
                                <input
                                  id="startingBid"
                                  name="startingBid"
                                  type="number"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  placeholder="0.00"
                                  value={auctionFormData.startingBid}
                                  onChange={handleInputChange}
                                />
                              </div>

                              <div>
                                <label htmlFor="duration" className="block font-semibold text-sm text-[#7a162e] mb-2">Auction Duration</label>
                                <select
                                  id="duration"
                                  name="duration"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  value={auctionFormData.duration}
                                  onChange={handleInputChange}
                                >
                                  <option value="3">3 days</option>
                                  <option value="7">7 days</option>
                                  <option value="10">10 days</option>
                                </select>
                              </div>

                              <div>
                                <label htmlFor="notes" className="block font-semibold text-sm text-[#7a162e] mb-2">Notes</label>
                                <input
                                  id="notes"
                                  name="notes"
                                  type="text"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  placeholder="Enter your notes..."
                                  value={auctionFormData.notes}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label htmlFor="materials" className="block font-semibold text-sm text-[#7a162e] mb-2">Materials</label>
                                <input
                                  id="materials"
                                  name="materials"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  placeholder="e.g., Clay, Natural glaze, Gold leaf"
                                  value={auctionFormData.materials}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div>
                                <label htmlFor="dimensions" className="block font-semibold text-sm text-[#7a162e] mb-2">Dimensions</label>
                                <input
                                  id="dimensions"
                                  name="dimensions"
                                  className="w-full px-4 py-3 border border-[#f3c7ce] rounded-lg shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07385]"
                                  placeholder="e.g., 8 x 6 x 4 inches"
                                  value={auctionFormData.dimensions}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block font-semibold text-sm text-[#7a162e] mb-2">Upload Images</label>
                              <div
                                className="relative border-4 border-dashed border-[#E07385] rounded-xl p-6 text-center bg-[#fff0f3] hover:bg-[#ffe6eb] transition cursor-pointer"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <Upload className="h-8 w-8 text-[#7a162e]/60 mx-auto mb-2" />
                                <p className="text-[#7a162e] font-medium">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500">PNG, JPG up to 10MB (minimum 1 image, maximum 5 images)</p>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                  ref={fileInputRef}
                                  onChange={handleImageChange}
                                />
                              </div>
                              {auctionFormData.images.length > 0 && (
                                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                  {auctionFormData.images.map((file, index) => (
                                    <div key={index} className="relative group overflow-hidden rounded-xl border-2 border-[#E07385] shadow-md bg-white hover:scale-105 transition">
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Uploaded ${index}`}
                                        className="w-full h-32 object-contain"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-white text-[#E07385] border border-[#E07385] rounded-full px-2 py-0.5 text-xs font-bold hover:bg-[#E07385] hover:text-white transition"
                                        title="Remove"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="flex gap-4 justify-end pt-4">
                              <button
                                type="submit"
                                className="bg-[#E07385] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#7a162e] transition disabled:opacity-50"
                                disabled={loading || loadingCategories}
                              >
                                {loading ? <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" /> : null}
                                Submit Request
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowAuctionRequestForm(false)}
                                className="bg-[#fbe4e9] text-[#7a162e] px-6 py-3 rounded-lg font-semibold hover:bg-[#f5ccd4] transition disabled:opacity-50"
                                disabled={loading || loadingCategories}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>

                        </div>
                      )}

                      {/* Auction Requests List */}
                        {!showAuctionRequestForm && (
                          <div className="bg-white border border-coral/20 rounded-lg shadow-sm">
                            <div className="p-6 border-b border-coral/20">
                              <h3 className="text-lg font-semibold text-black">Your Auction Requests</h3>
                            </div>
                            {loading && (
                                <div className="p-6 text-center text-burgundy">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                    Fetching auction requests...
                                </div>
                            )}
                            {!loading && auctionRequests.length === 0 && (
                                <div className="p-6 text-center text-burgundy/60">
                                    No auction requests found.
                                </div>
                            )}
                            {!loading && auctionRequests.length > 0 && (
                                <div className="divide-y divide-coral/20">
                                  {auctionRequests.map((request) => (
                                      <div key={request.requestId} className="p-6 flex items-center justify-between">
                                        <div className="flex-1">
                                          <h4 className="font-medium text-burgundy">{request.product.name || 'Product Title'}</h4>
                                          <p className="text-sm text-burgundy/60">
                                            {request.product.categoryName || 'Category'} • Starting bid: ${request.startingPrice}
                                          </p>
                                          <p className="text-xs text-burgundy/40">
                                            Submitted: {new Date(request.createdAt).toLocaleDateString()}
                                          </p>
                                          {request.status === 'declined' && request.reason && (
                                            <p className="text-xs text-red-600 mt-1">Reason: {request.reason}</p>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClasses(request.status)}`}>
                                            {request.status && request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                          </span>
                                          {request.status === 'declined' && (
                                            <button className="text-burgundy hover:text-coral text-sm font-medium">
                                              Resubmit
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                  ))}
                                </div>
                            )}
                          </div>
                        )}

                    </div>
                    </>
    );
};

export default AuctionRequest;