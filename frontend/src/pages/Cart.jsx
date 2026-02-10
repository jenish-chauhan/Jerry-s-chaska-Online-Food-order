import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import MainLayout from '../layout/MainLayout';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOrdering, setIsOrdering] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login?redirect=cart');
            return;
        }

        setIsOrdering(true);
        try {
            const orderData = {
                userId: user.id,
                items: cart,
                total: getCartTotal(),
                date: new Date().toISOString(),
            };
            await createOrder(orderData);
            clearCart();
            navigate('/order-success');
        } catch (error) {
            console.error("Order failed:", error);
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
                    <div className="lg:col-span-8">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <Card key={item.id} className="flex flex-row items-center p-4 bg-secondary border-0 shadow-md">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-24 w-24 rounded-md object-cover hidden sm:block"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                        <p className="text-orange-400 font-semibold text-sm">${item.price.toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
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
                                        className="ml-4 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
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
