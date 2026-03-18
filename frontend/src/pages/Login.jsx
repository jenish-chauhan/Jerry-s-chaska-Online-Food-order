import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import MainLayout from "../layout/MainLayout";
import { LogIn, Shield } from "lucide-react";

const getAdminAppUrl = () => {
  if (import.meta.env.VITE_ADMIN_URL) {
    return import.meta.env.VITE_ADMIN_URL;
  }

  const { protocol, hostname } = window.location;
  if (import.meta.env.DEV) {
    return `${protocol}//${hostname}:5174`;
  }

  return `${protocol}//${hostname}:8080`;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("user");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.success) {
      navigate(redirect);
    } else if (result.redirectToAdmin) {
      window.location.href = getAdminAppUrl();
    } else {
      setError(result.message);
    }
  };

  const goToAdminLogin = () => {
    window.location.href = getAdminAppUrl();
  };

  return (
    <MainLayout>
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12 bg-gradient-to-b from-primary-light/20 to-white">
        <Card className="w-full max-w-md shadow-xl border-0 bg-secondary">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
              {role === "user" ? (
                <LogIn className="h-7 w-7" />
              ) : (
                <Shield className="h-7 w-7" />
              )}
            </div>
            <CardTitle className="text-2xl text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              {role === "user"
                ? "Enter your credentials to access your account"
                : "Sign in to the admin dashboard"}
            </CardDescription>
          </CardHeader>

          {/* Role Selector Toggle */}
          <div style={{ padding: "0 24px", marginBottom: 8 }}>
            <div
              style={{
                display: "flex",
                background: "#1f2937",
                borderRadius: 10,
                padding: 4,
                gap: 4,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setRole("user");
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.25s ease",
                  background:
                    role === "user" ? "var(--primary, #ff6b35)" : "transparent",
                  color: role === "user" ? "#fff" : "#9ca3af",
                  boxShadow:
                    role === "user"
                      ? "0 2px 8px rgba(255,107,53,0.35)"
                      : "none",
                }}
              >
                👤 User
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
                style={{
                  flex: 1,
                  padding: "10px 0",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  transition: "all 0.25s ease",
                  background:
                    role === "admin"
                      ? "var(--primary, #ff6b35)"
                      : "transparent",
                  color: role === "admin" ? "#fff" : "#9ca3af",
                  boxShadow:
                    role === "admin"
                      ? "0 2px 8px rgba(255,107,53,0.35)"
                      : "none",
                }}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

          {role === "user" ? (
            /* ---- User Login Form ---- */
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="bg-red-500 text-white text-sm p-3 rounded-md border border-red-400">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="email"
                  >
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
                  <label
                    className="text-sm font-medium text-white"
                    htmlFor="password"
                  >
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
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                >
                  Sign In
                </Button>

                <div className="text-center text-sm text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary hover:text-primary-hover underline"
                  >
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            /* ---- Admin Redirect Panel ---- */
            <div style={{ padding: "16px 24px 28px" }}>
              <div
                style={{
                  background: "#1f2937",
                  borderRadius: 12,
                  padding: "28px 24px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "rgba(255,107,53,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <Shield size={28} color="var(--primary, #ff6b35)" />
                </div>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: 17,
                    fontWeight: 700,
                    marginBottom: 8,
                  }}
                >
                  Admin Dashboard
                </h3>
                <p
                  style={{
                    color: "#9ca3af",
                    fontSize: 13,
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}
                >
                  You will be redirected to the secure admin login page to
                  authenticate with your admin credentials.
                </p>
                <Button
                  type="button"
                  className="w-full bg-primary hover:bg-primary-hover text-white"
                  onClick={goToAdminLogin}
                  style={{
                    padding: "12px 20px",
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Go to Admin Login →
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
};

export default Login;
