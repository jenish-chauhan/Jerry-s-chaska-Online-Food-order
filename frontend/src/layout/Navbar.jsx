import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X, User, LogOut, Star, ListOrdered } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { getCartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'Ratings', path: '/ratings', icon: <Star className="h-4 w-4" /> },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    if (user?.role === 'admin') {
        navLinks.push({ name: 'Dashboard', path: '/admin' });
    } else if (user) {
        navLinks.push({ name: 'My Orders', path: '/orders', icon: <ListOrdered className="h-4 w-4" /> });
    }

    return (
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-[100] shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
                        <div className="text-3xl transition-transform group-hover:scale-110">🍔</div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent transition-all">
                            Jerry's Chaska
                        </span>
                    </Link>
                </div>

                {/* Navigation Links - Desktop */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="text-sm font-medium text-secondary hover:text-primary transition-colors relative group flex items-center gap-1"
                        >
                            {link.icon}
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Cart Button */}
                    <Link to="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative hover:bg-primary-light transition-all hover:scale-110"
                        >
                            <ShoppingCart className="h-5 w-5 text-secondary" />
                            {getCartCount() > 0 && (
                                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 bg-primary text-white text-xs font-bold">
                                    {getCartCount()}
                                </Badge>
                            )}
                        </Button>
                    </Link>

                    {/* User Actions - Desktop */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-secondary">
                                    Hi, {user.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    title="Logout"
                                    className="hover:bg-red-50 hover:text-red-600 transition-all hover:scale-110"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button className="bg-primary hover:bg-primary-hover transition-all hover:scale-105 shadow-sm hover:shadow-md">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="hover:bg-primary-light transition-colors"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white py-4 px-4 shadow-lg animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMenu}
                                className="text-lg font-semibold text-secondary hover:text-primary py-2 border-b border-gray-50 flex items-center gap-2"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-2 flex flex-col gap-3">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 px-2 py-2 bg-primary-light rounded-lg">
                                        <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="text-sm font-bold text-secondary">
                                            Hi, {user.name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 text-red-600 hover:bg-red-50 border-red-200"
                                        onClick={() => {
                                            logout();
                                            closeMenu();
                                        }}
                                    >
                                        <LogOut className="h-5 w-5" />
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <Link to="/login" onClick={closeMenu}>
                                    <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3">
                                        Login / Sign Up
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
