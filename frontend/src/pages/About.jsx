import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';

const About = () => {
    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-primary-light/20 to-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <span className="text-5xl">{'\u{1F354}'}</span>
                            <h1 className="text-4xl font-extrabold text-secondary">About Our Food Ordering System</h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            A complete digital solution for menu browsing, food ordering, and order management
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-4">Our Story</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    This application was built to modernize the food ordering experience for both customers and administrators. It combines menu access, cart handling, and order placement into one easy-to-use platform.
                                </p>
                                <p>
                                    Customers can explore food items, place orders quickly, and enjoy a smoother digital experience. On the management side, administrators can organize menu items, monitor incoming orders, and handle daily operations more efficiently.
                                </p>
                                <p>
                                    The system represents more than online ordering. It is a practical order management solution designed to improve speed, accuracy, convenience, and service quality across the entire workflow.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-4">Our Mission</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Our mission is to make food ordering and order management simple, reliable, and efficient for every user. This system is designed to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Provide a fast and user-friendly food ordering experience</li>
                                    <li>Help administrators manage menus and orders effectively</li>
                                    <li>Support clear order tracking and status handling</li>
                                    <li>Reduce manual work through organized digital workflows</li>
                                    <li>Deliver a dependable experience for both customers and admins</li>
                                </ul>
                                <p className="mt-4">
                                    We aim to create a system that connects ordering, management, and service into one smooth and efficient process every day.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-lg bg-secondary">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg text-white">Email Us</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <a
                                    href="mailto:jenishchauhan.08@gmail.com"
                                    className="text-primary hover:text-primary-hover font-medium transition-colors"
                                >
                                    jenishchauhan.08@gmail.com
                                </a>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-secondary">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg text-white">Visit Us</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-white">
                                    Customer ordering panel<br />
                                    Admin management dashboard
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-secondary">
                            <CardHeader className="text-center">
                                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg text-white">Call Us</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-white">
                                    Order updates and support<br />
                                    Available throughout the platform
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Values Section */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-secondary text-center mb-8">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl mb-3">{'\u{1F31F}'}</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Reliable Ordering</h3>
                                <p className="text-gray-600">
                                    Built to support consistent menu browsing, cart handling, and order placement
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">{'\u2764\uFE0F'}</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Smooth Experience</h3>
                                <p className="text-gray-600">
                                    Designed to make the journey simple and efficient for both customers and administrators
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">{'\u{1F680}'}</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Smart Management</h3>
                                <p className="text-gray-600">
                                    Helps teams manage orders, updates, and daily food service operations with ease
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default About;
