import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { getOrdersOverTime, getTopSellingItems, getOrdersByStatus, getDashboardStats } from '../services/api';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = {
    pending: '#F39C12', confirmed: '#2980B9',
    preparing: '#8E44AD', delivered: '#27AE60', cancelled: '#E74C3C'
};

const Analytics = () => {
    const [ordersOverTime, setOrdersOverTime] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [byStatus, setByStatus] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [ot, ti, bs, st] = await Promise.all([
                    getOrdersOverTime(), getTopSellingItems(), getOrdersByStatus(), getDashboardStats()
                ]);
                setOrdersOverTime(ot.data.map(r => ({
                    ...r,
                    date: new Date(r.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                    orders: Number(r.orders),
                    revenue: parseFloat(r.revenue)
                })));
                setTopItems(ti.data.slice(0, 8).map(i => ({ ...i, total_sold: Number(i.total_sold) })));
                setByStatus(bs.data.map(r => ({
                    name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
                    value: Number(r.count),
                    key: r.status
                })));
                setStats(st.data);
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    if (loading) return (
        <AdminLayout>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%' }} className="spin" />
            </div>
        </AdminLayout>
    );

    const NoData = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 260, color: 'var(--text-muted)', fontSize: 14 }}>
            No data available yet
        </div>
    );

    return (
        <AdminLayout>
            <div style={{ padding: 32 }}>
                <div style={{ marginBottom: 28 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Business insights and performance metrics</p>
                </div>

                {/* Quick KPIs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                    {[
                        { label: 'Total Orders', value: stats?.totalOrders ?? 0 },
                        { label: 'Total Revenue', value: `₹${parseFloat(stats?.totalRevenue || 0).toFixed(0)}` },
                        { label: 'Avg Order Value', value: stats?.totalOrders > 0 ? `₹${(parseFloat(stats?.totalRevenue || 0) / stats.totalOrders).toFixed(0)}` : '₹0' },
                        { label: 'Pending Orders', value: stats?.pendingOrders ?? 0 },
                    ].map(kpi => (
                        <div key={kpi.label} className="card" style={{ padding: '20px 20px' }}>
                            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{kpi.label}</p>
                            <p style={{ fontSize: 26, fontWeight: 800 }}>{kpi.value}</p>
                        </div>
                    ))}
                </div>

                {/* Revenue over time */}
                <div className="card" style={{ marginBottom: 20 }}>
                    <div className="card-header">
                        <span className="card-title">Revenue Over Time (Last 30 Days)</span>
                    </div>
                    <div className="card-body">
                        {ordersOverTime.length > 0 ? (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart data={ordersOverTime}>
                                    <defs>
                                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#27AE60" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#27AE60" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FF6B35" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#FF6B35" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                    <YAxis yAxisId="rev" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} orientation="right" />
                                    <YAxis yAxisId="ord" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                                    <Legend />
                                    <Area yAxisId="ord" type="monotone" dataKey="orders" stroke="#FF6B35" fill="url(#ordGrad)" strokeWidth={2} name="Orders" />
                                    <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#27AE60" fill="url(#revGrad)" strokeWidth={2} name="Revenue (₹)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <NoData />}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {/* Top selling items */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Top Selling Items</span>
                        </div>
                        <div className="card-body">
                            {topItems.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={topItems} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                                        <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} width={100} />
                                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                                        <Bar dataKey="total_sold" fill="#FF6B35" radius={[0, 6, 6, 0]} name="Units Sold" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : <NoData />}
                        </div>
                    </div>

                    {/* Orders by status pie */}
                    <div className="card">
                        <div className="card-header">
                            <span className="card-title">Orders by Status</span>
                        </div>
                        <div className="card-body">
                            {byStatus.length > 0 ? (
                                <ResponsiveContainer width="100%" height={280}>
                                    <PieChart>
                                        <Pie
                                            data={byStatus}
                                            cx="50%" cy="50%"
                                            innerRadius={70} outerRadius={110}
                                            paddingAngle={3}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            labelLine={false}
                                        >
                                            {byStatus.map((entry) => (
                                                <Cell key={entry.key} fill={PIE_COLORS[entry.key] || '#ccc'} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : <NoData />}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Analytics;
