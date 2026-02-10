import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import MainLayout from '../layout/MainLayout';

const OrderSuccess = () => {
    return (
        <MainLayout>
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
                <div className="rounded-full bg-green-100 p-6 mb-6">
                    <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h1>
                <p className="text-gray-500 max-w-md mb-8">
                    Thank you for ordering with Jerry's Chaska. Your delicious food is being prepared and will be with you shortly.
                </p>
                <div className="flex gap-4">
                    <Link to="/">
                        <Button variant="outline">Go Home</Button>
                    </Link>
                    <Link to="/menu">
                        <Button>Order More</Button>
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
};

export default OrderSuccess;
