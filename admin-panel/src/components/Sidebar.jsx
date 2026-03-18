import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, UtensilsCrossed, ShoppingBag,
    BarChart2, LogOut, ChefHat, Users
} from 'lucide-react';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/users', icon: Users, label: 'Users' },
    { to: '/food-items', icon: UtensilsCrossed, label: 'Food Items' },
    { to: '/orders', icon: ShoppingBag, label: 'Orders' },
    { to: '/analytics', icon: BarChart2, label: 'Analytics' },
];

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            minHeight: '100vh',
            background: 'var(--secondary)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            zIndex: 100,
        }}>
            {/* Logo */}
            <div style={{
                padding: '24px 20px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: 'var(--primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <ChefHat size={20} color="#fff" />
                    </div>
                    <div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>Jerry's Chaska</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 500 }}>Admin Panel</div>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px 12px' }}>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '10px 12px',
                            borderRadius: 8,
                            color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                            background: isActive ? 'rgba(255,107,53,0.18)' : 'transparent',
                            textDecoration: 'none',
                            fontSize: 14,
                            fontWeight: isActive ? 600 : 400,
                            marginBottom: 2,
                            transition: 'all 0.15s ease',
                            borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                        })}
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            {/* User info + logout */}
            <div style={{
                padding: '16px 16px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{ marginBottom: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{user?.name || 'Admin'}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user?.email}</div>
                </div>
                <button
                    onClick={handleLogout}
                    className="btn btn-ghost"
                    style={{
                        width: '100%',
                        color: 'rgba(255,255,255,0.55)',
                        borderColor: 'rgba(255,255,255,0.12)',
                        justifyContent: 'center',
                        fontSize: 13,
                    }}
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
