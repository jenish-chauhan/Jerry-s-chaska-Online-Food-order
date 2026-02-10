import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary py-12 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-3xl">🍔</span>
                            <h3 className="text-2xl font-bold text-white">Jerry's Chaska</h3>
                        </div>
                        <p className="max-w-xs text-sm mb-4">
                            Bringing the authentic taste of street food directly to your doorstep. Fresh, hygienic, and delicious - that's our promise.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu" className="hover:text-primary transition-colors">
                                    Menu
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                            Contact Us
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-primary" />
                                <span>9 AM - 10 PM Daily</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <a
                                    href="mailto:jenishchauhan.08@gmail.com"
                                    className="hover:text-primary transition-colors"
                                >
                                    jenishchauhan.08@gmail.com
                                </a>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="h-4 w-4 text-primary mt-1" />
                                <span>Junagadh, Gujarat, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Jerry's Chaska. All rights reserved. Made with ❤️ for food lovers.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

