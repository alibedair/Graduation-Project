import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, Star, Palette, Users,ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ArtistsSection = () => {
  const [artists, setArtists] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/artist/all', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const formatted = response.data.artists.map((artist) => ({
          id: artist.artistId,
          name: artist.name,
          specialty: artist.categories?.join(', ') || 'N/A',
          image: artist.profilePicture || 'https://via.placeholder.com/150',
          rating: parseFloat(artist.averageRating || 0).toFixed(1),
          products: artist.numberOfProducts || 0,
          followers: artist.numberOfFollowers || 0,
        }));

        setArtists(formatted);
      } catch (error) {
        console.error('Failed to fetch artists:', error);
      }
    };

    fetchArtists();
  }, []);

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-black/90 mb-4">
            Meet Our Artists
          </h2>
          <p className="text-xl text-burgundy/80 max-w-2xl mx-auto">
            Discover the talented creators behind our beautiful handcrafted pieces
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 50, rotateY: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-coral/10 text-center">
                <div className="relative mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="relative inline-block"
                  >
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-blush group-hover:ring-coral transition-all duration-300"
                    />
                    {artist.verified && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="absolute -bottom-1 -right-1 bg-coral text-white rounded-full p-1"
                      >
                        <Award className="h-3 w-3" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <motion.h3
                  whileHover={{ color: '#E94B3C' }}
                  className="text-lg font-semibold text-burgundy mb-1"
                >
                  {artist.name}
                </motion.h3>
                <p className="text-coral font-medium mb-2">{artist.specialty}</p>
                <p className="text-burgundy/60 text-sm mb-4">{artist.location}</p>

                <div className="flex items-center justify-between text-sm text-burgundy/70 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span>{artist.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <Palette className="h-4 w-4 mr-1" />
                    <span>{artist.products}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{artist.followers}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: '#722F37', color: '#F5F3F0' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/artist-profile-customer/${artist.id}`)}
                  className="w-full bg-coral/90 hover:bg-burgundy text-cream hover:text-white py-2 rounded-lg font-medium transition-all duration-300"
                >
                  View Profile
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >

        <Link to="/artists">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-coral hover:bg-burgundy text-white px-12 py-4 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-3"
            >
              Discover All Artists
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </Link>

        </motion.div>
      </div>
    </section>
  );
};

export default ArtistsSection;
