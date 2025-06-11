
import React, { useState } from 'react';
import { Camera, ChevronDown, Settings, Upload, Edit, Trash2, Package, DollarSign, Users, Star, Clock, Plus, Menu, ShoppingCart, User, Heart, Search, Gavel, AlertCircle } from 'lucide-react';

// Embedded Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-cream border-b border-coral/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-burgundy">CraftMarket</div>
            <nav className="hidden md:flex space-x-6">
              <a href="/" className="text-burgundy hover:text-coral transition-colors">Home</a>
              <a href="/categories" className="text-burgundy hover:text-coral transition-colors">Categories</a>
              <a href="/artists" className="text-burgundy hover:text-coral transition-colors">Artists</a>
              <a href="/auctions" className="text-burgundy hover:text-coral transition-colors">Auctions</a>
              <a href="/custom-requests" className="text-burgundy hover:text-coral transition-colors">Custom Requests</a>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy/60 h-4 w-4" />
              <input 
                placeholder="Search..." 
                className="pl-10 w-64 bg-blush border border-coral/30 focus:border-coral rounded-md px-3 py-2 text-sm"
              />
            </div>
            <button className="p-2 hover:bg-burgundy/10 rounded-md">
              <Heart className="h-5 w-5 text-burgundy" />
            </button>
            <button className="p-2 hover:bg-burgundy/10 rounded-md">
              <ShoppingCart className="h-5 w-5 text-burgundy" />
            </button>
            <button className="p-2 hover:bg-burgundy/10 rounded-md">
              <User className="h-5 w-5 text-burgundy" />
            </button>
          </div>

          <button 
            className="md:hidden p-2 hover:bg-burgundy/10 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6 text-burgundy" />
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-coral/20">
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-burgundy hover:text-coral transition-colors py-2">Home</a>
              <a href="/categories" className="text-burgundy hover:text-coral transition-colors py-2">Categories</a>
              <a href="/artists" className="text-burgundy hover:text-coral transition-colors py-2">Artists</a>
              <a href="/auctions" className="text-burgundy hover:text-coral transition-colors py-2">Auctions</a>
              <a href="/custom-requests" className="text-burgundy hover:text-coral transition-colors py-2">Custom Requests</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};



const AuctionRequest = () => {
      const [activeTab, setActiveTab] = useState('overview');
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showAuctionRequestForm, setShowAuctionRequestForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    materials: '',
    dimensions: '',
    customizable: false
  });
  
  const [auctionRequest, setAuctionRequest] = useState({
    productId: '',
    title: '',
    description: '',
    startingBid: '',
    reservePrice: '',
    duration: '7',
    images: [],
    category: '',
    materials: '',
    dimensions: ''
  });

  const salesData = [
    { month: 'Jan', sales: 2400, orders: 12 },
    { month: 'Feb', sales: 1398, orders: 8 },
    { month: 'Mar', sales: 9800, orders: 24 },
    { month: 'Apr', sales: 3908, orders: 18 },
    { month: 'May', sales: 4800, orders: 22 },
    { month: 'Jun', sales: 3800, orders: 19 }
  ];

  const categoryData = [
    { name: 'Pottery', value: 35, color: '#8B4513' },
    { name: 'Jewelry', value: 28, color: '#D2691E' },
    { name: 'Textiles', value: 20, color: '#F4A460' },
    { name: 'Woodwork', value: 17, color: '#DEB887' }
  ];

  const recentOrders = [
    { id: '1', customer: 'Sarah Johnson', product: 'Ceramic Bowl Set', amount: '$89.99', status: 'Processing', date: '2024-01-15' },
    { id: '2', customer: 'Mike Chen', product: 'Silver Necklace', amount: '$156.00', status: 'Shipped', date: '2024-01-14' },
    { id: '3', customer: 'Emma Davis', product: 'Wool Scarf', amount: '$75.00', status: 'Delivered', date: '2024-01-13' }
  ];

  const products = [
    {
      id: '1',
      title: 'Handwoven Ceramic Bowl Set',
      category: 'Pottery',
      price: 89.99,
      status: 'Active',
      inventory: 5,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop'
    },
    {
      id: '2',
      title: 'Sterling Silver Necklace',
      category: 'Jewelry',
      price: 156.00,
      status: 'Active',
      inventory: 2,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100&h=100&fit=crop'
    }
  ];

  const auctionRequests = [
    {
      id: '1',
      title: 'Vintage Ceramic Vase',
      status: 'Pending',
      startingBid: 50,
      submittedDate: '2024-01-15',
      category: 'Pottery'
    },
    {
      id: '2',
      title: 'Hand-forged Silver Ring',
      status: 'Approved',
      startingBid: 120,
      submittedDate: '2024-01-12',
      category: 'Jewelry'
    },
    {
      id: '3',
      title: 'Wooden Sculpture',
      status: 'Declined',
      startingBid: 200,
      submittedDate: '2024-01-10',
      category: 'Woodwork',
      reason: 'Images quality needs improvement'
    }
  ];

  const handleAddProduct = () => {
    console.log('Adding product:', newProduct);
    setShowAddProductForm(false);
    setNewProduct({
      title: '',
      category: '',
      price: '',
      description: '',
      materials: '',
      dimensions: '',
      customizable: false
    });
  };

  const handleAuctionRequest = () => {
    console.log('Submitting auction request:', auctionRequest);
    setShowAuctionRequestForm(false);
    setAuctionRequest({
      productId: '',
      title: '',
      description: '',
      startingBid: '',
      reservePrice: '',
      duration: '7',
      images: [],
      category: '',
      materials: '',
      dimensions: ''
    });
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
        

        
                      {showAuctionRequestForm && (
                    
                        <div className="bg-white border border-coral/20 rounded-lg shadow-sm p-6">
                                                  {/* Auction Guidelines */}
                      {/* <div className="bg-burgundy/5 border border-burgundy/20 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-burgundy mb-4 flex items-center gap-2">
                          <AlertCircle className="h-5 w-5" />
                          Auction Guidelines
                        </h3>
                        <div className="space-y-3 text-burgundy/80">
                          <p><strong>Participation Rules:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>All auction items must be original handcrafted pieces</li>
                            <li>Provide detailed descriptions and high-quality images</li>
                            <li>Set realistic starting bids and reserve prices</li>
                            <li>Items should be ready to ship within 5 business days after auction ends</li>
                          </ul>
                          <p><strong>Image Requirements:</strong></p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Minimum 3 high-resolution photos from different angles</li>
                            <li>Include close-up shots of details and craftsmanship</li>
                            <li>Use natural lighting and neutral backgrounds</li>
                          </ul>
                          <p><strong>Auction Duration:</strong> Choose between 3, 7, or 10 days</p>
                          <p><strong>Commission:</strong> CraftMarket takes a 10% commission on successful sales</p>
                        </div>
                      </div> */}
                          <h3 className="text-xl font-semibold text-black mb-6">Request New Auction</h3>
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Item Title</label>
                                <input 
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  placeholder="Auction item name"
                                  value={auctionRequest.title}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, title: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Category</label>
                                <select 
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  value={auctionRequest.category}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, category: e.target.value }))}
                                >
                                  <option value="">Select category</option>
                                  <option value="pottery">Pottery</option>
                                  <option value="jewelry">Jewelry</option>
                                  <option value="textiles">Textiles</option>
                                  <option value="woodwork">Woodwork</option>
                                  <option value="glass-art">Glass Art</option>
                                  <option value="leather-goods">Leather Goods</option>
                                </select>
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-burgundy mb-2">Description</label>
                              <textarea 
                                className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                rows={4}
                                placeholder="Detailed description of your item, including craftsmanship details..."
                                value={auctionRequest.description}
                                onChange={(e) => setAuctionRequest(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Starting Bid (L.E)</label>
                                <input 
                                  type="number"
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  placeholder="0.00"
                                  value={auctionRequest.startingBid}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, startingBid: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Reserve Price (L.E)</label>
                                <input 
                                  type="number"
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  placeholder="0.00"
                                  value={auctionRequest.reservePrice}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, reservePrice: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Auction Duration</label>
                                <select 
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  value={auctionRequest.duration}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, duration: e.target.value }))}
                                >
                                  <option value="3">3 days</option>
                                  <option value="7">7 days</option>
                                  <option value="10">10 days</option>
                                </select>
                              </div>
                            </div>
        
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Materials</label>
                                <input 
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  placeholder="e.g., Clay, Natural glaze, Gold leaf"
                                  value={auctionRequest.materials}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, materials: e.target.value }))}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-burgundy mb-2">Dimensions</label>
                                <input 
                                  className="w-full p-3 border border-coral rounded-md focus:ring-2 focus:ring-coral focus:border-coral"
                                  placeholder="e.g., 8 x 6 x 4 inches"
                                  value={auctionRequest.dimensions}
                                  onChange={(e) => setAuctionRequest(prev => ({ ...prev, dimensions: e.target.value }))}
                                />
                              </div>
                            </div>
        
                            <div>
                              <label className="block text-sm font-medium text-burgundy mb-2">Upload Images</label>
                              <div className="border-2 border-dashed border-coral rounded-lg p-6 text-center">
                                <Upload className="h-8 w-8 text-burgundy/60 mx-auto mb-2" />
                                <p className="text-black/60 mb-2">Click to upload or drag and drop</p>
                                <p className="text-xs text-black/40">PNG, JPG up to 10MB (minimum 3 images required)</p>
                                <input type="file" multiple accept="image/*" className="hidden" />
                              </div>
                            </div>
                            
                            <div className="flex gap-4">
                              <button 
                                onClick={handleAuctionRequest} 
                                className="bg-burgundy hover:bg-burgundy/90 text-cream px-6 py-2 rounded-md font-medium transition-colors"
                              >
                                Submit Request
                              </button>
                              <button 
                                onClick={() => setShowAuctionRequestForm(false)}
                                className="bg-burgundy/10 hover:bg-burgundy/20 text-burgundy px-6 py-2 rounded-md font-medium transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
        
                      {/* Auction Requests List */}
                      <div className="bg-white border border-coral/20 rounded-lg shadow-sm">
                        <div className="p-6 border-b border-coral/20">
                          <h3 className="text-lg font-semibold text-black">Your Auction Requests</h3>
                        </div>
                        <div className="divide-y divide-coral/20">
                          {auctionRequests.map((request) => (
                            <div key={request.id} className="p-6 flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-burgundy">{request.title}</h4>
                                <p className="text-sm text-burgundy/60">{request.category} • Starting bid: ${request.startingBid}</p>
                                <p className="text-xs text-burgundy/40">Submitted: {request.submittedDate}</p>
                                {request.reason && (
                                  <p className="text-xs text-red-600 mt-1">Reason: {request.reason}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                  request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {request.status}
                                </span>
                                {request.status === 'Declined' && (
                                  <button className="text-burgundy hover:text-coral text-sm font-medium">
                                    Resubmit
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    </>
    );
};

export default AuctionRequest;
