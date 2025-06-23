import React, { useState, useEffect } from 'react';
import {
  Clock, Users, Gavel, Check, X, Eye, DollarSign,
} from 'lucide-react';

const AdminAuctionManagement = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeAuctions, setActiveAuctions] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduledStartDate, setScheduledStartDate] = useState('');
  const [scheduledDuration, setScheduledDuration] = useState('');
const [adminNotes, setAdminNotes] = useState('');

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [errorRequests, setErrorRequests] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const formatEndDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  if (isNaN(date)) return 'Invalid date';
  return date.toLocaleString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

  const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("Authentication token not found in localStorage.");
    }
    return token;
  };

  const commonHeaders = () => {
    const token = getAuthToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchActiveAuctions = async () => {
  try {
    const response = await fetch('http://localhost:3000/auction', {
      headers: commonHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { auctions } = await response.json();
    setActiveAuctions(auctions);
  } catch (err) {
    console.error("Failed to fetch active auctions:", err);
    setErrorRequests(`Failed to load active auctions: ${err.message}`);
  }
};

const fetchAuctionRequests = async () => {
  setLoadingRequests(true);
  setErrorRequests(null);
  try {
    const response = await fetch('http://localhost:3000/auctionRequest/all', {
      headers: commonHeaders(),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // 🟡 Split based on status
    const pending = data.filter(req => req.status === 'pending');
    const active = data.filter(req =>
      req.status === 'scheduled' || req.status === 'active'
    );

    setPendingRequests(pending);
    setActiveAuctions(active);
  } catch (err) {
    console.error("Failed to fetch auction requests:", err);
    setErrorRequests(`Failed to load auction requests: ${err.message}.`);
  } finally {
    setLoadingRequests(false);
  }
};


  useEffect(() => {
    fetchAuctionRequests();
    fetchActiveAuctions();
  }, []);

  useEffect(() => {
    if (selectedRequest) {
      setScheduledDuration(selectedRequest.duration ? String(selectedRequest.duration) : '');
      setScheduledStartDate('');
      setAdminNotes('');
      setFeedbackMessage('');
    }
  }, [selectedRequest]);

const handleApproveRequest = async () => {
  if (!selectedRequest || !scheduledStartDate) {
    setFeedbackMessage('Error: Please select a start date for the auction.');
    return;
  }

const durationInDays = scheduledDuration
  ? parseInt(scheduledDuration)
  : selectedRequest.suggestedDuration;
  const requestId = selectedRequest.requestId;
  const startDate = new Date(scheduledStartDate).toISOString().split("T")[0];
  const approvalBody = {
    startDate,
     Duration: durationInDays * 24, 
    adminNotes: adminNotes || "No notes provided.",
  };

  try {
    const response = await fetch(`http://localhost:3000/auctionRequest/schedule/${requestId}`, {
      method: 'POST',
      headers: commonHeaders(),
      body: JSON.stringify(approvalBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    setFeedbackMessage('Auction request approved and scheduled.');
    setPendingRequests(prev => prev.filter(req => req.requestId !== requestId));
    setSelectedRequest(null);
  } catch (err) {
    console.error("Error approving request:", err);
    setFeedbackMessage(`Error: ${err.message}`);
  }
};


const handleDeclineRequest = async () => {
  if (!selectedRequest) return;

  const requestId = selectedRequest.requestId;
  const declineBody = {
    adminNotes: declineReason || "no",
  };

  try {
    const response = await fetch(`http://localhost:3000/auctionRequest/reject/${requestId}`, {
      method: 'POST',
      headers: commonHeaders(),
      body: JSON.stringify(declineBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    setFeedbackMessage('Auction request rejected.');
    setPendingRequests(prev => prev.filter(req => req.requestId !== requestId));
    setSelectedRequest(null);
  } catch (err) {
    console.error("Error declining request:", err);
    setFeedbackMessage(`Error: ${err.message}`);
  }
};


  return (
    <div className="min-h-screen bg-cream m-5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md::text-4xl font-bold text-black mb-4">Auction Management</h1>
          <p className="text-lg text-black/50">Manage auction requests and active auctions</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Pending Requests</p>
                <p className="text-2xl font-bold text-black">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-coral" />
            </div>
          </div>
          <div className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Active Auctions</p>
                <p className="text-2xl font-bold text-black">{activeAuctions.length}</p>
              </div>
              <Gavel className="h-8 w-8 text-coral" />
            </div>
          </div>
          <div className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-black/60 text-sm">Total Bids Today</p>
                <p className="text-2xl font-bold text-black">47</p>
              </div>
              <Users className="h-8 w-8 text-coral" />
            </div>
          </div>
          {/* <div className="bg-cream border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-burgundy/60 text-sm">Revenue This Month</p>
                <p className="text-2xl font-bold text-burgundy">$8,420</p>
              </div>
              <DollarSign className="h-8 w-8 text-coral" />
            </div>
          </div> */}
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
              {!loadingRequests && pendingRequests.length === 0 && !errorRequests && (
                <p className="text-burgundy/70">No pending auction requests.</p>
              )}
              <div className="grid gap-6">
                {pendingRequests.map((request) => {
                  const isExpanded = selectedRequest?.requestId === request.requestId;
                  const currentDuration = scheduledDuration || request.suggestedDuration;
                  return (
                    <div key={request.requestId}>
                      <div key={request.requestId} className="bg-white border border-coral/20 rounded-lg shadow-sm overflow-hidden">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-black/90 mb-2">
            {request.product?.name || 'Untitled Product'}
          </h3>
<p className="text-black/70 mb-2 font-medium">
  by {request.artist?.name || 'Unknown Artist'}
</p>

          <div className="flex items-center gap-4 text-sm text-black/60">
            <span>Starting bid: ${request.startingPrice}</span>
            <span>•</span>
            <span>Duration: {request.suggestedDuration} days</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() =>
              setSelectedRequest((prev) =>
                prev?.requestId === request.requestId ? null : request
              )
            }

            className="inline-flex items-center gap-2 bg-coral/10 hover:bg-burgundy/20 text-burgundy px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            <Eye className="h-4 w-4" />
            Review
          </button>
        </div>
      </div>

      {selectedRequest?.requestId === request.requestId && (
        <div className="border-t border-coral/20 pt-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <img 
                src={request.product?.image?.[0] || "/fallback.jpg"} 
                alt={request.product?.name || "Auction item"} 
                className="w-full h-64 object-cover rounded-lg mb-4"
              />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-coral mb-2">Artist Information</h4>
                  <p className="text-sm text-black/70">
                    Rating: {request.artist?.averageRating || 'N/A'}/5
                  </p>
                  <p className="text-sm text-black/70">
                    Previous sales: {request.product?.totalSales || 0}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-coral mb-2">Item Details</h4>
                  <p className="text-sm text-black/70 mb-1">
                    <strong>Materials:</strong> {request.product?.material || 'N/A'}
                  </p>
                  <p className="text-sm text-black/70">
                    <strong>Dimensions:</strong> {request.product?.dimensions || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-coral mb-2">Artist Notes</h4>
                  <p className="text-sm text-black/70">
                    {request.notes || 'No notes provided.'}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-coral mb-2">Schedule Auction</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`startDate-${request.requestId}`} className="block text-sm font-medium text-black mb-1">
                        Start Date and Time
                      </label>
                      <input 
                        id={`startDate-${request.requestId}`}
                        type="datetime-local"
                        value={scheduledStartDate}
                        onChange={(e) => setScheduledStartDate(e.target.value)}
                        className="w-full p-2 border border-coral/30 rounded-md focus:outline-hidden focus:ring-2 focus:ring-coral focus:border-coral"
                      />
                    </div>
                    <div>
                      <label htmlFor={`duration-${request.requestId}`} className="block text-sm font-medium text-black mb-1">
                        Duration (days)
                      </label>
                        <input 
                          id={`duration-${request.requestId}`}
                          type="number"
                          min="1"
                          value={currentDuration}
                          onChange={(e) => setScheduledDuration(e.target.value)}
                          className="w-full p-2 border border-coral/30 rounded-md focus:ring-2 focus:outline-hidden focus:ring-coral focus:border-coral"
                        />

                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleApproveRequest}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </button>
                  <button 
                    onClick={handleDeclineRequest}
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Decline
                  </button>
                </div>
                <div>
                  <label htmlFor={`declineReason-${request.requestId}`} className="block text-sm font-medium text-black mb-1">
                    Notes 
                  </label>
                    <textarea
                      id={`adminNotes-${request.requestId}`}
                      className="w-full p-2 border focus:outline-hidden border-coral/30 rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                      rows={3}
                      placeholder="Provide notes for the artist..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>

 </div>
                  );
                })}
              </div>
            </div>
          )}
{activeTab === 'active' && (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-black">Active Auctions</h2>
    {activeAuctions.length === 0 ? (
      <p className="text-burgundy/70">No active auctions to display.</p>
    ) : (
      <div className="grid gap-6">
        {activeAuctions.map((auction) => (
          <div key={auction.id} className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-coral mb-2">{auction.productDetails?.name || 'Untitled Product'}</h3>
                <p className="text-black/70 mb-2">by Artist ID: {auction.artistId}</p>
                <div className="flex items-center gap-4 text-sm text-black/60">
                  <span>Current bid: ${auction.currentPrice}</span>
                  <span>•</span>
                  <span>{auction.bidCount} bids</span>
                  <span>•</span>
                  <span>Ends: {formatEndDate(auction.endDate)}</span>

                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium capitalize">
                  {auction.status}
                </span>
                <img
                  src={auction.productDetails?.image?.[0] || "/fallback.jpg"}
                  alt="Product"
                  className="w-24 h-24 object-cover rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}


        </div>
      </div>
    </div>
  );
};

export default AdminAuctionManagement;
