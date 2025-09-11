import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Login failed');
      }
      const data = await res.json();
      const user = data.user || data; // support either {user: {...}} or {...}
      if (!user || !user.role) {
        throw new Error('Invalid response from server');
      }
      localStorage.setItem('user', JSON.stringify(user));
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (user.role === 'receiver') {
        navigate('/receiver-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            Welcome back to MealBridge
          </h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account</p>
        </div>

        <div>
          <div className="border border-border shadow-card rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Sign In</h3>
            </div>
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  />
                </div>
                
                {error && (
                  <div className="text-destructive text-sm">{error}</div>
                )}
                
                <button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  Sign In
                </button>
              </form>
              
              <div className="mt-4 text-center">
                <span className="text-sm text-muted-foreground">Don't have an account? </span>
                <Link to="/register" className="text-primary hover:underline text-sm font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;