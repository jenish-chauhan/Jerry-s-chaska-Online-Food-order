import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const RatingModal = ({ isOpen, onClose, foodItem, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [userName, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setIsSubmitting(true);

        // Call the onSubmit callback
        const success = await onSubmit({
            itemId: foodItem.id,
            rating,
            review,
            userName: userName || 'Anonymous'
        });

        setIsSubmitting(false);

        if (success) {
            // Reset form
            setRating(0);
            setReview('');
            setUserName('');
            onClose();
        }
    };

    const handleClose = () => {
        setRating(0);
        setHoverRating(0);
        setReview('');
        setUserName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-6 w-6" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Rate This Item</h2>
                    <p className="text-gray-600 mt-1">{foodItem?.name}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 mb-3">
                            Your Rating *
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`h-10 w-10 ${star <= (hoverRating || rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-lg font-semibold text-gray-900">
                                    {rating}.0
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Name Field */}
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-900 mb-2">
                            Your Name (Optional)
                        </label>
                        <Input
                            id="userName"
                            type="text"
                            placeholder="Enter your name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Leave blank to post as "Anonymous"
                        </p>
                    </div>

                    {/* Review Field */}
                    <div>
                        <label htmlFor="review" className="block text-sm font-medium text-gray-900 mb-2">
                            Your Review (Optional)
                        </label>
                        <textarea
                            id="review"
                            rows="4"
                            placeholder="Share your experience with this dish..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            disabled={isSubmitting}
                            className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 font-medium placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 transition-all duration-200"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || rating === 0}
                            className="flex-1 bg-primary hover:bg-primary-hover"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RatingModal;
