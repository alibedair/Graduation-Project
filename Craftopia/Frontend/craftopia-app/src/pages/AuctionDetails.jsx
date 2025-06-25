import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Eye, Clock, Users, Star, Gavel, Shield, Award, MapPin, Calendar, Timer, TrendingUp, Info, ChevronRight, Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

// Embedded Bid History Component
const BidHistory = ({ bids }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-6 ">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Gavel className="h-5 w-5" />
        Bidding History
      </h3>
      <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-hide">
        {bids.map((bid, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg border"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">{bid.customerName?.[0]}</span>
              </div>
              <div>
                <div className="font-medium">{bid.customerName}</div><div className="text-sm text-gray-500">{new Date(bid.timestamp).toLocaleString()}</div>
                <div className="text-sm text-gray-500">{bid.time}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">${bid.bidAmount.toLocaleString()}</div>
              {index === 0 && (
                <div className="text-xs text-green-600 font-medium">WINNING BID</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Embedded Artist Info Component
const ArtistInfo = ({ artist,handleFollow, isFollowed}) => {
  return (
    <div className="bg-white border rounded-xl p-6">
      <div className="flex items-start gap-4">
        <img
          src={artist.avatar}
          alt={artist.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-semibold">{artist.name}</h3>
            {artist.verified && (
              <Shield className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              {artist.rating} ({artist.reviews} reviews)
            </div>
          </div>
          <p className="text-gray-700 mb-4">{artist.bio}</p>
          <div className="flex gap-3">
            <button onClick={handleFollow} className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
              {isFollowed ? "Following" : "Follow Artist"}
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Embedded Image Gallery Component
const ImageGallery = ({ images, title }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative">
        <motion.img
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={images[currentImage]}
          alt={title}
          className="w-full h-[600px] object-cover rounded-xl"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImage(currentImage > 0 ? currentImage - 1 : images.length - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
            </button>
            <button
              onClick={() => setCurrentImage(currentImage < images.length - 1 ? currentImage + 1 : 0)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
          {currentImage + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImage ? 'border-black' : 'border-transparent'
              }`}
            >
              <img
                src={image}
                alt={`${title} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main Auction Details Component
const AuctionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState('');
  const [showBidHistory, setShowBidHistory] = useState(false);
  const [auction, setAuction] = useState(null);
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState('');

const [following, setFollowing] = useState(false); // initially false

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  useEffect(() => {
    fetch(`http://localhost:3000/auction/${id}`)
      .then(res => res.json())
      .then(data => setAuction(data.auction))
      .catch(console.error);
  }, [id]);

// update isFollowed after fetching artist info
useEffect(() => {
  const fetchAuctionAndArtist = async () => {
    try {
      const resAuction = await fetch(`http://localhost:3000/auction/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resAuction.ok) throw new Error("Failed to fetch auction");
      const auctionData = await resAuction.json();
      setAuction(auctionData.auction);

      const artistId = auctionData.auction.artist.artistId;

      const resArtist = await fetch(`http://localhost:3000/artist/getprofile/${artistId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!resArtist.ok) throw new Error("Failed to fetch artist");
      const artistData = await resArtist.json();
      setArtist(artistData.artist);

      const followedRes = await fetch("http://localhost:3000/customer/followed-artists", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const followedData = await followedRes.json();
      const isFollowed = followedData.followedArtists?.some(a => a.artistId === artistData.artist.artistId);
      setFollowing(isFollowed); // ✅ set following here

    } catch (error) {
      console.error(error);
    }
  };

  fetchAuctionAndArtist();
}, [id]);


  // ✅ PLACE THIS CHECK **AFTER** useEffect
  if (!auction) {
    return <p className="text-gray-600 p-10 text-center">Loading...</p>;
  }


const startingPrice = parseFloat(auction.startingPrice);
const currentBid = parseFloat(auction.currentPrice);
const minIncrement = startingPrice * 0.1;
const minBid = currentBid + minIncrement;
const auctionHasEnded = auction.endDate && new Date(auction.endDate) <= new Date();

const handleFollowClick = async () => {
  const newFollowingState = !following;
  setFollowing(newFollowingState); // Optimistically update

  const token = localStorage.getItem('token');
  const artistId = artist?.artistId;

  try {
    const url = newFollowingState
      ? `http://localhost:3000/customer/follow/${artistId}`
      : `http://localhost:3000/customer/unfollow/${artistId}`;

    await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  } catch (error) {
    console.error('Error toggling follow state:', error);
    setFollowing(!newFollowingState); // Rollback
  }
};




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

  const auctionId = auction.id || auction.auctionId || auction._id;

  try {
    console.log("Sending bid for auction ID:", auctionId, "Amount:", amount);

    const res = await fetch('http://localhost:3000/bid/place', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        auctionId,
        bidAmount: amount,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Bid Error Response:', errorData);
      throw new Error('Failed to place bid');
    }

    setBidAmount('');
    setError('✅ Bid placed successfully!');
  } catch (err) {
    console.error(err);
    setError('❌ Error placing bid. Try again.');
  }
};




  return (
    <div className="min-h-screen bg-cream mt-5">


      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2">
            <ImageGallery images={auction.productDetails.image} title={auction.name} />
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
              <div className="flex items-center px-2 gap-4 text-sm text-gray-600">
                {/* <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {auction.bids.length} participants
                </div> */}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {auction.bidCount} bids
                </div>
              </div>
            </div>

            {/* Current Bid */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Current Bid</div>
                  <div className="text-4xl font-bold">${auction.currentPrice.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 mb-1">Starting Price</div>
                  <div className="text-lg font-semibold">
                    ${auction.startingPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              <CountdownTimer endTime={auction.status === "scheduled" ? auction.startDate : auction.endDate} />

              {/* Bid Input */}
              <div className="mt-6 space-y-3">
                      {error && <div className="text-sm text-red-600 mt-1 font-medium">{error}</div>}

      {auction.status === 'active' && !auctionHasEnded && (
        
        <div className="flex gap-3">

                            <input
                              type="number"
                              min={minBid}
                              step={minIncrement}
                              placeholder={`Min: $${minBid.toFixed(2)}`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            />
                  <button
                    onClick={handleBidSubmit}
                    className={`px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors ${
                      auction.status === 'scheduled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                    }`}
                      disabled={auction.status === 'scheduled'}
                  >
                    {auction.status === 'scheduled' ? 'Not Started' : 'Bid'}
                  </button>
                </div>
)}
                      
                <div className="text-sm text-gray-600">
                  Minimum bid: ${minBid.toLocaleString()}
                </div>
              </div>
              
            </div>
      

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowBidHistory(!showBidHistory)}
                className="flex-1 py-3 shadow-sm font-semibold bg-white text-coral rounded-lg hover:text-white hover:bg-black"
              >
                View Bid History
              </button>
            </div>

           
          </div>
        </div>

        {/* Bid History Modal */}
        <AnimatePresence>
          {showBidHistory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowBidHistory(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Bidding History</h2>
                </div>
                <div className="p-6">
                  <BidHistory bids={auction.bids} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Additional Information Sections */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Artist Info */}
            {artist && (
<ArtistInfo
  artist={{
    name: artist.name,
    avatar: artist.profilePicture || 'https://placehold.co/150x150?text=No+Image',
    username: artist.username,
    rating: artist.averageRating,
    reviews: artist.totalRatings,
    bio: artist.biography,
    artistId: artist.artistId,
  }}
  handleFollow={handleFollowClick}
  isFollowed={following}
/>


            )}

          {/* Artwork Details */}
          <div className="bg-white border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Artwork Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-700">{auction.productDetails.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <div className="text-sm text-gray-600">Material</div>
                  {/* <div className="font-medium">{auction.product.material}</div> */}
                </div>
                <div>
                  <div className="text-sm text-gray-600">Dimensions</div>
                  {/* <div className="font-medium">{auction.product.dimensions}</div> */}
                </div>

              <div><div className="text-sm text-gray-600">Started On</div><div className="font-medium">{new Date(auction.createdAt).toLocaleDateString()}</div></div>
              <div><div className="text-sm text-gray-600">Ends On</div><div className="font-medium">{new Date(auction.endDate).toLocaleDateString()}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetails;
