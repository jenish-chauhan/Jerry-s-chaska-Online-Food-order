// Mock ratings data for the Ratings feature
export const mockRatings = [
    {
        id: 1,
        foodName: "Classic Burger",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80",
        rating: 4.8,
        reviewCount: 124,
        reviews: [
            {
                id: 1,
                userName: "Sarah Johnson",
                rating: 5,
                comment: "Absolutely delicious! The patty was juicy and perfectly cooked. Best burger in town!",
                date: "2024-02-05"
            },
            {
                id: 2,
                userName: "Mike Chen",
                rating: 4,
                comment: "Great taste and generous portions. The fries were crispy and fresh.",
                date: "2024-02-03"
            }
        ]
    },
    {
        id: 2,
        foodName: "Spicy Chicken Wings",
        image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 98,
        reviews: [
            {
                id: 3,
                userName: "Emily Rodriguez",
                rating: 5,
                comment: "Perfect level of spice! Crispy on the outside, tender inside. Highly recommend!",
                date: "2024-02-06"
            },
            {
                id: 4,
                userName: "James Wilson",
                rating: 5,
                comment: "These wings are addictive! The sauce is incredible and they're always fresh.",
                date: "2024-02-04"
            }
        ]
    },
    {
        id: 3,
        foodName: "Margherita Pizza",
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&auto=format&fit=crop&q=80",
        rating: 4.7,
        reviewCount: 156,
        reviews: [
            {
                id: 5,
                userName: "David Kim",
                rating: 5,
                comment: "Authentic Italian taste! The crust is perfect and the ingredients are fresh.",
                date: "2024-02-07"
            },
            {
                id: 6,
                userName: "Lisa Anderson",
                rating: 4,
                comment: "Really good pizza. The cheese quality is excellent and it arrived hot.",
                date: "2024-02-02"
            }
        ]
    },
    {
        id: 4,
        foodName: "Loaded Fries",
        image: "https://images.unsplash.com/photo-1630384082525-3e0d8d58b1e3?w=400&auto=format&fit=crop&q=80",
        rating: 4.6,
        reviewCount: 87,
        reviews: [
            {
                id: 7,
                userName: "Tom Harris",
                rating: 5,
                comment: "So much flavor! The toppings are generous and the fries stay crispy.",
                date: "2024-02-06"
            },
            {
                id: 8,
                userName: "Rachel Green",
                rating: 4,
                comment: "Great comfort food. Perfect for sharing with friends!",
                date: "2024-02-01"
            }
        ]
    },
    {
        id: 5,
        foodName: "Chocolate Shake",
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80",
        rating: 4.9,
        reviewCount: 142,
        reviews: [
            {
                id: 9,
                userName: "Alex Turner",
                rating: 5,
                comment: "Rich and creamy! Tastes like real chocolate, not artificial at all.",
                date: "2024-02-07"
            },
            {
                id: 10,
                userName: "Sophie Martin",
                rating: 5,
                comment: "Best shake I've ever had! Thick, cold, and absolutely delicious.",
                date: "2024-02-05"
            }
        ]
    },
    {
        id: 6,
        foodName: "Veggie Wrap",
        image: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&auto=format&fit=crop&q=80",
        rating: 4.5,
        reviewCount: 73,
        reviews: [
            {
                id: 11,
                userName: "Nina Patel",
                rating: 5,
                comment: "Finally, a healthy option that actually tastes amazing! Fresh veggies and great sauce.",
                date: "2024-02-06"
            },
            {
                id: 12,
                userName: "Chris Brown",
                rating: 4,
                comment: "Surprisingly filling and flavorful. Good vegetarian choice!",
                date: "2024-02-03"
            }
        ]
    }
];

// Get top rated items (for home page)
export const getTopRatedItems = (count = 3) => {
    return mockRatings
        .sort((a, b) => b.rating - a.rating)
        .slice(0, count);
};

// Get all ratings
export const getAllRatings = () => {
    return mockRatings;
};
