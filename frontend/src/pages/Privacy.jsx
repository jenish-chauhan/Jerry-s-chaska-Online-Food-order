import { Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';

const Privacy = () => {
    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-primary-light/20 to-white py-16">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-3 mb-4">
                            <Shield className="h-10 w-10 text-primary" />
                            <h1 className="text-4xl font-extrabold text-secondary">Privacy Policy</h1>
                        </div>
                        <p className="text-gray-600">Last updated: February 2024</p>
                    </div>

                    <Card className="border-0 shadow-lg bg-secondary">
                        <CardContent className="p-8 space-y-8">
                            {/* Introduction */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    At Jerry's Chaska, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our food ordering service.
                                </p>
                            </section>

                            {/* Information We Collect */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                                <div className="space-y-3 text-gray-300">
                                    <p className="font-semibold text-white">Personal Information:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Name and contact details (email, phone number)</li>
                                        <li>Delivery address</li>
                                        <li>Payment information (processed securely through third-party providers)</li>
                                        <li>Order history and preferences</li>
                                    </ul>

                                    <p className="font-semibold text-white mt-4">Usage Information:</p>
                                    <ul className="list-disc list-inside space-y-2 ml-4">
                                        <li>Device information and IP address</li>
                                        <li>Browser type and version</li>
                                        <li>Pages visited and time spent on our platform</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>
                            </section>

                            {/* How We Use Your Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                                <p className="text-gray-300 leading-relaxed mb-3">
                                    We use your information to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                                    <li>Process and deliver your orders</li>
                                    <li>Communicate with you about your orders and account</li>
                                    <li>Improve our services and user experience</li>
                                    <li>Send promotional offers (with your consent)</li>
                                    <li>Prevent fraud and ensure platform security</li>
                                    <li>Comply with legal obligations</li>
                                </ul>
                            </section>

                            {/* Data Security */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. This includes encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                                </p>
                            </section>

                            {/* Sharing Your Information */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Sharing Your Information</h2>
                                <p className="text-gray-300 leading-relaxed mb-3">
                                    We do not sell your personal information. We may share your data with:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                                    <li>Delivery partners to fulfill your orders</li>
                                    <li>Payment processors to handle transactions</li>
                                    <li>Service providers who assist in operating our platform</li>
                                    <li>Law enforcement when required by law</li>
                                </ul>
                            </section>

                            {/* Your Rights */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                                <p className="text-gray-300 leading-relaxed mb-3">
                                    You have the right to:
                                </p>
                                <ul className="list-disc list-inside space-y-2 ml-4 text-gray-300">
                                    <li>Access your personal data</li>
                                    <li>Correct inaccurate information</li>
                                    <li>Request deletion of your data</li>
                                    <li>Opt-out of marketing communications</li>
                                    <li>Withdraw consent at any time</li>
                                </ul>
                            </section>

                            {/* Cookies */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We use cookies to enhance your experience on our platform. Cookies help us remember your preferences, analyze site traffic, and personalize content. You can control cookie settings through your browser, but disabling cookies may affect site functionality.
                                </p>
                            </section>

                            {/* Children's Privacy */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
                                </p>
                            </section>

                            {/* Changes to This Policy */}
                            <section>
                                <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                                <p className="text-gray-300 leading-relaxed">
                                    We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                                </p>
                            </section>

                            {/* Contact Us */}
                            <section className="bg-gray-800 rounded-lg p-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                                <p className="text-gray-300 leading-relaxed mb-3">
                                    If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                                </p>
                                <div className="space-y-2 text-gray-300">
                                    <p><strong className="text-white">Email:</strong> <a href="mailto:jenishchauhan.08@gmail.com" className="text-primary hover:text-primary-hover">jenishchauhan.08@gmail.com</a></p>
                                    <p><strong className="text-white">Location:</strong> Junagadh, Gujarat, India</p>
                                </div>
                            </section>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MainLayout>
    );
};

export default Privacy;
