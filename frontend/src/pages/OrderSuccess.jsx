import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, MapPin, Clock, ListOrdered } from 'lucide-react';
import { Button } from '../components/ui/Button';
import MainLayout from '../layout/MainLayout';

const OrderSuccess = () => {
    const location = useLocation();
    const orderDetails = location.state?.orderDetails;

    return (
        <MainLayout>
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 py-12">
                <div className="rounded-full bg-green-100 p-6 mb-6 mt-10">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
                <p className="text-lg text-orange-600 font-semibold mb-2">
                    Please wait while the restaurant prepares your order.
                </p>
                <p className="text-gray-500 max-w-md mb-8">
                    Thank you for ordering with Jerry's Chaska. You can collect your items at the counter when ready.
                </p>

                {orderDetails && (
                    <div className="bg-secondary p-6 rounded-lg text-left max-w-md w-full shadow-lg border border-gray-700 mb-8 mx-auto">
                        <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-4">
                            <div className="flex items-center gap-3 text-white">
                                <ListOrdered className="h-6 w-6 text-orange-400" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Order Number</p>
                                    <p className="text-xl font-bold">{orderDetails.orderNumber}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-full uppercase">
                                    {orderDetails.status}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-gray-300">
                                <span className="text-sm">Customer Name:</span>
                                <span className="font-medium text-white">{orderDetails.customerName || 'Guest'}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-300">
                                <span className="text-sm">Total Amount:</span>
                                <span className="font-bold text-orange-400">${parseFloat(orderDetails.totalPrice || 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/orders">
                        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:scale-105 transition-all">
                            Track Order Status
                        </Button>
                    </Link>
                    <Link to="/menu">
                        <Button size="lg" variant="outline" className="border-gray-800 text-gray-900 hover:bg-gray-100 shadow-sm hover:scale-105 transition-all">
                            Menu
                        </Button>
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderSuccess;
