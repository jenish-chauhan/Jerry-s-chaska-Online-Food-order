import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Ratings from './pages/Ratings';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import OrderSuccess from './pages/OrderSuccess';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ratings" element={<Ratings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                </Routes>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
