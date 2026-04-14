import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu as MenuIcon, X, LogOut, Star, ListOrdered } from 'lucide-react';
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
        <nav className="sticky top-0 z-[100] border-b border-gray-200 bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-2">
                    <Link to="/" onClick={closeMenu} className="group flex min-w-0 items-center gap-2">
                        <div className="text-2xl transition-transform group-hover:scale-110 sm:text-3xl">🍔</div>
                        <span className="truncate bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-lg font-bold text-transparent transition-all sm:text-2xl">
                            Jerry&apos;s Chaska
                        </span>
                    </Link>
                </div>

                <div className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="group relative flex items-center gap-1 text-sm font-medium text-secondary transition-colors hover:text-primary"
                        >
                            {link.icon}
                            {link.name}
                            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                    <Link to="/cart">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-9 w-9 transition-all hover:bg-primary-light sm:h-10 sm:w-10 sm:hover:scale-110"
                        >
                            <ShoppingCart className="h-5 w-5 text-secondary" />
                            {getCartCount() > 0 && (
                                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs font-bold text-white">
                                    {getCartCount()}
                                </Badge>
                            )}
                        </Button>
                    </Link>

                    <div className="hidden items-center gap-2 md:flex">
                        {user ? (
                            <>
                                <span className="max-w-[160px] truncate text-sm font-medium text-secondary">
                                    Hi, {user.name}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={logout}
                                    title="Logout"
                                    className="transition-all hover:bg-red-50 hover:text-red-600 hover:scale-110"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button className="bg-primary shadow-sm transition-all hover:bg-primary-hover hover:scale-105 hover:shadow-md">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleMenu}
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="h-9 w-9 transition-colors hover:bg-primary-light sm:h-10 sm:w-10"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {isMenuOpen && (
                <div className="animate-in slide-in-from-top border-t border-gray-100 bg-white px-4 py-4 shadow-lg duration-200 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={closeMenu}
                                className="flex items-center gap-2 border-b border-gray-50 py-2 text-lg font-semibold text-secondary hover:text-primary"
                            >
                                {link.icon}
                                {link.name}
                            </Link>
                        ))}

                        <div className="flex flex-col gap-3 pt-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 rounded-lg bg-primary-light px-2 py-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-bold text-white">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="truncate text-sm font-bold text-secondary">
                                            Hi, {user.name}
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start gap-2 border-red-200 text-red-600 hover:bg-red-50"
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
                                    <Button className="w-full bg-primary py-3 font-bold text-white hover:bg-primary-hover">
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
