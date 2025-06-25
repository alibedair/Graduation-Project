import React from 'react';
import { Clock, Users, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const AbstractAuctionCard = ({ auction, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -5 }}
      viewport={{ once: true }}
      className="group cursor-pointer w-full max-w-[660px] mx-auto"
    >
      <Link to={`/auction/${auction.id}`}>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100">
          <div className="relative overflow-hidden">
            {/* Image with adjusted dimensions */}
            <div className="aspect-[4/3] w-full overflow-hidden">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Live Badge */}
            <div className="absolute top-4 right-4">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                LIVE
              </div>
            </div>

            {/* Time Left */}
            <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {auction.timeLeft}
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-coral transition-colors">
                {auction.title}
              </h3>
              <p className="text-gray-600 text-sm">{auction.artist}</p>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Current Bid</p>
                <p className="text-2xl font-bold text-gray-900">${auction.currentBid.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-400 mb-1">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-gray-700">{auction.rating}</span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {auction.bidCount} bids
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {auction.category}
              </span>
<motion.div
  whileHover={{ x: 5 }}
  className="flex items-center text-coral font-medium text-sm cursor-pointer"
  onClick={() => navigate(`/auction/${auction.id}`)}
>
  View Details
  <ArrowRight className="h-4 w-4 ml-1" />
</motion.div>

            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default AbstractAuctionCard;
