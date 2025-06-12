import React, { useState, useEffect } from 'react';
import { Clock, Users, Menu, ShoppingCart, User, Heart, Search, Gavel, Check, X, Eye, Calendar, DollarSign, Package } from 'lucide-react';


const AdminAuctionManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]); // This will remain empty as no API is provided for it.
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [scheduledDuration, setScheduledDuration] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const getAuthToken = () => {
    const token = localStorage.getItem('token'); 
    if (!token) {
      console.warn("Authentication token not found in localStorage. API requests may fail with 401/403. Please ensure you are logged in and the token is stored correctly.");
    }
    return token;
  };

  const commonHeaders = () => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchAuctionRequests = async () => {
    setLoadingRequests(true);
    setErrorRequests(null);
    try {
      const response = await fetch('http://localhost:3000/auctionRequest/all', {
        headers: commonHeaders(),
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please log in to access this resource.");
      }
      if (response.status === 403) {
        throw new Error("Forbidden: You do not have permission to access this resource.");
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPendingRequests(data);
    } catch (err) {
      console.error("Failed to fetch auction requests:", err);
      setErrorRequests(`Failed to load auction requests: ${err.message}.`);
    } finally {
      setLoadingRequests(false);
    }
  };

 
  useEffect(() => {
    fetchAuctionRequests();
    setActiveAuctions([]);
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setScheduledDuration(selectedRequest.duration ? String(selectedRequest.duration) : ''); 
      setScheduledStartDate('');
      setDeclineReason('');
      setFeedbackMessage('');
    }
  }, [selectedRequest]);

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;

    if (!scheduledStartDate) {
      setFeedbackMessage('Error: Please select a start date and time for the auction.');
      return;
    }
    if (!scheduledDuration || isNaN(parseInt(scheduledDuration)) || parseInt(scheduledDuration) <= 0) {
      setFeedbackMessage('Error: Please provide a valid duration in days (a positive number).');
      return;
    }

    setFeedbackMessage('Processing approval and creating auction...');

    const requestId = selectedRequest.id;
    const duration = parseInt(scheduledDuration);
    const startDateISO = new Date(scheduledStartDate).toISOString();

    const approvalBody = {
      startDate: startDateISO,
      Duration: duration,
      adminNotes: "Approved and scheduled by admin."
    };

    try {
      const approveResponse = await fetch(`http://localhost:3000/auctionRequest/approve/${requestId}`, {
        method: 'POST',
        headers: commonHeaders(),
        body: JSON.stringify(approvalBody),
      });

      if (!approveResponse.ok) {
        const errorData = await approveResponse.json();
        throw new Error(`Failed to approve request: ${errorData.message || approveResponse.statusText}`);
      }
      
      console.log('Auction request approved:', await approveResponse.json());

      const createAuctionBody = {
        startDate: startDateISO, 
        Duration: duration,   
        adminNotes: "Auction created automatically after request approval."
      };

      const createResponse = await fetch('http://localhost:3000/auction/create', {
        method: 'POST',
        headers: commonHeaders(),
        body: JSON.stringify(createAuctionBody),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(`Failed to create auction after approval: ${errorData.message || createResponse.statusText}`);
      }
      
      console.log('Auction created:', await createResponse.json());

      setFeedbackMessage(`Auction "${selectedRequest.title}" approved and created successfully!`);
      setSelectedRequest(null);
      fetchAuctionRequests();
    } catch (err) {
      console.error("Error during approval/creation:", err);
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  const handleDeclineRequest = async () => {
    if (!selectedRequest) return;

    setFeedbackMessage('Processing decline...');

    const requestId = selectedRequest.id;
    const declineBody = {
      adminNotes: declineReason || "No specific reason provided."
    };

    try {
      const response = await fetch(`http://localhost:3000/auctionRequest/reject/${requestId}`, {
        method: 'POST',
        headers: commonHeaders(),
        body: JSON.stringify(declineBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to decline request: ${errorData.message || response.statusText}`);
      }
      
      console.log('Auction request declined:', await response.json());
      setFeedbackMessage(`Auction "${selectedRequest.title}" declined successfully.`);
      setSelectedRequest(null);
      fetchAuctionRequests();
    } catch (err) {
      console.error("Error declining request:", err);
      setFeedbackMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md::text-4xl font-bold text-burgundy mb-4">Auction Management</h1>
          <p className="text-lg text-burgundy/70">Manage auction requests and active auctions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-cream border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-burgundy/60 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-burgundy">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-coral" />
            </div>
          </div>
          
          <div className="bg-cream border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-burgundy/60 text-sm">Active Auctions</p>
                <p className="text-2xl font-bold text-burgundy">{activeAuctions.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-coral" />
            </div>
          </div>
          
          <div className="bg-cream border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-burgundy/60 text-sm">Total Bids Today</p>
                <p className="text-2xl font-bold text-burgundy">47</p>
              </div>
              <Users className="h-8 w-8 text-coral" />
            </div>
          </div>
          
          <div className="bg-cream border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-burgundy/60 text-sm">Revenue This Month</p>
                <p className="text-2xl font-bold text-burgundy">$8,420</p>
              </div>
              <DollarSign className="h-8 w-8 text-coral" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="w-full">
          <div className="flex flex-wrap gap-2 mb-8 border-b border-coral/20">
            <button 
              onClick={() => setActiveTab('requests')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'requests' 
                  ? 'text-burgundy border-b-2 border-burgundy' 
                  : 'text-burgundy/60 hover:text-burgundy'
              }`}
            >
              Auction Requests
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 font-medium text-sm transition-colors ${
                activeTab === 'active' 
                  ? 'text-burgundy border-b-2 border-burgundy' 
                  : 'text-burgundy/60 hover:text-burgundy'
              }`}
            >
              Active Auctions
            </button>
          </div>

          {feedbackMessage && (
            <div className={`p-3 mb-4 rounded-md text-sm ${
              feedbackMessage.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            }`}>
              {feedbackMessage}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              {loadingRequests && <p className="text-burgundy/70">Loading auction requests...</p>}
              {errorRequests && <p className="text-red-500">{errorRequests}</p>}
              {!loadingRequests && pendingRequests.length === 0 && !errorRequests && <p className="text-burgundy/70">No pending auction requests.</p>}
              <div className="grid gap-6">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-cream border border-coral/20 rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-burgundy mb-2">{request.title}</h3>
                          <p className="text-burgundy/70 mb-2">by {request.artist}</p>
                          <div className="flex items-center gap-4 text-sm text-burgundy/60">
                            <span>{request.category}</span>
                            <span>•</span>
                            <span>Starting bid: ${request.startingBid}</span>
                            <span>•</span>
                            <span>Reserve: ${request.reservePrice}</span>
                            <span>•</span>
                            <span>{request.duration} days</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSelectedRequest(request)}
                            className="inline-flex items-center gap-2 bg-burgundy/10 hover:bg-burgundy/20 text-burgundy px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Review
                          </button>
                        </div>
                      </div>

                      {selectedRequest?.id === request.id && (
                        <div className="border-t border-coral/20 pt-6 mt-6">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                              <img 
                                src={request.images[0]} 
                                alt={request.title}
                                className="w-full h-64 object-cover rounded-lg mb-4"
                              />
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-burgundy mb-2">Artist Information</h4>
                                  <p className="text-sm text-burgundy/70">Rating: {request.artistRating}/5</p>
                                  <p className="text-sm text-burgundy/70">Previous sales: {request.previousSales}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-burgundy mb-2">Item Details</h4>
                                  <p className="text-sm text-burgundy/70 mb-1"><strong>Materials:</strong> {request.materials}</p>
                                  <p className="text-sm text-burgundy/70"><strong>Dimensions:</strong> {request.dimensions}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium text-burgundy mb-2">Description</h4>
                                  <p className="text-sm text-burgundy/70">{request.description}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium text-burgundy mb-2">Schedule Auction</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <label htmlFor={`startDate-${request.id}`} className="block text-sm font-medium text-burgundy mb-1">Start Date and Time</label>
                                      <input 
                                        id={`startDate-${request.id}`}
                                        type="datetime-local"
                                        value={scheduledStartDate}
                                        onChange={(e) => setScheduledStartDate(e.target.value)}
                                        className="w-full p-2 border border-coral/30 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                      />
                                    </div>
                                    <div>
                                      <label htmlFor={`duration-${request.id}`} className="block text-sm font-medium text-burgundy mb-1">Duration (days)</label>
                                      <input 
                                        id={`duration-${request.id}`}
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 7"
                                        value={scheduledDuration}
                                        onChange={(e) => setScheduledDuration(e.target.value)}
                                        className="w-full p-2 border border-coral/30 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-3">
                                  <button 
                                    onClick={handleApproveRequest}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                  >
                                    <Check className="h-4 w-4" />
                                    Approve
                                  </button>
                                  <button 
                                    onClick={handleDeclineRequest}
                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                                  >
                                    <X className="h-4 w-4" />
                                    Decline
                                  </button>
                                </div>
                                <div>
                                  <label htmlFor={`declineReason-${request.id}`} className="block text-sm font-medium text-burgundy mb-1">Decline Reason (if applicable)</label>
                                  <textarea 
                                    id={`declineReason-${request.id}`}
                                    className="w-full p-2 border border-coral/30 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                    rows={3}
                                    placeholder="Provide feedback for the artist..."
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-burgundy">Active Auctions</h2>
              <p className="text-burgundy/70">
              </p>
              {activeAuctions.length === 0 && <p className="text-burgundy/70">No active auctions to display.</p>}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default AdminAuctionManagement;