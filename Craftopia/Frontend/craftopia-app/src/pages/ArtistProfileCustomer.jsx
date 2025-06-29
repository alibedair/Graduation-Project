import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Heart, Eye, Users } from 'lucide-react';
import ProductCard from '../Components/ProductCard';
import { useWishlist } from "../context/WishlistContext";
import { useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { toast } from 'react-hot-toast';
import { useCart } from '../context/CartContext';



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
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 flex-1 ${activeTab === value ? 'bg-background text-foreground shadow-sm' : ''
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
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");
  const navigate = useNavigate();
  const [auctionProducts, setAuctionProducts] = useState([]);

  const { cartItems, addToCart, incrementQuantity, decrementQuantity } = useCart();

  useEffect(() => {
    const fetchArtistData = async () => {
      try {


        const token = localStorage.getItem('token'); 
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

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
          username: a.username,
          avatar: a.profilePicture || 'https://placehold.co/200x200?text=No+Image',
          coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=400&fit=crop',
          bio: a.biography,
          joinedDate: new Date(a.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          specialties: ['Handmade', 'Artisan'],
          video: a.profileVideo,
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

    const fetchAuctionProducts = async () => {
  try {
    const res = await fetch(`http://localhost:3000/auction/artist-product/${id}`);
    const data = await res.json();

    setAuctionProducts(data.products.map((p) => ({
      id: p.productId,
      name: p.name,
      image: Array.isArray(p.image) && p.image.length > 0 ? p.image[0] : "https://via.placeholder.com/300",
      description: p.description,
      dimensions: p.dimensions,
      quantity: p.quantity,
      material: p.material,
    })));
  } catch (err) {
    console.error("Error fetching auction products", err);
  }
};

fetchAuctionProducts();

  }, [id]);


  if (loading || !artist) return <div className="text-center py-10 text-burgundy font-medium">Loading artist profile...</div>;




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


  const handleToggleFollow = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to follow an artist.");
      // setTimeout(() => navigate("/login"), 1500); 
      return;
    }

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
  const handleReportSubmit = async () => {
    if (!reportMessage.trim()) {
      setReportError("Please enter a message.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setReportError("You must be logged in to report.");
      return;
    }

    const formData = new FormData();
    formData.append("content", reportMessage);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    try {
      const res = await fetch(`http://localhost:3000/report/createReportArtist/${artist.username}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setReportSuccess("Report submitted successfully.");
        setReportMessage("");
        setAttachment(null);

        setTimeout(() => {
          setReportSuccess("");
          setShowReportModal(false);
        }, 2000);
      } else {
        setReportError(data.message || "Failed to submit report.");
      }
    } catch (err) {
      setReportError("An error occurred while submitting the report.");
    }
  };


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
              <Button
                variant="outline"
                className="text-burgundy border border-burgundy hover:bg-burgundy hover:text-white bg-cream"
                onClick={() => setShowReportModal(true)}
              >
                Report Artist
              </Button>
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
        <Tabs defaultValue="gallery" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* ABOUT TAB */}
          <TabsContent value="about" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-xl font-bold text-burgundy mb-4">About Me</h3>
                <p className="text-burgundy/80 leading-relaxed mb-6">{artist.bio}</p>
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
                  className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${activeSection === "gallery"
                    ? "bg-[#E07385] text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                  Gallery Products
                </button>
                <button
                  onClick={() => setActiveSection("auction")}
                  className={`px-6 py-2 rounded-full font-semibold transition duration-200 ${activeSection === "auction"
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
                    {auctionProducts.length === 0 && !loadingProducts && (
                  <p className="col-span-full text-gray-500 py-8">No auction products found.</p>
                )}
                {auctionProducts.map((product) => (
                  <div
                    key={product.id}
                    className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={product.image || "https://via.placeholder.com/300"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    <div className="absolute top-3 right-3 bg-[#E07385]/90 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      AUCTION
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-xl font-bold text-[#921A40]">{product.name}</h3>
                        <div className="mt-2 text-white/90 text-sm">
                          <p className="line-clamp-2">{product.description}</p>
                          <div className="flex justify-between mt-2">
                            <span className="font-medium">Qty: {product.quantity}</span>
                            {product.dimensions && <span>{product.dimensions}</span>}
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
            </div>
          </TabsContent>

        </Tabs>
      </div>
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative transition-all duration-300">
            {reportSuccess ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold text-green-600 mb-3">✅ Report Submitted!</h2>
                <p className="text-gray-700">Thank you for helping us keep the community safe.</p>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-burgundy mb-4">Report Artist</h2>

                <textarea
                  className="w-full p-3 border rounded-lg bg-white text-sm text-gray-800 mb-4"
                  rows={4}
                  placeholder="Enter your message..."
                  value={reportMessage}
                  onChange={(e) => setReportMessage(e.target.value)}
                />

                <label className="block mb-4">
                  <span className="text-sm font-medium text-burgundy block mb-1">Attach Screenshot (optional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAttachment(e.target.files[0])}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  {attachment && (
                    <p className="text-sm text-gray-600 mt-1">📎 {attachment.name}</p>
                  )}
                </label>

                {reportError && <p className="text-red-500 text-sm mb-2">{reportError}</p>}
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="outline" onClick={() => setShowReportModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleReportSubmit}>Submit Report</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <Footer />

    </div>

  );
};

export default ArtistProfileCustomer;
