import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Palette, Search, User } from 'lucide-react';
import Footer from './Footer';
import ArtistCard from './ArtistCard';
import ProductCard from './ProductCard';
import { Button } from './Button';

const Following = () => {
  const [viewMode, setViewMode] = useState('artists');
  const [searchQuery, setSearchQuery] = useState('');
  const [followedArtists, setFollowedArtists] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowedData = async () => {
      try {
        const res = await axios.get('http://localhost:3000/customer/followed-artists');
        const artists = Array.isArray(res.data.followedArtists) ? res.data.followedArtists : [];
        setFollowedArtists(artists);

        if (artists.length === 0) {
          setProducts([]);
          return;
        }

        const productRequests = artists.map((artist) =>
          axios.get(`http://localhost:3000/product/get/${artist.artistId}`)
        );

        const productResponses = await Promise.all(productRequests);

        const allProducts = productResponses.flatMap((res, index) => {
          const productsArray = Array.isArray(res.data.products) ? res.data.products : [];
          return productsArray.map((product) => ({
            ...product,
            artistName: artists[index]?.name || 'Unknown',
          }));
        });

        setProducts(allProducts);
      } catch (err) {
        console.error('❌ Failed to fetch followed data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowedData();
  }, []);

  const filteredArtists = followedArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFollowToggle = (artistName, isFollowing) => {
    console.log(`${isFollowing ? 'Followed' : 'Unfollowed'} ${artistName}`);
  };

  if (loading) return <div className="text-center py-20 text-burgundy">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-coral fill-coral mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-burgundy">Following</h1>
          </div>
          <p className="text-lg text-burgundy/70 max-w-2xl mx-auto">
            Stay connected with your favorite artists and discover their latest creations
          </p>
        </motion.div>

        {/* View Mode & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="flex bg-white rounded-lg p-1 border border-coral/20">
              <Button
                variant={viewMode === 'artists' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('artists')}
                className={viewMode === 'artists' ? 'bg-coral text-white' : 'text-burgundy hover:bg-blush'}
              >
                <User className="h-4 w-4 mr-2" />
                Artists ({followedArtists.length})
              </Button>
              <Button
                variant={viewMode === 'products' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('products')}
                className={viewMode === 'products' ? 'bg-coral text-white' : 'text-burgundy hover:bg-blush'}
              >
                <Palette className="h-4 w-4 mr-2" />
                Products ({products.length})
              </Button>
            </div>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-burgundy/60 h-4 w-4" />
            <input
              placeholder={`Search ${viewMode}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border border-coral/30 rounded-md py-2 bg-white focus:outline-none focus:border-coral"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        {viewMode === 'artists' ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-burgundy flex items-center">
                <Heart className="h-6 w-6 text-coral fill-coral mr-2" />
                Artists You Follow
              </h2>
              <span className="text-burgundy/60">{filteredArtists.length} artists</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.artistId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArtistCard
                    name={artist.name}
                    avatar={artist.profilePicture}
                    location="Unknown"
                    rating={4.8}
                    reviewCount={20}
                    productCount={10}
                    specialties={[]}
                    isFollowing={true}
                    isVerified={true}
                    onFollowToggle={() => handleFollowToggle(artist.name, true)}
                  />
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-burgundy flex items-center">
                <Palette className="h-6 w-6 text-coral mr-2" />
                Latest from Artists You Follow
              </h2>
              <span className="text-burgundy/60">{filteredProducts.length} products</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.productId || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard {...product} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Following;
