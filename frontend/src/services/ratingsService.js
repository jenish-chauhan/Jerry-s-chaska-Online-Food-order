// Rating service for managing user-submitted ratings with localStorage
// API-ready structure for future backend integration

const STORAGE_KEY = 'jerrysChaska_userRatings';

// Get all user ratings from localStorage
export const getUserRatings = () => {
    try {
        const ratings = localStorage.getItem(STORAGE_KEY);
        return ratings ? JSON.parse(ratings) : {};
    } catch (error) {
        console.error('Error reading ratings from localStorage:', error);
        return {};
    }
};

// Save a user rating
export const saveRating = (itemId, rating, review, userName = 'Anonymous') => {
    try {
        const ratings = getUserRatings();

        ratings[itemId] = {
            rating,
            review,
            userName,
            date: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
        return { success: true };
    } catch (error) {
        console.error('Error saving rating:', error);
        return { success: false, error: error.message };
    }
};

// Get rating for a specific item
export const getItemRating = (itemId) => {
    const ratings = getUserRatings();
    return ratings[itemId] || null;
};

// Calculate average rating for an item (combining mock and user ratings)
export const calculateAverageRating = (mockRating, mockCount, userRating) => {
    if (!userRating) return { rating: mockRating, count: mockCount };

    // Combine mock rating with user rating
    const totalRating = (mockRating * mockCount) + userRating.rating;
    const totalCount = mockCount + 1;
    const average = totalRating / totalCount;

    return {
        rating: Math.round(average * 10) / 10, // Round to 1 decimal
        count: totalCount
    };
};

// Get all ratings with user submissions merged
export const getAllRatingsWithUserData = (mockRatings) => {
    const userRatings = getUserRatings();

    return mockRatings.map(item => {
        const userRating = userRatings[item.id];

        if (userRating) {
            const { rating, count } = calculateAverageRating(
                item.rating,
                item.reviewCount,
                userRating
            );

            return {
                ...item,
                rating,
                reviewCount: count,
                reviews: [
                    {
                        id: `user_${item.id}`,
                        userName: userRating.userName,
                        rating: userRating.rating,
                        comment: userRating.review,
                        date: userRating.date,
                        isUserReview: true
                    },
                    ...item.reviews
                ]
            };
        }

        return item;
    });
};

// Clear all user ratings (for testing)
export const clearAllRatings = () => {
    localStorage.removeItem(STORAGE_KEY);
};
