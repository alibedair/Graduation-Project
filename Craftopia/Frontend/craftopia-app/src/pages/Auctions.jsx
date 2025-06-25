import React, { useEffect, useState } from 'react';
import { Clock, Users, ChevronDown ,Search, Gavel , TrendingUp} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-5 ${className}`}>
      {children}
    </div>
  );
};


const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(endTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Auction ended');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="flex items-center text-sm font-medium">
      <Clock className="h-4 w-4 mr-1 text-coral" />
      <span className={timeLeft === 'Auction ended' ? 'text-red-500' : 'text-black'}>
        {timeLeft}
      </span>
    </div>
  );
};

const AuctionCard = ({ auction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const startingPrice = parseFloat(auction.startingBid);
  const currentBid = parseFloat(auction.currentBid);
  const minIncrement = startingPrice * 0.1;
  const minBid = currentBid + minIncrement;

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // ✅ Safely parse auction.endTime
  const parsedEndTime = auction?.endTime ? new Date(auction.endTime) : null;
  const auctionHasEnded = parsedEndTime && parsedEndTime <= new Date();

  const handleBidSubmit = async () => {
    const amount = parseFloat(bidAmount);
    setError('');

    if (!isLoggedIn) {
      setError('⚠️ You must be signed in to place a bid.');
      return;
    }

    if (!amount || isNaN(amount)) {
      setError('❌ Please enter a valid bid amount.');
      return;
    }

    if (amount <= currentBid) {
      setError('❌ Bid must be greater than the current bid.');
      return;
    }

    if (amount < minBid) {
      setError(`❌ Bid must be at least : $${minBid.toFixed(2)}`);
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/bid/place', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          auctionId: auction.id,
          bidAmount: amount,
        }),
      });

      if (!res.ok) throw new Error('Failed to place bid');

      setBidAmount('');
      setError('✅ Bid placed successfully!');
    } catch (err) {
      console.error(err);
      setError('❌ Error placing bid. Try again.');
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white border border-coral/20 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ... image, badges, and hover view details here ... */}
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
        

        {/* LIVE / COMING SOON / ENDING SOON badges */}
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {auction.status === 'active' && !auctionHasEnded && (
            <span className="bg-red-600 text-white animate-pulse px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <span className="inline-block w-2 h-2 bg-white rounded-full mr-1 animate-ping"></span>
              LIVE
            </span>
          )}
          {auction.status === 'scheduled' && (
            <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              <span className="inline-block w-2 h-2 bg-black rounded-full mr-1 animate-bounce"></span>
              COMING SOON
            </span>
          )}
          {auction.status === 'active' && auction.isEndingSoon && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
              ⏳ Ending Soon
            </span>
          )}
        </div>
        </div>

      {/* Time left badge
      {parsedEndTime && (
        <div className="absolute bottom-4 left-4 bg-black/50 text-cream px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <CountdownTimer endTime={parsedEndTime} />
        </div>
      )} */}

      <CardContent className="space-y-4">
        {/* Title, Description, Artist, Bids */}
        <div>
          <h3 className="text-lg font-semibold text-black group-hover:text-coral transition-colors mb-1">
            {auction.title}
          </h3>
          <p className="text-sm text-black/70 line-clamp-2">
            {auction.description}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-black">{auction.artist}</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-black/60">Current Bid</p>
              <p className="text-2xl font-bold text-coral">${auction.currentBid}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-black/60">Starting Bid</p>
              <p className="text-sm text-burgundy/80">${auction.startingBid}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-black/70">
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <Gavel className="h-3 w-3 mr-1" />
                {auction.bidCount} bids
              </span>
            </div>
          </div>
        </div>

        {/* Countdown inside card */}
        {parsedEndTime && <CountdownTimer endTime={parsedEndTime} />}
      </CardContent>

      {error && <div className="text-sm text-red-600 mt-1 font-medium">{error}</div>}

      {auction.status === 'active' && !auctionHasEnded && (
        <div className="flex gap-2 mt-2 px-6 pb-4">
          <input
            type="number"
            min={minBid}
            step={minIncrement}
            placeholder={`Min: $${minBid.toFixed(2)}`}
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            className="flex-1 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-coral focus:outline-none"
          />
          <button
            onClick={handleBidSubmit}
            className="bg-coral hover:bg-coral/90 text-cream px-4 py-2 rounded-md text-sm font-medium"
          >
            Bid
          </button>
        </div>
      )}
    </div>
  );
};




const Auctions = () => {
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [auctionRes, categoryRes] = await Promise.all([
          fetch('http://localhost:3000/auction', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          fetch('http://localhost:3000/category/all'),
        ]);
        const [auctionData, categoryData] = await Promise.all([
          auctionRes.json(),
          categoryRes.json(),
        ]);
        setAuctions(auctionData.auctions || []);
        setCategories(categoryData.categories || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTimeLeft = (auction) => {
    const now = new Date();
    const target = new Date(auction.status === 'scheduled' ? auction.startDate : auction.endDate);
    const diffMs = target - now;
    if (diffMs <= 0) return { timeLeft: 'Ended', isEndingSoon: false };
    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const minutes = totalMinutes % 60;
    return { timeLeft: `${days}d ${hours}h ${minutes}m`, isEndingSoon: days < 1 };
  };

  const filtered = auctions
    .filter((a) =>
      (a.status === 'active' || a.status === 'scheduled') &&
      (filter === 'all' || a.productDetails?.category?.toLowerCase() === filter)
    )
    .map((a) => {
      const { timeLeft, isEndingSoon } = formatTimeLeft(a);
      return {
        id: a.id,
        title: a.productDetails?.name || 'Untitled',
        artist: a.artistName || `Artist ID: ${a.artistId}`,
        image: a.productDetails?.image?.[0] || '/fallback.jpg',
        currentBid: a.currentPrice,
        startingBid: a.startingPrice,
        bidCount: a.bidCount,
        timeLeft,
        isEndingSoon,
        endTime: a.endDate,
        description: a.productDetails?.description || '',
        status: a.status,
      };
    });

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'ending-soon':
        return a.timeLeft.localeCompare(b.timeLeft);
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

      <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
    className="min-h-screen bg-cream"
  >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-black/90 mb-4">Live Auctions</h1>
          <p className="text-lg text-black/70">Bid on unique handcrafted items from talented artisans</p>
        </div>

        {/* Filters */}
        <motion.div
  initial={{ opacity: 0, y: -20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
>

          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-coral/30 rounded-md px-4 py-2 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-coral"
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
                className="appearance-none bg-white border border-coral/30 rounded-md px-4 py-2 pr-8 text-black focus:outline-none focus:ring-2 focus:ring-coral"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="most-bids">Most Bids</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-burgundy pointer-events-none" />
            </div>
          </div>

          <div className="text-burgundy/70 text-sm">
            Showing {Math.min(visibleCount, sorted.length)} of {sorted.length} auctions
          </div>
        </motion.div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sorted.slice(0, visibleCount).map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>

        {/* Load More */}

        {visibleCount < sorted.length && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="border border-burgundy/20 text-burgundy hover:bg-burgundy hover:text-cream font-medium px-8 py-3 rounded-md transition duration-300"
            >
              View More Auctions
            </button>
          </motion.div>
        )}


        {/* No auctions */}
        {!loading && sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-burgundy/60 text-lg">No auctions found matching your criteria.</p>
          </div>
        )}

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 bg-cream rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-black/90 text-center mb-8">
            How Our Auctions Work
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-black/90 mb-2">Browse & Discover</h3>
              <p className="text-burgundy/70 text-sm">
                Explore unique handmade items from talented artisans in our live auctions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
                <Gavel className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-black/90 mb-2">Place Your Bid</h3>
              <p className="text-burgundy/70 text-sm">
                Enter your maximum bid and our system will automatically bid for you up to that amount.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-coral rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-black/90 mb-2">Win & Enjoy</h3>
              <p className="text-burgundy/70 text-sm">
                If you're the highest bidder when the auction ends, the item is yours!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Auctions;










// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Heart,
//   Share2,
//   Eye,
//   Clock,
//   Users,
//   Star,
//   Gavel,
//   Shield,
//   MapPin,
//   Info,
//   ChevronRight,
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// // Countdown Timer
// const CountdownTimer = ({ endTime }) => {
//   const [timeLeft, setTimeLeft] = useState({ days: 0, hours: '00', minutes: '00', seconds: '00' });
//   useEffect(() => {
//     const timer = setInterval(() => {
//       const dist = new Date(endTime).getTime() - Date.now();
//       if (dist <= 0) return clearInterval(timer);
//       const days = Math.floor(dist / (1000 * 60 * 60 * 24));
//       const hrs = String(Math.floor((dist / (1000 * 60 * 60)) % 24)).padStart(2, '0');
//       const mins = String(Math.floor((dist / (1000 * 60)) % 60)).padStart(2, '0');
//       const secs = String(Math.floor((dist / 1000) % 60)).padStart(2, '0');
//       setTimeLeft({ days, hours: hrs, minutes: mins, seconds: secs });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [endTime]);
//   return (
//     <div className="flex items-center gap-4 bg-black text-white px-6 py-4 rounded-xl">
//       <Clock className="h-5 w-5 text-red-400" />
//       {timeLeft.days > 0 && (
//         <div className="text-center">
//           <div className="text-2xl font-bold">{timeLeft.days}</div>
//           <div className="text-xs text-gray-400">DAYS</div>
//         </div>
//       )}
//       <div className="text-center"><div className="text-2xl font-bold">{timeLeft.hours}</div><div className="text-xs text-gray-400">HRS</div></div>
//       <div className="text-xl text-gray-400">:</div>
//       <div className="text-center"><div className="text-2xl font-bold">{timeLeft.minutes}</div><div className="text-xs text-gray-400">MIN</div></div>
//       <div className="text-xl text-gray-400">:</div>
//       <div className="text-center"><div className="text-2xl font-bold text-red-400">{timeLeft.seconds}</div><div className="text-xs text-gray-400">SEC</div></div>
//     </div>
//   );
// };

// // Bid History
// const BidHistory = ({ bids }) => (
//   <div className="bg-coral/20 rounded-xl p-6">
//     <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 scrollbar-hide"><Gavel className="h-5 w-5" /> Bidding History</h3>
//     <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
//       {bids.map((b, i) => (
//         <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center justify-between p-3 bg-white rounded-xl scrollbar-hide">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
//               <span className="text-sm font-medium">{b.customerName?.[0]}</span>
//             </div>
//             <div><div className="font-medium">{b.customerName}</div><div className="text-sm text-gray-500">{new Date(b.timestamp).toLocaleString()}</div></div>
//           </div>
//           <div className="text-right"><div className="font-bold text-lg">${b.bidAmount.toLocaleString()}</div>{i === 0 && <div className="text-xs text-green-600 font-medium">WINNING BID</div>}</div>
//         </motion.div>
//       ))}
//     </div>
//   </div>
// );

// // Artist Info
// const ArtistInfo = ({ artist, handleFollow, isFollowed }) => (
//   <div className="bg-white border-2 shadow-lg rounded-xl p-6">
//     <div className="flex items-start gap-4">
//       <img
//         src={artist.avatar}
//         alt={artist.name}
//         className="w-16 h-16 rounded-full object-cover"
//       />
//       <div className="flex-1">
//         <div className="flex items-center gap-2 mb-2">
//           <h3 className="text-xl font-semibold">{artist.name}</h3>
//         </div>
//         <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//           <div className="flex items-center gap-1">{artist.username}</div>
//           <div className="flex items-center gap-1">
//             <Star className="h-4 w-4 text-yellow-400 fill-current" />
//             {artist.rating} ({artist.reviews} reviews)
//           </div>
//         </div>
//         <p className="text-gray-700 mb-4">{artist.bio}</p>
//         <div className="flex gap-3">
//           <button
//             onClick={handleFollow}
//             className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
//           >
//             {isFollowed ? "Following" : "Follow Artist"}
//           </button>

//           <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
//             View Portfolio
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );


// // Image Gallery
// const ImageGallery = ({ images }) => {
//   const [current, setCurrent] = useState(0);
//   return (
//     <div className="space-y-4">
//       <motion.img key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} src={images[current]} alt="" className="w-full h-[600px] object-cover rounded-xl" />
//       {images.length > 1 && (
//         <div className="flex gap-2 overflow-x-auto pb-2">
//           {images.map((img, i) => (
//             <button key={i} onClick={() => setCurrent(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i === current ? 'border-black' : 'border-transparent'}`}>
//               <img src={img} className="w-full h-full object-cover" alt="" />
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // Main Component
// const AuctionDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
// const [auction, setAuction] = useState(null);
// const [artist, setArtist] = useState(null);
// const [bidAmount, setBidAmount] = useState('');
// const [watching, setWatching] = useState(false);
// const [showHistory, setShowHistory] = useState(false);
// const token = localStorage.getItem("token");
// const [isFollowed, setIsFollowed] = useState(false);



//   useEffect(() => {
//     fetch(`http://localhost:3000/auction/${id}`)
//       .then(res => res.json())
//       .then(data => setAuction(data.auction))
//       .catch(console.error);
//   }, [id]);


  
// useEffect(() => {
//   const fetchAuctionAndArtist = async () => {
//     try {
//       const resAuction = await fetch(`http://localhost:3000/auction/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!resAuction.ok) throw new Error("Failed to fetch auction");
//       const auctionData = await resAuction.json();
//       setAuction(auctionData.auction);

//       const artistId = auctionData.auction.artist.artistId;
//       const resArtist = await fetch(`http://localhost:3000/artist/getprofile/${artistId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       const followedRes = await fetch("http://localhost:3000/customer/followed-artists", {
//         headers: { Authorization: `Bearer ${token}` }
//         });
//         const followedData = await followedRes.json();
//         const followed = followedData.followedArtists?.some(a => a.artistId === artistData.artist.artistId);
//         setIsFollowed(followed);

//       if (!resArtist.ok) throw new Error("Failed to fetch artist");
//       const artistData = await resArtist.json();
//       setArtist(artistData.artist);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   fetchAuctionAndArtist();
// }, [id]);



// if (!auction) return <p className="text-gray-600 p-10 text-center">Loading...</p>;



// const minBid = Math.ceil(auction.currentPrice + auction.currentPrice * 0.1);
// const handleFollow = async () => {
//   try {
//     const res = await fetch(`http://localhost:3000/customer/follow/${artist.artistId}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) throw new Error("Follow failed");

//     setIsFollowed((prev) => !prev);
//   } catch (err) {
//     console.error("Failed to follow artist", err);
//   }
// };

// const handleBidSubmit = async () => {
//   if (auction.status === "scheduled") {
//     alert("⏳ Auction hasn't started yet.");
//     return;
//   }

//   const amount = parseFloat(bidAmount);
//   if (!amount || amount < minBid) {
//     alert(`Bid must be at least $${minBid}`);
//     return;
//   }

//   try {
//     const res = await fetch("http://localhost:3000/bid/place", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({
//         auctionId: auction.auctionId,
//         bidAmount: amount
//       })
//     });

//     if (!res.ok) throw new Error("Failed to place bid");

//     alert("✅ Bid placed successfully!");
//     setBidAmount("");

//     // Refresh auction data
//     const refresh = await fetch(`http://localhost:3000/auction/${id}`, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     const refreshData = await refresh.json();
//     setAuction(refreshData.auction);
//   } catch (err) {
//     alert("❌ Failed to place bid.");
//     console.error(err);
//   }
// };


//   return (
//     <div className="min-h-screen bg-cream">


//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2"><ImageGallery images={auction.productDetails.image} /></div>

//         <div className="space-y-6">
//           <h1 className="text-3xl font-bold">{auction.productDetails.name}</h1>
//           <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
//             <span>Ends: {new Date(auction.endDate).toLocaleDateString()}</span>
//             <span>• {auction.bidCount} bids</span>
//             <span>• {auction.bids.length} participants</span>
//           </div>
//           <div className="bg-gray-100 rounded-xl p-6">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <div className="text-sm text-gray-600 mb-1">Current Bid</div>
//                 <div className="text-4xl font-bold">${auction.currentPrice.toLocaleString()}</div>
//               </div>
//               <div className="text-right">
//                 <div className="text-sm text-gray-600 mb-1">Lowest</div>
//                 <div className="text-lg font-semibold">
//                   ${auction.startingPrice.toLocaleString()}
//                 </div>
//               </div>
//             </div>
//             <CountdownTimer endTime={auction.status === "scheduled" ? auction.startDate : auction.endDate} />

//             <div className="mt-6 space-y-3">
//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   placeholder={`Enter $${minBid} or more`}
//                   value={bidAmount}
//                   onChange={e => setBidAmount(e.target.value)}
//                   className="flex-1 px-4 py-3 shadow-sm bg-white focus:ring-coral rounded-lg focus:outline-none"
//                 />
//                 <button
//   onClick={handleBidSubmit}
//   className={`px-8 py-3 rounded-lg font-semibold text-white ${
//     auction.status === 'scheduled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
//   }`}
//   disabled={auction.status === 'scheduled'}
// >
//   {auction.status === 'scheduled' ? 'Not Started' : 'Bid'}
// </button>

//               </div>
//               <div className="text-sm text-gray-600">Minimum bid: ${minBid}</div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <button onClick={() => setShowHistory(!showHistory)} className="flex-1 py-3 shadow-sm font-semibold bg-white hover:text-burgundy/70 text-coral rounded-lg hover:bg-white/70">
//               View Bid History
//             </button>
//             <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-coral shadow-sm font-semibold text-white hover:bg-burgundy">
//               <Share2 className="h-4 w-4" /> Share
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* Bid History Modal */}
//       <AnimatePresence>
//         {showHistory && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHistory(false)}>
//             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
//               <div className="p-6 border-b">
//                 <h2 className="text-xl font-semibold">Bidding History</h2>
//               </div>
//               <div className="p-6"><BidHistory bids={auction.bids} /></div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Lower Sections */}
//       <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
// {artist && (
// <ArtistInfo
//   artist={{
//     name: artist.name,
//     avatar: artist.profilePicture || 'https://placehold.co/150x150?text=No+Image',
//     username: artist.username,
//     rating: artist.averageRating,
//     reviews: artist.totalRatings,
//     bio: artist.biography,
//     artistId: artist.artistId, // ✅ don't forget this!
//   }}
//   handleFollow={handleFollow}
//   isFollowed={isFollowed}
// />

// )}

//         <div className="bg-white border-2 shadow-lg rounded-xl p-6">
//           <h3 className="text-xl font-semibold mb-4">Artwork Details</h3>
//           <div className="space-y-4">
//             <div><h4 className="font-medium mb-2">Description</h4><p className="text-gray-700">{auction.productDetails.description}</p></div>
//             <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//               <div><div className="text-sm text-gray-600">Category</div><div className="font-medium">{auction.category || 'N/A'}</div></div>
//               <div><div className="text-sm text-gray-600">Starting Price</div><div className="font-medium">${auction.startingPrice.toLocaleString()}</div></div>
//               <div><div className="text-sm text-gray-600">Started On</div><div className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</div></div>
//               <div><div className="text-sm text-gray-600">Ends On</div><div className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</div></div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };