import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Heart, Eye, Users, PlayCircle } from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={`bg-white rounded-2xl shadow-lg transition-transform ${className}`}
  >
    {children}
  </motion.div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: 'bg-coral text-white hover:bg-coral/80',
    outline: 'bg-white border border-burgundy text-burgundy hover:bg-burgundy hover:text-white',
  };
  return (
    <button
      className={`rounded-xl min-w-40 px-4 py-3 text-sm font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const ArtistProfileCustomer = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [products, setProducts] = useState([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const profile = await fetch(`http://localhost:3000/artist/getprofile/${id}`, { headers }).then(r => r.json());
        const products = await fetch(`http://localhost:3000/product/get/${id}`, { headers }).then(r => r.json());
        setArtist(profile.artist);
        setProducts(products.products || []);
      } catch (err) {
        console.error('Failed to load artist data', err);
      }
    };
    fetchData();
  }, [id]);

  if (!artist) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream text-gray-800 relative">
      {/* Hero Section with Video */}
      <div className="relative h-[500px] overflow-hidden">
        <video
          src={artist.profileVideo}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/80 to-transparent"></div>
        <div className="absolute bottom-10 left-5 md:left-10 max-w-xl z-10 px-4 md:px-0">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug drop-shadow-md"
          >
            Dive into creativity with <span className="text-coral italic">{artist.name}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-gray-700 text-md"
          >
            {artist.description || 'Explore the unique vision of this artist through captivating visuals and inspired storytelling.'}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 flex flex-wrap items-center gap-4"
          >
            <Button>Explore Gallery</Button>
            {artist.profileVideo && (
              <Button variant="outline" className="flex items-center" onClick={() => setShowVideoModal(true)}>
                <PlayCircle className="w-4 h-4 mr-2 " /> Watch Video
              </Button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Artist Info Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center md:items-start gap-8"
        >
          <img
            src={artist.profilePicture || 'https://placehold.co/150x150?text=Artist'}
            alt={artist.name}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full object-cover border-4 border-[#e07385] shadow-md"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">{artist.name}</h2>
            <div className="text-gray-500 text-sm mt-2 space-y-1">
              <p className="flex items-center justify-center md:justify-start gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(artist.createdAt).toLocaleDateString()}</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Users className="w-4 h-4" /> 0 Followers</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Eye className="w-4 h-4" /> {artist.visitors} Views</p>
              <p className="flex items-center justify-center md:justify-start gap-2"><Star className="w-4 h-4 text-yellow-400" /> {artist.averageRating} ({artist.totalRatings} reviews)</p>
            </div>
            <div className="mt-4 flex justify-center md:justify-start gap-3 flex-wrap">
              <Button className="flex items-center flex- gap-5"><div><Heart className="w-4 h-4 mr-2" /></div> <span>Follow</span></Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Carousel Section */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">Gallery Collection</h3>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
            {products.map((item, idx) => (
              <motion.div
                key={idx}
                className="min-w-[220px] flex-shrink-0 snap-center bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <img
                  src={item.image?.[0] || 'https://placehold.co/300x300'}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h4>
                  <p className="text-[#e07385] font-bold mt-1">${item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">About the <span className="italic text-[#e07385]">Gallery</span></h3>
        <p className="text-gray-600 leading-relaxed">
         {/* {artist.biography} */}
           Welcome to {artist.name}'s gallery, where creativity thrives. This space showcases a personal journey through art, emotion,
          and visual storytelling. Explore collections that span timeless tradition and modern innovation. Discover the passion
          and purpose behind every piece.
        </p>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-lg max-w-3xl w-full overflow-hidden">
            <div className="flex justify-end p-2">
              <button onClick={() => setShowVideoModal(false)} className="text-gray-600 hover:text-gray-900">✖</button>
            </div>
            <video
              src={artist.profileVideo}
              controls
              className="w-full max-h-[70vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistProfileCustomer;
