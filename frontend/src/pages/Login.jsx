import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import MainLayout from '../layout/MainLayout';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate(redirect);
        } else {
            setError(result.message);
        }
    };

    const fillAdmin = () => {
        setEmail('admin@jerryschaska.com');
        setPassword('admin123');
    };

    const fillUser = () => {
        setEmail('user@example.com');
        setPassword('user123');
    };

    return (
        <MainLayout>
            <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 bg-gradient-to-b from-primary-light/20 to-white">
                <Card className="w-full max-w-md shadow-xl border-0 bg-secondary">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
                            <LogIn className="h-7 w-7" />
                        </div>
                        <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
                        <CardDescription className="text-gray-300">Enter your credentials to access your account</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <div className="bg-red-500 text-white text-sm p-3 rounded-md border border-red-400">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                                />
                            </div>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4">
                            <Button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white">
                                Sign In
                            </Button>

                            <div className="flex gap-2 w-full">
                                <Button type="button" variant="outline" className="flex-1 text-xs border-gray-600 text-white hover:bg-gray-700" onClick={fillUser}>
                                    Demo User
                                </Button>
                                <Button type="button" variant="outline" className="flex-1 text-xs border-gray-600 text-white hover:bg-gray-700" onClick={fillAdmin}>
                                    Demo Admin
                                </Button>
                            </div>

                            <div className="text-center text-sm text-gray-300">
                                Don't have an account?{' '}
                                <Link to="/register" className="font-medium text-primary hover:text-primary-hover underline">
                                    Sign up
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </MainLayout>
    );
};

export default Login;
