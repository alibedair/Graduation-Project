// import React, { useEffect, useState, useRef } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { Star, MapPin, Calendar, Heart, Eye, Users } from 'lucide-react';
// import { motion } from 'framer-motion';

// const ArtistProfileCustomer = () => {
//   const { id } = useParams();
//   const [artist, setArtist] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [auctions, setAuctions] = useState([]);
//   const [activeTab, setActiveTab] = useState('products');
//   const sliderRef = useRef();
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = { Authorization: `Bearer ${token}` };
//         const profile = await fetch(`http://localhost:3000/artist/getprofile/${id}`, { headers }).then(r => r.json());
//         const products = await fetch(`http://localhost:3000/product/get/${id}`, { headers }).then(r => r.json());
//         setArtist(profile.artist);
//         setProducts(products.products || []);
//         setAuctions([]); // mock empty for now
//       } catch (err) {
//         console.error('Failed to load artist data', err);
//       }
//     };
//     fetchData();
//   }, [id]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       if (sliderRef.current) {
//         sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//       }
//     }, 4000);
//     return () => clearInterval(interval);
//   }, []);

//   if (!artist) return <div className="text-center py-20">Loading...</div>;

//   return (
//     <div className="bg-white min-h-screen font-sans">
//       <header className="text-center py-16 px-6 max-w-5xl mx-auto">
//         <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
//           Drive into <span className="text-indigo-600">creativity</span> with our <br />
//           <span className="text-orange-500 italic">gallery collection</span>
//         </h1>
//         <p className="mt-4 text-gray-500 max-w-xl mx-auto">
//           Explore our curated gallery collections, featuring captivating works from renowned artists.
//         </p>
//         <button className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition">
//           Explore Collection
//         </button>
//       </header>

//       {artist.profileVideo && (
//         <div className="w-full max-w-5xl mx-auto px-4">
//           <video
//             className="rounded-2xl shadow-lg w-full mb-12"
//             src={artist.profileVideo}
//             autoPlay
//             muted
//             loop
//             controls
//           />
//         </div>
//       )}

//       <section className="bg-white px-4 max-w-6xl mx-auto">
//         <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Featured Works</h2>
//         <div
//           ref={sliderRef}
//           className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory"
//         >
//           {[...products, ...auctions].map((item, idx) => (
//             <div
//               key={idx}
//               className="min-w-[200px] snap-start bg-white rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 overflow-hidden"
//             >
//               <img
//                 src={item.image?.[0] || 'https://placehold.co/300x300'}
//                 alt={item.name}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="font-semibold text-gray-700 truncate">{item.name}</h3>
//                 <p className="text-orange-500 font-bold">${item.price || item.startingPrice}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="mt-20 bg-indigo-50 py-16 px-6">
//         <div className="max-w-5xl mx-auto text-center">
//           <h2 className="text-3xl font-bold text-gray-800 mb-4">About the <span className="italic text-orange-500">Gallery</span></h2>
//           <p className="text-gray-600 max-w-3xl mx-auto">
//             Welcome to our world of creativity. We showcase diverse collections, from timeless classics to contemporary art,
//             connecting artists and audiences through inspiring exhibitions. Explore, connect, and be inspired.
//           </p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ArtistProfileCustomer;
// Enhanced artist profile inspired by the Arffy design



// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, MapPin, Calendar, Heart, Eye, Users } from 'lucide-react';

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-2xl shadow-lg ${className}`}>{children}</div>
// );

// const CardContent = ({ children, className = '' }) => (
//   <div className={`p-6 ${className}`}>{children}</div>
// );

// const Button = ({ children, className = '', variant = 'primary', ...props }) => {
//   const variants = {
//     primary: 'bg-orange-500 text-white hover:bg-orange-600',
//     outline: 'border border-orange-500 text-orange-500 hover:bg-orange-50',
//   };
//   return (
//     <button
//       className={`rounded-lg px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const ArtistProfileCustomer = () => {
//   const { id } = useParams();
//   const [artist, setArtist] = useState(null);
//   const [products, setProducts] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = { Authorization: `Bearer ${token}` };
//         const profile = await fetch(`http://localhost:3000/artist/getprofile/${id}`, { headers }).then(r => r.json());
//         const products = await fetch(`http://localhost:3000/product/get/${id}`, { headers }).then(r => r.json());
//         setArtist(profile.artist);
//         setProducts(products.products || []);
//       } catch (err) {
//         console.error('Failed to load artist data', err);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (!artist) return <div className="text-center py-20">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-white text-gray-800">
//       {/* Hero Section with Video */}
//       <div className="relative h-[500px] overflow-hidden">
//         <video
//           src={artist.profileVideo}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
//         <div className="absolute bottom-10 left-10 max-w-xl z-10">
//           <h1 className="text-4xl font-bold text-gray-900 leading-snug drop-shadow-md">
//             Dive into creativity with <span className="text-orange-500 italic">{artist.name}</span>
//           </h1>
//           <p className="mt-4 text-gray-700 text-md">
//             {artist.description || 'Explore the unique vision of this artist through captivating visuals and inspired storytelling.'}
//           </p>
//           <div className="mt-6">
//             <Button>Explore Gallery</Button>
//           </div>
//         </div>
//       </div>

//       {/* Artist Info Section */}
//       <div className="max-w-6xl mx-auto px-4 py-12">
//         <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
//           <img
//             src={artist.profilePicture || 'https://placehold.co/150x150?text=Artist'}
//             alt={artist.name}
//             className="w-36 h-36 rounded-full object-cover border-4 border-orange-300 shadow-md"
//           />
//           <div className="flex-1">
//             <h2 className="text-2xl font-semibold text-gray-900">{artist.name}</h2>
//             <div className="text-gray-500 text-sm mt-2 space-y-1">
//               <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Unknown</p>
//               <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(artist.createdAt).toLocaleDateString()}</p>
//               <p className="flex items-center gap-2"><Users className="w-4 h-4" /> 0 Followers</p>
//               <p className="flex items-center gap-2"><Eye className="w-4 h-4" /> {artist.visitors} Views</p>
//               <p className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> {artist.averageRating} ({artist.totalRatings} reviews)</p>
//             </div>
//             <div className="mt-4 flex gap-3">
//               <Button><Heart className="w-4 h-4 mr-2" /> Follow</Button>
//               <Button variant="outline">Message</Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Carousel Section */}
//       <div className="bg-orange-50 py-12">
//         <div className="max-w-6xl mx-auto px-4">
//           <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">Gallery Collection</h3>
//           <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
//             {products.map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 className="min-w-[220px] flex-shrink-0 snap-center bg-white rounded-xl shadow-lg overflow-hidden"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <img
//                   src={item.image?.[0] || 'https://placehold.co/300x300'}
//                   alt={item.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h4 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h4>
//                   <p className="text-orange-500 font-bold mt-1">${item.price}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* About Section */}
//       <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//         <h3 className="text-2xl font-semibold text-gray-900 mb-4">About the <span className="italic text-orange-500">Gallery</span></h3>
//         <p className="text-gray-600 leading-relaxed">
//           Welcome to {artist.name}'s gallery, where creativity thrives. This space showcases a personal journey through art, emotion,
//           and visual storytelling. Explore collections that span timeless tradition and modern innovation. Discover the passion
//           and purpose behind every piece.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ArtistProfileCustomer;











// // Enhanced artist profile with motion and manual video viewer
// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Star, MapPin, Calendar, Heart, Eye, Users, PlayCircle } from 'lucide-react';

// const Card = ({ children, className = '' }) => (
//   <div className={`bg-white rounded-2xl shadow-lg ${className}`}>{children}</div>
// );

// const CardContent = ({ children, className = '' }) => (
//   <div className={`p-6 ${className}`}>{children}</div>
// );

// const Button = ({ children, className = '', variant = 'primary', ...props }) => {
//   const variants = {
//     primary: 'bg-orange-500 text-white hover:bg-orange-600',
//     outline: 'border border-orange-500 text-orange-500 hover:bg-orange-50',
//   };
//   return (
//     <button
//       className={`rounded-lg px-4 py-2 text-sm font-medium transition ${variants[variant]} ${className}`}
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const ArtistProfileCustomer = () => {
//   const { id } = useParams();
//   const [artist, setArtist] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [showVideoModal, setShowVideoModal] = useState(false);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const headers = { Authorization: `Bearer ${token}` };
//         const profile = await fetch(`http://localhost:3000/artist/getprofile/${id}`, { headers }).then(r => r.json());
//         const products = await fetch(`http://localhost:3000/product/get/${id}`, { headers }).then(r => r.json());
//         setArtist(profile.artist);
//         setProducts(products.products || []);
//       } catch (err) {
//         console.error('Failed to load artist data', err);
//       }
//     };
//     fetchData();
//   }, [id]);

//   if (!artist) return <div className="text-center py-20">Loading...</div>;

//   return (
//     <div className="min-h-screen bg-cream text-gray-800 relative">
//       {/* Hero Section with Video */}
//       <div className="relative h-[500px] overflow-hidden">
//         <video
//           src={artist.profileVideo}
//           autoPlay
//           muted
//           loop
//           playsInline
//           className="w-full h-full object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-cream via-cream/80 to-transparent"></div>
//         <div className="absolute bottom-10 left-10 max-w-xl z-10">
//           <motion.h1
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-4xl font-bold text-gray-900 leading-snug drop-shadow-md"
//           >
//             Dive into creativity with <span className="text-coral italic">{artist.name}</span>
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="mt-4 text-gray-700 text-md"
//           >
//             {artist.description || 'Explore the unique vision of this artist through captivating visuals and inspired storytelling.'}
//           </motion.p>
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6 }}
//             className="mt-6 flex items-center gap-4"
//           >
//             <Button>Explore Gallery</Button>
//             {artist.profileVideo && (
//               <Button variant="outline" onClick={() => setShowVideoModal(true)}>
//                 <PlayCircle className="w-4 h-4 mr-2" /> Watch Video
//               </Button>
//             )}
//           </motion.div>
//         </div>
//       </div>

//       {/* Artist Info Section */}
//       <div className="max-w-6xl mx-auto px-4 py-12">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex flex-col md:flex-row items-center md:items-start gap-8"
//         >
//           <img
//             src={artist.profilePicture || 'https://placehold.co/150x150?text=Artist'}
//             alt={artist.name}
//             className="w-36 h-36 rounded-full object-cover border-4 border-orange-300 shadow-md"
//           />
//           <div className="flex-1">
//             <h2 className="text-2xl font-semibold text-gray-900">{artist.name}</h2>
//             <div className="text-gray-500 text-sm mt-2 space-y-1">
//               <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Unknown</p>
//               <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Joined {new Date(artist.createdAt).toLocaleDateString()}</p>
//               <p className="flex items-center gap-2"><Users className="w-4 h-4" /> 0 Followers</p>
//               <p className="flex items-center gap-2"><Eye className="w-4 h-4" /> {artist.visitors} Views</p>
//               <p className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> {artist.averageRating} ({artist.totalRatings} reviews)</p>
//             </div>
//             <div className="mt-4 flex gap-3">
//               <Button><Heart className="w-4 h-4 mr-2" /> Follow</Button>
//               <Button variant="outline">Message</Button>
//             </div>
//           </div>
//         </motion.div>
//       </div>

//       {/* Carousel Section */}
//       <div className="bg-white py-12">
//         <div className="max-w-6xl mx-auto px-4">
//           <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">Gallery Collection</h3>
//           <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4">
//             {products.map((item, idx) => (
//               <motion.div
//                 key={idx}
//                 className="min-w-[220px] flex-shrink-0 snap-center bg-white rounded-xl shadow-lg overflow-hidden"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.1 }}
//               >
//                 <img
//                   src={item.image?.[0] || 'https://placehold.co/300x300'}
//                   alt={item.name}
//                   className="w-full h-48 object-cover"
//                 />
//                 <div className="p-4">
//                   <h4 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h4>
//                   <p className="text-orange-500 font-bold mt-1">${item.price}</p>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* About Section */}
//       <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//         <h3 className="text-2xl font-semibold text-gray-900 mb-4">About the <span className="italic text-orange-500">Gallery</span></h3>
//         <p className="text-gray-600 leading-relaxed">
//           Welcome to {artist.name}'s gallery, where creativity thrives. This space showcases a personal journey through art, emotion,
//           and visual storytelling. Explore collections that span timeless tradition and modern innovation. Discover the passion
//           and purpose behind every piece.
//         </p>
//       </div>

//       {/* Video Modal */}
//       {showVideoModal && (
//         <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
//           <div className="relative bg-white rounded-xl shadow-lg max-w-3xl w-full overflow-hidden">
//             <div className="flex justify-end p-2">
//               <button onClick={() => setShowVideoModal(false)} className="text-gray-600 hover:text-gray-900">✖</button>
//             </div>
//             <video
//               src={artist.profileVideo}
//               controls
//               className="w-full max-h-[70vh] object-contain"
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtistProfileCustomer;



import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Heart, Eye, Users } from 'lucide-react';
import ProductCard from '../Components/ProductCard';
import { useWishlist } from "../context/WishlistContext";



// Self-contained UI Components
const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-card border border-burgundy/10 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

const Button = ({ children, className = '', variant = 'default', size = 'default', ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const variants = {
    default: 'bg-coral text-white hover:bg-coral/90',
    outline: 'border border-burgundy/20 text-burgundy hover:bg-burgundy hover:text-cream',
    ghost: 'hover:bg-accent hover:text-accent-foreground'
  };
  
  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-primary text-primary-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  };
  
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

const Tabs = ({ children, defaultValue, className = '' }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <div className={className}>
      {React.Children.map(children, child => 
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab, className = '' }) => {
  return (
    <div className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground grid-cols-4 w-full ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { activeTab, setActiveTab })
      )}
    </div>
  );
};

const TabsTrigger = ({ value, children, activeTab, setActiveTab, className = '' }) => {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${
        activeTab === value ? 'bg-background text-foreground shadow-sm' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, activeTab, className = '' }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
};
const ArtistProfileCustomer = () => {
const { id } = useParams();
const [artist, setArtist] = useState(null);
const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [activeSection, setActiveSection] = useState("gallery");
const [loadingProducts, setLoadingProducts] = useState(false);
const [productsError, setProductsError] = useState('');
const [cart, setCart] = useState({});
const [isFollowing, setIsFollowing] = useState(false);
const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();



useEffect(() => {
  const fetchArtistData = async () => {
    const token = localStorage.getItem('token'); 

    if (!token) {
      console.error('No auth token found.');
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`
      };

      const profileRes = await fetch(`http://localhost:3000/artist/getprofile/${id}`, {
        headers
      });
      const profileData = await profileRes.json();

      const productRes = await fetch(`http://localhost:3000/product/get/${id}`, {
        headers
      });
      const productData = await productRes.json();

      const a = profileData.artist;

      setArtist({
        id: a.artistId,
        name: a.name,
        avatar: a.profilePicture || 'https://placehold.co/200x200?text=No+Image',
        coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
        bio: a.biography,
        location: 'Egypt',
        joinedDate: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        specialties: ['Handmade', 'Artisan'],
        video: a.profileVideo,
        achievements: ['Featured Artist', 'Trusted Seller'],
        stats: {
          products: productData.products.length,
          sales: Number(a.sales),
          rating: parseFloat(a.averageRating || 0).toFixed(1),
          reviews: a.totalRatings,
          followers: 0,
          views: a.visitors
        }
      });

          
    setProducts(productData.products.map(p => ({
      id: p.productId,
      name: p.name,
      price: p.price,
      originalPrice: null,
      image: Array.isArray(p.image) && p.image.length > 0 ? p.image : ['https://placehold.co/300x300?text=No+Image'],
      quantity: p.quantity || 0,
      inStock: p.quantity > 0,
      description: p.description || '',
      dimensions: p.dimensions || '',
      material: p.material || '',
      rating: p.averageRating || 0,
      reviews: p.totalReviews || 0,
      isOnSale: false
    })));



          setLoading(false);
        } catch (error) {
          console.error('Failed to fetch artist or product data:', error);
          setLoading(false);
        }
      };

      fetchArtistData();
    }, [id]);

    useEffect(() => {
      const checkFollowStatus = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const res = await fetch(`http://localhost:3000/customer/followed-artists`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          const followedIds = data.followedArtists.map(a => a.artistId);
          setIsFollowing(followedIds.includes(Number(id)));
        } catch (err) {
          console.error("Error checking follow status:", err);
        }
      };

      checkFollowStatus();
    }, [id]);


      if (loading || !artist) return <div className="text-center py-10 text-burgundy font-medium">Loading artist profile...</div>;

      const onAddToCart = (product) => {
      setCart((prev) => ({
        ...prev,
        [product.id]: { ...product, quantity: 1 }
      }));
    };

    const isFavorite = (productId) => {
      return wishlist.some((item) => item.id === productId);
    };

    const toggleFavorite = (product) => {
      if (isFavorite(product.id)) {
        removeFromWishlist(product.id);
      } else {
        addToWishlist(product);
      }
    };

    const onIncrement = (product) => {
      setCart((prev) => ({
        ...prev,
        [product.id]: {
          ...prev[product.id],
          quantity: (prev[product.id]?.quantity || 0) + 1
        }
      }));
    };

    const onDecrement = (product) => {
      setCart((prev) => {
        const currentQty = prev[product.id]?.quantity || 0;
        if (currentQty <= 1) {
          const updatedCart = { ...prev };
          delete updatedCart[product.id];
          return updatedCart;
        }
        return {
          ...prev,
          [product.id]: {
            ...prev[product.id],
            quantity: currentQty - 1
          }
        };
      });
    };

    const handleToggleFollow = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const url = isFollowing
        ? `http://localhost:3000/customer/unfollow/${id}`
        : `http://localhost:3000/customer/follow/${id}`;

      try {
        const res = await fetch(url, {
          method: isFollowing ? "DELETE" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setIsFollowing(!isFollowing);
        } else {
          console.error("Failed to toggle follow state");
        }
      } catch (err) {
        console.error("Error during follow/unfollow:", err);
      }
    };

  // Static mock reviews (can be updated if you later support dynamic reviews)
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=50&h=50&fit=crop",
      rating: 5,
      date: "2 weeks ago",
      product: "Handwoven Ceramic Vase",
      comment: "Absolutely beautiful craftsmanship!",
      verified: true
    }
  ];

  
  return (
    <div className="min-h-screen bg-cream">
      {/* COVER IMAGE */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="relative h-80 overflow-hidden">
        <img src={artist.coverImage} alt="Artist cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative -mt-20 mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img src={artist.avatar} alt={artist.name} className="w-32 h-32 rounded-full object-cover border-4 border-cream shadow-lg" />
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-black font-['Playfair_Display']">{artist.name}</h1>
                  <div className="flex items-center space-x-4 text-black/70 mt-2">
                    <div className="flex items-center space-x-1"><Calendar className="h-4 w-4" /><span>Joined {artist.joinedDate}</span></div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {artist.specialties.map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>

                <div className="flex flex-wrap gap-6 text-sm ">
                  <div className="flex items-center space-x-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /><span className="font-semibold">{artist.stats.rating}</span><span className="black/70">({artist.stats.reviews} reviews)</span></div>
                  <div className="flex items-center space-x-1 text-black/80"><Users className="h-4 w-4 text-burgundy/70 " /><span>{artist.stats.followers} followers</span></div>
                  <div className="flex items-center space-x-1 text-black/80"><Eye className="h-4 w-4 text-burgundy/70 " /><span>{artist.stats.views} profile views</span></div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <Button 
                  className="bg-coral hover:bg-coral/90 text-white"
                  onClick={handleToggleFollow}
                >
                  {isFollowing ? "following" : "Follow"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* STATS */}
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center bg-white shadow-sm"><div className="text-2xl font-bold text-coral">{artist.stats.products}</div><div className="text-sm text-burgundy/70">Products</div></Card>
          <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-coral">{artist.stats.sales}</div><div className="text-sm text-burgundy/70">Total Sales</div></Card>
          <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-coral">{artist.stats.rating}</div><div className="text-sm text-burgundy/70">Rating</div></Card>
          <Card className="p-4 text-center bg-white"><div className="text-2xl font-bold text-coral">{artist.stats.followers}</div><div className="text-sm text-burgundy/70">Followers</div></Card>
        </motion.div>

        {/* TABS */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <h2 className="text-2xl font-bold text-burgundy">Products ({artist.stats.products})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
                  <motion.div
                    key={product.productId || product.id || index}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -3 }}
                  >
                  <ProductCard 
                    product={product}
                    isFavorite={isFavorite(product.id)} 
                    onToggleFavorite={() => toggleFavorite(product)} 
                    isInCart={!!cart[product.id]}
                    quantity={cart[product.id]?.quantity || 0}
                    onAddToCart={() => onAddToCart(product)}
                    onIncrement={() => onIncrement(product)}
                    onDecrement={() => onDecrement(product)}
                  />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-burgundy mb-4">About Me</h3>
                <p className="text-burgundy/80 leading-relaxed mb-6">{artist.bio}</p>
                <h4 className="text-lg font-semibold text-burgundy mb-3">Achievements</h4>
                <ul className="space-y-2">
                  {artist.achievements.map((a, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-coral rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-burgundy/80">{a}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold text-burgundy mb-4">Process Video</h3>
                <div className="aspect-video bg-card rounded-lg overflow-hidden mb-4">
                  <video controls className="w-full h-full object-cover">
                    <source src={artist.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-burgundy/80 text-sm">Watch the artist’s creation process and learn their techniques.</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gallery" className="space-y-6">
            <h2 className="text-2xl font-bold text-burgundy">Gallery</h2>

            <div className="mt-4">
              <div className="flex justify-start gap-6 mb-8">
                <button
                  onClick={() => setActiveSection("gallery")}
                  className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
                    activeSection === "gallery"
                      ? "bg-[#E07385] text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Gallery Products
                </button>
                <button
                  onClick={() => setActiveSection("auction")}
                  className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${
                    activeSection === "auction"
                      ? "bg-[#E07385] text-white shadow-md"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Auction Products
                </button>
              </div>

              {activeSection === "gallery" && (
                <div>
                  {loadingProducts && <p className="text-center py-8">Loading products...</p>}
                  {productsError && <p className="text-red-500 text-center py-4">{productsError}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.length === 0 && !loadingProducts && (
                      <p className="col-span-full text-gray-500 py-8">No products found in your gallery.</p>
                    )}
                    {products.map((product) => (
                      <div
                        key={product.productId}
                        className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={product.image?.[0] || "https://via.placeholder.com/300"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-xl font-bold text-[#921A40]">{product.name}</h3>
                            <div className="mt-2 text-white/90 text-sm">
                              <p className="line-clamp-2">{product.description}</p>
                              <div className="flex justify-between mt-2">
                                <span className="font-medium">Qty: {product.quantity}</span>
                                {product.dimensions && (
                                  <span>{product.dimensions}</span>
                                )}
                              </div>
                              {product.material && (
                                <p className="mt-1"><span className="font-medium">Material:</span> {product.material}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "auction" && (
                <div>
                  {loadingProducts && <p className="text-center py-8">Loading auction products...</p>}
                  {productsError && <p className="text-red-500 text-center py-4">{productsError}</p>}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.length === 0 && !loadingProducts && (
                      <p className="col-span-full text-gray-500 py-8">No auction products found.</p>
                    )}
                    {products.map((product) => (
                      <div
                        key={product._id || product.id}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="aspect-square relative overflow-hidden">
                          <img
                            src={product.image || "https://via.placeholder.com/500"}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                          <div className="absolute top-3 right-3 bg-[#E07385]/90 text-white text-xs font-bold px-2 py-1 rounded-full">
                            AUCTION
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default ArtistProfileCustomer;
