import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { menuItems } from '../services/mockData';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user || user.role !== 'admin') return null;

    return (
        <MainLayout>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders Today</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$345.00</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Menu Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{menuItems.length}</div>
                        </CardContent>
                    </Card>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                <Card className="mb-8">
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-gray-100/50 data-[state=selected]:bg-gray-100">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Order ID</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Status</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Amount</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-gray-500">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    <tr className="border-b transition-colors hover:bg-gray-100/50">
                                        <td className="p-4 align-middle">#ORD-001</td>
                                        <td className="p-4 align-middle"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white hover:bg-green-500/80">Completed</span></td>
                                        <td className="p-4 align-middle">$45.00</td>
                                        <td className="p-4 align-middle">Today, 10:30 AM</td>
                                    </tr>
                                    <tr className="border-b transition-colors hover:bg-gray-100/50">
                                        <td className="p-4 align-middle">#ORD-002</td>
                                        <td className="p-4 align-middle"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500 text-white hover:bg-yellow-500/80">Pending</span></td>
                                        <td className="p-4 align-middle">$23.50</td>
                                        <td className="p-4 align-middle">Today, 11:15 AM</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
};

export default AdminDashboard;
