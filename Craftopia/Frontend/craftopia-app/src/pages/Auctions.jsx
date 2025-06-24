import React, { useEffect, useState } from 'react';
import { Clock, Users, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const AuctionCard = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const minBid = auction.currentBid + 5;

  const handleBidSubmit = () => {
    const amount = parseFloat(bidAmount);
    if (amount && amount >= minBid) {
      console.log(`Submitting bid of $${amount} for auction ${auction.id}`);
      setBidAmount('');
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-cream border border-coral/20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={auction.image}
            alt={auction.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Hover View Details */}
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={() => navigate(`/auction/${auction.id}`)}
            className="bg-white/90 hover:bg-white text-burgundy px-6 py-2 rounded-md font-medium text-sm shadow-md"
          >
            View Details
          </button>
        </div>

        {/* Live badge (conditionally) */}
        <div className="absolute top-4 left-4 flex gap-2">
          {auction.timeLeft !== 'Ended' && (
            <span className="bg-red-600 text-white animate-pulse px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-ping"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Time left badge */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-cream px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {auction.timeLeft}
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="font-semibold text-lg text-burgundy line-clamp-2">{auction.title}</h3>
        <p className="text-burgundy/70 text-sm line-clamp-1">by {auction.artist}</p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-burgundy/60">Current Bid</p>
            <p className="text-2xl font-bold text-burgundy">${auction.currentBid}</p>
            <p className="text-xs text-burgundy/60 mt-1 flex items-center gap-1">
              <Users className="h-3 w-3" />
              {auction.bidCount} bids
            </p>
          </div>

        </div>

        <div className="flex gap-2 mt-4">
          <input
            type="number"
            placeholder={`Min: $${minBid}`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="flex-1 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={handleBidSubmit}
            className="bg-coral hover:bg-coral/90 text-cream px-4 py-2 rounded-md text-sm font-medium"
          >
            Bid
          </button>
        </div>
      </div>
    </div>
  );
};

const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/auction', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAuctions(data.auctions || []);
      } catch (e) {
        console.error('Failed to fetch auctions', e);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/category/all');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (e) {
        console.error('Failed to fetch categories', e);
      }
    };

    fetchAuctions();
    fetchCategories();
  }, []);

  const formatTimeLeft = (endDateStr) => {
    const diffMs = new Date(endDateStr) - new Date();
    if (diffMs <= 0) return 'Ended';
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return `${days}d ${hours}h ${minutes}m`;
  };

  const filtered = auctions
    .filter((a) =>
      (a.status === 'active' || a.status === 'scheduled') &&
      (filter === 'all' || a.productDetails?.category?.toLowerCase() === filter)
    )
    .map((a) => ({
      id: a.id,
      title: a.productDetails?.name || 'Untitled',
      artist: a.artistName || `Artist ID: ${a.artistId}`,
      image: a.productDetails?.image?.[0] || '/fallback.jpg',
      currentBid: a.currentPrice,
      startingBid: a.startingPrice,
      bidCount: a.bidCount,
      timeLeft: formatTimeLeft(a.endDate),
      description: a.productDetails?.description || '',
      category: a.productDetails?.category || '',
      rating: a.productDetails?.rating || 0,
    }));

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon':
        return a.timeLeft.localeCompare(b.timeLeft);
      case 'newest':
        return b.id.localeCompare(a.id); // Assuming lexicographically newer
      case 'price-low':
        return a.currentBid - b.currentBid;
      case 'price-high':
        return b.currentBid - a.currentBid;
      case 'most-bids':
        return b.bidCount - a.bidCount;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-burgundy mb-4">Live Auctions</h1>
          <p className="text-lg text-burgundy/70">Bid on unique handcrafted items from talented artisans</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-coral/30 rounded-md px-4 py-2 pr-8 text-burgundy focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.name.toLowerCase()}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-burgundy pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-coral/30 rounded-md px-4 py-2 pr-8 text-burgundy focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="most-bids">Most Bids</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-burgundy pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-burgundy/70">
            <span>{sorted.length} auctions found</span>
          </div>
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {!loading && sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-burgundy/60 text-lg">No auctions found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auctions;
