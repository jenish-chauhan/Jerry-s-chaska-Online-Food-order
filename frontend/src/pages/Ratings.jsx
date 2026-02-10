import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';
import { getAllRatings } from '../services/mockRatings';
import { getAllRatingsWithUserData } from '../services/ratingsService';

const Ratings = () => {
    // Get mock ratings and merge with user-submitted ratings
    const mockRatings = getAllRatings();
    const ratings = getAllRatingsWithUserData(mockRatings);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-5 w-5 ${star <= Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : star - 0.5 <= rating
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-gray-500'
                            }`}
                    />
                ))}
                <span className="ml-2 text-lg font-semibold text-gray-200">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-primary-light/20 to-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-secondary mb-3">Customer Ratings</h1>
                        <p className="text-lg text-gray-600">See what our customers are saying about our delicious food</p>
                    </div>

                    {/* Ratings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {ratings.map((item) => (
                            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-secondary">
                                {/* Food Image */}
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.foodName}
                                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                    />
                                </div>

                                {/* Card Content */}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-semibold text-white">{item.foodName}</CardTitle>
                                    <div className="flex items-center justify-between mt-2">
                                        {renderStars(item.rating)}
                                        <span className="text-sm text-gray-400">({item.reviewCount} reviews)</span>
                                    </div>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    {/* Latest Review */}
                                    {item.reviews && item.reviews.length > 0 && (
                                        <div className={`rounded-lg p-4 border ${item.reviews[0].isUserReview
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-white/5 border-white/10'
                                            }`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${item.reviews[0].isUserReview
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-primary text-white'
                                                    }`}>
                                                    {item.reviews[0].userName.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm font-semibold text-white">{item.reviews[0].userName}</p>
                                                        {item.reviews[0].isUserReview && (
                                                            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                                                Your Review
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-3 w-3 ${star <= item.reviews[0].rating
                                                                    ? 'fill-yellow-400 text-yellow-400'
                                                                    : 'text-gray-500'
                                                                    }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-200 line-clamp-3 leading-relaxed">
                                                "{item.reviews[0].comment}"
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Ratings;
