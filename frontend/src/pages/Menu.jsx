import { useState, useEffect } from 'react';
import { getMenuItems, getCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import MainLayout from '../layout/MainLayout';
import RatingModal from '../components/RatingModal';
import { saveRating, getItemRating } from '../services/ratingsService';
import { Plus, Loader2, Star } from 'lucide-react';

const Menu = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingModalOpen, setRatingModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [userRatings, setUserRatings] = useState({});
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [itemsRes, categoriesRes] = await Promise.all([
                    getMenuItems(),
                    getCategories(),
                ]);

                setItems(itemsRes.data || []);
                setCategories(categoriesRes.data || []);

                // Load user ratings from localStorage
                const ratings = {};
                if (itemsRes.data && itemsRes.data.length > 0) {
                    itemsRes.data.forEach(item => {
                        const rating = getItemRating(item.id);
                        if (rating) ratings[item.id] = rating;
                    });
                }
                setUserRatings(ratings);
            } catch (error) {
                console.error("Failed to fetch menu data:", error);
                setError("Unable to load menu items");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRateClick = (item) => {
        setSelectedItem(item);
        setRatingModalOpen(true);
    };

    const handleRatingSubmit = async (ratingData) => {
        const result = saveRating(
            ratingData.itemId,
            ratingData.rating,
            ratingData.review,
            ratingData.userName
        );

        if (result.success) {
            // Update local state
            setUserRatings(prev => ({
                ...prev,
                [ratingData.itemId]: {
                    rating: ratingData.rating,
                    review: ratingData.review,
                    userName: ratingData.userName
                }
            }));
            alert('Thank you for your rating!');
            return true;
        } else {
            alert('Failed to save rating. Please try again.');
            return false;
        }
    };

    const filteredItems = selectedCategory === 'all'
        ? items
        : items.filter(item => item.categoryId === selectedCategory);

    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-primary-light/30 to-white py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-extrabold text-secondary mb-3">Our Menu</h1>
                        <p className="text-lg text-gray-600">Discover our delicious selection of street food favorites</p>
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        <Button
                            onClick={() => setSelectedCategory('all')}
                            className={`rounded-full px-6 shadow-sm hover:shadow-md transition-all hover:scale-105 ${selectedCategory === 'all'
                                ? 'text-white bg-orange-500 hover:bg-orange-600'
                                : 'text-gray-200 bg-slate-900 hover:text-white hover:bg-slate-800 border-0'
                                }`}
                        >
                            All Items
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`rounded-full px-6 shadow-sm hover:shadow-md transition-all hover:scale-105 ${selectedCategory === category.id
                                    ? 'text-white bg-orange-500 hover:bg-orange-600'
                                    : 'text-gray-200 bg-slate-900 hover:text-white hover:bg-slate-800 border-0'
                                    }`}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-gray-600">Loading tasty options...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                <p className="text-lg font-semibold">{error}</p>
                            </div>
                        </div>
                    ) : filteredItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 text-orange-600">
                                <p className="text-lg font-semibold">No menu items available right now</p>
                                <p className="text-sm mt-2">The admin can add items from the admin panel.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredItems.map((item) => (
                                <Card key={item.id} className="overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-300 border-0 bg-secondary shadow-lg group hover:scale-105">
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Improved gradient overlay for better text contrast */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    </div>

                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-xl font-semibold text-white group-hover:text-primary transition-colors">
                                                {item.name}
                                            </CardTitle>
                                            <span className="text-2xl font-semibold text-orange-400 whitespace-nowrap">
                                                ${item.price.toFixed(2)}
                                            </span>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-5 pt-0 flex-grow">
                                        {/* Improved text size and contrast for descriptions */}
                                        <p className="text-base text-gray-200 line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>

                                        {/* User Rating Display */}
                                        {userRatings[item.id] && (
                                            <div className="mt-3 p-2 bg-white/10 rounded-md border border-white/20">
                                                <div className="flex items-center gap-1 mb-1">
                                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="text-sm font-semibold text-white">
                                                        {userRatings[item.id].rating}.0
                                                    </span>
                                                    <span className="text-xs text-gray-300">
                                                        - Your rating
                                                    </span>
                                                </div>
                                                {userRatings[item.id].review && (
                                                    <p className="text-xs text-gray-300 italic line-clamp-2">
                                                        "{userRatings[item.id].review}"
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>

                                    <CardFooter className="p-5 pt-0 mt-auto flex gap-2">
                                        <Button
                                            onClick={() => addToCart(item)}
                                            className="flex-1 gap-2 bg-primary hover:bg-primary-hover shadow-md hover:shadow-lg transition-all hover:scale-105 text-white font-semibold"
                                        >
                                            <Plus className="h-5 w-5" /> Add to Cart
                                        </Button>
                                        <Button
                                            onClick={() => handleRateClick(item)}
                                            variant="outline"
                                            className="gap-1 border-orange-400 text-orange-400 hover:bg-orange-400/10 hover:text-orange-300 shadow-sm hover:shadow-md transition-all"
                                        >
                                            <Star className="h-4 w-4" />
                                            {userRatings[item.id] ? 'Edit' : 'Rate'}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Rating Modal */}
            <RatingModal
                isOpen={ratingModalOpen}
                onClose={() => setRatingModalOpen(false)}
                foodItem={selectedItem}
                onSubmit={handleRatingSubmit}
            />
        </MainLayout>
    );
};

export default Menu;

