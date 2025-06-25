import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Clock,
  Users,
  Star,
  Gavel,
  Shield,
  MapPin,
  Info,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Countdown Timer
const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: '00', minutes: '00', seconds: '00' });
  useEffect(() => {
    const timer = setInterval(() => {
      const dist = new Date(endTime).getTime() - Date.now();
      if (dist <= 0) return clearInterval(timer);
      const days = Math.floor(dist / (1000 * 60 * 60 * 24));
      const hrs = String(Math.floor((dist / (1000 * 60 * 60)) % 24)).padStart(2, '0');
      const mins = String(Math.floor((dist / (1000 * 60)) % 60)).padStart(2, '0');
      const secs = String(Math.floor((dist / 1000) % 60)).padStart(2, '0');
      setTimeLeft({ days, hours: hrs, minutes: mins, seconds: secs });
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  return (
    <div className="flex items-center gap-4 bg-black text-white px-6 py-4 rounded-xl">
      <Clock className="h-5 w-5 text-red-400" />
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs text-gray-400">DAYS</div>
        </div>
      )}
      <div className="text-center"><div className="text-2xl font-bold">{timeLeft.hours}</div><div className="text-xs text-gray-400">HRS</div></div>
      <div className="text-xl text-gray-400">:</div>
      <div className="text-center"><div className="text-2xl font-bold">{timeLeft.minutes}</div><div className="text-xs text-gray-400">MIN</div></div>
      <div className="text-xl text-gray-400">:</div>
      <div className="text-center"><div className="text-2xl font-bold text-red-400">{timeLeft.seconds}</div><div className="text-xs text-gray-400">SEC</div></div>
    </div>
  );
};

// Bid History
const BidHistory = ({ bids }) => (
  <div className="bg-gray-50 rounded-xl p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Gavel className="h-5 w-5" /> Bidding History</h3>
    <div className="space-y-3 max-h-64 overflow-y-auto">
      {bids.map((b, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 bg-white rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium">{b.customerName?.[0]}</span>
            </div>
            <div><div className="font-medium">{b.customerName}</div><div className="text-sm text-gray-500">{new Date(b.timestamp).toLocaleString()}</div></div>
          </div>
          <div className="text-right"><div className="font-bold text-lg">${b.bidAmount.toLocaleString()}</div>{i === 0 && <div className="text-xs text-green-600 font-medium">WINNING BID</div>}</div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Artist Info
const ArtistInfo = ({ artist }) => (
  <div className="bg-white border rounded-xl p-6">
    <div className="flex items-start gap-4">
      <img src={artist.avatar} alt={artist.name} className="w-16 h-16 rounded-full object-cover" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold">{artist.name}</h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1"> {artist.username}</div>
          <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /> {artist.rating} ({artist.reviews} reviews)</div>
        </div>
        <p className="text-gray-700 mb-4">{artist.bio}</p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">Follow Artist</button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">View Portfolio</button>
        </div>
      </div>
    </div>
  </div>
);

// Image Gallery
const ImageGallery = ({ images }) => {
  const [current, setCurrent] = useState(0);
  return (
    <div className="space-y-4">
      <motion.img key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} src={images[current]} alt="" className="w-full h-[600px] object-cover rounded-xl" />
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i === current ? 'border-black' : 'border-transparent'}`}>
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Component
const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
const [auction, setAuction] = useState(null);
const [artist, setArtist] = useState(null);
const [bidAmount, setBidAmount] = useState('');
const [watching, setWatching] = useState(false);
const [showHistory, setShowHistory] = useState(false);
const token = localStorage.getItem("token");


  useEffect(() => {
    fetch(`http://localhost:3000/auction/${id}`)
      .then(res => res.json())
      .then(data => setAuction(data.auction))
      .catch(console.error);
  }, [id]);


  
useEffect(() => {
  const fetchAuctionAndArtist = async () => {
    try {
      const resAuction = await fetch(`http://localhost:3000/auction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resAuction.ok) throw new Error("Failed to fetch auction");
      const auctionData = await resAuction.json();
      setAuction(auctionData.auction);

      const artistId = auctionData.auction.artist.artistId;
      const resArtist = await fetch(`http://localhost:3000/artist/getprofile/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!resArtist.ok) throw new Error("Failed to fetch artist");
      const artistData = await resArtist.json();
      setArtist(artistData.artist);
    } catch (error) {
      console.error(error);
    }
  };

  fetchAuctionAndArtist();
}, [id]);



if (!auction) return <p className="text-gray-600 p-10 text-center">Loading...</p>;

const handleBidSubmit = async () => {
  const amount = parseFloat(bidAmount);
  if (!amount || amount < auction.currentPrice + 1) {
    alert(`Bid must be at least $${auction.currentPrice + 1}`);
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/bid/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        auctionId: auction.auctionId,
        bidAmount: amount
      })
    });

    if (!res.ok) throw new Error("Failed to place bid");

    alert("✅ Bid placed successfully!");
    setBidAmount("");

    // Refresh auction data
    const refresh = await fetch(`http://localhost:3000/auction/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const refreshData = await refresh.json();
    setAuction(refreshData.auction);
  } catch (err) {
    alert("❌ Failed to place bid.");
    console.error(err);
  }
};


  const minBid = auction.currentPrice + 1;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
            <ArrowLeft className="h-5 w-5" /> Back
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setWatching(!watching)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${watching ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
              <Heart className="h-4 w-4" /> {watching ? 'Watching' : 'Watch'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
              <Share2 className="h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2"><ImageGallery images={auction.productDetails.image} /></div>

        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{auction.productDetails.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>Ends: {new Date(auction.endDate).toLocaleDateString()}</span>
            <span>• {auction.bidCount} bids</span>
            <span>• {auction.bids.length} participants</span>
          </div>
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Bid</div>
                <div className="text-4xl font-bold">${auction.currentPrice.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Lowest</div>
                <div className="text-lg font-semibold">
                  ${auction.startingPrice.toLocaleString()}
                </div>
              </div>
            </div>
            <CountdownTimer endTime={auction.endDate} />

            <div className="mt-6 space-y-3">
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder={`Enter $${minBid} or more`}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                />
                <button onClick={() => console.log(`Bid $${bidAmount}`)} className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800">Bid</button>
              </div>
              <div className="text-sm text-gray-600">Minimum bid: ${minBid}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowHistory(!showHistory)} className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">
              View Bid History
            </button>
            <button className="flex-1 py-3 bg-gray-100 rounded-lg hover:bg-gray-200">
              Ask Question
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900 mb-1">Condition Report</div>
                <div className="text-sm text-blue-800">{auction.condition || 'Excellent'} condition.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid History Modal */}
      <AnimatePresence>
        {showHistory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Bidding History</h2>
              </div>
              <div className="p-6"><BidHistory bids={auction.bids} /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lower Sections */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
{artist && (
  <ArtistInfo
    artist={{
      name: artist.name,
      avatar: artist.profilePicture || 'https://placehold.co/150x150?text=No+Image',
      username: artist.username,
      rating: artist.averageRating,
      reviews: artist.totalRatings,
      bio: artist.biography,
    }}
  />
)}

        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">Artwork Details</h3>
          <div className="space-y-4">
            <div><h4 className="font-medium mb-2">Description</h4><p className="text-gray-700">{auction.productDetails.description}</p></div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div><div className="text-sm text-gray-600">Category</div><div className="font-medium">{auction.category || 'N/A'}</div></div>
              <div><div className="text-sm text-gray-600">Starting Price</div><div className="font-medium">${auction.startingPrice.toLocaleString()}</div></div>
              <div><div className="text-sm text-gray-600">Started On</div><div className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</div></div>
              <div><div className="text-sm text-gray-600">Ends On</div><div className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
