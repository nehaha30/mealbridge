import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  // Demo users for quick access
  const demoUsers = [
    { name: "Mario's Italian Restaurant", email: "mario@restaurant.com", password: "demo123", role: "donor" },
    { name: "Green Garden Cafe", email: "info@greengarden.com", password: "demo123", role: "donor" },
    { name: "Community Food Bank", email: "contact@foodbank.org", password: "demo123", role: "receiver" },
    { name: "John Smith", email: "john.smith@email.com", password: "demo123", role: "receiver" }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Check demo users first
    const demoUser = demoUsers.find(user => 
      user.email === formData.email && user.password === formData.password
    );

    if (demoUser) {
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // After login, user can click through to dashboards
      return;
    }

    // For now, just do basic validation since this is a demo
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setError("Invalid credentials. Try one of the demo accounts.");
  };

  const handleDemoLogin = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">
            Welcome back to MealBridge
          </h2>
          <p className="mt-2 text-muted-foreground">Sign in to your account or try demo accounts</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Login Form */}
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

          {/* Demo Accounts */}
          <div className="border border-border shadow-card rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-foreground">Try Demo Accounts</h3>
              <p className="text-sm text-muted-foreground mt-1">Click any account to login instantly</p>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-primary">Donor Accounts</h4>
                {demoUsers.filter(user => user.role === 'donor').map((user, index) => (
                  <Link
                    key={index}
                    to="/donor-dashboard"
                    onClick={() => handleDemoLogin(user)}
                    className="block w-full text-left border border-input hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-secondary">Receiver Accounts</h4>
                {demoUsers.filter(user => user.role === 'receiver').map((user, index) => (
                  <Link
                    key={index}
                    to="/receiver-dashboard"
                    onClick={() => handleDemoLogin(user)}
                    className="block w-full text-left border border-input hover:bg-accent hover:text-accent-foreground px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;