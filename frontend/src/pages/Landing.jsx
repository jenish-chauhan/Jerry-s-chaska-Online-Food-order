import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';
import { getTopRatedItems } from '../services/mockRatings';

const Landing = () => {
    const topRated = getTopRatedItems(3);

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= Math.floor(rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : star - 0.5 <= rating
                                ? 'fill-yellow-400/50 text-yellow-400'
                                : 'text-gray-500'
                            }`}
                    />
                ))}
                <span className="ml-1 text-sm font-semibold text-gray-200">{rating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <MainLayout>
            {/* Hero Section - Optimized for Mobile */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-light via-white to-white pt-12 pb-16 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-36">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZjZiMzUiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMS0xLjc5IDQtNCA0cy00LTEuNzktNC00IDEuNzktNCA0LTQgNCAxLjc5IDQgNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                        <div className="text-center lg:text-left md:mx-auto md:max-w-2xl lg:col-span-6">
                            <div className="inline-flex items-center gap-2 bg-primary-light px-4 py-2 rounded-full mb-6">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span className="text-xs sm:text-sm font-medium text-primary uppercase tracking-wider">Authentic Street Food Delivered Fresh</span>
                            </div>

                            <h1 className="text-4xl font-extrabold tracking-tight text-secondary sm:text-6xl lg:text-7xl leading-tight">
                                <span className="block">Taste the Best</span>
                                <span className="block text-primary mt-1">Street Food</span>
                            </h1>

                            <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
                                Craving something delicious? Jerry's Chaska brings you the finest selection of fast food and street delicacies. Fresh, hot, and delivered fast.
                            </p>

                            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/menu" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full bg-primary hover:bg-primary-hover text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group py-6 sm:py-4">
                                        Order Now
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link to="/menu" className="w-full sm:w-auto">
                                    <Button size="lg" variant="outline" className="w-full border-2 border-primary text-primary hover:bg-primary-light py-6 sm:py-4">
                                        View Menu
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="relative mt-12 lg:mt-0 w-full max-w-lg mx-auto lg:col-span-6 lg:max-w-none lg:flex lg:items-center">
                            <div className="relative w-full aspect-square sm:aspect-video lg:aspect-square rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
                                <img
                                    className="w-full h-full object-cover"
                                    src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80"
                                    alt="Delicious Burger"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top Rated Items Section */}
            <section className="py-16 bg-gray-50/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mb-4">
                            <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                            <span className="text-sm font-semibold text-yellow-800">Customer Favorites</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-secondary sm:text-5xl mb-3">
                            Top Rated Items
                        </h2>
                        <p className="text-lg text-gray-600">
                            Our most loved dishes, rated by customers like you
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {topRated.map((item) => (
                            <Card key={item.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-secondary group">
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={item.foodName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-bold text-white">{item.rating.toFixed(1)}</span>
                                    </div>
                                </div>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-xl font-bold text-white">{item.foodName}</CardTitle>
                                    <div className="flex items-center justify-between mt-2">
                                        {renderStars(item.rating)}
                                        <span className="text-sm text-gray-400">({item.reviewCount})</span>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {item.reviews && item.reviews.length > 0 && (
                                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                                            <p className="text-sm text-gray-200 italic line-clamp-2">
                                                "{item.reviews[0].comment}"
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link to="/ratings">
                            <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary-light">
                                View All Ratings
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base font-semibold uppercase tracking-wide text-primary mb-2">Why Choose Us?</h2>
                        <p className="text-4xl font-extrabold text-secondary sm:text-5xl">
                            Better Food, Better Mood
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-white rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white mb-4 shadow-md">
                                    <Star className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-3">Top Quality</h3>
                                <p className="text-gray-600">
                                    We verify every ingredient to ensure only the best reaches your plate.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-white rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white mb-4 shadow-md">
                                    <Clock className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-3">Fast Delivery</h3>
                                <p className="text-gray-600">
                                    Hungry? We deliver fast so you can enjoy your food while it's hot.
                                </p>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-white rounded-2xl transform group-hover:scale-105 transition-transform"></div>
                            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white mb-4 shadow-md">
                                    <ShieldCheck className="h-7 w-7" />
                                </div>
                                <h3 className="text-xl font-bold text-secondary mb-3">Hygienic</h3>
                                <p className="text-gray-600">
                                    Our kitchens adhere to strict hygiene and safety standards.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Landing;

