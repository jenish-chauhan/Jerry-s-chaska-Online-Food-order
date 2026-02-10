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
                            <span className="text-5xl">🍔</span>
                            <h1 className="text-4xl font-extrabold text-secondary">About Jerry's Chaska</h1>
                        </div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Bringing authentic street food flavors to your doorstep since day one
                        </p>
                    </div>

                    {/* Story Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-4">Our Story</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    Jerry's Chaska was born from a simple passion: bringing the vibrant, authentic flavors of street food to food lovers everywhere. What started as a small venture in Junagadh, Gujarat, has grown into a beloved destination for those craving genuine, delicious fast food.
                                </p>
                                <p>
                                    We believe that great food doesn't have to be complicated. Our menu celebrates the rich culinary heritage of Indian street food, from crispy samosas to juicy burgers, all prepared with the freshest ingredients and served with love.
                                </p>
                                <p>
                                    Every dish we serve is a testament to our commitment to quality, hygiene, and authentic taste. We're not just serving food; we're creating experiences and memories, one delicious bite at a time.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold text-secondary mb-4">Our Mission</h2>
                            <div className="space-y-4 text-gray-700 leading-relaxed">
                                <p>
                                    At Jerry's Chaska, our mission is simple yet powerful: to deliver happiness through food. We strive to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4">
                                    <li>Serve only the highest quality, freshest ingredients</li>
                                    <li>Maintain strict hygiene and safety standards</li>
                                    <li>Provide fast, reliable delivery service</li>
                                    <li>Offer authentic flavors at affordable prices</li>
                                    <li>Create a welcoming experience for every customer</li>
                                </ul>
                                <p className="mt-4">
                                    We're committed to making every meal memorable, whether it's a quick lunch break or a family dinner. Your satisfaction is our success.
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
                                    Junagadh, Gujarat<br />
                                    India
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
                                    Available 9 AM - 10 PM<br />
                                    Every day
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Values Section */}
                    <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-secondary text-center mb-8">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="text-4xl mb-3">🌟</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Quality First</h3>
                                <p className="text-gray-600">
                                    We never compromise on the quality of our ingredients or preparation
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">❤️</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Customer Love</h3>
                                <p className="text-gray-600">
                                    Your satisfaction and happiness are at the heart of everything we do
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl mb-3">🚀</div>
                                <h3 className="text-xl font-bold text-secondary mb-2">Fast Service</h3>
                                <p className="text-gray-600">
                                    Quick delivery without compromising on quality or taste
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
