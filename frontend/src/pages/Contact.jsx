import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import MainLayout from '../layout/MainLayout';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        // Validate form
        const { name, email, message } = formData;
        if (!name || !email || !message) {
            setStatus({ type: 'error', message: 'Please fill in all required fields.' });
            setIsSubmitting(false);
            return;
        }

        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

            // Ensure credentials exist before sending
            if (!serviceId || !templateId || !publicKey) {
                throw new Error('Email service configuration is incomplete.');
            }

            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'jenishchauhan.08@gmail.com'
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            setStatus({
                type: 'success',
                message: 'Success! Your message has been sent to Jerry\'s Chaska. We\'ll get back to you soon!'
            });
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Email send error:', error);
            const errorMessage = error.text || error.message || 'Failed to send message. Please check your internet or try again later.';
            setStatus({
                type: 'error',
                message: `Error: ${errorMessage}`
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="bg-gradient-to-b from-primary-light/20 to-white py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-secondary mb-3">Get in Touch</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Have a question or feedback? We'd love to hear from you!
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <Card className="border-0 shadow-lg bg-secondary">
                                <CardHeader>
                                    <CardTitle className="text-2xl text-white font-semibold">Send Us a Message</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Status Messages */}
                                        {status.message && (
                                            <div
                                                className={`p-4 rounded-md font-semibold text-center ${status.type === 'success'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                    }`}
                                            >
                                                {status.message}
                                            </div>
                                        )}

                                        {/* Name Field */}
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                                Your Name *
                                            </label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                required
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                                Your Email *
                                            </label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                required
                                                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:ring-primary focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Message Field */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                                Your Message *
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows="6"
                                                placeholder="Tell us what's on your mind..."
                                                value={formData.message}
                                                onChange={handleChange}
                                                disabled={isSubmitting}
                                                required
                                                className="flex w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white font-medium placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-900 transition-all duration-200"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <Button
                                            type="submit"
                                            className="w-full bg-primary hover:bg-primary-hover text-white font-bold"
                                            disabled={isSubmitting}
                                            size="lg"
                                        >
                                            {isSubmitting ? (
                                                'Sending...'
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5 mr-2" />
                                                    Send Message
                                                </>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            <Card className="border-0 shadow-lg bg-secondary">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg text-white font-semibold">Email</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <a
                                        href="mailto:jenishchauhan.08@gmail.com"
                                        className="text-primary hover:text-primary-hover font-semibold transition-colors"
                                    >
                                        jenishchauhan.08@gmail.com
                                    </a>
                                    <p className="text-sm text-gray-300 mt-2">
                                        We'll respond within 24 hours
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-secondary">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg text-white font-semibold">Location</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-200 font-semibold">
                                        Junagadh, Gujarat
                                    </p>
                                    <p className="text-gray-300">India</p>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg bg-secondary">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <CardTitle className="text-lg text-white font-semibold">Hours</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-200 font-semibold">9:00 AM - 10:00 PM</p>
                                    <p className="text-sm text-gray-300 mt-1">Every day</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
