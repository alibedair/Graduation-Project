const { Rating, Artist } = require('../models');

const updateArtistRating = async (artistId) => {
    try {
        if (!artistId) {
            throw new Error('Artist ID is required for updating rating');
        }
        
        const ratings = await Rating.findAll({
            where: { artistId },
            attributes: ['rating']
        });

        const totalRatings = ratings.length;
        const averageRating = totalRatings > 0 
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
            : 0;

        await Artist.update(
            { 
                averageRating: parseFloat(averageRating.toFixed(2)),
                totalRatings 
            },
            { where: { artistId } }
        );
    } catch (error) {
        console.error('Error updating artist rating:', error);
        throw error;
    }
};

module.exports = {
    updateArtistRating
};
