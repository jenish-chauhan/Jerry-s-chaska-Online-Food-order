import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';
import { UserPlus, Loader2, CheckCircle } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await register(formData.name, formData.email, formData.password);

            if (result.success) {
                setSuccess(true);
                // Redirect after showing success message
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                setError(result.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.name && formData.email && formData.password &&
        formData.confirmPassword && formData.password === formData.confirmPassword &&
        formData.password.length >= 8;

    return (
        <MainLayout>
            <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 bg-gradient-to-b from-primary-light/20 to-white">
                <Card className="w-full max-w-md shadow-xl border-0 bg-secondary">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                            <UserPlus className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-2xl text-white">Create Account</CardTitle>
                        <CardDescription className="text-gray-300">Join Jerry's Chaska and start ordering delicious food</CardDescription>
                    </CardHeader>

                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* Success Message */}
                            {success && (
                                <div className="bg-green-500 text-white text-sm p-3 rounded-md border border-green-400 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    <span>Account created successfully! Redirecting...</span>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500 text-white text-sm p-3 rounded-md border border-red-400">
                                    {error}
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="name">
                                    Full Name *
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="email">
                                    Email Address *
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={loading}
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="password">
                                    Password *
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Minimum 8 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={loading}
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="confirmPassword">
                                    Confirm Password *
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={loading}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-400">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                                disabled={!isFormValid || loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>

                            <div className="text-center text-sm text-gray-300">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-primary hover:text-primary-hover underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Register;
