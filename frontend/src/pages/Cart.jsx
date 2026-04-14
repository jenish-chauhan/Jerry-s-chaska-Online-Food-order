import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import MainLayout from '../layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOrdering, setIsOrdering] = useState(false);

    // Checkout Form State
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear specific error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.customerName) newErrors.customerName = 'Name is required';
        if (!formData.phone || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone is required';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login?redirect=cart');
            return;
        }

        if (!validateForm()) {
            return;
        }

        setIsOrdering(true);
        try {
            const orderData = {
                ...formData,
                items: cart,
                totalPrice: getCartTotal(),
                paymentMethod: 'Cash on Delivery'
            };
            const response = await createOrder(orderData);
            if (!response.success) {
                throw new Error(response.message || 'Failed to place order.');
            }
            clearCart();
            const orderNumber = response.data?.orderNumber;
            const successUrl = orderNumber
              ? `/order-success?order=${encodeURIComponent(orderNumber)}`
              : "/order-success";
            navigate(successUrl, { state: { orderDetails: response.data } });
        } catch (error) {
            console.error("Order failed:", error);
            // Optionally set an error state to show a message to the user
            alert(error.message || "Failed to place order. Please try again.");
        } finally {
            setIsOrdering(false);
        }
    };

    if (cart.length === 0) {
        return (
            <MainLayout>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any delicious food yet.</p>
                    <Link to="/menu">
                        <Button size="lg">Browse Menu</Button>
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <Card key={item.id} className="flex flex-col gap-4 p-4 bg-secondary border-0 shadow-md sm:flex-row sm:items-center">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-24 w-24 rounded-md object-cover hidden sm:block"
                                    />
                                    <div className="flex-1 sm:ml-4">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        <p className="text-orange-400 font-semibold text-sm">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 self-start sm:self-center">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 border-gray-600 text-white hover:bg-gray-700"
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center text-white font-semibold">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 border-gray-600 text-white hover:bg-gray-700"
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="self-end text-red-400 hover:text-red-300 hover:bg-red-400/10 sm:ml-4 sm:self-center"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        {/* Checkout Form */}
                        {user && (
                            <Card className="bg-secondary border-0 shadow-lg mb-4 p-4 text-white">
                                <h3 className="text-xl font-semibold mb-4 text-orange-400">Customer Details</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Full Name</label>
                                        <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="John Doe" />
                                        {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName}</p>}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Phone</label>
                                            <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="10-digit number" />
                                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="john@example.com" />
                                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="bg-secondary border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-white font-semibold">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between text-base">
                                    <p className="text-gray-300">Subtotal</p>
                                    <p className="text-orange-400 font-semibold">${getCartTotal().toFixed(2)}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p className="text-gray-300">Shipping</p>
                                    <p className="text-gray-200">Free</p>
                                </div>
                                <div className="border-t border-gray-700 pt-4 flex justify-between text-lg font-bold">
                                    <p className="text-white">Total</p>
                                    <p className="text-orange-400">${getCartTotal().toFixed(2)}</p>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full bg-primary hover:bg-primary-hover text-white font-bold"
                                    size="lg"
                                    onClick={handleCheckout}
                                    disabled={isOrdering}
                                >
                                    {isOrdering ? 'Processing...' : user ? 'Place Order' : 'Login to Order'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Cart;
